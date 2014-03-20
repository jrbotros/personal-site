function vertCenterParent(elt) {
    elt.css("margin-top",(elt.parent().outerHeight() - elt.outerHeight()) / 2);
}

function vertCenterScreen(elt) {
    windowHeight = $(window).height();
    eltHeight = elt.outerHeight();
    delHeight = (windowHeight - eltHeight) / 2;

    if (eltHeight < windowHeight) {
        elt.css("margin-top", delHeight);
        elt.css("margin-bottom", delHeight);
    }
}

function setUp() {
    if ($(window).width() < 900) {
        $('#info').addClass('scroll-screen');       
    }
    else {
        vertCenterParent($('#info'));
        $('#info').removeClass('scroll-screen');
    }

    $('.scroll-screen').each(function() {
        vertCenterScreen($(this));
    });

    targetIndex = getCurIndex();
    maxTargetIndex = $('.scroll-screen').length - 1;

    scrollToSection($('.scroll-screen').eq(targetIndex));
}

function displayArrows() {
    if (getCurIndex() == 0)
        $('.arrow.up').fadeOut(500);
    else if (getCurIndex() == maxTargetIndex)
        $('.arrow.down').fadeOut(500);
    else
        $('.arrow').fadeIn(500);
}

function getMarginOffset(elt) {
    return [elt.offset().top - parseInt(elt.css('margin-top')), elt.offset().top + elt.outerHeight() + parseInt(elt.css('margin-bottom'))]
}

function getCurIndex() {
    var curIndex = 0;
    var scrollCenter = $(window).scrollTop() + $(window).height() / 2;

    $('.scroll-screen').each(function(index) {
        var offsets = getMarginOffset($(this));

        if (scrollCenter >= offsets[0] && scrollCenter < offsets[1]) {
            curIndex = index;
            return false;
        }
    });    

    return curIndex;
}

function scrollToSection(section) {
    $('html, body').stop(true);
    $('html, body').animate({
        scrollTop: section.offset().top - parseInt(section.css('margin-top'))
    }, 1000, function() {animate = false});
}

$(document).ready(function(){
    setUp();

    if (getCurIndex() == 0)
        $('.arrow.up').hide();
    else if (getCurIndex() == maxTargetIndex)
        $('.arrow.down').hide();
    else
        $('.arrow').show();

    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash).children().first();
            if (target.length) {
                scrollToSection(target);
                return false;
            }
        }
    });

    $('#resume ul li').click(function() {
        $(this).children('ul').first().slideToggle();
    });

    $('.arrow').hover(
        function() {$(this).find('path').css('fill', 'yellow')},
        function() {$(this).find('path').css('fill', 'white')}
    );

    $('.arrow').click(function() {
        $(this).hasClass('up') ? targetIndex = Math.max(0, targetIndex - 1) : targetIndex = Math.min(maxTargetIndex, targetIndex + 1);
        scrollToSection($('.scroll-screen').eq(targetIndex));
    });

    $(document).keydown(function(e) {
        e.preventDefault();
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 38 || code == 40) {
            if (code == 38) {
                targetIndex = Math.max(0, targetIndex - 1);
                $('.arrow.up').find('path').css('fill', 'yellow');
                setTimeout(function() {
                    $('.arrow.up').find('path').css('fill', 'white');
                }, 200);
            }
            else {
                targetIndex = Math.min(maxTargetIndex, targetIndex + 1);
                $('.arrow.down').find('path').css('fill', 'yellow');
                setTimeout(function() {
                    $('.arrow.down').find('path').css('fill', 'white');
                }, 200);
            }

            scrollToSection($('.scroll-screen').eq(targetIndex));
        }
    });

    $(window).scroll(function() {
        if (getCurIndex() == 0)
            $('.arrow.up').fadeOut(500);
        else if (getCurIndex() == maxTargetIndex)
            $('.arrow.down').fadeOut(500);
        else
            $('.arrow').fadeIn(500);
    });

    $(window).mousewheel(function() {
        $('html, body').stop(true);
        targetIndex = getCurIndex();
    });

    $(window).resize(function() {setUp()});
});

