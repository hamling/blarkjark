$(document).ready(function() {

            //var deckId = "s4gxjpl1rn0v";
            //var drawCardUrl = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/";
            //var shuffleDeckUrl = "https://deckofcardsapi.com/api/deck/" + deckId + "/shuffle/";

            function drawCard() {
                $.getJSON("http://127.0.0.1:8081/draw", {}, function(data, status) {
                    console.log(data);
                    console.log(status);
                    var suit = data.suit;
                    var value = data.value;
                    var image = data.image;
                });
                return {}
            }

            function addCardToDealer(card) {
                $("#dealerTable").append('<img> </img>')
                $("#dealerTable > img:last").attr("src", card.image)
            }

            function addFaceDownCardToDealer() {
                $("#dealerTable").append('<img src="http://www.murphysmagicsupplies.com/images_email/Mandolin_BACK.jpg"> </img>')

            }


            function addCardToPlayer(card) {
                $("#playerTable").append('<img> </img>')
                $("#playerTable > img:last").attr("src", card.image)

            }

            $('#stand').click(function() {
                $('#hit').prop("disabled", true);
                $.getJSON("http://127.0.0.1:8081/stand", {}, function(gameData, status) {

                      // TODO
                });

            });

            $("#deal").click(function() {
                $('#hit').prop("disabled", false);
                clearTable();
                $.getJSON("http://127.0.0.1:8081/deal", {}, function(gameData, status) {


                    $('#playerValue').text("Player Value: " + gameData.playerHandValue);

                    for (var i = 0; i < gameData.table.playersHand.length; i++) {
                        addCardToPlayer(gameData.table.playersHand[i]);
                    }

                    for (var x = 0; x < gameData.table.dealersHand.length; x++) {
                        addCardToDealer(gameData.table.dealersHand[x]);
                    }

                });

            });


            $("#hit").click(function() {
              clearTable();
                $.getJSON("http://127.0.0.1:8081/hit", {}, function(gameData, status) {

                    if (gameData.state === "busted") {
                       $('#playerValue').text("Player Busts the heck out of it");
                       $('#hit').prop("disabled", true);
                    }
                    else {
                      // look at gameData.status and do something clever
                      $('#playerValue').text("Player Value: " + gameData.playerHandValue);
                    }

                    for (var i = 0; i < gameData.table.playersHand.length; i++) {
                        addCardToPlayer(gameData.table.playersHand[i]);
                    }
                    for (var x = 0; x < gameData.table.dealersHand.length; x++) {
                        addCardToDealer(gameData.table.dealersHand[x]);
                    }

                });
              });
                function clearTable() {
                    $("img").remove();
                }

                $("#restart").click(function() {

                    clearTable();

                });
            });

            // move json to deal button
            //call json
            //edit hit function
            //modify server to display a different card by making a image
            //
