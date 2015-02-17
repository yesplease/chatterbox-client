var app = {
  username: window.location.search.substr(10),
  text: "Beware.",
  roomname: window.prompt("Which room do you want to join? Lobby or Everywhere?"),
  friends: [],
  uniq: [],
  // server: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
  server: 'https://api.parse.com/1/classes/chatterbox'
}

var message = {
  username: app.username,
  text: "initial",
  roomname: app.roomname
};

app.clearMessages = function(){
  $('#chats').empty();
};

app.addMessage = function(msg){
  app.send(msg);
};



app.fetch = function(room){
 $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/json',

    data: {
      where:{"roomname": room},
      order:"-createdAt"
      },
    success: function (data) {
      console.dir(data.results);
      displayChats(data.results);
    } ,
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get messages');
    }
  });
}


app.send = function(chat){
  $.ajax({
    // always use this url
    url: app.server,
    type: 'POST',
    data: JSON.stringify(chat),
    contentType: 'application/json',
    success: function (data) {
      app.fetch(app.roomname);
    } ,
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.init = function(){
  app.fetch(this.roomname);
};

var displayChats = function(chatsArray){
  for (var i = chatsArray.length - 1; i >= 0; i--){
    if(app.uniq.indexOf(chatsArray[i].objectId) === -1){
      var escName = _.escape(chatsArray[i].username);
      var escText = _.escape(chatsArray[i].text);
      var index = app.friends.indexOf(escName);
      if (index === -1){
        $('#chats').prepend("<li><a class ='stranger'>" + escName + "</a>: " + escText + "</li>");


      } else {
        $('#chats').prepend("<li><a class ='friend'>" + escName + "</a>: " + escText + "</li>");
      }
      app.uniq.push(chatsArray[i].objectId);
    }
  }
  $("a").on("click", function(){
    var clickedName = $(this).text();
    var index = app.friends.indexOf(clickedName);
    if (index === -1){
      app.friends.push(clickedName);
    } else {
      app.friends.splice(index, 1);
    }
    $("a:contains('" + clickedName + "')" ).toggleClass("friend");
    console.log(app.friends)
  });

};


//form submit
$("#refresher").click(function(){
  app.fetch(app.roomname);
});


$('#send').click(function() {
  var input = $('#message').val();
  message.text = input;
  app.send(message);
  $('#message').val("");
});

$('#changeRoom').click(function() {
  app.roomname = window.prompt("Which room do you want to join? Lobby or Everywhere?");
  app.fetch(app.roomname);
});


$(document).ready(app.init());
