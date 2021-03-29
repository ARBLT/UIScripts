/**
 * Created by Karthik on 8/16/2016.
 */

var TrueandFalseTemplateController = function(){

    var radioInputLength, radioClicked, radioLooping, radioInput, jsonData, baseURL;
 
    var _this = this;

    this.init = function(data){
        trace(":: True and False Template Controller Loaded ::");
		jsonData = data;
        _this.loadUI(data);
		
    }
	this.clear = function(){
		
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
     /*     for(radioLooping=0;radioLooping<radioInputLength;radioLooping++){
            radioInput += '<div class="col-md-2 col-md-offset-4"><div class="input-group"><span class="input-group-addon"><div class="radio"><input type="radio" name="radioOption"  id="radio_' + (radioLooping + parseInt('1')) +   '"value="' + jsonData.pageContent.options[radioLooping]+   '"><label for="radio_' + (radioLooping + parseInt('1')) + '"></label></div></span><input type="text" class="form-control"  value="' + jsonData.pageContent.options[radioLooping] + '" readonly/></div></div>';
        } */
		
		  for(radioLooping=0;radioLooping<radioInputLength;radioLooping++){
            radioInput += '<div class="col-md-2 col-md-offset-4"><div class="input-group"><span class="input-group-addon"><div class="radio"><input type="radio" name="radioOption"  id="radio_' + (radioLooping + parseInt('1')) +   '"value="' + jsonData.pageContent.options[radioLooping]+   '"> <label for="radio_' + (radioLooping + parseInt('1')) + '"></label></div></span><input type="text" onfocus="this.blur()"; class="form-control noselect"  value="' + jsonData.pageContent.options[radioLooping] + '" readonly/></div></div>';
        }
 
 		$('#TrueandFalse').html('');
        $('#TrueandFalse').html(radioInput);
		$("#TrueandFalse").children("div").eq(1).removeClass("col-md-offset-4");
		/* $("input[type='radio']").unbind("click").bind("click", _this.radioClickHandler); */
		$(".input-group").unbind("click").bind("click", _this.radioClickHandler);
		$("input[type='text']").css("cursor","pointer")
		$("input[type='text']").unbind("click").bind("click", _this.radioClickHandler1);
		$("#submitBtn").unbind("click").bind("click", _this.radioSubmitHandler);
		$("#feedbackModel").on("hidden.bs.modal", _this.PopupHide);	 
	} 
		_this.radioClickHandler = function (){
				$("#submitBtn").fadeIn(700);
				$("#feedbackModel").fadeOut(700);
				$("#submitBtn").removeAttr('disabled');
 		}
		_this.radioClickHandler1 = function (){
		if($(this).val() == "True"){
			$("#radio_1").prop("checked",true)
		}

		 if($(this).val() == "False"){
			$("#radio_2").prop("checked",true)
		}
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
					EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":1});
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
					EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":0});
            }

           _model.setTemplateStatus(true);
           EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		   $(".input-group").unbind("click");
		   $("input[type='text']").css("cursor","default")
            $('#feedbackModel').modal('show');
           $("#submitBtn").prop('disabled','disabled');
         }	
		_this.PopupHide = function(){ 
		 singleSelect.stopAudio();
		 singleSelect.loadAudio(baseURL+"assets/media/audio/blank"); 
			 $("input[type='radio']").prop( "disabled", true );
			 $("input[type='text']").prop( "disabled", true );
			 $("input[type='text']").css("cursor","default")
 			  $("#submitBtn").prop( "disabled", true );
			  $(".input-group").unbind("click");
 		}
	_this.showHidepopUp = function(){
			singleSelect.stopAudio();
			singleSelect.loadAudio(baseURL+"assets/media/audio/blank"); 
 			trace(correctAns+" correctAns"+increment)
			$("input[type='radio']").prop( "disabled", true );
			$("input[type='text']").css("cursor","default")
			 $("input[type='text']").prop( "disabled", true );
 			  $("#submitBtn").prop( "disabled", true );
			  $(".input-group").unbind("click");
			
		}	
}