var game_scene_obj = {
    cur_level: 1,
    CPU_TICK_INTERVAL: 90,
    CPU_TICK_INTERVAL_SLOW: 90,
    CPU_TICK_INTERVAL_ULTRA_FAST: 50,
}

game_scene_obj.create = function(a) {
    cpu_obj.reset();
    var o = game_scene_obj;

    o.background = game.add.sprite(0, 0, 'game_background');
    o.background.scale.set(2, 2);
    
    game_screen_obj.create(o.cur_level);
    
    asm_editor_obj.create();
    game.input.keyboard.onPressCallback = asm_editor_obj.onPressCallback; 
    game.input.keyboard.onDownCallback = asm_editor_obj.onDownCallback; 


    // load previous solution
    score_obj.load_data();
    if(!allEmpty(score_obj.levels[o.cur_level].solution)) {
        asm_editor_obj.lines = score_obj.levels[o.cur_level].solution;
        asm_editor_obj.redraw();

    } else {
        // od load hint
        asm_editor_obj.lines = padEmptyLines(levels_obj.levels[o.cur_level]().solution, 22, 1);
        asm_editor_obj.redraw();
    }


    o.button_fast = game.add.button(279, 30, 'button_fast', function() {
        game_scene_obj.button_slow.bringToTop();
        cpu_obj.WAIT_INTERVAL = cpu_obj.WAIT_INTERVAL_FAST;
    }, o, 0, 0, 0);
    o.button_fast.scale.set(2, 2);

    o.button_slow = game.add.button(279, 30, 'button_slow', function() {
        game_scene_obj.button_fast.bringToTop();
        cpu_obj.WAIT_INTERVAL = cpu_obj.WAIT_INTERVAL_SLOW;
    }, o, 0, 0, 0);
    o.button_slow.scale.set(2, 2);

    o.button_stop = game.add.button(279, 4, 'button_stop', function() { 
        o.stop_executing();
    }, o, 0, 0, 0);
    o.button_stop.scale.set(2, 2);

    o.button_back = game.add.button(279, 4, 'button_back', function() { 
        score_obj.levels[game_scene_obj.cur_level].solution = asm_editor_obj.lines;
        score_obj.save_data();
        game.state.start('dos_hell');   
    }, o, 0, 0, 0);
    o.button_back.scale.set(2, 2);
    
    o.button_run = game.add.button(279, 30, 'button_run', function() {
        worker_obj.rem_trials = worker_obj.TOTAL_TRIALS;
        worker_obj.start_run();
    }, o, 0, 0, 0);
    o.button_run.scale.set(2, 2);


    let label_text = factory_obj.create_text(game, 521, 6, ' 0  1  2  3  4  5  6  7', STYLES.game_mem);
    label_text.smoothed = false;
    label_text.scale.set(.5, .3);

    o.sgn_reg_text = factory_obj.create_text(game, 511, 20, '      ', STYLES.game_mem);
    o.sgn_reg_text.smoothed = false;
    o.sgn_reg_text.scale.set(.5, .4);

    o.reg_text = factory_obj.create_text(game, 521, 30, '00 00 00 00 00 00 00 00', STYLES.game_mem);
    o.reg_text.smoothed = false;
    o.reg_text.scale.set(.5, .3);


    o.line_arrow = factory_obj.create_text(game, 255, 7, '<', STYLES.line_arrow);
    o.line_arrow.smoothed = false;
    o.line_arrow.scale.set(.5, .3);

    o.cpu_tick = factory_obj.create_text(game, 372, 6, '!', STYLES.line_arrow)
    o.cpu_tick.smoothed = false;
    o.cpu_tick.scale.set(.5, .3);
    o.cpu_tick.alpha = 0;

    o.redraw_registers();
    o.create_popup(levels_obj.popup[o.cur_level]);
}

game_scene_obj.redraw_registers = function() {
    game_scene_obj.reg_text.text = '';
    game_scene_obj.sgn_reg_text.text = '';
    for(let i = 0; i < 8; i++) {
        if(cpu_obj.registers[i] > 99) cpu_obj.registers[i] = 99;
        if(cpu_obj.registers[i] <-99) cpu_obj.registers[i] =-99;
        game_scene_obj.reg_text.text += pad(abs(cpu_obj.registers[i]), 2) + ' ';
        game_scene_obj.sgn_reg_text.text += (cpu_obj.registers[i]>=0?' ':'-') + '  ';
    }
}

game_scene_obj.redraw_arrow = function() {
    let real_line = cpu_obj.cur_line;
    if(cpu_obj.job_list.length != 0)
        real_line -= 1;
    game_scene_obj.line_arrow.position.set(255, real_line*21+7);
}

game_scene_obj.show_cpu_tick = function(text) {
    game_scene_obj.cpu_tick.alpha = 1;
    game_scene_obj.cpu_tick.text = text;
    let tmr = game.time.create(false);
    tmr.add(game_scene_obj.CPU_TICK_INTERVAL, function() { game_scene_obj.cpu_tick.alpha = 0; }, this);
    tmr.start();
}

game_scene_obj.show_arrow = function(show) {
    //TODO IMPLEMENT
}

game_scene_obj.stop_executing = function() {
    // this should have been handled much better
    game_scene_obj.show_arrow(false); 
    game_scene_obj.button_run.bringToTop();
    game_scene_obj.button_back.bringToTop();
    asm_editor_obj.typing_locked = false;
    cpu_obj.halt = true;
}

game_scene_obj.create_popup = function(text, f) {
    var o = game_scene_obj;
    o.stop_executing();
    o.popup_fun = f;

    asm_editor_obj.typing_locked = true;
    o.popup_group = game.add.group();
    o.popup = game.add.button(0, 0, 'game_popup', function() { }, o, 0, 0, 0);
    o.popup.scale.set(2, 2);
    o.popup.input.useHandCursor = false;
    o.popup_group.add(o.popup);

    o.popup_button = game.add.button(415, 342, 'button_ok', function() {
        game.world.remove(game_scene_obj.popup_group, true);
        asm_editor_obj.typing_locked = false;
        game_scene_obj.button_back.bringToTop();
        game_scene_obj.button_run.bringToTop();
        if(typeof(o.popup_fun) != 'undefined') o.popup_fun();
    }, o, 0, 0, 0);
    o.popup_button.scale.set(2, 2);
    o.popup_group.add(o.popup_button);

    o.popup_text = factory_obj.create_text(game, 130, 130, text, STYLES.asm_editor);
    o.popup_group.add(o.popup_text);
}