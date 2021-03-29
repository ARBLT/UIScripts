/**
 * Created by Ravi Sharma on 8/11/2016.
 */

var CongratulationTemplateController = function(){

    var _this = this;
	var currentData;
    this.init = function(data){
        trace(":: Congratulation Template Controller Loaded ::");
		_this.currentData = data;
        _this.loadUI(data);
    }

    this.loadUI = function(data){
        trace(":: Congratulation Template Load UI ::");
		// console.log(data.pageContent.content)
        $("#heading").html("").html(data.pageContent.heading);
        $("#content").html("").html(data.pageContent.content);
        
		if((data.pageContent.bottomContent != undefined) && (data.pageContent.bottomContent != "")){ 
			$("#bottomCnt").show().html("").html(data.pageContent.bottomContent);
        }

        _model.setTemplateStatus(true);

        var temp = _model.getCourseDataObj().title.split(":");
        // console.log(_model.getCourseDataObj())
		$("#innerHead").html(data.pageContent.formtext);
        $("#conInnerText").html(data.pageContent.coursetitle);
        //$("#conInnerText").css("font-weight", "bold");
		 
		//$("#clickExit").html(data.pageContent.clickExitText);
		//$("#clickMenu").html(data.pageContent.clickMenuText);
		// console.log(_this.currentData.pageContent.language)
			if((_this.currentData.pageContent.language != undefined) && (_this.currentData.pageContent.instruction != "")){
			switch (_this.currentData.pageContent.language) {
				case 'English': 

				  $('#img').attr('src', 'assets/images/cong_img.png');	
				  $('#congradulation_text').attr('src', 'assets/images/cong_english.png');
				  $('#clickExit').html('<p>Click <b> Exit </b> from the browser to exit the course.</p>');
				  $('#clickMenu').html('<p>Click <b> Course Menu </b> to review any of the topics again.</p>');
				   break;
				case 'Hindi': 
				   $('#img').attr('src', 'assets/images/cong_img_hindi.png');
				   $('#congradulation_text').attr('src', 'assets/images/cong_hindi.png');
				   $('#clickExit').html('<p>कोर्स से बाहर आने के लिए, ब्राउजर में दिए गए <strong>एग्जिट</strong> पर क्लिक करें।</p>');
				   $('#clickMenu').html('<p>किसी भी विषय के पुनरावलोकन के लिए <strong>कोर्स मेनू</strong> पर क्लिक करें।</p>');
				  break;
				default:
				  $('#img').attr('src', 'assets/images/cong_img.png');
				  $('#congradulation_text').attr('src', 'assets/images/cong_english.png');
				  $('#clickExit').html('<p>Click  <b> Exit </b> from the browser to exit the course.</p>');
				  $('#clickMenu').html('<p>Click <b> Course Menu</b> to review any of the topics again.</p>');
			}
			
		}else{
			  $('#img').attr('src', 'assets/images/cong_img.png');
			  $('#congradulation_text').attr('src', 'assets/images/cong_english.png');
			  $('#clickExit').html('<p>Click  <b> Exit </b> from the browser to exit the course.</p>');
			  $('#clickMenu').html('<p>Click <b> Course Menu</b> to review any of the topics again.</p>');
		}
		
    }
	
	this.clear = function(){

	}
}