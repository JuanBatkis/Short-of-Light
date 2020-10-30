class Viewport {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    scrollTo(x, y) {
        this.x = x - this.w * 0.5;
        this.y = y - this.w * 0.5;
    }
}

class Character {
    constructor(x, y, scale, speed) {
        this.width = 32*scale;
        this.height = 32*scale;
        this.scale = scale;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.velocity_x = 0;
        this.velocity_y = 0;
        this.friction = 0.8;
        this.ctx = null; //Later asigned in main.js
        this.oil = 1000;
        this.frame = 0;
        this.frameX = 0; //Sprite sheet X position
        this.frameY = 0; //Sprite sheet Y position
        this.direction = 'right';
        this.keysFound = 0;
        this.won = false;

        // Load the image
        const cImg = new Image();
        cImg.addEventListener('load', () => {
            this.cImg = cImg;
        });
        cImg.src = './assets/character-sprite-sheet-2.png';
    }

    moveLeft() {
        this.velocity_x -= this.speed;
    }
    moveRight() {
        this.velocity_x += this.speed;
    }
    moveUp() {
        this.velocity_y -= this.speed;
    }
    moveDown() {
        this.velocity_y += this.speed;
    }

    update() {
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    }

    slowMovement() {
        this.velocity_x *= this.friction;
        this.velocity_y *= this.friction;
    }

    tileCollision(tile, width, height) {
        const playerX = (width - this.width)/2, playerY = (height + this.height)/2 + this.height/4;
    
        const vX = playerX + this.width / 2 - (tile.x + tile.width / 2),
            vY = playerY - this.height / 2 - (tile.y + tile.height / 2),
    
            // Add the half widths and half heights of the objects
            hWidths = (this.width - this.height/4) / 2 + tile.width / 2,
            hHeights = (this.height - 0) / 4 + tile.height / 2;
    
        // If the player and the tile are less than the half width or half height, then we must be inside the tile, causing a collision
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    
            // offsetX and offsetY - Figures out on which side we are colliding with (top, bottom, left, or right)
            const oX = hWidths - Math.abs(vX), oY = hHeights - Math.abs(vY);
            var direction = null;
    
            if (oX >= oY) {
                if (vY > 0) {
                    direction = "top";
                    this.y += oY;
                } else {
                    direction = "bottom";
                    this.y -= oY;
                }
            } else {
                if (vX > 0) {
                    direction = "left";
                    this.x += oX;
                } else {
                    direction = "right";
                    this.x -= oX;
                }
            }
        }
    
        if (direction === "left" || direction === "right") {
            this.velocity_x = 0 // Prevents lateral movement
        }
        if (direction === "bottom" || direction === "top") {
            this.velocity_y = 0; // Prevents vertical movement
        }
    }

    objectCollision(objects, index, width, height) {
        const playerX = (width - this.width)/2, playerY = (height + this.height)/2 + this.height/4;
    
        const vX = playerX + this.width / 2 - (objects[index].xCol + objects[index].wCol / 2),
            vY = playerY - this.height / 2 - (objects[index].yCol + objects[index].hCol / 2),
    
            // Add the half widths and half heights of the objects
            hWidths = (this.width - this.height/4) / 2 + objects[index].wCol / 2,
            hHeights = (this.height - 0) / 4 + objects[index].hCol / 2;
    
    
        // If the player and the object are less than the half width or half height, then we must be inside the object, causing a collision
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
            if (objects[index].type === 'bed') {
                this.won = true;
            } else if (objects[index].type === 'key') {
                this.keysFound++;
                delete objects[index];
            } else if (objects[index].type === 'oil') {
                this.oil = 1000;
                oilSound.play();
                delete objects[index];
            }
        }
    
    }

    draw(x, y, keysDown) {
        this.slowMovement();
        this.update();

        let absVelocity = Math.round(Math.max(Math.abs(this.velocity_x), Math.abs(this.velocity_y)));

        if (keysDown[37] === true || keysDown[65] === true) { // Player holding left
            this.frameY = 32;
            this.direction = 'left';
        }
        if (keysDown[38] === true || keysDown[87] === true) { // Player holding up
            this.frameY = 64;
            this.direction = 'up';
        }
        if (keysDown[39] === true || keysDown[68] === true) { // Player holding right
            this.frameY = 0;
            this.direction = 'right';
        }
        if (keysDown[40] === true || keysDown[83] === true) { // Player holding down
            this.frameY = 0;
            this.direction = 'down';
        }

        if ((keysDown[37] === true || keysDown[65] === true) && (keysDown[40] === true || keysDown[83] === true)) { // Player holding left and down
            this.frameY = 32;
            this.direction = 'leftDown';
        }
        if ((keysDown[37] === true || keysDown[65] === true) && (keysDown[38] === true || keysDown[87] === true)) { // Player holding left and up
            this.frameY = 64;
            this.direction = 'leftUp';
        }
        if ((keysDown[39] === true || keysDown[68] === true) && (keysDown[40] === true || keysDown[83] === true)) { // Player holding right and down
            this.frameY = 0;
            this.direction = 'rightDown';
        }
        if ((keysDown[39] === true || keysDown[68] === true) && (keysDown[38] === true || keysDown[87] === true)) { // Player holding right and up
            this.frameY = 96;
            this.direction = 'rightUp';
        }

        if (absVelocity === 0) { //Player is not moving
            this.frameX = 0;
            this.frame = 0;
        } else {
            this.frame += absVelocity/20;
            this.frameX = (Math.round(this.frame%9)) * 32;
        }

        this.ctx.drawImage(this.cImg, this.frameX, this.frameY, 32, 31.99, x - 1*this.scale, y, this.width, this.height);

    }

}

class Light {
    constructor(scale, x, y, pWidth, pHeight) {
        this.width = 79*scale;
        this.height = 79*scale;
        this.scale = scale;
        this.x = x;
        this.y = y;
        this.pWidth = pWidth;
        this.pHeight = pHeight;
        this.xPos = this.x;
        this.yPos = this.y - this.height/2 + this.pHeight/2;
        this.ctx = null;
        this.frameX = 237; //Sprite sheet X position
        this.frameY = 0; //Sprite sheet Y position

        // Load the image
        const lImg = new Image();
        lImg.addEventListener('load', () => {
            this.lImg = lImg;
        });
        lImg.src = './assets/light-sprite-sheet.png';
        const mImg = new Image();
        mImg.addEventListener('load', () => {
            this.mImg = mImg;
        });
        mImg.src = './assets/light-multiply-sprite-sheet.png';
    }

    draw(x, y, toDraw, platerDirection) {
        this.x = x;
        this.y = y;

        if (platerDirection === 'left') { // Player holding left
            this.frameX = 158;
            this.yPos = this.y - this.height/2 + this.pHeight/2;
            this.xPos = this.x - this.width + this.pWidth;
        }
        if (platerDirection === 'up') { // Player holding up
            this.frameX = 0;
            this.yPos = this.y - this.height + this.pHeight;
            this.xPos = this.x - this.width/2 + this.pWidth/2;
        }
        if (platerDirection === 'right') { // Player holding right
            this.frameX = 237;
            this.yPos = this.y - this.height/2 + this.pHeight/2;
            this.xPos = this.x;
        }
        if (platerDirection === 'down') { // Player holding down
            this.frameX = 79;
            this.yPos = this.y;
            this.xPos = this.x - this.width/2 + this.pWidth/2;
        }
        if (platerDirection === 'leftDown') { // Player holding left and down
            this.frameX = 553;
            this.yPos = this.y;
            this.xPos = this.x - this.width + this.pWidth;
        }
        if (platerDirection === 'leftUp') { // Player holding left and up
            this.frameX = 395;
            this.yPos = this.y - this.height + this.pHeight;
            this.xPos = this.x - this.width + this.pWidth;
        }
        if (platerDirection === 'rightDown') { // Player holding right and down
            this.frameX = 474;
            this.yPos = this.y;
            this.xPos = this.x;
        }
        if (platerDirection === 'rightUp') { // Player holding right and up
            this.frameX = 316;
            this.yPos = this.y - this.height + this.pHeight;
            this.xPos = this.x;
        }

        if (toDraw === 'light') {
            this.ctx.drawImage(this.lImg,this.frameX, this.frameY, 79, 79, this.xPos - 1*this.scale, this.yPos, this.width, this.height);
        } else {
            this.ctx.drawImage(this.mImg,this.frameX, this.frameY, 79, 79, this.xPos - 1*this.scale, this.yPos, this.width, this.height);
        }

    }
}

class Item {
    constructor(coordX, coordY, scale, type) {
        this.width = 32;
        this.height = 32;
        this.coordX = coordX;
        this.coordY = coordY;
        this.scale = scale;
        this.xCol = 0;
        this.yCol = 0;
        this.wCol = 0;
        this.hCol = 0;
        this.type = type;

        const iImg = new Image();
        iImg.addEventListener('load', () => {
            this.iImg = iImg;
        });
        iImg.src = './assets/items-sprite-sheet.png';
    }

    draw(x, y, tileX, tileY, ctx) {

        if (this.type === 'bed') {
            ctx.drawImage(this.iImg, x, y, this.width, this.height, tileX - this.width * this.scale * 0.2, tileY - this.width * this.scale * 0.2, this.width * this.scale + this.width * this.scale * 0.4, this.height * this.scale + this.width * this.scale * 0.4);            
        } else {
            ctx.drawImage(this.iImg, x, y, this.width, this.height, tileX, tileY, this.width * this.scale, this.height * this.scale);
        }

        this.xCol = tileX + (this.width * this.scale)/3;
        this.yCol = tileY + (this.height * this.scale)/3;
        this.wCol = (this.width * this.scale) - (this.width * this.scale)/3*2;
        this.hCol = (this.height * this.scale) - (this.height * this.scale)/3*2;
    }
}