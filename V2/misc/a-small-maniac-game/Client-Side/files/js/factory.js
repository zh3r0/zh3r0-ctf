var factory_obj = {
    create_text: function(owner, posX, posY, text, font) {
        let tmp = owner.add.text(posX, posY, text, font);
        tmp.scale.x = 0.7;
        tmp.scale.y = 0.5;
        tmp.smoothed = true;
        return tmp;
    }
}

function max(a, b) { return a>b?a:b; }
function min(a, b) { return a<b?a:b; }
function abs(a) { return a>0?a:-a; }

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

function beep(type) {
    if(type == 0) {
        console.log('invalid keyboard operation BEEP');
    }
}

function isPrime(num) {
    for(var i = 2; i < num; i++)
      if(num % i === 0) return false;
    return num !== 1;
  }

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var GAME_MAX_INT = 99;
function getRandomIntGame() {
    return getRandomInt(0, GAME_MAX_INT);
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function padEmptyLines(cur, total, width) {
    str = "";
    while(str.length < width)
        str += " ";
    while(cur.length < total) {
        cur.push(str);
    }
    return cur;
}

function allEmpty(cur) {
    for(i = 0; i < cur.length; i++) {
        if(cur[i].replace(/\s/g, '').length != 0)
            return false;
    }
    return true;
}

function exportLevelSolution(level) {
    arr = score_obj.levels[level].solution;
    console.log(arr.join("\n"));
}