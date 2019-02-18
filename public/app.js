$.getJSON("/articles", function(data) {

  for (var i = 0; i < data.length; i++) {
    var card = $("<div>").addClass("card");
    var cardBody = $("<div>").addClass("card-body").attr("data-id", data[i]._id);
    var cardTitle = $("<h4>").addClass("card-title").text(data[i].title);
    var cardText = $("<p>").addClass("card-text").text(data[i].teaser);
    var articleLink = $("<a>").addClass("card-link").attr("href", "https://www.psychologytoday.com" + data[i].link).attr("target","_blank").text("Read Article");
    var articleNote = $("<button>").addClass("card-link notes").attr("data-id", data[i]._id).text("Write Notes");

    cardBody.append(cardTitle);
    cardBody.append(cardText);
    cardBody.append(articleLink);
    cardBody.append(articleNote);
    card.append(cardBody);
    $("#articles").append(card);
    console.log(data[i].teaser);
  }
});

$(document).on("click", ".notes", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data) {
      console.log(data);
      $("#notes").append("<h3>" + data.title + "</h>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      
      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function() {
   var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
 
    .then(function(data) {
      console.log(data);
      $("#notes").empty();
    });

   $("#titleinput").val("");
  $("#bodyinput").val("");
});
