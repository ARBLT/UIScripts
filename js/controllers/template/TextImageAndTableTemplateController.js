/**
 * Created by Ravi Sharma on 8/12/2016.
 */

var TextImageAndTableTemplateController = function () {
    var _this = this;

    this.init = function (data) {
        trace(":: Text Image and Table Template Loaded ::");
        _this.loadUI(data);
    }

    this.loadUI = function (data) {
        trace(":: Text Image and Table Template UI Loaded ::");
        trace(data);
        $("#headDiv").html(data.pageContent.heading);
        $("#contentDiv").html(data.pageContent.content);
        $("#imgDiv").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + data.pageContent.image);

        $("#tableDiv").html(data.pageContent.tableContent);

        _model.setTemplateStatus(true);
    }
	
	this.clear = function(){

	}
	
}