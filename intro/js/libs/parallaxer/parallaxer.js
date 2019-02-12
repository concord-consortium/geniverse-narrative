// ========================================================
// = Hello. Welcome to javascripts. Have a pleasant stay. =
// ========================================================

function aParallax(){
    var p = this;
    var container = null;
    var interval = 0;
    var currentScroll = null;

    p.panelWd = 706; // the width of the primary panel
    p.otherLayers = [{ id: 'layerA', ratio: 0.773 },{ id: 'layerC', ratio: 1.227 },{ id: 'layerD', ratio: 1.45 }]; // all of the other panels
    p.panelCount = $('#layerB .p').length; // the total number of panels
    if(p.panelCount == 1) $('#panelControl a:not(.pagination)').hide();
    p.didScroll = false;
    p.panelHovered = 0;

    p.overflowControl = $('#overflowControl');
    p.bgCatcher = $('#theAll'); // webkit, mostly chrome, has issues animating body background-color properties--so throw everything into a container, animate its color
    p.wndow = $(window);
	$("body").stop();
	$(window).scrollLeft(0);
    this.crunchWinVars = function(){
		var screenWidth;
        p.winWd = p.wndow.width();
		screenWidth = (p.panelCount-1) * p.panelWd + p.winWd;
        p.winHoriSp2Panel = Math.floor( ( p.winWd - p.panelWd ) / 2 ); // figures out left margin for panels to be centered on screen
        p.overflowControl.width( screenWidth );
		p.bgCatcher.width( screenWidth );
    	$('#layerSling').offset({ left: p.winHoriSp2Panel });
    };

    this.panelNarr = function(aPanel){
        var elevator = $('#panelControl a[href="'+aPanel+'"]:not(.lazyNext,.lazyPrev)'),
			narrative = $(aPanel+' .narrative'),
			overflowNewHt = narrative.outerHeight() + 200,
			lazyHelper;


        $('.narrative:visible .adminBlobk textarea:focus, .narrative:visible .adminBlobk input:focus').blur();
    	$('.narrative:visible').stop(true,true).slideUp(200); // roll up text for other slides, if any are unfurled

		$('#panelControl a.hovering').removeClass('hovering'); // remove hovering class from the other hovering button
		elevator.addClass('hovering'); // add hovering class to the button whose panel is actually being hovered
    	if( !elevator.hasClass('clicked') ) elevator.addClass('clicked'); // add clicked class to the panelControl for page that we just passed by

		lazyHelper = $('#c_'+(p.panelHovered+1)).length > 0 ? '#c_'+(p.panelHovered+1) : '#';
		$('#panelControl a.lazyNext').attr('href', lazyHelper);
		lazyHelper = $('#c_'+(p.panelHovered-1)).length > 0 ? '#c_'+(p.panelHovered-1) : '#';
		$('#panelControl a.lazyPrev').attr('href', lazyHelper);

    	if( overflowNewHt > p.overflowControl.outerHeight() )
    		p.overflowControl.animate( {'height' : overflowNewHt}, 200, 'easeInOutSine', copyrightly ); // expand the outer container (which needs to have overflow:hidden to work) by the height of the current slide's narrative
    	narrative.slideDown(500, function(){ // unfurl narrative
    		if($(this).find('textarea').length) $(this).find('textarea').trigger('keyup');
			p.bgCatcher.height( $(document).height() );
    	});

    	if( p.winWd != p.wndow.width() ) p.crunchWinVars(); // sometimes extending the overflow adds the vertical scrollbar, so we need to account for that
    };

    this.init = function(){
        // $('#layerB').width( p.panelCount * p.panelWd );
    	for(var ih=0; ih<p.otherLayers.length; ih++){
    		//$( '#'+p.otherLayers[ih].id ).width( Math.ceil(p.panelCount * p.panelWd * p.otherLayers[ih].ratio) ); // This might be better to bake into style tags serverside
    		//$( '#'+p.otherLayers[ih].id+' .p' ).width( Math.round( p.panelWd * p.otherLayers[ih].ratio) ); // This might be better to bake into css
    		//$( '#'+p.otherLayers[ih].id+' .p' ).text( Math.round( p.panelWd * p.otherLayers[ih].ratio) ); // Helper line
    		p.otherLayers[ih].ref = $('#'+p.otherLayers[ih].id); // we will be referencing this a lot
            p.parallax(p.otherLayers[ih].ref, p.otherLayers[ih].ratio);
    	}
    };

    this.destroy = function()
    {
    	if(container) $(container).stop();
    	clearInterval(interval);
    	$("body").stop();
    }

    this.parallax = function (containerRef, ratio){ // this equation took FOREVER to pinpoint through less than mathematical means of trial and error. Holy euclidian bullcrap, Batman! 1 - ratio, what is this nonsense?! A thanks to IdleT user Forbin for simplifying the equation for me further.
        container = containerRef;
        containerRef.stop().animate({ left : (1 - ratio) * ( p.panelWd / 2 + p.wndow.scrollLeft() ) +'px' },
		 	200); // Default
			// 1800, 'easeOutBounce'); // A very morose easing option
			// 450, 'easeOutBounce'); // Like being dragged across a sticky stage, or like some sort of mechanical automata
			// 2500, 'easeOutElastic'); // A little bouncy
			// 850, 'easeOutBack'); // A not unpleasant overshot of the target with a correct return, might be better for the correctScroll
    }

    this.correctScroll = function (hash, duration){
    	$("body").stop();
		var easing = 'easeInOutSine', goToP = $(hash).index()+1, duration, distanceToTravel;

		distanceToTravel = $('#panelControl a.hovering').length > 0 ? // check to see if the hovering business has happened or not; in case of a deep link, the class may not have been created yet
				Math.abs(parseInt(hash.replace(/\D/g,'')) - parseInt($('#panelControl a.hovering').attr('href').replace(/\D/g,'')) ) : // if .hovering does exist calculate relative distance
				parseInt(hash.replace(/\D/g,'')); // if .hovering doesn't exist calculate distance from zero
        if(duration === undefined) duration = 800 * distanceToTravel + 400; // the 400 is in case we're hovering over the given panel, just not centered on it, so it doesn't just jump with zero duration
        if(p.wndow.scrollTop()) $.scrollTo( hash, { 'axis' : 'y', 'queue' : true, 'duration' : Math.floor(p.wndow.scrollTop() * 3/2 + 200), 'offset' : { 'top' : -90 } }); // scrollTo will take forever scrolling up if we have x & y queued in a single line, so doing it separately allows us to have a brisker upscroll and a longer side one
		if( distanceToTravel <= 3 && (goToP == $('#layerB>div.p').length || goToP == 1) ) {
			easing = 'easeOutBack';
			duration = duration * 1.7;
		} else if(distanceToTravel <= 3) {
			easing = 'easeOutBack';
			duration = duration * 1.3;
		}
		//currentScroll = $.scrollTo( hash, { 'axis' : 'x', 'queue' : true, 'duration' : duration, 'offset' : { 'left' : -p.winHoriSp2Panel }, 'easing' : easing, onAfter: function(){console.log('scroll done');} });
    var scroll_to = $(hash).offset().left - p.winHoriSp2Panel;
    $('html,body').animate({scrollLeft: scroll_to}, duration, easing);
    }

    this.panelControl = function(){
        $('#panelControl a:not(.pagination)').click(function(elevator){
          var hash = $(this).attr('href');
          elevator.preventDefault();
          if (hash != '#') p.correctScroll(hash, 800);
        });
    }

    p.crunchWinVars();
    p.panelControl();
    p.init();

    p.wndow.resize(function(){ // when widnow is resized
        p.crunchWinVars();
        copyrightly();
    });

    p.wndow.scroll(function(){ // when the obvious obviouses
    	p.didScroll = true;
    });


    interval = setInterval(function() { // this interval reduces the number of times scroll gets fired; at one "frame" every 50ms it shouldn't be flickery
        if ( p.didScroll ) {
            p.didScroll = false;
            for(var ih=0; ih<p.otherLayers.length; ih++){
    	        p.parallax(p.otherLayers[ih].ref, p.otherLayers[ih].ratio);
    		}
    	    panelEvSniffer();
    	    copyrightly();
        }
    }, 150);

}

function mainMenu(){
	$("#mainMenu, #paginationMore").hover(function(){
		$("#mainMenu img").stop().animate({ width: '214px', height: '219px' }, 500, 'easeInOutSine');
		$("#mainMenu .jimmyStewart").stop().animate({ width: '139px', height: '139px' }, 500, 'easeInOutSine');
		$("#panelControl").stop().animate({ left: '160px' }, 520, 'easeInOutSine');
	}, function(){
		$("#mainMenu img").stop().animate({ width: '69px', height: '70px' }, 220, 'easeInOutSine');
		$("#mainMenu .jimmyStewart").stop() .animate({ width: '45px', height: '45px' }, 200, 'easeInOutSine');
		$("#panelControl").stop().animate({ left: '70px' }, 800, 'easeOutBounce');
	});
}

function copyrightly(){
    $('#copyrightly').stop().animate({ 'bottom': $(window).height() - $(document).height() + 10 + $(window).scrollTop() },200);
    $('#copyrightly').hover( function(){ $(this).stop().fadeTo(300,0.99); },function(){ $(this).stop().fadeTo(300,0.15); } );
}


// dom element goes away
function popOut(cssFilter, dur, eas){
	var aPop = this;
    aPop.easing = typeof eas !== 'undefined' ? eas : 'easeInSine';
	aPop.duration = dur;
    $(cssFilter+':visible').stop(false,true).each(function(){
        $(this).animate(
			{'transform': 'scale(.01)'},
			{'duration': aPop.duration,
			 'easing': aPop.easing,
			  queue: true,
			  complete: function(){$(this).css({'display': 'none'});}
			}
		);
    });
}

// dom element shows up
function popIn(cssFilter, dur, eas){
	var aPop = this;
    aPop.easing = typeof eas !== 'undefined' ? eas : 'easeOutElastic';
	aPop.duration = dur;
    $(cssFilter+':hidden').stop(false,true).each(function(){
        $(this).css({'transform': 'scale(.01)', 'display': 'block'}).animate(
			{'transform': 'scale(1)'},
			{'duration': aPop.duration,
			 'easing': aPop.easing,
			  queue: true,
			  complete: function(){$(this).css({'display': 'block', 'transform' : 'none'});}
			}
		);
    });
}

function popSlideshower(classToCycle, pauseButtonPanelId){
    var thisPop = this;
    // the items that have the classToCycle class need to also have classes ploink1, ploink2, ploink3... ploinkn - to specify order of displaywhatchamacallit
    $('.'+classToCycle+":not(.ploink1)").hide();

    this.totCount = $('.'+classToCycle+':not(.also)').length; // the also class allows there to be multiple images with the same ploink number; the also ploinks will not go toward the total count
    this.currentIndex = 1;
    this.classOfCycler = classToCycle;
    this.currentlyPlaying = true;

	// prepend button to the given narrative block id
	$('#c_'+pauseButtonPanelId+' .narrative').prepend('<p style="text-align: center;"><a href="#" id="'+classToCycle+'-pauseButt" class="inlineButton"><span>Pause Slideshow</span></a></p>');

	$('#'+classToCycle+'-pauseButt').click(function(aClick){
		aClick.preventDefault();

		if(thisPop.currentlyPlaying) {
			$(this).html('<span>Continue</span>');
			thisPop.currentlyPlaying = false;
		}
		else {
			$(this).html('<span>Pause</span>');
			thisPop.currentlyPlaying = true;
		}
	});

    this.popPloink = function(){
		var nextIndex = thisPop.currentIndex == thisPop.totCount ? 1 : thisPop.currentIndex + 1;

 		if(thisPop.currentlyPlaying && !window.blurred){ // this method allows multiple slideshows to stay synchronized; the timeout never stops firing, even though the slideshow stops advancing

	        popOut("."+thisPop.classOfCycler+".ploink"+thisPop.currentIndex, 350);
	        popIn("."+thisPop.classOfCycler+".ploink"+nextIndex, 700);

	        thisPop.currentIndex = nextIndex;
    	}
    }
    setInterval(function() { thisPop.popPloink(); }, 4000);
}

(function( $ ){

    // $('#whatever').scrollAnimate({'leftLimit' : 2840, 'rightLimit' : 3664, 'properties' : [{ 'how' : 'rotate', 'l' : 90, 'r' : -65 }]});
    // As properties.l and properties.r it currently ONLY accepts integers!!!
    // For css transformations, just pass the type of transformation as properties.how.
    // It assumes when the properties.how is either rotate, skewX or skewY that the integer is in degrees
    // If modifying in myltiple axes at different rates, pass single-value transformations as separate properties.how

    var methods = {
        init : function( options ) {

            // defaults
            var inInit = this,
                settings = $.extend( true, {
                    'leftLimit'  : 0, // if no value is provided, go with left side of the screen
                    'rightLimit' : (p.panelCount-1) * p.panelWd, // if no value is provided, go with right side of the screen
                    'interval' : 200, // if no value is provided, go with right side of the screen
                    'properties' : [
                        { 'how' : 'rotate', 'l' : -45, 'r' : 45 } // if nothing else, rotate
                    ]
                }, options),
                transformTypes = "rotate skew skewX skewY scale scaleX scaleY translateX translateY".split(" "),
                degreeTypes = "rotate skew skewX skewY".split(" ");
            inInit.animationCatcher = {};
            inInit.didScroll = true;

            //console.log(settings.leftLimit, settings.rightLimit);

            inInit.churn = function( props ){
                var tween, scroll = $(window).scrollLeft(), newVal, newProps,
                    valSuffix = '', valPrefix = '',
                    leftLimit = settings.leftLimit, rightLimit = settings.rightLimit;

                if( jQuery.inArray(props.how, transformTypes) > -1) {
                    valPrefix = props.how+'(';
                    valSuffix = jQuery.inArray(props.how, degreeTypes) > -1 ? 'deg)' : ')';
                    newProps = 'transform';
                }
                else newProps = props.how;

                if( scroll - leftLimit < 0 ) {
                    newVal = valPrefix+props.l+valSuffix;
                }
                else if( scroll - rightLimit > 0 ) {
                    newVal = valPrefix+props.r+valSuffix;
                }
                else {
                    tween = props.l - (props.l - props.r)*(scroll - leftLimit)/(rightLimit - leftLimit);
                    newVal = valPrefix+tween+valSuffix;
                }
                //console.log(inInit.animationCatcher.transform);
                if(newProps == 'transform') inInit.animationCatcher.transform = inInit.animationCatcher.transform+' '+newVal;
                else inInit.animationCatcher[newProps] = newVal;
            }

            $(window).scroll(function(){
                inInit.didScroll = true;
            });

            window.setInterval(function() {
                if ( inInit.didScroll ) {
                    inInit.didScroll = false;
                    inInit.animationCatcher.transform = '';
                    for (var aProp = settings.properties.length - 1; aProp >= 0; aProp--) {
                        inInit.churn(settings.properties[aProp]);
                    };
                    //console.log(inInit.animationCatcher);
                    inInit.stop().animate(inInit.animationCatcher, settings.interval);
                }
            }, 150);

        }
    };

    $.fn.scrollAnimate = function( method ) {

        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.scrollAnimate' );
        }

    };

})( jQuery );


window.onblur = function() { window.blurred = true; };
window.onfocus = function() { window.blurred = false; };

//These methods will be invoked from FV application view
//$(document).ready(onDocumentReady);
//$(window).load(onWindowLoad);

function onWindowLoad()
{
	if(p.panelHovered == 0) panelEvSniffer();
}

function onDocumentReady()
{
	 var duration, theHash = window.location.hash;

    if(window.blurred === undefined) window.blurred = false;
    //Deactivating hash for compatibility with FV Ajax container site
   	theHash = null;
    p = new aParallax();

    if(theHash && parseInt(theHash.replace(/\D/g,'')) <= p.panelCount ) {
        duration = 700 * parseInt(theHash.replace(/\D/g,'')); // people reported scrolling is super fast when clicking from twitter, hence
        p.correctScroll("#c_"+(window.location.hash.replace(/\D/g,'')), duration);
    }
	if(p.panelHovered == 0) panelEvSniffer();
	mainMenu();
	copyrightly();
}
