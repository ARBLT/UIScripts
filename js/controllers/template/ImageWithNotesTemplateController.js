/**
 * Created by Ravi Sharma on 8/10/2016.
 */

var ImageWithNotesTemplateController = function(){

    var _this = this;
	var currentData;

    this.init = function(data){
        trace(":: Image Only Template Loaded ::");
        trace(data);
		$("#notesPanel").hide();
        $("#imagePopup").hide();
        _this.currentData = data;
        _this.loadUI(_this.currentData);
    }

    this.loadUI = function(data){
        trace(":: Paint the Image Template UI ::");
        trace(data);
		
		
		$("#heading").html('').html(data.pageContent.heading);
		$("#notes").html('').html(data.pageContent.notes);
         $("#img").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + data.pageContent.image);
		 
		if((data.pageContent.imageClass != undefined) && (data.pageContent.imageClass != "")){ 
			$("#img").addClass(""+data.pageContent.imageClass+"");
        }
		 if((data.pageContent.notes != undefined) && (data.pageContent.notes != "")){
            $("#notesPanel").show();
            $("#panelContent").html('').html(data.pageContent.notes);
        }
		if((data.pageContent.pageContent != undefined) && (data.pageContent.pageContent != "")){ 
			$("#content").html('').html(data.pageContent.pageContent);
        }
		if((data.pageContent.topContent != undefined) && (data.pageContent.topContent != "")){ 
			$("#topContent").html('').html(data.pageContent.topContent);
        }
		
		
		if((data.pageContent.zoomImage != undefined)  && (data.pageContent.zoomImage != "")){
			$("#img").unbind("click").bind("click", _this.zoomPopupHandler).css("cursor","pointer");
		} else {
			_model.setTemplateStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}
       
    }
	
	this.clear = function(){

	}
	
	_this.zoomPopupHandler = function(){
		$("#imagePopup").show();
		_model.setTemplateStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		$("#img").attr("data-toggle","modal").attr("data-target","#imagePopup");
		$("#imageZoom").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.zoomImage);
	}
}