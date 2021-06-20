// TODO: constant too big error

function is_alpha(letter) { return letter.match(/^[A-Z]+$/); }
function is_num(letter)   { return letter.match(/^[0-9/-]+$/) && parseInt(letter) <= 99 && parseInt(letter) >= -99; }
function is_mem_ptr(str)  { return str.match(/^\[[0-7]\]$/) != null; }
function is_double_mem_ptr(str)  {  return str.match(/^\[\[[0-7]\]\]$/) != null; }

cpu_obj = {
    cur_line: 0,
    asm_code: [],
    registers: [0,0,0,0,0,0,0,0],
    wait_cycles: 0,
    WAIT_INTERVAL: 1,
    WAIT_INTERVAL_FAST: 1,
    WAIT_INTERVAL_SLOW: 1,
    WAIT_INTERVAL_ULTRA_FAST: 1,
    job_list: [],
    halt: false,
    cycles: 0,
    cycles_sum: 0,
    repeat_timer: null,
};

cpu_obj.VALIDATION_MSG = {
    'LINE': function(line) { return "line " + (line+1).toString() + ": "; },
    'UNKNOWN_CMD': function(line, command)              { return "unknown command '" + command + "'"; },
    'BAD_ARGS': function(line, command, args, arg_type) {
        return "bad arguments for '" + command + "' \n(" + (args.length == 0?'no arguments given':("type of '" + args + "' is '" + arg_type + "'")) + ")" ;
    },
    'INV_ARGS': function(line, args)                    { return "invalid arguments '" + args + "'"; },
};

cpu_obj.validation_err = function(type, line, command, a, b, c, d) {
    return (cpu_obj.VALIDATION_MSG['LINE'](line) + (cpu_obj.VALIDATION_MSG[type])(line, command, a, b, c, d));
};

cpu_obj.VALIDATION_DIC = {
    'ADD':  ['MMM', 'MMI', 'MIM', 'MII'],
    'SUB':  ['MMM', 'MMI', 'MIM', 'MII'],
    'MUL':  ['MMM', 'MMI', 'MIM', 'MII'],
    'AND':  ['MMM', 'MMI', 'MIM', 'MII'],
    'OR':   ['MMM', 'MMI', 'MIM', 'MII'],
    'NEG':  ['MM',  'MI'],

    'JMP':  ['M',   'I'],
    'JMPZ': ['MM',  'MI',  'IM',  'II'],
    'JMPN': ['MM',  'MI',  'IM',  'II'],
    'CMP':  ['MMM', 'MMI', 'MIM', 'MII'],

    'MOVE': ['MM',  'MI',  'IM',  'II'],
    'WAIT': ['M',   'I'],
    'UNLOCK': ['M',  'I'],
    'READ':  ['M'],
};

cpu_obj.classify_args = function(parts) {
    let res = '';
    for(p in parts) {
        if(is_mem_ptr(parts[p]))
            res += 'M';
        else if(is_double_mem_ptr(parts[p]))
            res += 'M';
        else if(is_num(parts[p]))
            res += 'I';
        else {
            return -1;
        }
    }
    return res;
}

cpu_obj.validate_asm = function(asm_code) {
    for(let i = 0; i < asm_code.length; i++) {
        // strip whitespace
        let parts = asm_code[i].split(' ');
        let rem = [];
        for(let i in parts)
            if(parts[i] != '') rem.push(parts[i]);

        if (rem.length == 0)
            continue;

        let command = rem.shift();
        if(cpu_obj.VALIDATION_DIC.hasOwnProperty(command)) {
            let arg_types = cpu_obj.classify_args(rem);
            if (arg_types == -1) {
                return cpu_obj.validation_err('INV_ARGS', i, rem.join(' '));
            } else if(cpu_obj.VALIDATION_DIC[command].lastIndexOf(arg_types) == -1) {
                return cpu_obj.validation_err('BAD_ARGS', i, command, rem.join(' '), arg_types);
            } else {
                // all fine
            }
        } else {
            return cpu_obj.validation_err('UNKNOWN_CMD', i, command);
        }
    }
    return true;
}

cpu_obj.partition = function(line) {
    let parts = line.split(' ');
    let rem = [];
    for(let i in parts)
        if(parts[i] != '') rem.push(parts[i]);
    return rem;
}

cpu_obj.reset = function() {
    let o = cpu_obj;
    o.asm_code = [];
    o.cur_line = 0;
    o.registers = [0,0,0,0,0,0,0,0];
    o.wait_cycles = 0;
    o.job_list = [];

    if(worker_obj.rem_trials != worker_obj.TOTAL_TRIALS) {
        o.WAIT_INTERVAL = o.WAIT_INTERVAL_ULTRA_FAST;
        game_scene_obj.WAIT_INTERVAL = game_scene_obj.WAIT_INTERVAL_ULTRA_FAST;
    } else {
        o.cycles_sum = 0;
        o.WAIT_INTERVAL = o.WAIT_INTERVAL_SLOW;
        game_scene_obj.WAIT_INTERVAL = game_scene_obj.WAIT_INTERVAL_SLOW;
    }
    o.halt = false;
    o.cycles = 0;
    if(o.repeat_timer != null)
        o.repeat_timer.timer.removeAll();
    console.log('cpu reset');
    //worker_obj.end_level();
}

cpu_obj.begin_proces_asm = function(asm_code) {
    let o = cpu_obj;
    game_screen_obj.load_level_data(game_scene_obj.cur_level);
    o.reset();
    o.asm_code = asm_code;
    o.process_asm();
}

cpu_obj.get_mem_addr = function(arg) {
    if(is_mem_ptr(arg))
        return parseInt(arg.slice(1,-1));
    else if(is_double_mem_ptr(arg))
        return cpu_obj.registers[parseInt(arg.slice(2, -2))];
}

cpu_obj.resolve_value = function(arg) {
    if(is_num(arg))
        return {value: parseInt(arg)};
    else if (is_mem_ptr(arg)) {
        let a = parseInt(arg.slice(1, -1));
        if(a >= 0 && a <= 7)
            return {value: cpu_obj.registers[a]};
        else
            return {error:true};
    }
    else if (is_double_mem_ptr(arg)) {
        let a = parseInt(arg.slice(2, -2));
        if(a >= 0 && a <= 7 && cpu_obj.registers[a] >= 0 && cpu_obj.registers[a] <= 7)
            return {value: cpu_obj.registers[cpu_obj.registers[a]]};
        else
            return {error:true};
    }
    else
        return {error:true};
}

cpu_obj.EXECUTION_STOPPED_MSG = '\nexecution stopped';

cpu_obj.process_asm = function() {
    let o = cpu_obj;

    if(o.halt)
        return;

    if((o.cur_line >= asm_editor_obj.NO_LINES || o.cur_line < 0) && o.job_list.length == 0) {
        game_scene_obj.create_popup(o.VALIDATION_MSG['LINE'](o.cur_line) + 'line out of bounds' + o.EXECUTION_STOPPED_MSG);
        return;
    }

    o.extra_cycles = 1;
    o.cycles += 1;
    let res = {};
    if(o.job_list.length == 0) {
        let line = o.asm_code[o.cur_line];
        let parts = o.partition(line);
        let parts_r = [];

        // check everything can be resolved; if not, throw error and stop executing
        for(let i = 1; i < parts.length; i++) {
            let r = o.resolve_value(parts[i]);
            if(r.error) {
                game_scene_obj.create_popup(o.VALIDATION_MSG['LINE'](o.cur_line) + 'incorrect argument value: \'' + parts[i] + '\'' + o.EXECUTION_STOPPED_MSG);
                return;
            } else
                parts_r.push(r.value);
        }


        if(parts[0] == 'MOVE') {
            res = worker_obj.move(parts_r[0], parts_r[1]);
        } else if(parts[0] == 'WAIT'){
            res = worker_obj.wait(parts_r[0])
        } else if(parts[0] == 'ADD'){
            res = worker_obj.add(o.get_mem_addr(parts[1]), parts_r[1], parts_r[2]);
        } else if(parts[0] == 'CMP'){
            res = worker_obj.cmp(o.get_mem_addr(parts[1]), parts_r[1], parts_r[2]);
        } else if(parts[0] == 'SUB'){
            res = worker_obj.sub(o.get_mem_addr(parts[1]), parts_r[1], parts_r[2]);
        } else if(parts[0] == 'MUL'){
            res = worker_obj.mul(o.get_mem_addr(parts[1]), parts_r[1], parts_r[2]);
        } else if(parts[0] == 'JMP'){
            res = worker_obj.jmp(parts_r[0]);
        } else if(parts[0] == 'JMPZ'){
            res = worker_obj.jmpz(parts_r[0], parts_r[1]);
        } else if(parts[0] == 'JMPN'){
            res = worker_obj.jmpn(parts_r[0], parts_r[1]);
        } else if(parts[0] == 'UNLOCK'){
            res = worker_obj.unlock(parts_r[0]);
        } else if(parts[0] == 'READ'){
            res = worker_obj.read(o.get_mem_addr(parts[1]));
        }
    } else {
        let job = o.job_list.shift(); // does this really work
        if(job.name == 'WAIT') {
            console.log('real waiting');
        } else if(job.name == 'MOVE') {
            if(job.y != 0 && !game_screen_obj.check_collision(game_screen_obj.entities.player.x, game_screen_obj.entities.player.y + job.y)) {
                game_screen_obj.entities.player.y += job.y;
                cpu_obj.registers[7] += 1; // redraw registers normalizes to max 99
            } else if(job.x != 0 && !game_screen_obj.check_collision(game_screen_obj.entities.player.x + job.x, game_screen_obj.entities.player.y)) {
                game_screen_obj.entities.player.x += job.x;
                cpu_obj.registers[7] += 1; // redraw registers normalizes to max 99
            } else {
                while(o.job_list.length != 0 && o.job_list[0].name == 'MOVE') {
                    o.cycles += 1;
                    o.extra_cycles += 1;
                    o.job_list.shift();
                }
            }
            worker_obj.check_activation();
            //worker_obj.check_victory();
        }
        res.next_line = o.cur_line;
    }

    o.cycles = min(9998, o.cycles);

    if(!res.error) {
        o.repeat_timer = game.time.events.add(o.WAIT_INTERVAL, cpu_obj.process_asm, o);
        if(typeof(res.next_line) == 'undefined')
            o.cur_line += 1;
        else
            o.cur_line = res.next_line;
    } else {
        game_scene_obj.create_popup(o.VALIDATION_MSG['LINE'](o.cur_line) + res.error_msg+ o.EXECUTION_STOPPED_MSG);
        return;
    }

    game_screen_obj.redraw();
    game_scene_obj.redraw_registers();
    game_scene_obj.redraw_arrow();
    game_scene_obj.show_cpu_tick(o.extra_cycles);
}
