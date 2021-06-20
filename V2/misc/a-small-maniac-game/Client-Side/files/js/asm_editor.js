var asm_editor_obj = {
    lines: [],
    text: [],
    NO_SCREEN_LINES: 22,
    NO_LINES: 0,
    NO_CHARS: 18,
    cursor_pos_x: 0,
    cursor_pos_y: 0,
    CURSOR_CONST: '_',
    typing_locked: false,
}

asm_editor_obj.create = function() {
    if(this.NO_LINES == 0)
        this.NO_LINES = this.NO_SCREEN_LINES; 

    if(levels_obj.levels[game_scene_obj.cur_level]().max_lines != undefined)
        this.NO_LINES = levels_obj.levels[game_scene_obj.cur_level]().max_lines;
    else
        this.NO_LINES = this.NO_SCREEN_LINES;
        
    this.group = game.add.group();
    this.text = [];
    this.lines = [];
    this.cursor_pos_x = this.cursor_pos_y = 0;
    for(let i = 0; i < this.NO_LINES; i++) {
        let t = factory_obj.create_text(game, 0, 10+22*i, '  ', STYLES.asm_editor);
        let li = factory_obj.create_text(game, -15, 13+22*i, pad(i+1,2)+':', STYLES.asm_editor);
        li.scale.set(0.5, 0.35);
        this.group.add(t);
        this.group.add(li);
        this.text.push(t);
        this.lines.push(' ');
    }
    this.group.position.x = 25;
    this.group.position.y = -2;
    this.cursor_text = factory_obj.create_text(game, 12, 13, this.CURSOR_CONST, STYLES.asm_editor);
    this.group.add(this.cursor_text);

    this.cursor_timer = game.time.create(false);
    this.cursor_timer.loop(doshell_obj.CURSOR_INTERVAL, this.switch_cursor, this);
    this.cursor_timer.start();
    this.cursors = game.input.keyboard.createCursorKeys();
}

asm_editor_obj.switch_cursor = function() {
    let o = asm_editor_obj;
    if(o.cursor_text.text == o.CURSOR_CONST) {
        o.cursor_text.text = ' ';
    } else {
        o.cursor_text.text = o.CURSOR_CONST;
    }
    
}

asm_editor_obj.onPressCallback = function(key, ev) {
    if(asm_editor_obj.typing_locked) return;    
    if (key.match(/^[A-Za-z0-9/ ;?!-\[\]]+$/)) {
        let o = asm_editor_obj;
        if(o.lines[o.cursor_pos_y].length >= o.NO_CHARS) return;
        o.lines[o.cursor_pos_y] = o.lines[o.cursor_pos_y].substr(0, o.cursor_pos_x) + key.toUpperCase() + o.lines[o.cursor_pos_y].substr(o.cursor_pos_x);
        o.cursor_pos_x++;
        o.redraw_line(o.cursor_pos_y);
    }
}

asm_editor_obj.onDownCallback = function(ev) {
    // CRIT TODO: here should be justPressed check (works only beause repeat key is disabled here)
    // USE asm_editor_obj.backspace_key = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
    // AND justPressed()
    let o = asm_editor_obj;
    if(o.typing_locked) return;
    if(o.cursors.up.justDown) {
        o.try_move_cursor(0);
    } else if(o.cursors.right.justDown) {
        o.try_move_cursor(1);
    } else if(o.cursors.down.justDown) {
        o.try_move_cursor(2);
    } else if(o.cursors.left.justDown) {
        o.try_move_cursor(3);
    } else if(ev.key == 'Backspace') {
        if(o.cursor_pos_x > 0) {
            o.lines[o.cursor_pos_y] = o.lines[o.cursor_pos_y].substr(0, o.cursor_pos_x-1) + o.lines[o.cursor_pos_y].substr(o.cursor_pos_x);
            o.cursor_pos_x--;
            o.redraw();
        } else if(o.cursor_pos_y > 0 && (o.lines[o.cursor_pos_y].length + o.lines[o.cursor_pos_y-1].length) <= o.NO_CHARS +1) {
            o.cursor_pos_x = o.lines[o.cursor_pos_y-1].length-1;
            o.lines[o.cursor_pos_y-1] = o.lines[o.cursor_pos_y-1].slice(0, -1) + o.lines[o.cursor_pos_y];
            o.lines.splice(o.cursor_pos_y, 1);
            o.cursor_pos_y--;
            o.lines.push(' ');
            o.redraw();
        }  else
            beep(0);
        
    } else if(ev.key == 'Delete') {
        if(o.cursor_pos_x < o.lines[o.cursor_pos_y].length-1) {
            o.lines[o.cursor_pos_y] = o.lines[o.cursor_pos_y].substr(0, o.cursor_pos_x) + o.lines[o.cursor_pos_y].substr(o.cursor_pos_x+1);
            o.redraw();
        } else if(o.cursor_pos_y < o.NO_LINES &&  (o.lines[o.cursor_pos_y].length + o.lines[o.cursor_pos_y+1].length) < o.NO_CHARS) {
            o.lines[o.cursor_pos_y] = o.lines[o.cursor_pos_y].slice(0, -1) + o.lines[o.cursor_pos_y+1];
            o.lines.splice(o.cursor_pos_y+1, 1);
            o.lines.push(' ');
            o.redraw();
        } else
            beep(0);     
    } else if(ev.key == 'Enter') {
        if (o.cursor_pos_y == o.NO_LINES-1) beep(0);
        else if(o.lines[o.NO_LINES-1].match("^[ ]$") == null) beep(0);
        else {
            o.lines.splice(o.cursor_pos_y+1, 0, o.lines[o.cursor_pos_y].substr(o.cursor_pos_x, o.lines[o.cursor_pos_y].length));
            o.lines[o.cursor_pos_y] = o.lines[o.cursor_pos_y].substr(0, o.cursor_pos_x);
            o.cursor_pos_x = 0;
            o.lines[o.cursor_pos_y] += ' ';
            o.cursor_pos_y += 1;
            o.redraw();
        }
    }
    ev.bubbles = false;
}

asm_editor_obj.try_move_cursor = function(dir) {
    let o = asm_editor_obj;
    o.cursor_prev_pos_x = o.cursor_pos_x;
    o.cursor_prev_pos_y = o.cursor_pos_y;
    switch(dir) {
    case 0:
        if(o.cursor_pos_y > 0) {
            o.cursor_pos_y -= 1;
            o.cursor_pos_x = min(o.cursor_pos_x, o.lines[o.cursor_pos_y].length-1);
        } else 
            beep(0);
        break;
    case 2: 
        if(o.cursor_pos_y < o.NO_LINES-1) {
            o.cursor_pos_y += 1;
            o.cursor_pos_x = min(o.cursor_pos_x, o.lines[o.cursor_pos_y].length-1);
        } else 
            beep(0);
        break;
    case 3:
        if(o.cursor_pos_x > 0) { 
            o.cursor_pos_x--; 
        } else
            beep(0);
        break;
    case 1:
        if(o.cursor_pos_x < o.lines[o.cursor_pos_y].length && o.cursor_pos_x < o.NO_CHARS-1) {
            o.cursor_pos_x++; 
        } else 
            beep(0);
        break;
    default: { /* this should never happen */ }
    }
    o.redraw();
}

asm_editor_obj.calibrate_cursor = function() {
    let o = asm_editor_obj;
    o.cursor_text.position.x = o.cursor_pos_x*12 + 12;
    o.cursor_text.position.y = o.cursor_pos_y*22 + 13;
}

asm_editor_obj.redraw_line = function(l) {
    if(asm_editor_obj.cursor_pos_x < 0)  /* shrug */
        asm_editor_obj.cursor_pos_x = 0;
    asm_editor_obj.calibrate_cursor();
    asm_editor_obj.text[l].text = ' ' + asm_editor_obj.lines[l];
}

asm_editor_obj.redraw = function(text) {
    if(asm_editor_obj.cursor_pos_x < 0)   /* shrug */
        asm_editor_obj.cursor_pos_x = 0;
    asm_editor_obj.calibrate_cursor();
    for(let i = 0; i < this.NO_LINES; i++)
        asm_editor_obj.text[i].text = ' ' + asm_editor_obj.lines[i];
}