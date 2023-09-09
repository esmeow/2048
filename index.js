var board;
var score = 0;
var rows = 4;
var cols = 4;

window.onload = function() {
    setGame();
    document.getElementById("start-over-button").addEventListener("click", function () {
        // Hide the game over message and button
        document.getElementById("game-over").style.display = "none";
        document.getElementById("start-over-button").style.display = "none";

        // Reset the score to 0
        score = 0;
        document.getElementById("score").innerText = score;

        // Clear the board and start a new game
        setGame();
    });
}

function setGame() {
    board = [    
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]]

    const tileContainer = document.getElementById("tile-container");
    while (tileContainer.firstChild) {
        tileContainer.removeChild(tileContainer.firstChild);
    }
    for (let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            //create a div for each tile
            let tile = document.createElement("div");
            tile.style.marginRight = "0";

            //set a tile id 
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            tileContainer.appendChild(tile); //board div'ine tile div'leri eklendi
        }
    }
    setTwo(); //at the beginning, put two 2s
    setTwo();
}

function isFull(){ //if the board is full, it returns true
    for(let r = 0; r<rows; r++) {
        for(let c = 0; c<cols; c++){
            if(board[r][c]==0) {
                return false;
            }
        }
    }
    return true;
}

function isGameOver() {
    // Check if there are any available moves left
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (c < cols - 1 && board[r][c] === board[r][c + 1]) {
                return false; // Horizontal merge available
            }
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
                return false; // Vertical merge available
            }
        }
    }
    return true; // No available moves left
}

function setTwo(){
    if(isFull()){ 
        //no empty place to put a 2
        if (isGameOver()) {
            // Display game over message and show the "Start Over" button
            document.getElementById("game-over").style.display = "block";
            document.getElementById("start-over-button").style.display = "block";
        }
        return;
    }

    let found = false; //did we find an empty place in the board?
    while(!found) { //bulunamadığı sürece aramaya devam eder
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);

        //we found a completely random coordinate in the board, now use it
        if(board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("tile2");
            found = true;
        }

    }
}

function updateTile(tile, num){
    tile.innerText = ""; //clear tile number at beginning
    tile.classList.value = ""; //clear the class style

    tile.classList.add("tile")

    if(num != 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("tile"+num.toString());
        }
        else{
            tile.classList.add("tile8192");
        }
    }
}

let touchStartX, touchStartY, touchEndX, touchEndY;
const touchThreshold = 50; // Minimum swipe distance in pixels

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling while swiping
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > touchThreshold) {
        // Horizontal swipe
        if (deltaX > 0) {
            // Swipe right
            slideRight();
        } else {
            // Swipe left
            slideLeft();
        }
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > touchThreshold) {
        // Vertical swipe
        if (deltaY > 0) {
            // Swipe down
            slideDown();
        } else {
            // Swipe up
            slideUp();
        }
    }
});

//keyup = press 1 at a time, tuşu bıraktığın an çalışır
//keydown = constant press, tuşa basılı tuttuğun sürece çalışır
document.addEventListener('keyup', (e) => {
    if(e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if(e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if(e.code == "ArrowUp") {
        slideUp();
        setTwo();
    }
    else if(e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;
})

function filterZero(row){
    return row.filter(num => num != 0); //eliminate 0s
}


function slide(row) {
    //[0,2,2,2]
    row = filterZero(row); //[2,2,2]

    //slide
    for(let i=0; i<row.length-1; i++) {
        if (row[i] == row[i+1]) { //if they match
            row[i] *= 2; //double the first one
            row[i+1] *= 0; //temporarily reset the second one
            score += row[i]; //add up to score
        } //[2,2,2] => [4,0,2]
    }
    row = filterZero(row); //[4,2]

    //add 0s back
    while(row.length < cols) {
        row.push(0);
    } //[4,2,0,0]

    return row;
}

//get rid of 0s
//merge same ones
//clear 0s again
//put 0s back to empty slots
function slideLeft() {
    for (let r = 0; r < rows; r++) { //iterate over each row 
        let row = board[r]; //boarddaki o row'u değişkene ata, altta fonksiyona parametre verebilme amacıyla
        row = slide(row); //row'u kaydırılmış hali ile update'le
        board[r] = row; //assign row back to its place


        //update HTML board look
        for(let c = 0; c<cols; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r]; 
        row.reverse();
        row = slide(row); 
        row.reverse();
        board[r] = row; 


        //update HTML board look
        for(let c = 0; c<cols; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp(){
    for (let c = 0; c < cols; c++) {
        let row = [board[0][c],board[1][c],board[2][c],board[3][c]]; 
        row = slide(row); 

        //update HTML board look
        for(let r = 0; r<rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown(){
    for (let c = 0; c < cols; c++) {
        let row = [board[3][c],board[2][c],board[1][c],board[0][c]]; 
        row = slide(row); 

        board[0][c] = row[3];
        board[1][c] = row[2];
        board[2][c] = row[1];
        board[3][c] = row[0];

        //update HTML board look
        for(let r = 0; r<rows; r++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

