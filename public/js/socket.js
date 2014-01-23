 var socket = io.connect('127.0.0.1');
      jQuery(function ($) {
        var loveList = $('#love');
        socket.on('loveTweet', function (data) {
          loveList
            .prepend('<li> <img src="'+ data.pic+'" width="42" height="42"><p>' + data.user + ': ' + data.text + '</p></li>');

          });

        var hateList = $('#hate');
        socket.on('hateTweet', function (data) {
          hateList
            .prepend('<li> <img src="'+ data.pic+'" width="42" height="42">' + data.user + ': ' + data.text + '</li>');

          });
      });