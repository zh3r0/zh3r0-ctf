var doshell_obj = {
    files: [],
    dos_lines: [],
    dos_text: [],
    NO_LINES: 16,
    MAX_CHARS: 50,
    USR_PREFIX: '>: ',
    buffer: '',
    CURSOR_CONST: '|',
    CURSOR_INTERVAL: 400,
    error_functions: {
        args_count: function(command_name) {
            doshell_obj.push_lines("incorrect number of arguments for '" + command_name.toUpperCase() + "'");
        },
        not_number: function(str) {
            doshell_obj.push_lines("'" + str.toUpperCase() + "' is not a number");
        },
        custom: function(str) {
            doshell_obj.push_lines(str);
        }
    },
    command_functions: {
        help: function(args) {
            if(args.length == 1)
                doshell_obj.push_lines(doshell_obj.HELP_MSG);
            else
                doshell_obj.error_functions.args_count(args[0]);
        },
        flag: function(args) {
            if(args.length == 1) {
                doshell_obj.push_lines(doshell_obj.SOLUT_MSG);
                window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ",'_blank');
            }
            else
                doshell_obj.error_functions.args_count(args[0]);
        },
        man: function(args) {
            if(args.length != 1)
                doshell_obj.error_functions.args_count(args[0]);
            else {
                doshell_obj.push_lines(doshell_obj.MAN_MSG);
                window.open("https://del.dog/asm-hell.txt",'_blank');
            }
        },
        progr: function(args) {
            if(args.length == 1)
                doshell_obj.push_lines(score_obj.get_progress());
            else
                doshell_obj.error_functions.args_count(args[0]);
        },
        start: function(args) {
            if(args.length != 2)
                doshell_obj.error_functions.args_count(args[0]);
            else if(!args[1].match(/^[0-9]+$/))
                doshell_obj.error_functions.not_number(args[1]);
            else if(parseInt(args[1]) < 0 || parseInt(args[1]) >= levels_obj.levels.length) // 1..N
                doshell_obj.error_functions.custom("'" + args[1] + "' should be between 0 and " + (levels_obj.levels.length-1));
            else if(!score_obj.levels[args[1]].unlocked)
                doshell_obj.error_functions.custom("level " + args[1] + " hasn't been unlocked yet");
            else {
                game.state.start('game_scene');
                game_scene_obj.cur_level = parseInt(args[1]);
                doshell_obj.cursor_timer.stop(false);
            }
        }
    },
    HELP_MSG: 'You\'re trapped 13 layers deep in hell. You have to master\n' +
    'assembly in order to get out alive. \n' +
    'Welcome to Shell, version 5.9.12 (x13_37-torus) \n'+
    'available commands: \n'+
    '- HELP    (show this help) \n'+
    '- START n (start level n; first level is 0) \n'+
    '- PROGR   (show game progress and available levels)\n'+
    '- MAN     (manual; redundant,\n'+
    '           as everything is explained in-game)',
    SOLUT_MSG: 'In ASM culture, this is considered cheating',

    MAN_MSG: 'https://del.dog/asm-hell.txt',
};


doshell_obj.create = function() {
    this.dos_text = [];
    this.dos_lines = [];
    for(let i = 0; i < this.NO_LINES; i++) {
        this.dos_text.push(factory_obj.create_text(game, 20, 10+30*i, '', STYLES.dos_text));
        this.dos_lines.push('');
    }
    this.push_lines(doshell_obj.HELP_MSG + '\n\n' + doshell_obj.USR_PREFIX);

    game.input.keyboard.onPressCallback = function(key, ev) {
        doshell_obj.hide_cursor();
        doshell_obj.cursor_timer.stop(false);
        doshell_obj.cursor_timer.start();
        if (key.match(/^[A-Za-z0-9/ ]+$/)) {
            doshell_obj.push_key(key.toUpperCase());
        }else if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
            doshell_obj.process(doshell_obj.buffer.toLowerCase()); // "Any -> Upper -> Lower" is bad, but what the heck, right
            doshell_obj.push_lines(doshell_obj.USR_PREFIX)
            doshell_obj.buffer = '';
        }
    };
    doshell_obj.backspace_key = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
    game.input.keyboard.onDownCallback = function(ev) {
        // CRIT TODO: should be fixed, check it to be sure
        if(ev.key == 'Backspace' && doshell_obj.backspace_key.justPressed()) {
            doshell_obj.hide_cursor();
            doshell_obj.cursor_timer.stop(false);
            doshell_obj.cursor_timer.start();
            doshell_obj.pop_key();
        }
    }

    this.cursor_timer = game.time.create(false);
    this.cursor_timer.loop(this.CURSOR_INTERVAL, this.switch_cursor, this);
    this.cursor_timer.start();
}

doshell_obj.hide_cursor = function() {
    if(doshell_obj.buffer[doshell_obj.buffer.length-1] == doshell_obj.CURSOR_CONST) {
        doshell_obj.buffer = doshell_obj.buffer.slice(0, -1);
        doshell_obj.redraw_buffer();
    }
}

doshell_obj.switch_cursor = function() {
    if(doshell_obj.buffer[doshell_obj.buffer.length-1] == doshell_obj.CURSOR_CONST)
        doshell_obj.buffer = doshell_obj.buffer.slice(0, -1);
    else
        doshell_obj.buffer += doshell_obj.CURSOR_CONST;
    doshell_obj.redraw_buffer();
}

doshell_obj.process = function(command) {
    let parts = command.split(' ');
    // strip whitespace
    let rem = [];
    for(let i in parts) {
        if(parts[i] != '')
            rem.push(parts[i]);
    }
    // nothing except whitespace
    if(rem.length == 0)
        return;
    // check command exists
    if(!this.command_functions.hasOwnProperty(rem[0])) {
        this.push_lines("command '" + rem[0].toUpperCase() + "' not found");
        return;
    }
    // call command
    (this.command_functions[rem[0]])(rem);
}

doshell_obj.push_lines = function(text) {
    let text_lns = text.split('\n');
    for(let i in text_lns) {
        this.dos_lines.push(text_lns[i]);
        this.dos_lines.shift();
    }
    this.redraw();
}

doshell_obj.push_key = function(key) {
    if(this.buffer.length <= this.MAX_CHARS) {
        this.buffer += key;
        this.redraw_buffer();
    } else {
        // TODO: beep
    }
}

doshell_obj.pop_key = function(key) {
    if(this.buffer.length > 0) {
        this.buffer = this.buffer.slice(0, -1);
        this.redraw_buffer();
    } else {
        beep(0);
    }
}

doshell_obj.redraw_buffer = function() {
    doshell_obj.dos_lines[doshell_obj.NO_LINES - 1] = doshell_obj.USR_PREFIX + doshell_obj.buffer;
    doshell_obj.dos_text[doshell_obj.NO_LINES - 1].text = doshell_obj.USR_PREFIX + doshell_obj.buffer;
}

doshell_obj.redraw = function(text) {
    for(let i = 0; i < this.NO_LINES; i++) {
        this.dos_text[i].text = this.dos_lines[i];
    }
}
