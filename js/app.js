/**** AFTER LOAD ****/
$(window).on('load', function () {
	placeBlots();
	$('.blot').each((index, blot) => {
		$(blot).delay(1000 + index*100).fadeIn(150);
	});
});

/**** Placing Blots On Screen ****/
function placeElementOnDOM(element) {
	let locationX = Math.floor(Math.random() * ($(document).width() - 201));
	let locationY = Math.floor(Math.random() * ($(document).height() - 201));
	$(element).css('top', locationY);
	$(element).css('left', locationX + 50);
}

function placeBlots() {
	$('.blot').each((index, blot) => {
		placeElementOnDOM(blot);
	});
}

/**** Prevent Default Image Functionality ****/
$('img').on('dragstart', function (event) {
	event.preventDefault();
});


/**** Window Resize Functionality ****/
var resizeTimer;

$(window).on('resize', () => {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(placeBlots, 300);
});

/**** Blot Functionality ****/
$('.blot').on('mousedown', function (e) {
	//Change instructions
	$('#info').html(`Press R to rotate the blot`);
	
	var dr = $(this).addClass("drag");
	height = dr.outerHeight();
	width = dr.outerWidth();
	max_left = dr.parent().offset().left + dr.parent().width() - dr.width();
	max_top = dr.parent().offset().top + dr.parent().height() - dr.height();
	min_left = dr.parent().offset().left;
	min_top = dr.parent().offset().top;

	ypos = dr.offset().top + height - e.pageY,
		xpos = dr.offset().left + width - e.pageX;
	$(document).on('mousemove', function (e) {
		var itop = e.pageY + ypos - height;
		var ileft = e.pageX + xpos - width;

		if (dr.hasClass("drag")) {
			if (itop <= min_top) {
				itop = min_top;
			}
			if (ileft <= min_left) {
				ileft = min_left;
			}
			if (itop >= max_top) {
				itop = max_top;
			}
			if (ileft >= max_left) {
				ileft = max_left;
			}
			dr.offset({
				top: itop,
				left: ileft
			});
		}
	}).on('mouseup', function (e) {
		$('#info').html(`Click and drag blots to move them`);
		dr.removeClass("drag");
	});
});

$(document).on('keyup', function (e) {
	let blot = $('.blot.drag');
	if (e.which === 82 && $('.blot').hasClass("drag")) {
		let rotation = getRotationDegrees(blot) + 45;
		blot.css('transform', `rotate(${rotation}deg)`);
	}
});

function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle + 360 : angle;
}
