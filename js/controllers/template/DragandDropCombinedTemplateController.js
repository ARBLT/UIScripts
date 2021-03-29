/**
 * Created by SivaRajan on 23/03/2017.
 */

var DragandDropCombinedTemplateController = function(currentRef){

    var _this = this;
	var currentData;
	var totalLength;
	var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	var isIPAD = (/iPad|iPhone/i.test(navigator.userAgent)); // IPAD
	var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
	var attemptCount = 0;
	var answersArray= [];
	this.dragStarted = false;
	this.currentDragIndex;
	this.dragondrop = false;
	this.droppedEventFired = false;
	zindex = 1;
	this.posX = 0;
	this.posY = 0;
	this.scrollingElement = (document.scrollingElement || document.body);
	var windowTopPosition = 0;
	var windowBottomPosition = 0;
	var dropText;
	
    this.init = function(data){
		baseURL = _model.getCourseDataObj().baseURL;
        trace(":: Drag and Drop Template Loaded ::");
		
        _this.currentData = data;
		_this.loadUI(_this.currentData);
		audio = new AudioManager();
		
		if(!isIPAD && !isAndroid){
			$('nav a').attr('tabindex','1');
			//$("#nextBtn a").blur();
			//$("#parentContainer").attr('tabindex','0').focus();
			//$("#parentContainer").attr('tabindex','0');			
		}
		//
		//$('nav ul li a').attr('tabindex','1');
		//
		//$("#parentContainer").css('outline','solid thick green');
		//$("#parentContainer").attr('aria-live','assertive');
		/* var i = 0;
		document.onkeydown = TabExample;
			function TabExample(evt) {
				if(evt.keyCode == 9) {
					if(i == 0){
						$("#parentContainer").attr('tabindex','1').focus();
						i++;
					}
				}
			} */
			window.answersubmitted = false;
			

			

			for(var i = 0; i < data.pageContent.dragTexts.length; i++){
				answersArray.push(Number(data.pageContent.dragTexts[i].dropTargetIndex));
			}

			
    }
	
	this.clear = function(){
		// console.log('CLEAR CALLED');
	}
	
    this.loadUI = function(data){
        trace(":: Paint the Drag and Drop Template UI ::");
        trace(data);
		
		//$(".notes_Popup").hide();
		$(".feeback_mark").hide();
		
		$(".feeback_mark img").remove();
		
		$("#heading").html('').html(data.pageContent.heading);
		$("#content").html('').html(data.pageContent.content);
		$(".drop_heading_first").html('').html(data.pageContent.dropHead);
		$(".drop_heading_second").html('').html(data.pageContent.dragHead);

		if((data.pageContent.instruction != undefined) && (data.pageContent.instruction != "")){
			$(".con_part").css('display','table');
			$("#instruction").html('').html(data.pageContent.instruction);
		}
		
		if((data.pageContent.tooltip != undefined) && (data.pageContent.tooltip != "")){
			$("#content").append("<mark><em>"+data.pageContent.tooltip+"</em><mark>");
		} 
		
		if(data.pageContent.type == 'TEXT_TO_TEXT'){
			$("#ImageToTextDragDrop,#ImageToImageDragDrop,#singleImageDragDrop").remove();		
			$("#TextToTextDragDrop").show();
		}
		
		if(data.pageContent.type == 'IMAGE_TO_TEXT'){
			$("#TextToTextDragDrop,#ImageToImageDragDrop,#singleImageDragDrop").remove();		
			$("#ImageToTextDragDrop").show();
		}
		
		if(data.pageContent.type == 'IMAGE_TO_IMAGE'){
			$("#TextToTextDragDrop,#ImageToTextDragDrop,#singleImageDragDrop").remove();		
			$("#ImageToImageDragDrop").show();
		}
		
		if(data.pageContent.type == 'SINGLE_IMAGE'){
			$("#TextToTextDragDrop,#ImageToTextDragDrop,#ImageToImageDragDrop").remove();		
			$("#singleImageDragDrop").show();
		}
		

		
		totalLength = data.pageContent.dropTexts.length;
		
		if(data.pageContent.type == 'TEXT_TO_TEXT'){
		
			for(i=0;i<data.pageContent.dropTexts.length;i++){
				$("#questionDispDrop").find('.drag_Drop_Question:eq('+i+')').html('').html(data.pageContent.dropTexts[i].text);
			}
			
			var tmpStr = '';
			
			for(var i = 0 ; i < data.pageContent.dragTexts.length ; i++){
				tmpStr += '<div role="listitem" tabindex="'+(i+1)+'" data-target="'+data.pageContent.dragTexts[i].dropTargetIndex+'" class="drag_options drag"><p><span class="dd_inst_hide">draggable item</span>'+data.pageContent.dragTexts[i].text+'<span class="dd_inst_hide"> Drag Option</span></p></div>'		
			}
			
			$(".drag_list").html(tmpStr);
			
			var tmpStr = '';
			
			for(i=0;i<data.pageContent.dropTexts.length;i++){
				tmpStr += '<div class="drop_question_block">\
									<p id="q'+(i+1)+'" class="drag_Drop_Question">'+data.pageContent.dropTexts[i].text+'<span class="dd_inst_hide drop_inst">Drop Target</span></p>\
									<div id="drop_'+i+'"  aria-labelledby="q'+(i+1)+'" data-index="'+(i+1)+'" class="drop_area drop_parent drop-original-state"><p class="text-center"><em></em></p></div>\
									<div class="feeback_mark"></div>\
							</div>'		
			}
			
			$("#questionDispDrop").html(tmpStr);
			
		}
		
		
		if(data.pageContent.type == 'IMAGE_TO_TEXT'){
			var tmpStr = '';
		
			for(var i = 0 ; i < data.pageContent.dragTexts.length ; i++){
				tmpStr += '<div role="listitem" tabindex="'+(i+1)+'" data-target="'+data.pageContent.dragTexts[i].dropTargetIndex+'" class="drag_options drag"><span class="dd_inst_hide">draggable item</span><img class="img-responsive center-block" src="'+_model.getCourseDataObj().baseURL + 'assets/images/' + data.pageContent.dragTexts[i].image+'" alt="'+data.pageContent.dragTexts[i].altText+'" /></div>'	
			}
			
			$(".right_part").html('<h2>Drag options</h2>'+tmpStr);
			
			var tmpStr = '';
			
			for(i=0;i<data.pageContent.dropTexts.length;i++){
				   tmpStr += '<div>\
								<p id="q'+(i+1)+'">'+data.pageContent.dropTexts[i].text+'<span class="dd_inst_hide drop_inst">Drop Target</span></p>\
								<div id="drop_'+i+'"  aria-labelledby="q'+(i+1)+'" data-index="'+(i+1)+'" class="drop_area drop_parent"><em>Drop answer here</em></div>\
								<div class="feedbackPart"></div>\
							 </div>'
			}
			
			$(".left_part").html(tmpStr);
		}
		
		if(data.pageContent.type == 'IMAGE_TO_IMAGE'){
			var tmpStr = '';
		
			for(var i = 0 ; i < data.pageContent.dragTexts.length ; i++){
				//tmpStr += '<div role="listitem" tabindex="'+(i+1)+'" data-target="'+data.pageContent.dragTexts[i].dropTargetIndex+'" class="drag_options drag"><p>'+data.pageContent.dragTexts[i].text+'<span class="dd_inst_hide"> Drag Option</span></p></div>'	

				tmpStr += '<div role="listitem" tabindex="'+(i+1)+'" data-target="'+data.pageContent.dragTexts[i].dropTargetIndex+'" class="drag_options drag"><span class="dd_inst_hide">draggable item</span><img class="img-responsive center-block" src="'+_model.getCourseDataObj().baseURL + 'assets/images/' + data.pageContent.dragTexts[i].image+'" alt="'+data.pageContent.dragTexts[i].altText+'" /></div>'	
			}
			
			$(".right_part").html('<h2>Drag options</h2>'+tmpStr);
			
			var tmpStr = '';
			
			for(i=0;i<data.pageContent.dropTexts.length;i++){
				   tmpStr += '<div>\
								<img id="q'+(i+1)+'" class="img-responsive center-block" src="'+_model.getCourseDataObj().baseURL + 'assets/images/' + data.pageContent.dragTexts[i].image+'" alt="'+data.pageContent.dragTexts[i].altText+'" />\
								<span class="dd_inst_hide drop_inst">Drop Target</span>\
								<div id="drop_'+i+'"  aria-labelledby="q'+(i+1)+'" data-index="'+(i+1)+'" class="drop_area drop_parent"><em>Drop answer here</em></div>\
								<div class="feedbackPart"></div>\
							 </div>'
			}
			
			$(".left_part").html(tmpStr);	
		
		}
		
		if(data.pageContent.type == 'SINGLE_IMAGE'){
			totalLength = 1;

			var tmpStr = '';
			
			for(var i = 0 ; i < data.pageContent.dragTexts.length ; i++){
				tmpStr += '<div role="listitem" tabindex="'+(i+1)+'" data-target="'+data.pageContent.dragTexts[i].dropTargetIndex+'" class="drag_options drag"><span class="dd_inst_hide">draggable item</span><img class="img-responsive center-block" src="'+_model.getCourseDataObj().baseURL + 'assets/images/' + data.pageContent.dragTexts[i].image+'" alt="'+data.pageContent.dragTexts[i].altText+'" /></div>'	
			}
			
			$(".right_part").html('<h2>Drag options</h2>'+tmpStr);
			
			var tmpStr = '';

			tmpStr = '<div id="drop_0" data-index="1" class="drop_area drop_parent">\
								<p>'+data.pageContent.dropTexts[0].text+'</p> \
								<!-- <img class="img-responsive center-block" src="../../assets/images/img2-large.png" alt="image" /> -->\
					  </div>\
					  <div class="feedbackPart"></div>'
			
			$(".left_part").html(tmpStr);

		}
		
		$(".drag").draggable({
			revert : true,
			zIndex : zindex,
			containment : "#TextToTextDragDrop",
			start: function() {
				zindex++;
				$(".ui-draggable,.drag_options").css("z-index","9");
				$(this).css("z-index","10");
			}
		});
		
		if((data.pageContent.language != undefined) && (data.pageContent.instruction != "")){
			switch (data.pageContent.language) {
				case 'English': 
				  $('.checkBtn').html('Submit');
				  $('.resetBtn').html('Reset');
				  $('.drop_area').find('em').html('Drop answer here');
				  dropText = 'Drop answer here';
				  break;
				case 'Hindi': 
				  $('.checkBtn').html('सब्मिट');
				  $('.resetBtn').html('रीसेट');
				  $('.drop_area').find('em').html('यहाँ उत्तर गिरा दो');
				  dropText = 'यहाँ उत्तर गिरा दो';
				  break;
				case 'Tamil': 
				  $('.checkBtn').html('சமர்ப்பிக்கவும்');
				  $('.resetBtn').html('மீட்டமை');
				  $('.drop_area').find('em').html('உங்கள் பதிலை இங்கே விடுங்கள்');
				  break;
				case 'Malayalam': 
				  $('.checkBtn').html('സമർപ്പിക്കുക');
				  $('.resetBtn').html('പുന .സജ്ജമാക്കുക');
				  $('.drop_area').find('em').html('നിങ്ങളുടെ ഉത്തരം ഇവിടെ ഇടുക');
				  break;
				case 'Kannada': 
				  $('.checkBtn').html('ಸಲ್ಲಿಸು');
				  $('.resetBtn').html('ಮರುಹೊಂದಿಸಿ');
				  $('.drop_area').find('em').html('ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಇಲ್ಲಿ ಬಿಡಿ');
				  break;
				case 'Telugu': 
				  $('.checkBtn').html('సమర్పించారు');
				  $('.resetBtn').html('రీసెట్');
				  $('.drop_area').find('em').html('మీ జవాబును ఇక్కడ వదలండి');
				  break;
				case 'Bengali': 
				  $('.checkBtn').html('জমা দিন');
				  $('.resetBtn').html('রিসেট');
				  $('.drop_area').find('em').html('আপনার উত্তর এখানে ফেলে দিন');
				  break;
				case 'Marathi': 
				  $('.checkBtn').html('प्रस्तुत करणे');
				  $('.resetBtn').html('रीसेट करा');
				  $('.drop_area').find('em').html('आपले उत्तर येथे ड्रॉप करा');
				  break;
				default:
				  $('.checkBtn').html('Submit');
				  $('.resetBtn').html('Reset');
				  $('.drop_area').find('em').html('Drop answer here');
			}
			
		}else{
		
			$('.checkBtn').html('Submit');
			$('.resetBtn').html('Reset');
			$('.drop_area').find('em').html('Drop answer here');
			dropText = 'Drop answer here';
		}
		
		this.addDragEventToNewElement = function(){
			$(".drag-new").draggable({
				
				zIndex : zindex,
				containment : "#TextToTextDragDrop",
				drag: function(){
					if(!_this.dragStarted){
						$(this).parent().addClass("drop-original-state");
						$(this).parent().droppable('enable');
						
						//$(this).parent().html("<p class='text-center'><em>Drop answer here</em></p>");
					}
					_this.dragStarted = true;
				},
				start: function(){
					zindex++;
					_this.droppedEventFired = false;
					$(".ui-draggable").css("z-index","9");
					$(this).css("z-index","10");
				},
				stop: function(){
					
					_this.dragStarted = false;
										
					//$(this).parent().removeClass("ui-droppable-disabled");

					//if(_this.droppedEventFired){
						
							
							if($(this).parent().html() != undefined){
								if(!_this.dragondrop){
									$("[data-target="+$(this).data("target")+"]").css("visibility","visible");
									$("[data-target="+$(this).data("target")+"]").css("width","100%");
								}
								
							}
						$(this).parent().html("<p class='text-center'><em>"+dropText+"</em></p>");
						
					//}			
					var totalLengthForDisable = 0;
					$(".drop_area").each(function(){
						if($(this).hasClass("drop-original-state")){
							
							totalLengthForDisable++;
						}
					});

					if(totalLengthForDisable == $(".drop_area").length){
						$(".resetBtn").attr('disabled','disabled').addClass('disable');
						$(".resetBtn").css('opacity','0.65');
						
					}
					if(totalLengthForDisable > 0){
						$(".checkBtn").attr('disabled','disabled').addClass('disable');
						$(".checkBtn").css('opacity','0.65');
						
					}
					
				},
				
				
			});
		}
				
		$(".drop_parent").droppable({
			
			hoverClass: "highlight",
				drop : function(e,ui){
					_this.droppedEventFired = true;
					// console.log('CLONE');
					var clonedEle = $(ui.draggable).clone();
					$(this).html(clonedEle);
					clonedEle.attr('id','').removeAttr('tabindex').removeClass('drag focus_active').css({position:"relative",left:"0px",top:"0px",width:"100%"}).addClass('drag_clone dropDiv drag-new');
					
					_this.addDragEventToNewElement()
					$(this).removeClass("drop-original-state")
					if(data.pageContent.type != 'SINGLE_IMAGE'){
						$(this).droppable('disable');
					}
					
					//$(this).css('border','none');
					$(".drag_options").bind("touchstart",touchstart);
					$(".drag_options").bind("mousedown",mouseStart);
					if(data.pageContent.type == 'IMAGE_TO_IMAGE'){	
						clonedEle.attr('id','').removeAttr('tabindex').removeClass('drag focus_active').css({position:"relative",left:"0px",top:"0px",width:"100%"}).addClass('drag_clone dropDiv');
						$('.drag_clone img').css('padding','0');
					}
					
					if(data.pageContent.type == 'SINGLE_IMAGE'){					
						var dragIndex = $(ui.draggable).index();
						//$(".drag").draggable('disable').removeAttr('tabindex');
						$('.drag_clone img').css('padding','0');
						$('.drag_clone img').attr('src',_model.getCourseDataObj().baseURL + 'assets/images/' + _this.currentData.pageContent.dragTexts[dragIndex-1].largeImage);
						$(".drag_options").css('visibility','visible').attr('aria-hidden','false');
						$(ui.draggable).css('visibility','hidden').attr('aria-hidden','true');
					}else{
						$(ui.draggable).css('visibility','hidden').attr('aria-hidden','true');
					}
					
					clonedEle.css('margin','0');
					
					
					var dragCloneLength = $(".drag_clone").length;
					
					$(".resetBtn").removeAttr('disabled').css('opacity',1).removeClass('disable').find('.dd_inst_hide').html('');
					
					if(_this.currentData.pageContent.type == 'SINGLE_IMAGE'){
						if(dragCloneLength == 1){
							$('.checkBtn').removeAttr('disabled').css('opacity',1).removeClass('disable');	
							$(_this.scrollingElement).animate({
								scrollTop: document.body.scrollHeight
							 }, 500);	
						}
					}else{
						if(dragCloneLength == totalLength){
							$('.checkBtn').removeAttr('disabled').css('opacity',1).removeClass('disable');
							$(_this.scrollingElement).animate({
								scrollTop: document.body.scrollHeight
							 }, 500);		
						}
					}
					
					
				},
				over: function(){
					// console.log("over")
					_this.dragondrop = true;
				},
				out: function(){
					// console.log("out")
					_this.dragondrop = false;
				}
		});

		$(".drag_options").bind("touchstart",touchstart);
		$(".drag_options").bind("mousedown",mouseStart);
		var currentPositionY = 0;
		function touchstart(e){

			e = e || window.event;
			e.preventDefault();
			if(e.originalEvent.touches != undefined){
				touch = e.originalEvent.touches[0]
			}			
			_this.posX =  touch.pageX ||  e.clientX;
			_this.posY = touch.pageY || e.clientY;
			currentPositionY = touch.pageY || e.clientY;
				
			document.ontouchmove = calculateTouchPosition;
			document.ontouchend = closeDragElement;
			
		};
		function mouseStart(e){
			
			if(e.originalEvent.composed){
				
				e = e || window.event;
				e.preventDefault();
				
				_this.posX = e.clientX;
				_this.posY = e.clientY;
				currentPositionY = e.clientY;
		
				document.onmousemove = calculateMousePosition;
				document.onmouseup = closeDragElement;
			}
		
		};

		
		function calculateTouchPosition (e) {

			if(e.touches != undefined){
				touch = e.touches[0]
			}
				
				_this.posX = touch.pageX ||  e.clientX;
				_this.posY = touch.pageY || e.clientY;
				windowTopPosition = $(window).scrollTop();
				windowBottomPosition = $(window).height();
					
				if(windowTopPosition - _this.posY > -70) {
					if(_this.posY < currentPositionY){
						$("html, body").scrollTop(windowTopPosition - 5) + "px";
					}
					
				}

				if(windowBottomPosition - (_this.posY - windowTopPosition) < 100) {
					if(_this.posY > currentPositionY){
					
						$("html, body").scrollTop(windowTopPosition + 5) + "px";
					}
					
				}

				currentPositionY = _this.posY;
			
		}
		function calculateMousePosition (e) {

				
				_this.posX = e.clientX;
				_this.posY = e.clientY;
				windowTopPosition = $(window).scrollTop();
				windowBottomPosition = $(window).height();
				
				if( _this.posY < 70) {
					if(_this.posY < currentPositionY){
						$("html, body").scrollTop(windowTopPosition - 5) + "px";
					}
					 
				}
				
				if((windowBottomPosition - _this.posY)  < 100) {
					if(_this.posY > currentPositionY){
						$("html, body").scrollTop(windowTopPosition + 5) + "px";
					}
					
				}

				currentPositionY = _this.posY;
			
		}

		function closeDragElement (e) {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
            //console.log( console.log(e))
            
        }
		
		$(".resetBtn").on('click',function(){
			$(".drag_clone").remove();
			if((_this.currentData.pageContent.language != undefined) && (_this.currentData.pageContent.instruction != "")){
				switch (_this.currentData.pageContent.language) {
					case 'English': 
					   $(".drop_parent").html('<p class="text-center"><em>Drop answer here</em></p>');
					   break;
					case 'Hindi': 
					  $(".drop_parent").html('<p class="text-center"><em>यहाँ उत्तर गिरा दो</em></p>');
					  break;
					case 'Tamil': 
					  $(".drop_parent").html('<p class="text-center"><em>உங்கள் பதிலை இங்கே விடுங்கள்</em></p>');
					  break;
					case 'Malayalam': 
					  $(".drop_parent").html('<p class="text-center"><em>നിങ്ങളുടെ ഉത്തരം ഇവിടെ ഇടുക</em></p>');
					  break;
					case 'Kannada': 
					  $(".drop_parent").html('<p class="text-center"><em>ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಇಲ್ಲಿ ಬಿಡಿ</em></p>');
					  break;
					case 'Telugu': 
					  $(".drop_parent").html('<p class="text-center"><em>మీ జవాబును ఇక్కడ వదలండి</em></p>');
					  break;
					case 'Bengali': 
					  $(".drop_parent").html('<p class="text-center"><em>আপনার উত্তর এখানে ফেলে দিন</em></p>');
					  break;
					case 'Marathi': 
					  $(".drop_parent").html('<p class="text-center"><em>आपले उत्तर येथे ड्रॉप करा</em></p>');
					  break;
					default:
					   $(".drop_parent").html('<p class="text-center"><em>Drop answer here</em></p>');
				}
			}else{
				$(".drop_parent").html('<p class="text-center"><em>Drop answer here</em></p>');
			}
			$('.drop_parent').removeAttr('style');
			$('.drag').css('visibility','visible').removeClass('focus_active').attr('aria-hidden','false');;
			$(this).attr('disabled','disabled');
			$(this).css('opacity','0.65');
			$('.checkBtn').css('opacity','0.65');
			//$(this).css('opacity','0.5');
			$(this).addClass('disable').find('.dd_inst_hide').html('button unavailable');
			$('.checkBtn').attr('disabled','disabled').addClass('disable');	
			$(".showAnsBtn").attr('disabled','disabled').addClass('disable');	
			$(".feeback_mark,.feedbackPart").html('');
			$(".drag").removeAttr('style');
			$(".drag").css('position','relative');
			$(".drop_parent").droppable('enable');
			$(".drag").draggable('enable');
			$(".drag_drop_area").attr('role','application');
			$(".drop_area").each(function(ind){
				$(this).attr('aria-labelledby','q'+(ind+1) );
				$(this).addClass("drop-original-state");
			});
			
			//$(".drop_area").css('border','3px dotted #147B98');
			
			$(".drag").each(function(ind){
				$(this).find('p').html(data.pageContent.dragTexts[ind].text+'<span class="dd_inst_hide">Drag Option</span>');
			});
		
			$(".drop_inst").html('Drop Target');
			
			$('.drop_parent').attr('aria-dropeffect','none');
			$(".instruction_text").html('Drag Option');
		});
		
		$(".showAnsBtn").on('click',function(){
			$(this).attr('disabled','disabled').addClass('disable');;
			//$(this).css('opacity','0.5');
			//$(".resetBtn").attr('disabled','disabled').css('opacity','0.5');
			$(".feeback_mark img").remove();
			$(".feeback_mark,.feedbackPart").html('');
			$(".resetBtn").attr('disabled','disabled').addClass('disable');
			$(".drag_clone").remove();
			$(".drop_area").css('padding','0');
			$(".drag").css('visibility','hidden').attr('aria-hidden','true');
			
			var feedbackStr = '';
			
			for(var i=0;i<data.pageContent.dropTexts.length;i++){
				
				if(data.pageContent.type == 'TEXT_TO_TEXT'){
					$(".drop_parent:eq("+(data.pageContent.dragTexts[i].dropTargetIndex-1)+")").html('<div class="drag_options dragdiv_1" style="width:102%;left:-3px;top:-3px;position:relative;margin:0;" class="drag_options"><p>'+data.pageContent.dragTexts[i].text+'</p></div>');
					
					
				}
				
				if(data.pageContent.type == 'IMAGE_TO_TEXT'){
					$(".drop_parent:eq("+(data.pageContent.dragTexts[i].dropTargetIndex-1)+")").html('<div class="drag_options dragdiv_1" style="width:104%;left:-3px;top:-3px;position:relative;margin:0;" class="drag_options"><img class="img-responsive center-block" src="'+_model.getCourseDataObj().baseURL + 'assets/images/' + data.pageContent.dragTexts[i].image+'" alt="'+data.pageContent.dragTexts[i].altText+'" /></div>');
					
					
				}
				
				if(data.pageContent.type == 'IMAGE_TO_IMAGE'){
					$(".drop_parent:eq("+(data.pageContent.dragTexts[i].dropTargetIndex-1)+")").html('<div class="drag_options dragdiv_1" style="width:104%;left:-3px;top:-3px;position:relative;margin:0;" class="drag_options"><img style="padding-left:0;" class="img-responsive center-block" src="'+_model.getCourseDataObj().baseURL + 'assets/images/' + data.pageContent.dragTexts[i].image+'" alt="'+data.pageContent.dragTexts[i].altText+'" /></div>');
					
					
				}
				
				if(data.pageContent.type == 'SINGLE_IMAGE'){
					if(data.pageContent.dragTexts[i].dropTargetIndex != ""){
						$(".drop_parent:eq("+(data.pageContent.dragTexts[i].dropTargetIndex-1)+")").html('<div class="drag_options dragdiv_1" style="width:104%;left:-3px;top:-3px;position:relative;margin:0;" class="drag_options"><img style="padding-left:0;" class="img-responsive center-block" src="'+_model.getCourseDataObj().baseURL + 'assets/images/' + data.pageContent.dragTexts[i].largeImage+'" alt="'+data.pageContent.dragTexts[i].altText+'" /></div>');
					
						$(".drag").css('visibility','visible').attr('aria-hidden','false');
						$(".drag:eq("+i+")").css('visibility','hidden').attr('aria-hidden','true');
					}
				}
			}
			
			for(var i=0;i<data.pageContent.dropTexts.length;i++){
				if(data.pageContent.type == 'TEXT_TO_TEXT'){
					feedbackStr = feedbackStr + data.pageContent.dropTexts[i].text + "  " + $(".drop_question_block .drag_options:eq("+i+") p").text();
				}
				
				if(data.pageContent.type == 'IMAGE_TO_TEXT'){
					feedbackStr = feedbackStr + data.pageContent.dropTexts[i].text + "  " + $(".drop_area .drag_options:eq("+i+") img").attr('alt')+" ";
				}
				
				if(data.pageContent.type == 'IMAGE_TO_IMAGE'){
					feedbackStr = feedbackStr + data.pageContent.dropTexts[i].altText + "  " + $(".drop_question_block .drag_options:eq("+i+") p").text();
				}
				
				if(data.pageContent.type == 'SINGLE_IMAGE'){
					feedbackStr = "Correct answer is  " + $(".drop_area .drag_options img").attr('alt');
				}
			
			}
			
			$(".drop_parent").next().html('');
			$(".drop_inst").html('');
			
			$(".drag").draggable('disable').removeAttr('tabindex').removeClass('focus_active');
			
			if(isIPAD || isAndroid){
				$("#focusDiv1").html(feedbackStr);
			}else{
				$("#focusDiv1").attr('tabindex',1).html(feedbackStr).focus();
			}
		});
		
		var correctCount = 0;
		var inCorrectCount = 0;
		var totalCorrectCount = data.pageContent.dropTexts.length;
		
		if(data.pageContent.type == 'SINGLE_IMAGE'){
			totalCorrectCount = 1;
		}
		
		$("#feedbackModel").on("hidden.bs.modal", _this.PopupHide);
		
		$(".checkBtn").on('click',function(){
			$(".drag_options").draggable('disable');
			$(".drag_options").css("pointer-events","none");
			
			correctCount = 0;
			inCorrectCount = 0;
			$(".drop_parent").each(function(){
				var correctIndex = $(this).attr('data-index');		
				var curIndex = $(this).find('.drag_clone').attr('data-target');
				//if(curIndex != ""){
							// console.log( "ENTERED" );
							if(correctIndex == curIndex){
								// $(this).next().html('<p class="dd_inst_hide tick_image">Correct</p><img aria-hidden="true" alt="Correct" src="assets/images/green_tick.png"/>');
								$(this).next().show();
								
								correctCount++;
							}else{
								// $(this).next().html('<p class="dd_inst_hide tick_image">Incorrect</p><img aria-hidden="true" alt="Incorrect" src="assets/images/cross_tick.png"/>');
								$(this).next().show();
								
								inCorrectCount++;
							}
				//}
			});
			
			attemptCount++;
			
			$(".resetBtn").removeAttr('disabled').removeClass('disable').find('.dd_inst_hide').html('');
			$(this).attr('disabled','disabled').addClass('disable').find('.dd_inst_hide').html('button unavailable');
			//$(this).css('opacity','0.5');
			
			$(".drag p").html('');
			$("#focusDiv1").html('');
			
			var feedbackStr;
			
			// console.log(totalCorrectCount+" "+correctCount+" "+inCorrectCount);
			
			if( (totalCorrectCount == correctCount) && (inCorrectCount == 0) ){
				EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":1});
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
				//console.log("correct answer");
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
				
				_this.shoWCrtAns();
				$('#feedbackModel').modal('show');
				currentRef.playPauseFlag = true;
				audio.loadAudio(baseURL+"assets/media/audio/"+data.pageContent.feedback[0].correct+"");
				$(".resetBtn").attr('disabled','disabled').addClass('disable');
				$(".resetBtn").css('opacity','0.65');
				feedbackStr = 'It\'s correct';	
				$(".resetBtn").attr('disabled','disabled').addClass('disable')			
				if(attemptCount == 2){
					$(".showAnsBtn").removeAttr('disabled').css('opacity',1).removeClass('disable').find('.dd_inst_hide').html('');
				}
				
			}else if( (correctCount >= 0) && (inCorrectCount > 0) ){
				EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":0});
				//console.log("not correct");
				feedbackStr = 'It\'s not correct.';	
				if(attemptCount == 2){
					$(".resetBtn").css('opacity','0.65');
					$(".showAnsBtn").removeAttr('disabled').css('opacity',1).removeClass('disable').find('.dd_inst_hide').html('');
					setTimeout(function(){
						$(".feeback_mark").each(function(){
//							$(this).html('');
						});
						$(".dropDiv").each(function(i){
							var currentRightIndex = Number(data.pageContent.dragTexts[i].dropTargetIndex);
							var currentRightText = data.pageContent.dragTexts[i].text
//							$(".dropDiv").eq(currentRightIndex-1).find('p').html(currentRightText);
						});
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
						
						_this.shoWCrtAns();
						$('#feedbackModel').modal('show');
						currentRef.playPauseFlag = true;
						audio.loadAudio(baseURL+"assets/media/audio/"+data.pageContent.feedback[0].incorrect2+"");
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
					},500);
					
				}else{
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
					$('#feedbackModel').modal('show');
					currentRef.playPauseFlag = true;
					audio.loadAudio(baseURL+"assets/media/audio/"+data.pageContent.feedback[0].incorrect1+"");
				}
			}else if( (totalCorrectCount > correctCount) && (inCorrectCount == 0) ){
				EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":0});
				//console.log("partially correct");
				feedbackStr = 'It\'s partially correct.';	
				if(attemptCount == 2){
					$(".resetBtn").css('opacity','0.65');
					$(".showAnsBtn").removeAttr('disabled').css('opacity',1).removeClass('disable').find('.dd_inst_hide').html('');
					setTimeout(function(){
						$(".feeback_mark").each(function(){
//							$(this).find('p').html();
						});
						$(".dropDiv").each(function(i){
							var currentRightIndex = Number(data.pageContent.dragTexts[i].dropTargetIndex);
							var currentRightText = data.pageContent.dragTexts[i].text
//							$(".dropDiv").eq(currentRightIndex-1).find('p').html(currentRightText);
						});
						if((_this.currentData.pageContent.language != undefined) && (_this.currentData.pageContent.instruction != "")){
						switch (data.pageContent.language) {
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
						_this.shoWCrtAns();
						$('#feedbackModel').modal('show');
						currentRef.playPauseFlag = true;
						audio.loadAudio(baseURL+"assets/media/audio/"+data.pageContent.feedback[0].incorrect2+"");
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
					},500);
				}else{
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
							  $("#popupHeading").html("That’s incorrect!");
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
					$('#feedbackModel').modal('show');
					currentRef.playPauseFlag = true;
					audio.loadAudio(baseURL+"assets/media/audio/"+data.pageContent.feedback[0].incorrect1+"");
				}
			}
			
			if(isIPAD || isAndroid){
				$("#focusDiv1").html(feedbackStr);
			}else{
				$("#focusDiv1").attr('tabindex',1).html(feedbackStr).focus();
			}
			// console.log("attemptCount:   "+attemptCount);
			if(attemptCount == 2){
					//console.log("final question ended");
					$(".resetBtn").attr('disabled','disabled').addClass('disable')
		}

		$(this).css('opacity','0.65');

		});
		
		_this.initKeyBoardAccessibility();
		
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
				  $("#popupContent").append('<p id="feedbackText">தயவுசெய்து மீண்டும் முயற்சி செய்க.</p>');
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

	_this.PopupHide = function(){ 
		audio.stopAudio();
		audio.loadAudio(baseURL+"assets/media/audio/blank");
		if(window.answersubmitted ==false){
			$(_this.scrollingElement).animate({
				scrollTop: document.body.scrollHeight
			 }, 500);
		}
		
	}

	this.shoWCrtAns = function() {
		$("#popupContent").html("")
		var ansCheck = 1;
		var tmpStrTable = "";
		tmpStrTable = "<table border='1' cellpadding='10' cellspacing='10' style='margin:auto;'><thead>";
			tmpStrTable+= '<th>'+ _this.currentData.pageContent.dropHead +'</th>';
			tmpStrTable+= '<th>'+ _this.currentData.pageContent.dragHead +'</th>';
			tmpStrTable+= '</thead><tbody>';

			for(var i = 0; i < _this.currentData.pageContent.dropTexts.length; i++) {
				var currentValue = answersArray.indexOf(ansCheck);
				ansCheck++;
				tmpStrTable+= '<tr><td>'+_this.currentData.pageContent.dropTexts[i].text+'</td><td>'+_this.currentData.pageContent.dragTexts[currentValue].text+'</td></tr>'
			}
			tmpStrTable+= '<tbody></table>';

			$("#popupContent").html(tmpStrTable);
	};
	
	this.zoomPopupHandler = function(){
		
		$("#imagePopup").show();
		_model.setTemplateStatus(true);
		EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		$("#img").attr("data-toggle","modal").attr("data-target","#imagePopup");
		$("#imageZoom").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + jsonData.pageContent.questionZoomImage);
	}
		
	this.initKeyBoardAccessibility = function(){
			var selectedDragEle;
			var selectedDropEle;
			
			var dropTargets = $(".drop_parent");
			
			$('.drag').attr('aria-grabbed','false');
			$('.drop_parent').attr('aria-dropeffect','none');
			
			$(".parent_loader").unbind('keydown').bind('keydown',function(evt){
					
					// console.log( _this.currentData.pageContent.type );
					
					if(evt.keyCode == 32){
						var focusedEle = $("*:focus");
						if(focusedEle != null){
							if(focusedEle.hasClass('drag') ){
								selectedDragEle = focusedEle;
								selectedDragEle.addClass('focus_active').attr('aria-grabbed','true');
								var curTabIndex = Number( selectedDragEle.attr('tabindex') );
								
								var dragEles = $(".drag:visible");
								//var dropTargets = $(".drop_parent");
																
								for (var i = 0; i < dragEles.length; i++){
									$(dragEles[i]).removeAttr('tabindex');
								}
								
								for (var i = 0; i < dropTargets.length; i++) {
									// console.log( $(dropTargets[i]) );
									if( !$("#drop_"+i).children().hasClass('drag_options') ){
										//$(dropTargets[i]).attr('tabindex',curTabIndex+1);
										$("#drop_"+i).attr('tabindex',curTabIndex+1);
									}
								}		
								var dragEles = $(".drag:visible");
								$('.drop_parent').attr('aria-dropeffect','move');
								$("#focusDiv1").attr('tabindex',curTabIndex+1).html('Item selected. This can be moved to any of the drop targets').focus();
								
								
							}
						}
					}
					
					if(evt.keyCode == 27){
						selectedDragEle.removeClass('focus_active');
						selectedDragEle = '';
						
						var dragEles = $(".drag:visible");
								
						for (var i = 0; i < dragEles.length; i++) {
							$(dragEles[i]).attr('tabindex',i+1);
						}

						for (var i = 0; i < dropTargets.length; i++) {
							$(dropTargets[i]).removeAttr('tabindex');
						}
						
						$('.drag').attr('aria-grabbed','false');
						$('.drop_parent').attr('aria-dropeffect','none');
					}
					
					if( (evt.keyCode == 13) || (evt.keyCode == 77 && (evt.ctrlKey || evt.metaKey)) ){
						var focusedEle = $("*:focus");
						if(focusedEle != null){
							if( focusedEle.hasClass('drop_parent') ){

								//$(".resetBtn").removeAttr('disabled').css('opacity',1);
								
								
								
								var clonedEle = selectedDragEle.clone();
								focusedEle.html(clonedEle);
								clonedEle.attr('id','').removeAttr('tabindex').removeClass('drag focus_active').css({position:"relative",left:"0px",top:"0px",width:"100%"}).addClass('drag_clone dropDiv');
								focusedEle.css('padding','0');
								clonedEle.css('margin','0');
								
								focusedEle.css('border','none');
								
								if(_this.currentData.pageContent.type == 'IMAGE_TO_TEXT'){	
									clonedEle.attr('id','').removeAttr('tabindex').removeClass('drag focus_active').css({position:"relative",left:"0px",top:"0px",width:"100%"}).addClass('drag_clone dropDiv');								
								}
								
								if(_this.currentData.pageContent.type == 'IMAGE_TO_IMAGE'){	
									clonedEle.attr('id','').removeAttr('tabindex').removeClass('drag focus_active').css({position:"relative",left:"0px",top:"0px",width:"100%"}).addClass('drag_clone dropDiv');
									$('.drag_clone img').css('padding','0');
								}
																					
								selectedDragEle.css('visibility','hidden').attr('aria-hidden','true');
								selectedDragEle.find('p').html('')
								$(".drag_clone").css('visibility','visible').attr('aria-hidden','false');
								
								for (var i = 0; i < dropTargets.length; i++) {
									$("#drop_"+i).removeAttr('tabindex');
								}
								
								$('.drop_parent').attr('aria-dropeffect','none');
								
								var dragEles = $(".drag:visible");
								
								for (var i = 0; i < dragEles.length; i++) {
									//$(dragEles[i]).attr('tabindex',i+1);
									if($(dragEles[i]).html() != ''){
										$(dragEles[i]).attr('tabindex',0);
									}else{
										$(dragEles[i]).removeAttr('tabindex');
									}
								}
								
								
								if(_this.currentData.pageContent.type == 'SINGLE_IMAGE'){					
									var dragIndex = selectedDragEle.index();
									//$(".drag").draggable('disable').removeAttr('tabindex');
									$('.drag_clone img').css('padding','0');
									$('.drag_clone img').attr('src',_model.getCourseDataObj().baseURL + 'assets/images/' + _this.currentData.pageContent.dragTexts[dragIndex-1].largeImage);
								}
								
								//selectedDragEle.removeAttr('tabindex');
								
								$("#focusDiv1").html('Item dropped in the drop target');
								
								// console.log(dragEles.length);
								
								var dragCloneLength = $(".drag_clone").length;
								
								$(".resetBtn").removeAttr('disabled').css('opacity',1).removeClass('disable').find('.dd_inst_hide').html('button unavailable');
								
																
								if(_this.currentData.pageContent.type == 'SINGLE_IMAGE'){
									// console.log("dragCloneLength: "+dragCloneLength);
									if(dragCloneLength == 1){
										$('.checkBtn').removeAttr('disabled').css('opacity',1).removeClass('disable').find('.dd_inst_hide').html('');
										$(_this.scrollingElement).animate({
											scrollTop: document.body.scrollHeight
										 }, 500);		
										$(".instruction_text").html('');
										$("#focusDiv2").attr('tabindex',1).focus();
									}
								}else{
										if(dragCloneLength == totalLength){
											$('.checkBtn').removeAttr('disabled').css('opacity',1).removeClass('disable').find('.dd_inst_hide').html('');
											$(_this.scrollingElement).animate({
												scrollTop: document.body.scrollHeight
											 }, 500);		
											$(".instruction_text").html('');
											$("#focusDiv2").attr('tabindex',1).focus();
										}
								}
							}
						}
					}
			});

			$("#parentContainer,#focusDiv1,#focusDiv2").on('focusout',function(){
				$(this).removeAttr('tabindex');
			});
			
			$('.resetBtn , .checkBtn , .showAnsBtn').on('focusin',function(){
				$(this).find('.dd_inst_hide').html('');
			});
			
			var dragTouchCount = 0;
			
			//if(isIPAD){
				//$(".drag p").attr('aria-grabbed','false');
			//}
			
			//if(isIPAD || isAndroid){
					// $(".drag").on('click',function(){
					// 	dragTouchCount++;
					// 	$("#log").html(dragTouchCount);

					// 					$('.drag').attr('aria-grabbed','false').removeClass('focus_active');
					// 					$('.drop_parent').attr('aria-dropeffect','none');
										
					// 					selectedDragEle = $(this);
					// 					selectedDragEle.addClass('focus_active').attr('aria-grabbed','true');
					// 					var curTabIndex = Number( selectedDragEle.attr('tabindex') );
										
					// 					var dragEles = $(".drag:visible");
					// 					//var dropTargets = $(".drop_parent");
																		
					// 					for (var i = 0; i < dragEles.length; i++){
					// 						$(dragEles[i]).removeAttr('tabindex');
					// 					}
										
					// 					for (var i = 0; i < dropTargets.length; i++) {
					// 						console.log( $(dropTargets[i]) );
					// 						if( !$("#drop_"+i).children().hasClass('drag_options') ){
					// 							//$(dropTargets[i]).attr('tabindex',curTabIndex+1);
					// 							$("#drop_"+i).attr('tabindex',curTabIndex+1);
					// 						}
					// 					}		
					// 					var dragEles = $(".drag:visible");
					// 					$('.drop_parent').attr('aria-dropeffect','move');
					// 					$("#focusDiv1").attr('tabindex',curTabIndex+1).html('Item selected. This can be moved to any of the drop targets').focus();
						
					// });
					
					// $(".drop_parent").on('click',function(){
					// 	dragTouchCount++;
					// 	$("#log").html(dragTouchCount);
					// 					if(selectedDragEle != ''){
					// 							focusedEle = $(this);
					// 							var clonedEle = selectedDragEle.clone();
					// 							focusedEle.html(clonedEle);
					// 							clonedEle.attr('id','').removeAttr('tabindex').removeClass('drag focus_active').css({position:"relative",left:"-3px",top:"-3px",width:"100%"}).addClass('drag_clone dropDiv');
					// 							focusedEle.css('padding','0');
					// 							//clonedEle.css('margin','0');
												
					// 							focusedEle.css('border','none');
												
					// 							if(_this.currentData.pageContent.type == 'IMAGE_TO_IMAGE'){	
					// 								clonedEle.attr('id','').removeAttr('tabindex').removeClass('drag focus_active').css({position:"relative",left:"-3px",top:"-3px",width:"104%"}).addClass('drag_clone dropDiv');
					// 								$('.drag_clone img').css('padding','0');
					// 							}
																			
					// 							if(_this.currentData.pageContent.type == 'SINGLE_IMAGE'){
					// 								var dragIndex = selectedDragEle.index();
					// 								//$(".drag").draggable('disable').removeAttr('tabindex');
					// 								$('.drag_clone img').css('padding','0');
					// 								$('.drag_clone img').attr('src',_model.getCourseDataObj().baseURL + 'assets/images/' + _this.currentData.pageContent.dragTexts[dragIndex-1].largeImage);
					// 							}
												
					// 							selectedDragEle.css('visibility','hidden').attr('aria-hidden','true');
					// 							selectedDragEle.find('p').html('')
					// 							$(".drag_clone").css('visibility','visible').attr('aria-hidden','false');
												
					// 							for (var i = 0; i < dropTargets.length; i++) {
					// 								$("#drop_"+i).removeAttr('tabindex');
					// 							}
												
					// 							$('.drop_parent').attr('aria-dropeffect','none');
												
					// 							var dragEles = $(".drag:visible");
												
					// 							for (var i = 0; i < dragEles.length; i++) {
					// 								//$(dragEles[i]).attr('tabindex',i+1);
					// 								if($(dragEles[i]).html() != ''){
					// 									$(dragEles[i]).attr('tabindex',0);
					// 								}else{
					// 									$(dragEles[i]).removeAttr('tabindex');
					// 								}
					// 							}
												
					// 							//selectedDragEle.removeAttr('tabindex');
												
					// 							$("#focusDiv1").html('Item dropped in the drop target');
												
					// 							$(".resetBtn").removeAttr('disabled').css('opacity',1).removeClass('disable').find('.dd_inst_hide').html('');
												
					// 							console.log(dragEles.length);
												
					// 							var dragCloneLength = $(".drag_clone").length;
												
					// 							if(_this.currentData.pageContent.type == 'SINGLE_IMAGE'){
					// 								if(dragCloneLength == 1){
					// 									$('.checkBtn').removeAttr('disabled').css('opacity',1).removeClass('disable').find('.dd_inst_hide').html('');		
					// 									$(".instruction_text").html('');
					// 									$("#focusDiv2").attr('tabindex',1).focus();
					// 								}
					// 							}else{
					// 								if(dragCloneLength == totalLength){
					// 									$('.checkBtn').removeAttr('disabled').css('opacity',1).removeClass('disable').find('.dd_inst_hide').html('');		
					// 									$(".instruction_text").html('');
					// 									$("#focusDiv2").attr('tabindex',1).focus();
					// 								}
					// 							}
												
												
												
					// 							selectedDragEle = ''
					// 					}
					// });
			//}
		
			
	}

}