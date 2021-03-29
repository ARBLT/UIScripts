/**
 * Created by Ravi Sharma on 8/10/2016.
 */

var ImageWithAudioController = function(currentRef){

	console.log(currentRef)
	var imageWithAudioInterval;
    var _this = this;
	var currentData, ButtonPopup;
	var audioLoop = 0;
	var appControlAudio = currentRef;
    this.init = function(data){
        trace(":: Image Only Template Loaded ::");
        trace(data);
		
		baseURL = _model.getCourseDataObj().baseURL;
		imageAudio = 0;
        _this.currentData = data;
        _this.loadUI(_this.currentData);
    }

    this.loadUI = function(data){
        trace(":: Paint the Image Template UI ::");
        trace(data);
		console.log(data.pageContent.content.length)
        $("#heading").html('').html(data.pageContent.heading);
		
		/* for(var i=0; i<data.pageContent.content.length; i++){
			console.log(data.pageContent.content[i])
		} */
		if((data.pageContent.loop != "false") && (data.pageContent.loop != "")){ console.log("loop")
			imageWithAudioInterval = setInterval(function(){ 
				_this.audioLooping();
			}, data.pageContent.intervalTime);
		} else { console.log("audio")
			EventManager.getInstance().addControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, _this.audioLooping);
		}
        _model.setTemplateStatus(true);
    }
	
	
	this.audioLooping = function(){
		console.log(audioLoop)
			if(audioLoop < _this.currentData.pageContent.content.length){
				console.log(appControlAudio.playPauseFlag);
				
				$("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
				$("#img").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.content[audioLoop].imagePath);
				$("#textDescription").html(_this.currentData.pageContent.content[audioLoop].description);
				$("#audioTranscriptPopupContainer").html(_this.currentData.pageContent.content[audioLoop].transcript);
				//ButtonPopup.stopAudio();
				if((_this.currentData.pageContent.loop != "false") && (_this.currentData.pageContent.loop != "")){
					console.log("loopAudio");
				}else{
					appControlAudio.playPauseFlag = true;
					appControlAudio.audioManager.loadAudio(_model.getCourseDataObj().baseURL+"assets/media/audio/"+_this.currentData.pageContent.content[audioLoop].audio+"");
				}
				if(appControlAudio.playPauseFlag == false){
					$("#playPauseBtn img").attr("src","assets/images/play_button.png");
				}
				//ButtonPopup.loadAudio(baseURL+"assets/media/audio/"+_this.currentData.pageContent.content[audioLoop].audio+"");
				audioLoop++;
			}else{
				//alert("else")
				if((_this.currentData.pageContent.loop != "false") && (_this.currentData.pageContent.loop != "")){
					clearInterval(imageWithAudioInterval);
				}else{
					appControlAudio.audioManager.stopAudio();
					EventManager.getInstance().removeControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, _this.audioLooping);
				}
			}

	}
	
	this.clear = function(){
		clearInterval(imageWithAudioInterval);
		EventManager.getInstance().removeControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, _this.audioLooping);
	}
}