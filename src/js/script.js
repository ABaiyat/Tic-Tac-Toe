$(document).ready(function() {
  var setupState = false;
  var currentTurn = "cpu";
  var playerAv, computerAv;
  var corners = [];
  var gameBoard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  var openSpaces = ["00", "01", "02", "10", "11", "12", "20", "21", "22"];
  var avatar = {
    X: "fa fa-times",
    O: "fa fa-circle-o"
  };
  var button = {
    X: ".avatarX",
    O: ".avatarO"
  };

  // If the user has chosen the X avatar
  $(".avatarX").click(function() {
    if (!setupState) {
      playerAv = "X";
      computerAv = "O";
      initialize();
    }
  });

  // If the user has chosen the O avatar
  $(".avatarO").click(function() {
    if (!setupState) {
      playerAv = "O";
      computerAv = "X";
      initialize();
    }
  });

  // Calls the computerMove function and animates the board
  // being initialized by modifying the css properties
  function initialize() {
    // Prevents more than one click of the avatar buttons
    setupState = true;

    $("#prompt").css({
      visibility: "hidden",
      "transition-duration": ".1s"
    });
    $("#avatX").removeClass("select");
    $("#avatO").removeClass("select");

    $(button[computerAv]).css("border-top", "4px solid #0277BD");
    $(button[computerAv]).css("border-bottom", "4px solid #0277BD");
    $(button[playerAv]).css("border-top", "4px solid #0277BD");
    $(button[playerAv]).css("border-bottom", "4px solid #0277BD");

    setTimeout(function() {
      $(".container").css({
        height: "360",
        "transition-duration": ".8s"
      });
    }, 200);

    setTimeout(function() {
      $(".dividers").fadeIn(400);
      $(".hbar1").css({
        transform: "scaleX(3)",
        "transition-duration": ".7s"
      });
      $(".hbar2").css({
        transform: "scaleX(3)",
        "transition-duration": ".7s"
      });
      $(".vbar1").css({
        transform: "scaleY(3)",
        "transition-duration": ".7s"
      });
      $(".vbar2").css({
        transform: "scaleY(3)",
        "transition-duration": ".7s"
      });
      $(".testbox").css("display", "inline");
    }, 1200);

    setTimeout(function() {
      $(button[computerAv]).css("border-bottom", "4px solid white");
    }, 2000);
    setTimeout(function() {
      computerMove();
      //console.log(button[computerAv]);
    }, 2500);
  }

  // Move selector the computer. Performs a specific function based
  // on the number of spaces left open. This indicates the turn it is on
  // and executes the corresponding function
  function computerMove() {
    if (openSpaces.length === 9) {
      first();
    } else if (openSpaces.length === 7) {
      second();
    } else if (openSpaces.length === 5) {
      third();
    } else if (openSpaces.length === 3) {
      fourth();
    } else {
      var index = openSpaces[0];
      gameBoard[parseInt(index[0])][parseInt(index[1])] = computerAv;
      $("#index" + index).addClass(avatar[computerAv]);
      openSpaces = [];
    }
    // Checks for a victory
    var check = checkForWin();
    // If a victory was not found after the computers turn
    if (!check) {
      // If the board still has open spaces, gives control to the player to
      // make a move
      if (openSpaces.length > 0) {
        indicateUserTurn();
      }
      // If the game board has filled and no one has one, indicates a tie
      // and restarts the game
      else {
        $(".dividers").fadeOut(250).fadeIn(250).fadeOut(250).fadeIn(250);
        setTimeout(function() {
          resetGame();
        }, 1000);
      }
    }
  }

  // Handler for user turns
  $(".testbox").click(function(event) {
    // If it is the player's turn
    if (currentTurn === "player") {
      $(event.target).addClass(avatar[playerAv]);
      var index = $(event.target).attr("id");
      if (gameBoard[parseInt(index[5])][parseInt(index[6])] === 0) {
        gameBoard[parseInt(index[5])][parseInt(index[6])] = playerAv;
        // Changes the state of the turn to "cpu" to prevent overclicks from
        // the user

        // Removes the clicked space from the list of open spaces
        if (openSpaces.indexOf(index[5] + index[6]) === openSpaces.length - 1) {
          openSpaces.splice(-1, 1);
        } else {
          var loc = openSpaces.indexOf(index[5] + index[6]);
          openSpaces.splice(loc, 1);
        }

        // Checks for a user victory
        var check = checkForWin();

        // If a victory was not found, procedes to complete the computer's turn
        if (!check) {
          indicateCpuTurn();
          setTimeout(function() {
            computerMove();
          }, 1000);
        }
      }
    }
  });

  function indicateUserTurn() {
    $(button[computerAv]).css("border-bottom", "4px solid #0277BD");
    $(button[playerAv]).css("border-bottom", "4px solid white");
    currentTurn = "player";
  }

  function indicateCpuTurn() {
    $(button[playerAv]).css("border-bottom", "4px solid #0277BD");
    $(button[computerAv]).css("border-bottom", "4px solid white");
    currentTurn = "cpu";
  }

  // Checks rows, columns, and diagonals for solutions, by checking
  // if the checked values are the same
  function checkForWin() {
    if (
      gameBoard[0][0] === gameBoard[0][1] &&
      gameBoard[0][0] === gameBoard[0][2] &&
      gameBoard[0][0] !== 0
    ) {
      signalWin("index00", "index01", "index02");
      return "row0";
    } else if (
      gameBoard[1][0] === gameBoard[1][1] &&
      gameBoard[1][0] === gameBoard[1][2] &&
      gameBoard[1][0] !== 0
    ) {
      signalWin("index10", "index11", "index12");
      return "row1";
    } else if (
      gameBoard[2][0] === gameBoard[2][1] &&
      gameBoard[2][0] === gameBoard[2][2] &&
      gameBoard[2][0] !== 0
    ) {
      signalWin("index20", "index21", "index22");
      return "row2";
    } else if (
      gameBoard[0][0] === gameBoard[1][0] &&
      gameBoard[0][0] === gameBoard[2][0] &&
      gameBoard[0][0] !== 0
    ) {
      signalWin("index00", "index10", "index20");
      return "col0";
    } else if (
      gameBoard[0][1] === gameBoard[1][1] &&
      gameBoard[0][1] === gameBoard[2][1] &&
      gameBoard[0][1] !== 0
    ) {
      signalWin("index01", "index11", "index21");
      return "col1";
    } else if (
      gameBoard[0][2] === gameBoard[1][2] &&
      gameBoard[0][2] === gameBoard[2][2] &&
      gameBoard[0][2] !== 0
    ) {
      signalWin("index02", "index12", "index22");
      return "col2";
    } else if (
      gameBoard[0][0] === gameBoard[1][1] &&
      gameBoard[0][0] === gameBoard[2][2] &&
      gameBoard[0][0] !== 0
    ) {
      signalWin("index00", "index11", "index22");
      return "diag1";
    } else if (
      gameBoard[0][2] === gameBoard[1][1] &&
      gameBoard[0][2] === gameBoard[2][0] &&
      gameBoard[0][2] !== 0
    ) {
      signalWin("index02", "index11", "index20");
      return "diag2";
    } else {
      return false;
    }
  }

  // Takes in the three indices that make a victory, and fades these
  // in and out to show they make the solution
  function signalWin(first, second, third) {
    $("#" + first).fadeOut(400).fadeIn(400).fadeOut(400).fadeIn(400);
    $("#" + second).fadeOut(400).fadeIn(400).fadeOut(400).fadeIn(400);
    $("#" + third).fadeOut(400).fadeIn(400).fadeOut(400).fadeIn(400);
    $(button[playerAv]).css("border-bottom", "4px solid #0277BD");
    $(button[computerAv]).css("border-bottom", "4px solid #0277BD");
    setTimeout(function() {
      resetGame();
    }, 2000);
  }

  // Initializes the gameboard to have no meaningful values, and openSpaces
  // to include all spaces. Also calls the computers first move
  function resetGame() {
    gameBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    openSpaces = ["00", "01", "02", "10", "11", "12", "20", "21", "22"];
    $(".testbox").removeClass("fa fa-circle-o fa-times");

    $(button[computerAv]).css("border-bottom", "4px solid white");
    setTimeout(function() {
      first();
    }, 1000);
  }

  // The first move of the game, the computer's first Picks a random corner
  // for the first move, and updates the gameBoard and openSpaces to show this
  // space is not available
  function first() {
    corners = ["00", "02", "20", "22"];
    var rand = Math.floor(Math.random() * 4);
    var ind = corners[rand];
    corners.splice(rand, 1);
    gameBoard[parseInt(ind[0])][parseInt(ind[1])] = computerAv;
    $("#index" + ind).addClass(avatar[computerAv]);

    var index = openSpaces.indexOf(ind);

    // Removes the selected move from the list of open spaces
    removeEntry(index);
    indicateUserTurn();
  }

  // Third move of the game and computer's second. Computer will
  // always play another corner on this move
  function second() {
    var index;
    var newIndex;
    // If the player played in a corner or the center on their first turn
    // The computer will play in a corner
    if (
      gameBoard[1][1] === playerAv ||
      gameBoard[0][0] === playerAv ||
      gameBoard[0][2] === playerAv ||
      gameBoard[2][0] === playerAv ||
      gameBoard[2][2] === playerAv
    ) {
      var rand = Math.floor(Math.random() * corners.length);
      var ind = corners[rand];
      corners.splice(rand, 1);
      gameBoard[parseInt(ind[0])][parseInt(ind[1])] = computerAv;
      $("#index" + ind).addClass(avatar[computerAv]);
      index = openSpaces.indexOf(ind);

    }
    // If the player played in an edge, the computer will play in the
    // one of the two edges that will set itself up for victory
    // Of the three remaining corners will prevent a potential victory,
    // so this corner is avoided
    else {
      var compPos = [];
      var playPos = [];
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          if (gameBoard[i][j] === computerAv) {
            compPos.push(i);
            compPos.push(j);
          } else if (gameBoard[i][j] === playerAv) {
            playPos.push(i);
            playPos.push(j);
          }
        }
      }

      // Computer's first move and player's first move are
      // on the same row, plays next move on a corner that
      // is not the last corner in the row
      if (compPos[0] === playPos[0]) {
        var newX = Math.abs(compPos[0] - 2);

        gameBoard[newX][compPos[1]] = computerAv;
        newIndex = newX.toString() + compPos[1].toString();
        //console.log(newIndex);
        $("#index" + newIndex).addClass(avatar[computerAv]);
        index = openSpaces.indexOf(newIndex);

      }
      // Computer's first move and players first move are on
      // the same column, plays next move on a corner that
      // is not the last corner in the column
      else if (compPos[1] === playPos[1]) {
        var newY = Math.abs(compPos[1] - 2);
        gameBoard[compPos[0]][newY] = computerAv;
        newIndex = compPos[0].toString() + newY.toString();
        //console.log("NewY" + compPos[1] + " " + newX);
        $("#index" + newIndex).addClass(avatar[computerAv]);
        index = openSpaces.indexOf(newIndex);
      }
      // If the player placed their avatar in a non-adjacent edge
      // computer will play in the corner in the same row or
      // corner in the same column
      else {
        var compPos = [];
        for (var i = 0; i < 3; i++) {
          for (var j = 0; j < 3; j++) {
            if (gameBoard[i][j] === computerAv) {
              compPos.push(i);
              compPos.push(j);
              break;
            }
          }
        }
        // Corner in the same column or in the same row
        var firstOption = Math.abs(compPos[0] - 2).toString() + compPos[1].toString();
        var secondOption = compPos[0].toString() + Math.abs(compPos[1] - 2).toString();
        var options = [firstOption, secondOption];
        var rand = Math.floor(Math.random() * 2);
        $("#index" + options[rand]).addClass(avatar[computerAv]);
        index = openSpaces.indexOf(options[rand]);
      }
      var ind = corners.indexOf(newIndex);
      corners.splice(ind, 1);
    }

    // Removes the selected move from the list of open spaces
    removeEntry(index);
    indicateUserTurn();
  }

  // Fifth move of the game and the computer's third. Checks if there is a
  // victory for the computer, and if there is a move that will prevent the
  // player from winning. Otherwise, it will play in a random remaining corner
  function third() {
    var cpuWin = findSolution(computerAv);
    var preventLoss = findSolution(playerAv);
    var index;

    // If a victory was found for the computer, plays the move that will validate
    // the victory
    if (cpuWin) {
      var ind = (cpuWin[0][0]).toString() + (cpuWin[0][1]).toString();
      gameBoard[cpuWin[0][0]][cpuWin[0][1]] = computerAv;
      $("#index" + ind).addClass(avatar[computerAv]);
      index = openSpaces.indexOf(ind);
    }
    // If a victory was found for the user, and the computer did not have a
    // move that would mean victory, plays the move that will prevent
    // the user's victory
    else if (preventLoss) {
      var ind = (preventLoss[0][0]).toString() + (preventLoss[0][1]).toString();
      gameBoard[preventLoss[0][0]][preventLoss[0][1]] = computerAv;
      $("#index" + ind).addClass(avatar[computerAv]);
      index = openSpaces.indexOf(ind);
    }
    // If there was no victory imminent for the user or the computer, plays
    // in another random corner
    else {
      var rand = Math.floor(Math.random() * corners.length);
      var ind = corners[rand];
      corners.splice(rand, 1);
      gameBoard[parseInt(ind[0])][parseInt(ind[1])] = computerAv;
      $("#index" + ind).addClass(avatar[computerAv]);
      index = openSpaces.indexOf(ind);
    }

    // Removes the selected move from the list of open spaces
    removeEntry(index);
  }

  // Seventh move of the game and the computer's fourth. Checks if there is a
  // victory for the computer, and if there is a move that will prevent the
  // player from winning, otherwise, it plays in a random spot from the
  // remanining open spaces
  function fourth() {
    var cpuWin = findSolution(computerAv);
    var preventLoss = findSolution(playerAv);
    var index;
    // If a victory was found for the computer, plays the move that will validate
    // the victory
    if (cpuWin) {
      var ind = (cpuWin[0][0]).toString() + (cpuWin[0][1]).toString();
      gameBoard[cpuWin[0][0]][cpuWin[0][1]] = computerAv;
      $("#index" + ind).addClass(avatar[computerAv]);
      index = openSpaces.indexOf(ind);
    }
    // If a victory was found for the user, and the computer did not have a
    // move that would mean victory, plays the move that will prevent
    // the user's victory
    else if (preventLoss) {
      var ind = (preventLoss[0][0]).toString() + (preventLoss[0][1]).toString();
      gameBoard[preventLoss[0][0]][preventLoss[0][1]] = computerAv;
      $("#index" + ind).addClass(avatar[computerAv]);
      index = openSpaces.indexOf(ind);
    }
    // If there was no victory imminent for the user or the computer, plays
    // in a random remanining spot
    else {
      var rand = Math.floor(Math.random() * openSpaces.length);
      var ind = openSpaces[rand];
      //console.log(ind[0], ind[1]);
      gameBoard[parseInt(ind[0])][parseInt(ind[1])] = computerAv;
      $("#index" + ind).addClass(avatar[computerAv]);
      index = openSpaces.indexOf(ind);
    }
    // Removes the selected move from the list of open spaces
    removeEntry(index);
  }

  // Removes the selected move from the list of open spaces
  function removeEntry(index) {
    if (index === openSpaces.length - 1) {
      openSpaces.splice(-1, 1);
    } else {
      openSpaces.splice(index, 1);
    }
  }

  // Checks if there is a move that will ensure victory for
  // the computer or the user, depending on what value is received
  // If there is, it returns the space that will mean victory
  function findSolution(avatar) {

    for (var i = 0; i < 3; i++) {
      var count = 0;
      var emptySpaces = [];

      for (var j = 0; j < 3; j++) {
        if (gameBoard[i][j] === 0) {
          emptySpaces.push([i, j]);
        } else if (gameBoard[i][j] === avatar) {
          count++;
        }
      }
      if (emptySpaces.length === 1 && count === 2) {
        return emptySpaces;
      }
    }

    for (var j = 0; j < 3; j++) {
      var count = 0;
      var emptySpaces = [];

      for (var i = 0; i < 3; i++) {
        if (gameBoard[i][j] === 0) {
          emptySpaces.push([i, j]);
        } else if (gameBoard[i][j] === avatar) {
          count++;
        }
      }
      if (emptySpaces.length === 1 && count === 2) {
        return emptySpaces;
      }
    }

    var count = 0;
    var emptySpaces = [];

    if (gameBoard[0][0] === 0) {
      emptySpaces.push([0, 0]);
    } else if (gameBoard[0][0] === avatar) {
      count++;
    }
    if (gameBoard[1][1] === 0) {
      emptySpaces.push([1, 1]);
    } else if (gameBoard[1][1] === avatar) {
      count++;
    }
    if (gameBoard[2][2] === 0) {
      emptySpaces.push([2, 2]);
    } else if (gameBoard[2][2] === avatar) {
      count++;
    }

    if (emptySpaces.length === 1 && count === 2) {
      return emptySpaces;
    }

    var count = 0;
    var emptySpaces = [];

    if (gameBoard[0][2] === 0) {
      emptySpaces.push([0, 2]);
    } else if (gameBoard[0][2] === avatar) {
      count++;
    }
    if (gameBoard[1][1] === 0) {
      emptySpaces.push([1, 1]);
    } else if (gameBoard[1][1] === avatar) {
      count++;
    }
    if (gameBoard[2][0] === 0) {
      emptySpaces.push([2, 0]);
    } else if (gameBoard[2][0] === avatar) {
      count++;
    }

    if (emptySpaces.length === 1 && count === 2) {
      return emptySpaces;
    }
    return false;
  }

});
