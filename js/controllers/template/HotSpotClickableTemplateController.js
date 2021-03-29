/**
 * Created by Ravi Sharma on 8/10/2016.
 */

var HotSpotClickableTemplateController = function(_parentControllerObj){

    var _this = this;
	var currentData,ButtonPopup,baseURL;
	var appCntl = _parentControllerObj;
	var hyperCount = {};
	hyperCount.count = 1;
	var popupClick = {};
	popupClick.count = 0;
	popupClick.spanCount = 0;	
	var tempArr = new Array();
	var curID;

    this.init = function(data){
        trace(":: Image Only Template Loaded ::");
        trace(data);
        _this.currentData = data;
		baseURL = _model.getCourseDataObj().baseURL;
		ButtonPopup = new PopupAudioManager();
        _this.loadUI(_this.currentData);
    }

    this.loadUI = function(data){
        trace(":: Paint the Image Template UI ::");
        trace(data);
	$("#hotSpotClose").hide();	
	$("#heading").html('').html(data.pageContent.heading);
	$("#description").html('').html(data.pageContent.description);
	$("#img").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.img);
	
	if((data.pageContent.cssPath != undefined) && (data.pageContent.cssPath != "")){
		var cssHead = data.pageContent.cssPath;
		$('#hotSpotContainer').before('<link rel="stylesheet" href="courses/'+_model.getAppDataObj().courseName+'/assets/css/'+cssHead+'" type="text/css" />');
	}
	
	
	 var cnt = "";
	for(var i = 0; i < (data.pageContent.content).length; i++){
		cnt +='<span class="hotspot click'+(i + parseInt(1))+'" id="click_'+i+'" data-toggle="modal" data-target="#imagePopup" data-backdrop="static" data-keyboard="false" style="cursor: pointer;"></span>';
		tempArr.push(i);
	}
	
			
		$("#content").html('').html(cnt);
		
		if((data.pageContent.imgClass != undefined) && (data.pageContent.imgClass != "")){
			$("#img").addClass(""+_this.currentData.pageContent.imgClass+"");
		}
		
		if((data.pageContent.colClass != undefined) && (data.pageContent.colClass != "")){
			$("#colClass").addClass(""+_this.currentData.pageContent.colClass+"");
		}
		if((data.pageContent.bottomContent != undefined) && (data.pageContent.bottomContent != "")){
			$("#bottomCnt").html(this.currentData.pageContent.bottomContent);
		}
		$(".hotspot").off("click").on("click", _this.hotspotClickable);
		$("#hotSpotClose").off("click").on("click", _this.hotspotCloseHandler);
		
		
		
		hyperCount.hyperlinkCount = $("#bottomCnt a").length;
		
		$("#hotSpotClose").on("click", _this.PopupHide);
		
		
		
		
		//$('.hyper').bind('click', false);
		
			if( $("#parentContainer a").length > 0){
			$("#parentContainer a").attr('data-clicked',false);
			$("#parentContainer a").off('click').on('click',_this.openHrefLink);
			$("#parentContainer a").addClass("nextEnable");
		}

		
		
    }
	
	_this.PopupHide = function(){ 
 			 ButtonPopup.stopAudio();
			_parentControllerObj.audioManager.stopAudio();
			_model.setAudioStatus(true); 
			 ButtonPopup.stopAudio();
			 ButtonPopup.loadAudio(baseURL+"assets/media/audio/blank"); 
		
			 
	}
	
	_this.openHrefLink = function(e){
		if(_parentControllerObj.menuStatusArr[_parentControllerObj.curChapterIndex].pages[_parentControllerObj.curPageIndex].isVisited == "false"){
			console.log(_model.getAudioStatus())
			if( _model.getAudioStatus() == false){
				e.preventDefault();
				return ;
			}
			$(this).attr('data-clicked',true);
			var clickedCount = 0;
			var totalCount = $("#parentContainer a").length;
			$("#parentContainer a").each(function(){
				if( $(this).attr('data-clicked') == 'true' ){
					clickedCount++;
				}
			});
			$("#parentContainer a").removeClass("nextEnable");
			/* if(clickedCount == totalCount ){
				
				console.log('j'+$('.clickableCount').length);
				
				_model.setTemplateStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
			} */
			_this.checkHandler();
		}
	}

	this.hotspotClickable = function(){
		
		var events = event.target.id;
		var eventId = events.substring(events.indexOf('_') +1);
			//console.log(eventId+":::::::::::"+events)
            appCntl.audioManager.pauseAudio();
		
		if(!$(this).hasClass('clickableCount'))
		{
			
			$(this).addClass('clickableCount');
		}	
		
		if(popupClick.count > 1){
			$("#hotSpotClose").show();
		}
		
		popupClick.count++;
		 
		
		if((_this.currentData.pageContent.content[eventId].hotSpotImage != undefined) && (_this.currentData.pageContent.content[eventId].hotSpotImage != "")){
			$("#popupContent").show().attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.content[eventId].hotSpotImage);
		} else {
			$("#popupContent").hide();
		}
		
		if((_this.currentData.pageContent.content[eventId].contentText != undefined) && (_this.currentData.pageContent.content[eventId].contentText != "")){
			$("#popupContentTxt").html(_this.currentData.pageContent.content[eventId].contentText);
		}
		
		if((_this.currentData.pageContent.content[eventId].popupHeading != undefined) && (_this.currentData.pageContent.content[eventId].popupHeading != "")){
			$("#popupTitle").html(_this.currentData.pageContent.content[eventId].popupHeading);
		}
		
				
		if((_this.currentData.pageContent.content[eventId].audio != undefined) && (_this.currentData.pageContent.content[eventId].audio != "")){
			
			
			
			 ButtonPopup.stopAudio();
			_parentControllerObj.audioManager.stopAudio();
			_model.setAudioStatus(true); 
			 ButtonPopup.stopAudio();
			 
			  ButtonPopup.loadAudio(_model.getCourseDataObj().baseURL+"assets/media/audio/"+_this.currentData.pageContent.content[eventId].audio,_this.popAudioEnd);
			 
			/* appCntl.playPauseFlag = true;			appCntl.audioManager.loadAudio(_model.getCourseDataObj().baseURL+"assets/media/audio/"+_this.currentData.pageContent.content[eventId].audio,_this.popAudioEnd); */
			
			console.log("END2");
			
			
			
		}
		
		
		curID = $(this).attr('id').split('_')[1];
		
	}
	
	this.popAudioEnd =  function(){
		
		console.log("POPEND");
		$("#hotSpotClose").show();	
		$("span.hotspot").length;
		popupClick.spanCount++;
		
		
		
		
		_this.checkHandler();
	}
	
	
	this.checkHandler = function(){
		
		tempArr = jQuery.grep(tempArr, function(value) {
			return value != curID;
		});
		
		
		console.log("JI"+popupClick.spanCount);
		
		if((tempArr.length == 0) && ($(".nextEnable").length == 0)){
			if( $("#parentContainer a").length > 0){ 
				var clickedCount = 0;
				var totalCount = $("#parentContainer a").length;
				$("#parentContainer a").each(function(){
					if( $(this).attr('data-clicked') == 'true' ){
						clickedCount++;
					}
				});
				if( (clickedCount == totalCount) ){
					_model.setTemplateStatus(true);
					EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
				}
			}else{
				_model.setTemplateStatus(true);
				EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
			}
		}
	}
	
	this.hotspotCloseHandler = function(){ 
        if (appCntl.playPauseFlag) {
            appCntl.audioManager.playAudio();
            $("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
        } 
	}
	
	this.clear = function(){

	}
	
	
}