var TOCPageDataVO = function(props){
	this.pageTitle = props.pageTitle;
	this.templateName = props.templateName;
	this.templateJSON = props.templateJSON;
	this.isLocal = props.isLocal;
	this.pageAudio = props.pageAudio;
	this.transcript = props.transcript;
	this.instruction = props.instruction;
	this.caution = props.caution;
	this.notes = props.notes;
	this.isVisited = props.isVisited;
}

var TOCmainDataVO = function(topic,tempPageArr,status,duration){	
	this.pageTitle = topic; 
	this.pages = tempPageArr;
	this.status = status;
	this.duration = duration;
} 