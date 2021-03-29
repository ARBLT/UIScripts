/**
 * Created by Ravi Sharma on 8/10/2016.
 */

var ModuleVideoTemplateController = function(){

    var _this = this;
	var jsonData;
	
	var video1 = "Rajavel_Formwork.mp4";
	var video2 = "Asok_Kumar.mp4";
	var video3 = "Subbramaniyan.mp4";
	
	var videoName1 = "";
	var videoName2 = "";
	var videoName3 = "";
	var videoDesignation1 = "";
	var videoDesignation2 = "";
	var videoDesignation3 = "";
	
	var isVideo1Completed = false;
	var isVideo2Completed = false;
	var isVideo3Completed = false;
	var moduleVideoAudioManager;
	var numItems,videoCount = 0, videoCheck = 0;
    this.init = function(data){
        trace(":: Module Video Template Loaded ::");
		jsonData = data;
		
        _this.loadUI();
		moduleVideoAudioManager = new AudioManager();
		console.log(data);
		
		numItems = $('.videoCls');
		videoCount =numItems.length;
		console.log("video area::"+numItems.length);
    }
	this.clear = function(){
		
	}
    this.loadUI = function(data){
	

        trace(":: Paint the Module Video Template UI ::");
		
		$("#video1, #video2, #video3").unbind('click').bind("click", _this.videoPopupHandler);
		$("#myModal").on("hidden.bs.modal", _this.videoAudioManager);	
		//$("#videoTemplateContainer").bind("ended", _this.videoEndHandler);
						
		
		_model.setAudioStatus(true);
		
    }
	
	$('#videoPopup').on('hidden.bs.modal', function(e) { 
		var vid = document.getElementById("demoVideo"); 
		vid.pause();
		vid.currentTime = 0;
		audioBg.play();
		audioBg.loop = true;
	});
	
	_this.videoAudioManager = function(e){
		moduleVideoAudioManager.stopAudio();
		var vid = document.getElementById("videoTemplatePopup"); 
		vid.pause();
		vid.currentTime = 0;
	}
	
	_this.videoPopupHandler = function(){ 
	id = this.id; 
	
		if(id == "video1"){
			$("#videoTemplatePopup").attr('src', _model.getCourseDataObj().baseURL+"assets/media/video/"+video1);
			$("#myModalLabel").html('').html(videoName1);
			$("#designation").html('').html(videoDesignation1);
		} else if(id == "video2"){
			$("#videoTemplatePopup").attr('src', _model.getCourseDataObj().baseURL+"assets/media/video/"+video2);
			$("#myModalLabel").html('').html(videoName2);
			$("#designation").html('').html(videoDesignation2);
		} else {
			$("#videoTemplatePopup").attr('src', _model.getCourseDataObj().baseURL+"assets/media/video/"+video3);
			$("#myModalLabel").html('').html(videoName3);
			$("#designation").html('').html(videoDesignation3);
		}
		
	/* moduleVideoAudioManager.playPauseFlag = false;	*/	
	moduleVideoAudioManager.stopAudio(); 
	
            $("#playPauseBtn img").attr('src', 'assets/images/play_button.png');
			
	
		$("#videoTemplatePopup").off("ended").on("ended", _this.videoEndHandler);
	}
	
	_this.videoEndHandler = function(){
			$("#videoTemplatePopup").off("ended");
			
			if(id == "video1"){
				isVideo1Completed = true;
			}
			
			if(id == "video2"){
				isVideo2Completed = true;
			}
			
			if(id == "video3"){
				isVideo3Completed = true;
			}
			
			if(isVideo1Completed || isVideo2Completed || isVideo3Completed){
				//_model.setTemplateStatus(true);
				//EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
			}
			
			videoCheck++;
			console.log(videoCheck)
			if(videoCount == videoCheck){

			_model.setTemplateStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
			
		}
	}

}