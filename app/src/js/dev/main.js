// Config and Variables

var $header = $(".header-bar");
var $scrollBottom = $(document).height()-$(window).height();
var previousWindowPos = 0;
var scrolling = false;

// functions

function navSticky(){
	var scroll_top = $(window).scrollTop();

	if (scroll_top > previousWindowPos){
		$header.addClass('-sticky');
	} else if (scroll_top < previousWindowPos) {
		$header.removeClass('-sticky');
	} else {
		$header.removeClass('-sticky');
	}
	previousWindowPos = scroll_top;
}

// Handlers
$(window).ready(function(){

});

$(window).load(function(){
	$("article").addClass('-loaded');
	$("footer").addClass('-loaded');
});

// doing twitter method of scrolling
// https://benmarshall.me/quit-attaching-javascript-handlers-to-scroll-events/
$(window).scroll(function(){
	scrolling = true;
}); // call constantly on a scroll

setInterval( function(){
	if (scrolling) {
		scrolling = false;
		navSticky();
	}
}, 250);



// prevent default unloading and do a transition
$('a').click(function(e){
	e.preventDefault();
	$h = $(this).attr('id');
	$t = $(this).attr('href');
	// alert($h);
	if($h === "contact"){
		$header.removeClass('-sticky');
		$("article").addClass('-unloading');
		$("footer").addClass('-unloading');
		setTimeout(function(){
			$("article").removeClass('-unloading');
			$("footer").removeClass('-unloading');
			window.location.hash='#'+'footer-contact';
		},500); // delay go to link by 2 secs
	} else if ($h === "home"){
		$("html, body").animate({
			scrollTop: 0 //scroll to top at y position 0
		}, 200); // just fast enough
	} else {
		$header.removeClass('-sticky');
		$("article").addClass('-unloading');
		$("footer").addClass('-unloading');
		setTimeout(function(){
			document.location.href=$t;
		},500); // delay go to link by 2 secs
	}
});
