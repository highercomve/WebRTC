// Generated by CoffeeScript 1.3.3
(function() {
  var channel, count, iceCallback1, offer, onRemoteStreamAdded, pc1, pusher, startStreaming, videoFail, videoSuccess;

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  window.URL = window.URL || window.webkitURL;

  offer = "";

  count = 0;

  iceCallback1 = function(candidate, b) {
    if (candidate) {
      return pc1.processIceMessage(candidate);
    }
  };

  pc1 = new webkitPeerConnection00("STUN stun.l.google.com:19302", iceCallback1);

  onRemoteStreamAdded = function(event) {
    var url;
    url = webkitURL.createObjectURL(event.stream);
    return $('#otherVid').attr('src', url);
  };

  pc1.onaddstream = onRemoteStreamAdded;

  videoSuccess = function(localMediaStream) {
    $('#myVid').attr('src', window.URL.createObjectURL(localMediaStream));
    pc1.addStream(localMediaStream);
    if (count > 1) {
      console.log(count);
      console.log("I'm last guy in the house");
      offer = pc1.createOffer({
        audio: true,
        video: true
      });
      pc1.setLocalDescription(pc1.SDP_OFFER, offer);
      return channel.trigger("client-offer", {
        offer: offer.toSdp()
      });
    }
  };

  videoFail = function(error) {
    return console.log(error);
  };

  navigator.getUserMedia({
    video: true
  }, videoSuccess, videoFail);

  startStreaming = function() {
    return pc1.startIce();
  };

  Pusher.channel_auth_transport = 'jsonp';

  Pusher.channel_auth_endpoint = 'http://pusherpresence.herokuapp.com/pusher/auth';

  pusher = new Pusher('9e96f2d1617cc3aa954f');

  channel = pusher.subscribe('presence-test');

  channel.bind('pusher:subscription_succeeded', function() {
    return count = channel.members.count;
  });

  channel.bind("client-answer", function(data) {
    console.log("answer received");
    pc1.setRemoteDescription(pc1.SDP_ANSWER, new SessionDescription(data.answer));
    return pc1.startIce();
  });

  channel.bind("client-offer", function(data) {
    var answer;
    console.log("offer received");
    answer = pc1.createAnswer(data.offer, {
      has_audio: true,
      has_video: true
    });
    pc1.setRemoteDescription(pc1.SDP_OFFER, new SessionDescription(data.offer));
    pc1.setLocalDescription(pc1.SDP_ANSWER, answer);
    channel.trigger("client-answer", {
      answer: answer.toSdp()
    });
    return pc1.startIce();
  });

}).call(this);
