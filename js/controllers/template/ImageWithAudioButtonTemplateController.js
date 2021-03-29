/**
 * Created by Venkatesh on 24/03/2017.
 */

var ImageWithAudioButtonController = function(currentRef){

    var _this = this;
	var appControlAudio = currentRef;
	var looping = 0;
	
    this.init = function(data){
        trace(":: Image Only Template Loaded ::");
        trace(data);
		
		baseURL = _model.getCourseDataObj().baseURL;
		
        _this.currentData = data;
        _this.loadUI(_this.currentData);
    }

    this.loadUI = function(data){
        trace(":: Paint the Image Template UI ::");
        trace(data);
		
        $("#heading").html('').html(data.pageContent.heading);
		
		$("#prevImage").css({'pointer-events': 'none', 'opacity': 0.5});
				
		$("#nextImage").off("click").on("click", _this.nextImageHandler);
		$("#prevImage").off("click").on("click", _this.prevImageHandler);
        
		setTimeout(function(){
			_this.sliding();
		},500);
		
		
		_model.setTemplateStatus(true);
    }
	
	this.nextImageHandler = function(){
		looping++;
		_this.sliding();
	}
	
	this.prevImageHandler = function(){
		looping--;
		_this.sliding();
	}
	
	this.sliding = function(){
		
		
			if(looping < _this.currentData.pageContent.content.length){
				if(_this.currentData.pageContent.content[looping].description == "" || _this.currentData.pageContent.content[looping].description == undefined){
					$('.panel_content').css('visibility','hidden');
				}else{
					$('.panel_content').css('visibility','visible');
				}
				console.log(_this.currentData.pageContent.content[looping].audio);
				$("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
				$("#img").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.content[looping].imagePath);
				$("#textDescription").html(_this.currentData.pageContent.content[looping].description);
				$("#audioTranscriptPopupContainer").html(_this.currentData.pageContent.content[looping].transcript);
				
				$("#nextImage").css({'pointer-events': 'auto', 'opacity': 1});
				$("#prevImage").css({'pointer-events': 'auto', 'opacity': 1});
				$("#stepsCount_button").html("").html("Steps: "+(looping+parseInt(1))+"/"+ _this.currentData.pageContent.content.length);
				appControlAudio.playPauseFlag = true;
				appControlAudio.audioManager.loadAudio(_model.getCourseDataObj().baseURL+"assets/media/audio/"+_this.currentData.pageContent.content[looping].audio+"");
				
			} 
			
			if((parseInt(_this.currentData.pageContent.content.length - parseInt(1))) == looping){
				$("#nextImage").css({'pointer-events': 'none', 'opacity': 0.5});
			}
			
			if(looping == 0){
				$("#prevImage").css({'pointer-events': 'none', 'opacity': 0.5});
			}
			//console.log('hi');
			MathJax.Hub.Queue([ "Typeset",MathJax.Hub]);
			
	}
	
	
	this.clear = function(){
		
	}
}