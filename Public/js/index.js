$(document).ready(function() {

    var sessionId = "Unset";

    function clearTable() {
        $("#dealerTable img").remove();
        $("#playerTable img").remove();
    }

    function addCardToDealer(card) {
        $("#dealerTable").append('<img> </img>')
        $("#dealerTable > img:last").attr("src", card.image)
    }

    function addCardToPlayer(card) {
        $("#playerTable").append('<img> </img>')
        $("#playerTable > img:last").attr("src", card.image)
    }

    function updateCards(table) {

        for (var i = 0; i < table.playersHand.length; i++) {
            addCardToPlayer(table.playersHand[i]);
        }

        for (var i = 0; i < table.dealersHand.length; i++) {
            addCardToDealer(table.dealersHand[i]);
        }
    }

    function updateState(newState)
    {
      switch (newState)
      {
         case "newGame":
         case "inGame":
           $('#hit').prop("disabled", false);
           $('#stand').prop("disabled", false);
           $('#deal').prop("disabled", true);
           break;
         case "busted":
         case "playerWins":
         case "dealerWins":
         case "push":
           $('#hit').prop("disabled", true);
           $('#stand').prop("disabled", true);
           $('#deal').prop("disabled", false);
           break;
         default:
           // not sure what to do here
           $('#info').text("State: " + newState + " HOW DO I HANDLE THIS!!!");
           break;
      }

      switch (newState)
      {
         case "newGame":
         case "inGame":
           $('#info').text("Do you want to Hit or Stand?");
           break;
         case "busted":
           $('#info').text("Sorry... you Busted!");
           break;
         case "playerWins":
           $('#info').text("You somehow managed to Win!");
           break;
         case "dealerWins":
           $('#info').text("You are a clearly a Loser!");
           break;
         case "push":
           $('#info').text("It is a push... I'm sure you'll lose next time...");
           break;
         default:
           // not sure what to do here
           $('#info').text("State: " + newState + " HOW DO I HANDLE THIS!!!");
           break;
      }
    }

    function buttonHandler(url)
    {
      clearTable();
      $.getJSON(url, {}, function(gameData, status) {
          updateState(gameData.state);
          updateCards(gameData.table);
      });
    }

    $("#deal").click(function() {
      clearTable();
      $.getJSON("deal", {}, function(gameData, status) {

          sessionId = gameData.id;

          console.log(gameData.id);

          updateState(gameData.state);
          updateCards(gameData.table);
      });
    });

    $("#hit").click(function() {

        // somehow send that id back to the server
        clearTable();
        $.getJSON("hit", { id:sessionId }, function(gameData, status) {

            updateState(gameData.state);
            updateCards(gameData.table);
        });
    });

    $('#stand').click(function() {

              // somehow send that id back to the server
              clearTable();
              $.getJSON("stand", { id:sessionId }, function(gameData, status) {
      
                  updateState(gameData.state);
                  updateCards(gameData.table);
              });
    });
});
