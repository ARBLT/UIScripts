var DataParser = function(){

};

DataParser.parseAppData = function(data){

	var _model = DataManager.getInstance();
	var appDataVO = new AppDataVO(data);
	_model.setAppDataObj(appDataVO);
};

DataParser.parseCourseData = function(data){
	var _model = DataManager.getInstance();
	var courseDataVO = new CourseDataVO();

	courseDataVO.projectTitle = data.projectTitle;
	courseDataVO.title = data.title;
	courseDataVO.baseURL = "courses/" + _model.getAppDataObj().courseName + "/";

	courseDataVO.contentURL = data.contentURL;
	courseDataVO.occupierName = data.occupierName;
	courseDataVO.masteryscore = data.masteryscore;
	courseDataVO.isCourseEnable = data.isCourseEnable;
	courseDataVO.duration = data.duration;
	courseDataVO.resources = data.resources;
	courseDataVO.handouts = data.handouts;
	courseDataVO.desktopHelp = data.desktopHelp;

	courseDataVO.courseMenuTitleText = data.courseMenuTitleText;
	courseDataVO.goToPageLabelText = data.goToPageLabelText;
	courseDataVO.goBtnText = data.goBtnText;

	_model.setCourseDataObj(courseDataVO);
};

DataParser.parseTOCData = function(data){
		var _model = DataManager.getInstance();	
	
		var linearTemplateArr = [];
		var nonLinearTemplateArr = [];
		
		$.each(data, function(index,val){
			var temp=[];			
			if(data[index].pages != undefined){
				for(var i=0; i<data[index].pages.length; i++){
					var tocPages = new TOCPageDataVO(data[index].pages[i])
					temp.push(tocPages);
					linearTemplateArr.push(tocPages)
				}
				var tocDataVo = new TOCmainDataVO(data[index].pageTitle,temp,data[index].status,data[index].duration)
				
			}else{
				var tocDataVo = new TOCPageDataVO(data[index]);
				linearTemplateArr.push(tocDataVo);
			}
			nonLinearTemplateArr.push(tocDataVo);
		});	 
		_model.setLinearTOCDataArr(nonLinearTemplateArr);
		_model.setTOCDataArr(linearTemplateArr);
		
};

