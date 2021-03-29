
var MatchDropDownTemplateTemplateController = function(){

    var _this = this;
	var jsonData, baseURL;
	var clickCount = 1;

    this.init = function(data){
        trace(":: Click and Reveal Accordion Template Controller Loaded ::");
		jsonData = data;
        _this.loadUI(data);
    }

	
    this.loadUI = function(data){ 
        trace(":: Click and Reveal Accordion Template Load UI ::");
		baseURL = _model.getCourseDataObj().baseURL;
		 dropDown = new AudioManager();
		 
		$("#dropDownSubmit").css({'pointer-events': 'none', 'opacity': 0.5});

		$("#heading").html('').html(data.pageContent.title);
		$("#headingDiv").html('').html(data.pageContent.heading);

		var tempstr = "";
		for(var i in data.pageContent.tabs){		 
			tempstr += '<div class="row"> <div class="form-control label_area"> <div class="form-group has-feedback"><label class="control-label col-md-9 clear_fix" for="">'+data.pageContent.tabs[i].title+'</label><div class="col-md-3 clear_fix select_area"><select class="selectpicker show-tick text_select" id="optionParent_'+i+'"></select>  </div>  </div>  </div></div>';			 
		}
		$("#panelParent").empty().html(tempstr);
		 
		for(var a in data.pageContent.tabs){
			for(var n in data.pageContent.tabs[a].options){
				if(n == 0){
					var className = 'val="0"';
				} else {
					var  className = ""
				}
				$("#optionParent_"+a).append('<option '+className+'>'+data.pageContent.tabs[a].options[n]+'</option>');
			}				 
		}
		$(".selectpicker").selectpicker();
		
		$(".selectpicker").on('change', _this.showSubmitButton);
		
		$("#dropDownSubmit").unbind("click").bind("click", _this.submitHandler);
		
    }
	
	this.clear = function(){

	}
	
	_this.showSubmitButton = function() {
		//if(clickCount < 3){ 
		$("#"+this.id).addClass("optionSelected");
		if($(".optionSelected").length >= 3){
			$("#dropDownSubmit").show().css({'pointer-events': 'auto', 'opacity': 1});
		}
		//}
	}
		
	_this.submitHandler = function(){
	
	$("#panelParent").removeClass(".optionSelected");
		dropDown.stopAudio();
		
		$("#panelParent").removeClass(".wrongAnswer, .correctAnswer");
		
		for(var i in jsonData.pageContent.tabs){
			
			if(jsonData.pageContent.tabs[i].answer == $("#optionParent_"+i+"").val()){
				$("#optionParent_"+i+"").addClass("correctAnswer"); 
				$("#popupHeading").html(jsonData.pageContent.popupHeadingCorrect);
			}else{
				 $("#popupHeading").html(jsonData.pageContent.popupHeadingIncorrect);
				$("#optionParent_"+i+"").addClass("wrongAnswer");
			}
			
		} 
		
		if($(".correctAnswer").length == jsonData.pageContent.tabs.length){
		 
		 
			if((jsonData.pageContent.transcript[0].audio != undefined) && (jsonData.pageContent.transcript[0].audio != "")){
				dropDown.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[0].audio+"");
			}
			
			//if((jsonData.pageContent.transcript[0].correct != undefined) && (jsonData.pageContent.transcript[0].correct != "")){
				$("#audioTranscriptPopupContainer").html('').html(jsonData.pageContent.transcript[0].correct);
			//}
			
			$("#popupContent").html('').html(jsonData.pageContent.correct);
			for(var i in jsonData.pageContent.tabs){
				$("button[data-id='optionParent_"+i+"']").css({"background": "#eee","pointer-events": "none"});
			}
			$("#dropDownSubmit").css({'pointer-events': 'none', 'opacity': 0.5});
		//} else if($(".wrongAnswer").length <= jsonData.pageContent.tabs.length){ 
		} else{ 

			if(clickCount <= 1){
			
			if((jsonData.pageContent.transcript[1].audio != undefined) && (jsonData.pageContent.transcript[1].audio != "")){
				dropDown.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[1].audio+"");
			}
			
			//if((jsonData.pageContent.transcript[1].correct != undefined) && (jsonData.pageContent.transcript[1].correct != "")){
				$("#audioTranscriptPopupContainer").html('').html(jsonData.pageContent.transcript[1].incorrect1);
			//}
				
				$("#popupContent").html('').html(jsonData.pageContent.incorrect1);
				 $("#popupHeading").html(jsonData.pageContent.popupHeadingIncorrect);
			}
			if(clickCount == 2){
			
			if((jsonData.pageContent.transcript[2].audio != undefined) && (jsonData.pageContent.transcript[2].audio != "")){
				dropDown.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[2].audio+""); 
			}
			
			//if((jsonData.pageContent.transcript[2].correct != undefined) && (jsonData.pageContent.transcript[2].correct != "")){			
				$("#audioTranscriptPopupContainer").html('').html(jsonData.pageContent.transcript[2].incorrect2);
			//}
		
			var tempAnswer = jsonData.pageContent.incorrect2+"<br /><br /><table class='table' border=1>";
			tempAnswer += "<thead><th class='text-center'>Tasks</th><th class='text-center'>Category</th></thead>"
			for(var i in jsonData.pageContent.tabs){
				tempAnswer += "<tbody><tr><td>"+jsonData.pageContent.tabs[i].title+"</td><td>" +jsonData.pageContent.tabs[i].answer+"</td></tr></tbody>";
				$("button[data-id='optionParent_"+i+"']").css({"background": "#eee","pointer-events": "none"});
			}
			tempAnswer += "</table>"
				$("#popupContent").html('').html(tempAnswer);
				$("#popupHeading").html(jsonData.pageContent.popupHeadingIncorrect);
				$("#dropDownSubmit").css({'pointer-events': 'none', 'opacity': 0.5});
			}
			clickCount++;
		}
		
		
		
	}
 	
}