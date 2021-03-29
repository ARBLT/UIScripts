/**
 * Created by Ravi Sharma on 8/10/2016.
 */

var SliderTemplateController = function(){

    var _this = this;
    var imgArray = new Array();
	var tempArr = new Array();
	var baseUrl = _model.getCourseDataObj().baseURL;
	
	var currentData, imgId, sliderNum, ts, singleSelect, sliderCount, sliderController;
	var playPause = thumbnailImages = "";
	
    this.init = function(data){ 
        trace(":: Slider Template Loaded ::"); 
		$("#hints").hide();
		sliderTemplate = new AudioManager();
		sliderController = new ApplicationController();
		
		$.getScript(''+baseUrl+'js/'+data.pageContent.preloadingFileName+'.js', function()
		{ 
			var imgPreloader = new ImagePreloader();
				imgPreloader.preloadImages(imgArr, function(){ 
				//after preload function goes here... 
					$("#preloader").hide();
					playPause = true;
					if($("#audioMuteBtn img").attr("src") != "assets/images/audio_button_hover.png"){
						sliderTemplate.unMuteAudio();
						sliderTemplate.stopAudio();
						sliderTemplate.playAudio();
						$("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
					}
				});
		});
		if((data.pageContent.bottomContent != undefined) && (data.pageContent.bottomContent != "")){
			$("#bottomDescription").html('').html(data.pageContent.bottomContent);
		}
		if((data.pageContent.tooltip != undefined) && (data.pageContent.tooltip != "")){
			$("#hints").show();
			$("#toolTip").html('').html(data.pageContent.tooltip);
		} else {
			$("#hints").hide();
		}
		
		sliderCount = parseInt(data.pageContent.sliders.length);
	
		currentData = data; 
		
		//$("#playPauseBtn").addClass("sliderPlayPause");
		$("#goto").unbind('keyup').bind('keyup', _this.gotoSliderHandler);
		$(".sliderPlayPause").unbind('click').bind('click', _this.sliderPlayPauseHandler);
		
		_this.loadUI(data);
    }
	
	this.clear = function(){

	}
	
	_this.sliderPlayPauseHandler = function(){ console.log('got it')
		if (playPause) {
            playPause = false;
            sliderTemplate.pauseAudio();
            $("#playPauseBtn img").attr('src', 'assets/images/play_button.png');
        } else {
            playPause = true;
            sliderTemplate.playAudio();
            $("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
        }
	}
	
	_this.gotoSliderHandler = function(){ 
	
		imgId = $("#goto").val();
			
		if(event.keyCode == 13){ 
			if((imgId >= 1) && (imgId <= sliderCount ) ){
				$("#sliderContainer").hide();
				$("#popupSlider").show(); 
				if (imgId == "ges") { 
					imgId = $("#thumbnails img").length;	
				}
				if((currentData.pageContent.sliders[imgId-parseInt(1)].caption != undefined) && (currentData.pageContent.sliders[imgId-parseInt(1)].caption != "" )){
					$("#captionDown").hide();
					$("#captionRight").show();
				}else{
					$("#captionDown").show();
					$("#captionRight").hide();
				}
					$("#popupSlider img").hide().attr("src", imgArray[imgId]).fadeIn(800);
					$("#imageCount").html('').html(imgId);
					$("#sliderCaption, #sliderCaptionRight").html('').html(currentData.pageContent.sliders[imgId-parseInt(1)].imageCaption);
				_this.check();
			} else {
				alert("Please Enter Slide Number 1 to "+sliderCount+"");
			}
		}
		
	}

    this.loadUI = function(){
		
	$("#totalSlider").html('').html(currentData.pageContent.sliders.length);
	/* thumbnailImages += '<div class="row">'; */
	
		for(var c = 0; c < currentData.pageContent.sliders.length; c++){
			if(c < currentData.pageContent.displaySlides){
				sliderNum = c+ parseInt(1);
				if((currentData.pageContent.divideSlides != undefined) && (currentData.pageContent.divideSlides != "" )){
					thumbnailImages += '<div class="col-md-4 col-xs-6 thumb"><a class="thumbnail" href="#"><img id="slider_'+sliderNum+'" class="img-responsive" src="'+_model.getCourseDataObj().baseURL + ""+currentData.pageContent.imagepath+"/" + currentData.pageContent.sliders[c].sliderImage +'" /></a></div>  ';
					/* if((c + parseInt(1)) % 3 == 0){
						thumbnailImages += '</div><div class="row">';
					} */
				} else {
					thumbnailImages += '<div class="col-md-2 col-xs-6 thumb"><a class="thumbnail" href="#"><img id="slider_'+sliderNum+'" class="img-responsive" src="'+_model.getCourseDataObj().baseURL + ""+currentData.pageContent.imagepath+"/" + currentData.pageContent.sliders[c].sliderImage +'" /></a></div>  ';
					/* if((c + parseInt(1)) % 6 == 0){
						thumbnailImages += '</div><div class="row">';
					} */
				}
			}
		   
         }
		 
		 
		if((currentData.pageContent.displayMoreImage != undefined) && (currentData.pageContent.displayMoreImage != "" )){
			if((currentData.pageContent.divideSlides != undefined) && (currentData.pageContent.divideSlides != "" )){
				thumbnailImages += '<div class="col-md-4 col-xs-6 thumb"><a class="thumbnail" id="thumbImg" href="#"><img id="moreImages" class="img-responsive" src="assets/images/more_thumb.png" /></a></div>';
			} else {
				thumbnailImages += '<div class="col-md-2 col-xs-6 thumb"><a class="thumbnail" id="thumbImg" href="#"><img id="moreImages" class="img-responsive" src="assets/images/more_thumb.png" /></a></div>';
			}
		}
	
		$("#heading").html('').html(currentData.pageContent.heading);
		$("#headingDescription").html('').html(currentData.pageContent.desc);
		$("#thumbnails").html('').html(thumbnailImages);
		
		/* if ($('#thumbnails .row:last').html() == 0){ 
				$('#thumbnails .row:last').remove();
			} */
			
		for (var i = 1; i <= currentData.pageContent.sliders.length; i++) {
			imgArray[i] = ""+baseUrl+""+currentData.pageContent.imagepath+"/slide_big_" + i + ".png";
			tempArr.push(parseInt(i)-parseInt(1));
		}
		
		//EventManager.getInstance().addControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, _this.audioEndListener);
		
		$("#thumbnails img").unbind('click').bind('click', _this.popupHandler);
		
		
		$("#prev").unbind('click').bind('click', _this.previousHandler);
		$("#next").unbind('click').bind('click', _this.nextHandler); 

	$(".slideImage").bind('touchstart', function (e){
		ts = e.originalEvent.touches[0].clientX;
	});
	
	

	$(".slideImage").bind('touchend', function (e){
	   var te = e.originalEvent.changedTouches[0].clientX;
	   if(ts > te+30){
			_this.nextHandler();
	   }else if(ts < te-30){
		   _this.previousHandler();
	   }
	});

		$("#next").on('swiperight', _this.nextHandler);
		
		$("#closeBtn").unbind('click').bind('click', _this.closeHandler);
		$("#submit").unbind('click').bind('click', _this.submitHandler);
		
    }

	/* this.audioEndListener = function(){
		$("#thumbnails img").unbind('click').bind('click', _this.popupHandler);
	} */

	_this.popupHandler = function(){
		
		
		sliderTemplate.pauseAudio();
		
		playPause = false;
		
		$("#playPauseBtn img").attr("src", "assets/images/play_button.png");
		EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		
			imgId = ($(this).attr("id")).substring(7);
			$("#sliderContainer").hide();
			$("#popupSlider").show(); 
			if (imgId == "ges") { 
				imgId = $("#thumbnails img").length;	
			}
			if((currentData.pageContent.sliders[imgId-parseInt(1)].caption != undefined) && (currentData.pageContent.sliders[imgId-parseInt(1)].caption != "" )){
				$("#captionDown").hide();
				$("#captionRight").show();
			}else{
				$("#captionDown").show();
				$("#captionRight").hide();
			}
			
			console.log("imgId:   "+imgId);
			console.log("imgId:   "+imgArray[imgId]);
				$("#popupSlider img").hide().attr("src", imgArray[imgId]).fadeIn(800);
				$("#imageCount").html('').html(imgId);
				$("#sliderCaption, #sliderCaptionRight").html('').html(currentData.pageContent.sliders[imgId-parseInt(1)].imageCaption);
			_this.check();
			console.log(imgArray.length+"test");
			if(imgArray.length == 2){
			
		$("#next").hide(); 
			}
	}
	
	_this.previousHandler = function(){ 
		imgId--; 
		if(imgId > 0){
			if((currentData.pageContent.sliders[imgId-parseInt(1)].caption != undefined) && (currentData.pageContent.sliders[imgId-parseInt(1)].caption != "") ){
				$("#captionDown").hide();
				$("#captionRight").show();
			}else{
				$("#captionDown").show();
				$("#captionRight").hide();
			}
					
			if (imgId > 0) {
				$("#imageCount").html('').html(imgId);
				$("#popupSlider img").hide().attr("src", imgArray[imgId]).fadeIn(800);
				$("#sliderCaption, #sliderCaptionRight").html('').html(currentData.pageContent.sliders[imgId-parseInt(1)].imageCaption);
			}
			_this.check();
		}else{ 
			imgId = 1;
		}
	}
	
	_this.nextHandler = function(){
		imgId++; 
		if(imgId <= sliderCount){
			if((currentData.pageContent.sliders[imgId-parseInt(1)].caption != undefined) && (currentData.pageContent.sliders[imgId-parseInt(1)].caption != undefined != "") ){
					$("#captionDown").hide();
					$("#captionRight").show();
				}else{
					$("#captionDown").show();
					$("#captionRight").hide();
				}
			if (imgId <= imgArray.length - 1) {
				$("#imageCount").html('').html(imgId);
				$("#popupSlider img").hide().attr("src", imgArray[imgId]).fadeIn(800);
				$("#sliderCaption, #sliderCaptionRight").html('').html(currentData.pageContent.sliders[imgId-parseInt(1)].imageCaption);
			}
			_this.check();
		}else{
			imgId = sliderCount;
		}
	}
	
	_this.closeHandler = function(){
		$("#sliderContainer").show();
		$("#popupSlider").hide();
	}
	
	_this.submitHandler = function(){
		imgId = parseInt($("#goto").val());
		
		if((currentData.pageContent.sliders[imgId-parseInt(1)].caption != undefined) && (currentData.pageContent.sliders[imgId-parseInt(1)].caption != "" )){
			$("#captionDown").hide();
			$("#captionRight").show();
		}else{
			$("#captionDown").show();
			$("#captionRight").hide();
		}
			
		$("#popupSlider img").hide().attr("src", imgArray[imgId]).fadeIn(800);
		$("#imageCount").html(imgId);
		_this.check();
	}
	
	_this.check = function() {
		if (imgId == 1) {
			$("#prev").hide();
			$("#next").show();
		} else if (imgId == imgArray.length - 1) {
			$("#prev").show();
			$("#next").hide();
		} else {
			$("#next, #prev").show();
		}
		console.warn(parseInt(imgId) - parseInt(1))
		tempArr = jQuery.grep(tempArr, function(value) {
			return value != (parseInt(imgId) - parseInt(1));
		});
			
		if(tempArr.length == 0){ console.warn("audio ended")
			_model.setTemplateStatus(true);
			_model.setAudioStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}
		
		
	}
	
}