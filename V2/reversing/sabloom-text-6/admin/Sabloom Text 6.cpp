// Sabloom Text 6.cpp : Defines the entry point for the application.
//

#include "framework.h"
#include "Sabloom Text 6.h"

int APIENTRY wWinMain(_In_ HINSTANCE hInstance,
                     _In_opt_ HINSTANCE hPrevInstance,
                     _In_ LPWSTR    lpCmdLine,
                     _In_ int       nCmdShow)
{
    UNREFERENCED_PARAMETER(hPrevInstance);
    UNREFERENCED_PARAMETER(lpCmdLine);
	
	
	BOOL isDebugger = false;

	__asm {
		xor eax, eax;
		mov	eax, fs: [0x30] ;
		mov eax, [eax + 2];
		and eax, 0xff;
		mov isDebugger, eax;
	};

	if (isDebugger) {
		return -1;
	}
	
	


    // Initialize global strings
    LoadStringW(hInstance, IDS_APP_TITLE, szTitle, MAX_LOADSTRING);
    LoadStringW(hInstance, IDC_SABLOOMTEXT6, szWindowClass, MAX_LOADSTRING);
    MyRegisterClass(hInstance);

    // Perform application initialization:
    if (!InitInstance (hInstance, nCmdShow))
    {
        return FALSE;
    }

    //HACCEL hAccelTable = LoadAccelerators(hInstance, MAKEINTRESOURCE(IDC_SABLOOMTEXT6));

    MSG msg;

    // Main message loop:
    while (GetMessage(&msg, nullptr, 0, 0))
    {
        //if (!TranslateAccelerator(msg.hwnd, 0, &msg))
        //{
        TranslateMessage(&msg);
        DispatchMessage(&msg);
        //}
    }

    return (int) msg.wParam;
}


//
//  FUNCTION: MyRegisterClass()
//
//  PURPOSE: Registers the window class.
//
ATOM MyRegisterClass(HINSTANCE hInstance)
{
    WNDCLASSEXW wcex;

    wcex.cbSize = sizeof(WNDCLASSEX);

    wcex.style          = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc    = WndProc;
    wcex.cbClsExtra     = 0;
    wcex.cbWndExtra     = 0;
    wcex.hInstance      = hInstance;
    wcex.hIcon          = LoadIcon(hInstance, MAKEINTRESOURCE(IDI_SABLOOMTEXT6));
    wcex.hCursor        = LoadCursor(nullptr, IDC_ARROW);
    wcex.hbrBackground  = (HBRUSH)(COLOR_WINDOW+1);
    wcex.lpszMenuName   = MAKEINTRESOURCEW(IDC_SABLOOMTEXT6);
    wcex.lpszClassName  = szWindowClass;
    wcex.hIconSm        = LoadIcon(wcex.hInstance, MAKEINTRESOURCE(IDI_SMALL));

    return RegisterClassExW(&wcex);
}

//
//   FUNCTION: InitInstance(HINSTANCE, int)
//
//   PURPOSE: Saves instance handle and creates main window
//
//   COMMENTS:
//
//        In this function, we save the instance handle in a global variable and
//        create and display the main program window.
//
BOOL InitInstance(HINSTANCE hInstance, int nCmdShow)
{
   hInst = hInstance; // Store instance handle in our global variable

   hWnd = CreateWindowW(szWindowClass, szTitle, WS_OVERLAPPEDWINDOW,
      CW_USEDEFAULT, CW_USEDEFAULT, 640, 480, nullptr, nullptr, hInstance, nullptr);

   if (!hWnd)
   {
      return FALSE;
   }

   ShowWindow(hWnd, nCmdShow);
   UpdateWindow(hWnd);

   return TRUE;
}

//
//  FUNCTION: WndProc(HWND, UINT, WPARAM, LPARAM)
//
//  PURPOSE: Processes messages for the main window.
//
//  WM_COMMAND  - process the application menu
//  WM_PAINT    - Paint the main window
//  WM_DESTROY  - post a quit message and return
//
//
LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{

    switch (message)
	{
	case WM_CREATE:
		{	

			if (isRegistered()) {
				SetWindowTextA(hWnd, "Sabloom Text 6 - X3eRo0");
			}
			else {
				SetWindowTextA(hWnd, "Sabloom Text 6 - [UNREGISTERED]");
			}
			
			SetMenu(hWnd, LoadMenu(hInst, MAKEINTRESOURCE(IDR_MENU1)));

			hEdit = CreateWindowEx(WS_EX_CLIENTEDGE,
				_TEXT("EDIT"),
				_TEXT(""),
				WS_CHILD | WS_VISIBLE | WS_VSCROLL | WS_HSCROLL | ES_MULTILINE | ES_AUTOHSCROLL | ES_AUTOVSCROLL,
				1,
				1,
				625,
				420,
				hWnd,
				(HMENU)IDC_EDIT,
				GetModuleHandle(NULL),
				nullptr
			);

			if (hEdit != NULL) {
				HFONT hFont = CreateFontA(16, 0, 0, 0, 600, 0, 0, 0, ANSI_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, DEFAULT_QUALITY, FIXED_PITCH, "Consolas");
				SendMessage(hEdit, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(FALSE, 0));
			}
			else {
				MessageBox(hWnd, _TEXT("Could Not Create Edit Control"), _TEXT("ERROR"), MB_OK | MB_ICONERROR);
				PostQuitMessage(0);
			}

			SetFocus(hEdit);

		}
		break;
	case WM_SIZE:
		{
			RECT rc;
			GetClientRect(hWnd, &rc);
			SetWindowPos(hEdit, NULL, 0, 0, rc.right, rc.bottom, SWP_NOZORDER);
		}
		break;
    case WM_COMMAND:
        {
            int wmId = LOWORD(wParam);
            // Parse the menu selections:
            switch (wmId)
            {
			case ID_FILE_NEW:
			{
				checkSave();
				FileOpened = false;
				FileSaved  = false;
				SetWindowTextA(hEdit, "");
				if(isRegistered())
					SetWindowTextA(hWnd, "Sabloom Text 6 - X3eRo0");
				else {
					SetWindowTextA(hWnd, "Sabloom Text 6 - [UNREGISTERED]");
				}
				break;
			}
			case ID_FILE_OPEN:
				checkSave();
				OpenFile();
				break;
			case ID_FILE_SAVE:
			{
				if (FileSaved) {
					if (FileOpened) {
						SaveFile();
					}
					else if (GetFileNameForSave()) {
						SaveFile();
					}
				}
				break;
			}
			case ID_FILE_SAVEAS:
			{
				if (GetFileNameForSave()) {
					SaveFile();
				}
				break;
			}
			case ID_EDIT_CUT:
				SendMessage(hEdit, WM_CUT, 0, 0);
				break;
			case ID_EDIT_COPY:
				SendMessage(hEdit, WM_COPY, 0, 0);
				break;
			case ID_EDIT_PASTE:
				SendMessage(hEdit, WM_PASTE, 0, 0);
				break;
			case ID_FORMAT_FONT:
				FontEditor();
				break;
			case ID_HELP_REGISTER:
				if (!isRegistered()) {
					DialogBox(hInst, MAKEINTRESOURCE(IDD_DIALOG1), hWnd, RegistrationDLG);
				}
				else {
					MessageBoxA(hWnd, "Product Already Registered", "Sabloom Text 6", MB_OK);
				}
				break;
			case ID_HELP_ABOUT:
                DialogBox(hInst, MAKEINTRESOURCE(IDD_ABOUTBOX), hWnd, About);
                break;
            case ID_FILE_EXIT:
				PostMessage(hWnd, WM_CLOSE, 0, 0);
                break;
			case IDC_EDIT:
				switch (HIWORD(wParam)) {
				case EN_CHANGE:
					FileSaved = true;
					break;
				}
				break;
            default:
                return DefWindowProc(hWnd, message, wParam, lParam);
            }
        }
        break;
    case WM_PAINT:
        {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hWnd, &ps);
            // TODO: Add any drawing code that uses hdc here...
            EndPaint(hWnd, &ps);
        }
        break;
	case WM_CTLCOLOREDIT:
		{

			HDC hdc = (HDC)wParam;
			HWND hwnd = (HWND)lParam;
			SetBkColor(hdc, bg);
			SetDCBrushColor(hdc, bg);
			SetTextColor(hdc, fg);
			return (LRESULT)GetStockObject(DC_BRUSH);
		
		}
	case WM_CLOSE:
		if (FileSaved) {
			int res = MessageBoxA(hWnd, "The File has been changed!\nDo you want to save it before continuing?", "Save File before continuing!!", MB_YESNOCANCEL | MB_ICONINFORMATION);
			if (res == IDCANCEL) return 0;
			if (res == IDYES) {
				if (GetFileNameForSave()) {
					SaveFile();
				}
			}
			if (MessageBoxA(hWnd, "Are you sure you want to exit", "Exit?", MB_YESNO | MB_ICONQUESTION) == IDNO) {
				return 0;
			}
			PostQuitMessage(0);

		}
    case WM_DESTROY:
		DestroyWindow(hWnd);
        PostQuitMessage(0);
        break;
    default:
        return DefWindowProc(hWnd, message, wParam, lParam);
    }
    return 0;
}

// Message handler for about box.
INT_PTR CALLBACK About(HWND hDlg, UINT message, WPARAM wParam, LPARAM lParam)
{
    UNREFERENCED_PARAMETER(lParam);
    switch (message)
    {
    case WM_INITDIALOG:
        return (INT_PTR)TRUE;

    case WM_COMMAND:
        if (LOWORD(wParam) == IDOK || LOWORD(wParam) == IDCANCEL)
        {
            EndDialog(hDlg, LOWORD(wParam));
            return (INT_PTR)TRUE;
        }
        break;
    }
    return (INT_PTR)FALSE;
}

void OpenFile() {

	ZeroMemory(&ofn, sizeof(ofn));
	ofn.lStructSize = sizeof(ofn);
	ofn.hwndOwner = hWnd;
	ofn.lpstrFile = (LPWSTR)szFile;
	ofn.lpstrFile[0] = '\0';
	ofn.nMaxFile = sizeof(szFile);
	ofn.lpstrFilter = _T("All\0*.*\0Text\0*.TXT\0");
	ofn.nFilterIndex = 1;
	ofn.lpstrFileTitle = NULL;
	ofn.nMaxFileTitle = 0;
	ofn.lpstrInitialDir = NULL;
	ofn.Flags = OFN_PATHMUSTEXIST | OFN_FILEMUSTEXIST;


	if (!GetOpenFileName(&ofn)) {
		return;
	}
		
	HANDLE hFile = CreateFile(ofn.lpstrFile, GENERIC_READ,	0, (LPSECURITY_ATTRIBUTES)NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, (HANDLE)NULL);
	if (hFile != INVALID_HANDLE_VALUE) {
	
		size_t fsize = GetFileSize(hFile, NULL);
		char * data = (char*)GlobalAlloc(GPTR, fsize + 1);
		
		if (data != NULL) {
		
			DWORD dwRead;
			
			if (ReadFile(hFile, data, fsize, &dwRead, NULL)) {
				data[fsize] = '\x00';
			
				if (!SetWindowTextA(hEdit, data)) {
					MessageBoxA(hWnd, "The File could not be loaded", "Error", MB_OK | MB_ICONERROR);
				}
			}
			else {
				MessageBoxA(hWnd, "ReadFile Failed", "Error", MB_OK | MB_ICONERROR);
			}
			GlobalFree(data);
		}
		else {
			MessageBoxA(hWnd, "Mem Alloc Failed", "Error", MB_OK | MB_ICONERROR);
		}
		CloseHandle(hFile);
	}
	else {
		MessageBoxA(hWnd, "bad handle value", "Error", MB_OK | MB_ICONERROR);
	}


	FileSaved  = false;
	FileOpened = true;

	return;
}

void SaveFile() {
	HANDLE hFile = CreateFileA(szFile, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);

	if (hFile != INVALID_HANDLE_VALUE) {
		DWORD TXLen = GetWindowTextLength(hEdit) + 1;
		char* Text = (char *)GlobalAlloc(GPTR, TXLen);

		if (Text != NULL) {
			if (GetWindowTextA(hEdit, Text, TXLen + 1)) {
				DWORD written;
				if (!WriteFile(hFile, Text, TXLen, &written, NULL)) {
					MessageBoxA(hWnd, "Could Not Save File", "ERROR", MB_OK | MB_ICONERROR);
				}
			}
			else {
				MessageBoxA(hWnd, "Could Not Fetch Text from Edit Control", "ERROR", MB_OK | MB_ICONERROR);
			}
		}
		else {
			MessageBoxA(hWnd, "Global Alloc Failed", "ERROR", MB_OK | MB_ICONERROR);
		}
		GlobalFree(Text);

	}
	else {
		MessageBoxA(hWnd, "File Cannot Be Created", "ERROR", MB_OK | MB_ICONERROR);
	}
	CloseHandle(hFile);

	FileOpened = true;
	FileSaved = false;

	return;

}

bool GetFileNameForSave() {

	OPENFILENAMEA ofn;
	ZeroMemory(&ofn, sizeof(OPENFILENAMEA));
	ofn.lStructSize = sizeof(OPENFILENAMEA);
	ofn.hwndOwner = hWnd;
	ofn.lpstrFilter = "Text Files(*.txt)\0*.txt\0All File(*.*)\0*.*\0";
	ofn.lpstrFile = szFile;
	ofn.nMaxFile = MAX_PATH;
	ofn.Flags = OFN_EXPLORER | OFN_PATHMUSTEXIST | OFN_HIDEREADONLY | OFN_OVERWRITEPROMPT;
	ofn.lpstrDefExt = "txt";
	if (!GetSaveFileNameA(&ofn))
		return false;
	return true;

}

void checkSave() {

	if (FileSaved) {
		int res = MessageBoxA(hWnd, "The File has been changed!\nDo you want to save it before continuing?", "Save File before continuing!!", MB_YESNOCANCEL | MB_ICONINFORMATION);
		if (res == IDCANCEL || res == IDNO) return;
		if (GetFileNameForSave()) {
			SaveFile();
		}
	}
	return;
}

void FontEditor() {
	CHOOSEFONT cf = { sizeof(CHOOSEFONT) };
	LOGFONT    lf;
	GetObject(hWnd, sizeof(LOGFONT), &lf);
	cf.Flags = CF_EFFECTS | CF_SCREENFONTS | CF_INITTOLOGFONTSTRUCT;
	cf.hwndOwner = hWnd;
	cf.lpLogFont = &lf;
	cf.rgbColors = bg;
	if (!ChooseFont(&cf)) {
		return;
	}

	HFONT hFont = CreateFontIndirect(&lf);
	if (hFont) {
		SendMessage(hEdit, WM_SETFONT, (WPARAM)hFont, TRUE);
	}

}

bool isRegistered() {
	return isPurchased;
}

INT_PTR CALLBACK RegistrationDLG(HWND hDlg, UINT message, WPARAM wParam, LPARAM lParam)
{

	char USERNAME[101]{0};
	char SERIAL[101]{0};

	HBRUSH hOrange = CreateSolidBrush(RGB(0xba, 0x68, 0xc8));
	HBRUSH hWhite = CreateSolidBrush(RGB(0xe8, 0xea, 0xf6));
	HBRUSH hBlack = CreateSolidBrush(RGB(0x21, 0x21, 0x21));

	UNREFERENCED_PARAMETER(lParam);
	switch (message)
	{
	case WM_INITDIALOG:
		return (INT_PTR)TRUE;

	case WM_CTLCOLORSTATIC: {

		SetTextColor((HDC)wParam, RGB(0xff, 0xff, 0xff));
		SetBkMode((HDC)wParam, TRANSPARENT);
		return (INT_PTR)(hBlack);
	}

	case WM_ERASEBKGND:
		RECT rect;
		SelectObject((HDC)wParam, hBlack);
		GetClientRect(hWnd, &rect);
		Rectangle((HDC)wParam, rect.left, rect.top, rect.right, rect.bottom);
		SetBkMode((HDC)wParam, TRANSPARENT);
		return TRUE;

	case WM_COMMAND:
		if (LOWORD(wParam) == IDOK)
		{
			GetDlgItemTextA(hDlg, IDC_EDIT1, USERNAME, 100);
			GetDlgItemTextA(hDlg, IDC_EDIT2, SERIAL, 100);
			if (check(USERNAME, SERIAL)) {
				isPurchased = true;
				MessageBoxA(hDlg, "Product Registered", "Sabloom Text 6 - Registered", MB_OK);
				SetWindowTextA(hWnd, "Sabloom Text 6 - X3eRo0");
			}
			else {
				isPurchased = false;
				MessageBoxA(hDlg, "Please visit https://x3ero0.github.io/posts/sabloom-license/ after the competition ends to Purchase License", "Invalid Serial", MB_OK | MB_ICONERROR);
			}
			EndDialog(hDlg, 0);
			return (INT_PTR)TRUE;
		}

		if (LOWORD(wParam) == IDCANCEL) {
			EndDialog(hDlg, 0);
			return (INT_PTR)TRUE;
		}

		break;
	}
	return (INT_PTR)FALSE;
}

void xor_bytes(const unsigned char* src, unsigned char* key, unsigned char* dst) {

	size_t len_key = strlen((const char *)key);

	for (int i = 0; i < 54; i++) {
		dst[i] = src[i] ^ key[i % len_key];
	}
	return;
}

void byte2bits(const unsigned char* bytes, bool* bits, int byte_len) {

	memset(bits, 0, byte_len * 8);
	int bit_counter = 0;
	for (int i = 0; i < (byte_len); i++) {
		int bit_c = 0;
		for (int j = 0; j < 8; j++) {
			bits[bit_counter] = ((bytes[i] >> (7 - j)) & 1) != 0;
			bit_counter++;
		}
	}

	return;
}

int expand_maze(const unsigned char* maze, char* expanded_maze) {

	if (maze == NULL || expanded_maze == NULL) {
		return -1;
	}

	for (int lines = 0; lines < 65; lines++) {
		int bitcounter = 0;

		for (int bytes = 0; bytes < 8; bytes++) {
			char byte = maze[(lines * 9) + bytes];

			for (int bit = 7; bit > -1; bit--) {
				expanded_maze[(lines * 65) + bitcounter] = (char)((byte >> bit) & 1);
				bitcounter++;
			}
		}
	}
	expanded_maze[63 * 65 + 63] = 0x33;
	return 0;

}

int solve(unsigned char* maze, unsigned char* solution, size_t maze_h, size_t maze_w, size_t sol_len) {

	int           bit_ptr = 0;
	int           dir = 0;
	bool          cur_bit = 0;
	bool          nex_bit = 0;
	bool *        bits    = (bool*)malloc(8 * sol_len * sizeof(bool));
	int           direction[4] = { 0, 1, 2, 3 };
	int           x = 1, y = 1;

	byte2bits(solution, bits, sol_len);
	
	BOOL found = adbg_RDTSC();

	while (bit_ptr != (sol_len * 8)) {

		cur_bit = bits[bit_ptr];
		nex_bit = bits[bit_ptr + 1];


		if (cur_bit == 1) {
			bit_ptr++;
			if (nex_bit == 1) {
				dir = (dir + 1) % 4;
			}
			else {
				dir = (dir - 1) % 4;
				if (dir < 0) {
					dir = 4 + dir;
				}
			}
		}

		bit_ptr++;
		switch (dir) {
		case 0:
		{
			if ((maze[(y) * 65 + (x + 2)] != '\x00') && (maze[y * 65 + (x + 1)] != '\x00')) {
				x += 2;
			}
			break;
		}
		case 1:
		{
			if ((maze[((y + 2) * 65) + x] != '\x00') && (maze[((y + 1) * 65) + x] != '\x00')) {
				y += 2;
			}
			break;
		}
		case 2:
		{
			if ((maze[(y * 65) + (x - 2)] != '\x00') && (maze[(y * 65) + (x - 1)] != '\x00')) {
				x -= 2;
			}
			break;
		}
		case 3:
		{
			if ((maze[((y - 2) * 65) + x] != '\x00') && (maze[((y - 1) * 65) + x] != '\x00')) {
				y -= 2;
			}
			break;
		}
		}
	}

	free(bits);
	bits = NULL;
	
	BOOL found2;

	_asm
	{
		xor eax, eax;
		mov eax, fs: [0x30] ;
		mov eax, [eax + 0x68];
		and eax, 0x00000070;
		mov found2, eax;
	}

	if (found || found2) {
		return -1;
	}

	if (maze[y * 65 + x] == 0x33) {
		return 0;
	}
	return -1;
}


bool check(char* username, char* serial) {

	bool correct = false;

	if (strlen(username) != 6) {
		return false;
	}

	char* solution = (char*)malloc(55 * sizeof(char));
	char* expanded_maze = (char*)malloc(65 * 65 * sizeof(char));
	
	if (solution == NULL || expanded_maze == NULL) {
		return false;
	}

	memset(solution, 0, 55);
	memset(expanded_maze, 0, 65 * 65);
	
	xor_bytes(encrypted, (unsigned char *)serial, (unsigned char*)solution);

	if (!expand_maze(maze, expanded_maze)) {
		correct = false;
	}


	if (solve((unsigned char*)expanded_maze, (unsigned char*)solution, 65, 65, 54) == 0) {
		correct = true;
	}

	if (username[0] != 'X') {
		correct = false;
	}
	if (username[1] != serial[2]) {
		correct = false;
	}
	if (username[2] != serial[9]) {
		correct = false;
	}
	if (username[3] != serial[14]) {
		correct = false;
	}
	if (username[4] != 'o') {
		correct = false;
	}
	if (username[5] != serial[4]) {
		correct = false;
	}


	free(solution);
	free(expanded_maze);

	solution = NULL;
	expanded_maze = NULL;

	return correct;
}


BOOL adbg_RDTSC(){

	BOOL found = FALSE;

	UINT64 timeA, timeB = 0;
	int timeUpperA, timeLowerA = 0;
	int timeUpperB, timeLowerB = 0;

	_asm
	{
		// rdtsc stores result across EDX:EAX
		rdtsc;
		mov timeUpperA, edx;
		mov timeLowerA, eax;

		// Junk code to entice stepping through or a breakpoint
		xor eax, eax ;
		mov eax, 0x17;
		xor eax, 0x50;
		mov eax, 0x35;
		xor eax, 0x50;
		mov eax, 0x24;
		xor eax, 0x50;
		mov eax, 0x70;
		xor eax, 0x50;
		mov eax, 0x02;
		xor eax, 0x50;
		mov eax, 0x35;
		xor eax, 0x50;
		mov eax, 0x3B;
		xor eax, 0x50;
		mov eax, 0x14;
		xor eax, 0x50;
		mov eax, 0x7C;
		xor eax, 0x50;
		mov eax, 0x70;
		xor eax, 0x50;
		mov eax, 0x09;
		xor eax, 0x50;
		mov eax, 0x60;
		xor eax, 0x50;
		mov eax, 0x05;
		xor eax, 0x50;
		mov eax, 0x70;
		xor eax, 0x50;
		mov eax, 0x03;
		xor eax, 0x50;
		mov eax, 0x35;
		xor eax, 0x50;
		mov eax, 0x22;
		xor eax, 0x50;
		mov eax, 0x39;
		xor eax, 0x50;
		mov eax, 0x25;
		xor eax, 0x50;
		mov eax, 0x23;
		xor eax, 0x50;
		mov eax, 0x3C;
		xor eax, 0x50;
		mov eax, 0x29;
		xor eax, 0x50;
		mov eax, 0x70;
		xor eax, 0x50;
		mov eax, 0x04;
		xor eax, 0x50;
		mov eax, 0x38;
		xor eax, 0x50;
		mov eax, 0x39;
		xor eax, 0x50;
		mov eax, 0x3E;
		xor eax, 0x50;
		mov eax, 0x3B;
		xor eax, 0x50;
		mov eax, 0x70;
		xor eax, 0x50;
		mov eax, 0x16;
		xor eax, 0x50;
		mov eax, 0x3C;
		xor eax, 0x50;
		mov eax, 0x31;
		xor eax, 0x50;
		mov eax, 0x37;
		xor eax, 0x50;
		mov eax, 0x70;
		xor eax, 0x50;
		mov eax, 0x27;
		xor eax, 0x50;
		mov eax, 0x39;
		xor eax, 0x50;
		mov eax, 0x3C;
		xor eax, 0x50;
		mov eax, 0x3C;
		xor eax, 0x50;
		mov eax, 0x70;
		xor eax, 0x50;
		mov eax, 0x32;
		xor eax, 0x50;
		mov eax, 0x35;
		xor eax, 0x50;
		mov eax, 0x70;
		xor eax, 0x50;
		mov eax, 0x38;
		xor eax, 0x50;
		mov eax, 0x35;
		xor eax, 0x50;
		mov eax, 0x22;
		xor eax, 0x50;
		mov eax, 0x35;
		xor eax, 0x50;
		mov eax, 0x6F;
		xor eax, 0x50;

		rdtsc;
		mov timeUpperB, edx;
		mov timeLowerB, eax;
	}

	timeA = timeUpperA;
	timeA = (timeA << 32) | timeLowerA;

	timeB = timeUpperB;
	timeB = (timeB << 32) | timeLowerB;

	/* 0x10000 is purely empirical and is based on the computer's clock cycle
	   This value should be change depending on the length and complexity of
	   code between each RDTSC operation. */
	if (timeB - timeA > 0x10000)
	{
		found = TRUE;
	}
	
	return found;
}