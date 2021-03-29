/**
* Created by Venkatesh on 21/02/2017.
*/

var TableOnlyTemplateController = function(currentRef){
    
    var _this = this;
    var currentData;
    var tableLoop;
    var contents;
    var tabletd;
    var rowSpan;
    var appCntl = currentRef;
    var tableClassName = tableHead_1 = tableHead_2 = "";
    var headerLoop = 0;
    var tempArr = new Array();

    this.init = function(data){
        trace(":: Table Click Template Loaded ::");
        trace(data);
        $("#notesPanel").hide();
        $("#hints").hide();
        $("#resourcePanel").hide();
        $("#imagePopup").hide();
       
        _this.currentData = data;
        _this.loadUI(_this.currentData);
    }

    this.loadUI = function(data){
        trace(":: Paint the Text Image Template UI ::");
        trace(data);
        
        $("#heading").html('').html(data.pageContent.heading);
        $("#description").html('').html(data.pageContent.description);

        if((data.pageContent.notes != undefined) && (data.pageContent.notes != "")){
        $("#notes").html('').html(data.pageContent.notes);
        }
        if((data.pageContent.img != undefined) && (data.pageContent.img != "")){
            $("#img").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + data.pageContent.img);
            $("#cntPart").removeClass("col-lg-12 col-md-12").addClass("col-lg-7 col-md-8");
            $("#imageBlock").show();
        } else {
            $("#cntPart").removeClass("col-lg-7 col-md-8").addClass("col-lg-12 col-md-12");
            $("#imageBlock").hide();
        }
        
        if((data.pageContent.tooltip != undefined) && (data.pageContent.tooltip != "")){
            $("#hints").show();
            //$("#toolTip").html('').html(data.pageContent.tooltip);
        } else {
            $("#hints").hide();
        }
        
        if((data.pageContent.tableClass != undefined) && (data.pageContent.tableClass != "")){
            tableClassName = 'class="'+data.pageContent.tableClass+'"';
        } else {
            tableClassName = "";
        }
        
        if((data.pageContent.tableHead1 != undefined) && (data.pageContent.tableHead1 != "")){
            tableHead_1 = data.pageContent.tableHead1;
        } else {
            tableHead_1 = "";
        }
        
        if((data.pageContent.tableHead2 != undefined) && (data.pageContent.tableHead2 != "")){
            tableHead_2 = data.pageContent.tableHead2;
        } else {
            tableHead_2 = "";
        }

        contents = "<table "+tableClassName+">";

        if((data.pageContent.tableHeading != undefined) && (data.pageContent.tableHeading != "")){
            tableHeading = data.pageContent.tableHeading;
            contents += "<thead><th colspan='6'>"+tableHeading+"</th></thead>";
        }
         else {
            tableHeading = "";
        }
    
        contents += "<thead>";

        headerLoopLength = Object.keys(data.pageContent.subHeader).length - 1;
        console.log(headerLoopLength)
    
            for(var key in data.pageContent.subHeader){
                if(data.pageContent.joinfirst2column){
                    if(headerLoop == 0) {
                        contents += "<th colspan='2'>"+ data.pageContent.subHeader[key] +"</th>";
                    }else{
                        contents += "<th>"+ data.pageContent.subHeader[key] +"</th>";
                    }
                }else if(data.pageContent.joinsecond2column){
                    if(headerLoop == headerLoopLength) {
                        contents += "<th colspan='2'>"+ data.pageContent.subHeader[key] +"</th>";
                    }else{
                        contents += "<th>"+ data.pageContent.subHeader[key] +"</th>";
                    }
                }else{
                    contents += "<th>"+ data.pageContent.subHeader[key] +"</th>";
                }
                
                headerLoop++;
           }

        contents += "</thead>";
    
        for(tableLoop = 0; tableLoop < data.pageContent.content.length; tableLoop++){
            // if((data.pageContent.content[tableLoop].dos_image != undefined) && (data.pageContent.content[tableLoop].dos_image != "")){
            //  dosClass = 'class="imagePopup" id="dos_'+tableLoop+'" data-toggle="modal" data-target="#imagePopup"';
            //  tempArr.push(tableLoop);
            // } else {
            //  dosClass = "";
            // }
            // if((data.pageContent.content[tableLoop].donts_image != undefined) && (data.pageContent.content[tableLoop].donts_image != "")){
            //  dontClass = 'class="imagePopup" id="donts_'+tableLoop+'" data-toggle="modal" data-target="#imagePopup"';
            // } else {
            //  dontClass = "";
            // }
            
            if((data.pageContent.content[tableLoop].tdClass != undefined) && (data.pageContent.content[tableLoop].tdClass != "")){
                tabletd = ' class="'+data.pageContent.content[tableLoop].tdClass+'"';
            } else {
                tabletd = "";
            }
            
            if((data.pageContent.content[tableLoop].rowspan != undefined) && (data.pageContent.content[tableLoop].rowspan != "")){
                rowSpan = ' rowspan="'+data.pageContent.content[tableLoop].rowspan+'"';
            } else {
                rowSpan = "";
            }       
            
            contents += "<tr" +tabletd+">";

            for(var key in data.pageContent.content[tableLoop]){
                
                 if((data.pageContent.content[tableLoop][key] != undefined) && (data.pageContent.content[tableLoop][key] != "")){
                    contents += "<td "+rowSpan+">"+data.pageContent.content[tableLoop][key]+"</td>";
                 }
            }
            
            // if((data.pageContent.content[tableLoop].dos != undefined) && (data.pageContent.content[tableLoop].dos != "")){
            //  contents += "<td "+rowSpan+">"+data.pageContent.content[tableLoop].dos+"</td>";
            // }
            
            // if((data.pageContent.content[tableLoop].donts != undefined) && (data.pageContent.content[tableLoop].donts != "")){
            //  contents += "<td>"+data.pageContent.content[tableLoop].donts+"</td>";
            // }
            
            contents += "</tr>";
            
            
            
        }
        
        contents += "</thead>";
        contents += "</table>";
        
        if((data.pageContent.description != undefined) && (data.pageContent.description != "")){ console.log("asdgs")
            contents += data.pageContent.description;
        }
        $("#imagePopup .close").on("click", _this.PopupHide);
        $("#myModal").on("hidden.bs.modal", _this.PopupHide);
        $("#content").html('').html(contents);
        $(".imagePopup").unbind("click").bind("click", _this.PopupImageHandler).css("cursor","pointer");
    
       // _model.setTemplateStatus(true);
    }
    
    this.clear = function(){

    }
    _this.PopupHide = function(){ 
    
        //appCntl.audioManager.playAudio();
                console.log("flag "+appCntl.playPauseFlag);
        /* if (appCntl.playPauseFlag) { console.log("paused")
            appCntl.playPauseFlag = false;
            appCntl.audioManager.pauseAudio();
            $("#playPauseBtn img").attr('src', 'assets/images/play_button.png');
        } else { console.log("playing")
            appCntl.playPauseFlag = true;
            appCntl.audioManager.playAudio();
            $("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
        } */
        
         if(appCntl.playPauseFlag == false){
                appCntl.audioManager.pauseAudio();
            $("#playPauseBtn img").attr('src', 'assets/images/play_button.png');
            }
            else{
                 appCntl.audioManager.playAudio();
            } 
        
        
       }
    _this.PopupImageHandler = function(e){
        appCntl.audioManager.pauseAudio();
        var popupId = e.currentTarget.id.substring(e.currentTarget.id.indexOf('_') +1);
        var popupString = e.currentTarget.id.substr(0, e.currentTarget.id.indexOf('_'));
        $("#imagePopup").show();
        
        if(popupString == "dos"){
            $("#imageZoom").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.content[popupId].dos_image);
        }
        if(popupString == "donts"){
            $("#imageZoom").attr("src", _model.getCourseDataObj().baseURL + "assets/images/" + _this.currentData.pageContent.content[popupId].donts_image);
        }
        
        tempArr = jQuery.grep(tempArr, function(value) {
            return value != popupId;
        });
            
        if(tempArr.length == 0){
            _model.setTemplateStatus(true);
            EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
        }
    } 
}
