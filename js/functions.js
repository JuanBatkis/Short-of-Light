const showIntro = function() {
	document.getElementById('titleScreen').className = 'intro hidden';
	document.getElementById('introScreen').className = 'intro';
}

const showInstructions = function() {
	document.getElementById('introScreen').className = 'intro hidden';
	document.getElementById('instructions').className = 'intro';
	document.querySelector('body').className = 'scroll';
	window.scrollTo(0, 0);
}

const showLevelSelector = function() {
	document.getElementById('instructions').className = 'intro hidden';
	document.getElementById('levelSelection').className = 'intro';
	document.querySelector('body').className = 'scroll';
	window.scrollTo(0, 0);
}

const selectLevel = function (id) {
	document.getElementById('startGame').className = id;
	const levels = document.querySelectorAll('#levelSelection .col-6');
	levels.forEach(element => {
		element.className = 'col-6';
	});
	document.getElementById(id).className = 'col-6 selected';
}

const startGame = function(level) {
	document.getElementById('introScreen').className = 'intro hidden';
	document.getElementById('canvasSection').className = 'intro';
	window.scrollTo(0, 0);
	document.querySelector('body').className = '';

	switch (level) {
		case 'level-1':
			map = levels[0];
			break;
		case 'level-2':
			map = levels[1];
			break;
		case 'level-3':
			map = levels[2];
			break;
	}

	mapW = map.width;
	mapH = map.height;
	allItems = [];
	map.itemsCoordinates.forEach((element) => {
		allItems.push(new Item(element.x, element.y, scale, element.type));
	});
	player.light = true;

	music = document.getElementById('gameMusic').volume = 1;
	gameMusic.play();
	drawGame();
}

const playPause = function() {
    if(play) {
		play = false;
		gameMusic.stop();
        document.getElementById('playPause').className = 'pause';
        document.getElementById('pauseScreen').className = 'overlay show';
		document.getElementById('exit').className = 'exitShow';
    } else {
		play = true;
		if (!gameMusic.mute) {
			gameMusic.play();
		}
        document.getElementById('playPause').className = 'play';
        document.getElementById('pauseScreen').className = 'overlay';
		document.getElementById('exit').className = 'exitHide';
        requestAnimationFrame(drawGame);
    }
}

const soundMute = function() {
	if (!gameMusic.mute) {
		gameMusic.stop();
		document.getElementById('soundMute').className = 'mute';
		gameMusic.mute = true;
	} else {
		gameMusic.play();
		document.getElementById('soundMute').className = 'sound';
		gameMusic.mute = false;
	}
}

const foundAllKeys = function() {
	document.getElementById('bedTime').className = 'overlay show';
	document.querySelector('#bedTime .moreAwake').className = 'moreAwake show';

	setTimeout(() => {
		document.querySelector('#bedTime .findBed').className = 'findBed show';
		document.querySelector('#bedTime .moreAwake').className = 'moreAwake hide';

		setTimeout(() => {
			document.querySelector('#bedTime .findBed').className = 'findBed hide';
			document.getElementById('bedTime').className = 'overlay';

			setTimeout(() => {
				document.querySelector('#bedTime .moreAwake').className = 'moreAwake';
				document.querySelector('#bedTime .findBed').className = 'findBed';
			}, 2000);
			
		}, 3100);

	}, 3100);
}

const wakeUp = function() {
	setTimeout(() => {
		play = false;
		document.querySelector('#winScreen .winOverlay').className = 'winOverlay day';

		let music = document.getElementById('gameMusic');

		let counter = 1;

		let checkVol = function () {
			counter -= 0.1;
			if (counter > 0) {
				music.volume = counter;
			} else {
				music.volume = 0;
				morningBirds.play();
				clearInterval(lowerVol);
			}			
		}

		var lowerVol = setInterval(checkVol , 650);

		setTimeout(() => {
			document.querySelector('#winScreen .winOverlay').className = 'winOverlay';
			document.querySelector('#winScreen .winImage').style.display = 'block';

			setTimeout(() => {
				document.querySelector('#winScreen .winImage').className = 'winImage open';
				document.querySelector('#winScreen .winImage #playAgain').className = 'show';

				setTimeout(() => {
					document.querySelector('#winScreen .winImage #levelReSelect').className = 'show';
				}, 1000);
			}, 2500);

		}, 8000)

	}, 1000);
}

const gameOver = function() {
	play = false;
	player.velocity_x = 0, player.velocity_y = 0;
	document.getElementById('gameOver').className = 'overlay show';
	
	setTimeout(() => {
		document.querySelector('#canvasSection #gameOver #tryAgain').className = 'show';
		document.querySelector('#canvasSection #gameOver h2').style.marginBottom  = '25px';
	}, 1600);
}

const restart = function() {
	document.getElementById('gameOver').className = 'overlay';
	document.querySelector('#canvasSection #gameOver #tryAgain').className = '';
	document.querySelector('#canvasSection #gameOver h2').style.marginBottom = '0px';
	document.getElementById('winScreen').className = 'hide';
	setTimeout(() => {
		document.querySelector('#winScreen .winImage').style.display = 'none';
		document.querySelector('#winScreen .winImage').className = 'winImage';
		document.querySelector('#winScreen .winImage #playAgain').className = '';
		document.querySelector('#winScreen .winImage #levelReSelect').className = '';
		document.getElementById('winScreen').className = '';
	}, 1000);

	morningBirds.stop();
	music = document.getElementById('gameMusic').volume = 1;
	player.x = map.spawnX * scale, player.y = map.spawnY * scale, player.oil = 1000, player.light = true, player.frameY = 0, player.direction = 'right', player.keysFound = 0, player.won = false, player.speed = 0.7;
	play = true, foundKeys = false;
	currentSecond = 0, frameCount = 0, totalFrames = 0, framesLastSecond = 0, lastFrameTime = 0;
	allItems = [];
	map.itemsCoordinates.forEach((element) => {
		allItems.push(new Item(element.x, element.y, scale, element.type));
	});
	requestAnimationFrame(drawGame);
}

const changeLevel = function() {
	document.querySelector('body').className = 'scroll';
	window.scrollTo(0, 0);
	document.getElementById('gameOver').className = 'overlay';
	document.querySelector('#canvasSection #gameOver #tryAgain').className = '';
	document.querySelector('#canvasSection #gameOver h2').style.marginBottom = '0px';
	document.getElementById('winScreen').className = 'hide';
	document.getElementById('canvasSection').className = 'intro hidden';
	document.getElementById('playPause').className = 'play';
    document.getElementById('pauseScreen').className = 'overlay';
	document.getElementById('exit').className = 'exitHide';
	setTimeout(() => {
		document.querySelector('#winScreen .winImage').style.display = 'none';
		document.querySelector('#winScreen .winImage').className = 'winImage';
		document.querySelector('#winScreen .winImage #playAgain').className = '';
		document.querySelector('#winScreen .winImage #levelReSelect').className = '';
		document.getElementById('winScreen').className = '';

		document.getElementById('instructions').className = 'intro hidden';
		document.getElementById('levelSelection').className = 'intro';
	}, 1000);

	morningBirds.stop();
	player.x = map.spawnX * scale, player.y = map.spawnY * scale, player.oil = 1000, player.frameY = 0, player.direction = 'right', player.keysFound = 0, player.won = false, player.speed = 0.7;
	play = true, foundKeys = false;
	currentSecond = 0, frameCount = 0, totalFrames = 0, framesLastSecond = 0, lastFrameTime = 0;
	allItems = [];
}

const update = function (modifier) {
	if (keysDown[37] === true || keysDown[65] === true) { // Player holding left
		player.moveLeft();
	}
	if (keysDown[38] === true || keysDown[87] === true) { // Player holding up
		player.moveUp();
	}
	if (keysDown[39] === true || keysDown[68] === true) { // Player holding right
		player.moveRight();
	}
	if (keysDown[40] === true || keysDown[83] === true) { // Player holding down
		player.moveDown();
	}
};

const createMap = function(layer, colide, width, height) {
    //Get the min and max column and row in the map to draw. For the min column and row (x and y) we use floor to round down and for the max we use ceil to round up. We want to get the rows and columns under the borders of the viewport rectangle. This is visualized by the white square in the example.
    let x_min = Math.floor(viewport.x / (tilesize * scale));
    let y_min = Math.floor(viewport.y / (tilesize * scale));
    let x_max = Math.ceil((viewport.x + viewport.w) / (tilesize * scale));
	let y_max = Math.ceil((viewport.y + viewport.h) / (tilesize * scale));

	//Draw map
	for (let x = x_min; x < x_max; x++) { //for (let x = 0; x < mapW; x++) { for (let x = x_min; x < x_max; x++) {

		for (let y = y_min; y < y_max; y++) { //for (let y = 0; y < mapH; y++) { for (let y = y_min; y < y_max; y++) {

			let value = layer[y * mapW + x] - 1;
			let tileX = Math.floor(x * tilesize * scale - viewport.x + width * 0.5 - viewport.w * 0.5);// Tile x destination for drawing
			let tileY = Math.floor(y * tilesize * scale - viewport.y + height * 0.5 - viewport.h * 0.5);// Tile y destination for drawing

			ctx.drawImage(mapTileSheet, value * tilesize, 0, tilesize, tilesize, tileX, tileY, tilesize * scale, tilesize * scale);
			
			if (colide && value !== 0) {

				let tile = {
					x:tileX,
					y: tileY,
					width: tilesize * scale,
					height: tilesize * scale
				}

				player.tileCollision(tile, width, height);

			} 

		}

	}

}

const placeObjects = function(objects, width, height, notSheets) {
	let x_min = Math.floor(viewport.x / (tilesize * scale));
	let y_min = Math.floor(viewport.y / (tilesize * scale));
	let x_max = Math.ceil((viewport.x + viewport.w) / (tilesize * scale));
	let y_max = Math.ceil((viewport.y + viewport.h) / (tilesize * scale));

    for (let index = 0; index < objects.length; index++) {

		if (objects[index]) {
			
			let x = objects[index].coordX;
			let y = objects[index].coordY;
	
			if (x_min <= x && x < x_max && y_min <= y && y < y_max) {
				let tileX = Math.floor(objects[index].coordX * tilesize * scale - viewport.x + width * 0.5 - viewport.w * 0.5);// Tile x destination for drawing
				let tileY = Math.floor(objects[index].coordY * tilesize * scale - viewport.y + height * 0.5 - viewport.h * 0.5);// Tile y destination for drawing

				if (notSheets) {
					if (objects[index].type === 'bed' && foundKeys) {
						objects[index].draw(0, 32,tileX , tileY, ctx);
					} else if (objects[index].type === 'key') {
						objects[index].draw((Math.round((totalFrames/24)%9)) * 32, 64,tileX , tileY, ctx);
					} else if (objects[index].type === 'oil') {
						objects[index].draw((Math.round((totalFrames/8)%9)) * 32, 0,tileX , tileY, ctx);
					}
	
					player.objectCollision(objects, index, width, height);					
				} else if (objects[index].type === 'bed' && foundKeys) {
					objects[index].draw(32, 32,tileX , tileY, ctx);
				}


			}

		}

	}
}

const sound = function(src, id, loop) {
	this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.setAttribute("id", id);
	this.sound.loop = loop;
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
	this.mute = false;
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}