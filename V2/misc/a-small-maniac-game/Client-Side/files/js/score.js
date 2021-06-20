var score_obj = {
    levels: {},
}

score_obj.init = function() {
    score_obj.reset();
    score_obj.load_data();
}

score_obj.reset = function() {
    for(let i = 0; i < levels_obj.levels.length; i++) {
        score_obj.levels[i.toString()] = {'lines': NaN, 'cycles': NaN, 'solution': [], 'unlocked': false};
    }
    score_obj.levels['0'].unlocked = true;
}

score_obj.load_data = function() {
    if (typeof(Storage) !== "undefined") {
        if(localStorage['asm_loaded'] == 'true') {
            let ret_data = JSON.parse(localStorage['asm_progress']);
            // don't load if different level count
            if(ret_data.hasOwnProperty(game_obj.SAVE_VERSION) && Object.keys(ret_data[game_obj.SAVE_VERSION]).length == levels_obj.levels.length) {
                score_obj.levels = ret_data[game_obj.SAVE_VERSION];
                console.log('game data loaded');
            }
        }
    } else {
        console.log('game data will be lost on game exit');
    }
}

Number.prototype.pad = function(size) {
    var s = String(this);
    if(isNaN(this))
        while (s.length < (size || 2)) {s = s + " ";}
    else
        while (s.length < (size || 2)) {s = s + " ";}
    return s;
}

score_obj.save_data = function() {
    if (typeof(Storage) !== "undefined") {
        let to_save = {};
        if(localStorage['asm_loaded'] == 'true')
            to_save = JSON.parse(localStorage['asm_progress']);
        to_save[game_obj.SAVE_VERSION] = score_obj.levels;
        localStorage.setItem('asm_progress', JSON.stringify(to_save));
        localStorage.setItem('asm_loaded', true);
        console.log('game data saved');
    } else {
        console.log('game data not saved');
    }
}

score_obj.get_progress = function() {
    res = 'level        cycles            lines\n';
    for(let i in score_obj.levels) {
        res += parseInt(i).pad(2) + ' ' + (score_obj.levels[i].unlocked?' ':'X') + '         ' + parseInt(score_obj.levels[i].cycles).pad(6)
            + '            ' + parseInt(score_obj.levels[i].lines).pad(3) + '\n';
    }
    return res.slice(0, -1);
}