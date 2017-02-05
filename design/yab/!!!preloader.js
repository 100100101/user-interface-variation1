(function(){

	sPreloader = function(options) {

		var that = this;



		that.options = {

			loaderDiv: null,

			contentDiv: null,

			cssEnabled: true,

			excludingClass: 'nopreload',

			logProgress: false,

			animation: 'none',

			animationSpeed: '0.5'

		};



		for (i in options)  {

			that.options[i] = options[i];

		}

	};





	sPreloader.prototype = {

		'start': function() {

			/* LOAD OPTION RESULTS */

			loaderElement = document.getElementById(this.options.loaderDiv);

			contentElement = document.getElementById(this.options.contentDiv);

			eClass = this.options.excludingClass;

			logProgress = this.options.logProgress;

			animation = this.options.animation;

			animationSpeed = this.options.animationSpeed;



			switch(animation) {

				case 'fade':

					/* contentElement.style.opacity = "0"; */

					break;

				default:

					/* contentElement.style.display = "none"; */

					break;

			}	

			

			that = this;

			var event;



			if (document.createEvent) {

				event = document.createEvent("HTMLEvents");

				event.initEvent("dataavailable", true, true);

			} else {

				event = document.createEventObject();

				event.eventType = "dataavailable";

			}

				event.eventName = "siteLoaded";

			if (document.createEvent) {

				document.dispatchEvent(event);

			} else {

				if (document.fireEvent) {

					document.fireEvent("on" + event.eventType, event);

				}

			}









			function getStyle(x, styleProp) {

				if (x.currentStyle) {

					y = x.currentStyle['backgroundImage'];

				} else if (window.getComputedStyle)  {

					y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);

				}

				return y;

			}



			function getHTMLimages() {

				var htmlList = [];

				htmlImages = document.images;

					len=htmlImages.length;

					for(var i=0;i<len; i++) {

						if (htmlImages[i].getAttribute('class') == eClass) {

							/* do nothing while image is excluded. */

						} else {

					    	htmlList.push(htmlImages[i].src);

						}

					}

				return htmlList;

			}



			function getCSSimages() {

				var cssList = [],

				i = 0,

				bgIm,

				existsInArray,

				elements = document.getElementsByTagName('*');

				
				/* iterate over the elements */
				
				for (i=0;elements[i];i++) {

					existsInArray = false;     /* get the background-image style property */

					bgIm = getStyle(elements[i], 'background-image');
					
					if (bgIm !== 'none') {
					
						/* Make sure background image CSS is an image */
						if (
							bgIm.indexOf(".png") !== -1
							|| bgIm.indexOf(".gif") !== -1
							|| bgIm.indexOf(".jpg") !== -1
							|| bgIm.indexOf(".jpeg") !== -1
							|| bgIm.indexOf(".bmp") !== -1					
						) {
						
							bgIm = bgIm.replace("url(","").replace(")","").replace("\"","").replace("\"","");

							/* if one was found, push it into the array */

							for (var key in cssList) {

								if (bgIm == cssList[key]) {

									existsInArray = true;

								}

							}

							if (!existsInArray) {

								var elementClass =  elements[i].className;

								if (elementClass.search('exempt') <= 0) {

									cssList.push(bgIm);

								}

							}
							
						}
					
					}

				}

				return cssList;

			}





			cssResults = getCSSimages();

			htmlResults = getHTMLimages();



			if (this.options.cssEnabled === true) {

				 allResults =  cssResults.concat(htmlResults);

			} else {

				allResults =  cssResults.concat(htmlResults,cssResults);

			}



			percentage = 0;

			var imageCounter = 0;

			/* create an empty div for the images */

			var siteBody = document.getElementsByTagName('body')[0];

			var divEl= document.createElement('div');

			divEl.id = "preloadImages";

			siteBody.appendChild(divEl);

			divEl = document.getElementById('preloadImages');

			var str= "#preloadImages{position: absolute; top: 0; left: 0;width: 0px; height:0px;z-index: -9999;}#preloadImages img{width:0px;height:0px}";

			var pa= document.getElementsByTagName('head')[0] ;

			var el= document.createElement('style');

			el.type= 'text/css';

			el.media= 'screen';

			if(el.styleSheet) {

				el.styleSheet.cssText= str; /* IE method */

			} else {

				el.appendChild(document.createTextNode(str)); /* others */

				pa.appendChild(el);

			}



			len=cssResults.length;

			for(var i=0; i<len; i++) {

			    var ele= document.createElement('img');

			    ele.src= cssResults[i];

			    divEl.appendChild(ele);

			}

			    

			len=allResults.length;

			for(i=0;i<len;i++) {

			    var image = new Image();        

			    image.src = allResults[i];
				
				// Successfully Loaded
			    image.addEventListener('load',function(e){

				    imageCounter++;

				    percentage = imageCounter/allResults.length * 100;

				    that.percentage = percentage;
					document.dispatchEvent(evtUpdate);
					
				    if (logProgress === true) { 

				    	console.log(percentage + "%");

				    }

			        if (percentage == '100') {

			            document.dispatchEvent(evtLoaded);

			        }

			    },false);
				
				// Error Loading
				image.addEventListener("error" ,function(e){

				    imageCounter++;

				    percentage = imageCounter/allResults.length * 100;

				    that.percentage = percentage;
					document.dispatchEvent(evtUpdate);
					
				    if (logProgress === true) { 

				    	console.log(percentage + "%");

				    }

			        if (percentage == '100') {

			            document.dispatchEvent(evtLoaded);

			        }

			    },false);

			}

			evtUpdate = document.createEvent('Event');
			evtLoaded = document.createEvent('Event');

			evtUpdate.initEvent("preloadUpdate", true, true); 
			evtLoaded.initEvent("preloaded", true, true);

			document.addEventListener("preloaded", function() {



			switch(animation) {

				case 'fade':

					/*
					contentElement.style.setProperty("-webkit-transition", "opacity " + animationSpeed +"s");

					loaderElement.style.display = "none";

					contentElement.style.opacity = 1;
					*/
					
					break;

				default:
					
					/*
					loaderElement.style.display = "none";

					contentElement.style.display = "block";
					*/
					
					break;

			}



			

			},false);



		}

	};

})();

/* USAGE

window.addEventListener('DOMContentLoaded', initSite, false);

function initSite() {
	
	myPreloader = new sPreloader({
		contentDiv: 'mainContent',  	//ID of the main content DIV
		loaderDiv: 'loader', 			//ID of the loader DIV
		excludingClass: 'nopreload', 	//If you want to exculde an image from preloading, choose a class name
		logProgress: true,				//console.log the progress of the loader
		animation: 'fade',				//Animation type;  'fade' | 'none'
		animationSpeed: '1.0'			//Animation speed;  '0.5' = 500 milliseconds
	});
	
	myPreloader.start();

}*/