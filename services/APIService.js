var APIService = function(){	
	
	this.loadAppConfigData = function(urlToLoad, isSync, dataType, errorHandler, successHandler){
        var serviceObj = new ServiceLocator();
        serviceObj.loadExternalData(urlToLoad, isSync, dataType, errorHandler, successHandler);
    }
		
	this.loadCourseData = function(urlToLoad, isSync, dataType, errorHandler, successHandler){
        var serviceObj = new ServiceLocator();
        serviceObj.loadExternalData(urlToLoad, isSync, dataType, errorHandler, successHandler);
    }
	
	this.loadTOCData = function(urlToLoad, isSync, dataType, errorHandler, successHandler){
        var serviceObj = new ServiceLocator();
        serviceObj.loadExternalData(urlToLoad, isSync, dataType, errorHandler, successHandler);
    }

    this.loadFromExternalSource = function(urlToLoad, isSync, dataType, errorHandler, successHandler){
        var serviceObj = new ServiceLocator();
        serviceObj.loadExternalData(urlToLoad, isSync, dataType, errorHandler, successHandler);
    }

    this.genericErrorHandler = function(error){
        trace(":: Service Error ::");
        trace("Error Status: "+ error.statusText + " : "+ error.status);
    }
	
};