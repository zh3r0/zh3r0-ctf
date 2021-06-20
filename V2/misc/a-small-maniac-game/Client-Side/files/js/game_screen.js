var game_screen_obj = {
    grid_data: [],
    grid_buff: [],
    frame_map: {
        '.': 0, 'P': 1, 'r': 2, 'w': 3, 'G': 4, 'D': 5, 'd': 6, 't': 7,
    },
    entities_dic_map: {
        'door': 'D', 'value': 'V', 'trap': 't', 'text': '.',
    },
    group: null,
    tmp_group: null,

    // GRID SIZE: 24x18
    WIDTH: 24,
    HEIGHT: 17,
    entities: {
        'player': {x: 0, y:0},
        'enemies': [],
    }
};

game_screen_obj.create = function(level) {
    let o = game_screen_obj;
    o.group = game.add.group();
    o.group.position.set(287, 66);
    o.grid_data = [];
    o.grid_buff = [];

    for(let i = 0; i < o.WIDTH; i++) {
        o.grid_buff.push([]);
        for(let j = 0; j < o.HEIGHT; j++) {
            let obj = o.group.create(25*i, 25*j, 'game_sprites');
            obj.frame = 0;
            o.grid_buff[i].push(obj);
        }
    }
    o.load_level_data(level);
}

game_screen_obj.load_level_data = function(level) {
    let o = game_screen_obj;
    o.grid_data = [];
    o.entities ={
        'player': {x: 0, y:0},
        'enemies': [],
    };

    if(o.tmp_group != null) o.tmp_group.removeAll();
    o.tmp_group = game.add.group();
    o.tmp_group.position.set(287, 68);

    let source = levels_obj.levels[level]();
    if(source.hasOwnProperty('max_lines'))
        asm_editor_obj.NO_LINES = source['max_lines'];
    if(source.hasOwnProperty('total_trials'))
        worker_obj.TOTAL_TRIALS = source['total_trials'];
    else
        worker_obj.TOTAL_TRIALS = 1;
    let s_map = source.map;
    let s_entities = source.entities;
    
    for(let i = 0; i < o.WIDTH; i++) {
        o.grid_data.push([]);
        for(let j = 0; j < o.HEIGHT; j++) {
            o.grid_data[i].push(s_map[j][i]);
            if(s_map[j][i] == 'P') {
                o.entities.player = {x:i, y:j};
                o.grid_data[i][j] = '.';
            } else if(s_entities.hasOwnProperty(o.grid_data[i][j])) {
                let entity = s_entities[o.grid_data[i][j]];
                o.grid_data[i][j] = o.entities_dic_map[entity.type];
                entity.x = i;
                entity.y = j;
                if(entity.type=='text') { // no need to add text to entities
                    let text = factory_obj.create_text(game, i*25, j*25, entity.text, STYLES.game_screen_text);
                    text.smoothed = false;
                    o.tmp_group.add(text);
                } else if(entity.type=='value') { // no need to add text to entities
                    let text = factory_obj.create_text(game, i*25+2, j*25, entity.value, STYLES.game_screen_text);
                    text.smoothed = false;
                    o.tmp_group.add(text);
                    o.entities['e' + i.toString()  + '.' + j.toString()] = entity;
                    o.grid_data[i][j]= '.';
                } else {
                    o.entities['e' + i.toString()  + '.' + j.toString()] = entity;
                }

            }
        }
    }
    o.redraw();
}

game_screen_obj.redraw = function() {
    let o = game_screen_obj;
    for(let i = 0; i < o.WIDTH; i++)
        for(let j = 0; j < o.HEIGHT; j++)
            if(o.grid_data[i][j] != 'V')  // special treatment for values
                o.grid_buff[i][j].frame = o.frame_map[o.grid_data[i][j]];
    o.grid_buff[o.entities.player.x][o.entities.player.y].frame = o.frame_map['P'];
}

game_screen_obj.check_collision = function(x, y) {
    let o = game_screen_obj;
    if(x < 0 || y < 0 || x >= o.WIDTH || y >= o.HEIGHT)
        return true;
    else if(o.grid_data[x][y] == 'w' || o.grid_data[x][y] == 'D')
        return true;
    return false;
}