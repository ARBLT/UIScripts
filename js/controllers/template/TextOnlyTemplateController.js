/**
 * Created by Ravi Sharma on 8/11/2016.
 */

var TextOnlyTemplateController = function(_parentControllerObj){

    var _this = this;
	
    this.init = function(data){
        trace(":: Text Only Template Controller Loaded ::");
		$("#notesPanel").hide();
        _this.loadUI(data);
    }

    this.loadUI = function(data){
        trace(":: Text Only Template Load UI ::");

       $("#heading").html(data.pageContent.heading);
       $("#content").html(data.pageContent.content);
	   
	   if( _model.getAppDataObj().scorm == "local" ){
			if((data.pageContent.anchorTag != undefined) && (data.pageContent.anchorTag != "")){
				if( $("#parentContainer a").length > 0){
					$("#parentContainer a").attr('data-clicked',false);
					if(!localStorage.getItem("anchor_"+data.pageContent.anchorTag+"")){
						$("#parentContainer").addClass("anchorTag");
						localStorage.setItem("anchor_"+data.pageContent.anchorTag+"","true");
						$("#parentContainer a").off('click').on('click',_this.LocalOpenHrefLink);
					}else{
						$("#parentContainer").removeClass("anchorTag");
					}
				}
			}
	   }
	   if((data.pageContent.tooltip != undefined) && (data.pageContent.tooltip != "")){
			$(".hints_part").show();
			$("#toolTip").empty().html(data.pageContent.tooltip);
		} else {
			$(".hints_part").hide();
		}
		
		if((data.pageContent.notes != undefined) && (data.pageContent.notes != "")){
            $("#notesPanel").show();
             $("#panelContent").html(data.pageContent.notes);
        }
        if( $("#parentContainer a").length > 0){
			$("#parentContainer a").attr('data-clicked',false);
			$("#parentContainer a").off('click').on('click',_this.openHrefLink);
		}else{
			_model.setTemplateStatus(true);
		}
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
			if(clickedCount == totalCount){
				_model.setTemplateStatus(true);
				EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
			}
		}
	}
	
	this.clear = function(){

	}
	
	/* _this.LocalOpenHrefLink = function(e){ 
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
	} */
	
}