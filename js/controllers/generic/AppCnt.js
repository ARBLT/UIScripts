/**
 * Created by Ravi Sharma on 6/20/2016.
 */

var ApplicationController = function () {

    var currentRef = this; //hack to get the reference of the current class
    var menu_tick, active_state;
	var currentTemplate;
    var currentTemplateObj;
    var timeIntervalforNetworkConnectionApp;
	
	var _changeLanguage = false;
    var _changeLanguageSelected = false;
    var _couseMenuSelected = false;

    this._model = DataManager.getInstance();
    this.currentIndex = 0;
    this.audioManager;
    this.currentPageTranscript = "";
     this.currentPageJSONData;
    this.currentPageToLoadObj;

    this.audioMuteFlag = true;
    this.playPauseFlag = true;
	this.VideoplaypauseFlag = false;
	
	this.courseTrackObj = new Object();
	this.courseTrackObj.currentIndex = 0;
	this.courseTrackObj.curChapterIndex = 0;
	this.courseTrackObj.curPageIndex = 0;
	
    this.menuStatusArr = new Array();

	this.curChapterIndex = 0;
    this.curPageIndex = 0;

    this.posX;
    this.posY;
    this.newPosXDiff;
    this.newPosYDiff;
    
    this.repeatedTitle = "";
    this.repeatedTitleId = [];
    this.repeadtedTitleArray = [];
    window.largeImgClicked = false;
    window.currentIndexRef = 0;
    window.nextIndexRef = 0;
    window.answersubmitted = false;
    this.holdCurrentIndex = 0;
    this.courseCompletionStatus = false;
    this.alertErrorTextNonVisited = "";
    this.alertErrorTextInvalidPage = "";
    this.startBtnText = "START";
    this.resumeBtnText = "RESUME";

    this.videoInterval;
    this.courseFocused = true;
    this.manualStorpTriggered = false;

    this.menuRevealed = false;
	
    this.init = function () {

        trace(":: Application Controller Initialized and Ready for task ::");

        currentRef.audioManager = new AudioManager();

        EventManager.getInstance().addControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, currentRef.audioEndEventHandler);

        $("#menuBoxContainer").hide();
        $("#parentContainerParent").hide();
        currentRef.controlVisibility("landingPage");
       
        var tocURL = _model.getCourseDataObj().baseURL + _model.getCourseDataObj().contentURL + "?version=" + StaticLibrary.generateRandom();
        trace("Course TOC : " + tocURL);
        
        if(tocURL.indexOf("english") > -1){
            currentRef.alertErrorTextNonVisited = "This page is not yet enabled.";
            currentRef.alertErrorTextInvalidPage = "Incorrect page number.";
            currentRef.startBtnText = "START";
            currentRef.resumeBtnText = "RESUME";
           
        }
        if(tocURL.indexOf("hindi") > -1){
            currentRef.alertErrorTextNonVisited = "यह पेज अभी तक इनेबल्ड नहीं हुआ है|";
            currentRef.alertErrorTextInvalidPage = "पेज संख्या गलत है|";
            currentRef.startBtnText = "स्टार्ट";
            currentRef.resumeBtnText = "रिज्यूम";
           
        }
		
        trace(":: Course Table of Content, loading started ::");
 
        var apiServiceLoadAppData = new APIService();
        apiServiceLoadAppData.loadTOCData(tocURL, "true", StaticLibrary.DATA_TYPE, currentRef.loadTOCerrorHandler, currentRef.loadTOCSuccessHandler);

        document.addEventListener('visibilitychange', function(){

            if(currentRef.courseFocused == true){
               
                if(currentRef.playPauseFlag == true){
               
                    currentRef.audioManager.pauseAudio();
                   
                    
                }
                currentRef.courseFocused = false;
            }else{
                if(currentRef.playPauseFlag == true){
               
                    currentRef.audioManager.playAudio();
                   
                   
                }
                currentRef.courseFocused = true;
            }
           
        });

        
    }

    this.trackNetworkForTocData = function(){
        if(navigator.onLine){
            $("#network-status").hide();

            var tocURL = _model.getCourseDataObj().baseURL + _model.getCourseDataObj().contentURL + "?version=" + StaticLibrary.generateRandom();

            var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadTOCData(tocURL, "true", StaticLibrary.DATA_TYPE, currentRef.loadTOCerrorHandler, currentRef.loadTOCSuccessHandler);

            clearInterval(timeIntervalforNetworkConnectionApp);
        }
    }



    this.loadTOCerrorHandler = function (jqXHR, exception){
        if(jqXHR.status == 0){
            $("#network-status").show();
            timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForTocData, 1000);
        }
    }

    this.loadTOCSuccessHandler = function (data) {
        
        //$("#audioPopup").draggable();
        trace(":: Course Table of Content, loading Completed ::");
        DataParser.parseTOCData(data);
        $("#jumpToTxt").attr("max",_model.getTOCDataArr().length);
        $("#jumpToTxt").attr("min",1);
		//alert("currentRef.menuStatusArr.length : " + currentRef.menuStatusArr.length);
	if(currentRef.menuStatusArr.length==0)
			
	{	
		for (var i = 0; i < _model.getLinearTOCDataArr().length; i++) {
			
			
			
            currentRef.menuStatusArr.push({"status":"NOT_STARTED"});
			if (_model.getLinearTOCDataArr()[i].pages != undefined) {
				currentRef.menuStatusArr[i].pages = new Array();
				for (var j = 0; j < _model.getLinearTOCDataArr()[i].pages.length; j++) {
					currentRef.menuStatusArr[i].pages.push({isVisited:"false",score:0});
				}
			}
		}	
}	
	//	alert("currentRef.menuStatusArr : " + currentRef.menuStatusArr);
		if( _model.getAppDataObj().scorm == "local" ){
            var storedCourseObj = localStorage.getItem('build_one_brick_thick_corner_wall_using_english_mond_method_localised');
			if( storedCourseObj != null && _changeLanguage==false) {
				//if( storedCourseObj != null) {
				
				var storedData = JSON.parse( storedCourseObj );	

				//alert("storedData : " + JSON.stringify(storedData));
				
				currentRef.courseTrackObj = storedData;
                currentRef.menuStatusArr = storedData.menuStatusArr;
				
                // console.log(currentRef.courseTrackObj)  
				//_model.setLinearTOCDataArr(storedData);
			}
		}else if( _model.getAppDataObj().scorm == "scorm" ){
			var courseTrackingData = _model.getScormReference().retrieveTrackingData();		
			
			if (courseTrackingData == "" || courseTrackingData == null || courseTrackingData == undefined || courseTrackingData == "undefined") {
				
				
			}else{
                var curData = JSON.parse( courseTrackingData );	
				currentRef.courseTrackObj = curData;
				currentRef.menuStatusArr = curData.menuStatusArr;
				//_model.setLinearTOCDataArr(curData);
            }
		}
 
 //alert("currentRef.menuStatusArr : " + currentRef.menuStatusArr);
 
        trace(":: Course Table of Content, data parsing Completed ::");
        trace( _model.getLinearTOCDataArr() );

        //Logic for loading and painting the TOC in the shell.
        var menuStr = "";
		var courseMenustr = '';
        $("#menuContainerList").html('');

        /* // Menu status from LMS. Needs to be updated once menu status array is finalized.

        for (var i = 0; i < _model.getTOCDataArr().length; i++) {
            currentRef.menuStatusArr.push({"isVisited": "false"});
        }

        if (_model.getAppDataObj().scorm == "scorm") {
            var trackingData = _model.getScormReference().retrieveTrackingData();
            if (trackingData != "") {
                currentRef.menuStatusArr = JSON.parse(trackingData);
            }
        } */

     
        //painting TOC Menu Titles when TOC Data loading is completed
        for (var i = 0; i < _model.getLinearTOCDataArr().length; i++) {
            if (_model.getLinearTOCDataArr()[i].pages != undefined) {
                menuStr += '<li data-toggle="collapse" data-target="#inner_' + i + '" aria-expanded="false" class="slidemenu collapsed enableArrow"><p class="nopad">' + _model.getLinearTOCDataArr()[i].pageTitle + '</p><ul class=" collapse" aria-expanded="false" id="inner_' + i + '"></ul></li> ';
            } else {
                menuStr += '<li class="eventcls"><p>' + _model.getLinearTOCDataArr()[i].pageTitle + '</p></li> ';
            }
			
			if(_model.getLinearTOCDataArr()[i].duration != undefined){
              //  alert("inside status");
				//alert("status : "+ currentRef.menuStatusArr[i].status)
				courseMenustr+= '<li data-status='+currentRef.menuStatusArr[i].status+'><div class="menu_icons"><img class="icon_menu unlock_icon" src="assets/images/un_lock.png" alt=""/> <img class="icon_menu completed_icon" src="assets/images/tick_icon.png" alt=""/> <img class="icon_menu progress_icon" src="assets/images/progress_icon.png" alt=""/> <img class="icon_menu lock_icon" src="assets/images/lock.png" alt=""/></div><h3>'+_model.getLinearTOCDataArr()[i].pageTitle+'</h3><p class="duration">'+_model.getLinearTOCDataArr()[i].duration+'</p></li>'
			}
			
			trace(_model.getLinearTOCDataArr()[i].pageTitle);
			trace(_model.getLinearTOCDataArr()[i].duration);
        }
		
		$("#chapterMenu").html(courseMenustr);
		$(".icon_menu").hide();
		
		currentRef.updateModuleMenuStatus();
		
		
		$("#chapterMenu li").on('click',currentRef.chapterClickHandler);
		
        $("#menuContainerList").html(menuStr).promise().done(function () {

            trace(":: Menu Painted in the Container and event attached ::");
            for (var b = 0; b < _model.getLinearTOCDataArr().length; b++) {
                if (_model.getLinearTOCDataArr()[b].pages != undefined) {
                    for (var c = 0; c < _model.getLinearTOCDataArr()[b].pages.length; c++) {
						if(currentRef.menuStatusArr[b].pages[c].isVisited == "true"){
							
							//alert("currentRef.menuStatusArr : " + currentRef.menuStatusArr[b].pages[c].isVisited);
							if(!$(".menu_active i").hasClass("pull-right")){
                                 //changes new
                                if(currentRef.repeatedTitle != _model.getLinearTOCDataArr()[b].pages[c].pageTitle){
                                 $("#inner_" + b).append('<li data-chapter='+b+' data-page='+c+' class="eventcls completed" id="menuItem_'+c +'" ><i class="fa fa-check-circle text-default pull-right"></i>' + _model.getLinearTOCDataArr()[b].pages[c].pageTitle + '</li>');
                                 currentRef.repeatedTitle = _model.getLinearTOCDataArr()[b].pages[c].pageTitle
                                }else{
									 currentRef.repeatedTitleId.push(c-1);
								}
							}
						}else{
                            if(currentRef.repeatedTitle != _model.getLinearTOCDataArr()[b].pages[c].pageTitle){
                             $("#inner_" + b).append('<li data-chapter='+b+' data-page='+c+' class="eventcls" id="menuItem_'+c +'">' + _model.getLinearTOCDataArr()[b].pages[c].pageTitle + '</li>');
                             currentRef.repeatedTitle = _model.getLinearTOCDataArr()[b].pages[c].pageTitle
                            }else{
                                currentRef.repeatedTitleId.push(c-1);
                            }
						}
                    }
                }
            }
            currentRef.repeatedTitleArrayMethod();
            currentRef.setKnowledgeCheckStatusBar();

        //     $(".eventcls").each(function (a) {
        //         $(this).attr("id", "menuItem_" + a);
        //    });

        //    setTimeout(function(){
        //     if(currentRef.repeatedTitleVisitedCount == 0){
       
        //         $("#menuItem_" + currentRef.repeatedTitleId).removeClass('completed').children('i').eq(0).remove();
        //     }else if(currentRef.repeatedTitleVisitedCount > 0 &&currentRef.repeatedTitleVisitedCount < currentRef.repeadtedTitleArray.length){
       
        //         $("#menuItem_" + currentRef.repeatedTitleId).removeClass('completed').addClass("onprocess").children('i').eq(0).remove()
        //         $("#menuItem_" + currentRef.repeatedTitleId).prepend("<i class='fa fa-spinner text-default pull-right'></i>")
        //     }else if(currentRef.repeatedTitleVisitedCount == currentRef.repeadtedTitleArray.length){
        //         $("#menuItem_" + currentRef.repeatedTitleId).addClass('completed').children('i').eq(0).remove()
        //         $("#menuItem_" + currentRef.repeatedTitleId).prepend("<i class='fa fa-check-circle text-default pull-right'></i>")
        //     }

        //     },200);
             //changes new end

            $(".slidemenu").unbind("click").bind("click", currentRef.menuHeadColorClickHandler);

            // changes commented

            // $(".eventcls").each(function (a) {
            //     $(this).attr("id", "menuItem_" + a);
            // })

            for (var e = 0; e < _model.getTOCDataArr().length; e++) {
                $("#menuItem_" + e).unbind("click").bind("click", currentRef.menuItemClickHandler);
            }

            /***************** Making menu Linear ******************/
            if (_model.getAppDataObj().linear == "true") {
                $(".eventcls").css({'pointer-events': 'none', 'opacity': 0.5}); // making all li to pointer event none first
                $(".completed").css({'pointer-events': 'auto', 'opacity': 1});
                setTimeout(function(){
                    $(".completed").next().css({'pointer-events': 'auto', 'opacity': 1});
                },500);
               
				
            }

            /* if (_model.getAppDataObj().scorm == "scorm") {
                for (var e = 0; e < _model.getTOCDataArr().length; e++) {
                    if (currentRef.menuStatusArr[e].isVisited == "true") {
                        $("#menuItem_" + e).css({'pointer-events': 'auto', 'opacity': 1}); // Enable Menu items for the completed screens.
                    }
                }

            } */
			if(_changeLanguageSelected)
			{
				
            currentRef.loadCurrentPage(currentRef.currentIndex);
            _changeLanguageSelected = false;
			}
			
        });

        var glossaryURL = _model.getCourseDataObj().baseURL + "assets/data/content/glossary.json?version=" + StaticLibrary.generateRandom();
        trace("Glossary URL : " + glossaryURL);

        trace(":: Glossary data loading started ::");
        var apiServiceLoadAppData = new APIService();
        apiServiceLoadAppData.loadTOCData(glossaryURL, "true", StaticLibrary.DATA_TYPE, currentRef.loadGlossaryErrorHandler, currentRef.loadGlossarySuccessHandler);

       
    }
    //changes new
    this.repeatedTitleArrayMethod = function () {
        currentRef.repeadtedTitleArray = [];
        var newObj ={};
        newObj.id = currentRef.repeatedTitleId[0];
        newObj.count = 1;
        newObj.visitedStatus = [];

        for(var i = 0; i < currentRef.repeatedTitleId.length; i++){
            if(currentRef.repeatedTitleId[i+1] != currentRef.repeatedTitleId[i]+1){
                    currentRef.repeadtedTitleArray.push(newObj);
                    newObj ={};
                    newObj.id = currentRef.repeatedTitleId[i+1];
                    newObj.count = 1;
                    newObj.visitedStatus = [];
                
            }else{
                newObj.count += 1;
            }

        }

        for(var i = 0; i < currentRef.repeadtedTitleArray.length;i++){
            var repeatedTitleIdStart = Number(currentRef.repeadtedTitleArray[i].id);
            var repeatedTitleIdEnd = Number(repeatedTitleIdStart+currentRef.repeadtedTitleArray[i].count);

            for(var k = repeatedTitleIdStart; k <= repeatedTitleIdEnd; k++){
                currentRef.repeadtedTitleArray[i].visitedStatus.push(currentRef.menuStatusArr[0].pages[k].isVisited);
            }

        }
    }

    this.setKnowledgeCheckStatusBar = function(){
        var everyTrueFunction = function(value) {
            return value == "true";
        }
        var everyFalseFunction = function(value) {
            return value == "false";
        }
        var someTrueFunction = function(value){
            return value == "true";
        }
        setTimeout(function(){
            for(var i = 0; i < currentRef.repeadtedTitleArray.length;i++){
                var repeatedTitleIdStart = Number(currentRef.repeadtedTitleArray[i].id);
                var repeatedTitleIdEnd = Number(repeatedTitleIdStart+currentRef.repeadtedTitleArray[i].count);
                
                var everyTrue = currentRef.repeadtedTitleArray[i].visitedStatus.every(everyTrueFunction);
                var everyFalse = currentRef.repeadtedTitleArray[i].visitedStatus.every(everyFalseFunction);
                var someTrue = currentRef.repeadtedTitleArray[i].visitedStatus.some(someTrueFunction);
            
                    if(everyTrue){
                        
                        $("#menuItem_" + repeatedTitleIdStart).addClass('completed').children('i').eq(0).remove();
                        $("#menuItem_" + repeatedTitleIdStart).prepend("<i class='fa fa-check-circle text-default pull-right'></i>");
                                         
                    }else if(someTrue){
                        $("#menuItem_" + repeatedTitleIdStart).removeClass('completed').addClass("onprocess").children('i').eq(0).remove()
                        $("#menuItem_" + repeatedTitleIdStart).prepend("<i class='fa fa-spinner text-default pull-right'></i>")
                    }else{
                        $("#menuItem_" + repeatedTitleIdStart).removeClass('completed').children('i').eq(0).remove();
                    }
            }
        },200);
        
       
    }
    //changes new
    this.menuHeadColorClickHandler = function () {
        if($(this).find('.nopad').hasClass('clrtag')){
            $(this).find('.nopad').removeClass('clrtag');
        }else{
            $(this).find('.nopad').addClass('clrtag');
        }
    }

    this.trackNetworkForGlossaryData = function(){
        if(navigator.onLine){
            $("#network-status").hide();

            var glossaryURL = _model.getCourseDataObj().baseURL + "assets/data/content/glossary.json?version=" + StaticLibrary.generateRandom();
            trace("Glossary URL : " + glossaryURL);
    
            trace(":: Glossary data loading started ::");
            var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadTOCData(glossaryURL, "true", StaticLibrary.DATA_TYPE, currentRef.loadGlossaryErrorHandler, currentRef.loadGlossarySuccessHandler);

            clearInterval(timeIntervalforNetworkConnectionApp);
        }
    }

    this.loadGlossaryErrorHandler = function(jqXHR, exception){
        if(jqXHR.status == 0){
            $("#network-status").show();
            timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForGlossaryData, 1000);
        }
    }

    this.loadGlossarySuccessHandler = function (data) {
  
        trace(":: Glossary data loading Completed ::");
        trace(data);

        //to-do task for loading and painting the Glossary in Glossary Popup.
        var glossaryController = new GlossaryController();
        glossaryController.init(data);

        currentRef.createResourcesPopup(_model.getCourseDataObj().resources);
        //currentRef.createHandoutPopup(_model.getCourseDataObj().handouts);
		
		var apiServiceLoadAppData = new APIService();
		var landingPageURL = _model.getCourseDataObj().baseURL +"pages/landingPage.html";
        apiServiceLoadAppData.loadFromExternalSource(landingPageURL, "true", StaticLibrary.TEMPLATE_TYPE, currentRef.landigPageErrorHandler, currentRef.landingPageSuccessHandler);
    }
    
    this.trackNetworkForLandingPageData = function() {
        if(navigator.onLine){
            $("#network-status").hide();

            var apiServiceLoadAppData = new APIService();
		    var landingPageURL = _model.getCourseDataObj().baseURL +"pages/landingPage.html";
            apiServiceLoadAppData.loadFromExternalSource(landingPageURL, "true", StaticLibrary.TEMPLATE_TYPE, currentRef.landigPageErrorHandler, currentRef.landingPageSuccessHandler);

            clearInterval(timeIntervalforNetworkConnectionApp);
        }
    }

    this.landigPageErrorHandler = function(jqXHR, exception){
        if(jqXHR.status == 0){
            $("#network-status").show();
            timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForLandingPageData, 1000);
        }
    }

	
	this.landingPageSuccessHandler = function(data){
        
		$("#landingPage").html('').html(data).promise().done(function(){
            trace(":: Click start button to start the course, TOC loading and Painting completed ::");

            $(".landing_image_part img").on("load", function() {
               
                $("#m1_wrapper_overlay").hide();
                
            })

            $(".landing_image_part img").on("error", function() {
               
                $("#m1_wrapper_overlay").hide();
                
            })

				var completedScreenCount = 0;
				var totalScreenCount = 0;
				
				for(var i=0;i<currentRef.menuStatusArr.length;i++){
					if(currentRef.menuStatusArr[i].pages != undefined){
						for(var j=0;j<currentRef.menuStatusArr[i].pages.length;j++){
							totalScreenCount++;
							if(currentRef.menuStatusArr[i].pages[j].isVisited == "true"){
								completedScreenCount++;
							}
						}
					}
				}
				
				if( (completedScreenCount > 0) && ( totalScreenCount != completedScreenCount ) ){
                   
                    $("#btnStart .start-text").html(currentRef.resumeBtnText);
                  
                    // $("#restart_module")[0].style.display = "inline-block";
                    
                    $("#btnStart").unbind("click").bind("click", function() {
                        currentRef.startClickHandler("resume");
                    });
                    $("#restart_module").unbind("click").bind("click", function() {
                        currentRef.startClickHandler("start");
                    });
				
				}else{
                    $("#btnStart .start-text").html(currentRef.startBtnText)
                    $("#btnStart").unbind("click").bind("click", function() {
                        currentRef.startClickHandler("start");
                    });
                }
			
		});
	}	

    //function to crate Resource Link for the Resource Popup
    this.createResourcesPopup = function (resourceData) {
        trace(":: Creating Resource Popup ::");

        var resourceStr = "";
        $("#resourcePopupLinkContainer").html('');
		if(resourceData.length > 0){
			for (var i = 0; i < resourceData.length; i++) {
				resourceStr += "<p><a target='_blank' href='" + _model.getCourseDataObj().baseURL + "assets/data/resources/" + resourceData[i].url + "'>" + resourceData[i].title + "</a></p>";
			}
		} else {
				resourceStr = "There are no resources for this module.";
		}
        $("#resourcePopupLinkContainer").html(resourceStr);
    }

    //function to crate Handout Link for the Handout Popup
    this.createHandoutPopup = function (resourceData) {
        trace(":: Creating Handout Popup ::");

        var url = _model.getCourseDataObj().baseURL + "assets/data/handouts/" + resourceData[0].url;
        window.open(url);

        /*
        var handoutStr = "";
        $("#handoutPopupLinkContainer").html('');
        for (var i = 0; i < resourceData.length; i++) {
            handoutStr += "<p><a target='_blank' href='" + _model.getCourseDataObj().baseURL + "assets/data/handouts/" + resourceData[i].url + "'>" + resourceData[i].title + "</a></p>";
        }
        $("#handoutPopupLinkContainer").html(handoutStr);
        */
    }

    this.startClickHandler = function (resumestatus) {
		
		
		if(resumestatus != "start"){
            currentRef.curChapterIndex = currentRef.courseTrackObj.curChapterIndex;
					currentRef.curPageIndex = currentRef.courseTrackObj.curPageIndex;
					currentRef.currentIndex = currentRef.courseTrackObj.currentIndex;
					currentRef.startTheCourse();
					return;
        }

        currentRef.controlVisibility("innerContainer");
		$("#menuPart").css({'pointer-events': 'none', 'opacity': 0.5}); // Added to hide menu parts
		$("#footerSection_1").css({'pointer-events': 'none', 'opacity': 0.5});
        // $("#menuBoxContainer").show();
        //$("#headerSection_1").show();
        //$("#headerSection_2").hide();
        $("#footerSection_2").hide();$("#parentContainerParent").hide();
        //$("#playPauseBtn img").attr('src', 'assets/images/play_button.png');
        
        $("#playPauseBtn i").addClass("fa-play").removeClass("fa-pause");
        currentRef.chapterClickHandler()
    }
	
	this.internalLanguageSelected = function(){
		_changeLanguage = true;
		$("#languagePopup").fadeOut(500);
		
		$("#mobileMenuOverlay").hide();
		 
		//alert("current ref :"+JSON.stringify(currentRef));
		
		//currentRef.updateModuleMenuStatus();
		
		
		
		currentRef.audioManager = new AudioManager();

        EventManager.getInstance().addControlEventListener(window, StaticLibrary.AUDIO_ENDED_EVENT, currentRef.audioEndEventHandler);

       // $("#menuBoxContainer").hide();
       // $("#parentContainerParent").hide();
       // currentRef.controlVisibility("landingPage");

        var tocURL = _model.getCourseDataObj().baseURL + _model.getCourseDataObj().contentURL + "?version=" + StaticLibrary.generateRandom();
        //alert("Course TOC : " + tocURL);
		
        trace(":: Course Table of Content, loading started ::");
        var apiServiceLoadAppData = new APIService();
        apiServiceLoadAppData.loadTOCData(tocURL, "true", StaticLibrary.DATA_TYPE, null, this.loadTOCSuccessHandler);
		
		
		
		//alert(currentRef.currentIndex);
		
		/* currentRef.curChapterIndex = currentRef.courseTrackObj.curChapterIndex;
					currentRef.curPageIndex = currentRef.courseTrackObj.curPageIndex;
					currentRef.currentIndex = currentRef.courseTrackObj.currentIndex */;
					
					////currentRef.loadCurrentPage(currentRef.currentIndex);
					//currentRef.startTheCourse();		
		
	}

	this.homeButtonClickHandler = function(){
        // $("#audioPopup").hide();
        $("#btnStart .start-text").html(currentRef.startBtnText);
        $("#restart_module").hide();
        $("#btnStart").unbind("click").bind("click", function() {
            currentRef.startClickHandler("start");
        });
       
		$("#mobileMenuOverlay").hide();
		$("#footerSection_2").hide();
		$("#nextNotification").hide();
		$("#menuPart").css({'pointer-events': 'none', 'opacity': 0.5});
		$("#footerSection_1").css({'pointer-events': 'none', 'opacity': 0.5});
        //$("#playPauseBtn img").attr('src', 'assets/images/play_button.png');
        $("#playPauseBtn i").addClass("fa-play").removeClass("fa-pause");
		$("#menuBoxContainer").show();
        //$("#headerSection_2").hide();
		// $("#audioPopup").css("display", "none");
		$("#parentContainerParent, #pageJump").hide();
		$("#parentContainer").html('');
		$("#playPauseBtn, #audioMuteBtn").css("pointer-events","none");
		currentRef.updateModuleMenuStatus();
        currentRef.audioManager.stopAudio();
        //changes new
        window.audioEnded = false;
		currentRef.audioManager.loadAudio(_model.getCourseDataObj().baseURL + "assets/media/audio/homeloop");
		$("#landingPage").show();
        $("#innerContainer").show();
		$("#pageJump").hide();
        $("#menuBoxContainer").hide();
        //$(".side_menu").hide();
        $("#footerSection_2").hide();$("#parentContainerParent").hide();
        $("#nextNotification").hide();
        currentRef.sideMenuShowHide();
        currentRef.controlVisibility("landingPage");
        //changes new end
	}
	
    this.startTheCourse = function(){
      
        var that = $(this);
		
		$("#pageJump").show();
		$("#menuPart").css({'pointer-events': 'auto', 'opacity': 1});
		$("#footerSection_1").css({'pointer-events': 'auto', 'opacity': 1});
        $("#menuBoxContainer").hide();
        //$("#headerSection_2").show();
        $("#footerSection_2").show();$("#parentContainerParent").show();
		$("#nextNotification").show();
 
		// if( /Android|iPhone|iPod/i.test(navigator.userAgent) ) {
		// 	$("#headerSection_1").show();
		// 	//$("#headerSection_2").hide();
		// }
        
		currentRef.checkChapterCompletionStatus();

        currentRef.audioManager.stopAudio();
        currentRef.audioManager.loadAudio("assets/media/audio/blank");

        if (_model.getAppDataObj().scorm == "scorm") {
            var courseCompletionStatus = _model.getScormReference().retrieveCompletionStatusTracking();

            if(courseCompletionStatus != undefined){
                if(courseCompletionStatus != "completed"){
                    _model.getScormReference().storeCompletionStatusTracking("incomplete");
                }
            }
        }

        setTimeout(function(){
            $("#previousBtn").unbind("click").bind("click", currentRef.previousClickHandler);
            $("#nextBtn").unbind("click").bind("click", currentRef.nextClickHandler);
            $("#audioMuteBtn").unbind("click").bind("click", currentRef.muteUnMuteHandler);
            $("#playPauseBtn").unbind("click").bind("click", currentRef.playPauseClickHandler);
            $("#replyBtn").unbind("click").bind("click", currentRef.replyClickHandler);

            $("#courseMenuBtn").unbind("click").bind("click", currentRef.courseMenuClickHandler);
            $("#resourceBtn").unbind("click").bind("click", currentRef.resourceClickHandler);
            $("#referenceBtn").unbind("click").bind("click", currentRef.referenceClickHandler);
            $("#glossaryBtn").unbind("click").bind("click", currentRef.glossaryClickHandler);
            $("#helpBtn").unbind("click").bind("click", currentRef.helpClickHandler);
            $("#handoutBtn").unbind("click").bind("click", currentRef.handoutClickHandler);
			
			$("#languageSelectBtn").unbind("click").bind("click", currentRef.languageSelectClickHandler);
			$("#languageClose").unbind("click").bind("click", currentRef.languageSelectCloseHandler);
			
            $("#transcriptBtn").unbind("click").bind("click", currentRef.transcriptClickHandler);
            $("#audioClose").unbind("click").bind("click", currentRef.audioTranscriptCloseHandler);
            $("#homeMenuBtn").unbind("click").bind("click", currentRef.homeButtonClickHandler);
            
            $("#jumpToTxt").unbind("keyup").bind('keyup',  currentRef.jumpToSubmitHandler);
            $("#jumpToBtn").unbind("click").bind("click", currentRef.jumpToBtnHandler);
            $("#menuPart").unbind("click").bind("click", currentRef.sideMenuShowHide);
            $(".menu-burger-overlay").unbind("click").bind("click", currentRef.sideMenuShowHide);
            $("#close_menu_part").unbind("click").bind("click", currentRef.sideMenuShowHide);
			/*    $(document).on("play", "#videoTemplateContainer", currentRef.PlayHandler); 
				$(document).on("pause", "#videoTemplateContainer", currentRef.PauseHandler);  		 */	   
 			  $("#menu_close").unbind("click").bind("click", currentRef.headerPopupCloseHandler);
             $("#resourcePopup, #helpPopup, #menuContainer, #glossaryPopup, #referencePopup, #resourcePopup, #switchLanguagePopup").on("hidden.bs.modal", currentRef.headerPopupCloseHandler);
             
             //$("#menuContainer").unbind("click").bind("click", currentRef.headerPopupCloseHandler);	 	  	
            /* if (_model.getAppDataObj().scorm == "scorm") {
                var isContinue = false;

                if (_model.getScormReference().retrieveVisitedScreenNo() != "") {
                    isContinue = confirm("Do you want to continue the course from where you left ?");
                }

                if (isContinue) {
                    currentRef.currentIndex = Number(_model.getScormReference().retrieveVisitedScreenNo());
                    //trace(_model.getScormReference().retrieveVisitedScreenNo());
                }
            } */
           
               
                
           
            $(window).focus(function(){
               
            });

            $(".mobile_menu").unbind("click").bind("click", currentRef.mobileMenuHandler);
            $(".language-selection").unbind("click").bind("click", currentRef.switchLanguageHandler)

            currentRef.controlVisibility("innerContainer");

           
            // if(that.context.id == "btnStart"){
			// 	currentRef.startButtonClicked = true;
			// 	var initStorage = localStorage.getItem(_model.getAppDataObj().courseName+'initStorage');
			// 	if(initStorage != null){
			// 		for (var i = 0; i < _model.getLinearTOCDataArr().length; i++) {
			// 			currentRef.menuStatusArr.push({"status":"NOT_STARTED"});
			// 			if (_model.getLinearTOCDataArr()[i].pages != undefined) {
			// 				currentRef.menuStatusArr[i].pages = new Array();
			// 				for (var j = 0; j < _model.getLinearTOCDataArr()[i].pages.length; j++) {
								
			// 					currentRef.menuStatusArr[i].pages.push({isVisited:"false",score:0});
			// 				}
			// 			}
			// 		}	
					
			// 	}
			// 	currentRef.currentIndex = 0;
			// }
			// if(that.context.id == "btnStart"){
			// 	$('.eventcls').each(function(){
			// 		$(this).find('i').eq(0).remove();
			// 	})
            // }
            
            currentRef.loadCurrentPage(currentRef.currentIndex);
        }, 200);
    }
	this.jumpToSubmitHandler = function(event){
        var totalPages = _model.getTOCDataArr().length;
        if($(this).val() > totalPages){
            $(this).val(totalPages)
        }else if($(this).val() === "0"){
            $(this).val(1)
        }else if($(this).val() < 0){
            $(this).val(1)
        }
       
        
		if(event.keyCode == 13){ 
            event.preventDefault();
			$("#jumpToBtn").click(); 
			return false;
		}
	}
	
	this.jumpToBtnHandler = function(){ 
        

        $(".menu-burger-overlay").hide()
        $("#headerSection_2").removeClass("showMenu")
        trace("Jump To Page : " + $("#jumpToTxt").val());
        var temporaryChapterIndexStore = currentRef.curChapterIndex;
        var temporaryPageIndexStore = currentRef.curPageIndex;
       
        var totalPages = _model.getTOCDataArr().length;
        var jumpToPage = (parseInt($("#jumpToTxt").val()) - 1);
        if((jumpToPage < totalPages) && (jumpToPage >= 0)){
            currentRef.curChapterIndex = $("#menuItem_"+jumpToPage).attr('data-chapter');
            currentRef.curPageIndex = $("#menuItem_"+jumpToPage).attr('data-page');
            if(currentRef.curChapterIndex == undefined && currentRef.curPageIndex == undefined){
                currentRef.curChapterIndex = 0;
                currentRef.curPageIndex = jumpToPage;
            }
           
            if((_model.getAppDataObj().linear == "false") || currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited == "true" || currentRef.curPageIndex  == 0 || currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex - 1].isVisited == "true"){
                currentRef.currentIndex = jumpToPage;
                currentRef.loadCurrentPage(currentRef.currentIndex);
            }
            else{
                currentRef.curChapterIndex = temporaryChapterIndexStore;
                currentRef.curPageIndex = temporaryPageIndexStore;
                alert(currentRef.alertErrorTextNonVisited);
                $("#jumpToTxt").val("");
            }
        } else {
            
            alert(currentRef.alertErrorTextInvalidPage);
            $("#jumpToTxt").val("");
        }
	
    }
    
    this.sideMenuShowHide = function() {
       
        if(currentRef.menuRevealed == false){
            $(".menu-burger-overlay").show();
            $("#headerSection_2").addClass("showMenu");
            $("#menuPart").addClass("hovered");
            $("body").addClass("modal-open");
            

            currentRef.menuRevealed = true;
            trace(":: Glossary Button Clicked ::");
            currentRef.courseMenuHideHandler();
            $("#videoTemplateContainer").trigger('pause');
            $("#videoContainer").trigger('pause');

            if(currentRef.playPauseFlag == true){
                currentRef.playPauseFlag = false;
                currentRef.audioManager.pauseAudio();
                $("#playPauseBtn i").addClass("fa-play").removeClass("fa-pause");
                
            }
             
             $(".disableMenuBG").hide();
            
             
        }else{
            $(".menu-burger-overlay").hide();
            $("#headerSection_2").removeClass("showMenu");
            $("#menuPart").removeClass("hovered");
            $("body").removeClass("modal-open");
            
            currentRef.menuRevealed = false;
          
            if(window.audioEnded){
               
                if(currentRef.VideoplaypauseFlag == true){
                    $("#videoTemplateContainer").trigger('play'); 
                    $("#videoContainer").trigger('play');  
                }    
            }
             
             
            if(currentRef.playPauseFlag == false){
                
                if(_changeLanguageSelected == false){
                    if(_couseMenuSelected == false){
                        if(currentRef.manualStorpTriggered == false){
                            $("#playPauseBtn i").addClass("fa-pause").removeClass("fa-play");
                            currentRef.audioManager.playAudio();
                            currentRef.playPauseFlag = true;
                        }
                      
                    }
                   	
                }
            }
            else{
               
                 		
             }

            
        }
    }
	
    this.mobileMenuHandler = function () {
        // if ($(".system_menu").css("display") == "block") {
		// 	$("#mobileMenuOverlay").hide();
		// 	if(currentRef.playPauseFlag == true){
		// 		currentRef.audioManager.playAudio();
		// 	}
        //     $(".system_menu").animate({'position': 'absolute', 'right': '-148px'}, 500, function () {
        //         $(".system_menu").hide();
		// 		$(".disableMenuBG").hide();
        //     });
        // } else {
		// 	$("#mobileMenuOverlay").show();
		// 		currentRef.audioManager.pauseAudio();
        //     $(".system_menu").show(1, function () {
		// 		$(".disableMenuBG").show();
        //         $(".system_menu").animate({'position': 'absolute', 'right': '0px'}, 500);
        //     });

        // }

    };
    this.menuItemClickHandler = function (event) {
		$("#mobileMenuOverlay").hide();
		event.stopPropagation();
		
        var str = event.currentTarget.id;
        var tempIndexArr = str.split("_");

        currentRef.curChapterIndex = $(this).attr('data-chapter');
		currentRef.curPageIndex = $(this).attr('data-page');
		
        currentRef.currentIndex = parseInt(tempIndexArr[1]);
        
        _couseMenuSelected = true;
		currentRef.loadCurrentPage(currentRef.currentIndex);
        currentRef.sideMenuShowHide();
        $("#menuContainer").modal('hide');
    }
	
	this.chapterClickHandler = function(){

		if (_model.getAppDataObj().linear == "true") {
			if( ( $(this).prev().attr('data-status') != 'COMPLETED' ) && $(this).prev().length ){
				return;
			}
		}
		
		var curChapterIndex = 0;
		var linearPageIndex = 0;
		var chapterStartIndex = 0;
		var tempIndex = 0;
		var tempIndex1 = 0;
		
		for(var i=0;i<currentRef.menuStatusArr.length;i++){
			if(curChapterIndex > i){
				if(currentRef.menuStatusArr[i].pages != undefined){
					for(var j=0;j<currentRef.menuStatusArr[i].pages.length;j++){
						chapterStartIndex++;
					}
				}
			}
        }
        
		
		if(currentRef.menuStatusArr[curChapterIndex].pages != undefined){
			for(var i=0;i<currentRef.menuStatusArr[curChapterIndex].pages.length;i++){
				if( currentRef.menuStatusArr[curChapterIndex].pages[i].isVisited == "true" ){
					tempIndex++;
				}
			}
		}
		
		/* for(var i=0;i<currentRef.menuStatusArr.length;i++){
			if(currentRef.menuStatusArr[i].pages != undefined){
				for(var j=0;j<currentRef.menuStatusArr[i].pages.length;j++){
					if( currentRef.menuStatusArr[i].pages[j].isVisited == "true"){
						if(i == curChapterIndex){
							tempIndex++;
						}
						linearPageIndex++;
					}
				}
			}
		} */
		
		/* if(linearPageIndex > 0){
			linearPageIndex--;
		}
		
		if(tempIndex > 0){
			tempIndex--;
		} */

		if( $(this).attr('data-status') == "IN_PROGRESS"){
			currentRef.curChapterIndex = curChapterIndex;
			currentRef.curPageIndex = tempIndex;
			currentRef.currentIndex = chapterStartIndex + tempIndex;
		}else{
			currentRef.curChapterIndex = curChapterIndex;
			currentRef.curPageIndex = 0;
			currentRef.currentIndex = chapterStartIndex;		
		}
		
		if(currentRef.menuStatusArr[currentRef.curChapterIndex].status == "NOT_STARTED"){
			currentRef.menuStatusArr[currentRef.curChapterIndex].status = "IN_PROGRESS";
		}
		
		currentRef.courseTrackObj.menuStatusArr = currentRef.menuStatusArr;
		currentRef.courseTrackObj.curChapterIndex = currentRef.curChapterIndex;
		currentRef.courseTrackObj.curPageIndex = currentRef.curPageIndex;
		currentRef.courseTrackObj.currentIndex = currentRef.currentIndex;
		
		if (_model.getAppDataObj().scorm == "scorm") {
			_model.getScormReference().storeTrackingData( JSON.stringify(currentRef.courseTrackObj) ); //Menu Status to LMS.
       	}else if(_model.getAppDataObj().scorm != "scorm"){
			localStorage.setItem('build_one_brick_thick_corner_wall_using_english_mond_method_localised',JSON.stringify(currentRef.courseTrackObj) );		
		}
		
        currentRef.startTheCourse();
		
		
		
		trace( linearPageIndex );
	}
	
	
    //function to handle the previous button click to load previous pages in the shell
    this.previousClickHandler = function () {

        trace(":: Previous Button Clicked ::");

        clearInterval(currentRef.videoInterval);

        if (currentRef.currentIndex <= 0) {
            trace(":: Your on First Page ::");
        } else {
		
			if(currentRef.curPageIndex > 0){
				currentRef.curPageIndex--;
			}else{
				var  totalChapterLength = _model.getLinearTOCDataArr().length-1;
				if(currentRef.curChapterIndex > 0){
					currentRef.curChapterIndex--;
					var curChapterPagesLength = _model.getLinearTOCDataArr()[currentRef.curChapterIndex].pages.length-1;
					currentRef.curPageIndex	= curChapterPagesLength;				
				}
			}
			
			trace("curChapterPagesLength: "+curChapterPagesLength+"  currentRef.curChapterIndex: "+currentRef.curChapterIndex+" currentRef.curPageIndex: "+currentRef.curPageIndex);
			
			
			currentRef.currentIndex--;
            currentRef.loadCurrentPage(currentRef.currentIndex);
        }
    }

    //function to handle the next button click to load next pages in the shell
    this.nextClickHandler = function () {

        trace(":: Next Button Clicked ::");

        clearInterval(currentRef.videoInterval);
		
        var totalLength = _model.getTOCDataArr().length;
        if (currentRef.currentIndex >= (totalLength - 1)) {
           trace(":: Your on Last Page ::"); 
            /* if (_model.getAppDataObj().scorm == "scorm") {
                _model.getScormReference().storeCompletionStatus("completed");
            } */
        } else {
            
			// Traversal Start
			
			if( _model.getLinearTOCDataArr()[currentRef.curChapterIndex].pages != undefined ){
				
				var curChapterPagesLength = _model.getLinearTOCDataArr()[currentRef.curChapterIndex].pages.length-1;
				var  totalChapterLength = _model.getLinearTOCDataArr().length-1;
				
				if(curChapterPagesLength  >  currentRef.curPageIndex){
					currentRef.curPageIndex++;
				}else{
					if(totalChapterLength > currentRef.curChapterIndex){
						trace( _model.getLinearTOCDataArr() );
						currentRef.menuStatusArr[currentRef.curChapterIndex].status = "COMPLETED";
						currentRef.curChapterIndex++;
						if(currentRef.menuStatusArr[currentRef.curChapterIndex].status == "NOT_STARTED"){
							currentRef.menuStatusArr[currentRef.curChapterIndex].status = "IN_PROGRESS";
						}
						currentRef.curPageIndex	= 0;				
					}
				}
				
				var curChapterPagesLength = _model.getLinearTOCDataArr()[currentRef.curChapterIndex].pages.length-1;
				
				if( (curChapterPagesLength == currentRef.curPageIndex) && (totalChapterLength == currentRef.curChapterIndex) ){
					currentRef.menuStatusArr[currentRef.curChapterIndex].status = "COMPLETED";
				}
				
				trace("totalChapterLength: "+totalChapterLength+" curChapterPagesLength: "+curChapterPagesLength+"  currentRef.curChapterIndex: "+currentRef.curChapterIndex+" currentRef.curPageIndex: "+currentRef.curPageIndex);
				
		    }
			
			
			// Traversal End
			
			currentRef.currentIndex++;
			
			//alert("currentRef.currentIndex : " + currentRef.currentIndex);
			
            currentRef.loadCurrentPage(currentRef.currentIndex);
        }
		
		/* if(!$(".menu_active i").hasClass("pull-right")){
			$(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
		} */
			
    }

    //function to handle mute and un-mute of audio in the framework
    this.muteUnMuteHandler = function () {

        trace(":: Mute Unmute Button Clicked ::");

        if (currentRef.audioMuteFlag) {
            currentRef.audioManager.muteAudio();
            //$("#audioMuteBtn img").attr('src', 'assets/images/audio_button_hover.png');
            $("#audioMuteBtn i").addClass("fa-volume-mute").removeClass("fa-volume-up");
            currentRef.audioMuteFlag = false;
			
			// if ($(".system_menu").css("display") == "block") {
			// 	$(".system_menu").animate({'position': 'absolute', 'right': '-245px'}, 500, function () {
			// 	   // $(".system_menu").hide();
			// 	});
			// }
			//  $(".disableMenuBG").hide();
			// $("#mobileMenuOverlay").hide();
        } else {

            currentRef.audioManager.unMuteAudio();
            //$("#audioMuteBtn img").attr('src', 'assets/images/audio_button.png');
            $("#audioMuteBtn i").addClass("fa-volume-up").removeClass("fa-volume-mute");
            currentRef.audioMuteFlag = true;
			
			// if ($(".system_menu").css("display") == "block") {
			// 	$(".system_menu").animate({'position': 'absolute', 'right': '-245px'}, 500, function () {
			// 	   // $(".system_menu").hide();
			// 	});
			// }
			//  $(".disableMenuBG").hide();
			// $("#mobileMenuOverlay").hide();
        }
    }

    //function to handle play and pause on the framework level.
    this.playPauseClickHandler = function () {

        trace(":: Play Pause Button ::");

        if (currentRef.playPauseFlag) {
            currentRef.playPauseFlag = false;
            currentRef.manualStorpTriggered = true;
            currentRef.audioManager.pauseAudio();
            //$("#playPauseBtn img").attr('src', 'assets/images/play_button.png');
            $("#playPauseBtn i").addClass("fa-play").removeClass("fa-pause");
			// if ($(".system_menu").css("display") == "block") {
			// 	$(".system_menu").animate({'position': 'absolute', 'right': '-245px'}, 500, function () {
			// 	   // $(".system_menu").hide();
			// 	});
			// }
			//  $(".disableMenuBG").hide();
			// $("#mobileMenuOverlay").hide();
        } else {
            currentRef.playPauseFlag = true;
            currentRef.manualStorpTriggered = false;
            currentRef.audioManager.playAudio();
            //$("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
            $("#playPauseBtn i").addClass("fa-pause").removeClass("fa-play");
			// if ($(".system_menu").css("display") == "block") {
			// 	$(".system_menu").animate({'position': 'absolute', 'right': '-245px'}, 500, function () {
			// 	   // $(".system_menu").hide();
			// 	});
			// }
			//  $(".disableMenuBG").hide();
			// $("#mobileMenuOverlay").hide();
        }
       
    }

    //function to handle the reply of the current loaded page in the shell.
    this.replyClickHandler = function () {
        trace(":: Reply Button Click ::");
        currentRef.loadCurrentPage(currentRef.currentIndex);
		// if ($(".system_menu").css("display") == "block") {
        //     $(".system_menu").animate({'position': 'absolute', 'right': '-245px'}, 500, function () {
        //        // $(".system_menu").hide();
        //     });
        // }
		//  $(".disableMenuBG").hide();
		//  $("#mobileMenuOverlay").hide();
    }

    //function to handle the click event for menu button from the shell
    this.courseMenuClickHandler = function () {
        trace(":: Menu Button Clicked ::");
        $("#menuContainer").modal('show');
		 currentRef.audioManager.pauseAudio();
		currentRef.courseMenuHideHandler();
		$("#videoTemplateContainer").trigger('pause');
		 $(".disableMenuBG").hide();
    }
 
	this.headerPopupCloseHandler = function(){
		trace(":: Menu Button Close Handler ::");
        $("#mobileMenuOverlay").hide();
        // if(window.audioEnded){
        //     $("#videoTemplateContainer").trigger('play');   
        // }
      
 		if(currentRef.menuRevealed == true){
            $("body").addClass("modal-open");
            
         }
        
         
		 
		// if(currentRef.playPauseFlag == false){
		// 	currentRef.audioManager.unMuteAudio();
		// }
		// else{
		// 	 currentRef.audioManager.playAudio();			
 		// }
			 
		 
	}
	
    //function to handle the click event for Resource button from the shell
    this.resourceClickHandler = function () {
        trace(":: Resource Button Clicked ::");
		currentRef.courseMenuHideHandler();
		 currentRef.audioManager.pauseAudio();
 		 $("#videoTemplateContainer").trigger('pause');
		 $(".disableMenuBG").hide();
    }
	
	//function to handle the click event for Resource button from the shell
    this.referenceClickHandler = function () {
        trace(":: Reference Button Clicked ::");
		currentRef.courseMenuHideHandler();
		$("#videoTemplateContainer").trigger('pause');
		 currentRef.audioManager.pauseAudio();
		 $(".disableMenuBG").hide();
    }

    //function to handle the click event for Glossary button from the shell
    this.glossaryClickHandler = function () {
        trace(":: Glossary Button Clicked ::");
		currentRef.courseMenuHideHandler();
		$("#videoTemplateContainer").trigger('pause');
		 currentRef.audioManager.pauseAudio();
		 $(".disableMenuBG").hide();
    }
   
    this.elementDrag = function(e) {
        e = e || window.event;
        
        // if(e.touches){
        //     touch = e.touches[0]
        // }

        currentRef.newPosXDiff = e.clientX  - currentRef.posX
        currentRef.newPosYDiff = e.clientY  - currentRef.posY
        
        var currentRight = parseInt($("#audioPopup.genie").css("right"));
        
        currentRight = Number(currentRight) - currentRef.newPosXDiff;
       
        var currentBottom = parseInt($("#audioPopup.genie").css("bottom"));
        currentBottom = Number(currentBottom) - currentRef.newPosYDiff;

        $("#audioPopup.genie").css("right", currentRight);
        $("#audioPopup.genie").css("bottom", currentBottom)
        currentRef.posX = e.clientX ;
        currentRef.posY = e.clientY;
    }

    this.mobileelementDrag = function(e) {
        e = e || window.event;
        
      
         touch = e.touches[0]
        

        currentRef.newPosXDiff = e.clientX || touch.pageX - currentRef.posX
        currentRef.newPosYDiff = e.clientY || touch.pageY - currentRef.posY
        
        var currentRight = parseInt($("#audioPopup.genie").css("right"));
        
        currentRight = Number(currentRight) - currentRef.newPosXDiff;
       
        var currentBottom = parseInt($("#audioPopup.genie").css("bottom"));
        currentBottom = Number(currentBottom) - currentRef.newPosYDiff;

        $("#audioPopup.genie").css("right", currentRight);
        $("#audioPopup.genie").css("bottom", currentBottom)
        currentRef.posX = e.clientX || touch.pageX;
        currentRef.posY = e.clientY || touch.pageY;
    }

        this.closeDragElement = function() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
            //console.log( console.log(e))
            
        }

    $("#audioPopup").on("mousedown", function(e){
       
        e = e || window.event;
        e.preventDefault();
        if(e.target.id == "myModalLabel" || e.target.className == "modal-dialog-transcript"){
            currentRef.posX = e.clientX;
            currentRef.posY = e.clientY;
            document.onmousemove = currentRef.elementDrag;
            document.onmouseup = currentRef.closeDragElement;
        }
    });

    $("#audioPopup").bind("touchstart",touchstart);

     function touchstart(e){
       
        
        if(e.target.id == "myModalLabel" || e.target.className == "modal-dialog-transcript"){
            e = e || window.event;
            e.preventDefault();
            touch = e.originalEvent.touches[0]
            currentRef.posX = e.clientX || touch.pageX;
            currentRef.posY = e.clientY || touch.pageY;
            document.ontouchmove = currentRef.mobileelementDrag;
             document.ontouchend = currentRef.closeDragElement;
        }
    };



    //function to handle the click event for Help button from the shell
    this.helpClickHandler = function () {
        trace(":: Help Button Clicked ::");
		currentRef.courseMenuHideHandler();
		$("#videoTemplateContainer").trigger('pause');
		 currentRef.audioManager.pauseAudio();
		 $(".disableMenuBG").hide();
    }
	this.courseMenuHideHandler = function () {
		// if($( window ).width() <= 480){
		// 	$(".system_menu").css({'right':'-148px','display':'none'});
		// }
	}

    //function to handle the click event for Handout button from the shell
    this.handoutClickHandler = function () {
        trace(":: Handout Button Clicked ::");

        currentRef.createHandoutPopup(_model.getCourseDataObj().handouts);

        /*
		 if ($(".system_menu").css("display") == "block") {
            $(".system_menu").animate({'position': 'absolute', 'right': '-168px'}, 500, function () {
               // $(".system_menu").hide();
            });
        }
		 $(".disableMenuBG").hide();
		 */
    }
	
	    //function to handle the click event for Language Selector button from the shell
    this.languageSelectClickHandler = function () {
        trace(":: Language Select Button Clicked ::");
		//  if ($(".system_menu").css("display") == "block") {
        //     $(".system_menu").animate({'position': 'absolute', 'right': '-245px'}, 500, function () {
        //         //$(".system_menu").hide();
        //     });
        // }
		 $(".disableMenuBG").hide();
		 $("#languagePopup").fadeIn(500);
    }
	
	this.languageSelectCloseHandler = function(){
		$("#languagePopup").fadeOut(500);
		$("#mobileMenuOverlay").hide();
	}

    //function to handle the click event for Transcript button from the shell
    this.transcriptClickHandler = function (event) {

        trace(":: Transcript Button Clicked ::");
		//  if ($(".system_menu").css("display") == "block") {
        //     $(".system_menu").animate({'position': 'absolute', 'right': '-245px'}, 500, function () {
        //         //$(".system_menu").hide();
        //     });
        // }
        //  $(".disableMenuBG").hide();
        
         if(event.target.id == "transcriptBtn" || event.target.id == "transcriptBtnTooltip"){
            $("#audioPopup").toggleClass("genie");
            if($("#audioPopup").hasClass("genie")){
                setTimeout(function(){
                    $("#audioPopup").css("transition","none");
                },350);
            }else{
                $("#audioPopup").removeAttr("style")
            }


            
         }
		 
    }

    this.switchLanguageContentsHandler = function(selectedLanguage) {

        switch(selectedLanguage) {
            case "english":
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
                $(".jumpToCSS label").html("Go to Page:");
                $("#nextBtn span").html("Next");
                $("#previousBtn span").html("Prev");
                $("#jumpToBtn").html("Go");

                $("#courseMenuBtn").find("span").html("Course Menu");
                $("#glossaryBtn").find("span").html("Glossary");
                $("#homeMenuBtn").find("span").html("Restart Module");
                $("#switchLanguageBtn").find("span").html("Switch Language");
                $("#helpBtn").find("span").html("Help");
                $("#desktopHelpImage").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _model.getCourseDataObj().desktopHelp);
                $(".mobile_type").attr("src", _model.getCourseDataObj().baseURL + "assets/images/Help-Mobile-content.PNG");
                document.title = "L&T Edutech - Electrical";
                break;
            case "hindi":
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
                $(".jumpToCSS label").html("पेज संख्या पर जाएं:");
                $("#nextBtn span").html("नेक्स्ट");
                $("#previousBtn span").html("प्रीवियस");
                $("#jumpToBtn").html("जाएं");
                $('#switchLanguageText').html('स्विच लैंग्वेजेस');
                $('#helptext').html("मदद");
                document.title = "L&T एडुटेक – इलेक्ट्रिकल";

                $("#courseMenuBtn").find("span").html("कोर्स मेनू");
                $("#glossaryBtn").find("span").html("शब्दकोष");
                $("#homeMenuBtn").find("span").html("रीस्टार्ट मॉडयूल");
                $("#switchLanguageBtn").find("span").html("स्विच लैंग्वेजेस");
                $("#helpBtn").find("span").html("मदद");
                $("#desktopHelpImage").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _model.getCourseDataObj().desktopHelp);
                $(".mobile_type").attr("src", _model.getCourseDataObj().baseURL + "assets/images/Help-Mobile-content.PNG");
                break;
        }
    }

    this.switchLanguageHandler = function() {
        _changeLanguageSelected = true;
        
        currentRef.audioManager.stopAudio();
       

        StaticLibrary.SHOW_PRE_LOADER();

        var selectedLanguage = $(this).data("language");
        
        _model.getCourseDataObj().baseURL = "courses/" + selectedLanguage + "/";
        var tocURL = _model.getCourseDataObj().baseURL + _model.getCourseDataObj().contentURL + "?version=" + StaticLibrary.generateRandom();
        var apiServiceLoadAppData = new APIService();
     
        apiServiceLoadAppData.loadTOCData(tocURL, "true", StaticLibrary.DATA_TYPE, currentRef.loadTOCerrorHandler, currentRef.loadTOCSuccessHandler);
        
        currentRef.sideMenuShowHide();
        currentRef.switchLanguageContentsHandler(selectedLanguage);
       
        // currentRef.loadCurrentPage(currentRef.currentIndex);

        var glossaryURL = _model.getCourseDataObj().baseURL + "assets/data/content/glossary.json?version=" + StaticLibrary.generateRandom();
        trace("Glossary URL : " + glossaryURL);

        trace(":: Glossary data loading started ::");
        $("#glossaryMenuList").html("");
        $("#glossaryDescription").html("");
        // var apiServiceLoadAppData = new APIService();
        // apiServiceLoadAppData.loadTOCData(glossaryURL, "true", StaticLibrary.DATA_TYPE, currentRef.loadGlossaryErrorHandler, currentRef.loadGlossarySuccessHandler);
        

        if(_model.getCourseDataObj().baseURL.indexOf("english") > -1){
            currentRef.alertErrorTextNonVisited = "This page is not yet enabled.";
            currentRef.alertErrorTextInvalidPage = "Incorrect page number.";
            currentRef.startBtnText = "START";
            currentRef.resumeBtnText = "RESUME";
           
        }
        if(_model.getCourseDataObj().baseURL.indexOf("hindi") > -1){
            currentRef.alertErrorTextNonVisited = "यह पेज अभी तक इनेबल्ड नहीं हुआ है|";
            currentRef.alertErrorTextInvalidPage = "पेज संख्या गलत है|";
            currentRef.startBtnText = "स्टार्ट";
            currentRef.resumeBtnText = "रिज्यूम";
           
        }

        setTimeout(function(){
            var nextPage = currentRef.currentIndex + parseInt(1);
            if(( currentTemplate == "MultipleChoiceSingleSelectTemplate") || ( currentTemplate == "DragandDropCombinedTemplate") ||
        ( currentTemplate == "DragandDropSequencing") || ( currentTemplate == "DropDownListTemplate") ||
        ( currentTemplate == "Fill_In_the_Blanks_Template") || ( currentTemplate == "Fill_In_the_Blanks_DragandDrop")){
            
            $("#menuItem_" + currentRef.holdCurrentIndex).addClass("menu_active");

            $(" #menuItem_"+currentRef.holdCurrentIndex).css({'pointer-events': 'auto', 'opacity': 1});
            
            if($(" #menuItem_"+currentRef.holdCurrentIndex+" i").hasClass("fa-check-circle")){

                $(" #menuItem_"+nextPage).css({'pointer-events': 'auto', 'opacity': 1});
            }
           
        }else{

            $("#menuItem_" + currentRef.currentIndex).addClass("menu_active");
            $(" #menuItem_"+currentRef.currentIndex).css({'pointer-events': 'auto', 'opacity': 1});

            if($(" #menuItem_"+currentRef.currentIndex+" i").hasClass("fa-check-circle")){
   
                $(" #menuItem_"+nextPage).css({'pointer-events': 'auto', 'opacity': 1});
            }
        }
        },2000);

    }
	
	this.audioTranscriptCloseHandler = function(){
        $("#audioPopup").removeAttr("style")
		$("#audioPopup").removeClass("genie");
		
    }
    

    //function gets triggered whenever the audio is completed play in the shell.
    this.audioEndEventHandler = function (data) {
        window.audioEnded = true;
        trace("::  Audio Ended & Click  from the Templates for Notification ::");
		
		trace(data.obj)

        currentRef.playPauseFlag = false;
        currentRef.manualStorpTriggered = true;
        //currentRef.menuStatusArr[currentRef.currentIndex].isVisited = "true";
		
		if(data.obj != null){
			trace(data.obj.type);	
			if(data.obj.type == "assessment"){
				currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].score = data.obj.score;
			}
		}
		
		if($("#parentContainer").hasClass("anchorTag")){
				var local = parseInt(currentRef.currentIndex) + parseInt(1);
				localStorage.setItem("anchor_slide_"+local+"","true");
						$("#parentContainer").removeClass("anchorTag");
		}
		
		var totalScore = 0;
		var totalQuestions = 0;
		$(".video-overlay").hide();
		for(var i=0;i<currentRef.menuStatusArr.length;i++){
			if( currentRef.menuStatusArr[i].pages != undefined ){
				for(var j=0;j<currentRef.menuStatusArr[i].pages.length;j++){
                     var curScreenScore = currentRef.menuStatusArr[i].pages[j].score;
                        
                     if( ( _model.getLinearTOCDataArr()[i].pages[j].templateName == "MultipleChoiceMultiSelectTemplate" ) || ( _model.getLinearTOCDataArr()[i].pages[j].templateName == "MultipleChoiceSingleSelectTemplate" ) ||
					 (_model.getLinearTOCDataArr()[i].pages[j].templateName == "TrueandFalseTemplate") || (_model.getLinearTOCDataArr()[i].pages[j].templateName == "DragandDropCombinedTemplate") ||
					  (_model.getLinearTOCDataArr()[i].pages[j].templateName == "DragandDropSequencing") || (_model.getLinearTOCDataArr()[i].pages[j].templateName == "DropDownListTemplate") ||
					  (_model.getLinearTOCDataArr()[i].pages[j].templateName == "Fill_In_the_Blanks_Template") || (_model.getLinearTOCDataArr()[i].pages[j].templateName == "Fill_In_the_Blanks_DragandDrop")){
						totalQuestions++;
					}
					
					if( ( _model.getLinearTOCDataArr()[i].pages[j].templateName == "VideoTemplate" )  || ( _model.getLinearTOCDataArr()[i].pages[j].templateName == "ModuleVideoTemplate" ) ){
						
                        $('#videoTemplateContainer').attr('controls', true);
                        $(".video-overlay").hide();
                        $("#playPauseBtn i").addClass("fa-play").removeClass("fa-pause");
                        
                        
					}

					//if(curScreenScore){
						totalScore += curScreenScore;
					//} 
				}
			}
		}

		scoreInPercentage = (totalScore/totalQuestions)*100;
		scoreInPercentage = Math.round(scoreInPercentage);
		
		currentRef.scoreInPercentage = scoreInPercentage;
		
		trace("totalScore: "+totalScore+" totalQuestions: "+totalQuestions+" scoreInPercentage: "+scoreInPercentage)
		
        /************** Making menu Linear starts*******************/

        trace((_model.getAppDataObj().linear == "true") + " - " + (_model.getTemplateStatus()) + " - " + (_model.getAudioStatus()))

        var lastPage = _model.getTOCDataArr().length - parseInt(1);
        if(currentRef.currentIndex == lastPage){
            $(" #menuItem_"+lastPage+" ").css({'pointer-events': 'auto', 'opacity': 1});
            /************** Making menu Linear ends*******************/
        }

		
		
		
        if(_model.getAudioStatus()){
            //$("#playPauseBtn img").attr('src', 'assets/images/play_button.png'); // added to change play icon when audio ends
            $("#playPauseBtn i").addClass("fa-play").removeClass("fa-pause");
        }

		if ((_model.getAppDataObj().linear == "false") && (_model.getAudioStatus())) {
			//added to control the next notification after audio ends
			 if(currentRef.currentIndex < lastPage){
                $("#nextNotification").fadeIn(800);
                $("#nextBtn").addClass("animateNextButton");
			 }
			//added to control tick mark in menus
		}
		
		
        //$("#popupCloseButton").show();
    
		
        if ((_model.getAppDataObj().linear == "true")  && (_model.getAudioStatus())) {
            _model.setTemplateStatus(false);
            _model.setAudioStatus(false); 
            var nextPage = currentRef.currentIndex + parseInt(1);

            if( ( currentTemplate == "ImageOnlyTemplate" ) ){
                window.currentIndexRef = currentRef.currentIndex;
                window.nextIndexRef = nextPage;
                //if(window.largeImgClicked == true) {
                     // making next li to active after audio ends
                    $(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").css({'pointer-events': 'auto', 'opacity': 1}); 
                    $(" #menuItem_"+currentRef.currentIndex+"").addClass('completed'); 

                    //added to control tick mark in menus
			        if(!$(".menu_active i").hasClass("pull-right")){
				        $(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
                    }
                    
                //}
            }else if( ( currentTemplate == "CarouselTemplate" ) || currentTemplate == "CarouselImageOnlyTemplate" || currentTemplate == "CarouselTemplateCenterContainer"){
                window.currentIndexRef = currentRef.currentIndex;
                window.nextIndexRef = nextPage;
                if(window.slideCompleted == true && window.source != 'video') {
                    // making next li to active after audio ends
                    $(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").css({'pointer-events': 'auto', 'opacity': 1}); 
                    $(" #menuItem_"+currentRef.currentIndex+"").addClass('completed'); 
                    
                    //added to control tick mark in menus
			        if(!$(".menu_active i").hasClass("pull-right")){
				        $(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
                    }
                }
            }else if( ( currentTemplate == "TableClickTemplate")){
                window.currentIndexRef = currentRef.currentIndex;
                window.nextIndexRef = nextPage;
                //if(window.largeImgClicked == true) {
                    // making next li to active after audio ends
                    $(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").css({'pointer-events': 'auto', 'opacity': 1}); 
                    $(" #menuItem_"+currentRef.currentIndex+" ").addClass('completed'); 
                    
                    //added to control tick mark in menus
			        if(!$(".menu_active i").hasClass("pull-right")){
				        $(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
                    }
                //}
               
            }else if(( currentTemplate == "MultipleChoiceSingleSelectTemplate") || ( currentTemplate == "MultipleChoiceMultiSelectTemplate") ||
            ( currentTemplate == "TrueandFalseTemplate") || ( currentTemplate == "DragandDropCombinedTemplate") ||
            ( currentTemplate == "DragandDropSequencing") || ( currentTemplate == "DropDownListTemplate") || ( currentTemplate == "Fill_In_the_Blanks_Template") || 
            ( currentTemplate == "Fill_In_the_Blanks_DragandDrop") ){
               
                if(window.answersubmitted == true) {
                    
           // alert("interactivity completed");        
                     // making next li to active after audio ends
                     $(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").css({'pointer-events': 'auto', 'opacity': 1}); 
                     $(" #menuItem_"+currentRef.currentIndex+" ").addClass('completed'); 
                     
                    //  //added to control tick mark in menus
                    if(!$(".menu_active i").hasClass("pull-right")){
                         $(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
                     }
                    // currentRef.repeatedTitle = "";
		            // var repeatedTitleId = Number(currentRef.repeatedTitleId);
		            // var repeatTitleConunt = Number(currentRef.repeadtedTitleArray.length);
		            // currentRef.repeadtedTitleArray = [];
                    // currentRef.repeatedTitleVisitedCount = 0;
		            //  for(var i = repeatedTitleId; i < (repeatedTitleId+repeatTitleConunt); i++){
            
			        //     currentRef.repeadtedTitleArray.push(currentRef.menuStatusArr[0].pages[i].isVisited) 
		            // }
                    // currentRef.repeatedTitleArrayMethod();



                    // if(currentRef.currentIndex != repeatedTitleId){
                    //     if(!$(".menu_active i").hasClass("pull-right")){
                    //         $(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
                    //     }
                    // }

                    currentRef.setKnowledgeCheckStatusBar();

                    // setTimeout(function(){
                    //     if(currentRef.repeatedTitleVisitedCount == 0){
                  
                    //         $("#menuItem_" + currentRef.repeatedTitleId).removeClass('completed').children('i').eq(0).remove();
                    //     }else if(currentRef.repeatedTitleVisitedCount > 0 &&currentRef.repeatedTitleVisitedCount < currentRef.repeadtedTitleArray.length){
                   
                    //         $("#menuItem_" + currentRef.repeatedTitleId).removeClass('completed').addClass("onprocess").children('i').eq(0).remove()
                    //         $("#menuItem_" + currentRef.repeatedTitleId).prepend("<i class='fa fa-spinner text-default pull-right'></i>")
                    //     }else if(currentRef.repeatedTitleVisitedCount == currentRef.repeadtedTitleArray.length){
                    //         $("#menuItem_" + currentRef.repeatedTitleId).addClass('completed').children('i').eq(0).remove()
                    //         $("#menuItem_" + currentRef.repeatedTitleId).prepend("<i class='fa fa-check-circle text-default pull-right'></i>")
                    //     }
                    // },200)
                }
            }else if(( currentTemplate == "CollapseTemplate")){
                window.currentIndexRef = currentRef.currentIndex;
                window.nextIndexRef = nextPage;
            }else if(( currentTemplate == "VideoTemplate")){
                window.currentIndexRef = currentRef.currentIndex;
                window.nextIndexRef = nextPage;
                $("#playPauseBtn").css({ 'pointer-events': 'none', 'opacity': 0.5 });
                if(currentRef.callAudioLoadEvent != undefined){
                    currentRef.callAudioLoadEvent();
                }
            }
            else{
                 // making next li to active after audio ends
                $(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").css({'pointer-events': 'auto', 'opacity': 1}); 
                $(" #menuItem_"+currentRef.currentIndex+" ").addClass('completed'); 
                
                //added to control tick mark in menus
			    if(!$(".menu_active i").hasClass("pull-right")){
				    $(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
                }
            }
			
           
            
           
			if(currentRef.currentIndex <= lastPage){
                if( ( currentTemplate == "ImageOnlyTemplate" ) ){
                    //added to control the next notification after audio ends
                    $("#nextBtn").addClass("animateNextButton");
                    $('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
                    if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
                        currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
                        currentRef.checkChapterCompletionStatus();
                    }
                    // if(window.largeImgClicked == true) {
                    //     $("#nextNotification").fadeIn(800);
                    //     $("#nextBtn").addClass("animateNextButton");
                    //     $('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1}); // enabled the next button when navigation is set to non-linear.
                    // }
                }else if( ( currentTemplate == "CarouselTemplate" ) || currentTemplate == "CarouselImageOnlyTemplate" || currentTemplate == "CarouselTemplateCenterContainer"){
                    $('#videoContainer').trigger('play');
                    currentRef.VideoplaypauseFlag = true;
                    //added to control the next notification after audio ends
                    if(window.slideCompleted == true && window.source != 'video') {
                       
                        $("#nextNotification").fadeIn(800);
                        $("#nextBtn").addClass("animateNextButton");
                        $('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1}); // enabled the next button when navigation is set to non-linear.
                        if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
                            currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
                            currentRef.checkChapterCompletionStatus();
                        }
                    }
                }else if( ( currentTemplate == "TableClickTemplate")){
                    //if(window.largeImgClicked == true) {
                        $("#nextNotification").fadeIn(800);
                        $("#nextBtn").addClass("animateNextButton");
                        $('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1}); // enabled the next button when navigation is set to non-linear.
                        if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
                            currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
                            currentRef.checkChapterCompletionStatus();
                        }
                    //}
                   
                }else if(( currentTemplate == "MultipleChoiceSingleSelectTemplate") || ( currentTemplate == "DragandDropCombinedTemplate") ||
				( currentTemplate == "DragandDropSequencing") || ( currentTemplate == "DropDownListTemplate") ||
				( currentTemplate == "Fill_In_the_Blanks_Template") || ( currentTemplate == "Fill_In_the_Blanks_DragandDrop")){
                    if(window.answersubmitted == true) {
                        $("#nextNotification").fadeIn(800);
                        $("#nextBtn").addClass("animateNextButton");
                        $('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1}); // enabled the next button when navigation is set to non-linear.
                        if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
                            currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
                            currentRef.checkChapterCompletionStatus();
                        }
                    }
                }else if(( currentTemplate == "VideoTemplate")){
                    $("#playPauseBtn").css({ 'pointer-events': 'none', 'opacity': 0.5 });
                    if(currentRef.callAudioLoadEvent != undefined){
                        currentRef.callAudioLoadEvent();
                    }
                   
                }else if(( currentTemplate == "CollapseTemplate")){
                   
                }else if(( currentTemplate == "CongratulationTemplate")){
                    if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
                        currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
                        currentRef.checkChapterCompletionStatus();
                    }
                }
                else{
                  
                    //added to control the next notification after audio ends
					
                    $("#nextNotification").fadeIn(800);
                    $("#nextBtn").addClass("animateNextButton");
                    $('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1}); // enabled the next button when navigation is set to non-linear.
                    if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
                        currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
                        currentRef.checkChapterCompletionStatus();
                    }
                }
            }
            
            // if( ( currentTemplate == "ImageOnlyTemplate" ) ){
               
            //     if(window.largeImgClicked == true) {
                     
            //     }
            // }else if( ( currentTemplate == "CarouselTemplate" ) || currentTemplate == "CarouselImageOnlyTemplate"){
               
            //     if(window.slideCompleted == true && window.source != 'video') {
                   
            //     }
            // }else if( ( currentTemplate == "TableClickTemplate")){
            //     if(window.largeImgClicked == true) {
                   
            //     }
            // }
            // else{
                 
            // }
			

			
		
			currentRef.courseTrackObj.menuStatusArr = currentRef.menuStatusArr;
			currentRef.courseTrackObj.curChapterIndex = currentRef.curChapterIndex;
			currentRef.courseTrackObj.curPageIndex = currentRef.curPageIndex;
			currentRef.courseTrackObj.currentIndex = currentRef.currentIndex;
			// console.log(currentRef.courseTrackObj)
			$(".completed").css({'pointer-events': 'auto', 'opacity': 1});
		
        } else {
            trace("triggered");
        }

        var totalNoOfPages = currentRef.courseTrackObj.menuStatusArr[0].pages;
        var totalNoOfVisitedPages = 0;
        for(var i = 0; i < totalNoOfPages.length; i++){
            if(totalNoOfPages[i].isVisited == "true"){
                totalNoOfVisitedPages++;
            }
        }
       
        var progressOfCourse = (totalNoOfVisitedPages / totalNoOfPages.length) * 100;
        progressOfCourse = Math.floor(progressOfCourse);
        progressOfCourse = progressOfCourse + "%";

		if (_model.getAppDataObj().scorm == "scorm") {
           

            _model.getScormReference().storeTrackingData( JSON.stringify(currentRef.courseTrackObj) ); //Menu Status to LMS.
            _model.getScormReference().storeVisitedScreenNo(currentRef.currentIndex + 1);
            _model.getScormReference().storeProgress(progressOfCourse);
			
			var chapterCompletionCount = 0;
			
			for(var i=0;i<currentRef.menuStatusArr.length;i++){
				if(currentRef.menuStatusArr[i].status == "COMPLETED"){
					chapterCompletionCount++;	
				}
			}
			
			var completionStatus = _model.getScormReference().retrieveCompletionStatus();
			
			
			
			if(completionStatus != 'passed'){
				
				//_model.getScormReference().storeAssessmentScore(scoreInPercentage);
				//if(chapterCompletionCount == currentRef.menuStatusArr.length){
				if(_model.getTOCDataArr()[currentRef.currentIndex].templateName == "CongratulationTemplate"){
                   
                    currentRef.courseCompletionStatus = true;
					_model.getScormReference().storeAssessmentScore(scoreInPercentage);
					_model.getScormReference().storeCompletionStatus(scoreInPercentage);
				}
			}else{
				/* if(chapterCompletionCount == currentRef.menuStatusArr.length){
					_model.getScormReference().storeAssessmentScore(scoreInPercentage);
					_model.getScormReference().storeCompletionStatus();		
				} */
            }
            
            var courseCompletionStatus = _model.getScormReference().retrieveCompletionStatusTracking();

            if(currentTemplate == "CongratulationTemplate"){
                if(courseCompletionStatus != undefined){
                    if(courseCompletionStatus != "completed"){
                        _model.getScormReference().storeCompletionStatusTracking("completed");
                    }
                }
            }
            

        }else if(_model.getAppDataObj().scorm != "scorm"){
			localStorage.setItem('build_one_brick_thick_corner_wall_using_english_mond_method_localised',JSON.stringify(currentRef.courseTrackObj) );		
        }
		
		if(currentTemplate == "CarouselTemplate" || currentTemplate == "CarouselTemplateCenterContainer"){
			//$('#videoContainer').attr('controls', false);
            $('#videoContainer').trigger('play');
            currentRef.VideoplaypauseFlag = true;
		}
        
        
    }

    this.loadCurrentPage = function (currentIndex) {

        

		$("#helpBtn, #courseMenuBtn, #resourceBtn").css({"pointer-events":"auto", "opacity":"1"});
		$("#playPauseBtn, #audioMuteBtn").css({'pointer-events': 'auto', 'opacity': 1}); 
        trace(":: Loading Current Request Page from Page Collection :: ");
	
        currentRef.playPauseFlag = true;
        currentRef.manualStorpTriggered = false;
        clearInterval(currentRef.videoInterval);
        $("#nextBtn").removeClass("animateNextButton");
        //alert(JSON.stringify(currentRef));
        StaticLibrary.SHOW_PRE_LOADER();
        currentRef.audioManager.stopAudio();
        $("#jumpToTxt").val("");
        
           
       

		if(currentTemplateObj){
			currentTemplateObj.clear();
        }
        
        // if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
		// 	currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.currentIndex].isVisited = "true";
		// 	currentRef.checkChapterCompletionStatus();
		// }
		
		currentRef.courseTrackObj.menuStatusArr = currentRef.menuStatusArr;
		currentRef.courseTrackObj.curChapterIndex = currentRef.curChapterIndex;
		currentRef.courseTrackObj.curPageIndex = currentRef.curPageIndex;
        currentRef.courseTrackObj.currentIndex = currentRef.currentIndex;
        

        var totalNoOfPages = currentRef.courseTrackObj.menuStatusArr[0].pages;
        var totalNoOfVisitedPages = 0;
        for(var i = 0; i < totalNoOfPages.length; i++){
            if(totalNoOfPages[i].isVisited == "true"){
                totalNoOfVisitedPages++;
            }
        }
       
        var progressOfCourse = (totalNoOfVisitedPages / totalNoOfPages.length) * 100;
        progressOfCourse = Math.floor(progressOfCourse);
        progressOfCourse = progressOfCourse + "%";
       
		if (_model.getAppDataObj().scorm == "scorm") {
			_model.getScormReference().setSessionTime();
            _model.getScormReference().storeTrackingData( JSON.stringify(currentRef.courseTrackObj) ); //Menu Status to LMS.
            _model.getScormReference().storeVisitedScreenNo(currentRef.currentIndex + 1);
            _model.getScormReference().storeProgress(progressOfCourse);
            
		}else if(_model.getAppDataObj().scorm != "scorm"){
           
			localStorage.setItem('build_one_brick_thick_corner_wall_using_english_mond_method_localised',JSON.stringify(currentRef.courseTrackObj) );		
		}
		
		// if( /iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
		// 	$("#audioMuteBtn").css({'pointer-events': 'none', 'opacity': 0.5});
		// }
		
		$("#previousBtn").css({'pointer-events': 'auto', 'opacity': 1});
        _model.setTemplateStatus(false);
        _model.setAudioStatus(false);

		//added to control the next notification after audio ends
		$("#nextNotification").hide();
		
        //$("#playPauseBtn img").attr('src', 'assets/images/pause_button.png'); // Added to act like pause button on page starts
        $("#playPauseBtn i").addClass("fa-pause").removeClass("fa-play");
       if (_model.getAppDataObj().linear == "true") {
            $('#nextBtn').css({'pointer-events': 'none', 'opacity': 0.5}); // disable the next button when navigation is set to linear.
        } else {
			//alert("next enabling"+_model.getAppDataObj().linear);
            $('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1}); // enabled the next button when navigation is set to non-linear.
        }
        
		if ( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
			if (currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited == "true") {
				
				$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
			}
		}
		
        $("#parentContainer").html('');

        currentRef.currentPageToLoadObj = _model.getTOCDataArr()[currentIndex];
        currentRef.currentPageTranscript = currentRef.currentPageToLoadObj.transcript;
        if(currentRef.currentPageTranscript == ""){
            $("#transcriptBtn").css({"pointer-events":"none","opacity": "0.5"});
            $("#playPauseBtn").css({"pointer-events":"none","opacity": "0.5"});
            $("#audioPopup").hide();
        }else{
            $("#transcriptBtn").css({"pointer-events":"auto","opacity": "1"})
            $("#playPauseBtn").css({"pointer-events":"auto","opacity": "1"});
            $("#audioPopup").show();
        }

        trace(currentRef.currentPageToLoadObj);

        if (currentRef.currentPageToLoadObj.isLocal == "true") {
            trace(":: Only loading HTML page from base folder location ::");
            var htmlURL = _model.getCourseDataObj().baseURL + "pages/" + currentRef.currentPageToLoadObj.templateName + ".html?version=" + StaticLibrary.generateRandom();
            trace("HTML Page URL : " + htmlURL);
            var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadFromExternalSource(htmlURL, "true", "html", null, currentRef.loadExternalPageSuccessHandler);

        } else {
            trace(":: Going to load JSON and on competition loading of HTML Pages started ::");
           
            var jsonURL = _model.getCourseDataObj().baseURL + "assets/data/content/" + currentRef.currentPageToLoadObj.templateJSON + "." + StaticLibrary.DATA_TYPE + "?version=" + StaticLibrary.generateRandom();
            trace("JSON Data URL : " + jsonURL);
            
            var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadFromExternalSource(jsonURL, "true", StaticLibrary.DATA_TYPE, this.externalDataLoadErrorHandler, this.externalDataLoadHandler);
        }

        /************** Making menu Linear starts*******************/
        
        $("#menuContainerList li").removeClass("menu_active");
        
        var currentTemplate = currentRef.currentPageToLoadObj.templateName;
    
        if(( currentTemplate == "MultipleChoiceSingleSelectTemplate") || ( currentTemplate == "DragandDropCombinedTemplate") ||
        ( currentTemplate == "DragandDropSequencing") || ( currentTemplate == "DropDownListTemplate") ||
        ( currentTemplate == "Fill_In_the_Blanks_Template") || ( currentTemplate == "Fill_In_the_Blanks_DragandDrop")){
            currentRef.holdCurrentIndex = currentRef.currentIndex;
          
            for(var i = 0; i < currentRef.repeadtedTitleArray.length;i++){
                var repeatedTitleIdStart = Number(currentRef.repeadtedTitleArray[i].id);
                var repeatedTitleIdEnd = Number(repeatedTitleIdStart+currentRef.repeadtedTitleArray[i].count);

                if(currentRef.currentIndex >=repeatedTitleIdStart && currentRef.currentIndex <=repeatedTitleIdEnd){
            
                    currentRef.holdCurrentIndex = repeatedTitleIdStart;
                }

            }
           
            $("#menuItem_" + currentRef.holdCurrentIndex).addClass("menu_active");
            
           
        }else{
            $("#menuItem_" + currentRef.currentIndex).addClass("menu_active");
            
        }
        
        

        if (_model.getAppDataObj().linear == "true") {
            $(".menu_active").css({'pointer-events': 'auto', 'opacity': 1}); //making current page in menu not clickable
        }
        /************** Making menu Linear ends*******************/
	
		//making next button in last and first page to inactive state
		if (currentRef.currentIndex >= (_model.getTOCDataArr().length - 1)) {
			
		 	$("#nextBtn").css({'pointer-events': 'none', 'opacity': 0.5});
		}
		if (currentRef.currentIndex < 1){
			$("#previousBtn").css({'pointer-events': 'none', 'opacity': 0.5});
		}
		
        $(".completed").css({'pointer-events': 'auto', 'opacity': 1});
 
    }

    this.trackNetworkForJsonData = function(){
        if(navigator.onLine){
            $("#network-status").hide();

            var jsonURL = _model.getCourseDataObj().baseURL + "assets/data/content/" + currentRef.currentPageToLoadObj.templateJSON + "." + StaticLibrary.DATA_TYPE + "?version=" + StaticLibrary.generateRandom();

            var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadFromExternalSource(jsonURL, "true", StaticLibrary.DATA_TYPE, currentRef.externalDataLoadErrorHandler, currentRef.externalDataLoadHandler);

            clearInterval(timeIntervalforNetworkConnectionApp);
        }
    }

    this.externalDataLoadErrorHandler = function(jqXHR, exception) {
        if(jqXHR.status == 0){
            $("#network-status").show();
            timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonData, 1000);
        }
    }

    this.externalDataLoadHandler = function (data) {
    
        trace(":: External JSON Loading Completed ::");
        trace(data);

        _model.setCurrentPageDataObj(data);

        trace("Template Location : " + _model.getAppDataObj().templateLocation);
        trace("Template Name : " + currentRef.currentPageToLoadObj.templateName);

        var htmlURL = _model.getAppDataObj().templateLocation + currentRef.currentPageToLoadObj.templateName + ".html?version=" + StaticLibrary.generateRandom();
        trace("Template Page Location : " + htmlURL);

        trace(":: Loading HTML Template Started ::");
        var apiServiceLoadAppData = new APIService();
        apiServiceLoadAppData.loadFromExternalSource(htmlURL, "true", "html", currentRef.loadExternalPageErrorHandler, currentRef.loadExternalPageSuccessHandler);
    }

    this.trackNetworkForJsonHtml = function(){
        if(navigator.onLine){
            $("#network-status").hide();

            var htmlURL = _model.getAppDataObj().templateLocation + currentRef.currentPageToLoadObj.templateName + ".html?version=" + StaticLibrary.generateRandom();

            var apiServiceLoadAppData = new APIService();
            apiServiceLoadAppData.loadFromExternalSource(htmlURL, "true", "html", currentRef.loadExternalPageErrorHandler, currentRef.loadExternalPageSuccessHandler);

            clearInterval(timeIntervalforNetworkConnectionApp);
        }
    }

    this.loadExternalPageErrorHandler = function(jqXHR, exception) {
        if(jqXHR.status == 0){
            $("#network-status").show();
            timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
        }
    }

    //Add all the template that needs to be involved in the Framework in the below Switch case.
    this.loadExternalPageSuccessHandler = function (pageHTMLStr) {
        _couseMenuSelected = false;
        trace(":: Loading HTML Template Completed ::");
        // changes new
        // currentRef.repeatedTitle = "";
		// var repeatedTitleId = Number(currentRef.repeatedTitleId);
		// var repeatTitleConunt = Number(currentRef.repeadtedTitleArray.length);
		// currentRef.repeadtedTitleArray = [];
        // currentRef.repeatedTitleVisitedCount = 0;
		//  for(var i = repeatedTitleId; i < (repeatedTitleId+repeatTitleConunt); i++){
            
		// 	currentRef.repeadtedTitleArray.push(currentRef.menuStatusArr[0].pages[i].isVisited) 
		//  }
         currentRef.repeatedTitleArrayMethod();
         currentRef.setKnowledgeCheckStatusBar();
    
		//  setTimeout(function(){
		// 	if(currentRef.repeatedTitleVisitedCount == 0){
		
		// 		$("#menuItem_" + currentRef.repeatedTitleId).removeClass('completed').children('i').eq(0).remove();
		// 	}else if(currentRef.repeatedTitleVisitedCount > 0 &&currentRef.repeatedTitleVisitedCount < currentRef.repeadtedTitleArray.length){
		
		// 		$("#menuItem_" + currentRef.repeatedTitleId).removeClass('completed').addClass("onprocess").children('i').eq(0).remove()
		// 		$("#menuItem_" + currentRef.repeatedTitleId).prepend("<i class='fa fa-spinner text-default pull-right'></i>")
		// 	}else if(currentRef.repeatedTitleVisitedCount == currentRef.repeadtedTitleArray.length){
		// 		$("#menuItem_" + currentRef.repeatedTitleId).addClass('completed').children('i').eq(0).remove()
		// 		$("#menuItem_" + currentRef.repeatedTitleId).prepend("<i class='fa fa-check-circle text-default pull-right'></i>")
		// 	}
		// },200)
        //changes new end
		if ((_model.getAppDataObj().linear == "false")) {
			if(!$(".menu_active i").hasClass("pull-right")){
				$(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
			}
		}
		
        $("#parentContainer").html('');
        $("#parentContainer").html(pageHTMLStr).promise().done(function () {

            trace(':: Page HTML content painted in the container ::');

            currentTemplate = currentRef.currentPageToLoadObj.templateName;
            currentTemplateObj;
            
            trace(currentTemplate);
           
            switch (currentTemplate) {
                case "TextSingleImageTemplate":
                    if(typeof(TextSingleImageTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new TextSingleImageTemplateController();
                break;

                case "TextOnlyTemplate":
                    if(typeof(TextOnlyTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new TextOnlyTemplateController();
                break;

                case "TextMultiImageTemplate":
                    if(typeof(TextMultiImageTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new TextMultiImageTemplateController();
                break;

                case "ClickAndRevealAccordionTemplate":
                    if(typeof(ClickAndRevealAccordionTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new ClickAndRevealAccordionTemplateController();
                break;

                case "TextImageandButtonPopupTemplate":
                    if(typeof(TextImageAndButtonPopupTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new TextImageAndButtonPopupTemplateController();
                break;

                case "ClickAndRevealLayerTemplate":
                    if(typeof(ClickAndRevealLayerTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new ClickAndRevealLayerTemplateController();
                break;

                case "TextImageAndTableTemplate":
                    if(typeof(TextImageAndTableTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new TextImageAndTableTemplateController();
                break;

                case "MultipleChoiceSingleSelectTemplate":
                    if(typeof(MultipleChoiceSingleSelectTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new MultipleChoiceSingleSelectTemplateController(currentRef);
                break;
				
				case "MultipleChoiceSingleSelectImageTemplate":
                    if(typeof(MultipleChoiceSingleSelectImageTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new MultipleChoiceSingleSelectImageTemplateController();
                break;

                case "MultipleChoiceMultiSelectTemplate":
                    if(typeof(MultipleChoiceMultiSelectTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new MultipleChoiceMultiSelectTemplateController();
                break;

                case "TrueandFalseTemplate":
                    if(typeof(TrueandFalseTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new TrueandFalseTemplateController();
                break;

                case "MatchDropDownTemplate":
                    if(typeof(MatchDropDownTemplateTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new MatchDropDownTemplateTemplateController();
                break;

                case "CongratulationTemplate":
                    if(typeof(CongratulationTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new CongratulationTemplateController();
                break;

                case "VideoTemplate":
                    if(typeof(VideoTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new VideoTemplateController(currentRef);
                break;
				
				case "ModuleVideoTemplate":
                    if(typeof(ModuleVideoTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new ModuleVideoTemplateController();
                break;

				case "SliderTemplate":
                    if(typeof(SliderTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
                    currentTemplateObj = new SliderTemplateController(currentRef);
                break;

				case "ImageOnlyTemplate":
                    if(typeof(ImageOnlyTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				 currentTemplateObj = new ImageOnlyTemplateController();				
				break;
				 
				case "TableClickTemplate":
                    if(typeof(TableClickTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				 currentTemplateObj = new TableClickTemplateController(currentRef);				
				break;
				
				case "ImageWithAudioTemplate":
                    if(typeof(ImageWithAudioController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				 currentTemplateObj = new ImageWithAudioController(currentRef);				
				break;
				
				case "ImageWithAudioButtonTemplate":
                    if(typeof(ImageWithAudioButtonController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				 currentTemplateObj = new ImageWithAudioButtonController(currentRef);				
				break;
				
				case "DragAndDropTemplate":
                    if(typeof(DragAndDropTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				 currentTemplateObj = new DragAndDropTemplateController(currentRef);				
				break;
				
				case "DragAndDropTemplate1":
                    if(typeof(DragAndDropTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				 currentTemplateObj = new DragAndDropTemplateController(currentRef);				
				break;

                case "DragandDropCombinedTemplate":	
                    if(typeof(DragandDropCombinedTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }	
        		currentTemplateObj = new DragandDropCombinedTemplateController(currentRef);						
				break;
				
				case "MultipleChoiceMultiSelectwithImageTemplate":
                    if(typeof(MultipleChoiceMultiSelectwithImageTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				 currentTemplateObj = new MultipleChoiceMultiSelectwithImageTemplateController();				
				break;
				
				case "HotSpotClickableTemplate":
                    if(typeof(HotSpotClickableTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				 currentTemplateObj = new HotSpotClickableTemplateController(currentRef);				
				break;
				
				case "MultipleChoiceSingleSelectwithImageTemplate":
                    if(typeof(MultipleChoiceSingleSelectWithImageTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				 currentTemplateObj = new MultipleChoiceSingleSelectWithImageTemplateController();				
				break;
				
				case "TrueandFalseWithImageTemplate":
                    if(typeof(TrueandFalseWithImageTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				 
				 currentTemplateObj = new TrueandFalseWithImageTemplateController();				
				break;
				
				case "MultipleChoiceSingleSelectImageWithImageTemplate":
                    if(typeof(MultipleChoiceSingleSelectImageWithImageTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				 currentTemplateObj = new MultipleChoiceSingleSelectImageWithImageTemplateController();				
				break;
				
				case "CarouselTemplate":
                    if(typeof(CarouselTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				currentTemplateObj = new CarouselTemplateController(currentRef);				
				break;

				case "CarouselImageOnlyTemplate":
                    if(typeof(CarouselImageOnlyTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				currentTemplateObj = new CarouselImageOnlyTemplateController(currentRef);				
				break;

				case "CollapseTemplate":
                    if(typeof(CollapseTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				currentTemplateObj = new CollapseTemplateController(currentRef);				
                break;

                case "DragandDropSequencing":
                    if(typeof(DragandDropSequencingController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }
				currentTemplateObj = new DragandDropSequencingController(currentRef);
			    break;

                case "DragandDropCombinedTemplate":	
                    if(typeof(DragandDropCombinedTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }	
			    currentTemplateObj = new DragandDropCombinedTemplateController(currentRef);						
                break;
                
                case "Fill_In_the_Blanks_DragandDrop":
                    if(typeof(Fill_In_the_Blanks_DragandDrop_TemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }	
			    currentTemplateObj = new Fill_In_the_Blanks_DragandDrop_TemplateController(currentRef);				
                break;

                case "CarouselTemplateCenterContainer":
                    if(typeof(CarouselTemplateController) == "undefined"){
                        $("#network-status").show();
                        timeIntervalforNetworkConnectionApp = setInterval(currentRef.trackNetworkForJsonHtml, 1000);
                        return true;
                    }	
                    currentTemplateObj = new CarouselTemplateController(currentRef);				
                break;
            
                default:
                    trace(":: Template not found, please check with administrator ::");
                break;
            }

            currentTemplateObj.init(_model.getCurrentPageDataObj());

            $("#paginationTxt").html('');
            $("#paginationTxt").html((currentRef.currentIndex + 1) + " / " + _model.getTOCDataArr().length);


            $("#audioTranscriptPopupContainer").html('');
			
            if(currentTemplate !=  "CongratulationTemplate1"){
               
				$("#audioTranscriptPopupContainer").html(_model.getTOCDataArr()[currentRef.currentIndex].transcript);
                //$("#playPauseBtn img").attr('src', 'assets/images/pause_button.png'); // Added to act like pause button on page starts
                $("#playPauseBtn i").addClass("fa-pause").removeClass("fa-play");
                trace("Audio Path : " + _model.getCourseDataObj().baseURL + "assets/media/audio/" + _model.getTOCDataArr()[currentRef.currentIndex].pageAudio);
                currentRef.manualStorpTriggered = false;
				currentRef.audioManager.loadAudio(_model.getCourseDataObj().baseURL + "assets/media/audio/" + _model.getTOCDataArr()[currentRef.currentIndex].pageAudio);
			}else{
				// currentRef.audioManager.clearAudio();
				// StaticLibrary.HIDE_PRE_LOADER();
			}
        });
    }

    //function to control the visibility of the framework level page loading.
    this.controlVisibility = function (currentView) {
        if(currentView == "landingPage"){
            $('.main_frame_screen').hide();
			$('.system_menu').hide();
		}else{
            $('.main_frame_screen').show();
			$('.system_menu').show();
		}
        trace("Current Visible Container : " + currentView);
        $("#landingPage").hide();
        $("#innerContainer").hide();
        $("#" + currentView).show();
    }
	
	//Check Chapter Completion Status
	this.checkChapterCompletionStatus = function(){
		var pageCompletionCount = 0;
		var chapterCompletionCount  = 0;
		if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages.length != undefined ){
			for(var j=0;j<currentRef.menuStatusArr[currentRef.curChapterIndex].pages.length;j++){
				if(currentRef.menuStatusArr[currentRef.curChapterIndex].pages[j].isVisited == "true"){
						pageCompletionCount++;
				}
			}
			
			if(pageCompletionCount == currentRef.menuStatusArr[currentRef.curChapterIndex].pages.length){
				currentRef.menuStatusArr[currentRef.curChapterIndex].status = "COMPLETED";
			}
		}
				
		for(var i=0;i<currentRef.menuStatusArr.length;i++){
			if(currentRef.menuStatusArr[i].status == "COMPLETED"){
				chapterCompletionCount++;	
			}
		}

		if (_model.getAppDataObj().scorm == "scorm") {
           if(chapterCompletionCount == currentRef.menuStatusArr.length){
			
				//_model.getScormReference().storeCompletionStatus("completed");
				$("#pageJump").show();
			}else{
				$("#pageJump").hide();
			}
        }
	}
	
	//update module status
	this.updateModuleMenuStatus = function(){
		for (var i = 0; i < _model.getLinearTOCDataArr().length; i++) {
			if(_model.getLinearTOCDataArr()[i].duration != undefined){
				if( currentRef.menuStatusArr[i].status == 'NOT_STARTED' ){
					if( _model.getAppDataObj().linear == "true" ){
						if(i == 0){
							$("#chapterMenu").children().eq(i).find('.unlock_icon').show();	
						}else{
							$("#chapterMenu").children().eq(i).find('.lock_icon').show();
						}
					}else{
						$("#chapterMenu").children().eq(i).find('.unlock_icon').show();
					}
				}else if( currentRef.menuStatusArr[i].status == 'IN_PROGRESS' ){
					$("#chapterMenu").children().eq(i).find('.unlock_icon').hide();
					$("#chapterMenu").children().eq(i).find('.lock_icon').hide();
					$("#chapterMenu").children().eq(i).find('.progress_icon').show();
				}else if( currentRef.menuStatusArr[i].status == 'COMPLETED' ){
					$("#chapterMenu").children().eq(i).find('.unlock_icon').hide();
					$("#chapterMenu").children().eq(i).find('.lock_icon').hide();
					$("#chapterMenu").children().eq(i).find('.progress_icon').hide();
					$("#chapterMenu").children().eq(i).find('.completed_icon').show();
				}
			}
		}
		
		$("#chapterMenu li").each(function(ind){
			$(this).attr('data-status',currentRef.menuStatusArr[ind].status);
		});
		
		$("#chapterMenu li").each(function(ind){
			var curEleStatus = $(this).attr('data-status');
			var nextEleStatus = $(this).next().attr('data-status');
			if( ( curEleStatus == 'COMPLETED' ) && (nextEleStatus == 'NOT_STARTED') ){
				$(this).next().find('.icon_menu').hide();	
				$(this).next().find('.unlock_icon').show();	
			}
		});
	}
	
}