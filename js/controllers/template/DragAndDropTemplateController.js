/**
 * Created by Ravi Sharma on 8/10/2016.
 */

var DragAndDropTemplateController = function(currentRef){

    var _this = this;
	var currentData;
	var audioLoop = 0;
	var count = 0;
	var appControlAudio = currentRef;
	var vidoEnable;
	/* var audioElement;
	var _intervalID; */
	
	var dropSequenceArr = [];
	var curStepCount = 0;
	var curAttemptCount = 0;
	var totalStepCount;
	var dropAudio;
	var imagePath;
	var setArray = [];
	var dummyvideo = false;
	var isIPAD1 = (/iPad|iPhone/i.test(navigator.userAgent)); // IPAD
	var mobileDevices = /webOS|iPhone|android|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	var isIE = /*@cc_on!@*/ false || testBrowser_Fn('msTransform'); // At least IE6
	var androidTabMob = (/android|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
    var userAgent = navigator.userAgent.toLowerCase();         
                  
			  
	function testBrowser_Fn(prop)
	{
		return prop in document.documentElement.style;
	}

    this.init = function(data){
        trace(":: Image Only Template Loaded ::");
        trace(data);
		
		if(isIPAD1){
			dummyvideo=true;
			if(dummyvideo){							
			$("#videoContent").attr('src','assets/media/video/m15_1.mp4');																				
			}
		}
		//$("#playPauseBtn, #audioMuteBtn, #courseMenuBtn, #resourceBtn, #referenceBtn, #glossaryBtn, #helpBtn").css({"pointer-events":"none", "opacity":"0.5"});
		$("#showFeedback").hide().removeClass('congratulation_bg');
		baseURL = _model.getCourseDataObj().baseURL;
		dropAudio = new AudioManager();
		//_this.audioInit();
        _this.currentData = data;
		$("#overlayFeedback").hide();
		$("#popUpGotIt").hide();
		$("#dragCont").hide();
		$("#innerInstPopUp").hide();
		$("#showInstTxt").html(data.pageContent.instructionTextOnLoad);
		//$("#drag_btn").hide();
		
		$("#startDrag").click(function(){
			$("#playPauseBtn img").attr("src","assets/images/play_button.png");
			if(isIPAD1){
				if(dummyvideo){				
					dummyvideo = false;	
					$("#videoContent").show();
					$('#videoContent')[0].play();
					$('#videoContent')[0].pause();
					$("#videoContent").hide();
					$("#videoContent").css("width","100%");
				} 
			}
			appControlAudio.audioManager.stopAudio();
			$("#showInstPopup").hide();
			$("#popUpGotIt").show();
			console.log(_this.currentData.pageContent.launchImage);
			$("#launchImage").attr('src',_model.getCourseDataObj().baseURL+"assets/images/"+_this.currentData.pageContent.launchImage);
					//$("#img").attr('src',_model.getCourseDataObj().baseURL+imagePath+'/'+data.pageContent.onloadDropImage)
		});
        
		$("#heading").html(data.pageContent.heading);
		$("#instructionIcon").click(function(){
			$("#innerInstPopUp").show();
			$("#showInnerInstTxt").html(data.pageContent.instructionTextOnLoad);
		});
		
		$("#closeBtnInnerInst").click(function(){
			$("#innerInstPopUp").hide();
		});
		
		$("#closeFeedback").click(function(){
			$("#showFeedback, #overlayFeedback").hide();
		});
		
		$("#gotItLaunchCourse, #popUpGotIt").click(function(){
			$("#popUpGotIt").hide();
			$("#dragCont").show();
			_this.loadUI(_this.currentData);
		});
    }
	
	
	
	/* // Audio Player Start
	
	this.audioInit = function(){
		audioElement =  document.createElement('audio');
		_intervalID = setInterval(_this.onTimeUpdate,1);	
	}
	
	this.play = function(audioPath){
		_this.stop();
		$(audioElement).attr('src',audioPath);
		$(audioElement).off('ended',_this.onAudioEnd).on('ended',_this.onAudioEnd);
		$(audioElement)[0].load();
		$(audioElement)[0].play();
	}
		
	this.onTimeUpdate = function(){
		var currentTime = $(audioElement)[0].currentTime;
	}
		
	this.onAudioEnd = function(){
		$(audioElement).off('ended',_this.onAudioEnd);
		onAudioEnd();	
	}
		
	// Audio Player End */

    this.loadUI = function(data){
        trace(":: Paint the Image Template UI ::");
        trace(data);
		if((data.pageContent.dropSequence.length) > 4){
			
			$(".left , .right").show();
			
		}else{
			
		$(".left , .right").hide();	
		}
		if((data.pageContent.imagePath != undefined) && (data.pageContent.imagePath != "")){
			imagePath = data.pageContent.imagePath;			
		} else {
			imagePath = 'assets/images/drag_drop';
		}
		
		$("#img").attr('src',_model.getCourseDataObj().baseURL+imagePath+'/'+data.pageContent.onloadDropImage)
		var  cnt = '<div class="item active"><div class="row">';
		
		for(var i=0; i<data.pageContent.content.length; i++){
			
			cnt += '<div class="col-sm-3 col-xs-6 text_center"><a  href="#" class=""><img id="drag_'+i+'" src="'+_model.getCourseDataObj().baseURL+imagePath+'/'+data.pageContent.content[i].dragImage+'" alt="Image" class="thumbnail img-responsive"></a> <span>'+data.pageContent.content[i].dragCaption+'</span></div>'; 
			
			
					
			if(mobileDevices){
					if ((userAgent.search("android") > -1) && (userAgent.search("mobile") > -1))
					{
						if(((i + parseInt(1)) % 2 == 0)&&(i<(data.pageContent.content.length-parseInt(1)))){ //console.log(i);
							cnt += '</div></div><div class="item"><div class="row">';
						}
					} 
					else if ((userAgent.search("android") > -1) && !(userAgent.search("mobile") > -1))
					{
						if(((i + parseInt(1)) % 4 == 0)&&(i<(data.pageContent.content.length-parseInt(1)))){ //console.log(i);
							cnt += '</div></div><div class="item"><div class="row">';
						}
					}else{
						if(((i + parseInt(1)) % 2 == 0)&&(i<(data.pageContent.content.length-parseInt(1)))){ //console.log(i);
							cnt += '</div></div><div class="item"><div class="row">';
						}
					} 
						
			}else{
						if(((i + parseInt(1)) % 4 == 0)&&(i<(data.pageContent.content.length-parseInt(1)))){ //console.log(i);
							cnt += '</div></div><div class="item"><div class="row">';
						}
			}
				
			  
			 
			
		} 
		cnt+='</div> </div>';
		
		$("#getImage").html(cnt);
		//console.log(data.pageContent.heading)
		//console.log(data.pageContent.dropSequence)
		
		dropSequenceArr  = data.pageContent.dropSequence;
		totalStepCount = dropSequenceArr.length-1;
		
		_this.initDragDrop();
       // _model.setTemplateStatus(true);
    }
	
	this.initDragDrop = function(){
		console.log('DRAG DROP INIT');
		
		$(".drop").attr('data-correct-id',dropSequenceArr[curStepCount].index)
		$(".carousel_overlay").hide();
		
	//	console.log("curStepCount "+curStepCount )
		$(".thumbnail").draggable({
				containment: ".drag_container",
				helper: "clone",
				containment: "#dragCont",
				start: function(e, ui) {
					$(".carousel-inner").css('overflow','visible');
					$("#getImage").find('a').removeClass("blink_it");
					$(".ui-draggable-dragging").css('z-index','999')
					$(".ui-draggable-dragging").css('display','block')
					//$(".ui-draggable-dragging").css('position','relative')  
				},
				drag: function(e, ui) {
					
				},
				stop:function(e,ui){
					$(".carousel-inner").css('overflow','hidden');				
				}
		});
				
		$(".drop").droppable({
				drop:function(e,ui){
					var curCorrectID = $(this).attr('data-correct-id');
					var curDragID = $(ui.draggable).attr('id').split('_')[1];
					$(".feed_Back").show();
					console.log("Steps"+parseInt(curStepCount+1)+"/"+parseInt(totalStepCount+1));
					$("#stepsCount").html("Steps: "+parseInt(curStepCount+1)+"/"+parseInt(totalStepCount+1));
					if(curDragID == curCorrectID){
						console.log('CORRECT: '+curDragID+" "+curCorrectID);
						$(".iconic").show();
						$(".feedback").removeClass('initial_bg');
						$("#feedBackHeading").html("Feedback");
						$(".imageShow").hide();
						$("#textDescription").html("Correct, perform the next step.");
						$("#showFeedback, #cong ,#overlayFeedback").show();
						//console.log(_this.currentData.pageContent.dropSequence[curStepCount].isVideo)
						if(_this.currentData.pageContent.dropSequence[curStepCount].isVideo == "true"){
							vidoEnable = true;
							_this.playVideo();
						}else if(_this.currentData.pageContent.dropSequence[curStepCount].isVideo == "false"){
							vidoEnable = false;
							$("#img").hide();
							$("#img").attr('src','');
							$("#img").attr('src',baseURL+imagePath+'/'+dropSequenceArr[curStepCount].dropImg); 
							$("#videoContent").hide();
							$("#img").show();
							_this.dragEndUpdate();
						}
					}else{
						curAttemptCount++;
						$("#incorrect").show();
						if(curAttemptCount == 1){
							console.log("INCORRECT ATTEMPT 1")
							$(".iconic").show();
							$(".feedback").removeClass('initial_bg');
							$("#feedBackHeading").html("Feedback");
							$(".imageShow").hide();
							$("#showFeedback, #incorrect , #overlayFeedback").show();
							dropAudio.loadAudio(baseURL+"assets/media/audio/"+dropSequenceArr[curStepCount].incorrectAudio1+"");
							$("#textDescription").html( dropSequenceArr[curStepCount].incorrectFeedback1 );
						}else if(curAttemptCount == 2){
							console.log("INCORRECT ATTEMPT 2");
							$(".iconic").show();
							$(".feedback").removeClass('initial_bg');
							$("#feedBackHeading").html("Feedback");
							$(".imageShow").hide();
							$("#showFeedback, #incorrect, #overlayFeedback").show();
							//console.log(baseURL+"assets/media/audio/"+dropSequenceArr[curStepCount].incorrectAudio2+"")
							dropAudio.loadAudio(baseURL+"assets/media/audio/"+dropSequenceArr[curStepCount].incorrectAudio2+"");
							if(dropSequenceArr[curStepCount].incorrectFeedback2  != ""){
								$("#textDescription").html( dropSequenceArr[curStepCount].incorrectFeedback2 );
							} else {
								$(".iconic").hide();
								$("#feedBackHeading").html("Further Steps");
								$("#textDescription").html(dropSequenceArr[curStepCount].videoTranscript);
								$(".feedback").addClass('initial_bg');
							}
							
							if(_this.currentData.pageContent.dropSequence[curStepCount].isVideo == "true"){
								$("#getImage > div").removeClass('active');
								var findAtag = parseInt(_this.currentData.pageContent.dropSequence[curStepCount].index);
								$('#drag_'+findAtag).addClass("blink_it");
								$('#drag_'+findAtag).parents().eq(3).addClass('active');
								vidoEnable = true;
								_this.playVideo();
							}else if(_this.currentData.pageContent.dropSequence[curStepCount].isVideo == "false"){
								$("#img").hide();
								$("#img").attr('src','');
								$("#img").attr('src',baseURL+imagePath+'/'+dropSequenceArr[curStepCount].dropImg);
								$("#getImage > div").removeClass('active');
								var findAtag = parseInt(_this.currentData.pageContent.dropSequence[curStepCount].index);
								$('#drag_'+findAtag).addClass("blink_it");
								$('#drag_'+findAtag).parents().eq(3).addClass('active');
								$("#videoContent").hide();
								$("#img").show();
								vidoEnable = false;
								EventManager.getInstance().addControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, _this.onAudioEnd);
								$(".carousel_overlay").show();
							}						
						}
						console.log('curAttemptCount: '+curAttemptCount);
						console.log('INCORRECT: '+curDragID+" "+curCorrectID);
					}
				}
		});
	}
	
	this.playVideo = function(){
		console.log('SHOW VIDEO');	
		$("#img").hide();
		$("#videoContent").css("width","100%");
		$(".carousel_overlay").show();
		//$("#videoContent").show().attr('poster',baseURL+"assets/images/drag_drop/"+dropSequenceArr[curStepCount].videoPoster);
		$("#videoContent").show().attr('src',baseURL+"assets/media/video/"+dropSequenceArr[curStepCount].video);
		$("#videoContent")[0].load();
		$("#videoContent")[0].pause();
		if(curAttemptCount == 2){ console.log("INCORRECT AUDIO")
			curAttemptCount = 0;
			if(isIE){
				//$("#videoContent").currentTime = 1;
				$("#videoContent")[0].play();
			}else{
				//$("#videoContent")[0].currentTime = 1;
				$("#videoContent")[0].play();
			}
			setTimeout(function(){
				$("#videoContent")[0].pause();	
			}, 800);
			
			EventManager.getInstance().addControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, _this.onAudioEnd);
		}else{
			_this.onAudioEnd();
		}
	}
	
	this.onAudioEnd = function(){
		console.log("AUDIO END")
		
		console.log(parseInt(totalStepCount+1))
		EventManager.getInstance().removeControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, _this.onAudioEnd);
		if(vidoEnable == true){
			$("#videoContent")[0].play();
			$("#videoContent").on('ended',_this.onVideoEnd);
			if(mobileDevices){
				
				if ((userAgent.search("android") > -1) && (userAgent.search("mobile") > -1))
				{
					$(".feed_Back").hide();
					$("#overlayFeedback").hide();
				} 
				else if ((userAgent.search("android") > -1) && !(userAgent.search("mobile") > -1))
				{
					//$(".feed_Back").show();
					$("#textDescription").html(dropSequenceArr[curStepCount].videoTranscript);
				}
					
				//$(".feed_Back").hide();
				//$("#overlayFeedback").hide();
				//$("#textDescription").html("");
			}else{
				if(dropSequenceArr[curStepCount].videoTranscript != ""){
					$("#textDescription").html(dropSequenceArr[curStepCount].videoTranscript);
				} else {
					$(".feed_Back").hide();
				}
			}
			
			$("#feedBackHeading").html("Further Steps");
			$(".feedback").addClass('initial_bg');
			$(".iconic").hide();
		}else{
			_this.dragEndUpdate();
		}
		//$(".feedback, #overlayFeedback").show();
		//$("#incorrect").hide();
		$("#getImage").find('a > img').removeClass("blink_it");
	}
	
	this.onVideoEnd = function(){
		console.log('VIDEO END');
		$("#videoContent").off('ended',_this.onVideoEnd);
		_this.dragEndUpdate();
	}
	
	this.dragEndUpdate = function(){ 
		
	
		//$(".feedback").show();
		if(curStepCount < totalStepCount){
			curStepCount++;
			//$(".feedback").hide();
			$(".carousel_overlay").hide();
			$(".drop").attr('data-correct-id',dropSequenceArr[curStepCount].index);
			curAttemptCount = 0;
		}else{
			$("#incorrect").hide();
			$(".carousel_overlay").show();
			console.log('ACTIVITY COMPLETED');
			$("#feedBackHeading").html("CONGRATULATIONS");
			$(".feedback").show().removeClass('initial_bg');
			$(".feedback").show().addClass('congratulation_bg');
			$("#textDescription").html(_this.currentData.pageContent.endFeedBack);
			appControlAudio.audioManager.loadAudio(_model.getCourseDataObj().baseURL+"assets/media/audio/"+_this.currentData.pageContent.endAudio);
			$("#cong").show();
			
			
			EventManager.getInstance().addControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, _this.audoEndLoop);
			
			
		}
	}
		
	this.audoEndLoop = function(){
		if((parseInt(curStepCount+1)) == parseInt(totalStepCount+1)){
			_model.setTemplateStatus(true);		
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}
	}
	
	this.clear = function(){
		$("#videoContent")[0].pause();
		$("#videoContent").off('ended',_this.onVideoEnd);
		EventManager.getInstance().removeControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, _this.onAudioEnd);
	}
	
}