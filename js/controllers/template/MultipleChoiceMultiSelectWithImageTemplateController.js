/**
 * Created by Ravi Sharma on 8/11/2016.
 */

var MultipleChoiceMultiSelectwithImageTemplateController = function(){

    var radioInputLength, radioInput, checkArr, jsonData, baseURL;
    var clickCount = 0;
	var increment = 0;
	var correctAns = 0;
var application;
    var _this = this;

    this.init = function(data){
        trace(":: Multiple Choice Multi Select Template Controller Loaded ::");
		baseURL = _model.getCourseDataObj().baseURL;
		//application = new ApplicationController();
		 multiSelect = new AudioManager();
		jsonData = data;
		/* $("#playPauseBtn").addClass("playPause");
		$(".playPause").bind("click", _this.playFunction); */
        _this.loadUI(jsonData);
    }

    this.loadUI = function(){
        trace(":: Multiple Choice Multi Select Template Load UI ::");

        $("#submitBtn").attr('disabled','disabled');
        $("#question").html(jsonData.pageContent.question);
		$("#headDiv").html(jsonData.pageContent.heading);
        radioInputLength = (jsonData.pageContent.options).length;
		
        radioInput = "";
        for(var i=0;i<radioInputLength;i++){
            radioInput += '<div class="checkbox checkbox-primary"><input type="checkbox" id="radio_' + (i + parseInt('1')) + '" value="' + jsonData.pageContent.options[i] + '" /><label for="radio_' + (i + parseInt('1')) + '">' + jsonData.pageContent.options[i] + '</label></div>';
        }
		
		$('#multiChoice').html('');
        $('#multiChoice').html(radioInput);

		$("input").unbind("click").bind("click", _this.radioClickHandler);
		$("#submitBtn").unbind("click").bind("click", _this.radioSubmitHandler);
		 $("#feedbackModel").on("hidden.bs.modal", _this.PopupHide);
	
	}
	
	this.clear = function(){

	}
	
	_this.radioClickHandler = function(){
		if($('input[type="checkbox"]:checked').length > 0){
			$("#submitBtn").fadeIn(700);
			$("#submitBtn").removeAttr('disabled');
			$("#feedbackModel").fadeOut(700);
		}else{
			$("#submitBtn").attr('disabled','disabled');
		}
	}
		
    _this.radioSubmitHandler = function(){
		
		
          
	 multiSelect.stopAudio();
	 
		_model.setTemplateStatus(true);
		
		$("#feedbackText").html("");
		//$("#popupHeading").html(jsonData.pageContent.popupHeading);
		checkArr = [];
			for(i=1;i<=radioInputLength;i++){
				if($("#radio_"+i+"").is(':checked'))
					checkArr.push($("#radio_"+i+"").val().substring(3));
			}

		if(checkArr ==  jsonData.pageContent.correctAnswer) {
		
			 if((jsonData.pageContent.transcript[0].audio != undefined) && (jsonData.pageContent.transcript[0].audio != "")){
				multiSelect.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[0].audio+"");
			} 
			
			//if((jsonData.pageContent.transcript[0].correct != undefined) && (jsonData.pageContent.transcript[0].correct != "")){
				//$("#audioTranscriptPopupContainer").html('').html(jsonData.pageContent.transcript[0].correct);
			//}
			
			$("#popupHeading").html(jsonData.pageContent.popupHeadingCorrect);
 			$("#feedbackText").html( jsonData.pageContent.feedback["correct"] );
			$("input[class='checkbox']").prop( "disabled", true );
			$("#multiChoice").css({'pointer-events': 'none', 'opacity': 0.5});
			correctAns++;
			//EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":1});
		} else {
			increment++;
			 $("#popupHeading").html(jsonData.pageContent.popupHeadingIncorrect);
			//EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":0});
			if(clickCount < 1){
			
				 if((jsonData.pageContent.transcript[1].audio != undefined) && (jsonData.pageContent.transcript[1].audio != "")){
					multiSelect.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[1].audio+"");
				} 
				
				//if((jsonData.pageContent.transcript[1].correct != undefined) && (jsonData.pageContent.transcript[1].correct != "")){
					//$("#audioTranscriptPopupContainer").html('').html(jsonData.pageContent.transcript[1].incorrect1);
				//}
				
 				$("#feedbackText").html( jsonData.pageContent.feedback["incorrect1"] );
				$("input[class='checkbox']").prop( "disabled", true );
				$("#feedbackModel .close").bind("click", _this.PopupHide);
			} else {
			
				 if((jsonData.pageContent.transcript[2].audio != undefined) && (jsonData.pageContent.transcript[2].audio != "")){
					multiSelect.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[2].audio+""); 
				} 

				//if((jsonData.pageContent.transcript[2].correct != undefined) && (jsonData.pageContent.transcript[2].correct != "")){			
					//$("#audioTranscriptPopupContainer").html('').html(jsonData.pageContent.transcript[2].incorrect2);
				//}
				
 				$("#feedbackText").html( jsonData.pageContent.feedback["incorrect2"] );
				$("input[type='checkbox']").prop( "disabled", true );
				$("#multiChoice").css({'pointer-events': 'none', 'opacity': 0.5});
			} 
		}
     
             $('#feedbackModel').modal('show');
           $("#submitBtn").attr('disabled','disabled');
			 clickCount++; 
			 
			   //application.playPauseFlag = true;
           // $("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
		
        }
		_this.PopupHide = function(){ 
			 multiSelect.stopAudio();
			 multiSelect.loadAudio(baseURL+"assets/media/audio/blank"); 
			if(correctAns == 1){
			//	$("input[type='checkbox']").removeAttr('checked');
			$("input[type='checkbox']").prop( "disabled", true );
			}
			else {
			if(increment == 1){
				$("input[type='checkbox']").removeAttr('checked');
			$("input[type='checkbox']").prop( "disabled", false );
			}
			else if(increment == 2){
				//$("input[type='checkbox']").removeAttr('checked');
			$("input[type='checkbox']").prop( "disabled", true );
			}
 			}
		}
 
 /* _this.playFunction = function(){

		if (application.playPauseFlag) {
            application.playPauseFlag = false;
            multiSelect.pauseAudio();
            $("#playPauseBtn img").attr('src', 'assets/images/play_button.png');
        } else {
            application.playPauseFlag = true;
            multiSelect.playAudio();
            $("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
        }
		
 } */
 
		_this.showHidepopUp = function(){
			 multiSelect.stopAudio();
			 multiSelect.loadAudio(baseURL+"assets/media/audio/blank"); 
 			trace(correctAns+" correctAns"+increment)
			if(correctAns == 1){
				//$("input[type='checkbox']").removeAttr('checked');
			$("input[type='checkbox']").prop( "disabled", true );
			}
			else {
			if(increment == 1){
				$("input[type='checkbox']").removeAttr('checked');
			$("input[type='checkbox']").prop( "disabled", false );
			}
			else if(increment == 2){
			//	$("input[type='checkbox']").removeAttr('checked');
			$("input[type='checkbox']").prop( "disabled", true );
			}
 			}
			
		}		
		
    }

