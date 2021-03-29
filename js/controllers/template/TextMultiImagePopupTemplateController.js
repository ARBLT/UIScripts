/**
 * Created by Ravi Sharma on 8/11/2016.
 */

var TextMultiImagePopupTemplateController = function(_parentControllerObj){

    var _this = this;
	var TotalLength;
	var pop={};
	pop.count = 0;
	var Increment= 1;
	var tempArr = new Array();
	
    this.init = function(data){
        trace(":: Text with Multiple Image Template Controller Loaded ::");
		$("#imagePopup").hide();
		 _this.currentData = data;
		 $("#notesPanel").hide();
        _this.loadUI(_this.currentData);
		
		
		//alert();
		if((_this.currentData.pageContent.content[0].zoomImage != undefined)  && (_this.currentData.pageContent.content[0].zoomImage != "")){
			$("#img").unbind("click").bind("click", _this.zoomImagePopupHandler_1).css("cursor","pointer");
		} 
		
		if((_this.currentData.pageContent.content[1].zoomImage != undefined)  && (_this.currentData.pageContent.content[1].zoomImage != "")){
			$("#img2").unbind("click").bind("click", _this.zoomImagePopupHandler_2).css("cursor","pointer");
		} 
		
    }

    this.loadUI = function(data){
        trace(":: Text with Multiple Image Template Load UI ::");
		
		

		//$("#templateContainer").html('');
		$("#heading").html(data.pageContent.heading);		
		TotalLength = (data.pageContent.content).length;

		trace(TotalLength);

		trace(data.pageContent.content);
		/* console.log(data.pageContent.content[0].image);
		console.log(data.pageContent.content[1].image); return; */
		$("#content").append(data.pageContent.content[0].text);
		$("#img").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + data.pageContent.content[0].image);
		 $("#img2").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + data.pageContent.content[1].image);
		 if(data.pageContent.content.length > 2){
			if(data.pageContent.content[2].image != undefined && data.pageContent.content[2].image != ""){
				$("#img3").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + data.pageContent.content[2].image);
			 }
		 }
		 
		
		if((data.pageContent.content[0].zoomImage != undefined)  && (data.pageContent.content[0].zoomImage != "")){
			//$("#img").unbind("click").bind("click", _this.zoomImagePopupHandler_1).css("cursor","pointer");
			$("#img").addClass("imagePopup");
		} 
		
		if((data.pageContent.content[1].zoomImage != undefined)  && (data.pageContent.content[1].zoomImage != "")){
			//$("#img2").unbind("click").bind("click", _this.zoomImagePopupHandler_2).css("cursor","pointer");
			$("#img2").addClass("imagePopup");
		} 

		if(data.pageContent.content.length > 2){
			if((data.pageContent.content[2].zoomImage != undefined)  && (data.pageContent.content[2].zoomImage != "")){
				//$("#img2").unbind("click").bind("click", _this.zoomImagePopupHandler_2).css("cursor","pointer");
				$("#img3").addClass("imagePopup");
			} 
		}
		

		if((data.pageContent.notes != undefined) && (data.pageContent.notes != "")){
            $("#notesPanel").show();
            $("#panelContent").html('').html(data.pageContent.notes);
        }

		if((data.pageContent.tooltip != undefined) && (data.pageContent.tooltip != "")){
			$("#toolTip").empty().html(data.pageContent.tooltip);
			$(".hints_part").show();
		}else{
				$(".hints_part").hide();
			
		}
		
		
		
		//$(".right_aero").css({"pointer-events": "none", "opacity": "0.5" } );
		
		
		/* for (var Increment=1; Increment<=TotalLength; Increment++)
		 {


			var ss = $(".row").first().clone();
			$(ss).appendTo("#templateContainer")
				  trace(data.pageContent.content[0]+">>><<<<<<<<<")
 			$(".row:nth-child(1)").find("#content").append(data.pageContent.content[Increment - 1].text);
			$(".row:nth-child(1)").find("#img").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + data.pageContent.content[1].image);

			//$(".row:nth-child(3)").remove();
			Increment++;

		} */
		
		$(".img-responsive").removeAttr("style");

		//EventManager.getInstance().addControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, _this.audioEnd);
		
		/* EventManager.getInstance().addControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, function(){
			
		if((data.pageContent.content[0].zoomImage != undefined)  && (data.pageContent.content[0].zoomImage != "")){
			$("#img").unbind("click").bind("click", _this.zoomImagePopupHandler_1).css("cursor","pointer");
		} 
		
		if((data.pageContent.content[1].zoomImage != undefined)  && (data.pageContent.content[1].zoomImage != "")){
			$("#img2").unbind("click").bind("click", _this.zoomImagePopupHandler_2).css("cursor","pointer");
		} 
		
		$(".right_aero").css({"pointer-events": "none", "opacity": "0.5" } );
		
		
			
		}); */


		if( $("#parentContainer a").length > 0){
			$("#parentContainer a").attr('data-clicked',false);
			$("#parentContainer a").off('click').on('click',_this.openHrefLink);
		}else{
			_model.setTemplateStatus(false);
		}
		
		/* console.log( _parentControllerObj.menuStatusArr[_parentControllerObj.curChapterIndex].pages[_parentControllerObj.curPageIndex].isVisited );
		
		if(_parentControllerObj.menuStatusArr[_parentControllerObj.curChapterIndex].pages[_parentControllerObj.curPageIndex].isVisited == "true"){
			_this.audioEnd();
			_model.setTemplateStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		} */
		
		/* if( _parentControllerObj.menuStatusArr[_parentControllerObj.curChapterIndex].pages[_parentControllerObj.curPageIndex].isVisited == "false" ){
			//if( _model.getAudioStatus() == true){
				_this.audioEnd();
			//}
		}else{
			_this.audioEnd();
			$(".img-responsive").css("cursor","pointer");
			//_model.setTemplateStatus(true);
			//EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		} */
		
		// _this.audioEnd();
    }
	
	this.audioEnd = function(){
				if((_this.currentData.pageContent.content[0].zoomImage != undefined)  && (_this.currentData.pageContent.content[0].zoomImage != "")){
					$("#img").unbind("click").bind("click", _this.zoomImagePopupHandler_1).css("cursor","pointer");
				} 
				
				if((_this.currentData.pageContent.content[1].zoomImage != undefined)  && (_this.currentData.pageContent.content[1].zoomImage != "")){
					$("#img2").unbind("click").bind("click", _this.zoomImagePopupHandler_2).css("cursor","pointer");
				} 
				
				//$(".right_aero").css({"pointer-events": "none", "opacity": "0.5" } );
				
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
			
		_this.checkHandler();
		
			
			
		}
	}
	
	this.clear = function(){
		EventManager.getInstance().removeControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, _this.audioEnd);
	}
	
	_this.zoomImagePopupHandler_1 = function(){
		
		/* pop.count += 1;
		
		if(pop.count>=2){
			
			$(".right_aero").removeAttr("style");
			
		} */
		
		console.log("Audio Status", _model.getAudioStatus() );
		
		if(_parentControllerObj.menuStatusArr[_parentControllerObj.curChapterIndex].pages[_parentControllerObj.curPageIndex].isVisited == "true"){
			var condition1 = true;		
		}else{
			var condition1 = _model.getAudioStatus();	
		}
		
		// if(condition1){
			//alert('zoomImagePopupHandler_1');
			$("#img").removeClass("imagePopup");
			$("#imagePopup").show();
			$("#img").attr("data-toggle","modal").attr("data-target","#imagePopup");
			$("#imageZoom").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.content[0].zoomImage);
			_this.checkHandler();
		// }
		
	}
	
	_this.zoomImagePopupHandler_2 = function(){
		
		/* pop.count += 1;
		
		if(pop.count>=2){
			
			$(".right_aero").removeAttr("style");
		} */
		
		if(_parentControllerObj.menuStatusArr[_parentControllerObj.curChapterIndex].pages[_parentControllerObj.curPageIndex].isVisited == "true"){
			var condition1 = true;		
		}else{
			var condition1 = _model.getAudioStatus();	
		}
		
		// if(condition1){
			//alert('zoomImagePopupHandler_2');
			$("#img2").removeClass("imagePopup");
			$("#imagePopup").show();
			$("#img2").attr("data-toggle","modal").attr("data-target","#imagePopup");
			$("#imageZoom").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.content[1].zoomImage);
			_this.checkHandler();
		// }
	}
	
	this.checkHandler = function(){
		console.log( $("#parentContainer a").length+" "+$(".imagePopup").length );
		if( $(".imagePopup").length == 0 ){
			_model.setTemplateStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}
			
			
	}
	
}