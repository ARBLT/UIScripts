var VideoTemplateController = function (currentRef) {
	var _this = this;
	var appCntl = currentRef;
	var vidPlayPause = false;	
	appCntl.videoInterval = 0;

	var videoCurrentTime = 0;
	var audioName;
	var audioLoaded = false;
	var videoObj = $('#videoTemplateContainer');
	var audioObj;
	var txt_chng;
	this.init = function (data) {
		trace(":: Text and Video Template Loaded ::");
		trace(data);
		audioObj = new AudioManager();
		// if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
		// 	$("#videoPlayIcon").hide();
		// }
		
		$("#playPauseBtn img").attr('src', 'assets/images/play_button.png');
		//EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		_this.data = data;
		
		_this.loadUI(data);
		
	}

	this.loadUI = function (data) {

		txt_chng =  _model.getCourseDataObj().baseURL.split("/")[1];;
		
		if(txt_chng == "english")
		{
			$(".video-overlay").find(".pause_txt").html("Video will be available to play after audio is completed.");
		}
		else
		{
			$(".video-overlay").find(".pause_txt").html("वीडियो विल बी अवेलेबल टू प्ले आफ्टर ऑडियो ईस कम्पलीटिड।");
		}


		vidPlayPause = false;
		appCntl.VideoplaypauseFlag = false;
		$("#heading").html(data.pageContent.heading);

		if (data.pageContent.video) {
			videoObj.attr("src", _model.getCourseDataObj().baseURL + "assets/media/video/" + data.pageContent.video);
		} else {
			videoObj.attr("src", data.pageContent.urlVideo);
		}



		//append option in select

		// var urlAudios = data.pageContent.urlAudio;
		// //console.log(urlAudios);
		// var ranAudio;
		// for (ranAudio in urlAudios) {
		// 	//	console.log(ranAudio);
		// 	//	console.log(urlAudios[ranAudio]);
		// 	if (urlAudios[ranAudio]) {
		// 		currAudioObj = urlAudios[ranAudio].split('.');
		// 		currAudio = currAudioObj[0];
		// 		$('select').append('<option data-audio-name="' + currAudio + '">' + ranAudio + '</option>');
		// 	}
		// }


		//console.log("_model.getAppDataObj().dataSpeed:  "+_model.getAppDataObj().dataSpeed)
		//var curIndex = $('select').prop('selectedIndex');

		

		if ((data.pageContent.content != undefined) && (data.pageContent.content != "")) {

			$("#content").html("").html(data.pageContent.content);

		}
		if ((data.pageContent.topContent != undefined) && (data.pageContent.topContent != "")) {

			$("#topContent").html("").html(data.pageContent.topContent);

		}
		if ((data.pageContent.posterImage != undefined) && (data.pageContent.posterImage != "")) {
			$('#videoTemplateContainer').attr('poster', data.pageContent.posterImage);

		}

		$('#videoTemplateContainer').attr('controls', true);
		$("#videoPlayIcon").unbind('click').bind("click", _this.videoPlayHandler);
		videoObj.unbind('play').bind("play", _this.videoPlayPauseHandler);

		videoObj.unbind('pause').bind("pause", _this.videoPauseHandler);

		videoObj.unbind('volumechange').bind("volumechange", _this.videoVolumeHandler);

		videoObj.unbind('mute').bind("mute", _this.videoMuteHandler);

		videoObj.unbind('seeking').bind("seeking", _this.videoSeekHandler);

		videoObj.unbind('ended').bind("ended", _this.videoEndHandler);


	}


	_this.videoVolumeHandler = function () {
		// console.log('VOLUME');
		/* setTimeout(function(){
			console.log($("#videoTemplateContainer")[0].volume,$("#videoTemplateContainer")[0].muted);
			$("#audioEle")[0].volume = $("#videoTemplateContainer")[0].volume;
		},100); */


		if (videoObj[0].muted) {
			videoObj[0].volume = 0;
		}

		if (!videoObj[0].muted && (videoObj[0].volume == 0)) {
			videoObj[0].volume = 1;
		}

		// audioObj[0].volume = videoObj[0].volume;

	}

	_this.videoMuteHandler = function () {
		//console.log('Mute');
		//$("#audioEle")[0].muted = videoObj[0].muted;
	}


	this.clear = function () {

	}

	this.videoSeekHandler = function () {
		videoCurrentTime = videoObj[0].currentTime;
		audioObj.setCurrentTime(videoCurrentTime);
	}

	currentRef.callAudioLoadEvent = function(){
		if(!audioLoaded){

			audioObj.loadAudio(_model.getCourseDataObj().baseURL + "assets/media/audio/" + _this.data.pageContent.Audio+"");
			audioObj.pauseAudio()
			audioLoaded = true;
		}
		
	}


	this.videoPauseHandler = function () {
			
		if(currentRef.menuRevealed == true){
			if(appCntl.VideoplaypauseFlag == true){
				//appCntl.VideoplaypauseFlag = true
			}else{
				appCntl.VideoplaypauseFlag = false;
			}
		}else{
			appCntl.VideoplaypauseFlag = false;
		}
			
		
			
		
		audioObj.pauseAudio();
		
		vidPlayPause = false;

	}

	this.videoPlayHandler = function () {

		videoObj.trigger('play');

		vidPlayPause = true;

	}

	this.videoPlayPauseHandler = function () {
		if(navigator.onLine){
			$("#network-status").hide();
			$("#playPauseBtn i").addClass("fa-play").removeClass("fa-pause");
		appCntl.VideoplaypauseFlag = true;
		if (vidPlayPause) {
			videoObj.get(0).pause();
		}

		if(!audioLoaded){
			audioObj.loadAudio(_model.getCourseDataObj().baseURL + "assets/media/audio/" + _this.data.pageContent.Audio+"");
			audioLoaded = true;
		}
		audioObj.playAudio()
		
	
		
		//console.log("appCntl.videoInterval: "+appCntl.videoInterval);
		if(!appCntl.videoInterval){
			appCntl.videoInterval = setInterval(videoBufferedFn, 100);
		}
		
		this.videoControllerBoolean = true;
		appCntl.playPauseFlag = false;
		
		$("#playPauseBtn img").attr('src', 'assets/images/play_button.png');
		$("#playPauseBtn").css({ 'pointer-events': 'none', 'opacity': 0.5 });
		$("#videoPlayIcon").hide();
		}else{
			$("#network-status").show();
			videoObj.get(0).pause();
		}
		
	}

	this.videoEndHandler = function () {
		// console.log('video ended');
		appCntl.VideoplaypauseFlag = false;
		audioLoaded = false;
		if(appCntl.videoInterval){
			clearInterval(appCntl.videoInterval);
			appCntl.videoInterval = 0;
		}
		
		// if (_model.getAppDataObj().scorm == "scorm") {
		// 	_model.getScormReference().storeCompletionStatus("completed");
		// }
		//$("#playPauseBtn, #audioMuteBtn").css({ 'pointer-events': 'auto', 'opacity': 1 });

		if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
			currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
			currentRef.checkChapterCompletionStatus();
		}
		$("#nextBtn").addClass("animateNextButton");
		$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
		$(" #menuItem_"+ window.currentIndexRef+" , #menuItem_"+window.nextIndexRef+"").css({'pointer-events': 'auto', 'opacity': 1}); 
		$(" #menuItem_"+ window.currentIndexRef+" ").addClass('completed');
		if(!$(".menu_active i").hasClass("pull-right")){
			$(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
		}

		_model.setTemplateStatus(true);
		_model.setAudioStatus(true);
		EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
	}
	
	
	function videoBufferedFn(){		

		if(videoCurrentTime < videoObj[0].currentTime){
			audioObj.playAudio();
			videoCurrentTime = videoObj[0].currentTime;
		}else{
			audioObj.pauseAudio();;
		}

		if((videoObj[0].currentTime - audioObj.getCurrentTime()) > 0.5){
			audioObj.setCurrentTime(videoObj[0].currentTime);
		}
		if((videoObj[0].currentTime - audioObj.getCurrentTime()) < -0.5){
			audioObj.setCurrentTime(videoObj[0].currentTime);
		}

	}

}