#include <ncurses.h>
#include <sys/ioctl.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <stdbool.h>
#include <unistd.h>
#include <time.h>

unsigned  char encoded_flag[32] = {
    "\xa4\xad\xc0\xa3\xfd\x7f\xab\x00\xe8\xd5\xe2\x48\xda\xbf\xfd\x00\xd1\x40\xf2\xc4\x7b\xbf\x76\x00\x87\x07\xd5\xad\xae\x82\xfd\x00"
};

typedef uint8_t  u8;
typedef uint16_t u16;
typedef uint32_t u32;
typedef uint64_t u64;

#define DELAY 100990

const char greetings[11][100] = {
	"Welcome to X3eRo0's Crackme ",
	"Are you really Trying hard? :P ",
	"lol you are so slow. ",
	"go learn some hacking. ",
	"Seriously? ",
	"Yes, I know what year it is. ",
	"NO. ",
	"You still here? LOL ",
	"Are you on Drugs? ",
	"i did not used -O3 ",
	"Using angr for a babyre? ",
};


void 	check_win(WINDOW *, int, int , char *);
void 	animate();
u64 check_passwd(char *);


void check_win(WINDOW *Wnd, int Row, int Col, char * Pswd){
	
	wattron(Wnd, A_BLINK);
	
	if(!check_passwd(Pswd)){
		
		wattron(Wnd,COLOR_PAIR(1));
		mvwprintw(Wnd, Row, Col + 2, " CORRECT PASSWORD ");
		wattroff(Wnd, COLOR_PAIR(1));

	} else {

		wattron(Wnd ,COLOR_PAIR(4));
		mvwprintw(Wnd , Row, Col + 2, "INCORRECT PASSWORD");
		wattroff(Wnd, COLOR_PAIR(4));

	}

	return;
}

u64 __attribute__ ((noinline)) encode(char *block){

    u8 bytes[8];
    memset(bytes, 0, sizeof(bytes));
    for (u32 i = 0; i < 8; i++){
        u8 x = block[i];
        for (u32 j = 0; j < 8; j++){
            bytes[j] |= (x & 1) << i;
            x >>= 1;
        }
    }

    return (*(u64 *) &bytes);
}


u64 check_passwd(char *passwd){

	u64  encoded[4];
	memset(encoded, 0, sizeof(encoded));
	
	if (strlen(passwd) != 32){
		return 1;
	}

    for (u32 i = 0, j = 0; i < 32; i += 8, j++){
        encoded[j] = (u64) encode(&passwd[i]);
    }

    return memcmp((char *)encoded, encoded_flag, sizeof(encoded_flag));
}


void animate(){



	char * greet_string_ptr = (char *) &greetings[0x00];
	int input_char = '\x00';
	int forward = 1;
	int frames = 0;
	char pass[40];
	int j = 0;
	int x = 0, y = 0;
	struct winsize w;
	ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
	int row = w.ws_row ;
	int col = w.ws_col ;

	initscr();

	curs_set(FALSE);
	
	WINDOW *stats = newwin(3, col, 0, 0);
	WINDOW *ifield = newwin(7, col, 7, 0);
	WINDOW *result = newwin(5,col,(row/2)+7,0);

	keypad(ifield,true);
	noecho();
	timeout(1);


	if (has_colors() == FALSE) {
		endwin();
		printf("Your terminal does not support color\n");
		exit(1);
	}




	start_color();

	init_pair(1, COLOR_GREEN,	COLOR_BLACK);
	init_pair(2, COLOR_CYAN,	COLOR_BLACK);
	init_pair(3, COLOR_WHITE,	COLOR_BLUE );
	init_pair(4, COLOR_RED, 	COLOR_BLACK);
	init_pair(5, COLOR_YELLOW,	COLOR_BLACK);
	init_pair(6, COLOR_BLACK, 	COLOR_WHITE);

	srand(time(0x00));

	while(1) {
		
		ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
		int row = w.ws_row ;
		int col = w.ws_col ;

	    wclear(stats);

	    wattron(stats,COLOR_PAIR(5));
	    wattron(stats,A_BOLD);


		if(x > col - strlen(greet_string_ptr)){
			forward = forward * (-1);
		}
		
		mvwprintw(stats,y, x, greet_string_ptr);
		
		usleep(DELAY);
		
		if(forward==1){
			x++;
		}else{
			x--;
		}
		while(1){
			frames++;
			ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
			row = w.ws_row;
			col = w.ws_col;
			for(int i=0; i < 40; i++){
				mvwaddch(ifield,0,(col/2)-20+i, ACS_HLINE);
				mvwaddch(ifield,6,(col/2)-20+i, ACS_HLINE);
			}
			for(int i=1; i < 6; i++){
				mvwaddch(ifield,i,(col/2)-20, ACS_VLINE);
				mvwaddch(ifield,i,(col/2)+20, ACS_VLINE);
			}
			mvwaddch(ifield,0,(col/2)-20, ACS_ULCORNER);
			mvwaddch(ifield,0,(col/2)+20, ACS_URCORNER);
			mvwaddch(ifield,6,(col/2)-20, ACS_LLCORNER);
			mvwaddch(ifield,6,(col/2)+20, ACS_LRCORNER);
			wattron(ifield,COLOR_PAIR(2));
			mvwprintw(ifield,1,(col/2)-6,"ENTER PASSWORD");
			wattroff(ifield,COLOR_PAIR(2));
			wattron(ifield,COLOR_PAIR(3));
			mvwprintw(ifield,5,(col/2)-2,"LOGIN");
			wattroff(ifield,COLOR_PAIR(3));
			input_char = getch();
			
			if((frames % col) == 0){
				greet_string_ptr = (char *) & greetings[rand() % 0xb];
			}
			wattroff(result,COLOR_PAIR(1));
			wattroff(result,COLOR_PAIR(1));
			mvwprintw(result, 5, (col/2) - 10, greet_string_ptr);

			switch(input_char){
				case  10: check_win(result, 1, (col/2)-10, pass);break;
				case 127:{
					j = (j==0 ? j=1 : j);
					j--;
					mvwaddch(ifield, 3, (col/2)-16+j, 0x20);
					wrefresh(ifield);
					break;
				}
				default :{
					if(input_char > 10 && j < 32){
						mvwaddch(ifield, 3 , (col/2) - 16 + j , input_char | A_STANDOUT );
						pass[j] = input_char;
						j++;
					}
					break;
				}
			}
			break;
		}
		pass[j]='\x00';

		wrefresh(stats);
		wrefresh(ifield);
		wrefresh(result);

	}	
	delwin(stats);
	delwin(ifield);
	delwin(result);
	endwin();
	
}

int main(int argc, char *argv[]) {
	animate();
	return 0;
}
