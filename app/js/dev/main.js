// Config and Variables

var $header = $("#header");
var $scrollBottom = $(document).height()-$(window).height();

// functions

function navSticky(){
	var scroll_top = $(window).scrollTop();

	if (scroll_top >= 40){
		$header.addClass('-sticky');
	} else {
		$header.removeClass('-sticky');
	}
}
