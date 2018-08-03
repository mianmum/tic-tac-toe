const module = !function () {
  let state = "";
// PAGE DISPLAY FUNCTIONS
  // start, board, and win pages
  const pages = {
    start: document.querySelector('#start'),
    board: document.querySelector('#board'),
    finish: document.querySelector('#finish')
  };
  // hide or display HTML
  const display = {
    show: element => element.classList.remove('hidden'),
    hide: element => element.classList.add('hidden')
  };
  // start state (board and win page hidden)
  const startScreen = () => {
    display.show(pages.start);
    display.hide(pages.board);
    display.hide(pages.finish);
    state = "start";
  };
  startScreen();
  // play state (start and win page hidden)
  const playScreen = () => {
    display.hide(pages.start);
    display.hide(pages.finish);
    display.show(pages.board);
  };
// GAME START
// initializer
const init = playerBar => {
  playerBar.classList.add('active');
};
// PLAYER STATE AND BOXES VARIABLES
  // player bars
  const players = {
    player1: document.querySelector('#player1'),
    player2: document.querySelector('#player2')
  };
  // boxes UL
  const boxesUL = document.querySelector('.boxes');
// WIN DETECTOR
  const winningCombos = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["1", "4", "7"],
    ["2", "5", "8"],
    ["3", "6", "9"],
    ["1", "5", "9"],
    ["3", "5", "7"]
  ];
  // assign number to boxes
  const addBoxNumbers = (element => {
    let count = 1;
    for (let i = 0; i < element.children.length; i++) {
      element.children[i].id = count;
      count ++;
    };
  })(boxesUL);
  // store player moves
  let player1Moves = [];
  let player2Moves = [];
  const storeMoves = selection => {
    // player 1 (o)
    if (players.player1.classList.contains('active')) {
      player1Moves.push(selection.id);
    // player 2 (x)
    } else if (players.player2.classList.contains('active')) {
      player2Moves.push(selection.id);
    };
  };
  // check for winning combo
  const checkWin = () => {
    winningCombos.map(combo => {
      let check1 = 0;
      let check2 = 0;
      combo.map(number => {
        if (player1Moves.includes(number)) {
          check1 += 1;
          if (check1 === 3) {
            state = "win1";
            console.log(state);
          };
        };
        if (player2Moves.includes(number)) {
          check2 += 1;
          if (check2 === 3) {
            state = "win2"
            console.log(state);
          };
        };
      });
    });
  };
  // check for tie
  const checkTie = element => {
    let check = 1;
    for (let i = 0; i < element.children.length; i++) {
      if (element.children[i].classList.contains('box-filled-1') || element.children[i].classList.contains('box-filled-2')) {
        check += 1;
        if (check === 9) {
          if (state !== "win1" && state !== "win2") {
            state = "tie";
          };
        };
      };
    };
  };
  //  finish screen
  const finishScreen = () => {
    const message = document.querySelector('.message');
    if (state === "win1") {
      pages.finish.classList.remove('screen-win-two');
      pages.finish.classList.remove('screen-win-tie');
      pages.finish.classList.add('screen-win-one');
      message.innerHTML = "Winner";
      display.hide(pages.board);
      display.show(pages.finish);
    } else if (state === "win2") {
      pages.finish.classList.remove('screen-win-one');
      pages.finish.classList.remove('screen-win-tie');
      pages.finish.classList.add('screen-win-two');
      message.innerHTML = "Winner";
      display.hide(pages.board);
      display.show(pages.finish);
    } else if (state === "tie") {
      console.log(state);
      pages.finish.classList.remove('screen-win-one');
      pages.finish.classList.remove('screen-win-two');
      pages.finish.classList.add('screen-win-tie');
      message.innerHTML = "It's a tie!";
      display.hide(pages.board);
      display.show(pages.finish);
    };
  };
  // check for finish and act accordingly
  const checkFinish = () => {
    checkWin();
    checkTie(boxesUL);
    finishScreen();
  };
// MAIN GAME FUNCTIONS
  // initialize game (player 1 turn)
  // remove svgs
  const removeSVG = collection => {
    for (let i = 0; i < collection.children.length; i++) {
      // check if box is clicked
      if (!collection.children[i].classList.contains('box-filled-1') && !collection.children[i].classList.contains('box-filled-2')){
        collection.children[i].style.backgroundImage = 'none';
      };
    };
  };
  // show o or x
  const showSVG = element => {
    // player 1 (o)
    if (players.player1.classList.contains('active')) {
      element.style.backgroundImage = "url('img/o.svg')";
    // player 2 (x)
    } else if (players.player2.classList.contains('active')) {
      element.style.backgroundImage = "url('img/x.svg')";
    };
  };

  // Start button listener
    pages.start.addEventListener('click', e => {
      if (e.target.classList.contains('button')) {
        init(players.player1);
        playScreen();
        if (e.target.id === "twoPlayer") {
          state = "twoPlayerGame";
        } else {
          state = "soloGame";
        };
      };
    });
    // board hover listener
    pages.board.addEventListener('mouseover', e => {
      let box = e.target;
      if (box.classList.contains('box')) {
        if (!box.classList.contains('box-filled-1') && !box.classList.contains('box-filled-2')) {
          // remove svgs
          removeSVG(boxesUL);
          // show svg
          showSVG(box);
        };
      };
    });
  // BOT PROGRAM
    // generate random number function
    const randomNumber = () => {
      return Math.floor(Math.random() * (8)) + 1
    };
    const bot = collection => {
      let randomBox = randomNumber();
      console.log(randomBox);
      for (let i = 0; i < collection.length; i++) {
        console.log(collection[i].id);
        if (collection[i].id == randomBox) {
          console.log(collection[i].id)
          if (!collection[i].classList.contains('box-filled-1') && !collection[i].classList.contains('box-filled-2')) {
            collection[i].classList.add('box-filled-2');
            showSVG(collection[i]);
            players.player2.classList.remove('active');
            players.player1.classList.add('active');
          } else {
            bot(collection);
          }
        };
      };
    };
  // board click listener
  pages.board.addEventListener('click', e => {
    let box = e.target;
    // check if box is empty
      if (!box.classList.contains('box-filled-1') && !box.classList.contains('box-filled-2')) {
      // player 1 (o)
        if (players.player1.classList.contains('active')) {
          storeMoves(box);
          checkFinish(boxesUL);
          box.classList.add('box-filled-1');
          players.player1.classList.remove('active');
          players.player2.classList.add('active');
          if (state === "soloGame") {
            bot(boxesUL.children);
            return;
          };
          // player 2 (x)
        } else if (players.player2.classList.contains('active')) {
          storeMoves(box);
          checkFinish(boxesUL);
          box.classList.add('box-filled-2');
          players.player2.classList.remove('active');
          players.player1.classList.add('active');
        };
      };
  });
// RESTART
  // reset boxes function
  const resetBoxes = collection => {
    for (let i = 0; i < collection.children.length; i++) {
      let box = collection.children[i];
      if(box.classList.contains('box-filled-1')) {
        box.classList.remove('box-filled-1');
      } else if (box.classList.contains('box-filled-2')) {
        box.classList.remove('box-filled-2');
      };
    };
    removeSVG(collection);
  };
  // clear moves arrays
  const clearMoves = () => {
    player1Moves = [];
    player2Moves = [];
  };
  // reset button listener
  pages.finish.addEventListener('click', e => {
    if (e.target.classList.contains('button')) {
      resetBoxes(boxesUL);
      clearMoves();
      startScreen();
      init(players.player1);
    };
  });
// end of module
}();
