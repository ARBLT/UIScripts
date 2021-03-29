var AudioManager = function(){

    var audioReference = this;
    this._model = DataManager.getInstance();

    this.loadAudio = function(currentAudioURL){
        trace(":: Audio Manager - Load Audio :: "+ currentAudioURL);

        audioReference._model.getAudioReference().jPlayer(
            "setMedia", {
                mp3: currentAudioURL + ".mp3",
                ogg: currentAudioURL + ".ogg"
            });
        
            
        audioReference.playAudio();
       if(currentAudioURL.indexOf("homeloop") != -1){
        document.getElementById(''+(audioReference._model.getAudioReference().context.id)+'').children[1].loop = true
        document.getElementById(''+(audioReference._model.getAudioReference().context.id)+'').children[1].autoplay = true;
       }else{
        document.getElementById(''+(audioReference._model.getAudioReference().context.id)+'').children[1].loop = false
       }
       
    }

    this.playAudio = function(){
        trace(":: Audio Manager - Play Audio ::");
        audioReference._model.getAudioReference().jPlayer("play");
        
    }

    this.pauseAudio = function(){
        trace(":: Audio Manager - Pause Audio ::");
        audioReference._model.getAudioReference().jPlayer("pause");
    }

    this.stopAudio = function(){
        trace(":: Audio Manager - Stop Audio ::");
        audioReference._model.getAudioReference().jPlayer("stop");
    }
	
	this.muteAudio = function(){
        trace(":: Audio Manager - mute Audio ::");
        audioReference._model.getAudioReference().jPlayer("volume", 0);
        audioReference._model.getAudioReference().jPlayer("mute");
    }
	
	this.unMuteAudio = function(){
        trace(":: Audio Manager - unmute Audio ::");
        audioReference._model.getAudioReference().jPlayer("volume", 1);
        audioReference._model.getAudioReference().jPlayer("unmute");
    }

    this.getCurrentTime = function(){
       var currentTime = audioReference._model.getAudioReference().jPlayer()[0].childNodes[1].currentTime;
        return currentTime;
    }

    this.setCurrentTime = function(data){
       
        audioReference._model.getAudioReference().jPlayer()[0].childNodes[1].currentTime = data;
    }

    this.getTotalTime = function(){
        trace(":: Audio Manager - getTotalTime of Audio ::");
    }
	
	this.clearAudio = function(){
		 trace(":: Audio Manager - Clear Audio ::");
		 audioReference._model.getAudioReference().jPlayer("clearMedia");
	}
}