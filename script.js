const board = function createGameboard() {
  const gameBoard = new Array(9); 
  let numMarkers = 0;

  const getBoard = () => gameBoard; 
  const getNumMarkers = () => numMarkers;

  const updateBoard = (marker, position) => {
    if(position >= 0 && position <= 8 && numMarkers < 9) {
      gameBoard[position] = marker; 
      numMarkers++;
    } else if(position < 0 || position > 8) { //invalid positions
      throw new Error("Game board positions exceeded!");
    } else {  // board is full
      return; 
    }
  }; 
  return {getBoard, getNumMarkers, updateBoard};
}();

const game = function GameController() {
  const player1 = createPlayer("Player 1", 'X'); 
  const player2 = createPlayer("Player 2", 'O'); 


  let activePlayer = player1; 
  const switchTurns = () => {
    if(activePlayer === player1) {
      activePlayer = player2;
    } else {
      activePlayer = player1;
    }
  }; 
  const getActivePlayer = () => activePlayer; 

  const checkWinner = () => {
    if(board.getNumMarkers() < 5) {
      return;
    }
    //Player 1 'X' win conditions
    else if(board.getBoard()[0]==='X'&&board.getBoard()[1]==='X'&&board.getBoard()[2]==='X' ||
            board.getBoard()[3]==='X'&&board.getBoard()[4]==='X'&&board.getBoard()[5]==='X' ||
            board.getBoard()[6]==='X'&&board.getBoard()[7]==='X'&&board.getBoard()[8]==='X' ||
            board.getBoard()[0]==='X'&&board.getBoard()[3]==='X'&&board.getBoard()[6]==='X' ||
            board.getBoard()[1]==='X'&&board.getBoard()[4]==='X'&&board.getBoard()[7]==='X' ||
            board.getBoard()[2]==='X'&&board.getBoard()[5]==='X'&&board.getBoard()[8]==='X' ||
            board.getBoard()[0]==='X'&&board.getBoard()[4]==='X'&&board.getBoard()[8]==='X' ||
            board.getBoard()[2]==='X'&&board.getBoard()[4]==='X'&&board.getBoard()[6]==='X'  ) 
    {
      return 'X';
    }
    //Player 2 'O' win conditions
    else if(board.getBoard()[0]==='O'&&board.getBoard()[1]==='O'&&board.getBoard()[2]==='O' ||
            board.getBoard()[3]==='O'&&board.getBoard()[4]==='O'&&board.getBoard()[5]==='O' ||
            board.getBoard()[6]==='O'&&board.getBoard()[7]==='O'&&board.getBoard()[8]==='O' ||
            board.getBoard()[0]==='O'&&board.getBoard()[3]==='O'&&board.getBoard()[6]==='O' ||
            board.getBoard()[1]==='O'&&board.getBoard()[4]==='O'&&board.getBoard()[7]==='O' ||
            board.getBoard()[2]==='O'&&board.getBoard()[5]==='O'&&board.getBoard()[8]==='O' ||
            board.getBoard()[0]==='O'&&board.getBoard()[4]==='O'&&board.getBoard()[8]==='O' ||
            board.getBoard()[2]==='O'&&board.getBoard()[4]==='O'&&board.getBoard()[6]==='O'  )
    {
      return 'O'; 
    }
    else if(board.getNumMarkers() === 9) {
      return "Draw";
    }
  }

  const playGame = () => {
    const gameDisplay = displayController();
  }; 


  return {playGame, getActivePlayer, switchTurns, checkWinner};
}();

function createPlayer(name, marker) {
  return {name, marker}; 
}

function displayController() {
  let player1;
  let player2;
  const cells = document.querySelectorAll(".cell"); 

  let position;

  function allowClick() {
    for(let i = 0; i < cells.length; ++i) {
      const cell = cells.item(i);
      cell.style.cursor = "pointer";
      waitForButtonClick(cell);
    }
  }
  
  async function waitForButtonClick(element) {
    await getPromiseFromItem(element, "click");
    const currentMarker = game.getActivePlayer().marker; 
    position = element.getAttribute("data-index");
    element.classList.add("selected");
    element.textContent = currentMarker;
    board.updateBoard(currentMarker, position);
    game.switchTurns();
    const winner = game.checkWinner();
    if(winner) {
      endGame(winner);
    }
  }
  
  function getPromiseFromItem(item, event) {
    return new Promise((resolve)=> {
      const listener = () => {
        item.removeEventListener(event, listener);
        resolve();
      };
      item.addEventListener(event, listener);
    });
  }

  function endGame(win) {
    const winMsg = document.createElement("p");
    winMsg.classList.add("win-msg");
    if(win === 'X') {
      winMsg.textContent = `${player1.name} WINS!`;
      const player1Card = document.querySelector(".player-1"); 
      player1Card.appendChild(winMsg);
    } else if(win === 'O') {
      winMsg.textContent = `${player2.name} WINS!`;
      const player2Card = document.querySelector(".player-2"); 
      player2Card.appendChild(winMsg);
    } else {
      winMsg.textContent = "It's a DRAW!";
      winMsg.classList.add("draw");
      const winMsg2 = winMsg.cloneNode(true);
      const player1Card = document.querySelector(".player-1"); 
      player1Card.append(winMsg);
      const player2Card = document.querySelector(".player-2"); 
      player2Card.appendChild(winMsg2);
    }
  }
  

  const nameForms = document.querySelectorAll("div form");
  nameForms.forEach(form => form.addEventListener("submit", (event) => {
    event.preventDefault();
    const playerName = new FormData(form);
    const userName = playerName.get("player-name");
    const btn = form.querySelector("form button");
    const readyStatusMsg = event.target.parentNode.querySelector(".ready-status");
    btn.disabled = true; 
    btn.style.cursor = "not-allowed";
    form.querySelector("input").disabled = true;
    readyStatusMsg.textContent = `${userName} is READY!`;
    if(event.target.parentNode.classList.contains("player-1")) {
      player1 = createPlayer(userName, 'X');
    } else {
      player2 = createPlayer(userName, 'O');
    }
    if(nameForms[0].querySelector("input").disabled === true && nameForms[1].querySelector("input").disabled === true) {
      allowClick();
    }
  }));
}

game.playGame();

// display winner and loser on left/right accordingly
// highlight winning row
// have restart button pop up that clears board but keeps names