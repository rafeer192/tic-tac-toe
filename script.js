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
      return player1.name;
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
      return player2.name; 
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
  const cells = document.querySelectorAll(".cell"); 

  let position;

  window.onload = () => {
  for(let i = 0; i < cells.length; ++i) {
    const cell = cells.item(i);
    waitForButtonClick(cell);
  }
}
  
  async function waitForButtonClick(element) {
    await getPromiseFromCell(element, "click");
    const currentMarker = game.getActivePlayer().marker; 
    position = element.getAttribute("data-index");
    element.classList.add("selected");
    element.textContent = currentMarker;
    board.updateBoard(currentMarker, position);
    game.switchTurns();
    const winner = game.checkWinner();
    if(winner) {
      if(winner === "Draw") {
        console.log("It's a DRAW!");
      } else {
        console.log(`${winner} WINS!`);
      }
    }
  }
  

  
  function getPromiseFromCell(item, event) {
    return new Promise((resolve)=> {
      const listener = () => {
        item.removeEventListener(event, listener);
        resolve();
      };
      item.addEventListener(event, listener);
    });
  }
  
}

game.playGame();