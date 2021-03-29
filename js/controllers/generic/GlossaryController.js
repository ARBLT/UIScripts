/**
 * Created by Venkatesh on 8/16/2016.
 */

var GlossaryController = function(){

	var _this = this;	
	var glossaryData, innerCount, hasGlossary, className, tempSrc, glossaryMenuLoop;

    this.init = function(data){
		trace(":: Glossary Controller Invoked ::");
		
		_this.glossaryData = data.glossary;
		// console.log(data)
        _this.paintUI();
    }

    this.paintUI = function(){
        trace(":: Create Glossary UI ::");

		$("#alphabetContainer ul").html('');
		tempSrc = "";
		for(var i = 0; i < _this.glossaryData.length; i++){
			hasGlossary = _this.glossaryData[i].alphabetContent.length;
			if(hasGlossary)
				className = '';
			else
				className = 'class="noGlossary"';
			tempSrc += "<li data-innerid='" + i + "' "+ className+">"+ _this.glossaryData[i].alphabet.toUpperCase() +"</li>";
		}	
		$("#alphabetContainer ul").html(tempSrc);
		$("#alphabetContainer li").unbind("click").bind("click", _this.alphabetMenuList);
	}
	
	_this.alphabetMenuList = function(event){
		$("#alphabetContainer li").removeClass("active");
		$("#glossaryDescription, #glossaryMenuList ul").empty();
		innerCount = (_this.glossaryData[event.currentTarget.dataset.innerid].alphabetContent).length;
		glossaryMenuLoop = "";
		for(var j = 0; j < innerCount; j++){
			glossaryMenuLoop += "<li data-innerid='" + event.currentTarget.dataset.innerid + "' data-outerid='" + j + "'>"+ _this.glossaryData[event.currentTarget.dataset.innerid].alphabetContent[j].menu +"</li>";
		} 
		$("#glossaryMenu ul").html('').html(glossaryMenuLoop);
		$("#glossaryMenu li").unbind("click").bind("click", _this.alphabetDescriptionList);		
		$("#alphabetContainer li:eq("+event.currentTarget.dataset.innerid+")").addClass("active");
	}
	
	_this.alphabetDescriptionList = function(event){
		$("#glossaryDescription").empty();
		$("#glossaryMenuList li").removeClass("active");
		$("#glossaryMenuList li:eq("+event.currentTarget.dataset.outerid+")").addClass("active");
		$("#glossaryDescription").html('').html("<p>"+ _this.glossaryData[event.currentTarget.dataset.innerid].alphabetContent[event.currentTarget.dataset.outerid].content +"</p>");
	}
}