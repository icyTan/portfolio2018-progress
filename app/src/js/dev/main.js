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
	// console.log(e);
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
		// var landscapeMode = (window.innerWidth > window.innerHeight) ? true:false;
		var onLanding = (document.title === 'Patrik Lau') ? true:false;
		var xScale = 0;
		var yScale = 0;
		// check if on landing page, only landing page has landing-work
		// every other page has work-list
		if (onLanding){
			xScale = scaleElementToWindowWidth(document.getElementsByClassName('landing-work_box')[i]);
			yScale = scaleElementToWindowHeight(document.getElementsByClassName('landing-work_box')[i]);
			// use larger of the two scales
			// this basically checks for landscape or portrait mode
			if (xScale < yScale){
				document.getElementsByClassName('landing-work_box')[i].style.transform = "scale("+ yScale + ")";
			} else {
				document.getElementsByClassName('landing-work_box')[i].style.transform = "scale("+ xScale + ")";
			}
			document.getElementsByClassName('landing-work_preview-img')[i].classList.add('fade-out'); // select box of same position on page and add the image fade
			document.getElementsByClassName('landing-work_item')[i].style.zIndex = "3" // set z-index of select item higher than others
		} else {
			xScale = scaleElementToWindowWidth(document.getElementsByClassName('work-list__orb')[i]);
			yScale = scaleElementToWindowHeight(document.getElementsByClassName('work-list__orb')[i]);
			if (xScale < yScale){
				document.getElementsByClassName('work-list__orb')[i].style.transform = "scale("+ yScale + ")";
			} else {
				document.getElementsByClassName('work-list__orb')[i].style.transform = "scale("+ xScale + ")";
			}
			// document.getElementsByClassName('work-list__orb')[i].style.maxWidth = "100%"; // needs to be set to 100% to avoid mousing off of the circle and it changing it's max-width
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
			return (el.offsetWidth/2);
		}
	}
	return null;
}

// **************
// Compares element to screen position and returns a scale value to have element scale enough to cover screen.
// Add 1 to account for the scale it starts at for most elements.
// http://javascript.info/coordinates
function scaleElementToWindowHeight(el){
	// Check if top or bottom is farther away
	var elRect = el.getBoundingClientRect();
	var topDistance = elRect.top*2.5; // safetly over the max of double the screen for when someone taps at the bottom of an element
	var bottomDistance = (window.innerHeight - elRect.bottom)*2.5;
	if (topDistance < bottomDistance){ 	// closer to top
		console.log("closer to top");
		console.log(bottomDistance +" / "+ (el.offsetHeight/2) +" = " );
		console.log(topDistance / (el.offsetHeight/2));
		return ((bottomDistance / el.offsetHeight)+1);
	} else { 														// closer to bottom.
		console.log("closer to bottom");
		console.log(topDistance +" / "+ (el.offsetHeight/2) +" = " );
		console.log(topDistance / (el.offsetHeight/2));
		return (topDistance / (el.offsetHeight/2)+1);
	}
}
// **************
// Compares element to screen position and returns a scale value to have element scale enough to cover screen.
// http://javascript.info/coordinates
function scaleElementToWindowWidth(el){
	// Check if top or bottom is farther away
	var elRect = el.getBoundingClientRect();
	var leftDistance = elRect.left*2;
	var rightDistance = (window.innerWidth - elRect.right)*2;
	if (leftDistance < rightDistance){ 	// closer to left
		console.log("closer to left");
		console.log(rightDistance +" / "+ (el.offsetWidth/2) +" = " );
		console.log(rightDistance / (el.offsetWidth/2));
		return (rightDistance / (el.offsetWidth/2)+1);
	} else { 														// closer to right
		console.log("closer to right");
		console.log(leftDistance +" / "+ (el.offsetWidth/2) +" = " );
		console.log(leftDistance / (el.offsetWidth/2));
		return (leftDistance / (el.offsetWidth/2)+1);
	}
}
