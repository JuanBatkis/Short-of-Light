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

        // Load the image
        const cImg = new Image();
        cImg.addEventListener('load', () => {
            // Once image loaded => draw
            this.cImg = cImg;
            //this.draw();
        });
        cImg.src = './../assets/character-sprite-sheet-2.png';
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
    
        /* ctx.beginPath();
        ctx.arc(playerX, playerY, 10, 0, 2 * Math.PI);
        ctx.fill(); */
    
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
            this.oil = 1000;
            oilSound.play();
            delete objects[index];
        }
    
    }

    draw(x, y, keysDown) {
        this.slowMovement();
        this.update();

        let absVelocity = Math.round(Math.max(Math.abs(this.velocity_x), Math.abs(this.velocity_y)));

        if (keysDown[37] === true || keysDown[65] === true) { // Player holding left
            this.frameY = 32;
        }
        if (keysDown[38] === true || keysDown[87] === true) { // Player holding up
            this.frameY = 64;
        }
        if (keysDown[39] === true || keysDown[68] === true) { // Player holding right
            this.frameY = 0;
        }
        if (keysDown[40] === true || keysDown[83] === true) { // Player holding down
            this.frameY = 0;
        }

        if ((keysDown[37] === true || keysDown[65] === true) && (keysDown[40] === true || keysDown[83] === true)) { // Player holding left and down
            this.frameY = 32;
        }
        if ((keysDown[37] === true || keysDown[65] === true) && (keysDown[38] === true || keysDown[87] === true)) { // Player holding left and up
            this.frameY = 64;
        }
        if ((keysDown[39] === true || keysDown[68] === true) && (keysDown[40] === true || keysDown[83] === true)) { // Player holding right and down
            this.frameY = 0;
        }
        if ((keysDown[39] === true || keysDown[68] === true) && (keysDown[38] === true || keysDown[87] === true)) { // Player holding right and up
            this.frameY = 96;
        }

        if (absVelocity === 0) { //Player is not moving
            this.frameX = 0;
            this.frame = 0;
        } else {
            this.frame += absVelocity/20;
            this.frameX = (Math.round(this.frame%9)) * 32;
        }

        this.ctx.drawImage(this.cImg, this.frameX, this.frameY, 32, 31.99, x, y, this.width, this.height);

        /* this.ctx.rect(x + 3 * this.scale, y + this.height, this.width - 3 * this.scale * 2, - this.height / 4);
        this.ctx.stroke(); */
    }

}

class Item {
    constructor(coordX, coordY, scale) {
        this.width = 32;
        this.height = 32;
        this.coordX = coordX;
        this.coordY = coordY;
        this.scale = scale;
        this.xCol = 0;
        this.yCol = 0;
        this.wCol = 0;
        this.hCol = 0;

        const iImg = new Image();
        iImg.addEventListener('load', () => {
            this.iImg = iImg;
        });
        iImg.src = './../assets/oil-sprite-sheet.png';
    }

    draw(x, tileX, tileY, ctx) {
        ctx.drawImage(this.iImg, x, 0, this.width, this.height, tileX, tileY, this.width * this.scale, this.height * this.scale);

        this.xCol = tileX + (this.width * this.scale)/3;
        this.yCol = tileY + (this.height * this.scale)/3;
        this.wCol = (this.width * this.scale) - (this.width * this.scale)/3*2;
        this.hCol = (this.height * this.scale) - (this.height * this.scale)/3*2;
    }
}