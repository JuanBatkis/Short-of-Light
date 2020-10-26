const playPause = function() {
    if(play) {
		play = false;
		gameMusic.stop();
        document.getElementById('playPause').className = 'pause';
        document.getElementById('pauseScreen').className = 'overlay show';
    } else {
		play = true;
		gameMusic.play();
        document.getElementById('playPause').className = 'play';
        document.getElementById('pauseScreen').className = 'overlay';
        requestAnimationFrame(drawGame);
    }
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
	player.x = map.spawnX * scale, player.y = map.spawnY * scale, player.oil = 1000;
	play = true;
	requestAnimationFrame(drawGame);
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
	for (let x = x_min; x < x_max; x++) { //for (let x = 0; x < mapW; x++) {

		for (let y = y_min; y < y_max; y++) { //for (let y = 0; y < mapH; y++) {

			let value = layer[y * mapW + x] - 1;
			let tileX = Math.floor(x * tilesize * scale - viewport.x + width * 0.5 - viewport.w * 0.5);// Tile x destination for drawing
			let tileY = Math.floor(y * tilesize * scale - viewport.y + height * 0.5 - viewport.h * 0.5);// Tile y destination for drawing

			ctx.drawImage(mapTileSheet, value * tilesize, 0, tilesize, tilesize, tileX, tileY, tilesize * scale, tilesize * scale);
			
			if (colide && value !== 0) {
				/* ctx.fillStyle = "#ff0000";
				ctx.textAlign =  "start";
				ctx.textBaseline = "top"
				ctx.fillText(tileX + ' ' + tileY, tileX, tileY);
				ctx.textBaseline = "bottom";
				ctx.fillText(tileX + ' ' + tileY + tilesize * scale, tileX, tileY + tilesize * scale);
				ctx.fillStyle = "blue";
				ctx.textAlign =  "end";
				ctx.textBaseline = "top"
				ctx.fillText(tileX + tilesize * scale + ' ' + tileY, tileX + tilesize * scale, tileY);
				ctx.textBaseline = "bottom";
				ctx.fillText(tileX + tilesize * scale + ' ' + tileY + tilesize * scale, tileX + tilesize * scale, tileY + tilesize * scale); */

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

const placeObjects = function(objects, width, height) {
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
		
				objects[index].draw((Math.round((totalFrames/8)%9)) * 32,tileX , tileY, ctx);			
				player.objectCollision(objects, index, width, height);
			}

		}

	}
}

const sound = function(src, loop) {
	this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.loop = loop;
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}