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

function GameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
  const player1 = createPlayer(playerOneName, 'X'); 
  const player2 = createPlayer(playerTwoName, 'O'); 

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
  }
}

function createPlayer(name, marker) {
  return {name, marker}; 
}