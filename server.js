var express = require('express');

var values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
var suits = ["Spades", "Hearts", "Clubs", "Diamonds"];

var nextSessionNumber = 1;

function sessionId() {
    var id = "Session" + nextSessionNumber;
    nextSessionNumber++;
    return id;
}

function createSessionData() {
    var sessionData = {
        deck: [],
        gameData: {
            id: sessionId()
        }
    };
    return sessionData;
}

function cardNumericValue(card) {
    var num = values.indexOf(card.value) + 1;
    return num > 10 ? 10 : num;
}

function handValue(cards) {

    var sum = 0;
    var aces = 0;

    for (var i = 0; i < cards.length; i++) {
        var val = cardNumericValue(cards[i]);
        if (val == 1) {
            val = 11;
            aces++;
        }
        sum = sum + val;
    }

    while (aces > 0 && sum > 21) {
        aces--;
        sum -= 10;
    }

    return sum;
}


function valueToImageLetter(value) {
    var letters = "A234567890JQK";
    return letters[values.indexOf(value)];
}

function drawCard(deck) {
    var randomIndex = Math.floor(Math.random() * deck.length);
    var card = deck[randomIndex];
    deck.splice(randomIndex, 1);
    return card;
}

function buildDeck() {

    var cards = [];

    for (var s = 0; s < suits.length; s++) {
        for (var v = 0; v < values.length; v++) {

            var url = "https://deckofcardsapi.com/static/img/" + valueToImageLetter(values[v]) + suits[s][0] + ".png";

            cards.push({
                value: values[v],
                suit: suits[s],
                image: url
            });
        }
    }

    return cards;
}

var app = express();

var sessionData;

app.get('/deal', function(req, res) {

    sessionData = createSessionData();

    sessionData.deck = buildDeck();

    sessionData.gameData.state = "newGame";

    sessionData.gameData.table = {
        playersHand: [drawCard(sessionData.deck), drawCard(sessionData.deck)],
        dealersHand: [{
            image: "http://www.jimknapp.com/Cards/Non-Bicycle_files/image002.jpg"
        }, drawCard(sessionData.deck)]
    };

    sessionData.gameData.playersHandValue = handValue(sessionData.gameData.table.playersHand);

    res.send(sessionData.gameData);
});

app.get('/stand', function(req, res) {

    var gameData = sessionData.gameData;

    // turn dealer card face up
    gameData.table.dealersHand.splice(0, 1);
    gameData.table.dealersHand.push(drawCard(sessionData.deck));

    // dealer draws while hand value < 17
    gameData.dealersHandValue = handValue(gameData.table.dealersHand);
    while (gameData.dealersHandValue < 17) {
        gameData.table.dealersHand.push(drawCard(sessionData.deck));
        gameData.dealersHandValue = handValue(gameData.table.dealersHand);
    }

    // determine winner
    if (gameData.dealersHandValue === gameData.playersHandValue) {
        gameData.state = "push";
    } else if (gameData.playersHandValue > gameData.dealersHandValue || gameData.dealersHandValue > 21) {
        gameData.state = "playerWins";
    } else {
        gameData.state = "dealerWins";
    }

    res.send(gameData);
});

app.get('/hit', function(req, res) {
    sessionData.gameData.state = "inGame";

    sessionData.gameData.table.playersHand.push(drawCard(sessionData.deck));

    sessionData.gameData.playersHandValue = handValue(sessionData.gameData.table.playersHand);

    if (sessionData.gameData.playersHandValue > 21) {
        sessionData.gameData.state = "busted";
    };

    res.send(sessionData.gameData);
});

app.use(express.static('public'));

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
