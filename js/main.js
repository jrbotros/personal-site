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

$(document).ready(function(){
    vertCenterAll();

    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash).children().first();
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - parseInt(target.css('margin-top'))
                }, 1000);
                return false;
            }
        }
    });
});

$(window).resize(function() {vertCenterAll();});