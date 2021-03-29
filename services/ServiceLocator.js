var ServiceLocator = function(){
    this.loadExternalData = function(urlToLoad, isSync, dataType, errorHandler, successHandler){
        $.ajax({
            url:urlToLoad + "?version="+StaticLibrary.generateRandom(),
            async:isSync,
            dataType:dataType,
            error:errorHandler,
            success:successHandler
        });
    }
}