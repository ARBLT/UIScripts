var scormAPI = function(){
	var scorm;
	var startTime;
	var isScormStarted;
	var _this = this;
	var totalScore = 0;
	
	// Init Scorm 
	function initScorm(){
		scorm = pipwerks.SCORM;
		scorm.version = "1.2";
		scorm.init();

		var date = new Date();
		startTime = date.getTime();
		isScormStarted = true;
		
		//checkNetworkConnection();
		
		var isCompleted = _this.retrieveCompletionStatus();
		
		if(isCompleted != 'passed' && isCompleted != 'failed' && isCompleted != 'completed'){
			scorm.set('cmi.core.lesson_status', 'incomplete');	
		}
		
		/* if( /Android|iPhone|iPod|iPad/i.test(navigator.userAgent) ) {
			window.onpagehide = function () { exitScorm();};
		}else{
			window.onbeforeunload = function () { exitScorm(); };
		} */
	}
	
	function checkNetworkConnection(){
		var isAlertShown = false;
		
		setInterval(function(){
			if(navigator.onLine == true){
				isAlertShown = false;
			}else{
				if(!isAlertShown){
					isAlertShown = true;
					alert('Network connection is lost. Your data will not be saved. Please check your internet connectivity');
				}
			}
		},10000);	
	}
	
	this.setSessionTime = function(){
		if(isScormStarted){
			var date = new Date();
			var diffTime = date.getTime() - startTime;
			
			var totalseconds = Math.round(diffTime / 1000);
			var hours = Math.round(totalseconds / 3600);
			var minutes = Math.round((totalseconds / 60) % 60);
			var seconds = totalseconds % 60;
			
			var fs = seconds < 10 ? "0" + seconds : "" + seconds;
			var fm = minutes < 10 ? "0" + minutes : "" + minutes;
			var fh = hours < 10 ? "0" + hours : "" + hours;
			if(fh > 999){
				var formatted = fh + ":" + fm + ":" + fs + ".00";
			}else if(fh > 99){
				var formatted = "0"+fh + ":" + fm + ":" + fs + ".00";
			}else{
				var formatted = "00"+fh + ":" + fm + ":" + fs + ".00";
			}
			
			scorm.set('cmi.core.session_time', formatted);
			scorm.save();
		}
	}
	
	// Getter Methods
	this.retrieveTrackingData = function(){
		var trackData = scorm.get('cmi.suspend_data');
		return trackData;
	}

	
	this.retrieveVisitedScreenNo = function(){
		var screenNo = scorm.get('cmi.core.lesson_location');
		return screenNo;
	}
	
	this.retrieveCompletionStatus = function(){
		var curStatus = scorm.get('cmi.core.lesson_status');
		return curStatus;	
	}

	this.retrieveCompletionStatusTracking = function(){
		var completionData = scorm.get('cmi.completion_status');
		
		return completionData;
	}
	
	// Setter Methods
	this.storeAssessmentScore = function(score){
		if(isScormStarted){
			scorm.set('cmi.core.score.raw', score);		
			totalScore =  score;
			scorm.save();
		}
	}
	
	this.storeVisitedScreenNo = function(screenNum){
		if(isScormStarted){
			scorm.set('cmi.core.lesson_location', screenNum);	
			scorm.save();
			
		}
	}
	
	this.storeTrackingData = function(trackData){
		if(isScormStarted){
			scorm.set('cmi.suspend_data', trackData);	
			scorm.save();
		}
	}
	
	this.storeCompletionStatusTracking = function(completionData){
		if(isScormStarted){
			scorm.set('cmi.completion_status', completionData);	
			scorm.save();
			
		}
	}

	this.storeProgress = function(progress){
		if(isScormStarted){
			scorm.set('cmi.progress_measure', progress);	
			scorm.save();			
			
		}
	}

	this.storeCompletionStatus = function(curScore){
		if(isScormStarted){
			//scorm.set('cmi.core.lesson_status', status);	
			var masteryScore = scorm.get("cmi.student_data.mastery_score");
		
			if(curScore >= masteryScore){
				scorm.set('cmi.core.score.raw', curScore);
				scorm.set('cmi.core.score.max', 100);
				scorm.set('cmi.core.score.min', 0);
				scorm.set('cmi.core.lesson_status', 'passed');	
				

			}else{
				scorm.set('cmi.core.score.raw', curScore);
				scorm.set('cmi.core.score.max', 100);
				scorm.set('cmi.core.score.min', 0);
				scorm.set('cmi.core.lesson_status', 'failed');
				
			}
			scorm.save();

			
		}
	}

	this.setMasteryScore = function(score){
		if(isScormStarted){
			scorm.set('cmi.student_data.mastery_score', score);	
			scorm.save();			
			
		}
	}
	
	this.setDurationOfCourse = function(totalTime){
		scorm.set('cmi.core.total_time', totalTime);
		scorm.save();
		
	}

	this.exitScorm = function(){
		//if(scorm.connection.isActive){
			_this.setSessionTime();
			scorm.save();
			scorm.quit();
		//}
	}
	
	initScorm();

}