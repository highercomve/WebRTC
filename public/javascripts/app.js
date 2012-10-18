// Generated by CoffeeScript 1.3.3
(function() {
  var channel, iceCallback1, offer, onRemoteStreamAdded, pc1, pusher, videoFail, videoSuccess;

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  window.URL = window.URL || window.webkitURL;

  iceCallback1 = function(candidate, b) {
    if (candidate) {
      return pc1.processIceMessage(candidate);
    }
  };

  pc1 = new webkitPeerConnection00("STUN stun.l.google.com:19302", iceCallback1);

  onRemoteStreamAdded = function(event) {
    var url;
    url = webkitURL.createObjectURL(event.stream);
    $('#otherVid').attr('src', url);
    console.log("======");
    console.log(url);
    return console.log("======");
  };

  pc1.onaddstream = onRemoteStreamAdded;

  offer = "";

  videoSuccess = function(localMediaStream) {
    $('#myVid').attr('src', window.URL.createObjectURL(localMediaStream));
    return pc1.addStream(localMediaStream);
  };

  videoFail = function(error) {
    return console.log(error);
  };

  navigator.getUserMedia({
    video: true
  }, videoSuccess, videoFail);

  Pusher.log = function(message) {
    return console.log(message);
  };

  Pusher.channel_auth_transport = 'jsonp';

  Pusher.channel_auth_endpoint = 'http://pusherpresence.herokuapp.com/pusher/auth';

  pusher = new Pusher('9e96f2d1617cc3aa954f');

  channel = pusher.subscribe('presence-test');

  channel.bind("client-offer", function(data) {
    var answer;
    answer = pc1.createAnswer(data.offer, {
      has_audio: true,
      has_video: true
    });
    console.log(data.offer);
    pc1.setRemoteDescription(pc1.SDP_OFFER, new SessionDescription(data.offer));
    console.log("remote description has been set");
    pc1.setLocalDescription(pc1.SDP_ANSWER, answer);
    console.log("Local Description answer has been set");
    channel.trigger("client-answer", {
      answer: answer.toSdp()
    });
    return pc1.startIce();
  });

}).call(this);
