/**
 * Created by Ravi Sharma on 8/10/2016.
 */

var TextSingleImageTemplateController = function(_parentControllerObj){

    var _this = this;
	var currentData, totalCnt;

    this.init = function(data){
        trace(":: Text with Single Image Template Loaded ::");
        trace(data);

        $("#notesPanel").hide();
        $("#resourcePanel").hide();
		$("#imagePopup").hide();
        _this.currentData = data;
        _this.loadUI(_this.currentData);
    }

    this.loadUI = function(data){
        trace(":: Paint the Text Image Template UI ::");
        trace(data);
		
        $("#heading").html('').html(data.pageContent.heading);
		var cnt = data.pageContent.content;
		if((data.pageContent.tooltip != undefined) && (data.pageContent.tooltip != "")){
			cnt += '<br /><div class="hints_part"><img src="assets/images/instruction _icon.png" alt="image" /><p id="toolTip">Click each problem to learn more.</p></div>';
		}
					
		$("#content").html('').html(cnt);
		
		if (data.pageContent.largefont){
			$("#content").addClass("newfont_size");
			$("#heading").addClass("newfont_size");
		}
		
        $("#img").attr("src",  data.pageContent.image);
		if((data.pageContent.anchorTag != undefined) && (data.pageContent.anchorTag != "")){
			$("#parentContainer").addClass("anchorTag");
		}
		
		
		if((data.pageContent.zoomImage != undefined)  && (data.pageContent.zoomImage != "")){
			$("#img").unbind("click").bind("click", _this.zoomPopupHandler).css("cursor","pointer");
			$("#img").addClass("nextEnable");
		} 
		
		
		totalCnt = $(".nextEnable").length;
		
		if((data.pageContent.imageClass != undefined) && (data.pageContent.imageClass != "")){ 
			$("#img").addClass(""+data.pageContent.imageClass+"");
        }

        if((data.pageContent.notes != undefined) && (data.pageContent.notes != "")){
            $("#notesPanel").show();
            $("#panelContent").html('').html(data.pageContent.notes);
        }

		if((data.pageContent.resources != undefined) && (data.pageContent.resources != "")){
            $("#resourcePanel").show();
			$("#resourceContent").html('').html(data.pageContent.resources);
        }
		
		if((data.pageContent.tooltip != undefined) && (data.pageContent.tooltip != "")){
			$("#toolTip").empty().html(data.pageContent.tooltip);
		}
		
		if( _model.getAppDataObj().scorm == "local" ){
			if((data.pageContent.anchorTag != undefined) && (data.pageContent.anchorTag != "")){
				if( $("#parentContainer a").length > 0){
					$("#parentContainer a").attr('data-clicked',false);
					if(!localStorage.getItem("anchor_"+data.pageContent.anchorTag+"")){
							$("#parentContainer").addClass("anchorTag");
							$("#parentContainer a").off('click').on('click',_this.LocalOpenHrefLink);
					}else{
						$("#parentContainer").removeClass("anchorTag");
					}
				}
			}
		}
		
		if( $("#parentContainer a").length > 0){
			$("#parentContainer a").attr('data-clicked',false);
			$("#parentContainer a").off('click').on('click',_this.openHrefLink);
			$("#parentContainer a").addClass("nextEnable");
		}

		
		if( ( $("#parentContainer a").length == 0) && ( ($(".nextEnable").length == 0) ) ){
			_model.setTemplateStatus(true);
			//EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}
		
		
		
		
       // _model.setTemplateStatus(true);
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
				$("#parentContainer a").removeClass("nextEnable");
				_this.nextEnableChecker();
			}
		}
	}
	
	this.nextEnableChecker = function(){
		//if(!$("#parentContainer").hasClass("nextEnable")){	alert()
		if($(".nextEnable").length == 0){
			_model.setTemplateStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}
	}
	
	this.clear = function(){

	}
	
	_this.LocalOpenHrefLink = function(e){ 
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
	}
	
	_this.zoomPopupHandler = function(){				
		$("#imagePopup").show();
		$("#img").attr("data-toggle","modal").attr("data-target","#imagePopup");
		$("#imageZoom").attr("src",  _this.currentData.pageContent.zoomImage);
		
		
		$("#img").removeClass("nextEnable");
		_this.nextEnableChecker();
		
	}
}