var CollapseTemplateController = function(currentRef){

    var _this = this;
    var appControlAudio = currentRef;
    var collapseContent;
    var ids;
    var arr = [];
    var splice_num;
    var id_num;
    var data_count = 0;
    this.init = function(data){
        
		baseURL = _model.getCourseDataObj().baseURL;
		
        _this.currentData = data;
        _this.loadUI(_this.currentData);
        _this.addEventHandlers();
        
    }

    this.addEventHandlers = function() {
        $('.accordSign').bind('click',_this.toggleSign);
    }

    this.loadUI = function(data) {
        collapseContent = data.pageContent.collapseContent;
        var htmlContent = "";
        for(var i = 0; i < collapseContent.length; i++){
            htmlContent += "<div class='panel panel-default' >";
                htmlContent += "<div class='panel-heading' id='panel_"+i+"'>";
                    htmlContent += "<h4 class='panel-title'>";
                    htmlContent += "<a data-toggle='collapse' class='accordSign' data-parent='#accordion' id='accordSign_"+i+"' href='#collapse"+ (i+1) +"'><table><tr><td class='toggle_sign' id='plus"+i+"' style='font-weight: bold;width: 16px; display: inline-block;'>+</td><td style='line-height:25px;'>"+ collapseContent[i].title +"</td></tr></table></a>";
                    htmlContent += "</h4>";
                htmlContent += "</div>";

                htmlContent += "<div id='collapse"+ (i+1) +"' class='panel-collapse collapse'>";
                    htmlContent += "<div class='panel-body'>"+ collapseContent[i].body +"</div>";
                htmlContent += "</div>";
            htmlContent += "</div>";
            arr.push(i)
        }
        $(".panel-group").html(htmlContent)
        if(data.pageContent.topContent != "" || data.pageContent.topContent != undefined) {
			$(".top_content").html('').html(data.pageContent.topContent);
        }
        if(data.pageContent.bottomContent != "" || data.pageContent.bottomContent != undefined) {
			$(".bottom_content").html('').html(data.pageContent.bottomContent);
        }
        $("#heading").html("").html(data.pageContent.heading);
        
    }
    this.clear = function() {
        
    }
    this.toggleSign = function() {
        ids = $(this).attr("id").split("_")[1];
        $("#panel_"+ids).css("background-color","#dcdcdc");

        
        let state=$("#plus"+ids).html();
        if(state=="+"){
            $(".toggle_sign").html("").html("+");
            $("#plus"+ids).html("").html("&ndash;");
        }else if(state=="–"){

            $("#plus"+ids).html("").html("+");
        }
       
        id_num = parseInt(ids)
        splice_num = arr.indexOf(id_num)
        if(splice_num != -1)
        {
            arr.splice(splice_num,1);
            data_count++
        }
        else{
            
        }

        if(data_count == collapseContent.length)
        {
            $("#nextNotification").fadeIn(800);
            $("#nextBtn").addClass("animateNextButton");
            $('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
            var nextPage = currentRef.currentIndex + parseInt(1);
					$(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").css({'pointer-events': 'auto', 'opacity': 1}); 
                $(" #menuItem_"+currentRef.currentIndex+" ").addClass('completed'); 
                
                //added to control tick mark in menus
			    if(!$(".menu_active i").hasClass("pull-right")){
				    $(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
                }
					if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
						currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
						currentRef.checkChapterCompletionStatus();
					}
        }
/*
       setTimeout(function(){
        $('.accordSign').each(function(){
            $(this).find('span').html('+');
            $("[aria-expanded=true]").find('span').html('-');
   
        });
       },100);
      */  
    }

    
}