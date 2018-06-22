
//USER INPUT

let letterPool = "";

//Get a string of letters from user and display it on top
function submitted(){

    //remove nonalphanumeric characters, leaves only letters and digits
    var userInput = document.getElementById("userInput").value;
    string = userInput.replace(/[^A-Za-z0-9]/g, '');

    //make sure text field is not empty
    try {
    	if(string == "") throw err;
    }
    catch(err) {
    	alert("Input not valid! >:(");
		return;
    }

	//replace inquiry section with user's input
    document.getElementById("letters").innerHTML = userInput;
    document.getElementById("letters").style["letter-spacing"] = "6px";
    document.getElementById("letters").style["font-size"] = "1.5em";
    document.getElementById("tetris").style["border"] = "solid .1em white";
    document.getElementById("soundtrack").play();

    //store characters in a vector
    letterPool = [...string];
    //Capitalize every letter
    for(var i = 0; i < letterPool.length; i++) {
    	letterPool[i] = letterPool[i].toUpperCase();
    }

    //TODO: ASK USER FOR SIZE AND SET ACCORDINGLY
    setCanvasSize();

    startGame();
}


//CANVAS AND ARENA/////////////////////

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

//Used to create the arena
function createMatrix(w, h) {
	const matrix = [];
	//while h < 0, decrease by 1
	while(h--) {
		matrix.push(new Array(w).fill(0));
	}
	return matrix; 
}

var arena = createMatrix(12,20);

//Consistently checks whether a row is filled, and replaces filled rows with empty rows
function arenaSweep() {
	outer: for(let y = arena.length - 1; y >= 0; --y) {
		for(let x = 0; x < arena[y].length; ++x) {
			if(arena[y][x] === 0) {
				continue outer;
			}
		}

		const row = arena.splice(y, 1)[0].fill(0);
		arena.unshift(row);
		++y;

		//Score increase
		player.rows += 1;
		player.score += player.multiplier * 10;
		//Update high score
		if(player.score >= player.highScore) {
			player.highScore = player.score;
			document.getElementById('highScore').innerText = "Best Score: " + player.score;
		}

		//Change in score doubles for every increase in score
		player.multiplier *= 2;
	}
}

//Used to set the size of the canvas, arena, and pieces
function setCanvasSize() {
	//original: width = 240, height = 400, scale = (20,20), arena = (12,20)
	canvas.width = 300;
	canvas.height = 440;
	context.scale(20,20);
	arena = createMatrix(15,22);
}

//PIECES////////////////////////

//Matrix for each piece type
function createPiece(type) {
	if(type === 'A') {
		return [
			[1, 1, 0],
			[1, 1, 0],
			[0, 0, 1],
		];
	}
	else if(type === 'B') {
		return [
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
		];
	}
	else if(type === 'C') {
		return [
			[1, 1, 0],
			[1, 0, 0],
			[1, 1, 0],
		];
	}
	else if(type === 'D') {
		return [
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
		];
	}
	else if(type === 'E') {
		return [
			[0, 1, 1, 0, 0],
			[0, 1, 0, 0, 0],
			[0, 1, 1, 0, 0],
			[0, 1, 0, 0, 0],
			[0, 1, 1, 0, 0],
		];
	}
	else if(type === 'F') {
		return [
			[0, 1, 1, 0],
			[0, 1, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 0, 0],
		];
	}
	else if(type === 'G') {
		return [
			[0, 1, 1, 1],
			[0, 1, 1, 1],
			[0, 0, 0, 1],
			[0, 0, 1, 1],
		];
	}
	else if(type === 'H') {
		return [
			[1, 0, 0],
			[1, 1, 1],
			[1, 0, 1],
		];
	}
	else if(type === 'I' || type === '1') {
		return [
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
		];
	}
	else if(type === 'J') {
		return [
			[0, 1, 0],
			[0, 1, 0],
			[1, 1, 0],
		];
	}
	else if(type === 'K') {
		return [
			[0, 1, 0, 0],
			[0, 1, 0, 1],
			[0, 1, 1, 0],
			[0, 1, 0, 1],
		];
	}
	else if(type === 'L') {
		return [
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 1],
		];
	}
	else if(type === 'M') {
		return [
			[0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1],
			[1, 0, 1, 0, 1],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
		];
	}
	else if(type === 'N') {
		return [
			[1, 1, 1],
			[1, 0, 1],
			[0, 0, 0],
		];
	}
	else if(type === 'O' || type === '0') {
		return [
			[1, 1],
			[1, 1],
		];
	}
	else if(type === 'P') {
		return [
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
		];
	}
	else if(type === 'Q') {
		return [
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 1],
		];
	}
	else if(type === 'R') {
		return [
			[1, 1, 0],
			[1, 0, 0],
			[1, 0, 0],
		];
	}
	else if(type === 'S') {
		return [
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0],
		];
	}
	else if(type === 'T') {
		return [
			[0, 0, 0],
			[1, 1, 1],
			[0, 1, 0],
		];
	}
	else if(type === 'U') {
		return [
			[1, 0, 1],
			[1, 1, 1],
			[0, 0, 0],
		];
	}
	else if(type === 'V') {
		return [
			[1, 0, 1],
			[1, 0, 1],
			[0, 1, 0],
		];
	}
	else if(type === 'W') {
		return [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[1, 0, 1, 0, 1],
			[1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0],
		];
	}
	else if(type === 'X') {
		return [
			[1, 0, 1],
			[0, 1, 0],
			[1, 0, 1],
		];
	}
	else if(type === 'Y') {
		return [
			[1, 0, 1],
			[0, 1, 0],
			[0, 1, 0],
		];
	}
	else if(type === 'Z') {
		return [
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0],
		];
	}
	else if(type === '2') {
		return [
			[0, 1, 1, 0],
			[0, 0, 1, 0],
			[0, 1, 0, 0],
			[0, 1, 1, 0],
		];
	}
	else if(type === '3') {
		return [
			[0, 1, 1, 1, 0],
			[0, 0, 0, 1, 0],
			[0, 1, 1, 1, 0],
			[0, 0, 0, 1, 0],
			[0, 1, 1, 1, 0],
		];
	}
	else if(type === '4') {
		return [
			[1, 0, 1],
			[1, 1, 1],
			[0, 0, 1],
		];
	}
	else if(type === '5') {
		return [
			[0, 1, 1, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[0, 1, 1, 0],
		];
	}
	else if(type === '6') {
		return [
			[0, 1, 1, 1],
			[0, 1, 0, 0],
			[0, 1, 1, 1],
			[0, 1, 1, 1],
		];
	}
	else if(type === '7') {
		return [
			[0, 1, 1],
			[0, 0, 1],
			[0, 0, 1],
		];
	}
	else if(type === '8') {
		return [
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 0],
			[0, 0, 1, 0, 0],
			[0, 1, 1, 1, 0],
			[0, 1, 1, 1, 0],
		];
	}
	else if(type === '9') {
		return [
			[0, 1, 1],
			[0, 1, 1],
			[0, 0, 1],
		];
	}
}

//Collision between two pieces, prevents pieces from moving past wall
function collide(arena, player) {
	const[m, o] = [player.matrix, player.pos];
	for(let y = 0; y < m.length; ++y) {
		for(let x = 0; x < m[y].length; ++x) {
			if(m[y][x] !== 0 && 
				(arena[y + o.y] 
				&& arena[y + o.y][x + o.x]) !== 0) {
				return true;
			}
		}
	}
	return false;
}

//Used to merge blocks with the arena to keep them on screen after collision
function merge(arena, player) {
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value !== 0) {
				arena[y + player.pos.y][x + player.pos.x] = value;
			}
		});
	});
}

//List of 10 colors for blocks
const colors = [
	null,
	'hotpink',
	'red',
	'blue',
	'yellow',
	'violet',
	'green',
	'orange',
	'saddlebrown',
	'cyan', 
	'darkgoldenrod',
]


//PLAYER

//Initialize player object
const player = {
	pos: {x: 0, y: 0},
	matrix: null,
	score: 0,
	highScore: 0,
	multiplier: 1,
	rows: 0,
}

//Listen and respond to keyboard commands
document.addEventListener('keydown', event => {
	//enter
	if(event.keyCode === 13) {
		submitted();
	}
	//left
	if(event.keyCode === 37) {
		playerMove(-1);
	}
	//right
	else if(event.keyCode === 39) {
		playerMove(1);
	}
	//down
	else if(event.keyCode === 40) {
		playerDrop();
	}
	//q
	else if(event.keyCode === 81) {
		playerRotate(-1);
	}
	//w
	else if(event.keyCode === 87 || event.keyCode === 38) {
		playerRotate(1);
	}
	//space
	else if(event.keyCode === 32) {
		playerGround();
	}
})

//Drops the moving piece, either manually or automatically
function playerDrop() {
	player.pos.y++;

	//if there is a collision
	if(collide(arena, player)) {
		player.pos.y--;
		merge(arena, player);
		//next block initialized
		playerReset();
		//check if any row is filled 
		arenaSweep();
		updateScore();
	}

	dropCounter = 0;
}

//Instantly drops piece to the bottom
function playerGround() {
	//keep dropping until there is collision
	while(!collide(arena, player)) {
		player.pos.y++;
	}
	//undo collision
	player.pos.y--;
	merge(arena, player);
	//next block initialized
	playerReset();
	//check if any row is filled 
	arenaSweep();
	updateScore();
	dropCounter = 0;
}

//Moves the player left and right
function playerMove(dir) {
	player.pos.x += dir;
	if(collide(arena, player)) {
		player.pos.x -= dir;
	}
}

//rotate = transpose + reflect
function rotate(matrix, dir) {
	for(let y = 0; y < matrix.length; ++y) {
		for(let x = 0; x < y; ++x) {
			//transpose
			[
				matrix[x][y],
				matrix[y][x],
			] = [ 
				matrix[y][x],
				matrix[x][y],
			];
		}
	}
	//reflect
	if(dir > 0) {
		matrix.forEach(row => row.reverse());
	}
	else {
		matrix.reverse();
	}
}

//Rotates the player, avoids wall collision
function playerRotate(dir) {
	const pos = player.pos.x;
	let offset = 1;
	rotate(player.matrix, dir);
	//make sure rotation does not cause collision with wall
	//keep offsetting until there is no collision
	while(collide(arena, player)) {
		player.pos.x += offset;
		offset = -(offset + (offset > 0 ? 1 : -1));
		//if offset is too high, just rotate back to original orientation
		if(offset > player.matrix[0].length) {
			rotate(player.matrix, -dir);
			player.pos.x = pos;
			return;
		}
	}
}

//Reset player when current piece lands, Game over when initial position collides
function playerReset() {
	const pieces = letterPool;
	//const pieces = ['I', 'L', 'J', 'O', 'T', 'S', 'Z'];

	randomIndex = pieces.length * Math.random() | 0;
	player.matrix = createPiece(pieces[randomIndex]);

	//use random index to give each piece unique color (assuming at most 10 pieces in pool)
	for(let y = 0; y < player.matrix.length; ++y) {
		for(let x = 0; x < player.matrix[y].length; ++x) {
			player.matrix[y][x] *= (randomIndex + 1);
		}
	}

	//place new piece at center top
	player.pos.y = 0;
	player.pos.x = (arena[0].length / 2 | 0) -
					(player.matrix[0].length / 2 | 0);

	//reset collision = game over
	if(collide(arena, player)) {
		arena.forEach(row => row.fill(0));
		player.score = 0;
		updateScore();
	}
}



//UPDATES AND ANIMATION

//Used to draw both the arena and the individual pieces
function drawMatrix(matrix, offset) {
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value != 0) {
				// % 11 + 1 because only 10 colors are being used
				context.fillStyle = colors[(value % 11) + 1];
				context.fillRect(x + offset.x, 
								y + offset.y, 
								1, 1);
			}
		});
	});
}

//Draw everything in the canvas
function draw() {	
	//black canvas background
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);

	drawMatrix(arena, {x: 0, y: 0});
	drawMatrix(player.matrix, player.pos);
}

//Score display
function updateScore() {
	document.getElementById('rows').innerText = "Rows Completed: " + player.rows;
	document.getElementById('score').innerText = "Score: " + player.score;
}


//Drops block every 1000 milliseconds
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
//Updates entire game over time
function update(time = 0) {
	const deltaTime = time - lastTime;
	lastTime = time;

	dropCounter += deltaTime;
	if(dropCounter > dropInterval) {
		playerDrop();
	}

	draw();
	requestAnimationFrame(update);
}

//Start and continuously update animations, Called when characters are submitted
function startGame() {
	//Initialize player positon and score
	playerReset();
	updateScore();
	//Game loop
	update();
}




