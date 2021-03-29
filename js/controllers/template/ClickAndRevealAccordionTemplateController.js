
var ClickAndRevealAccordionTemplateController = function(){

    var _this = this;
	var tempArr = new Array();

    this.init = function(data){
        trace(":: Click and Reveal Accordion Template Controller Loaded ::");
        _this.loadUI(data);
    }
	
    this.loadUI = function(data){
        trace(":: Click and Reveal Accordion Template Load UI ::");
		trace(data);
		
		$("#heading").html(data.pageContent.heading);
		$("#content").html(data.pageContent.content);
		
		var tempstr = "";

		for(var i in data.pageContent.tabs){
			if(data.pageContent.tabs[i].image != ""){
				
			tempstr += '<div class="panel panel-blue"><div class="panel-heading heading1" role="tab" id="head_'+i+'"><a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse_'+i+'" aria-expanded="false" aria-controls="collapse_'+i+'"><h4 id="iconPlus" class="panel-title">'+data.pageContent.tabs[i].title+'<img class="plusicon" src="assets/images/accordian_click.png" alt="image" /></h4></a></div><div id="collapse_'+i+'" class="panel-collapse collapse " role="tabpanel" aria-labelledby="head_'+i+'"><div class="panel-body text_with_imge_continer"><div class="col-md-6 col-xs-8">'+data.pageContent.tabs[i].content+'</div><div class="col-md-6 col-xs-4 img_part"><img class="center-block" src="'+_model.getCourseDataObj().baseURL + "assets/images/" + data.pageContent.tabs[i].image+'" alt="image" /></div></div></div></div>';			
			}else{
				tempstr += '<div class="panel panel-blue"><div class="panel-heading heading2" role="tab" id="head_'+i+'"><a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse_'+i+'" aria-expanded="false" aria-controls="collapse_'+i+'"><h4 id="iconPlus" class="panel-title">'+data.pageContent.tabs[i].title+'<img class="plusicon" src="assets/images/accordian_click.png" alt="image" /></h4></a> </div><div id="collapse_'+i+'" class="panel-collapse collapse collapse2" role="tabpanel" aria-labelledby="head_'+i+'"> <div class="panel-body"><div class="col-xs-12">'+data.pageContent.tabs[i].content+'</div></div></div></div> '
			}

			tempArr.push("head_" + i);
		}
		$("#accordion").empty().html(tempstr);
		if(data.pageContent.tooltip){
			$("#toolTip").empty().html(data.pageContent.tooltip);
		}
		for(var i in data.pageContent.tabs){
			$("#head_"+i).unbind("click").bind("click", _this.collapseClickHandler);
		}
    }
	
	this.clear = function(){

	}
	
	this.collapseClickHandler = function(event){

			$("#iconPlus img").attr("src", "assets/images/accordian_click.png");
			
		if($("#"+event.currentTarget.id+" a").attr('aria-expanded') == "false" ){		
			$("#"+event.currentTarget.id+" a img").attr("src", "assets/images/accordian_reveal.png");
		}else{ 
			$("#"+event.currentTarget.id+" a img").attr("src", "assets/images/accordian_click.png");		
		} 

		tempArr = jQuery.grep(tempArr, function(value) {
			return value != event.currentTarget.id;
		});

		if(tempArr.length == 0){
			//To-do Task
			_model.setTemplateStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}
	};	
}