// Config and Variables

var $header = $("#header");
var $scrollBottom = $(document).height()-$(window).height();
var $test = 10;

// functions

function navSticky(){
	var scroll_top = $(window).scrollTop();

	if (scroll_top >= 40){
		$header.addClass('-sticky');
	} else {
		$header.removeClass('-sticky');
	}
}

// Handlers
$(window).ready(function(){

});

$(window).load(function(){
	$("article").addClass('-loaded');
	$("footer").addClass('-loaded');
});

$(window).scroll(navSticky); // call constantly on a scroll

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
