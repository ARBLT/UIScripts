/**
 * Created by Sivarajan on 22/03/2017.
 */

var DragandDropSequencingController = function(currentRef){

    var _this = this;
	var currentData, i, divCnt, content, Answer, idsInOrder;
	var attemptCount = 0;
	var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	var isIPAD = (/iPad|iPhone/i.test(navigator.userAgent)); // IPAD
	var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
	var windowTopPosition = 0;
	this.scrollingElement = (document.scrollingElement || document.body);

    this.init = function(data){
		baseURL = _model.getCourseDataObj().baseURL;
        trace(":: Drag and Drop Sequencing Loaded ::");
 
        _this.currentData = data;
        _this.loadUI(_this.currentData);
		
		//$("#parentContainer").attr('tabindex','1').focus();
		
		/* $("#parentContainer,#loadDiv").on('focusout',function(){
			$(this).removeAttr('tabindex');
		}); */
		audio = new AudioManager();
		window.answersubmitted = false;
		for(var i = 0; i < data.pageContent.dragSeqText.length; i++) {
			$('.serial_sequencing_container').append('<div class="serial_sequencing">'+ (i+1) +'</div>');
			
		}
		
		
    }
	
    this.loadUI = function(data){
        trace(":: Paint the Drag and Drop Sequencing Template UI ::");
        trace(data);
		
		

		Answer = data.pageContent.correctSeq;
		
		var axisDirection = '';
		
		$("#heading").html('').html(data.pageContent.heading);
		$("#content").html('').html(data.pageContent.content);
		if((data.pageContent.instruction != undefined) && (data.pageContent.instruction != "")){
			$(".con_part").css('display','table');
			$("#instruction").html('').html(data.pageContent.instruction);
		}

		
		$("#checkBtn, #showAnsBtn, #restBtn, #manual-sort").css({'pointer-events': 'none','opacity':'0.65'}).attr('disabled','disabled').addClass('disable').find('.dds_inst_hide').html('button unavailable');
		
		if(data.pageContent.variant == "image-vertical"){
			$(".horizontalSequencing").remove();
			$(".verticalSequencing").addClass('verticalonlyImage').show();
		}else if(data.pageContent.variant == "image-horizontal"){
			$(".verticalSequencing").remove();	
			$(".horizontalSequencing").addClass('onlyImage').show();
		}else if(data.pageContent.variant == "text-horizontal"){
			$(".verticalSequencing").remove();	
			$(".horizontalSequencing").show();
		}else if(data.pageContent.variant == "text-vertical"){
			$(".horizontalSequencing").remove();
			$(".verticalSequencing").show();
		}
		
		content = '';
		
		if(data.pageContent.variant == "image-vertical"){
			for(var i=0; i< data.pageContent.dragSeqText.length; i++){
				content += '<li><div id="newId_'+i+'" class="drag_part"><span class="dragbtn"><input tabindex="1" id="custom-number-'+i+'" name="custom-number-'+i+'" value="'+data.pageContent.dragSeqText[i].number+'" type="number" min="1"><label class="dds_inst_hide" style="display:block;" for="custom-number-'+i+'">'+data.pageContent.dragSeqText[i].altText+'<span class="dds_inst_hide">New Order</span></label><img class="dragImg" src="'+_model.getCourseDataObj().baseURL + 'assets/images/'+data.pageContent.dragSeqText[i].imageName+'" alt="'+data.pageContent.dragSeqText[i].altText+'" /></span><div class="dession_image feedback" ></div></div></li>'; 
			} 

			axisDirection =  'y';
		}else if(data.pageContent.variant == "image-horizontal"){
			for(var i=0; i< data.pageContent.dragSeqText.length; i++){
				content += '<li><div id="newId_'+i+'" class="drag_part"><span class="dragbtn"><label class="dds_inst_hide" style="display:block;" for="custom-number-'+i+'">'+data.pageContent.dragSeqText[i].altText+'<span class="dds_inst_hide">New Order</span></label><img class="img-responsive dragImg" src="'+_model.getCourseDataObj().baseURL + 'assets/images/'+data.pageContent.dragSeqText[i].imageName+'" alt="'+data.pageContent.dragSeqText[i].altText+'" /></span><div class="dession_image feedback" ></div><input class="mobileInput" tabindex="1" id="custom-number-'+i+'" name="custom-number-'+i+'" value="'+data.pageContent.dragSeqText[i].number+'" type="number" min="1"></div></li>'; 
			} 	

			axisDirection =  '';
		}else if(data.pageContent.variant == "text-horizontal"){
			for(var i=0; i< data.pageContent.dragSeqText.length; i++){
				content += '<li><div id="newId_'+i+'" class="drag_part"><span class="dragbtn"><label class="label_div" style="" for="custom-number-'+i+'">'+data.pageContent.dragSeqText[i].textCnt+'<span class="dds_inst_hide">New Order</span></label></span><div class="dession_image feedback" ></div><input class="mobileInput" tabindex="1" id="custom-number-'+i+'" name="custom-number-'+i+'" value="'+data.pageContent.dragSeqText[i].number+'" type="number" min="1"></div></li>'; 
			} 	

			axisDirection =  '';
		}else if(data.pageContent.variant == "text-vertical"){
			for(var i=0; i< data.pageContent.dragSeqText.length; i++){
				content += '<li><div id="newId_'+i+'" class="drag_part"><span class="dragbtn"><input id="custom-number-'+i+'" name="custom-number-'+i+'" value="'+data.pageContent.dragSeqText[i].number+'" type="number" min="1"><label  class="label_div" style="display:block;" for="custom-number-'+i+'">'+data.pageContent.dragSeqText[i].textCnt+'<span class="dds_inst_hide">New Order</span></label></span><div class="dession_image feedback" ></div></div></li>'; 
			} 	

			axisDirection =  'y';
		}

		if((data.pageContent.language != undefined) && (data.pageContent.instruction != "")){
			switch (data.pageContent.language) {
				case 'English': 
				  $('.checkBtn').html('Submit');
				  $('.sequencing_reset').html('Reset');
				  break;
				case 'Hindi': 
				  $('.checkBtn').html('सब्मिट');
				  $('.sequencing_reset').html('रीसेट');
				  
				  break;
				case 'Tamil': 
				  $('.checkBtn').html('சமர்ப்பிக்கவும்');
				  $('.sequencing_reset').html('மீட்டமை');
				  
				  break;
				case 'Malayalam': 
				  $('.checkBtn').html('സമർപ്പിക്കുക');
				  $('.sequencing_reset').html('പുന .സജ്ജമാക്കുക');
				  
				  break;
				case 'Kannada': 
				  $('.checkBtn').html('ಸಲ್ಲಿಸು');
				  $('.sequencing_reset').html('ಮರುಹೊಂದಿಸಿ');
				  
				  break;
				case 'Telugu': 
				  $('.checkBtn').html('సమర్పించారు');
				  $('.sequencing_reset').html('రీసెట్');
				 
				  break;
				case 'Bengali': 
				  $('.checkBtn').html('জমা দিন');
				  $('.sequencing_reset').html('রিসেট');
				  
				  break;
				case 'Marathi': 
				  $('.checkBtn').html('प्रस्तुत करणे');
				  $('.sequencing_reset').html('रीसेट करा');
				  
				  break;
				default:
				  $('.checkBtn').html('Submit');
				  $('.sequencing_reset').html('Reset');
				 
			}
			
		}else{
		
			$('.checkBtn').html('Submit');
			$('.sequencing_reset').html('Reset');
			
		}
		

		$("#loadDiv").html(content).sortable({
			items : ".drag_part",
			containment: "#loadDiv", 
			//axis : axisDirection,
			start:function( event , ui ){
				var a = ui.item.startPos;
				ui.helper.addClass('drag_active');
				$("#checkBtn, #restBtn").css({'pointer-events': 'auto', 'opacity': 1}).removeAttr('disabled').removeClass('disable').find('.dds_inst_hide').html('');
				$("#loadDiv li:eq("+a+")").css("border","none");
			},
			 update: function( event, ui ) {
				var a = ui.item.startPos;
				 $("#loadDiv li:eq("+a+")").css("border","none");
			 }
		});
		$("#loadDiv").append("<div style='height:14px;float:left;width: 100%'></div>")
		
		
		if((window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth) > 850){
				setTimeout(function(){
					var maxHeight = 0;
					var maxOuterHeight = 0;
					_this.makeNumerHeightEqual = function() {
						$(".label_div").each(function(i){
			
							if($(this).height() > maxHeight){
								maxHeight = $(this).height();
								maxOuterHeight = $(this).outerHeight();
							}
						});		
						$(".label_div").height(maxHeight);
						$(".serial_sequencing").height(maxOuterHeight);
						$(".serial_sequencing").css("line-height",maxOuterHeight+"px");
					}	
					_this.makeNumerHeightEqual()
		
				}, 200);
		}
		
		$(".label_div").bind("touchstart",touchstart)

		function touchstart(e){

				e = e || window.event;
				e.preventDefault();
				touch = e.originalEvent.touches[0]
				_this.posX = e.clientX || touch.pageX;
				_this.posY = e.clientY || touch.pageY;
				// console.log(_this.posX)
				document.ontouchmove = calculateTouchPosition;
				
				document.ontouchend = closeDragElement;
			
		};

		function calculateTouchPosition (e) {
			
				touch = e.touches[0]
				_this.posX = e.clientX || touch.pageX;
				_this.posY = e.clientY || touch.pageY;
				windowTopPosition = $(window).scrollTop();
				
				if(windowTopPosition - _this.posY > -50) {
				
					$("html, body").scrollTop(windowTopPosition - 7) + "px";
				}
			
		}

		function closeDragElement (e) {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
            //console.log( console.log(e))
            
        }

		// window.onresize = function() {
		// 	_this.makeNumerHeightEqual()
		// }

		/* $("#loadDiv").html(content);
		
		$(".drag_part").sortable({
			//containment: "#loadDiv", 
			start:function( event , ui ){
				event.stopPropagation();
				var a = ui.item.startPos;
				ui.helper.addClass('drag_active');
				$("#checkBtn, #restBtn").css({'pointer-events': 'auto', 'opacity': 1}).removeAttr('disabled').removeClass('disable').find('.dds_inst_hide').html('');
				$("#loadDiv li:eq("+a+")").css("border","none");
			},
			 update: function( event, ui ) {
				event.stopPropagation();
				var a = ui.item.startPos;
				 $("#loadDiv li:eq("+a+")").css("border","none");
			 }
		}); */
		
		getInitialOrder('#loadDiv li');
		
		//bind stuff to number inputs
		/* $('#loadDiv input[type="number"]').focus(function(e){
			e.stopPropagation();
			$(this).select();	
		}).change(function(e){
			e.stopPropagation();
			updateAllNumbers($(this), '#loadDiv input');
		}).keyup(function(e){
			e.stopPropagation();
			updateAllNumbers($(this), '#loadDiv input');
		}); */
		
		if(isIPAD || isAndroid){
			// $('input').bind('click.sortable mousedown.sortable',function(ev){
			// 	ev.target.focus();
			// 	updateAllNumbers($(this), '#loadDiv input');
			// });
			
			// $('input').bind('change.sortable mousedown.sortable',function(ev){
			// 	ev.target.focus();
			// 	updateAllNumbers($(this), '#loadDiv input');
			// });
			
			// $('input').bind('keyup.sortable mousedown.sortable',function(ev){
			// 	ev.target.focus();
			// 	updateAllNumbers($(this), '#loadDiv input');
			// });
			
		}else{
			// $('#loadDiv input[type="number"]').focus(function(e){
			// 	e.stopPropagation();
			// 	$(this).select();	
			// }).change(function(e){
			// 	updateAllNumbers($(this), '#loadDiv input');
			// }).keyup(function(e){
			// 	updateAllNumbers($(this), '#loadDiv input');
			// }); 		
		}
		
		$("#checkBtn").unbind("click").bind("click", _this.checkButtonHandler);
		$("#showAnsBtn").unbind("click").bind("click", _this.answerHandler);
		$("#restBtn").unbind("click").bind("click", _this.resetHandler);
		$("#feedbackModel").on("hidden.bs.modal", _this.PopupHide);
		
		
		$('#manual-sort').bind('click',function(e){
			// console.log('Manual Sort');
			$("#dynInstText").html('Now the items are rearranged');
			reorderItems('#loadDiv li', '#loadDiv');
			e.preventDefault();
		});
		
		$("#checkBtn, #showAnsBtn, #restBtn, #manual-sort").on('focusin',function(){
			$(this).find('.dds_inst_hide').html('');
		});

	}
	
	function updateAllNumbers(currObj, targets){
        
		$("#checkBtn, #restBtn, #manual-sort").css({'pointer-events': 'auto', 'opacity': 1}).removeAttr('disabled').removeClass('disable').find('.dds_inst_hide').html('');
		$("#dynInstText").html('Now press the update button to rearrange the items');
		$("#restBtn").css('opacity','1');
		
		var delta = currObj.val() - currObj.attr('data-initial-value'), //if positive, the object went down in order. If negative, it went up.
                c = parseInt(currObj.val(), 10), //value just entered by user
                cI = parseInt(currObj.attr('data-initial-value'), 10), //original object val before change
                top = $(targets).length;
        
        //if the user enters a number too high or low, cap it
        if(c > top){
            currObj.val(top);
        }else if(c < 1){
            currObj.val(1);
        }
        
		$(targets).not($(currObj)).each(function(){ //change all the other objects
			var v = parseInt($(this).val(), 10); //value of object changed		
				
			if (v >= c && v < cI && delta < 0){ //object going up in order pushes same-numbered and in-between objects down
				$(this).val(v + 1);
			} else if (v <= c && v > cI && delta > 0){ //object going down in order pushes same-numbered and in-between objects up
				$(this).val(v - 1);
			}
		}).promise().done(function(){
			//after all the fields update based on new val, set their data element so further changes can be tracked 
			//(but ignore if no value given yet)
			$(targets).each(function(){
				if($(this).val() !== ""){
					$(this).attr('data-initial-value', $(this).val());
				}
			});
		});
		
		
	}
	
	this.showCorrectAns = function() {
		$("#popupContent").html("");
		for(var i = 0; i <  _this.currentData.pageContent.dragSeqText.length; i++) {
			//$('.serial_sequencing_container').append('<div class="serial_sequencing">'+ (i+1) +'</div>');
			var correctCurrentSequece = Number( _this.currentData.pageContent.correctSeq[i]);
			var correctCurrentAnswer =  _this.currentData.pageContent.dragSeqText[correctCurrentSequece].textCnt;
			$("#popupContent").append('<div class="modal-answers">'+correctCurrentAnswer+'</div>');
			
		}
	}
	_this.PopupHide = function(){ 
		audio.stopAudio();
		audio.loadAudio(baseURL+"assets/media/audio/blank"); 
		if(window.answersubmitted ==false){
			$(_this.scrollingElement).animate({
				scrollTop: document.body.scrollHeight
			 }, 500);
		}
	}

	this.showWrongAns = function() {
		$("#popupContent").html("");
		$("#popupContent").addClass("wrongAnswer");
		$("#popupContent").append('<i class="far fa-times-circle wrong" style="display: inline"></i>');
		//$("#popupContent").append('<p id="feedbackText">Please try again.</p>');
		if((_this.currentData.pageContent.language != undefined) && (_this.currentData.pageContent.instruction != "")){
			switch (_this.currentData.pageContent.language) {
				case 'English': 
				   $("#popupContent").append('<p id="feedbackText">Please try again.</p>');
				   break;
				case 'Hindi': 
				  $("#popupContent").append('<p id="feedbackText">कृपया दोबारा प्रयास करें।</p>');
				  break;
				case 'Tamil': 
				  $("#popupContent").append('<p id="feedbackText">"தயவுசெய்து மீண்டும் முயற்சி செய்க.</p>');
				  break;
				case 'Malayalam': 
				 $("#popupContent").append('<p id="feedbackText">ദയവായി വീണ്ടും ശ്രമിക്കുക.</p>');
				  break;
				case 'Kannada': 
				  $("#popupContent").append('<p id="feedbackText">ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.</p>');
				  break;
				case 'Telugu': 
				  $("#popupContent").append('<p id="feedbackText">దయచేసి మళ్ళీ ప్రయత్నించండి.</p>');
				  break;
				case 'Bengali': 
				  $("#popupContent").append('<p id="feedbackText">Please try again.</p>');
				  break;
				case 'Marathi': 
				  $("#popupContent").append('<p id="feedbackText">कृपया पुन्हा प्रयत्न करा.</p>');
				  break;
				default:
				 $("#popupContent").append('<p id="feedbackText">Please try again.</p>');
			}
	    }else{
			 $("#popupContent").append('<p id="feedbackText">Please try again.</p>');
		}
	}

	this.checkButtonHandler = function(){
		
		
		i=0;
		idsInOrder = [];
		
		var correctCount = 0;
		var inCorrectCount = 0;
		var totalCorrectCount = Answer.length;
		
		var feedbackStr = '';
		attemptCount++;

		$(".drag_part").css({'pointer-events': 'none'}).attr('disabled','disabled');
		
		$("#loadDiv .drag_part").each(function() { 
			idsInOrder.push(this.id.substr(this.id.indexOf("_") + 1))
			
			// console.log( this.id.substr(this.id.indexOf("_") + 1) );
			
			if((this.id.substr(this.id.indexOf("_") + 1)) == Answer[i]){
				// $("#"+this.id).find(".dession_image").html("").html('<img src="assets/images/green_tick.png" class="right" alt="Right"/>');
				correctCount++;
				
			} else {
				// $("#"+this.id).find(".dession_image").html("").html('<img src="assets/images/cross_tick.png" alt="Wrong"/>');
				inCorrectCount++;
				
			}
			i++;
		});
		
		if( (totalCorrectCount == correctCount) && (inCorrectCount == 0) ){
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":1});
			$("#popupContent").removeClass("wrongAnswer");
			$("#showAnsBtn").css({'pointer-events': 'auto', 'opacity': 1}).removeAttr('disabled').removeClass('disable').find('.dds_inst_hide').html('');	
			$("#restBtn").css({'pointer-events': 'none'}).attr('disabled','disabled').addClass('disable').find('.dds_inst_hide').html('button unavailable');
			$("#restBtn").css('opacity','0.65');
			//$("#popupHeading").html("Well Done!");
				if((_this.currentData.pageContent.language != undefined) && (_this.currentData.pageContent.instruction != "")){
					switch (_this.currentData.pageContent.language) {
						case 'English': 
						   $("#popupHeading").html("Well Done!");
						   break;
						case 'Hindi': 
						  $("#popupHeading").html("शाबाश!");
						  break;
						case 'Tamil': 
						  $("#popupHeading").html("நன்றாக முடிந்தது!");
						  break;
						case 'Malayalam': 
						 $("#popupHeading").html("നന്നായി!");
						  break;
						case 'Kannada': 
						  $("#popupHeading").html("ಚೆನ್ನಾಗಿ ಮುಗಿದಿದೆ!");
						  break;
						case 'Telugu': 
						  $("#popupHeading").html("బాగా చేసారు!");
						  break;
						case 'Bengali': 
						  $("#popupHeading").html("Well Done!");
						  break;
						case 'Marathi': 
						  $("#popupHeading").html("बरं झालं!");
						  break;
						default:
						   $("#popupHeading").html("Well Done!");
					}
				}else{
					$("#popupHeading").html("Well Done!");
				}
				
			_this.showCorrectAns();
			currentRef.playPauseFlag = true;
			audio.loadAudio(baseURL+"assets/media/audio/"+_this.currentData.pageContent.feedback[0].correct+"");
			$('#feedbackModel').modal('show');
			window.answersubmitted = true;
			$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
			var nextPage = currentRef.currentIndex + parseInt(1);
			$(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").css({'pointer-events': 'auto', 'opacity': 1}); 
                $(" #menuItem_"+currentRef.currentIndex+" ").addClass('completed'); 
                
                //added to control tick mark in menus
			    if(!$(".menu_active i").hasClass("pull-right")){
				    $(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
                }
			if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
				currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
				currentRef.checkChapterCompletionStatus();
			}
			feedbackStr = 'It\'s correct';
		}else if( (correctCount >= 0) && (inCorrectCount > 0) ){
			if(attemptCount == 2){
				setTimeout(function(){
					//$("#popupHeading").html("That’s incorrect!");
					if((_this.currentData.pageContent.language != undefined) && (_this.currentData.pageContent.instruction != "")){
							switch (_this.currentData.pageContent.language) {
								case 'English': 
								   $("#popupHeading").html("That’s incorrect!");
								   break;
								case 'Hindi': 
								  $("#popupHeading").html("यह गलत है!");
								  break;
								case 'Tamil': 
								  $("#popupHeading").html("அது தவறானது!");
								  break;
								case 'Malayalam': 
								 $("#popupHeading").html("അത് തെറ്റാണ്!");
								  break;
								case 'Kannada': 
								  $("#popupHeading").html("ಅದು ತಪ್ಪಾಗಿದೆ!");
								  break;
								case 'Telugu': 
								  $("#popupHeading").html("అది తప్పు!");
								  break;
								case 'Bengali': 
								  $("#popupHeading").html("Well Done!");
								  break;
								case 'Marathi': 
								  $("#popupHeading").html("ते चुकीचे आहे!");
								  break;
								default:
								  $("#popupHeading").html("That’s incorrect!");
							}
						}else{
							 $("#popupHeading").html("That’s incorrect!");
						}
					
					_this.showCorrectAns();
					currentRef.playPauseFlag = true;
					audio.loadAudio(baseURL+"assets/media/audio/"+_this.currentData.pageContent.feedback[0].incorrect2+"");
					$('#feedbackModel').modal('show');
					window.answersubmitted = true;
					$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
					var nextPage = currentRef.currentIndex + parseInt(1);
					$(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").css({'pointer-events': 'auto', 'opacity': 1}); 
                $(" #menuItem_"+currentRef.currentIndex+" ").addClass('completed'); 
                
                //added to control tick mark in menus
			    if(!$(".menu_active i").hasClass("pull-right")){
				    $(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
                }
					if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
						currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
						currentRef.checkChapterCompletionStatus();
					}
					//$(".serial_sequencing_container").css("margin-top","27px");
					//_this.answerHandler();
				},500);
			}else{
				//$("#popupHeading").html("That’s incorrect!");
				if((_this.currentData.pageContent.language != undefined) && (_this.currentData.pageContent.instruction != "")){
					switch (_this.currentData.pageContent.language) {
						case 'English': 
						   $("#popupHeading").html("That’s incorrect!");
						   break;
						case 'Hindi': 
						  $("#popupHeading").html("यह गलत है!");
						  break;
						case 'Tamil': 
						  $("#popupHeading").html("அது தவறானது!");
						  break;
						case 'Malayalam': 
						 $("#popupHeading").html("അത് തെറ്റാണ്!");
						  break;
						case 'Kannada': 
						  $("#popupHeading").html("ಅದು ತಪ್ಪಾಗಿದೆ!");
						  break;
						case 'Telugu': 
						  $("#popupHeading").html("అది తప్పు!");
						  break;
						case 'Bengali': 
						  $("#popupHeading").html("Well Done!");
						  break;
						case 'Marathi': 
						  $("#popupHeading").html("ते चुकीचे आहे!");
						  break;
						default:
						  $("#popupHeading").html("That’s incorrect!");
					}
				}else{
					 $("#popupHeading").html("That’s incorrect!");
				}
				
				_this.showWrongAns();
				EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":0});
				currentRef.playPauseFlag = true;
				audio.loadAudio(baseURL+"assets/media/audio/"+_this.currentData.pageContent.feedback[0].incorrect1+"");
				$('#feedbackModel').modal('show');
			}
			
			
			feedbackStr = 'It\'s not correct.';	
		}else if( (totalCorrectCount > correctCount) && (inCorrectCount == 0) ){
			if(attemptCount == 2){
				setTimeout(function(){
					//$("#popupHeading").html("That’s incorrect!");
					if((_this.currentData.pageContent.language != undefined) && (_this.currentData.pageContent.instruction != "")){
						switch (_this.currentData.pageContent.language) {
							case 'English': 
							   $("#popupHeading").html("That’s incorrect!");
							   break;
							case 'Hindi': 
							  $("#popupHeading").html("यह गलत है!");
							  break;
							case 'Tamil': 
							  $("#popupHeading").html("அது தவறானது!");
							  break;
							case 'Malayalam': 
							 $("#popupHeading").html("അത് തെറ്റാണ്!");
							  break;
							case 'Kannada': 
							  $("#popupHeading").html("ಅದು ತಪ್ಪಾಗಿದೆ!");
							  break;
							case 'Telugu': 
							  $("#popupHeading").html("అది తప్పు!");
							  break;
							case 'Bengali': 
							  $("#popupHeading").html("Well Done!");
							  break;
							case 'Marathi': 
							  $("#popupHeading").html("ते चुकीचे आहे!");
							  break;
							default:
							  $("#popupHeading").html("That’s incorrect!");
						}
					}else{
						 $("#popupHeading").html("That’s incorrect!");
					}
					
					_this.showCorrectAns();
					currentRef.playPauseFlag = true;
					audio.loadAudio(baseURL+"assets/media/audio/"+_this.currentData.pageContent.feedback[0].incorrect2+"");
					window.answersubmitted = true;
					$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
					var nextPage = currentRef.currentIndex + parseInt(1);
					$(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").css({'pointer-events': 'auto', 'opacity': 1}); 
                $(" #menuItem_"+currentRef.currentIndex+" ").addClass('completed'); 
                
                //added to control tick mark in menus
			    if(!$(".menu_active i").hasClass("pull-right")){
				    $(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
                }
					if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
						currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
						currentRef.checkChapterCompletionStatus();
					}
					$('#feedbackModel').modal('show');
					//$(".serial_sequencing_container").css("margin-top","27px");
					//_this.answerHandler();
				},500);
			}else{
				//$("#popupHeading").html("That’s incorrect!");
				if((_this.currentData.pageContent.language != undefined) && (_this.currentData.pageContent.instruction != "")){
					switch (_this.currentData.pageContent.language) {
						case 'English': 
						   $("#popupHeading").html("That’s incorrect!");
						   break;
						case 'Hindi': 
						  $("#popupHeading").html("यह गलत है!");
						  break;
						case 'Tamil': 
						  $("#popupHeading").html("அது தவறானது!");
						  break;
						case 'Malayalam': 
						 $("#popupHeading").html("അത് തെറ്റാണ്!");
						  break;
						case 'Kannada': 
						  $("#popupHeading").html("ಅದು ತಪ್ಪಾಗಿದೆ!");
						  break;
						case 'Telugu': 
						  $("#popupHeading").html("అది తప్పు!");
						  break;
						case 'Bengali': 
						  $("#popupHeading").html("Well Done!");
						  break;
						case 'Marathi': 
						  $("#popupHeading").html("ते चुकीचे आहे!");
						  break;
						default:
						  $("#popupHeading").html("That’s incorrect!");
					}
				}else{
					 $("#popupHeading").html("That’s incorrect!");
				}
				
				_this.showWrongAns();
				EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":0});
				currentRef.playPauseFlag = true;
				audio.loadAudio(baseURL+"assets/media/audio/"+_this.currentData.pageContent.feedback[0].incorrect1+"");
				$('#feedbackModel').modal('show');
			}
			
			
			feedbackStr = 'It\'s partially correct.';	
		}
		
		$(this).css({'pointer-events': 'none'}).attr('disabled','disabled');
		
		/* if($(".right").length <= (parseInt(_this.currentData.pageContent.correctSeq.length) - parseInt(1))){
			$("#showAnsBtn").css({'pointer-events': 'auto', 'opacity': 1}).removeAttr('disabled').removeClass('disable').find('.dds_inst_hide').html('');
		} else {
			$("#showAnsBtn").css({'pointer-events': 'none'}).attr('disabled','disabled').addClass('disable').find('.dds_inst_hide').html('button unavailable');
		} */
		
		
		
		if(attemptCount == 2){
			$("#showAnsBtn").css({'pointer-events': 'auto', 'opacity': 1}).removeAttr('disabled').removeClass('disable').find('.dds_inst_hide').html('');	
			$("#restBtn").css({'pointer-events': 'none','opacity':'0.65'}).attr('disabled','disabled').addClass('disable').find('.dds_inst_hide').html('button unavailable');																																						
		}else{
			$("#showAnsBtn").css({'pointer-events': 'none'}).attr('disabled','disabled').addClass('disable').find('.dds_inst_hide').html('button unavailable');
		}
		
		//alert(feedbackStr);
		
		$(".dragbtn input").removeAttr('tabindex').attr('disabled','disabled');
		$("#manual-sort").css({'pointer-events': 'none'}).attr('disabled','disabled').addClass('disable').find('.dds_inst_hide').html('button unavailable');
		$("#checkBtn").css({'pointer-events': 'none'}).attr('disabled','disabled').addClass('disable').find('.dds_inst_hide').html('button unavailable');
		$("#checkBtn").css('opacity','0.65');
		//$("#loadDiv").attr('tabindex','1').focus();
		
		
		$("#stateUpdate").html('');
		
		if(isIPAD || isAndroid){
			$("#stateUpdate").html(feedbackStr);
		}else{
			$("#stateUpdate").html(feedbackStr).focus();	
		}
	}
	

	
	this.answerHandler = function(){
		var feedbackStr = 'Correct Sequence is';
		$(this).css({'pointer-events': 'none'}).attr('disabled','disabled');;
		divCnt='';
		for(i=0; i< Answer.length; i++){
			 //divCnt += '<li class="drag_part" id="newId_'+i+'"><span class="dragbtn"><p>'+_this.currentData.pageContent.dragSeqText[Answer[i]].textCnt+'</p></span></li>'; 
			 
			 if(_this.currentData.pageContent.variant == "image-vertical"){
				divCnt += '<li class="drag_part" style="pointer-events:none" id="newId_'+i+'"><span class="dragbtn"><img class="dragImg" src="'+_model.getCourseDataObj().baseURL + 'assets/images/'+_this.currentData.pageContent.dragSeqText[Answer[i]].imageName+'" alt="image" /></span></li>'; 
				feedbackStr = feedbackStr + _this.currentData.pageContent.dragSeqText[Answer[i]].altText;	
			 }else if(_this.currentData.pageContent.variant == "image-horizontal"){
				divCnt += '<li class="drag_part" style="pointer-events:none" id="newId_'+i+'"><span class="dragbtn"><img class="img-responsive dragImg" src="'+_model.getCourseDataObj().baseURL + 'assets/images/'+_this.currentData.pageContent.dragSeqText[Answer[i]].imageName+'" alt="image" /></span></li>'; 
				feedbackStr = feedbackStr + _this.currentData.pageContent.dragSeqText[Answer[i]].altText;	
			 }else{
				divCnt += '<li class="drag_part" style="pointer-events:none" id="newId_'+i+'"><span class="dragbtn"><p>'+_this.currentData.pageContent.dragSeqText[Answer[i]].textCnt+'</p></span></li>'; 	
				feedbackStr = feedbackStr + _this.currentData.pageContent.dragSeqText[Answer[i]].textCnt;	
			 }
			 
			 
		} 
		
		// console.log(divCnt);
		
		$("#loadDiv").html("").html(divCnt);
		$("#restBtn, #manual-sort,#checkBtn, #showAnsBtn").css({'pointer-events': 'none'}).attr('disabled','disabled').addClass('disable').find('.dds_inst_hide').html('button unavailable');
		//$("#loadDiv").attr('tabindex','1').focus();
		$("#restBtn").css('opacity','0.65');
		
		if(isIPAD || isAndroid){
			$("#stateUpdate1").html(feedbackStr);
		}else{
			$("#stateUpdate").attr('tabindex','0').html(feedbackStr).focus();	
		}
	}

	this.zoomPopupHandler = function(){
		
		$("#imagePopup").show();
		_model.setTemplateStatus(true);
		// EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		$("#img").attr("data-toggle","modal").attr("data-target","#imagePopup");
		$("#imageZoom").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + jsonData.pageContent.questionZoomImage);
	}
	
	this.resetHandler = function(){
		/* $("#loadDiv").html("").html(content);
		$("#checkBtn, #showAnsBtn, #restBtn, #manual-sort").css({'pointer-events': 'none'}).attr('disabled','disabled').addClass('disable').find('.dds_inst_hide').html('button unavailable');
		$('#loadDiv input[type="number"]').change(function(){
			updateAllNumbers($(this), '#loadDiv input');
			$("#checkBtn, #restBtn").css({'pointer-events': 'auto', 'opacity': 1}).removeAttr('disabled').removeClass('disable').find('.dds_inst_hide').html('');
		}); */
		
		_this.loadUI(_this.currentData);
	}
	
	this.clear = function(){
		
	}
	
	function getInitialOrder(obj){
		var num = 1;
		$(obj).each(function(){
            //set object initial order data based on order in DOM
			$(this).find('input[type="number"]').val(_this.currentData.pageContent.dragSeqText[num-1].number).attr('data-initial-value', _this.currentData.pageContent.dragSeqText[num-1].number); 
			// console.log( _this.currentData.pageContent.dragSeqText[num-1].number );
			num++;
		});
      $(obj).find('input[type="number"]').attr('max', $(obj).length); //give it an html5 max attr based on num of objects
	}
	
	function reorderItems(things, parent){
	  for(var i = 1; i <= $(things).length; i++){
		// console.log('condition');
		$(things).each(function(){
		  var x = parseInt($(this).find('input').val(), 10);
		  if(x === i){
			$(this).appendTo(parent);
		  }
		});
	  }
	}

	
		
}