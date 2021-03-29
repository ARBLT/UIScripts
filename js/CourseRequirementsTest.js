function checkAllRequirements(){
	/*Code to find the Viewport Screen Resolution Pass/Fail */
		
		var height = window.innerHeight;
		var width = window.innerWidth;
		
		$(".screenRes").html(height+'*'+width)
		//console.log((height+'*'+width) < ("768*1024"));
		if( (height*width) < (559*375) ){
			$(".passFailScreen").html("Fail");
			$(".passFailScreen").next().attr('src','assets/images/fail_icon.png');
		}else{
			$(".passFailScreen").html("Pass");
			$(".passFailScreen").next().attr('src','assets/images/pass_icon.png');
		}
		//console.log((height+'*'+width));
		
		//console.log(navigator);

		
			var unknown = '-';

			// screen
			var screenSize = '';
			if (screen.width) {
				width = (screen.width) ? screen.width : '';
				height = (screen.height) ? screen.height : '';
				screenSize += '' + width + " x " + height;
			}

			// browser
			var nVer = navigator.appVersion;
			var nAgt = navigator.userAgent;
			var browser = navigator.appName;
			var version = '' + parseFloat(navigator.appVersion);
			var majorVersion = parseInt(navigator.appVersion, 10);
			var nameOffset, verOffset, ix;

			// Opera
			if ((verOffset = nAgt.indexOf('Opera')) != -1) {
				browser = 'Opera';
				version = nAgt.substring(verOffset + 6);
				if ((verOffset = nAgt.indexOf('Version')) != -1) {
					version = nAgt.substring(verOffset + 8);
				}
			}
			// Opera Next
			if ((verOffset = nAgt.indexOf('OPR')) != -1) {
				browser = 'Opera';
				version = nAgt.substring(verOffset + 4);
			}
			// MSIE
			else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
				browser = 'Microsoft Internet Explorer';
				version = nAgt.substring(verOffset + 5);
			}
			// Chrome
			else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
				browser = 'Chrome';
				version = nAgt.substring(verOffset + 7);
			}
			// Safari
			else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
				browser = 'Safari';
				version = nAgt.substring(verOffset + 7);
				if ((verOffset = nAgt.indexOf('Version')) != -1) {
					version = nAgt.substring(verOffset + 8);
				}
			}
			// Firefox
			else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
				browser = 'Firefox';
				version = nAgt.substring(verOffset + 8);
			}
			// MSIE 11+
			else if (nAgt.indexOf('Trident/') != -1) {
				browser = 'Microsoft Internet Explorer';
				version = nAgt.substring(nAgt.indexOf('rv:') + 3);
			}
			// Other browsers
			else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
				browser = nAgt.substring(nameOffset, verOffset);
				version = nAgt.substring(verOffset + 1);
				if (browser.toLowerCase() == browser.toUpperCase()) {
					browser = navigator.appName;
				}
			}
			// trim the version string
			if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
			if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
			if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

			majorVersion = parseInt('' + version, 10);
			if (isNaN(majorVersion)) {
				version = '' + parseFloat(navigator.appVersion);
				majorVersion = parseInt(navigator.appVersion, 10);
			}

			// mobile version
			var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

			// cookie
			var cookieEnabled = (navigator.cookieEnabled) ? true : false;

			if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
				document.cookie = 'testcookie';
				cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
			}

			// system
			var os = unknown;
			var clientStrings = [
				{s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
				{s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
				{s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
				{s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
				{s:'Windows Vista', r:/Windows NT 6.0/},
				{s:'Windows Server 2003', r:/Windows NT 5.2/},
				{s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
				{s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
				{s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
				{s:'Windows 98', r:/(Windows 98|Win98)/},
				{s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
				{s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
				{s:'Windows CE', r:/Windows CE/},
				{s:'Windows 3.11', r:/Win16/},
				{s:'Android', r:/Android/},
				{s:'Open BSD', r:/OpenBSD/},
				{s:'Sun OS', r:/SunOS/},
				{s:'Linux', r:/(Linux|X11)/},
				{s:'iOS', r:/(iPhone|iPad|iPod)/},
				{s:'Mac OS X', r:/Mac OS X/},
				{s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
				{s:'QNX', r:/QNX/},
				{s:'UNIX', r:/UNIX/},
				{s:'BeOS', r:/BeOS/},
				{s:'OS/2', r:/OS\/2/},
				{s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
			];
			for (var id in clientStrings) {
				var cs = clientStrings[id];
				if (cs.r.test(nAgt)) {
					os = cs.s;
					break;
				}
			}

			var osVersion = unknown;

			if (/Windows/.test(os)) {
				osVersion = /Windows (.*)/.exec(os)[1];
				os = 'Windows';
			}

			switch (os) {
				case 'Mac OS X':
					osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
					break;

				case 'Android':
					$("#additionalSoftwareRow").hide();
					osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
					break;

				case 'iOS':
					$("#additionalSoftwareRow").hide();
					osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
					osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
					break;
			}
			
			// flash (you'll need to include swfobject)
			/* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
			var flashVersion = 'no check';
			if (typeof swfobject != 'undefined') {
				var fv = swfobject.getFlashPlayerVersion();
				if (fv.major > 0) {
					flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
				}
				else  {
					flashVersion = unknown;
				}
			}
		

		window.jscd = {
			screen: screenSize,
			browser: browser,
			browserVersion: version,
			browserMajorVersion: majorVersion,
			mobile: mobile,
			os: os,
			osVersion: osVersion,
			cookies: cookieEnabled,
			flashVersion: flashVersion
		};


	/* alert(
		'OS: ' + jscd.os +' '+ jscd.osVersion + '\n' +
		'Browser: ' + jscd.browser +' '+ jscd.browserMajorVersion +
		  ' (' + jscd.browserVersion + ')\n' + 
		'Mobile: ' + jscd.mobile + '\n' +
		'Flash: ' + jscd.flashVersion + '\n' +
		'Cookies: ' + jscd.cookies + '\n' +
		'Screen Size: ' + jscd.screen + '\n\n' +
		'Full User Agent: ' + navigator.userAgent
	); */
	
	$(".browserVersion").html( jscd.browser +' '+ jscd.browserMajorVersion +' '+ '('+jscd.browserVersion+')' );
	$(".findOs").html( jscd.os +' '+ jscd.osVersion );
	//console.log((jscd.browser +' '+ jscd.browserMajorVersion));
	if((jscd.browser) == ("Chrome")){
		if(jscd.browserMajorVersion > 40){
			$(".passFailBrowser").html("Pass");
			$(".passFailBrowser").next().attr('src','assets/images/pass_icon.png');
		}else{
			$(".passFailBrowser").html("Fail");
			$(".passFailBrowser").next().attr('src','assets/images/fail_icon.png');
		}
	}else if((jscd.browser) == ("Firefox")){
		if(jscd.browserMajorVersion > 30){
			$(".passFailBrowser").html("Pass");
			$(".passFailBrowser").next().attr('src','assets/images/pass_icon.png');
		}else{
			$(".passFailBrowser").html("Fail");
			$(".passFailBrowser").next().attr('src','assets/images/fail_icon.png');
		}
	}else if((jscd.browser) == ("Microsoft Internet Explorer")){
		if(jscd.browserMajorVersion > 8){
			$(".passFailBrowser").html("Pass");
			$(".passFailBrowser").next().attr('src','assets/images/pass_icon.png');
		}else{
			$(".passFailBrowser").html("Fail");
			$(".passFailBrowser").next().attr('src','assets/images/fail_icon.png');
		}
	}else if((jscd.browser) == ("Safari")){
		if(jscd.browserMajorVersion > 4){
			$(".passFailBrowser").html("Pass");
			$(".passFailBrowser").next().attr('src','assets/images/pass_icon.png');
		}else{
			$(".passFailBrowser").html("Fail");
			$(".passFailBrowser").next().attr('src','assets/images/fail_icon.png');
		}
	}else{
		$(".passFailBrowser").html("Fail");
	}
			
	//JUST AN EXAMPLE, PLEASE USE YOUR OWN PICTURE!
		var imageAddr = "http://upload.wikimedia.org/wikipedia/commons/5/51/Google.png"; 
		var downloadSize = 4995374; //bytes

		function ShowProgressMessage(msg) {
			if (console) {
				if (typeof msg == "string") {
					//console.log(msg);
					$(".calcBandWidth").html(msg);
				} else {
					for (var i = 0; i < msg.length; i++) {
						var curVal = Number( msg[2].replace(" kbps","") );
						//alert(msg[2])
						if(curVal > 512){
							//console.log("1: "+curVal);
							$(".passFailBandwidth").html("Pass");
							$(".passFailBandwidth").next().attr('src','assets/images/pass_icon.png').show();
						}else{
							$(".passFailBandwidth").html("Fail");
							$(".passFailBandwidth").next().attr('src','assets/images/fail_icon.png').show();
						}
						$(".calcBandWidth").html(msg[2]);
					}
				}
			}
			
			var oProgress = document.getElementById("progress");
			if (oProgress) {
				var actualHTML = (typeof msg == "string") ? msg : msg.join("<br />");
				oProgress.innerHTML = actualHTML;
			}
		}

		function InitiateSpeedDetection() {
			ShowProgressMessage("Calculating, please wait...");
			window.setTimeout(MeasureConnectionSpeed, 1);
		};    

		/* if (window.addEventListener) {
			window.addEventListener('load', InitiateSpeedDetection, false);
		} else if (window.attachEvent) {
			window.attachEvent('onload', InitiateSpeedDetection);
		} */
		
		InitiateSpeedDetection();

		function MeasureConnectionSpeed() {
			var startTime, endTime;
			var download = new Image();
			download.onload = function () {
				endTime = (new Date()).getTime();
				showResults();
			}
			
			download.onerror = function (err, msg) {
				ShowProgressMessage("Invalid image, or error downloading");
			}
			
			startTime = (new Date()).getTime();
			var cacheBuster = "?nnn=" + startTime;
			download.src = imageAddr + cacheBuster;
			
			function showResults() {
				var duration = (endTime - startTime) / 1000;
				var bitsLoaded = downloadSize * 8;
				var speedBps = (bitsLoaded / duration).toFixed(2);
				var speedKbps = (speedBps / 1024).toFixed(2);
				var speedMbps = (speedKbps / 1024).toFixed(2);
				ShowProgressMessage([
					"Your connection speed is:", 
					speedBps + " bps", 
					speedKbps + " kbps", 
					speedMbps + " Mbps"
				]);
			}
		}
	
	//Find the Adobe Reader
	
        // http://thecodeabode.blogspot.com
        // @author: Ben Kitzelman
        // @license: FreeBSD: (http://opensource.org/licenses/BSD-2-Clause) Do whatever you like with it
        // @updated: 03-03-2013
        //
        var getAcrobatInfo = function() {

            var getBrowserName = function() {
                return this.name = this.name || function() {
                    var userAgent = navigator ? navigator.userAgent.toLowerCase() : "other";

                    if(userAgent.indexOf("chrome") > -1){
                        return "chrome";
                    } else if(userAgent.indexOf("safari") > -1){
                        return "safari";
                    } else if(userAgent.indexOf("msie") > -1 || navigator.appVersion.indexOf('Trident/') > 0){
                        return "ie";
                    } else if(userAgent.indexOf("firefox") > -1){
                        return "firefox";
                    } else {
                        //return "ie";
                        return userAgent;
                    }
                }();
            };

            var getActiveXObject = function(name) {
                try { return new ActiveXObject(name); } catch(e) {}
            };

            var getNavigatorPlugin = function(name) {
                for(key in navigator.plugins) {
                    var plugin = navigator.plugins[key];
                    if(plugin.name == name) return plugin;
                }
            };

            var getPDFPlugin = function() {
                return this.plugin = this.plugin || function() {
                    if(getBrowserName() == 'ie') {
                        //
                        // load the activeX control
                        // AcroPDF.PDF is used by version 7 and later
                        // PDF.PdfCtrl is used by version 6 and earlier
                        return getActiveXObject('AcroPDF.PDF') || getActiveXObject('PDF.PdfCtrl');
                    } else {
                        return getNavigatorPlugin('Adobe Acrobat') || getNavigatorPlugin('Chrome PDF Viewer') || getNavigatorPlugin('WebKit built-in PDF');
                    }
                }();
            };

            var isAcrobatInstalled = function() {
                return !!getPDFPlugin();
            };

            var getAcrobatVersion = function() {
                try {
                    var plugin = getPDFPlugin();

                    if(getBrowserName() == 'ie') {
                        var versions = plugin.GetVersions().split(',');
                        var latest = versions[0].split('=');
                        return parseFloat(latest[1]);
                    }

                    if(plugin.version) return parseInt(plugin.version);
                    return plugin.name
                }
                catch(e) {
                    return "not available";
					//return null;
                }
            }

            //
            // The returned object
            //
            return {
                browser: getBrowserName(),
                acrobat: isAcrobatInstalled() ? 'installed' : false,
                acrobatVersion: getAcrobatVersion()
            };
        };

        var info = getAcrobatInfo();
        //alert(info.browser+ " " + info.acrobat + " " + info.acrobatVersion);
		$(".pdfVersion").html("Adobe Reader " + info.acrobatVersion)
		
		if(info.acrobatVersion == 'not available'){
			$(".pdfVersion").html('Please ensure that Adobe reader is enabled in the browser');
		}
		
		if(info.acrobat == 'installed' ){
			$(".passFailPdfReader").html("Pass");
			$(".passFailPdfReader").next().attr('src','assets/images/pass_icon.png');
		}else{
			$(".passFailPdfReader").html("Fail");
			$(".passFailPdfReader").next().attr('src','assets/images/fail_icon.png');
		}	
}