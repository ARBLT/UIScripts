/**
 * Created by Ravi Sharma on 8/10/2016.
 */
var ImageOnlyTemplateController = function(){

    var _this = this;
	var currentData;
	var images;
	var zoomImages;
	var x, y, z;
	var totalImageCount = 0;
	var currentClickedCount = 0;

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
		
		window.largeImgClicked = false;
		window.audioEnded = false;

		images = data.pageContent.image.split(',');
		zoomImages = data.pageContent.zoomImage.split(',');
		//console.log(images[0]);
	

		images.forEach((element, index) => {
			$(".img_part").append('<img  id="img_'+index+'" src="'+element+'" class="img img-responsive center-block" />');
			//console.log('hi');
		
			$("#heading").html('').html(data.pageContent.heading);
		 //$("#img").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + images[0]);
		 totalImageCount++;
		 $("#img_"+index).attr("data-visited","false");

		if((data.pageContent.imageClass != undefined) && (data.pageContent.imageClass != "")){ 
			
			$("#img_"+index).addClass(""+data.pageContent.imageClass+"");
			
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
			$(".img").unbind("click").bind("click", _this.zoomPopupHandler).css("cursor","pointer");
		} else {
			_model.setTemplateStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}
		});
		//console.log(images.length);
		if ((images.length) > 1){
			$(".img").addClass("moreimage");
		}

			
		if(data.pageContent.heading.indexOf("Variable Exercise") >= 0 || data.pageContent.heading.indexOf("वैरिएबल एक्सरसाइज") >= 0) {
			$(".img_part img").addClass("variable-exer");
			console.log($(".img_part img"))
		}
       
    }
	
	this.clear = function(){

	}
	
	_this.zoomPopupHandler = function(){

		if($(this).attr("data-visited") == "false"){
			currentClickedCount++;
			$(this).attr("data-visited","true");
		}

		if(currentClickedCount == totalImageCount){

			
			window.largeImgClicked = true;
			if(window.audioEnded == true){
				$("#nextNotification").fadeIn(800);
				$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
				$("#menuItem_"+window.currentIndexRef+" , #menuItem_"+window.currentIndexRef+"").css({'pointer-events': 'auto', 'opacity': 1}); 
				$("#menuItem_"+window.nextIndexRef+" ").addClass('completed');
				$(".completed").css({'pointer-events': 'auto', 'opacity': 1});

				if(!$(".menu_active i").hasClass("pull-right")){
					$(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
				}
			}
			
		}
		

		
		$("#imagePopup").show();
		_model.setTemplateStatus(true);
		//EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		x = $(this).attr("id");
		z = x.split("_");
		y = z[1];
		$("#img_"+y).attr("data-toggle","modal").attr("data-target","#imagePopup");
		$("#imageZoom").attr("src", zoomImages[y]);
		

}
}