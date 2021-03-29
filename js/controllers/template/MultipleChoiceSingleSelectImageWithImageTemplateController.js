/**
 * Created by Ravi Sharma on 8/11/2016.
 */

var MultipleChoiceSingleSelectImageWithImageTemplateController = function(){

    var radioInputLength, radioClicked, radioInput, jsonData, baseURL;
    var clickCount = 0;
	var increment = 0;
	var correctAns = 0;
	//var application;
    var _this = this;

    this.init = function(data){
        trace(":: Multiple Choice Single Select Template Controller Loaded ::");
		baseURL = _model.getCourseDataObj().baseURL;
		//application = new ApplicationController();
		 singleSelect = new AudioManager();
		jsonData = data;
		/* $("#playPauseBtn").addClass("playPause");
		$(".playPause").bind("click", _this.playFunction); */
        _this.loadUI(data);
    }

    this.loadUI = function(){
        trace(":: Multiple Choice Single Select Template Load UI ::");

        $("#submitBtn").attr('disabled','disabled');
        $("#question").html(jsonData.pageContent.question);
		$("#headDiv").html(jsonData.pageContent.heading);
        radioInputLength = (jsonData.pageContent.options).length;
		
        radioInput = "";
        for(var i=0;i<radioInputLength;i++){
            radioInput += '<div class="radio"><input type="radio" class="radioColor" name="radioOption" id="' + (i + parseInt('1')) + '"/><label for="' + (i + parseInt('1')) + '"'+'> <img src='+_model.getCourseDataObj().baseURL+"assets/images/"+jsonData.pageContent.options[i]+".png"+' /> </label></div>';
        }
		//$(".radio").find('img').attr("src", _model.getCourseDataObj().baseURL + "assets/images/accordian_click.png");
		
		$('#singleChoice').html('');
        $('#singleChoice').html(radioInput);

		$("input[name='radioOption']").unbind("click").bind("click", _this.radioClickHandler);
		$("#submitBtn").unbind("click").bind("click", _this.radioSubmitHandler);
		$("#feedbackModel").on("hidden.bs.modal", _this.PopupHide);	 
			
		
    }

	this.clear = function(){

	}
	
	/*  _this.playFunction = function(){

		if (application.playPauseFlag) {
            application.playPauseFlag = false;
            singleSelect.pauseAudio();
            $("#playPauseBtn img").attr('src', 'assets/images/play_button.png');
        } else {
            application.playPauseFlag = true;
            singleSelect.playAudio();
            $("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
        }
		
	}
  */
 
	_this.radioClickHandler = function(){
				$("#submitBtn").fadeIn(700);
				 $("#feedbackModel").fadeOut(700);
				 $("#submitBtn").removeAttr('disabled');
		}
		
     _this.radioSubmitHandler = function(){
	 singleSelect.stopAudio();
	 
         _model.setTemplateStatus(true);

			radioClicked = $("input[type='radio']:checked").attr('id');
			//alert(radioClicked)
             $("#feedbackText").html("");
			 
            if(radioClicked == jsonData.pageContent.correctAnswer) {
			
			 if((jsonData.pageContent.transcript[0].audio != undefined) && (jsonData.pageContent.transcript[0].audio != "")){
				singleSelect.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[0].audio+"");
			} 
			
			//if((jsonData.pageContent.transcript[0].correct != undefined) && (jsonData.pageContent.transcript[0].correct != "")){
				//$("#audioTranscriptPopupContainer").html('').html(jsonData.pageContent.transcript[0].correct);
			//}
			
			
			
					$("#popupHeading").html(jsonData.pageContent.popupHeadingCorrect);
                 $("#feedbackText").html( jsonData.pageContent.feedback["correct"] );
                $("#singleChoice").css( "pointer-events", "none" );
				correctAns++;
				//EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":1});
            } else {
				 $("#popupHeading").html(jsonData.pageContent.popupHeadingIncorrect);
				//EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":0});
				increment++;
                if(clickCount < 1){
				
			 if((jsonData.pageContent.transcript[1].audio != undefined) && (jsonData.pageContent.transcript[1].audio != "")){
					singleSelect.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[1].audio+"");
				} 
				
				//if((jsonData.pageContent.transcript[1].correct != undefined) && (jsonData.pageContent.transcript[1].correct != "")){
					//$("#audioTranscriptPopupContainer").html('').html(jsonData.pageContent.transcript[1].incorrect1);
				//}
			
                     $("#feedbackText").html( jsonData.pageContent.feedback["incorrect1"] );
					$("#feedbackModel .close").bind("click", _this.showHidepopUp);
                } else {
				
			 	if((jsonData.pageContent.transcript[2].audio != undefined) && (jsonData.pageContent.transcript[2].audio != "")){
						singleSelect.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[2].audio+""); 
					} 
					
					//if((jsonData.pageContent.transcript[2].correct != undefined) && (jsonData.pageContent.transcript[2].correct != "")){			
						//$("#audioTranscriptPopupContainer").html('').html(jsonData.pageContent.transcript[2].incorrect2);
					//}
			
			
                     $("#feedbackText").html( jsonData.pageContent.feedback["incorrect2"] );
					$("#singleChoice").css( "pointer-events", "none" );
                }
            }
	
	   
           $('#feedbackModel').modal('show');
             $("#submitBtn").attr('disabled','disabled');
			clickCount++; 
			
			
			 
	//	$("#playPauseBtn img").attr('src', 'assets/images/pause_button.png'); 
		
        }
	_this.PopupHide = function(){ 
		 singleSelect.stopAudio();
		 singleSelect.loadAudio(baseURL+"assets/media/audio/blank"); 
			if(correctAns == 1){
				//$("input[type='radio']").removeAttr('checked');
			$("input[type='radio']").prop( "disabled", true );
			}
			else {
			if(increment == 1){
				$("input[type='radio']").removeAttr('checked');
			$("input[type='radio']").prop( "disabled", false );
			}
			else if(increment == 2){
				//$("input[type='radio']").removeAttr('checked');
			$("input[type='radio']").prop( "disabled", true );
			}
 			}
		}
	_this.showHidepopUp = function(){
			singleSelect.stopAudio();
			singleSelect.loadAudio(baseURL+"assets/media/audio/blank"); 
 			trace(correctAns+" correctAns"+increment)
			if(correctAns == 1){
				//$("input[type='radio']").removeAttr('checked');
			$("input[type='radio']").prop( "disabled", true );
			}
			else {
			if(increment == 1){
				$("input[type='radio']").removeAttr('checked');
			$("input[type='radio']").prop( "disabled", false );
			}
			else if(increment == 2){
				//$("input[type='radio']").removeAttr('checked');
			$("input[type='radio']").prop( "disabled", true );
			}
 			}
			
		}	
		
		
}