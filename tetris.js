
//USER INPUT

let letterPool = "";

//Get a string of letters from user and display it on top
function submitted(){
   	var userInput = document.getElementById("userInput").value;
    document.getElementById("letters").innerHTML = userInput;

    //remove nonalphanumeric characters, leaves only letters and digits
    userInput = userInput.replace(/[^A-Za-z0-9]/g, '');
    //store characters in a vector
    letterPool = [...userInput];
    //Capitalize every letter
    for(var i = 0; i < letterPool.length; i++) {
    	letterPool[i] = letterPool[i].toUpperCase();
    }

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

const arena = createMatrix(12,20);

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
		//Change in score doubles for every increase in score
		player.multiplier *= 2;
	}
}

//PIECES////////////////////////

//Matrix for each piece type
function createPiece(type) {
	if(type === 'I') {
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
	else if(type === 'L') {
		return [
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 1],
		];
	}
	else if(type === 'O') {
		return [
			[1, 1],
			[1, 1],
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
	else if(type === 'Z') {
		return [
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0],
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
	'red',
	'blue',
	'yellow',
	'violet',
	'green',
	'orange',
	'saddlebrown',
	'cyan', 
	'darkgoldenrod',
	'hotpink',
]


//PLAYER

//Initialize player object
const player = {
	pos: {x: 0, y: 0},
	matrix: null,
	score: 0,
	multiplier: 1,
	rows: 0,
}

//Listen and respond to keyboard commands
document.addEventListener('keydown', event => {
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
	else if(event.keyCode === 87) {
		playerRotate(1);
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




