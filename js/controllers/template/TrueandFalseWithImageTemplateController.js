/**
 * Created by Karthik on 8/16/2016.
 */

var TrueandFalseWithImageTemplateController = function(){

    var radioInputLength, radioClicked, radioLooping, radioInput, jsonData, baseURL;
 
    var _this = this;

    this.init = function(data){
        trace(":: True and False Template Controller Loaded ::");
		jsonData = data;
        _this.loadUI(data);
		
    }

    this.loadUI = function(data){
        trace(":: True and False Template Load UI ::");
baseURL = _model.getCourseDataObj().baseURL;
singleSelect = new AudioManager();
         $("#submitBtn").attr('disabled','disabled');
        $("#question").html(jsonData.pageContent.question);
		$("#headDiv").html(jsonData.pageContent.heading);
        radioInputLength = (jsonData.pageContent.options).length;
		
        radioInput = "";
         for(radioLooping=0;radioLooping<radioInputLength;radioLooping++){
            radioInput += '<div class="col-md-2 col-md-offset-4"><div class="input-group"><span class="input-group-addon"><div class="radio"><input type="radio" name="radioOption"  id="radio_' + (radioLooping + parseInt('1')) +   '"value="' + jsonData.pageContent.options[radioLooping]+   '"><label for="radio_' + (radioLooping + parseInt('1')) + '"></label></div></span><input type="text" class="form-control"  value="' + jsonData.pageContent.options[radioLooping] + '" readonly/></div></div>';
        }
 
 		$('#TrueandFalse').html('');
        $('#TrueandFalse').html(radioInput);
		$("#TrueandFalse").children("div").eq(1).removeClass("col-md-offset-4");
		$("input[type='radio']").unbind("click").bind("click", _this.radioClickHandler);
		$("#submitBtn").unbind("click").bind("click", _this.radioSubmitHandler);
		$("#feedbackModel").on("hidden.bs.modal", _this.PopupHide);	 
	} 
	
	this.clear = function(){

	}
	
		_this.radioClickHandler = function (){
				$("#submitBtn").fadeIn(700);
				$("#feedbackModel").fadeOut(700);
				$("#submitBtn").removeAttr('disabled');
		}
		
       _this.radioSubmitHandler = function (){ 
			radioClicked = $("input[type='radio']:checked").val();
             $("#feedbackText").html("");
			 console.log(radioClicked+" <<<radioClicked")
			//$("#popupHeading").html(jsonData.pageContent.popupHeading);
            if(radioClicked == jsonData.pageContent.correctAnswer) {
				if((jsonData.pageContent.transcript[0].audio != undefined) && (jsonData.pageContent.transcript[0].audio != "")){
				singleSelect.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[0].audio+"");
			} 
				 $("#popupHeading").html(jsonData.pageContent.popupHeadingCorrect);
                 $("#feedbackText").html( jsonData.pageContent.feedback["correct"] );
                $("input[type='radio']").prop( "disabled", true );
             } else {
				 if((jsonData.pageContent.transcript[1].audio != undefined) && (jsonData.pageContent.transcript[1].audio != "")){
					singleSelect.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[1].audio+"");
				} 
				 $("#popupHeading").html(jsonData.pageContent.popupHeadingIncorrect);
 				  $("#feedbackText").html( jsonData.pageContent.feedback["incorrect1"] );
                    $("input[type='radio']:checked").prop( "disabled", true );
					$("input[type='radio']").prop( "disabled", true );
					$("label").css( "cursor", "none" );
					$("#feedbackModel .close").bind("click", _this.showHidepopUp);
            }

           _model.setTemplateStatus(true);
           EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);

            $('#feedbackModel').modal('show');
           $("#submitBtn").attr('disabled','disabled');
         }	
		_this.PopupHide = function(){ 
		 singleSelect.stopAudio();
		 singleSelect.loadAudio(baseURL+"assets/media/audio/blank"); 
			 $("input[type='radio']").prop( "disabled", true );
 			 
		}
	_this.showHidepopUp = function(){
			singleSelect.stopAudio();
			singleSelect.loadAudio(baseURL+"assets/media/audio/blank"); 
 			trace(correctAns+" correctAns"+increment)
			$("input[type='radio']").prop( "disabled", true );
			 
 			 
			
		}	
}