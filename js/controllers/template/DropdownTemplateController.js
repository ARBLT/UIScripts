/**
 * Created by Venkatesh on 21/02/2017.
 */
var DropdownTemplateController = function(currentRef){
	
	var _this = this;
	var currentData;
	var	tableClassName;
	var headerLoop = 0;
	var tableLoop;
	var contents;
	var tabletd;
	var rowSpan;
	var appCntl = currentRef;
	
	var selecteRowCount = 0;
	var tableOptions;
	var selectContent;
	var tableColumnCount;
	var tableColumnBreak;
	var tableColumnBreakCount;

	var allFieldsFilled = false;
	var userAnswersArray = [];
	var ansValidated = false;

	var singleSelect = new AudioManager();
	var attemptCount = 0;

    this.init = function(data){
		trace(":: Dropdown Template Controller Loaded ::");
		baseURL = _model.getCourseDataObj().baseURL;
		_this.loadUI(data);
		$("#submitBtn").on('click', function(){
			_this.validateAnswer(data)
		})
    }

    this.loadUI = function(data){	
		$("#feedbackModel").on("hidden.bs.modal", _this.PopupHide);
				
		trace(":: Click and Reveal Accordion Template Load UI ::");
		trace(data);
		
		$("#heading").html(data.pageContent.heading);
		$("#content").html(data.pageContent.content);

		selectRowData = data.pageContent.tableRows;
		selecteRowCount = data.pageContent.tableRows.length;
		
		tableOptions = data.pageContent.tableOptions;

		tableColumnCount = data.pageContent.tableColumnCount;
		tableColumnBreak = data.pageContent.tableColumnBreak;
		tableColumnBreakCount = data.pageContent.tableColumnBreakCount;

		selectContent = "<select class='selectClass'>"
		tableOptions.forEach(function(item, index) {

			selectContent += "<option value='"+ item.key +"'>"+ item.value+"</option>"
			
		});
		selectContent += "</select>";

		if((data.pageContent.tableClass != undefined) && (data.pageContent.tableClass != "")){
			tableClassName = 'class="'+data.pageContent.tableClass+'"';
		} else {
			tableClassName = "";
		}

		contents = "<table "+tableClassName+">";

		contents += "<thead>";
	
		for(var i = 1; i <= tableColumnCount;){

			if(i == tableColumnBreak){
				contents += "<th colspan='"+ tableColumnBreakCount +"'>"+ data.pageContent.subHeader["table_"+i] +"</th>";
				i += tableColumnBreakCount;
			}else{
				contents += "<th>"+ data.pageContent.subHeader["table_"+i] +"</th>";
				i++;
			}
		}				
					
		contents += "</thead>";

		selectRowData.forEach(function(item, index){
			contents += "<tr class='selecttr selectTr-"+item.id+"'>";
				for(var j = 0; j < tableColumnCount; j++){
					if(j == 0){
						contents += "<td class='stableTd'>"+item.id+"</td>"
					}else if(j == 1){
						contents += "<td class='stableTd'>"+selectContent+"</td>"
					}else{
						contents += "<td></td>"
					}
					
				}
			contents += "<tr class='selectTr-"+item.id+"'>";
		});

		contents += "</table>";

		$("#contenttable").html(contents);

		$(".selectClass").on("change", function(){
			var that = $(this);
			var selectedValue = that.val();
			tableOptions.forEach(function(item, index) {
			 if(item.key == selectedValue){
				 var selectdItem = item;
				that.parents('.selecttr').children().each(function(index) {
					var innerThat = $(this);
					if(index > 1){
						switch (index) {
							case 2 : 
							innerThat.html(selectdItem.methodOfCheck);
							break;
							case 3 :
							innerThat.html(selectdItem.extentOfCheck);
							break;
							case 4 :
							innerThat.html(selectdItem.refStandard);
							break;
							case 5 :
							innerThat.html(selectdItem.acceptanceNorms);
							break;
							case 6 :
							innerThat.html(selectdItem.formatOfRecord);
							break;
							case 7 :
							innerThat.html(selectdItem.agency[0]);
							break;
							case 8 :
							innerThat.html(selectdItem.agency[1]);
							break;
							case 9 :
							innerThat.html(selectdItem.agency[2]);
							break;
							case 10 :
							innerThat.html(selectdItem.remarks);
							break;
						}
					}
				});
			 }
				
			});

			// submit button enable check

			$(".selectClass").each(function(){
				if($(this).val() != 0){
					allFieldsFilled = true;
				}else{
					allFieldsFilled = false;
					return;
				}
				
			});

			if(allFieldsFilled){
				$("#submitBtn")[0].disabled = false;
			}else{
				$("#submitBtn")[0].disabled = true;
			}
			
		})

		
	}
	
	_this.validateAnswer = function(data){
		singleSelect.stopAudio();
		$(".selectClass").each(function(){
			userAnswersArray.push(Number($(this).val()));
		});

		console.log('user answer ---'+userAnswersArray);

		for(var i = 0; i < data.pageContent.correctAnswersKey.length; i++){
			console.log(data.pageContent.correctAnswersKey[i])
			var ansCheck =  userAnswersArray.indexOf(data.pageContent.correctAnswersKey[i]);
			if(ansCheck != -1){
				ansValidated = true;
			}else{
				ansValidated = false;
				break;
			}
			console.log(ansValidated)
		}


		if(ansValidated){
			if((data.pageContent.correctaudio != undefined) && (data.pageContent.correctaudio != "")){
				singleSelect.loadAudio(baseURL+"assets/media/audio/"+data.pageContent.correctaudio+"");
			}
			$("#popupHeading").html(data.pageContent.popupHeadingCorrect);
			$("#feedbackText").html( data.pageContent.feedback["correct"] );
			
		}else{
			if(attemptCount == 0) {
				if((data.pageContent.incorrectaudio1 != undefined) && (data.pageContent.incorrectaudio1 != "")){
					singleSelect.loadAudio(baseURL+"assets/media/audio/"+data.pageContent.incorrectaudio1+"");
				}
				$("#popupHeading").html(data.pageContent.popupHeadingInCorrect);
				$("#feedbackText").html( data.pageContent.feedback["incorrect1"] );
				attemptCount++;
				
			}else{
				if((data.pageContent.incorrectaudio2 != undefined) && (data.pageContent.incorrectaudio2 != "")){
					singleSelect.loadAudio(baseURL+"assets/media/audio/"+data.pageContent.incorrectaudio2+"");
				}
				$("#popupHeading").html(data.pageContent.popupHeadingInCorrect);
				$("#feedbackText").html( data.pageContent.feedback["incorrect2"] );
				ansValidated = true;
			}
		} 
		$('#feedbackModel').modal('show');
	}
	
	this.clear = function(){

	}
	_this.PopupHide = function(){ 
			if(ansValidated){
				console.log('ssss');
				$(".selectClass").attr("disabled","disabled")
				$("#submitBtn")[0].disabled = true;
			}else{
				$(".selectClass").each(function(){
					$(this).val("0");
				});
				$("#submitBtn")[0].disabled = true;

				$('.selecttr').children().each(function(){
					if(!$(this).hasClass('stableTd')){
						$(this).html("")
					}
				})
			}
		
 		}
	_this.PopupImageHandler = function(e){
		
	} 
}