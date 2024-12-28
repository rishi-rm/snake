//board
const boxSize = 25
const rows = 30
const cols = 30
const screenWidth = window.screen.width
const screenHeight = window.screen.height
const windowHeight = boxSize * rows
const windowWidth = boxSize * cols
console.log(screenHeight)
console.log(Math.floor(screenHeight/2) - (cols*boxSize))
console.log(screenWidth)
console.log(Math.floor(screenWidth/2) - (rows*boxSize))

const gameOverDiv = document.querySelector(".gameover")
gameOverDiv.style.display = 'none'

var board
var context

let score = 0

directionLocked = false

//snake head
var snakeX = boxSize * 5
var snakeY = boxSize * 5

var velocityX = 0 
var velocityY = 0

var snakeBody = []
var gameOver = false

//food
var foodX
var foodY


window.onload = function(){
    board = document.getElementById("board")
    board.height = rows * boxSize
    board.width = cols * boxSize
    context = board.getContext("2d")
    placeFood()
    document.addEventListener("keydown",changeDirection)
    setInterval(update, 1000/10)
}

function update(){
    if(gameOver){
        document.addEventListener("keyup",function restart(e){
            if(e.code === "Space"){
                score = 0
                directionLocked = false
                snakeX = boxSize * 5
                snakeY = boxSize * 5
                velocityX = 0
                velocityY = 0
                snakeBody = []
                gameOver = false
                placeFood()
                gameOverDiv.style.display = 'none'
                document.removeEventListener("keyup",restart)
            }
        })
        return
    }
    context.fillStyle = "black"
    context.fillRect(0, 0, board.width, board.height)
    
    context.fillStyle = "red"
    context.fillRect(foodX, foodY, boxSize, boxSize )

    //food collision
    if((snakeX == foodX) && (snakeY == foodY)){
        snakeBody.push([foodX,foodY])
        score++
        placeFood()
    }

    for(let i = snakeBody.length-1; i > 0; i--){
        snakeBody[i] = snakeBody[i-1]
    }

    if(snakeBody.length){
        snakeBody[0] = [snakeX,snakeY]
    }
    context.fillStyle = "lime"
    snakeX += velocityX * boxSize
    snakeY += velocityY * boxSize

    //snake body collision
    for(let i = 1; i < snakeBody.length; i++)
        {
            if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
                gameOver = true
                document.querySelector("h3").textContent = `Score : ${score}`
                gameOverDiv.style.display = 'block'
                return
            }
        }

    // Wall collision
    if(snakeX < 0 || snakeX >= windowWidth || snakeY < 0 || snakeY >= windowHeight){
        gameOver = true
        document.querySelector("h3").textContent = `Score : ${score}`
        gameOverDiv.style.display = 'block'
        return
    }

    context.fillRect(snakeX, snakeY, boxSize, boxSize )
    for(let i = 0; i < snakeBody.length; i++){
        context.fillRect(snakeBody[i][0], snakeBody[i][1], boxSize, boxSize)
    }
    directionLocked = false
}

function placeFood(){
    let flag = true
    while(flag){
        foodX = Math.floor(Math.random() * cols) * boxSize    
        foodY = Math.floor(Math.random() * cols) * boxSize
        flag = false
        for(let i = 0; i < snakeBody.length; i++)
        {
            if(foodX == snakeBody[i][0] && foodY == snakeBody[i][1]){
                flag = true
                break
            }
        }
    }
}

function changeDirection(e){
    if(directionLocked){
        return
    }
    e.preventDefault()
    if(e.code == "ArrowUp" && velocityY != 1){
        velocityX = 0
        velocityY = -1
    }
    else if(e.code == "ArrowDown" && velocityY != -1){
        velocityX = 0
        velocityY = 1
    }
    else if(e.code == "ArrowLeft" && velocityX != 1){
        velocityX = -1
        velocityY = 0
    }
    else if(e.code == "ArrowRight" && velocityX != -1){
        velocityX = 1
        velocityY = 0
    }
    directionLocked = true
}


//blink animation
setInterval(blink,750)

function blink(){
    const restartElement = document.querySelector(".restart");
    if (restartElement.style.visibility === 'hidden') {
        restartElement.style.visibility = 'visible';
    } 
    else {
        restartElement.style.visibility = 'hidden';
    }
}