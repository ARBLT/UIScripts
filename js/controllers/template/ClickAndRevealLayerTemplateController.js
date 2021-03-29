/**
 * Created by Ravi Sharma on 8/12/2016.
 */

var ClickAndRevealLayerTemplateController = function(){

    var _this = this;
	var tempArr = new Array();

    this.init = function(data){
        trace(":: Click and Reveal Layer Template Loaded ::");
        _this.loadUI(data);
    }

    this.loadUI = function(data){
        trace(":: Click and Reveal Layer Template UI Loaded ::");
        trace(data);
		
		
		$("#heading").html(data.pageContent.heading);
		$("#contentDiv").html(data.pageContent.content);
		
		if(data.pageContent.tooltip){
			$("#toolTip").html(data.pageContent.tooltip);
		} else {
			$("#hints").hide();
		}
		
		var tempstr = '';
		
		for(var i=0; i<data.pageContent.tabs.length; i++){
			if(data.pageContent.tabs.length == 2){
				if(i==0){
					tempstr += '<div class="col-md-4 col-md-offset-2 tab_area"><div class="panel center-block"><div class="panel-heading"><a data-toggle="collapse"  aria-expanded = "false" id="plusminus_'+i+'" href="#collapse_'+i+'"><h3 class="panel-title text-center">'+data.pageContent.tabs[i].title+'</h3><img class="plus_img plusicon" src="assets/images/accordian_click.png" alt="image" /><div class="tick_img"></div></a></div><div id="collapse_'+i+'" class="panel-collapse collapse panel-info"><div class="panel-body">'+data.pageContent.tabs[i].content+'</div></div></div></div>';
 	
				}else{
					tempstr += '<div class="col-md-4 tab_area"><div class="panel center-block"><div class="panel-heading"><a data-toggle="collapse"  aria-expanded = "false" href="#collapse_'+i+'" id="plusminus_'+i+'"><h3 class="panel-title text-center">'+data.pageContent.tabs[i].title+'</h3><img class="plus_img plusicon" src="assets/images/accordian_click.png" alt="image" /><div class="tick_img"></div></a></div><div id="collapse_'+i+'" class="panel-collapse collapse panel-info"><div class="panel-body">'+data.pageContent.tabs[i].content+'</div></div></div></div>';
				}
				
			}else{
			if(i%3 == 0){
				trace(i);
				tempstr += '</div><div class="row">';
			}
				tempstr += '<div class="col-md-4 tab_area"><div class="panel center-block"><div class="panel-heading"><a data-toggle="collapse" aria-expanded = "false" href="#collapse_'+i+'" id="plusminus_'+i+'"><h3 class="panel-title text-center">'+data.pageContent.tabs[i].title+'</h3><img class="plus_img plusicon" src="assets/images/accordian_click.png" alt="image" /><div class="tick_img"></div></a></div><div id="collapse_'+i+'" class="panel-collapse collapse panel-info"><div class="panel-body">'+data.pageContent.tabs[i].content+'</div></div></div></div>';
				
			}
			
		}
		
		$("#parentpanel").empty().html(tempstr);
		for(var i in data.pageContent.tabs){
			tempArr.push("plusminus_" + i);
			$("#plusminus_"+i).unbind("click").bind("click", _this.collapseClickHandler)			
		}
		
    }
	
	this.clear = function(){

	}
	
	this.collapseClickHandler = function(event){

		$("#" + event.currentTarget.id).find("div").show();
		
		if($("#"+event.currentTarget.id+"").attr('aria-expanded') == "false" ){		
			$("#"+event.currentTarget.id+" img").attr("src", "assets/images/accordian_reveal.png");
		}else{ 
			$("#"+event.currentTarget.id+" img").attr("src", "assets/images/accordian_click.png");		
		} 

		tempArr = jQuery.grep(tempArr, function(value) {
			return value != event.currentTarget.id;
		});

		if(tempArr.length == 0){
			//To-do Task
			_model.setTemplateStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}

	}
}