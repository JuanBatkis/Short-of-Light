let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = document.documentElement.clientWidth*1;
        this.canvas.height = document.documentElement.clientHeight*1;
        this.context = this.canvas.getContext("2d");
		document.getElementById('canvasSection').appendChild(this.canvas);
		
		oilSound = new sound('./assets/oil.mp3', 'oilSound', false);
		shadowSound = new sound('./assets/shadow.mp3', 'shadowSound', false);
		morningBirds = new sound('./assets/morning-birds.mp3', 'morningBirds', true);
		gameMusic = new sound('./assets/game-loop.mp3', 'gameMusic', true);
		gameMusic.stop();
    },
};

myGameArea.start();

let map = levels[0];

let ctx = null, mapW = map.width, mapH = map.height, scale = 3, level = 0, difficulty = 2, play = true, foundKeys = false;

let height = document.documentElement.clientHeight;
let width = document.documentElement.clientWidth;
let oilJar = null

let currentSecond = 0, frameCount = 0, totalFrames = 0, framesLastSecond = 0, lastFrameTime = 0;

let keysDown = {
	37 : false,	//left
	38 : false,	//up
	39 : false,	//right
	40 : false,	//down
	65 : false,	//a
	87 : false,	//w
	68 : false,	//d
	83 : false 	//s
},
keys = [37,	38,	39,	40,	65,	87,	68,	83];

let player = new Character(map.spawnX * scale, map.spawnY * scale, scale, 0.7); //0.7
let viewport = new Viewport(0, 0, 400, 400);
let light = new Light(scale, width * 0.5 - player.width * 0.5, height * 0.5 - player.height * 0.5, player.width, player.height);

let allItems = [];
map.itemsCoordinates.forEach((element) => {
	allItems.push(new Item(element.x, element.y, scale, element.type));
});

let loadedImgs = 0
let mapTileSheet = new Image();
mapTileSheet.src = './assets/wall-sprites.png';

window.onload = function() {
	//Before game
	document.getElementById('beginLamp').onclick = () => {
		showIntro();
	};

	document.getElementById('continue').onclick = () => {
		showInstructions();
	};

	document.getElementById('levelSelect').onclick = () => {
		showLevelSelector();
	};

	document.getElementById('startGame').onclick = (e) => {
		startGame(e.target.className);
	};

	//Game starts

    ctx = myGameArea.context;
	ctx.imageSmoothingEnabled = false;

	player.ctx = ctx;
	light.ctx = ctx;
	oilJar = document.querySelector('#canvasSection .oilCont .oilJar .oil');

	ctx.font = "10pt sans-serif";

	document.getElementById('playPause').onclick = () => {
		playPause();
	};
	document.getElementById('soundMute').onclick = () => {
		soundMute();
	};

	//restarts game on try or play again
	document.getElementById('tryAgain').onclick = () => {
		restart();
	};
	document.getElementById('playAgain').onclick = () => {
		restart();
	};
	document.getElementById('levelReSelect').onclick = () => {
		changeLevel();
	};
	document.getElementById('exit').onclick = () => {
		changeLevel();
	};
	
	document.onkeydown = function(e) {
        if(keys.includes(e.keyCode)) {
            keysDown[e.keyCode] = true;
		}
		
		if (e.keyCode === 27) { //pause game on ESC
			playPause();
		} else if (e.keyCode === 73) { //change player speed with I
			(player.speed === 0.7) ? player.speed = 2.5 : player.speed = 0.7;
		} else if (e.keyCode === 75) { //get all keys with K
			player.keysFound = map.keys;
		} else if (e.keyCode === 79) { //empty oil with O
			player.oil = 10;
		} else if (e.keyCode === 76) { //toggle light with L
			(player.light) ? player.light = false : player.light = true;
		}
    };

    document.onkeyup = function(e) {
		if(keys.includes(e.keyCode)) {
			keysDown[e.keyCode] = false;
        }
	};

	const upLeftArrow = document.getElementById('upLeft');
	upLeftArrow.addEventListener('contextmenu', e => e.preventDefault() );
	upLeftArrow.ontouchstart = () => {
		keysDown[37] = true;
		keysDown[38] = true;
	};
	upLeftArrow.ontouchend = () => {
		keysDown[37] = false;
		keysDown[38] = false;
	};

	const upArrow = document.getElementById('up');
	upArrow.addEventListener('contextmenu', e => e.preventDefault() );
	upArrow.ontouchstart = () => {
		keysDown[38] = true;
	};
	upArrow.ontouchend = () => {
		keysDown[38] = false;
	};

	const upRightArrow = document.getElementById('upRight');
	upRightArrow.addEventListener('contextmenu', e => e.preventDefault() );
	upRightArrow.ontouchstart = () => {
		keysDown[39] = true;
		keysDown[38] = true;
	};
	upRightArrow.ontouchend = () => {
		keysDown[39] = false;
		keysDown[38] = false;
	};

	const leftArrow = document.getElementById('left');
	leftArrow.addEventListener('contextmenu', e => e.preventDefault() );
	leftArrow.ontouchstart = () => {
		keysDown[37] = true;
	};
	leftArrow.ontouchend = () => {
		keysDown[37] = false;
	};

	const rightArrow = document.getElementById('right');
	rightArrow.addEventListener('contextmenu', e => e.preventDefault() );
	rightArrow.ontouchstart = () => {
		keysDown[39] = true;
	};
	rightArrow.ontouchend = () => {
		keysDown[39] = false;
	};

	const downLeftArrow = document.getElementById('downLeft');
	downLeftArrow.addEventListener('contextmenu', e => e.preventDefault() );
	downLeftArrow.ontouchstart = () => {
		keysDown[37] = true;
		keysDown[40] = true;
	};
	downLeftArrow.ontouchend = () => {
		keysDown[37] = false;
		keysDown[40] = false;
	};

	const downArrow = document.getElementById('down');
	downArrow.addEventListener('contextmenu', e => e.preventDefault() );
	downArrow.ontouchstart = () => {
		keysDown[40] = true;
	};
	downArrow.ontouchend = () => {
		keysDown[40] = false;
	};

	const downRightArrow = document.getElementById('downRight');
	downRightArrow.addEventListener('contextmenu', e => e.preventDefault() );
	downRightArrow.ontouchstart = () => {
		keysDown[39] = true;
		keysDown[40] = true;
	};
	downRightArrow.ontouchend = () => {
		keysDown[39] = false;
		keysDown[40] = false;
	};
}

const drawGame = function() {

	if(ctx==null) { return; }

	//Resize canvas on every frame
	let height = document.documentElement.clientHeight;
	let width = document.documentElement.clientWidth;
	myGameArea.canvas.height = height;
	myGameArea.canvas.width = width;

	//Clear entire canvas
	ctx.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
	ctx.imageSmoothingEnabled = false;

	let currentFrameTime = Date.now();
	let sec = Math.floor(currentFrameTime/1000);
	if(sec!=currentSecond) {
		currentSecond = sec;
		framesLastSecond = frameCount;
		frameCount = 1;
	} else {
		frameCount++;
	}
	totalFrames ++
	
	//Deplete oil left based on difficulty. Pause once the player won
	if (!player.won) {
		player.oil -= 0.1 * difficulty;
	}
	oilJar.style.height = (player.oil/10).toFixed(1) + '%';


	//If the player has found all keys, the bed appears
	if (player.keysFound >= map.keys && !foundKeys) {
		foundKeys = true;
		foundAllKeys();
	}

	//If the player reaches the bed, the game is won
	if (player.won) {
		wakeUp();
	}

	//If the player runs out of oil, game over
	if (player.oil <= 0) {
		gameOver();
	}
	
	//Update buttons status
	update();

	//Make the camera follow the player
	viewport.scrollTo(player.x, player.y);
	
	//Draw main map
	createMap(map.mapMain, true, width, height);

	//Draw items (oils, keys, bed)
	placeObjects(allItems, width, height, true);
	
	
	//Draw player
	player.draw(width * 0.5 - player.width * 0.5, height * 0.5 - player.height * 0.5, keysDown);

	//Draw bed sheets
	placeObjects(allItems, width, height, false);
	
	//Draw arches
	createMap(map.mapArches, false, width, height);
	
	ctx.fillStyle = '#ff0000';
	ctx.fillText('FPS: ' + framesLastSecond, 10, 60);
	
	if (player.light) {
		//Draw light beam
		ctx.save();
		ctx.globalCompositeOperation = "multiply";
		light.draw(width * 0.5 - player.width * 0.5, height * 0.5 - player.height * 0.5,'multiply', player.direction);
		ctx.restore();
	
		//Draw light shine
		ctx.save();
		ctx.globalCompositeOperation = "destination-in";
		light.draw(width * 0.5 - player.width * 0.5, height * 0.5 - player.height * 0.5,'light', keysDown, player.direction);
		ctx.restore();
	}

	if(play) requestAnimationFrame(drawGame);

}