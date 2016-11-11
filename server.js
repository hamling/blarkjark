var express = require('express');

var decks = {};

var deck = [];

var gameData = {};

var values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
var suits = ["Spades", "Hearts", "Clubs", "Diamonds"];

var nextDeckNumber = 1;

function getIndexOfValue(arr, value)
{
    for (var i = 0; i < arr.length; i++)
    {
        if (arr[i] === value) {
           return i;
        }
    }

    return undefined;
}

function cardNumericValue(card)
{
    var idx = getIndexOfValue(values, card.value);

    idx = idx + 1;

    if (idx > 10) {
        idx = 10;
    }

    return idx;
}

function handValue(cards)
{
    var sum = 0;
    var aceCount = 0;

    for (var i = 0; i < cards.length; i++)
    {
        var c = cardNumericValue(cards[i]);
        if (c === 1)
        {
            c = 11;
            aceCount++;
        }
        sum = sum + c;
    }

    while (sum > 21 && aceCount > 0)
    {
      console.log("Demoting Ace");
      sum -= 10;
      aceCount--;
    }

    console.log("Value: " + sum);

    return sum;
}


function valueToImageLetter(value) {
    if (value == "Jack" || value == "Queen" || value == "King" || value == "Ace") {
        return value[0];
    }

    switch (value) {
        case "Two":
            return "2";
        case "Three":
            return "3";
        case "Four":
            return "4";
        case "Five":
            return "5";
        case "Six":
            return "6";
        case "Seven":
            return "7";
        case "Eight":
            return "8";
        case "Nine":
            return "9";
        case "Ten":
            return "0";
        default:
            console.log("Problem with my switch statement in valueToImageLetter");
            return "Arrgh";
    }
}

function deckId() {
    var id = "Deck" + nextDeckNumber;
    nextDeckNumber++;
    return id;
}

function drawCard(){
  var randomNumber = Math.random();

  var randomIndex = Math.floor(randomNumber * deck.length);

  var card = deck[randomIndex];

  deck.splice(randomIndex, 1);

  return card;

}
/*function deal(){
  $.getJSON("http://127.0.0.1:8081/draw", { } , function(data, status)
  {
    console.log(data);
    console.log(status);
    var suit = data.suit;
    var value = data.value;
    var image= data.image
}
)};
*/
function shuffle() {

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

deck = shuffle();
//console.log(cards);

//console.log(Math.random());

var app = express();


/*
app.get('/', function (req, res) {
   console.log(req.query);
   console.log(req.headers);
   var name = req.query.name;
   res.send('Hello: ' + name);
});
*/
app.get('/deal', function(req, res) {
  gameData.state = "newGame";
  gameData.table = {

    playersHand:[drawCard(),drawCard()],
    dealersHand:[{image:"http://www.jimknapp.com/Cards/Non-Bicycle_files/image002.jpg"}, drawCard()]
  };

    gameData.playerHandValue = handValue(gameData.table.playersHand);

    res.send(gameData);


});
app.get('/stand', function(req, res) {

    res.send(gameData);

});

app.get('/shuffle', function(req, res) {

    deck = shuffle();

    res.send(gameData);

});


app.get('/hit', function(req, res) {
  gameData.state = "inGame";

  gameData.table.playersHand.push(drawCard());

  gameData.playerHandValue = handValue(gameData.table.playersHand);

    if (gameData.playerHandValue > 21)
    {
        gameData.state = "busted";
    }

    res.send(gameData);

});

app.get('/stand', function(req, res) {

   // do the server side stuff for stand

   // set game state to whoever won

});

app.get('/draw', function(req, res) {

    if (deck.length === 0) {
        res.send({
            success: false
        });
    } else {
        var randomNumber = Math.random();

        // we want 0 to cards.length-1

        var randomIndex = Math.floor(randomNumber * deck.length);

        var card = deck[randomIndex];

        // remove the card from the deck

        deck.splice(randomIndex, 1);

        card.remaining = deck.length;
        card.success = true;

        card.image = "https://deckofcardsapi.com/static/img/" + valueToImageLetter(card.value) + card.suit[0] + ".png";

        console.log(card.image);

        var json = JSON.stringify(card);

        res.send(json);
    }
});


app.use(express.static('public'));



var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
