var CarouselTemplateController = function(currentRef){

    var _this = this;
	var appControlAudio = currentRef;
	var looping = 0;
	
	var clickToZoom;
	var description;
	var skippedSteps = 0;
	var frameheight = 0;
	var frameFixedHeight = 0;
	var audio;
	var txt_chng;
	var strlength;
	window.slideCompleted = false;
	window.videoEnded = true;
	var videoObj = $("#videoContainer")
    this.init = function(data){
        trace(":: Image Only Template Loaded ::");
        trace(data);
		baseURL = _model.getCourseDataObj().baseURL;
        _this.currentData = data;
		_this.loadUI(_this.currentData);
		window.audioEnded = false;
		
    }

    this.loadUI = function(data){
		$(".video_container_wrapper").css("display","none");
		txt_chng =  _model.getCourseDataObj().baseURL.split("/")[1];
		
		if(txt_chng == "english")
		{
			$(".video-overlay").find(".pause_txt").html("Video will be available to play after audio is completed.");
			$("#nextImage").html("<i class='fas fa-caret-right' ></i><span class='nxt_txt'>Next</span>");
			$("#prevImage").html("<i class='fas fa-caret-left'></i><span class='prev_txt'>Previous</span>");
		}
		else
		{
			$(".video-overlay").find(".pause_txt").html("वीडियो विल बी अवेलेबल टू प्ले आफ्टर ऑडियो ईस कम्पलीटिड।");
			$("#nextImage").html("<i class='fas fa-caret-right' ></i><span class='nxt_txt'>नेक्स्ट</span>");
			$("#prevImage").html("<i class='fas fa-caret-left'></i><span class='prev_txt'>प्रीवियस</span>");
		}

		appControlAudio.VideoplaypauseFlag = false;
        trace(":: Paint the Image Template UI ::");
        trace(data);
        $("#heading").html('').html(data.pageContent.heading);
		$("#prevImage").css({'pointer-events': 'none', 'opacity': 0.5});
		$("#nextImage").off("click").on("click", _this.nextImageHandler);
		$("#prevImage").off("click").on("click", _this.prevImageHandler);
		if(data.pageContent.topContent != "" || data.pageContent.topContent != undefined) {
			$(".top_content").html('').html(data.pageContent.topContent);
		}
        if(data.pageContent.instructions != "" || data.pageContent.instructions != undefined) {
			$("#instructions").html('').html(data.pageContent.instructions);
			$("#clk_txt").html(data.pageContent.instructions);
		}
		setTimeout(function(){
			_this.sliding();
		},500);
		
		
		_model.setTemplateStatus(true);


		$('#videoContainer').attr({
			
			loop: 'false'
		});

		if(data.pageContent.heading == "Assessment Standards"){
			// $(".img_part").css("width","45%");
		}

		if ((data.pageContent.heading.indexOf("sessment") > -1 || data.pageContent.heading.indexOf("ethod") > -1 || data.pageContent.heading.indexOf("kill") > -1 || data.pageContent.heading.indexOf("ecap") > -1)) {
			
			

		}else{
			
		}

		videoObj.unbind('play').bind("play", _this.videoPlayPauseHandler);

		videoObj.unbind('pause').bind("pause", _this.videoPauseHandler);

		videoObj.unbind('loadeddata').bind("loadeddata", _this.gettingMinHeight);

		window.addEventListener("resize", function(){
			_this.gettingMinHeight();
		});
	
    }
	
	this.nextImageHandler = function(){
		looping++;
		_this.sliding();
	}
	
	this.prevImageHandler = function(){
		looping--;
		_this.sliding();
	}

	this.videoPlayPauseHandler = function(){

		appControlAudio.VideoplaypauseFlag = true;
		$("#playPauseBtn i").addClass("fa-play").removeClass("fa-pause");
		if(window.source == "video"){
			$("#playPauseBtn, #audioMuteBtn").css({ 'pointer-events': 'none', 'opacity': 0.5 });
			currentRef.audioManager.stopAudio();
			currentRef.playPauseFlag = false;
		}
		
	}

	this.videoPauseHandler = function(){

		if(currentRef.menuRevealed == true){
			if(currentRef.VideoplaypauseFlag == true){
				//appCntl.VideoplaypauseFlag = true
			}else{
				currentRef.VideoplaypauseFlag = false;
			}
		}else{
			currentRef.VideoplaypauseFlag = false;
		}
	}

	this.gettingMinHeight = function(){
		$("#videoContainer").css("min-height", "auto");
		var minheight = $("#videoContainer").height();
		// console.log(minheight)
		$("#videoContainer").css("min-height", minheight+"px");
	}

	this.sliding = function(){
				if(looping < _this.currentData.pageContent.content.length){
				if(_this.currentData.pageContent.content[looping].description == "" || _this.currentData.pageContent.content[looping].description == undefined){
					$('.panel_content').css('visibility','hidden');
				}else{
					$('.panel_content').css('visibility','visible');
				}
				// console.log(_this.currentData.pageContent.content[looping].audio);
				
				if(_this.currentData.pageContent.content[looping].audio != "blank"){
					$("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
				}

				
				
				
				document.getElementById("videoContainer").controls = true;
				document.getElementById("videoContainer").loop = false;
				window.source = _this.currentData.pageContent.content[looping].source;
				if(window.source == "video"){
					
					
					window.videoEnded = false;
					$("#videoContainer").css("background-color","none");
					$("#videoContainer").css('display','block');
					$(".video_container_wrapper").css('display','block');
					//$(".next_btn,.previous_btn").css("z-index","850");
					
					$(".img-cont").hide();
					$("#videoContainer").attr("src", _this.currentData.pageContent.content[looping].path);
					$("#videoContainer")[0].pause();
					$(".video-overlay").show();
					if(_this.currentData.pageContent.content[looping].audio == "blank"){
						if(currentRef.playPauseFlag == false) {
							$(".video-overlay").hide();
						}
						
					}
					
					
					
					$("#videoContainer").unbind('ended').bind("ended", _this.videoEndHandler);
					$('#videoContainer').attr('controls', true);
					$("#videoContainer").bind('ended', function(){
						$(this)[0].pause();
						$('#videoContainer').attr('controls', true);
					});
					
				} else{
					window.videoEnded = true;
					$("#videoContainer").hide();
					$(".video_container_wrapper").hide();
					$(".img-cont").show();
					$("#img").attr("src",  _this.currentData.pageContent.content[looping].path);
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
				
				$("#nextImage").css({'pointer-events': 'auto', 'opacity': 1});
				$("#prevImage").css({'pointer-events': 'auto', 'opacity': 1});
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
					$("#playPauseBtn, #audioMuteBtn").css({ 'pointer-events': 'auto', 'opacity': 1 });
				}

				if(window.audioEnded){
					$('#videoContainer')[0].play();
				 }
				
			} 
			if((parseInt(_this.currentData.pageContent.content.length - parseInt(1))) == looping){
				$("#nextImage").css({'pointer-events': 'none', 'opacity': 0.5});

				window.slideCompleted = true;
				if(window.audioEnded == true){
					if(window.source != "video"){
						$("#nextNotification").fadeIn(800);
						$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
						$("#nextBtn").addClass("animateNextButton");
						$("#menuItem_"+window.currentIndexRef+" , #menuItem_"+window.nextIndexRef+"").css({'pointer-events': 'auto', 'opacity': 1}); 
						$("#menuItem_"+window.currentIndexRef+" ").addClass('completed');
						$(".completed").css({'pointer-events': 'auto', 'opacity': 1});
						//window.audioEnded = false;

						if(!$(".menu_active i").hasClass("pull-right")){
							$(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
						}

						if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
                            currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
                            currentRef.checkChapterCompletionStatus();
                        }
					}
				}
			}
			if(looping == 0){
				$("#prevImage").css({'pointer-events': 'none', 'opacity': 0.5});
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
		appControlAudio.VideoplaypauseFlag = false;
		if(window.audioEnded == true && window.slideCompleted == true){
			
			$("#nextNotification").fadeIn(800);
			$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
			$("#nextBtn").addClass("animateNextButton");
			$("#menuItem_"+window.currentIndexRef+" , #menuItem_"+window.currentIndexRef+"").css({'pointer-events': 'auto', 'opacity': 1}); 
			$("#menuItem_"+window.nextIndexRef+" , #menuItem_"+window.nextIndexRef+"").addClass('completed');
			$(".completed").css({'pointer-events': 'auto', 'opacity': 1});

			if(!$(".menu_active i").hasClass("pull-right")){
				$(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
			}

			if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
				currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
				currentRef.checkChapterCompletionStatus();
			}
		}
		setTimeout(function(){
			$("#playPauseBtn, #audioMuteBtn").css({ 'pointer-events': 'auto', 'opacity': 1 });
		},300);
		
		window.videoEnded = true;
		_model.setTemplateStatus(true);
			_model.setAudioStatus(true);
		EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
	}
}