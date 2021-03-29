var StaticLibrary = function(){

};

StaticLibrary.generateRandom = function(){
    return Math.random() * 10000;
};

StaticLibrary.DATA_TYPE = "json";
StaticLibrary.TEMPLATE_TYPE = "html";
StaticLibrary.APP_DATA_URL = "assets/data/appData_hindi.json?version=" + StaticLibrary.generateRandom();
StaticLibrary.PAGE_TEMPLATE_PATH = "views/template/";

StaticLibrary.AUDIO_ENDED_EVENT = "audioEndedEvent";
StaticLibrary.AUDIO_TIME_UPDATE_EVENT = "audioTimeUpdateEvent";


StaticLibrary.SHOW_PRE_LOADER = function(){

    $("#preloader").show();
    _model.setPreloaderFlag(true);
}

StaticLibrary.HIDE_PRE_LOADER = function(){

    $("#preloader").hide();
    _model.setPreloaderFlag(false);
}


/*function used for debugging in any browser*/
function trace(str){
/* 
  if(console.log)
        console.log(str);
    else
        window.status = str; */

}