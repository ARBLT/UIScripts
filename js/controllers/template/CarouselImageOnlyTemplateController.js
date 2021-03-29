var CarouselImageOnlyTemplateController = function(currentRef){

    var _this = this;
	var appControlAudio = currentRef;
	var looping = 0;
	
	var clickToZoom;
	var description;
	var skippedSteps = 0;
	var frameheight = 0;
	var frameFixedHeight = 0;
	var audio;
	var strlength;
	var txt_chng;
	window.slideCompleted = false;
	window.videoEnded = true;
    this.init = function(data){
        trace(":: Image Only Template Loaded ::");
        trace(data);
		baseURL = _model.getCourseDataObj().baseURL;
        _this.currentData = data;
		_this.loadUI(_this.currentData);
		
    }

    this.loadUI = function(data){
		$(".video_container_wrapper").css("display","none");

		txt_chng =  _model.getCourseDataObj().baseURL.split("/")[1];
		
		if(txt_chng == "english")
		{
			$("#nextImage").html("<i class='fas fa-caret-right' ></i><span class='nxt_txt'>Next</span>");
			$("#prevImage").html("<i class='fas fa-caret-left'></i><span class='prev_txt'>Previous</span>");
		}
		else
		{
			$("#nextImage").html("<i class='fas fa-caret-right' ></i><span class='nxt_txt'>नेक्स्ट</span>");
			$("#prevImage").html("<i class='fas fa-caret-left'></i><span class='prev_txt'>प्रीवियस</span>");
		}

		window.audioEnded = false;
        trace(":: Paint the Image Template UI ::");
        trace(data);
        $("#heading").html('').html(data.pageContent.heading);
		$("#prevImage").css({'pointer-events': 'none', 'opacity': 0.5,'cursor':'default'});
		$("#nextImage").off("click").on("click", _this.nextImageHandler);
		$("#nextImage").addClass("next_bts");
		$("#prevImage").on("click").off("click", _this.prevImageHandler);
		
		if(data.pageContent.topContent != "" || data.pageContent.topContent != undefined) {
			$(".top_content").html('').html(data.pageContent.topContent);
		}
		if(data.pageContent.instructions != "" || data.pageContent.instructions != undefined) {
			$("#instructions").html('').html(data.pageContent.instructions);
		}
		if(data.pageContent.heading == "Recap"){
			//$('.con_part').addClass('newfont_size');
		}
		
        
		setTimeout(function(){
			_this.sliding();
		},500);
		
		
		_model.setTemplateStatus(true);


		$('#videoContainer').attr({
			
			loop: 'false'
		});

		if ((data.pageContent.heading.indexOf("sessment") > -1 || data.pageContent.heading.indexOf("ethod") > -1 || data.pageContent.heading.indexOf("kill") > -1 || data.pageContent.heading.indexOf("ecap") > -1)) {
			
			
			 
		}else{
			
		}
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

				//$("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
				document.getElementById("videoContainer").controls = false;
				document.getElementById("videoContainer").loop = false;
				window.source = _this.currentData.pageContent.content[looping].source;
				if(window.source == "video"){
					window.videoEnded = false;
					$("#videoContainer").css("background-color","black");
					$("#videoContainer").css('display','block');
					
					$("#img").hide();
					$("#videoContainer").attr("src", _this.currentData.pageContent.content[looping].path);
					$("#videoContainer").unbind('ended').bind("ended", _this.videoEndHandler);
					$('#videoContainer').attr('controls', false);
					
				} else{
					window.videoEnded = true;
					$("#videoContainer").hide();
					$("#img").show();
					$("#img").attr("src",  _this.currentData.pageContent.content[looping].path);
				}
				 audio = _this.currentData.pageContent.content[looping].autoplay
				 if(audio == true){
					$('#videoContainer')[0].play();
				 }
				clickToZoom = _this.currentData.pageContent.content[looping].clickToZoom;
				if(clickToZoom){
					$("#img").unbind("click").bind("click", _this.zoomPopupHandler).css("cursor","pointer");
				}
				description = _this.currentData.pageContent.content[looping].description;
				if(description == "blank"){
					$(".panel_section").hide();
				}
				else{
					$(".panel_section").show();
					$("#textDescription").html(_this.currentData.pageContent.content[looping].description);
					strlength = _this.currentData.pageContent.content[looping].description.length;
					//console.log(strlength);
					if(strlength > 120){
						$("#textDescription").addClass("left_alignment");
					}else{
						$("#textDescription").removeClass("left_alignment");
					}

				}
				$("#audioTranscriptPopupContainer").html(_this.currentData.pageContent.content[looping].transcript);
				
				$("#nextImage").css({'pointer-events': 'auto', 'opacity': 1,'cursor':'pointer'});
				$("#nextImage").off("click").on("click", _this.nextImageHandler);
				$("#nextImage").addClass("next_bts");
				$("#prevImage").css({'pointer-events': 'auto', 'opacity': 1,'cursor':'pointer'});
				$("#prevImage").off("click").on("click", _this.prevImageHandler);
				$("#prevImage").addClass("previous_bts");
				$("#stepsCount_button").html("")
				if(_this.currentData.pageContent.content[looping].showStep){
					$("#stepsCount_button").html("Steps: "+(looping+parseInt(1 - skippedSteps))+"/"+ (_this.currentData.pageContent.content.length - skippedSteps));
				}else{
					skippedSteps += 1;
				}
				//appControlAudio.playPauseFlag = true;
				if(_this.currentData.pageContent.content[looping].audio != "blank"){
					window.audioEnded = false;
					currentRef.manualStorpTriggered = false;
					appControlAudio.audioManager.loadAudio(_model.getCourseDataObj().baseURL+"assets/media/audio/"+_this.currentData.pageContent.content[looping].audio+"");
					currentRef.playPauseFlag = true;
					$("#playPauseBtn i").addClass("fa-pause").removeClass("fa-play");
				}
				
			} 
			if((parseInt(_this.currentData.pageContent.content.length - parseInt(1))) == looping){
				$("#nextImage").css({'pointer-events': 'auto','opacity': 0.5,'cursor':'default'});
				$("#nextImage").on("click").off("click", _this.nextImageHandler);
				$("#nextImage").removeClass("next_bts");

				window.slideCompleted = true;
				
				if(window.audioEnded == true){
					if(window.source != "video"){
						$("#nextNotification").fadeIn(800);
						$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1,'cursor':'pointer'});
						$("#nextBtn").addClass("animateNextButton");
						$("#menuItem_"+window.currentIndexRef+" , #menuItem_"+window.currentIndexRef+"").css({'pointer-events': 'auto', 'opacity': 1}); 
						$("#menuItem_"+window.currentIndexRef+" ").addClass('completed');
						$(".completed").css({'pointer-events': 'auto', 'opacity': 1});

						if(!$(".menu_active i").hasClass("pull-right")){
							$(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
						}

						if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
                            currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
                            currentRef.checkChapterCompletionStatus();
                        }
						window.audioEnded = false;
					}
				}
			}
			if(looping == 0){
				$("#prevImage").css({'pointer-events': 'auto', 'opacity': 0.5,'cursor':'default'});
				$("#prevImage").on("click").off("click", _this.prevImageHandler);
				$("#prevImage").removeClass("previous_bts");
			}
	}
	
	this.clear = function(){
		
	}
	_this.zoomPopupHandler = function(imageType){
		$("#imagePopup").show();
		_model.setTemplateStatus(true);
		// EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		$("#img").attr("data-toggle","modal").attr("data-target","#imagePopup");
		$("#imageZoom").attr("src", _this.currentData.pageContent.content[looping].zoomImage);		
	}

	this.videoEndHandler = function(){
		
		if(window.audioEnded == true && window.slideCompleted == true){
			
			$("#nextNotification").fadeIn(800);
			$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1,'cursor':'pointer'});
			$("#nextBtn").addClass("animateNextButton");
			$("#menuItem_"+window.currentIndexRef+" , #menuItem_"+window.nextIndexRef+"").css({'pointer-events': 'auto', 'opacity': 1}); 
			$("#menuItem_"+window.currentIndexRef+" ").addClass('completed');
			$(".completed").css({'pointer-events': 'auto', 'opacity': 1});

			if(!$(".menu_active i").hasClass("pull-right")){
				$(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
			}
		}
		window.videoEnded = true;
		_model.setTemplateStatus(true);
			_model.setAudioStatus(true);
		EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
	}
}