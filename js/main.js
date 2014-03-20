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

function vertCenterAll() {
    vertCenterParent($('#info'));
    $('.top-level section').each(function() {
        vertCenterScreen($(this));
    });
}

function getMarginOffset(elt) {
    return [elt.offset().top - parseInt(elt.css('margin-top')), elt.offset().top + elt.outerHeight() + parseInt(elt.css('margin-bottom'))]
}

function getCurIndex() {
    var curIndex = 0;
    var scrollCenter = $(window).scrollTop() + $(window).height() / 2;

    $('section').each(function(index) {
        var offsets = getMarginOffset($(this));

        if (scrollCenter >= offsets[0] && scrollCenter < offsets[1]) {
            curIndex = index;
            return false;
        }
    });    

    return curIndex;
}

function scrollToSection(section) {
    $('html, body').animate({
        scrollTop: section.offset().top - parseInt(section.css('margin-top'))
    }, 1000, function() {animate = false});
}

$(document).ready(function(){
    targetIndex = getCurIndex();
    maxTargetIndex = $('section').length;
    animate = false;

    vertCenterAll();

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

    $(document).keydown(function(e) {
        e.preventDefault();
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 38 || code == 40) {
            code == 38 ? targetIndex = Math.max(0, targetIndex - 1) : targetIndex = Math.min(maxTargetIndex, targetIndex + 1);
            $('html, body').stop(true);
            scrollToSection($('section').eq(targetIndex));
        }
    });

    $(window).mousewheel(function() {
        $('html, body').stop(true);
        targetIndex = getCurIndex();
    });

    $(window).resize(function() {setCurIndex(); vertCenterAll()});
});

