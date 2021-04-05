const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
window.onload = () => {

// Variable
let gameOver = false;
let score = 0
let player;
let gravity;
let gameSpeed;
let keys = {};
ctx.font = '30px AlegreyaSansSC-Black';
ctx.textAlign = 'center'
ctx.textBaseline = 'middle'
ctx.fillStyle = "white"

// Event Listeners
document.addEventListener('keydown', (evt) => {
    keys[evt.code] = true;
});
document.addEventListener('keyup', (evt) => {
    keys[evt.code] = false;
});



//Flower animation

const images = {}
images.flower = new Image()
images.flower.src = '/Images/flower-01.png'

const flowerWidth = 709.9
const flowerHeigth = 877
let flowerFrameX = 0
let flowerFrameY = 0
let flowerX = 450
let flowerY = 60

const drawSprite = (img, sX, sY, sW, sH, dX, dY, dW, dH) => {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

//Animation flower
let counter = 0
const animate = () => {
    drawSprite(images.flower, (flowerWidth * flowerFrameX), (flowerHeigth * flowerFrameY), flowerWidth, flowerHeigth, flowerX, flowerY, 250, 350)
    if (flowerFrameX < 20) {
        counter++
        if (counter === 4) {
            flowerFrameX += 1
            counter = 0
        }
    } else {
        flowerFrameX = 0
    }
}


// Player
class Player {
    constructor() {
        this.x = 30;
        this.y = 0;
        this.w = 60;
        this.h = 80;
        this.img = new Image()
        this.img.src = '/Images/cuphead.png'
        this.imgL = new Image()
        this.imgL.src = '/Images/cuphead left.png'
        this.dy = 0;
        this.jumpForce = 15;
        this.originalHeight = 260;
        this.grounded = false;
        this.jumpTimer = 0
    }

    Animate() {
        // Jump
        if (keys['Space'] || keys['KeyW']) {
            this.Jump();
        } else {
            this.jumpTimer = 0;
        }
        if (keys['ArrowLeft']) {
            this.x -= 5;
        this.drawLeft()

        }
        if (keys['ArrowRight']) {
            this.x += 5;
        }

        this.y += this.dy;

        // Gravity
        if (this.y + this.h < canvas.height - 90) {
            this.dy += gravity;
            this.grounded = false;

        } else {
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.h - 90;
        }

        this.Draw();
    }

    Jump() {

        if (this.grounded && this.jumpTimer == 0) {
            this.jumpTimer = 1;
            this.dy = -this.jumpForce;
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
            this.jumpTimer++;
            this.dy = -this.jumpForce - (this.jumpTimer / 50);
        }
    }

    Draw() {
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        ctx.closePath();
    }

    drawLeft() {
        ctx.beginPath();
        ctx.drawImage(this.imgL, this.x, this.y, this.w, this.h);
        ctx.closePath();
    }

}

// Enemy
class Seeds {
    constructor() {
        this.width = 40
        this.height = 30
        this.x = 500
        this.y = Math.floor(Math.random() * ((400 - this.width) - 65)) + 65
        this.damage = 25
        this.img = new Image()
        this.img.src = '/Images/Acorn_01.png'
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }

    moveSelf() {
        this.x -= 5
    }
}
// Start game

function Start() {
    gameSpeed = 3;
    gravity = 1;
    player = new Player()
    requestAnimationFrame(Update);
}

// Seeds
let counterSeeds = 0
let arrayOfSeeds = []
const createSeeds = () => {
    counterSeeds++
    if (counterSeeds === 45) {
        const seed = new Seeds()
        arrayOfSeeds.push(seed)
        counterSeeds = 0
    }

}

const drawSeeds = () => {
    arrayOfSeeds.forEach(seed => {
        seed.draw()
    })
}

const moveSeeds = () => {
    arrayOfSeeds.forEach(seed => {
        seed.moveSelf()
    })
}


// Game Over


    
    let img = new Image()
    img.src = '/Images/game-over.png' 
       
     /* ctx.fillText(`GAME OVER`, ctx.canvas.width / 2, ctx.canvas.height / 2)  */


const renderScore = () => {
    ctx.fillText(`Score: ${score}`, 150, 50)
}
//Colision

const checkCollision = () => {
    arrayOfSeeds.forEach((seed) => {
        if (seed.x === player.x) {
            let seedYandH = seed.y + seed.height
            let playerYandH = player.y + player.h
            //Comprueba por arriba || comprueba por abajo || comprueba de frente
            if ((seedYandH > player.y && seed.y < player.y )|| (seed.y < playerYandH && seedYandH > playerYandH) || 
            (player.y < seed.y && playerYandH > seedYandH)) { 
                /* backgroundAudio.pause()
                crashAudio.play() */
                gameOver = true;
                ctx.drawImage(img, 200 , 35, 400, 400)
                
                
            } else {
                score += 10
               
            }
        }
    })
}
//Check borders

const checkBorders = () => {
    if (player.x > 740) {
        player.x = 740
    }
    if (player.x < 40) {
        player.x = 40
    }
}
// Clear canvas
const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//Loop
function Update() {
    if(!gameOver){
    clearCanvas()
    player.Animate()
    animate()
    createSeeds()
    drawSeeds()
    moveSeeds()
    checkBorders()
    checkCollision()
    renderScore()
    gameSpeed += 0.003;
    requestAnimationFrame(Update)
}
}
// Start game button
let gameStarted = false
document.getElementById('start-button').onclick = () => {
    if (!gameStarted) {
        gameStarted = true
        Start()
    }
};
//Pause game button
let gamePaused = false


document.getElementById('pause-button').onclick = () =>{
    if (!gamePaused) {
      gamePaused = true;
    } else if (gamePaused) {
        if(!gameStarted){
        gameStarted = true
        Start();
    }
      gamePaused = false;
    }
    
}

}



