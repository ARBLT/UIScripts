
var _model = DataManager.getInstance();

var _languageData = [];

var _languageChangeAppControllerObj = {};
var code;

var timeIntervalforNetworkConnection;
var audioErrorHandler;
var timeIntervalforNetworkConnectionAudio;

$(document).ready(function(){

	document.addEventListener('keydown', logKey);

	function logKey(e)
	{
		code = e.keyCode;
		if(code == 123)
		{
			// e.preventDefault();
		}
	}

	$('[data-toggle="tooltip"]').tooltip();
	
    StaticLibrary.HIDE_PRE_LOADER();
	
	trace(":: Framework Loading Started ::");
	callLanguageData();


		checkAllRequirements();
		$("#requirementContainer").show();
		$("#courseLink").on('click',function(){
			
			$("#requirementContainer").hide();
			$("#language_selector_screen").show();
			
		});	

	
	$(".internalLanguageBtn").click(function() {
 // alert( "Handler for .click() called."+$(this).attr("urlToLoad"));
  StaticLibrary.APP_DATA_URL = $(this).attr("urlToLoad");
  
   var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadAppConfigData(StaticLibrary.APP_DATA_URL, "true", StaticLibrary.DATA_TYPE, null, loadChangeLanguageDataSuccessHandler); 
			
			/* var appControllerObj = new ApplicationController();
			appControllerObj.internalLanguageSelected(); */
			
}); 

    //setup the jPlayer plugin and only on the ready of the plugin the Framework will start the calls.
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: "assets/media/audio/blank.mp3",
                ogg: "assets/media/audio/blank.ogg"
            });

            _model.setAudioReference($(this));

            trace(":: Audio Loading for first Time completed ::");
            trace(":: Loading of Application Configuration Started ::");
          /* commented by rk   var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadAppConfigData(StaticLibrary.APP_DATA_URL, "true", StaticLibrary.DATA_TYPE, null, loadAppDataSuccessHandler); */
        },
        ended:function(){
            trace(":: Audio Loading Completed from the shell, event triggered ::");
			_model.setAudioStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
			// console.log('sss')

        },
        timeupdate:function(event){
			
            if(((event.jPlayer.status.currentTime >= 0.10) && (_model.getPreloaderFlag()))){
				
                StaticLibrary.HIDE_PRE_LOADER();
            }

            //trace("Audio Current Time : " + event.jPlayer.status.currentTime);
            //trace("Audio Total Duration : " + event.jPlayer.status.duration);
		},
		error: function(event){
			// StaticLibrary.HIDE_PRE_LOADER();
			if(event.jPlayer.error.type == "e_url"){
				audioErrorHandler(event)
			}
			// _model.setAudioStatus(true);
			// EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}
	});

	trackNetworkForAudio = function(event){
		
		if(navigator.onLine){
            $("#network-status").hide();

			var audioManager = new AudioManager();
			var audioSrc = event.jPlayer.status.src;
			var courseIndex = audioSrc.indexOf("/courses/");
			audioSrc = audioSrc.substr(courseIndex+1)
			audioSrc = audioSrc.substring(0, audioSrc.length-4)

			audioManager.loadAudio(audioSrc);
            clearInterval(timeIntervalforNetworkConnectionAudio);
        }
	}
	
	audioErrorHandler = function(event) {
       		$("#network-status").show();
            timeIntervalforNetworkConnectionAudio = setInterval(function(){
				trackNetworkForAudio(event)
			}, 1000);
       
    }
	
	//Popup audio player
	$("#jquery_jplayer_2").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: "assets/media/audio/blank.mp3",
                ogg: "assets/media/audio/blank.ogg"
            });

            _model.setPopupAudioReference($(this));
        },
        ended:function(){
           
        },
        timeupdate:function(event){
			
            if( ((event.jPlayer.status.currentTime >= 0.10) && (_model.getPreloaderFlag())) ){
                StaticLibrary.HIDE_PRE_LOADER();
            }

            //trace("Audio Current Time : " + event.jPlayer.status.currentTime);
            //trace("Audio Total Duration : " + event.jPlayer.status.duration);
        },
		error: function(event){
			StaticLibrary.HIDE_PRE_LOADER();
			console.log(event)
			// _model.setAudioStatus(true);
			// EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}
    });
	
});


function loadChangeLanguageDataSuccessHandler(data){
    trace(":: Loading of Application Configuration Completed ::");
    DataParser.parseAppData(data);
    trace(":: Data Parsing for Application Configuration Completed ::");

    trace(":: Loading of Course Configuration Started ::");
//alert(_model.getAppDataObj().courseName);
    var courseDataURL = "courses/" + _model.getAppDataObj().courseName + "/assets/data/courseData.json?version=" + StaticLibrary.generateRandom();
	
	//alert(courseDataURL);
	
	if($('#menuBoxContainer').width() == 800){
		$(".menu_screen").css("height", "1059px")
 } 
	/* if(_model.getAppDataObj().courseName == "module2" || _model.getAppDataObj().courseName == "module3"){
	$("#menuBoxContainer > .container").css("overflow", "initial"); 	
	
	}
	if(_model.getAppDataObj().courseName == "module3"){
		$(".header_part_middle > h4").css("font-size", "15px");
	}	
	if(_model.getAppDataObj().courseName == "module5"){
		$(".header_part_middle > h4").css("font-size", "16px");
	} */
    var apiServiceLoadCourseData = new APIService();
    apiServiceLoadCourseData.loadCourseData(courseDataURL, "true", StaticLibrary.DATA_TYPE, null, loadChangeLanguageCourseDataSuccessHandler);
}

function loadChangeLanguageCourseDataSuccessHandler(data){
	
    trace(":: Loading of Course Configuration Completed ::");
    DataParser.parseCourseData(data);	
	trace(":: Data Parsing for Course Config Completed ::");

    trace("------------------------------------------");
    trace(_model.getAppDataObj());
    trace("------------------------------------------");
    trace(_model.getCourseDataObj());
	
	trace( _model.getAppDataObj().scorm );
	
	/* if(_model.getAppDataObj().scorm == "scorm"){
		var scormAPIObj = new scormAPI();
		_model.setScormReference(scormAPIObj);	
	} */
	
    $("#projectHeading").html(_model.getLinearTOCDataArr().unitTitle);
    $("#courseTitleTxt").html(_model.getCourseDataObj().title);
    $("#durationTxt, #moduleDuration").html("Duration: <b>" + _model.getCourseDataObj().duration + "</b>");
    $("#innerHeading").html(_model.getCourseDataObj().projectTitle);
    $("#innerText").html(_model.getCourseDataObj().title);
    $("#desktopHelpImage").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _model.getCourseDataObj().desktopHelp);
	$(".mobile_type").attr("src", _model.getCourseDataObj().baseURL + "assets/images/Help-Mobile-content.PNG");
	
	 $("#gridSystemModalLabel").html(_model.getCourseDataObj().courseMenuTitleText);
	  $("#pageJump label").html(_model.getCourseDataObj().goToPageLabelText);	 
	  $("#jumpToBtn").html(_model.getCourseDataObj().goBtnText);
	

    trace("Header Height : " + $("#header").height());
    trace("Footer Height : " + $("#footer").height());

	var courseTitle = _model.getCourseDataObj().title.split(':');
		$("#courseTitleText").html('L&T Edutech');
		//$('title').html(_model.getCourseDataObj().projectTitle);
	
   /*  if(_model.getAppDataObj().scorm == "scorm"){
		////var scormAPIObj = new scormAPI();
		////_model.setScormReference(scormAPIObj);
		$("#requirementContainer").show();
		$("#innerContainer").hide();
		$("#landingPage").hide();
		checkAllRequirements();
		var courseTitle = _model.getCourseDataObj().title.split(':');
		$("#courseTitleText").html('L&T Edutech');
		$("#courseLink").on('click',function(){
			$("#requirementContainer").hide();
			$("#innerContainer").show();
			$('title').html(_model.getCourseDataObj().projectTitle);
			var appControllerObj = new ApplicationController();
			appControllerObj.init();
		});
	}
	
	else{ */
		$("#requirementContainer").hide();
		$('title').html(_model.getCourseDataObj().projectTitle);
		
		//alert(JSON.stringify(_model.getCourseDataObj()))
		
		//var appControllerObj = new ApplicationController();
		
		////alert("appControllerObj currentRef.currentIndex : " + _languageChangeAppControllerObj.currentRef.currentIndex);
	//appControllerObj.init();
	_languageChangeAppControllerObj.internalLanguageSelected(); 
	$("#requirementContainer").hide();
			$("#innerContainer").show();

	//}
}



function callLanguageData()
{

	var languageUrl="assets/data/languages.json";
	var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadFromExternalSource(languageUrl, "true", StaticLibrary.DATA_TYPE, this.languageDataErrorHandler, this.languageDataLoadHandler);
}

function trackNetworkForLanguageJson() {
	if(navigator.onLine){
		$("#network-status").hide();
		var languageUrl="assets/data/languages.json";
	var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadFromExternalSource(languageUrl, "true", StaticLibrary.DATA_TYPE, this.languageDataErrorHandler, this.languageDataLoadHandler);
		clearInterval(timeIntervalforNetworkConnection);
	}
}

function languageDataErrorHandler(jqXHR, exception) {
	if(jqXHR.status == 0){
		$("#network-status").show();
		timeIntervalforNetworkConnection = setInterval(trackNetworkForLanguageJson, 1000);
	}
}

function languageDataLoadHandler(data)
{

	_languageData=data;
	
	$("#languageSelectionPopupContainer").append("<option value='0'>Select Language</option>");	
	

  for(var i=0;i<_languageData.length;i++)
		{
		//$("#language_selector_screen").append('<div id="Language_Btn_'+_languageData[i].language+'" urlToLoad="'+_languageData[i].urlToLoad +'"class="languageBtns">'+ _languageData[i].ButtonTextEnglish +'<br/>'+_languageData[i].ButtonTextinLanguage+'</div>');
		
		if(i<=3)
		{
		$(".btn_section_one ul").append("<li><div class='english_btn pad_"+(i+1)+" "+ _languageData[i].BtnClass +"' data-id='Language_Btn_0"+(i+1)+"' id='Language_Btn_0"+(i+1)+"' urlToLoad='"+_languageData[i].urlToLoad+"'><span>"+_languageData[i].ButtonTextinLanguage+"</span></div></li>");
		}
		else{
			$(".btn_section_two ul").append("<li><div class='english_btn pad_"+(i+1)+" "+ _languageData[i].BtnClass +"' data-id='Language_Btn_0"+(i+1)+"' id='Language_Btn_0"+(i+1)+"' urlToLoad='"+_languageData[i].urlToLoad+"'><span>"+_languageData[i].ButtonTextinLanguage+" </span></div></li>");
			
		}
		// console.log("Document loaded" + JSON.stringify($("#languageDivforSelect")));
		//alert(_languageData.length);
		//$("#languageSelectionPopupContainer").hide();
		
		//$('#Language_Btn_03').hide();
		//$('#Language_Btn_04').hide();
		////$(".custom-select select").show();
		
$("#languageSelectionPopupContainer").append($("<option />").val(_languageData[i].urlToLoad).text(_languageData[i].ButtonTextinLanguage + " " + _languageData[i].ButtonTextEnglish));	
	//alert(_languageData[i].language);
		}
	
/* 	$('#languageSelectionPopupContainer').on('change', function() {
  //alert( this.value );
  
  StaticLibrary.APP_DATA_URL = this.value;
  //alert( "Handler for .click() called."+$(this).attr("urlToLoad"));
  
  var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadAppConfigData(StaticLibrary.APP_DATA_URL, "true", StaticLibrary.DATA_TYPE, null, loadChangeLanguageDataSuccessHandler); 
			
			
			$("#language_selector_screen").hide();
}); */
	
    
	$(".clickableLanguageBtn").click(function() {
		$("#m1_wrapper_overlay").show();
		//alert($(this).attr("data-id"))		
		var languageChange = $(this).attr("data-id");
		StaticLibrary.APP_DATA_URL = $(this).attr("urlToLoad");
	  //alert( "Handler for .click() called."+$(this).attr("urlToLoad"));
	  if(languageChange == "Language_Btn_01"){
		  $('#glossaryText').html('Glossary');
		  $('#gridSystemModalLabel').html('Course Menu');
		  $('.myModalLabelAudioText').html('Audio Transcript');
		  $('#clickNxtContinue').html('<p>Click <b>Next</b> to continue.</P>');
		  $('#homeMenuBtn').attr('data-original-title', 'Home');
		  $('#courseMenuBtn').attr('data-original-title', 'Course Menu');
		  $('.glossaryBtnTooltip').attr('data-original-title', 'Glossary');
		  $('.helpBtnTooltip').attr('data-original-title', 'Help');
		  $('#languageSelectBtnTooltip').attr('data-original-title', 'Language Selection');
		  $('#transcriptBtnTooltip').attr('data-original-title', 'Audio Transcript');
		  $('#audioMuteBtnTooltip').attr('data-original-title', 'Mute/Unmute');
		  $('#playPauseBtnTooltip').attr('data-original-title', 'Play/Pause');
		  $('#replyBtnTooltip').attr('data-original-title', 'Replay');
		  $('#switchLanguageText').html('Switch Language');
		  $('#helptext').html("Help");
		
		  $("#courseMenuBtn").find("span").html("Course Menu");
		  $("#glossaryBtn").find("span").html("Glossary");
		  $("#homeMenuBtn").find("span").html("Restart Module");
		  $("#switchLanguageBtn").find("span").html("Switch Language");
		  $("#helpBtn").find("span").html("Help");

	  }else{
		  $('#glossaryText').html('शब्दावली');
		  $('#gridSystemModalLabel').html('कोर्स मेनू');
		  $('.myModalLabelAudioText').html('ऑडियो ट्रांसक्रिप्ट');
		  $('#clickNxtContinue').html('<p>जारी रखने के लिए, <b>नेक्स्ट </b> पर क्लिक करें।</P>');
		  $('#homeMenuBtn').attr('data-original-title', 'घर'); 
		  $('#courseMenuBtn').attr('data-original-title', 'कोर्स मेनू');
		  $('.glossaryBtnTooltip').attr('data-original-title', 'शब्दकोष');
		  $('.helpBtnTooltip').attr('data-original-title', 'मदद');
		  $('#languageSelectBtnTooltip').attr('data-original-title', 'भाषा चयन');
		  $('#transcriptBtnTooltip').attr('data-original-title', 'ऑडियो ट्रांसक्रिप्ट');
		  $('#audioMuteBtnTooltip').attr('data-original-title', 'म्यूट/अनम्यूट');
		  $('#playPauseBtnTooltip').attr('data-original-title', 'प्ले/पॉज');
		  $('#replyBtnTooltip').attr('data-original-title', 'रीप्ले');
		  $("#nextBtn span").html("नेक्स्ट");
		  $("#previousBtn span").html("प्रीवियस");
		  $(".jumpToCSS label").html("पेज संख्या पर जाएं:");
		  $("#jumpToBtn").html("जाएं");
		  $('#switchLanguageText').html('स्विच लैंग्वेजेस');
		  $('#helptext').html("मदद");

		  $("#courseMenuBtn").find("span").html("कोर्स मेनू");
		  $("#glossaryBtn").find("span").html("शब्दकोष");
		  $("#homeMenuBtn").find("span").html("रीस्टार्ट मॉडयूल");
		  $("#switchLanguageBtn").find("span").html("स्विच लैंग्वेजेस");
		  $("#helpBtn").find("span").html("मदद");

	  }
   			var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadAppConfigData(StaticLibrary.APP_DATA_URL, "true", StaticLibrary.DATA_TYPE, loadAppDataErrorErrorHandler, loadAppDataSuccessHandler);
			$("#language_selector_screen").hide();
});
	
	
	selectBoxUI();
	
}
 
function selectBoxUI()
{

var x, i, j, l, ll, selElmnt, a, b, c;
         /*look for any elements with the class "custom-select":*/
         x = document.getElementsByClassName("custom-select");
         l = x.length;
         for (i = 0; i < l; i++) {
           selElmnt = x[i].getElementsByTagName("select")[0];
           ll = selElmnt.length;
           /*for each element, create a new DIV that will act as the selected item:*/
           a = document.createElement("DIV");
           a.setAttribute("class", "select-selected");
		   a.setAttribute("urlToLoad", selElmnt.options[selElmnt.selectedIndex].value);
		   
           a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
           x[i].appendChild(a);
           /*for each element, create a new DIV that will contain the option list:*/
           b = document.createElement("DIV");
		 //  b.setAttribute("urlToLoad", selElmnt.options[j].value);
		   
           b.setAttribute("class", "select-items select-hide");
           for (j = 1; j < ll; j++) {
             /*for each option in the original select element,
             create a new DIV that will act as an option item:*/
             c = document.createElement("DIV");
             c.innerHTML = selElmnt.options[j].innerHTML;
			 
			 c.setAttribute("urlToLoad", selElmnt.options[j].value);
			 
             c.addEventListener("click", function(e) {
				 // alert("selected : " + $(this).attr("urlToLoad"));
				  ShowOtherLanguageScreen($(this).attr("urlToLoad"));
                 /*when an item is clicked, update the original select box,
                 and the selected item:*/
                 var y, i, k, s, h, sl, yl;
                 s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                 sl = s.length;
                 h = this.parentNode.previousSibling;
                 for (i = 0; i < sl; i++) {
                   if (s.options[i].innerHTML == this.innerHTML) {
                     s.selectedIndex = i;
                     h.innerHTML = this.innerHTML;
                     y = this.parentNode.getElementsByClassName("same-as-selected");
                     yl = y.length;
                     for (k = 0; k < yl; k++) {
                       y[k].removeAttribute("class");
                     }
                     this.setAttribute("class", "same-as-selected");
                     break;
                   }
                 }
                 h.click();
             });
             b.appendChild(c);
           }
           x[i].appendChild(b);
           a.addEventListener("click", function(e) {
			   
			 
               /*when the select box is clicked, close any other select boxes,
               and open/close the current select box:*/
               e.stopPropagation();
               closeAllSelect(this);
               this.nextSibling.classList.toggle("select-hide");
               this.classList.toggle("select-arrow-active");
             });
         }

}	

function ShowOtherLanguageScreen(urlToLoad)
{
	StaticLibrary.APP_DATA_URL = urlToLoad;
  //alert( "Handler for .click() called."+$(this).attr("urlToLoad"));
  
  var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadAppConfigData(StaticLibrary.APP_DATA_URL, "true", StaticLibrary.DATA_TYPE, null, loadChangeLanguageDataSuccessHandler); 
			
			
			$("#language_selector_screen").hide();
	
}

 
function loadAppDataSuccessHandler(data){
	
    trace(":: Loading of Application Configuration Completed ::");
    DataParser.parseAppData(data);
    trace(":: Data Parsing for Application Configuration Completed ::");

    trace(":: Loading of Course Configuration Started ::");
//alert(_model.getAppDataObj().courseName);
    var courseDataURL = "courses/" + _model.getAppDataObj().courseName + "/assets/data/courseData.json?version=" + StaticLibrary.generateRandom();
	
	//alert(courseDataURL);
	
	if($('#menuBoxContainer').width() == 800){
		$(".menu_screen").css("height", "1059px")
 } 
	/* if(_model.getAppDataObj().courseName == "module2" || _model.getAppDataObj().courseName == "module3"){
	$("#menuBoxContainer > .container").css("overflow", "initial"); 	
	
	}
	if(_model.getAppDataObj().courseName == "module3"){
		$(".header_part_middle > h4").css("font-size", "15px");
	}	
	if(_model.getAppDataObj().courseName == "module5"){
		$(".header_part_middle > h4").css("font-size", "16px");
	} */
    var apiServiceLoadCourseData = new APIService();
    apiServiceLoadCourseData.loadCourseData(courseDataURL, "true", StaticLibrary.DATA_TYPE, loadCourseDataErrorHandler, loadCourseDataSuccessHandler);
}

function trackNetwork(){
	if(navigator.onLine){
		$("#network-status").hide();
		var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadAppConfigData(StaticLibrary.APP_DATA_URL, "true", StaticLibrary.DATA_TYPE, loadAppDataErrorErrorHandler, loadAppDataSuccessHandler);
			$("#language_selector_screen").hide();
		clearInterval(timeIntervalforNetworkConnection);
	}
}

function trackNetworkForCourseData(){
	if(navigator.onLine){
		$("#network-status").hide();
		var courseDataURL = "courses/" + _model.getAppDataObj().courseName + "/assets/data/courseData.json?version=" + StaticLibrary.generateRandom();
		var apiServiceLoadCourseData = new APIService();
    	apiServiceLoadCourseData.loadCourseData(courseDataURL, "true", StaticLibrary.DATA_TYPE, loadCourseDataErrorHandler, loadCourseDataSuccessHandler);
		clearInterval(timeIntervalforNetworkConnection);
	}
}

function loadAppDataErrorErrorHandler(jqXHR, exception){
	if(jqXHR.status == 0){
		$("#network-status").show();
		timeIntervalforNetworkConnection = setInterval(trackNetwork, 1000);
	}
	
}

function loadCourseDataErrorHandler(jqXHR, exception){
	if(jqXHR.status == 0){
		$("#network-status").show();
		timeIntervalforNetworkConnection = setInterval(trackNetworkForCourseData, 1000);
	}
}

function loadCourseDataSuccessHandler(data){

    trace(":: Loading of Course Configuration Completed ::");
    DataParser.parseCourseData(data);	
	trace(":: Data Parsing for Course Config Completed ::");

    trace("------------------------------------------");
    trace(_model.getAppDataObj());
    trace("------------------------------------------");
    trace(_model.getCourseDataObj());
	
	trace( _model.getAppDataObj().scorm );
	
	if(_model.getAppDataObj().scorm == "scorm"){
		var scormAPIObj = new scormAPI();
		_model.setScormReference(scormAPIObj);	
	}
	
    $("#projectHeading").html(_model.getLinearTOCDataArr().unitTitle);
    $("#courseTitleTxt").html(_model.getCourseDataObj().title);
    $("#durationTxt, #moduleDuration").html("Duration: <b>" + _model.getCourseDataObj().duration + "</b>");
    $("#innerHeading").html(_model.getCourseDataObj().projectTitle);
    $("#innerText").html(_model.getCourseDataObj().title);
    $("#desktopHelpImage").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _model.getCourseDataObj().desktopHelp);
	$(".mobile_type").attr("src", _model.getCourseDataObj().baseURL + "assets/images/Help-Mobile-content.PNG");

 $("#gridSystemModalLabel").html(_model.getCourseDataObj().courseMenuTitleText);
	  $("#pageJump label").html(_model.getCourseDataObj().goToPageLabelText);	 
	  $("#jumpToBtn").html(_model.getCourseDataObj().goBtnText);


    trace("Header Height : " + $("#header").height());
    trace("Footer Height : " + $("#footer").height());

    if(_model.getAppDataObj().scorm == "scorm"){
		var scormAPIObj = new scormAPI();
		_model.setScormReference(scormAPIObj);
		
		$("#innerContainer").hide();
		$("#landingPage").hide();
		
		var courseTitle = _model.getCourseDataObj().title.split(':');
		var occupierName = _model.getCourseDataObj().occupierName;
		$("#courseTitleText").html(occupierName);
		$("#courseTitleText").html('L&T Edutech');

		var courseCompletionStatus = _model.getScormReference().retrieveCompletionStatusTracking();

		if(courseCompletionStatus != undefined){
			if(courseCompletionStatus != "completed" || courseCompletionStatus != "incomplete"){
				_model.getScormReference().storeCompletionStatusTracking("not attempted");
			}
		}

		var totalCourseDuration = _model.getCourseDataObj().duration;
		_model.getScormReference().setDurationOfCourse(totalCourseDuration);

		var masteryScore = parseInt(_model.getCourseDataObj().masteryscore) || 60;
		_model.getScormReference().setMasteryScore(masteryScore);

		$('title').html(_model.getCourseDataObj().projectTitle);
		var appControllerObj = new ApplicationController();
		_languageChangeAppControllerObj = appControllerObj;
		appControllerObj.init();
		
	}else{
		
		$('title').html(_model.getCourseDataObj().projectTitle);
		var appControllerObj = new ApplicationController();
		_languageChangeAppControllerObj = appControllerObj;
		appControllerObj.init();
	}
}



function quitSCORM(){
	var curObj = _model.getScormReference();
	curObj.exitScorm();
}
