keyQueue = [];

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

function getTargetSection(idx) {
    var target;
    scrollCenter = $(window).scrollTop() + $(window).height() / 2;

    switch(idx) {
        // get current section
        case 0:
            $('#right-half section').each(function() {
                sectionTop = $(this).offset().top - parseInt($(this).css('margin-top'));
                sectionBottom = $(this).offset().top + $(this).outerHeight() + parseInt($(this).css('margin-bottom'));
                currentSection = false;
                if (scrollCenter >= sectionTop && scrollCenter < sectionBottom) {
                    currentSection = $(this);
                    return false;
                }
            });
            target = currentSection;
            break;
        // get prev section
        case -1:
            current = getTargetSection(0);
            if (scrollCenter > current.offset().top + current.height() / 2) {
                target = current;
                break
            }
            else {
                target = getTargetSection(0).prev('section');
                if (!target.length)
                    target = getTargetSection(0).parent().prev().children('section').last();
                break;                
            }
        // get next section
        case 1:
            current = getTargetSection(0);
            if (scrollCenter < current.offset().top + current.height() / 2) {
                target = current;
                break;
            }
            else {
                target = getTargetSection(0).next('section');
                if (!target.length)
                    target = getTargetSection(0).parent().next().children('section').first();
                break;
            }
    }
    return target;
}

function scrollToSection(keyCode) {
    console.log(keyQueue);

    if (keyCode == 38 || keyCode == 40) {
        section = keyCode == 38 ? getTargetSection(-1) : getTargetSection(1);

        $('html,body').animate({
            scrollTop: section.offset().top - parseInt(section.css('margin-top'))
        },
        1000,
        function() {keyQueue.shift(); scrollToSection(keyQueue[0])});        
    }
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

    $('#resume ul li').click(function() {
        $(this).children('ul').first().slideToggle();
    });

    $(document).keydown(function(e) {
        e.preventDefault();
        var code = (e.keyCode ? e.keyCode : e.which);

        if (!keyQueue.length && (code == 38 || code == 40)) {
            scrollToSection(code)
        }

        keyQueue.push(code);
    });

    $(window).resize(function() {vertCenterAll()});
});

