
//list containing cards
var deck = ["fa-anchor","fa-anchor","fa-bolt","fa-bolt","fa-bomb","fa-bomb",
           "fa-paper-plane-o","fa-paper-plane-o","fa-cube","fa-cube","fa-leaf","fa-leaf",
           "fa-bicycle","fa-bicycle","fa-diamond","fa-diamond"];

/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

//game difficulty
var hard = 15;
var medium = 20;
var modal = $("#win-modal");

//game variables
var numStars = 3;
var matched = 0;
var open = [];
var moveCounter = 0;
var timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};

/*
 * Support functions used by main event callback functions.
 */

// Interval function called every second
var startTimer = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }

    //single digit preceded with 0
    var formattedSec = "0";
    if (timer.seconds < 10) {
        formattedSec += timer.seconds
    } else {
        formattedSec = String(timer.seconds);
    }

    var time = String(timer.minutes) + ":" + formattedSec;
    $(".timer").text(time);
};

//resets timer and restarts
function resetTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(startTimer, 1000);
};

//toggles win modal on
function showModal() {
    modal.css("display", "block");
};

//randomizes cards
function updateCards() {
    deck = shuffle(deck);
    var index = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + deck[index]);
      index++;
    });
    resetTimer();
};

//updates number of moves in the HTML file
function updateMoveCounter() {
    $(".moves").text(moveCounter);

    if (moveCounter === hard || moveCounter === medium) {
        removeStar();
    }
};

function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    numStars--;
    $(".num-stars").text(String(numStars));
};

//restores star icons to 3 stars
function resetStars() {
    $(".fa-star-o").attr("class", "fa fa-star");
    numStars = 3;
    $(".num-stars").text(String(numStars));
};

//Checks if card is a valid move
function isValid(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};

//returns even if cards are not matched
function checkMatch() {
    if (open[0].children().attr("class")===open[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};

//returns WIN
function hasWon() {
    if (matched === 16) {
        return true;
    } else {
        return false;
    }
};

//sets current cards to the match state, checks WIN condition
var setMatch = function() {
    open.forEach(function(card) {
        card.addClass("match");
    });
    open = [];
    matched += 2;

    if (hasWon()) {
        clearInterval(timer.clearTime);
        showModal();
    }
};

//sets selected card to the open
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};

//sets current cards back to default
var resetOpen = function() {
    open.forEach(function(card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
};



//resets all game state variables and resets to default state
var resetGame = function() {
    open = [];
    matched = 0;
    moveCounter = 0;
    resetTimer();
    updateMoveCounter();
    $(".card").attr("class", "card");
    updateCards();
    resetStars();
};

// game logic
var onClick = function() {
    if (isValid( $(this) )) {

        if (open.length === 0) {
            openCard( $(this) );

        } else if (open.length === 1) {
            openCard( $(this) );
            moveCounter++;
            updateMoveCounter();

            if (checkMatch()) {
                setTimeout(setMatch, 300);

            } else {
                setTimeout(resetOpen, 700);

            }
        }
    }
};

//resets game and toggles win modal display off
var playAgain = function() {
    resetGame();
    modal.css("display", "none");
};

/*
 * Initalize event listeners
 */

$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);

//provides a randomized game board 
$(updateCards);
