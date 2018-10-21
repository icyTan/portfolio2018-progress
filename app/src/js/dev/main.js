// Config and Variables

var header = document.getElementsByTagName("header")[0];
var previousWindowPos = 0;
var scrolling = false;

// functions
/* checks scroll direction and adds states based on such*/
function navSticky(){
	var scroll_top = pageYOffset;

	// console.log("s: " + scroll_top + " ,p: " + previousWindowPos);
	if (scroll_top > previousWindowPos){ // on scroll down
		header.classList.remove('-detached');
		header.classList.add('-hidden');
	} else if (scroll_top < 50) { // close to top of page
		header.classList.remove('-detached');
	}else if (scroll_top < previousWindowPos) { // on scroll up
		header.classList.add('-detached');
		header.classList.remove('-hidden');
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
}, 100);
// can get stuck if scrolling to fast, just needs to reset if a problem.

// Landing page fancy expanding transitions
// grab any a link with overlay
// https://stackoverflow.com/questions/42080365/using-addeventlistener-and-getelementsbyclassname-to-pass-an-element-id/42080408
// talking abou stacking context related to z-indeces
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context?redirectlocale=en-US&redirectslug=Understanding_CSS_z-index%2FThe_stacking_context
var overlaySelection = document.getElementsByClassName("overlay");
for(let i = 0; i < overlaySelection.length; i++) {
  overlaySelection[i].addEventListener("click", function(event) {
		event.preventDefault();
    console.log("Clicked index: " + i);
		document.getElementsByClassName('landing-work_box')[i].classList.add('expanding-box'); // select box of same position on page and add the expanding box / circle
		document.getElementsByClassName('landing-work_preview-img')[i].classList.add('fade-out'); // select box of same position on page and add the image fade
		document.getElementsByClassName('landing-work_item')[i].style.zIndex = "3" // set z-index of select item higher than others
		setTimeout(function(){
			document.location.href=overlaySelection[i].getAttribute('href');
		},600); // delay go to link by 2 secs
  })
}
