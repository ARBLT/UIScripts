/**
 * Created by Venkat on 8/12/2016.
 */

var TextImageAndButtonPopupTemplateController = function(){

	var i, popupListLength, popupListAdding, popupListSelected, makingPopup;
    var _this = this;
	var currentData, popupHandle,ButtonPopup,baseURL;
	var tempArr = new Array();

    this.init = function(data){
        trace(":: Text Image and Button Popup Template Loaded ::");
		baseURL = _model.getCourseDataObj().baseURL;
 ButtonPopup = new AudioManager();
		$("#notesPanel").hide();
		_this.currentData = data;
        _this.loadUI(_this.currentData);
    }

	this.clear = function(){
		
	}
	
    this.loadUI = function(data){
        trace(":: Text Image and Button Popup Template UI Loaded ::");
		
		$("#popupType").hide();
		$("#heading, #content, #popupListItem").html('');
		$("#heading").html(data.pageContent.heading);
		$("#content").html(data.pageContent.content);
		if((data.pageContent.pageImage != undefined) && (data.pageContent.pageImage != "")){		
			$("#contentImage").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + data.pageContent.pageImage);		
		}		
			
		if((data.pageContent.zoomImage != undefined) && (data.pageContent.zoomImage != "")){
			$("#contentImage").attr("data-toggle", "modal").attr("data-target", "#imagePopup").css("cursor","pointer");
		} else {
			$("#contentImage").removeAttr("data-toggle", "modal").removeAttr("data-target", "#imagePopup").css("cursor","default");
		}
		
		if((data.pageContent.imageClass != undefined) && (data.pageContent.imageClass != "")){ 		
			$("#contentImage").addClass(""+data.pageContent.imageClass+"");		
        }
		if((data.pageContent.bottomcontent != undefined) && (data.pageContent.bottomcontent != "")){ 		
			$("#bottomCnt").html(data.pageContent.bottomcontent);		
        }
		
		if((data.pageContent.hintText != undefined) && (data.pageContent.hintText != "")){
			$("#hintText").html('').html(data.pageContent.hintText);
		} else {
			$("#hintText").remove();
		}
		
		if((data.pageContent.notes != undefined) && (data.pageContent.notes != "")){
			$("#notesPanel").show();
			$("#panelContent").html(data.pageContent.notes);
		}
		if((data.pageContent.popup != undefined) && (data.pageContent.popup != "")){
			popupHandle = data.pageContent.popup;
		} else {
			popupHandle = "false";
		}
		$(".popupClose").on("click", _this.PopupHide);
		$("#myModal").on("hidden.bs.modal", _this.PopupHide);
		
		if((data.pageContent.tooltipClass != undefined) && (data.pageContent.tooltipClass != "")){
			$("#toolTip").addClass(data.pageContent.tooltipClass);
		}
/* 
if((data.pageContent.resources != undefined) && (data.pageContent.resources != "")){
             $("#resourcePanel").show();
			$("#resourceContent").html('').html(data.pageContent.resources);
        } */
		popupListLength = (data.pageContent.buttons).length;
		
		popupListAdding = "";
		for(i=0;i < popupListLength;i++){ 
			if((popupListLength <= 3) && (popupHandle == "false")){ 
				makingPopup = '';
			} else {
				makingPopup = 'data-toggle="modal"  data-target="#myModal"';
			}
			
			if((data.pageContent.column != undefined) && (data.pageContent.column != "")){
				if(i == 0){
					popupListAdding += '<div class="row">';
				}
				popupListAdding += '<div class="col-md-6"><li id="'+ i +'" '+makingPopup+'  >'+data.pageContent.buttons[i].title+'<div class="tick_img"></div></li></div>';
				if( (parseInt(i) + parseInt(1)) % 2 == 0 ){
					popupListAdding += '</div>';
					if(i < (parseInt(popupListLength) - parseInt(1))){
						popupListAdding += '<div class="row">';
					}
				}	
			} else {	
				popupListAdding += '<li id="'+ i +'" '+makingPopup+'  >'+data.pageContent.buttons[i].title+'<div class="tick_img"></div></li>';
			}	
			if((data.pageContent.imageClass != undefined) && (data.pageContent.imageClass != "")){ 
			$("#contentImage").addClass(""+data.pageContent.imageClass+"");
        }
			if((data.pageContent.buttons[i].content != undefined) && (data.pageContent.buttons[i].content != "")){
				tempArr.push(i);
			}
		}
		
		$("#popupListItem li").css("pointer-events","auto");
		$("#popupListItem").html(popupListAdding);

		if((data.pageContent.tooltip != undefined) && (data.pageContent.tooltip != "")){
			$(".hints_part").show();
			$("#toolTip").empty().html(data.pageContent.tooltip);
		} else {
			$(".hints_part").hide();
		}
		
				$("#popupListItem li").unbind("click").bind("click", _this.popupHandler);
				$("#contentImage").off("click").on("click", _this.zoomImageHandler);
				
		/* for(i=0;i < popupListLength;i++){ 
			if((data.pageContent.buttons[i].content != undefined) && (data.pageContent.buttons[i].content != "")){
				$("#popupListItem li:eq('"+i+"')").unbind("click").bind("click", _this.popupHandler);
			}
		} */
    }
	
	_this.PopupHide = function(){ 
 			 ButtonPopup.stopAudio();
			 ButtonPopup.loadAudio(baseURL+"assets/media/audio/blank"); 
		}
	this.zoomImageHandler = function(){
		$("#imageZoom").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.zoomImage);
	}
	
	this.popupHandler = function(event){

		ButtonPopup.stopAudio();
	if((_this.currentData.pageContent.buttons[event.currentTarget.id].content != undefined) && (_this.currentData.pageContent.buttons[event.currentTarget.id].content != "")){
		
		console.log(event.currentTarget.id)
		$("#" + event.currentTarget.id).find("div").show();
		$("#" + event.currentTarget.id).css("background-color", "#a0b1bd");
 		     if((_this.currentData.pageContent.transcript[0].audio != undefined) && (_this.currentData.pageContent.transcript[0].audio != "")){
			   console.log(_this.currentData.pageContent.transcript[event.currentTarget.id].audio)
  				 ButtonPopup.loadAudio(baseURL+"assets/media/audio/"+_this.currentData.pageContent.transcript[event.currentTarget.id].audio+"");
			}  
			if((popupListLength <= 3) && (popupHandle == "false")){
				$("#popupType").fadeIn(800);
				 $("#displayHeading").html('').html(_this.currentData.pageContent.buttons[event.currentTarget.id].title);
				$("#displayContent").html('').html(_this.currentData.pageContent.buttons[event.currentTarget.id].content);
				if(_this.currentData.pageContent.buttons[event.currentTarget.id].image){
					$("#displayPopupImage").show();
					$("#displayPopupImage").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.buttons[event.currentTarget.id].image);
				} else {
					$("#displayPopupImage").hide();
				}
				
				$("#popupListItem li").css("pointer-events","auto");
				$("#popupListItem li:eq("+event.currentTarget.id+")").css("pointer-events","none");
		
			} else {
				 $("#popupHeading").html('').html(_this.currentData.pageContent.buttons[event.currentTarget.id].title);
				$("#popupContent").html('').html(_this.currentData.pageContent.buttons[event.currentTarget.id].content);
				
				if(_this.currentData.pageContent.buttons[event.currentTarget.id].image){
					$("#popupImage").show();
						if($("#popupContent").hasClass('col-md-12')){
							$("#popupContent").removeClass('col-md-12').addClass('col-md-7');
						}
					$("#popupImage img").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.buttons[event.currentTarget.id].image);
					
					if((_this.currentData.pageContent.buttons[event.currentTarget.id].zoomImage != undefined) && (_this.currentData.pageContent.buttons[event.currentTarget.id].zoomImage != "")){
						$("#popupImage img").addClass("popupInsidePopup");
						$(".popupInsidePopup").unbind("click").bind("click", function(){							
							$("#imagePopup1").modal('show');
							$("#innerZoomImage").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.buttons[event.currentTarget.id].zoomImage);
						});
					}  else {
						$("#popupImage img").removeClass("popupInsidePopup").off("click");
					}
				} else {
					$("#popupImage").hide();
					$("#popupContent").removeClass('col-md-7').addClass('col-md-12');
				}
				
			}
		}
					
		tempArr = jQuery.grep(tempArr, function(value) {
			return value != event.currentTarget.id;
		});

		if(tempArr.length == 0){
			_model.setTemplateStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}
	}
	
	/* this.secondPopupHandler = function(){ alert("sdg")
	} */
}