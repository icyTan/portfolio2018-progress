// Config and Variables

var header = document.getElementsByTagName("header")[0];
var previousWindowPos = 0;
var scrolling = false;

// functions
/* checks scroll direction and adds states based on such*/
function navSticky(){
	var scroll_top = pageYOffset;

	// console.log("s: " + scroll_top + " ,p: " + previousWindowPos);
	if (scroll_top < previousWindowPos){ // on scroll down
		header.classList.remove('-hidden');
			if (scroll_top > 50) { // close to top of page
				header.classList.add('-detached');
			} else {
				header.classList.remove('-detached');
			}
	} else if (scroll_top > previousWindowPos) { // on scroll up
		header.classList.remove('-detached');
		if (scroll_top > 50) { // close to top of page
			header.classList.add('-hidden');
		}
	}
	previousWindowPos = scroll_top;
}

// Handler
window.onload = function (){
};

// doing twitter method of scrolling
// https://benmarshall.me/quit-attaching-javascript-handlers-to-scroll-events/
// window.onscroll(function(){
// 	scrolling = true;
// }); // call constantly on a scroll
window.addEventListener('scroll', function() {
		scrolling = true;
});

setInterval( function(){
	if (scrolling) {
		scrolling = false;
		navSticky();
	}
}, 50);
// can get stuck if scrolling to fast, just needs to reset if a problem.

// this is for adding animations to the header bar
// *******
// now for general links
// https://stackoverflow.com/questions/12551920/capturing-all-the-a-click-event
document.body.onclick = function(e){
	e = e || event;
	console.log(e);
	var from = findLinkableParent('a',e.target || e.srcElement);
	var isOverlay = (getClassOfLink('a',e.target || e.srcElement) === 'overlay') ? true:false;
	if (isOverlay){
		event.preventDefault();
		// other event handler will handle it.
	} else if(from) {
		event.preventDefault();
		document.getElementsByClassName('page-cover')[0].classList.remove('cover-lift');
		document.getElementsByClassName('page-cover')[0].classList.add('cover-drop');
		setTimeout(function(){
			document.location.href=from.getAttribute('href');
		},600); // delay go to link by 2 secs
	}
}

// Landing page fancy expanding transitions
// grab any a link with overlay
// https://stackoverflow.com/questions/42080365/using-addeventlistener-and-getelementsbyclassname-to-pass-an-element-id/42080408
// talking abou stacking context related to z-indeces
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context?redirectlocale=en-US&redirectslug=Understanding_CSS_z-index%2FThe_stacking_context
var overlaySelection = document.getElementsByClassName("overlay");
for(let i = 0; i < overlaySelection.length; i++) {
  overlaySelection[i].addEventListener("click", function(event) {
		event.preventDefault();
		var landscapeMode = (window.innerWidth > window.innerHeight) ? true:false;
		var onLanding = (document.title === 'Patrik Lau') ? true:false;
		// check if on landing page, only landing page has landing-work
		// every other page has work-list
		if (onLanding){
			var scale = 0;
			if(landscapeMode){
				scale = scaleToWindowWidth(document.getElementsByClassName('landing-work_box')[i].offsetWidth);
				scale= scale*1.5; // this is to reduce the amount it draws as a normal scale overdraws atm
			} else {
				scale = scaleToWindowHeight(document.getElementsByClassName('landing-work_box')[i].offsetHeight);
				scale = scale*3;
			}
			document.getElementsByClassName('landing-work_box')[i].style.transform = "scale("+ scale +")"; // because we're scaling a circle which is half of the width
			document.getElementsByClassName('landing-work_preview-img')[i].classList.add('fade-out'); // select box of same position on page and add the image fade
			document.getElementsByClassName('landing-work_item')[i].style.zIndex = "3" // set z-index of select item higher than others
		} else {
			var scale = 0;
			if(landscapeMode){
				scale = scaleToWindowWidth(document.getElementsByClassName('work-list__orb')[i].offsetWidth);
				scale= scale*1.75; // this is to reduce the amount it draws as a normal scale overdraws atm
			} else {
				scale = scaleToWindowHeight(document.getElementsByClassName('work-list__orb')[i].offsetHeight);
				scale = scale*1;
			}
			document.getElementsByClassName('work-list__orb')[i].style.transform = "scale("+ scale +"," + scale*4 + ")"; // because we're scaling a circle which is half of the width
			document.getElementsByClassName('work-list__orb')[i].style.maxWidth = "100%"; // needs to be set to 100% to avoid mousing off of the circle and it changing it's max-width
			document.getElementsByClassName('work-list__orb')[i].style.zIndex = "3" // set z-index of select item higher than others
		}
		setTimeout(function(){
			document.location.href=overlaySelection[i].getAttribute('href');
		},600); // delay go to link by 2 secs
  })
}

// ************************************************
// functions

//find first parent with tagName [tagname]
function findLinkableParent(tagname,el){
  while (el){
    if ((el.nodeName || el.tagName).toLowerCase()===tagname.toLowerCase()){
      return el;
    }
    el = el.parentNode;
  }
  return null;
}

function getClassOfLink(tagname,el){
	while (el){
		if ((el.nodeName || el.tagName).toLowerCase()===tagname.toLowerCase()){
			return el.className;
		}
		el = el.parentNode;
	}
	return null;
}

function getWidthOfElementByClass(classname,el){
	while(el){
		if((el.classList.includes(classname))){
			return el.offsetWidth;
		}
	}
	return null;
}

// scale = w / target.computedWidth;
// this is what we need to find the scale an object need to be set to in order to fill the whole screen
function scaleToWindowWidth(inputElementSize){
	console.log(window.innerWidth);
	console.log(inputElementSize);
	console.log(window.innerWidth / inputElementSize);
	return window.innerWidth / inputElementSize;
}

// scale = h / target.computedHeight;
// this is what we need to find the scale an object need to be set to in order to fill the whole screen
function scaleToWindowHeight(inputElementSize){
	console.log(window.innerHeight);
	console.log(inputElementSize);
	console.log(window.innerHeight / inputElementSize);
	return window.innerHeight / inputElementSize;
}

// **************
// Compares element to screen position and returns a scale value to have element scale enough to cover screen.
// http://javascript.info/coordinates
function scaleFromBoundingRect(inpRect){
	// Check if top or bottom is farther away
	var topDifference = inpRect.top - window.innerHeight;
}
