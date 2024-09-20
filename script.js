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

  const resetBoard = () => {
    for(let i = 0; i < gameBoard.length; ++i) {
      gameBoard[i] = null;
    }
    numMarkers = 0;
  };
  return {getBoard, getNumMarkers, updateBoard, resetBoard};
}();

// Key game functions
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
  const resetActivePlayer = function() { // X always starts
    activePlayer = player1;
  }

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


  return {playGame, getActivePlayer, switchTurns, checkWinner, resetActivePlayer};
}();

function createPlayer(name, marker) {
  return {name, marker}; 
}

function displayController() {
  let player1;
  let player2;

  let position;

  function allowClick() {
    const cells = document.querySelectorAll(".cell"); 
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
    const cells = document.querySelectorAll(".cell"); 
    const winMsg = document.createElement("p");
    let winMsg2;
    const player1Card = document.querySelector(".player-1"); 
    const player2Card = document.querySelector(".player-2"); 
    const resetBtn = document.createElement("button");
    resetBtn.classList.add("reset");
    resetBtn.textContent = "Play again";
    winMsg.classList.add("win-msg");
    if(win === 'X') {
      winMsg.textContent = `${player1.name} WINS!`;
      player1Card.appendChild(winMsg);
      player1Card.appendChild(resetBtn);
    } else if(win === 'O') {
      winMsg.textContent = `${player2.name} WINS!`;
      player2Card.appendChild(winMsg);
      player2Card.appendChild(resetBtn); 
    } else {
      winMsg.textContent = "It's a DRAW!";
      winMsg.classList.add("draw");
      winMsg2 = winMsg.cloneNode(true);
      player1Card.append(winMsg);
      player2Card.appendChild(winMsg2);
      player1Card.appendChild(resetBtn);
    }
    cells.forEach(cell => {
      cell.replaceWith(cell.cloneNode(true));
    });

    resetBtn.addEventListener("click", resetHandler);

    function resetHandler() {
      board.resetBoard();
      const cellsWrapper = document.querySelector(".cells-wrapper");
      while(cellsWrapper.firstChild) {
        cellsWrapper.removeChild(cellsWrapper.lastChild);
      }
      for(let i = 0; i < 9; ++i) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-index", i); 
        cellsWrapper.appendChild(cell);
      }
      game.resetActivePlayer();
      allowClick();
      if(player1Card.contains(resetBtn)) {
        player1Card.removeChild(resetBtn);
      } else {
        player2Card.removeChild(resetBtn);
      }
      winMsg.remove();
      if(winMsg2) winMsg2.remove();
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