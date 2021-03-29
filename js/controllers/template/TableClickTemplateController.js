/**
 * Created by Venkatesh on 21/02/2017.
 */

var TableClickTemplateController = function(currentRef){
	
	var _this = this;
	var currentData;
	var tableLoop, ids;
	var contents;
	var contents1;
	var tabletd;
	var rowSpan;
	var appCntl = currentRef;
	var	tableClassName = tableHead_1 = tableHead_2 = "";
	var tempArr = new Array();
	var contentHeader = "";
	var collapseTh = "";
	var currentClickedCount = 0;
	var totalImageCount = 0;

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

		window.largeImgClicked = false;
		window.audioEnded = false;

        trace(":: Paint the Text Image Template UI ::");
        trace(data);
		
        $("#heading").html('').html(data.pageContent.heading);
        $("#description").html('').html(data.pageContent.description);
		


		if((data.pageContent.img != undefined) && (data.pageContent.img != "")){
			$("#img").attr("src",  "assets/images/" + data.pageContent.img);
			$("#cntPart").removeClass("col-lg-12 col-md-12").addClass("col-lg-7 col-md-8");
			$("#imageBlock").show();
		} else {
			$("#cntPart").removeClass("col-lg-7 col-md-8").addClass("col-lg-12 col-md-12");
			$("#imageBlock").hide();
		}

		if(data.pageContent.topContent != "" || data.pageContent.topContent != undefined) {
			$(".top_content").html('').html(data.pageContent.topContent);
		}
		
		if((data.pageContent.tooltip != undefined) && (data.pageContent.tooltip != "")){
			$("#hints").show();
			$("#toolTip").html('').html(data.pageContent.tooltip);
		} else {
			$("#hints").hide();
		}

		if(data.pageContent.collapseHeader && data.pageContent.collapseHeader!= undefined){
			collapseTh += "colspan='2'";
		}
		
		if((data.pageContent.tableClass != undefined) && (data.pageContent.tableClass != "")){
			tableClassName = 'class="'+data.pageContent.tableClass+'"';
		} else {
			tableClassName = "";
		}
		//if((data.pageContent.tableHead0 != undefined) && (data.pageContent.tableHead0 != "")){
			contentHeader += "<th style='width:100px'></th>";
		//} else {
		//	contentHeader = "";
		//}
		if((data.pageContent.tableHead1 != undefined) && (data.pageContent.tableHead1 != "")){
			contentHeader += "<th>"+data.pageContent.tableHead1+"</th>";
		} else {
			contentHeader += "";
		}
		
		if((data.pageContent.tableHead2 != undefined) && (data.pageContent.tableHead2 != "")){
			
			contentHeader += "<th "+ collapseTh +">"+data.pageContent.tableHead2+"</th>";
		} else {
			contentHeader += "<th></th>";
		}

		if((data.pageContent.tableHead3 != undefined) && (data.pageContent.tableHead3 != "")){
			contentHeader += "<th>"+data.pageContent.tableHead3+"</th>";
		} else {
			contentHeader += "";
		}
		
		// console.log(contentHeader)
		contents = "<table "+tableClassName+">";
		contents += "<thead>"+contentHeader+"</thead>";
		// <img src="assets/images/instruction_icon.png" alt="image">
		// contents += 
		
		var tempLoop = 0;
		
		for(tableLoop = 0; tableLoop < data.pageContent.content.length; tableLoop++){
			if((data.pageContent.content[tableLoop].dos_image != undefined) && (data.pageContent.content[tableLoop].dos_image != "")){
				dosClass = 'class="imagePopup" data-loop="'+tempLoop+'" id="dos_'+tableLoop+'" data-toggle="modal" data-target="#imagePopup"  data-keyboard="false"';
				//tempArr.push(tableLoop);
				tempLoop++;
			} else {
				dosClass = "";
			}
			if((data.pageContent.content[tableLoop].donts_image != undefined) && (data.pageContent.content[tableLoop].donts_image != "")){
				dontClass = 'class="imagePopup" data-loop="'+tempLoop+'" id="donts_'+tableLoop+'" data-toggle="modal" data-target="#imagePopup"  data-keyboard="false"';
				tempLoop++;
			} else {
				dontClass = "";
			}

			
			
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
			contents += "<td "+dosClass+" "+rowSpan+" style='width:100px' >"+ " <button><img src='assets/images/instruction_icon.gif' alt='image'></button>" +"</td>";

			collapseTd = "";

			if((data.pageContent.content[tableLoop].dos == undefined) || (data.pageContent.content[tableLoop].dos == "") || (data.pageContent.content[tableLoop].donts == undefined) || (data.pageContent.content[tableLoop].donts == "")){
				collapseTd = "colspan='2'";
			}
			
			if((data.pageContent.content[tableLoop].dos != undefined) && (data.pageContent.content[tableLoop].dos != "")){
				contents += "<td "+dosClass+" "+rowSpan+" "+collapseTd+">"+data.pageContent.content[tableLoop].dos+"</td>";
			}
			
			if((data.pageContent.content[tableLoop].donts != undefined) && (data.pageContent.content[tableLoop].donts != "")){
				contents += "<td "+dontClass+" "+rowSpan+" "+collapseTd+">"+data.pageContent.content[tableLoop].donts+"</td>";
			}
			
			contents += "</tr>";
			
			
			
		}
		
		contents += "</table>";
		


		if((data.pageContent.description != undefined) && (data.pageContent.description != "")){ 
			contents += data.pageContent.description;
		}
		$(".close").on("click", _this.PopupHide);
		$("#myModal").on("hidden.bs.modal", _this.PopupHide);
		$("#content").html('').html("<div class=table1>"+contents+"</div>");

///////////////////////////////////// mobile table ///////////////////////////
		// if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		// 	$(".table").hide();
			if((data.pageContent.img != undefined) && (data.pageContent.img != "")){
				$("#img").attr("src",  "assets/images/" + data.pageContent.img);
				$("#cntPart").removeClass("col-lg-12 col-md-12").addClass("col-lg-7 col-md-8");
				$("#imageBlock").show();
			} else {
				$("#cntPart").removeClass("col-lg-7 col-md-8").addClass("col-lg-12 col-md-12");
				$("#imageBlock").hide();
			}
	
			if(data.pageContent.topContent != "" || data.pageContent.topContent != undefined) {
				$(".top_content").html('').html(data.pageContent.topContent);
			}
			
			if((data.pageContent.tooltip != undefined) && (data.pageContent.tooltip != "")){
				$("#hints").show();
				$("#toolTip").html('').html(data.pageContent.tooltip);
			} else {
				$("#hints").hide();
			}
	
			if(data.pageContent.collapseHeader && data.pageContent.collapseHeader!= undefined){
				collapseTh += "colspan='2'";
			}
			
			if((data.pageContent.tableClass != undefined) && (data.pageContent.tableClass != "")){
				tableClassName = 'class=mobile';
			} else {
				tableClassName = "";
			}
			//if((data.pageContent.tableHead0 != undefined) && (data.pageContent.tableHead0 != "")){
				// contentHeader += "<th style='width:100px'></th>";
			//} else {
			//	contentHeader = "";
			//}
			// if((data.pageContent.tableHead1 != undefined) && (data.pageContent.tableHead1 != "")){
			// 	contentHeader += "<th style='text-align:center;'>"+data.pageContent.tableHead1+"</th>";
			// } else {
			// 	contentHeader += "";
			// }
			
			// if((data.pageContent.tableHead2 != undefined) && (data.pageContent.tableHead2 != "")){
				
			// 	contentHeader += "<th "+ collapseTh +">"+data.pageContent.tableHead2+"</th>";
			// } else {
			// 	contentHeader += "<th></th>";
			// }
	
			// if((data.pageContent.tableHead3 != undefined) && (data.pageContent.tableHead3 != "")){
			// 	contentHeader += "<th>"+data.pageContent.tableHead3+"</th>";
			// } else {
			// 	contentHeader += "";
			// }
			
			// console.log(contentHeader)
			contents1 = "<table "+tableClassName+">";
			contents1 += "<thead>"+contentHeader+"</thead><tr style='height: 5px'></tr>";
			// <img src="assets/images/instruction_icon.png" alt="image">
			// contents += 
			
			var tempLoop = 0;
			for(tableLoop = 0; tableLoop < data.pageContent.content.length; tableLoop++){
				// alert(tableLoop)
				if((data.pageContent.content[tableLoop].dos_image != undefined) && (data.pageContent.content[tableLoop].dos_image != "")){
					dosClass = 'class="imagePopup" data-loop="'+tempLoop+'" id="dos_'+tableLoop+'" data-toggle="modal" data-target="#imagePopup"  data-keyboard="false"';
					//tempArr.push(tableLoop);
					tempLoop++;
				} else {
					dosClass = "";
				}
				if((data.pageContent.content[tableLoop].donts_image != undefined) && (data.pageContent.content[tableLoop].donts_image != "")){
					dontClass = 'class="imagePopup" data-loop="'+tempLoop+'" id="donts_'+tableLoop+'" data-toggle="modal" data-target="#imagePopup"  data-keyboard="false"';
					tempLoop++;
				} else {
					dontClass = "";
				}
	
				
				
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
				
				
				contents1 += "<tr" +tabletd+">";

					contents1 += "<td rowspan=2 "+dosClass+" "+rowSpan+" style='width:100px' >"+ "<button><img src='assets/images/instruction_icon.gif' alt='image'></button>" +"</td>";
				

				
	
				collapseTd = "";
	
				// if((data.pageContent.content[tableLoop].dos == undefined) || (data.pageContent.content[tableLoop].dos == "") || (data.pageContent.content[tableLoop].donts == undefined) || (data.pageContent.content[tableLoop].donts == "")){
				// 	collapseTd = "colspan='2'";
				// }
				
				if((data.pageContent.content[tableLoop].dos != undefined) && (data.pageContent.content[tableLoop].dos != "")){
					contents1 += "<td class=td_txt "+rowSpan+" "+collapseTd+">"+data.pageContent.content[tableLoop].dos+"</td>";
				}
				
			
				
				contents1 += "</tr>";
				
				contents1 += "<tr" +tabletd+">";
				
					contents1 += "";
				

				
	
				collapseTd = "";
				
				if((data.pageContent.content[tableLoop].donts != undefined) && (data.pageContent.content[tableLoop].donts != "")){
					contents1 += "<td class=td_txt "+rowSpan+" "+collapseTd+">"+data.pageContent.content[tableLoop].donts+"</td>";
				}

				contents1 += "</tr><tr style='height: 5px'></tr>";
				
			}
			
			contents1 += "</table>";
			
	
	
			if((data.pageContent.description != undefined) && (data.pageContent.description != "")){ 
				contents1 += data.pageContent.description;
			}

			$("#content").append("<div class=table2></div>");
			$(".table2").append(contents1);
		// }
		// else
		// {
		// 	$(".table").show();
		// 	$(".mobile").hide();
		// }
///////////////////////////////////// mobile table ///////////////////////////


		setTimeout(function(){
			$('.imagePopup').find('button').attr("data-visited","false");
			$('.imagePopup').find('button').each(function (){
				totalImageCount++;
				
			});

		},500);

		$(".imagePopup").css("pointer-events", "none");
		$(".imagePopup").find("button").css("pointer-events", "auto");

		$(".imagePopup").unbind("click").bind("click", _this.PopupImageHandler).css("cursor","pointer");
		
		

			for(var i = 0; i < $(".imagePopup").length; i++){
				tempArr.push(i);
			}
			
       // _model.setTemplateStatus(true);
    }
	
	this.clear = function(){

	}
	_this.PopupHide = function(){ 
	
				
	}


	_this.PopupImageHandler = function(e){
			//_model.setAudioStatus(true);
		//appCntl.audioManager.pauseAudio();
		
        //appCntl.audioManager.stopAudio();
		
		var popupId = e.currentTarget.id.substring(e.currentTarget.id.indexOf('_') +1);
		var popupString = e.currentTarget.id.substr(0, e.currentTarget.id.indexOf('_'));
		
		$("#imagePopup").show();

		if($(this).find('button').attr("data-visited") == "false"){
			currentClickedCount++;
			$(this).find('button').attr("data-visited", "true");
		}

		if(currentClickedCount == totalImageCount){
			window.largeImgClicked = true;
			if(window.audioEnded == true){
				$("#nextNotification").fadeIn(800);
				$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
				$("#menuItem_"+window.currentIndexRef+" , #menuItem_"+window.currentIndexRef+"").css({'pointer-events': 'auto', 'opacity': 1}); 
				$("#menuItem_"+window.nextIndexRef+" ").addClass('completed');
				$(".completed").css({'pointer-events': 'auto', 'opacity': 1});

				if(!$(".menu_active i").hasClass("pull-right")){
					$(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
				}
			}
		}


		if(popupString == "dos"){
			$("#imageZoom").attr("src",  _this.currentData.pageContent.content[popupId].dos_image);
		}
		if(popupString == "donts"){
			$("#imageZoom").attr("src", _this.currentData.pageContent.content[popupId].donts_image);
		}
		
		ids = $(this).attr("data-loop");
		
		tempArr = jQuery.grep(tempArr, function(value) {
			return value != ids;
		});
						
		if(tempArr.length == 0){
			_model.setTemplateStatus(true);
			_model.setAudioStatus(true);
			EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
		}
		// console.log(tempArr.length)
	} 


}