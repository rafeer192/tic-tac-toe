function createGameboard() {
  const gameBoard = []; 
  let numMarkers = 0;

  const getBoard = () => gameBoard; 
  const getNumMarkers = () => numMarkers;

  const updateBoard = (marker, position) => {
    if(position >= 0 && position <= 8 && numMarkers <= 9) {
      gameBoard[position] = marker; 
      numMarkers++;
    } else if(position < 0 || position > 8) { //invalid positions
      throw new Error("Game board positions exceeded!");
    } else {  // board is full
      return; 
    }
  }; 
  return {getBoard, getNumMarkers, updateBoard};
}

const game = function GameController() {
  const player1 = createPlayer("Player 1", 'X'); 
  const player2 = createPlayer("Player 2", 'O'); 

  const board = createGameboard();

  let activePlayer = player1; 
  const switchTurns = () => {
    if(activePlayer === player1) {
      activePlayer = player2;
    } else {
      activePlayer = player1;
    }
  }; 
  const getActivePlayer = () => activePlayer; 

  const getPlayerSelection = () => {
    return prompt("Where would you like to place your marker? (0-8)"); 
  };

  const playRound = () => {
    const playerPosition = getPlayerSelection(); 
    board.updateBoard(getActivePlayer().marker, playerPosition); 
    console.log(`${getActivePlayer().name} placed their ${getActivePlayer().marker} at position ${playerPosition}`); 
    switchTurns();
    printBoard(); 
  }; 

  const printBoard = () => {
    console.log(board.getBoard()); 
  }; 

  const playGame = () => {
    while(board.getNumMarkers() < 9) {
      playRound(); 
      if(board.getNumMarkers() < 5) continue;

      //Player 1 'X' win conditions
      if(board.getBoard()[0]==='X'&&board.getBoard()[1]==='X'&&board.getBoard()[2]==='X' ||
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
    }
    return "Draw";
  }; 

  printBoard(); // initial printing of board

  return {playGame, getActivePlayer};
}();

function createPlayer(name, marker) {
  return {name, marker}; 
}

//const winner = game.playGame(); 

/*if(winner === "Draw") {
  console.log("It's a DRAW!"); 
} else {
  console.log(`${winner} WINS`);
}
*/
