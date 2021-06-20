let STYLES = {
    'dos_text':   {font:"50px VT323", fill:"#EEEEEE"},
    'asm_editor': {font:"43px VT323", fill:"#EEEEEE"},
    'dos_none':   {font:"10px VT323", fill:"#000000"},
    'game_mem':   {font:"80px VT323", fill:"#FFFFFF"},
    'game_screen_text':   {font:"40px VT323", fill:"#FFFFFF"},
    'line_arrow':   {font:"80px VT323", fill:"#FFFFFF"},
}

var game_obj = { SAVE_VERSION: '0.0.1', VERSION: '0.0.1', }

game_obj.preload = function() {
    game.add.text(10, 10, "hack", STYLES.dos_none);
    let loading_text = game.add.text(20, 30, ".", STYLES.dos_text);
    loading_text.scale.x = 0.7;
    loading_text.scale.y = 0.5;

    let scripts_to_load = ['dos_hell', 'factory', 'cpu', 'worker', 'score', 'levels.min', 'asm_editor', 'game_scene', 'game_screen'];
    for(let i in scripts_to_load) {
        game.load.script('js/' + scripts_to_load[i]);
    }

    let sprites_to_load = ['game_background', 'game_popup', 'button_back', 'button_run', 'button_ok', 'button_fast', 'button_slow', 'button_stop'];
    for(let i in sprites_to_load) {
        game.load.image(sprites_to_load[i], 'assets/' + sprites_to_load[i] + '.png');
    }

    game.load.audio('kurt', 'assets/kurt.mp3');

    let spritesheets_to_load = [ {name: 'game_sprites', width: 25, height: 25} ];
    for(let i in spritesheets_to_load)
        game.load.spritesheet(spritesheets_to_load[i].name, 'assets/' + spritesheets_to_load[i].name + '.png', spritesheets_to_load[i].width, spritesheets_to_load[i].height);

    game.load.onFileComplete.add(function(percentage, file, s, file_count, total_count) {
        loading_text.text = 'loading: ' + file + ' - ' + percentage + '%';
    }, this);
}

game_obj.create = function() {
    score_obj.init();

    music = game.add.audio('kurt');
    music.loop = true;
    music.volume = 0.1;
    music.play();

    game.state.add('dos_hell', doshell_obj);
    game.state.add('game_scene', game_scene_obj);
    game.state.start('dos_hell');

    game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.BACKSPACE,
        Phaser.Keyboard.DELETE,
    ]);
}

let game = new Phaser.Game(900, 500, Phaser.AUTO, document.getElementById("game"), { preload: game_obj.preload, create: game_obj.create, update: game_obj.update }, false,    false);
