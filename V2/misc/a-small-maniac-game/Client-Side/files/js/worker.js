var worker_obj = {

};

worker_obj.move = function(a, dir) {
    // TODO: check collision, etc
    if(dir != 0 && dir != 1)
        return {error: true, error_msg: 'direction has to be either 0 or 1 (' + dir + ')'};

    let b = a>0?a:-a;
    let s = a>0?1:-1;
    if(dir == 0)
        for(;b>0;b--) cpu_obj.job_list.push({name:'MOVE', x:0, y:s});
    else if(dir == 1)
        for(;b>0;b--) cpu_obj.job_list.push({name:'MOVE', x:s, y:0});
    return true;
}

worker_obj.wait = function(a) {
    if(a < 0)
    return {error: true, error_msg: 'wait argument can\'t be negative (' + a + ')'};
    for(;a>0;a--)
        cpu_obj.job_list.push({name:'WAIT'});
    return {};
}

worker_obj.add = function(a, b, c) {
    cpu_obj.registers[a] = b+c;
    return {};
}

worker_obj.sub = function(a, b, c) {
    cpu_obj.registers[a] = b-c;
    return {};
}

worker_obj.mul = function(a, b, c) {
    cpu_obj.registers[a] = b*c;
    return {};
}

worker_obj.cmp = function(a, b, c) {
    if(b > c)
        cpu_obj.registers[a] = 1;
    else if(b < c)
        cpu_obj.registers[a] = -1;
    else
        cpu_obj.registers[a] = 0;
    return {};
}

worker_obj.jmp = function(addr) {
    if(addr < 1 || addr > asm_editor_obj.NO_LINES)
        return {error: true, error_msg: 'incorrect line number (' + addr + ')'};
    else
        return {next_line: addr-1};
}

worker_obj.jmpz = function(addr, a) {
    if(addr < 1 || addr > asm_editor_obj.NO_LINES)
        return {error: true, error_msg: 'incorrect line number (' + addr + ')'};
    else if(a == 0)
        return {next_line: addr-1};
    else
        return {};
}

worker_obj.jmpn = function(addr, a) {
    if(addr < 1 || addr > asm_editor_obj.NO_LINES)
        return {error: true, error_msg: 'incorrect line number (' + addr + ')'};
    else if(a < 0)
        return {next_line: addr-1};
    else
        return {};
}

worker_obj.check_activation = function() {
    let px = game_screen_obj.entities.player.x;
    let py = game_screen_obj.entities.player.y;
    if(game_screen_obj.grid_data[px][py] == 't') {
        game_scene_obj.create_popup('You walked into a trap. CPU halt.');
    } else if(game_screen_obj.grid_data[px][py] == 'G') {
        worker_obj.rem_trials -= 1;
        cpu_obj.cycles_sum += cpu_obj.cycles;
        if(worker_obj.rem_trials == 0)
            worker_obj.end_level();
        else {
            worker_obj.start_run();
        }
    }
}

worker_obj.start_run = function() {
    let validation_msg = (cpu_obj.validate_asm(asm_editor_obj.lines));
    if(validation_msg != true) {
        game_scene_obj.create_popup(validation_msg);
    } else {
        cpu_obj.cycles_sum += cpu_obj.cycles; //cpu_obj.cycles_sum are reset only on first run
        game_scene_obj.show_arrow(true);
        cpu_obj.begin_proces_asm(asm_editor_obj.lines);
        game_scene_obj.button_fast.bringToTop();
        game_scene_obj.button_stop.bringToTop();
        asm_editor_obj.typing_locked = true;
    }
}

worker_obj.end_level = function() {
    cpu_obj.halt = true;
    score_obj.levels[game_scene_obj.cur_level].solution = asm_editor_obj.lines;

    let MSG = 'Let\'s see how well you\'ll do in the next one.';
    if(game_scene_obj.cur_level == levels_obj.levels.length-1)
        MSG = '\nThe game is over. You\'ve successfully learned\nbasic assembly. Enjoy your life.\n' //+ flag
    else
        score_obj.levels[game_scene_obj.cur_level+1].unlocked = true;


    if(isNaN(score_obj.levels[game_scene_obj.cur_level].cycles) || score_obj.levels[game_scene_obj.cur_level].cycles == null)
        score_obj.levels[game_scene_obj.cur_level].cycles = 999999999;
    if(isNaN(score_obj.levels[game_scene_obj.cur_level].lines) || score_obj.levels[game_scene_obj.cur_level].lines == null)
        score_obj.levels[game_scene_obj.cur_level].lines = 999999999;

    let prev_lines = score_obj.levels[game_scene_obj.cur_level].lines;
    score_obj.levels[game_scene_obj.cur_level].lines = 0;
    for(let i in asm_editor_obj.lines)
        if(!asm_editor_obj.lines[i].match(/^[ ]+$/))
            score_obj.levels[game_scene_obj.cur_level].lines += 1;

    let cycles_avg = Math.floor(cpu_obj.cycles_sum/worker_obj.TOTAL_TRIALS);
    let res_lines = score_obj.levels[game_scene_obj.cur_level].lines;
    score_obj.levels[game_scene_obj.cur_level].lines =  min(prev_lines, score_obj.levels[game_scene_obj.cur_level].lines);
    score_obj.levels[game_scene_obj.cur_level].cycles = min(cycles_avg, score_obj.levels[game_scene_obj.cur_level].cycles);

    score_obj.save_data();
    game_scene_obj.create_popup('You\'ve beaten this level with ' +
        res_lines + ' lines and ' +
        cycles_avg + ' cycles.\n' + MSG ,
        function() {
            game.state.start('dos_hell');
        }
    );
}

worker_obj.unlock = function(key) {
    // get the closest door
    let px = game_screen_obj.entities.player.x;
    let py = game_screen_obj.entities.player.y;
    let door = null;
    for(let i in game_screen_obj.entities) {
        let entity = game_screen_obj.entities[i];
        if(entity.type == 'door') {

            if( (abs(px - entity.x) == 1 && py == entity.y) || (abs(py - entity.y) == 1 && px == entity.x) ) {
                door = entity;
                break;
            }
        }
    }
    if(door == null) {
        cpu_obj.registers[7] = -1; // if none found
        return {};
    } else {
        if(door.key != key) {
            return {error: true, error_msg: 'incorrect key (' + key + '), CPU fault'};
        } else {
            door.type = 'door_unlocked';
            game_screen_obj.grid_data[door.x][door.y] = 'd';
            return {};
        }
    }
}

worker_obj.read = function(a) {
    let px = game_screen_obj.entities.player.x;
    let py = game_screen_obj.entities.player.y;
    let value = null;
    for(let i in game_screen_obj.entities) {
        let entity = game_screen_obj.entities[i];
        if(entity.type == 'value') {
            if( py == entity.y && px == entity.x ) {
                value = entity;
                break;
            }
        }
    }
    if(value == null) {
        cpu_obj.registers[a] = -1;  // if none found
        return {};
    } else {
        cpu_obj.registers[a] = value.value;
        return {};
    }
}
