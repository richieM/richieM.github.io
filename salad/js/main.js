/*
Hello everyone, just wanted to recap regarding the homework for tomorrow: Create an interfactive page with css/html and jQuery. Use jquery events such as .show(); .hide(); .addClass(); removeClass(); .toggle(); or .animate(); combined with css techniques such as keyframe animation, 2d animation, and hover states to make your page as wacky as possible
*/

//TODO
// make the first div.stuff move when you hover over, or change text?


$(document).ready(function(){
	$('.rain-button').click(function(){
		$(".lettuce").append( "<img src='img/lettuce1.jpg' height = 70 width=50 opacity = .1>");
		$('.house').toggle();
		$('.house').toggleClass('active');
		$( ".house" ).append( "<h1>Test</h1>" );
		console.log("button1");
	}); // end rain button


	$( ".chill-dude" ).on( "click", function() {
    	$(this).animate({
      	  /*left: '+=30px', */
      	  height: '+=80px',
      	  width: '+=50px'
    	}); // end animate
	}); 


	$(".rant").hover(

		function(){
			$(this).css({"color": "green", "font-size" : "40px"});
		},

		function () {
		$(this).css({ "color": "black", "font-size" : "14px"});
		}
	);

	/*
		  $( this ).css({
		    width: function( index, value ) {
		      	return parseFloat(value) * 1.2;
		    },
		    height: function( index, value ) {
		      	return parseFloat(value) * 1.2;
			}
		});
		  	$(this).animate({right: '250px'});
		    console.log("hmmm?");
})*/


});