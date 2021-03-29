// Data Manager to store all global variables.

var DataManager = (function () {
    // Instance stores as an reference for the Singleton Class
    var _instance;

    function _init() {
        // Private methods and variables will go here
        var _appDataObj = new Object();
        var _courseDataObj = new Object();

        var _TOCDataArr = new Array();
		var _TOCLinearDataArr = new Array();
		var _templateData = new Array();

        var _currentPageDataObj = new Object();
        var _audioReference = null;
		var _popupAudioReference = null;
        var _templateStatus = false;
        var _audioStatus = false;
        var _preloaderFlag = true;

        //Need to check for the below variables for the understanding.
        var _lastPageloaded = true;

        var _audioTimeUpdateFn = null;
				
		var _scormObj;
        //Getter and Setter section for the private variables.

        function _getPreloaderFlag(){
            return _preloaderFlag;
        }

        function _setPreloaderFlag(value){
            _preloaderFlag = value;
        }



        function _getAudioStatus(){
            return _audioStatus;
        }

        function _setAudioStatus(value){
            _audioStatus = value;
        }

        function _getTemplateStatus(){
            return _templateStatus;
        }

        function _setTemplateStatus(value){
            _templateStatus = value;
        }


        function _getCurrentPageDataObj(){
            return _currentPageDataObj;
        }

        function _setCurrentPageDataObj(value){
            _currentPageDataObj = value;
        }

        function _getlastPageloaded(){
            return _lastPageloaded;
        }

        function _setlastPageloaded(value){
            _lastPageloaded = value;
        }


        function _getAudioTimeUpdateFn(){
            return _audioTimeUpdateFn;
        }

        function _setAudioTimeUpdateFn(value){
            _audioTimeUpdateFn = value;
        }

        function _getAudioReference(){
            return _audioReference;
        }
		
		 function _getPopupAudioReference(){
            return _popupAudioReference;
        }

        function _setAudioReference(value){
            _audioReference = value;
        }
		
		function _setPopupAudioReference(value){
            _popupAudioReference = value;
        }

		function _getTemplateData(){
            return _templateData;
        }

        function _setTemplateData(value){
            _templateData = value;
        }

		function _getAppDataObj(){
            return _appDataObj;
        }

        function _setAppDataObj(value){
            _appDataObj = value;
        }
		
		function _getCourseDataObj(){
            return _courseDataObj;
        }

        function _setCourseDataObj(value){
            _courseDataObj = value;
        }
        function _changeCourseDataBaseUrl(value) {
            _courseDataObj.baseURL = value;
        }
		
		function _getTOCDataArr(){
            return _TOCDataArr;
        }

        function _setTOCDataArr(value){
            _TOCDataArr = value;
        }
		function _getLinearTOCDataArr(){
            return _TOCLinearDataArr;
        }

        function _setLinearTOCDataArr(value){
            _TOCLinearDataArr = value;
			//_TOCLinearDataArr.push(value);
        }		
		
		function _setScormReference(obj){
			_scormObj =  obj;		
		}
		
		function _getScormReference(){
			return _scormObj;
		}
		
        return {
            // Public methods and variables

            setPreloaderFlag:_setPreloaderFlag,
            getPreloaderFlag:_getPreloaderFlag,

            setAudioStatus:_setAudioStatus,
            getAudioStatus:_getAudioStatus,

            setTemplateStatus:_setTemplateStatus,
            getTemplateStatus:_getTemplateStatus,

            getCurrentPageDataObj:_getCurrentPageDataObj,
            setCurrentPageDataObj:_setCurrentPageDataObj,

            getAppDataObj : _getAppDataObj,
            setAppDataObj : _setAppDataObj,

			getCourseDataObj : _getCourseDataObj,
            setCourseDataObj : _setCourseDataObj,
            changeCourseDataBaseUrl: _changeCourseDataBaseUrl,
			
			getTOCDataArr : _getTOCDataArr,
            setTOCDataArr : _setTOCDataArr,	
			
			getLinearTOCDataArr : _getLinearTOCDataArr,
            setLinearTOCDataArr : _setLinearTOCDataArr,	
			
			getTemplateData: _getTemplateData,
            setTemplateData: _setTemplateData,

            getlastPageloaded:_getlastPageloaded,
            setlastPageloaded:_setlastPageloaded,

            setAudioReference:_setAudioReference,
            getAudioReference:_getAudioReference,
			
			setPopupAudioReference:_setPopupAudioReference,
            getPopupAudioReference:_getPopupAudioReference,

            setAudioTimeUpdateFn:_setAudioTimeUpdateFn,
            getAudioTimeUpdateFn:_getAudioTimeUpdateFn,
			
			setScormReference : _setScormReference,
			getScormReference : _getScormReference
        };
    };

    return {
        // getInstance function to ensure that everything the object is same, if called first time it will return new Instance else same object will be return
		
        getInstance: function () {
            if ( !_instance ) {
                _instance = _init();
            }
            return _instance;
        }
    };
})();