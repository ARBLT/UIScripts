var PopupAudioManager = function(){

    var audioReference = this;
	var _audioEndCallback;
    this._model = DataManager.getInstance();

    this.loadAudio = function(currentAudioURL,audioEndCallback){
        trace(":: Audio Manager - Load Audio :: "+ currentAudioURL);
		
		console.log( audioReference._model );
		
        audioReference._model.getPopupAudioReference().jPlayer(
            "setMedia", {
                mp3: currentAudioURL + ".mp3",
                ogg: currentAudioURL + ".ogg"
            });
        audioReference.playAudio();
		
		if(audioEndCallback != undefined){
			_audioEndCallback = audioEndCallback;
			audioReference._model.getPopupAudioReference().unbind($.jPlayer.event.ended, audioReference.onAudioEnd);
			audioReference._model.getPopupAudioReference().bind($.jPlayer.event.ended, audioReference.onAudioEnd);
		}
    }
	
	this.onAudioEnd = function(){
		console.log('Popup audio end');
		_audioEndCallback();
		audioReference._model.getPopupAudioReference().unbind($.jPlayer.event.ended, audioReference.onAudioEnd);
	}
		
    this.playAudio = function(){
        trace(":: Audio Manager - Play Audio ::");
        audioReference._model.getPopupAudioReference().jPlayer("play");
    }

    this.pauseAudio = function(){
        trace(":: Audio Manager - Pause Audio ::");
        audioReference._model.getPopupAudioReference().jPlayer("pause");
    }

    this.stopAudio = function(){
        trace(":: Audio Manager - Stop Audio ::");
        audioReference._model.getPopupAudioReference().jPlayer("stop");
    }
	
	this.muteAudio = function(){
        trace(":: Audio Manager - mute Audio ::");
        audioReference._model.getPopupAudioReference().jPlayer("volume", 0);
        audioReference._model.getPopupAudioReference().jPlayer("mute");
    }
	
	this.unMuteAudio = function(){
        trace(":: Audio Manager - unmute Audio ::");
        audioReference._model.getPopupAudioReference().jPlayer("volume", 1);
        audioReference._model.getPopupAudioReference().jPlayer("unmute");
    }

    this.getCurrentTime = function(){
        trace(":: Audio Manager - getCurrentTime of Audio ::");
    }

    this.getTotalTime = function(){
        trace(":: Audio Manager - getTotalTime of Audio ::");
    }
	
	this.clearAudio = function(){
		 trace(":: Audio Manager - Clear Audio ::");
		 audioReference._model.getPopupAudioReference().jPlayer("clearMedia");
	}
}