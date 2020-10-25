let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = document.documentElement.clientWidth*1;
        this.canvas.height = document.documentElement.clientHeight*1;
        this.context = this.canvas.getContext("2d");
        document.getElementById('canvasSection').appendChild(this.canvas);
    },
};

myGameArea.start();

const map = levels[0];

let ctx = null, mapW = map.width, mapH = map.height, scale = 3, level = 0, difficulty = 20, play = true;

let height = document.documentElement.clientHeight*0.95;
let width = document.documentElement.clientWidth*0.95;
let oilJar = null

let currentSecond = 0, frameCount = 0, totalFrames = 0, framesLastSecond = 0, lastFrameTime = 0;

let keysDown = {
	37 : false,
	38 : false,
	39 : false,
	40 : false,
	65 : false,
	87 : false,
	68 : false,
	83 : false
},
keys = [37,	38,	39,	40,	65,	87,	68,	83];

let player = new Character(map.spawnX * scale, map.spawnY * scale, scale, 1);
let viewport = new Viewport(0, 0, 200, 200);
let oilJars = {};
for (let index = 0; index < map.oil; index++) {
	oilJars[index] = new Item(scale);
}

let loadedImgs = 0
let mapTileSheet = new Image();
mapTileSheet.addEventListener('load', (event) => { loadedImgs++ });
mapTileSheet.src = './../assets/wall-sprites-new.png';
let oilSpriteSheet = new Image();
oilSpriteSheet.addEventListener('load', (event) => { loadedImgs++ });
oilSpriteSheet.src = './../assets/oil-sprite-sheet.png';

window.onload = function() {
    ctx = myGameArea.context;
	ctx.imageSmoothingEnabled = false;

	player.ctx = ctx;
	oilJar = document.querySelector('#canvasSection .oilCont .oilJar .oil');

	if(loadedImgs === 2) drawGame();

	ctx.font = "10pt sans-serif";

	document.getElementById('playPause').onclick = () => {
		playPause();
	};

	document.getElementById('tryAgain').onclick = () => {
		restart();
	};
	
	document.onkeydown = function(e) {
        if(keys.includes(e.keyCode)) {
            keysDown[e.keyCode] = true;
		}
		
		if (e.keyCode === 27) {
			playPause();
		}
    };

    document.onkeyup = function(e) {
		if(keys.includes(e.keyCode)) {
            keysDown[e.keyCode] = false;
        }
	};

	
}

const drawGame = function() {

	if(ctx==null) { return; }

	//Resize canvas on every frame
	let height = document.documentElement.clientHeight*1;
	let width = document.documentElement.clientWidth*1;
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
	
	//Deplete oil left based on difficulty
	player.oil -= 0.1 * difficulty;
	oilJar.style.height = (player.oil/10).toFixed(1) + '%';

	if (player.oil <= 0) {
		//gameOver();
	}

	//Update buttons status
	update();

	//Make the camera follow the player
	viewport.scrollTo(player.x, player.y)

	//Draw main map
	createMap(map.mapMain, true, width, height);
	placeObjects(map.mapOil, width, height);

	//Draw player
	player.draw(width * 0.5 - viewport.w * 0.25, height * 0.5 - viewport.h * 0.25, keysDown);

	//Draw arches
	createMap(map.mapArches, false, width, height);

	ctx.fillStyle = '#ff0000';
	ctx.fillText('FPS: ' + framesLastSecond, 10, 60);

	/* ctx.strokeStyle = '#ffffff';
	ctx.rect(width * 0.5 - viewport.w * 0.5, height * 0.5 - viewport.h * 0.5, viewport.w, viewport.h);
	ctx.stroke(); */

	//ctx.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);

	if(play) requestAnimationFrame(drawGame);

}