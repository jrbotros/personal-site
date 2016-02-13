(function() {
  'use strict';

  // Taken from https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript.
  // To be used until https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia becomes a standard!
  var viewport = function() {
      var e = window, a = 'inner';
      if (!('innerWidth' in window )) {
          a = 'client';
          e = document.documentElement || document.body;
      }
      return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
  }


  // Taken from https://developer.mozilla.org/en-US/docs/Web/Events/scroll.
  var throttle = function(type, name, obj) {
      obj = obj || window;
      var running = false;
      var func = function() {
          if (running) { return; }
          running = true;
          requestAnimationFrame(function() {
              obj.dispatchEvent(new CustomEvent(name));
              running = false;
          });
      };
      obj.addEventListener(type, func);
  };
  throttle('scroll', 'optimizedScroll');

  var scroller = {
    sectionSelectors: ['section'],
    arrowSelector: '.arrow',
    scrolling: false,
    init: function() {
      var scroller = this;
      var sections = scroller.sections();

      var links = document.querySelectorAll('nav a[href*="#"]:not([href="#"])');
      for (var i = links.length - 1; i >= 0; i--) {
        links[i].addEventListener('click', function() {
          if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash).children().first();
            if (target.length) {
              scroller.targetIndex = $('section').index(target);
              scroller.absolute(scroller.targetIndex);
              return false;
            }
          }
        });
      };
      Mousetrap.bind('up', function() { scroller.relative(-1) });
      Mousetrap.bind('down', function() { scroller.relative(1) });
      scroller.showArrows();
      $(scroller.arrowSelector).click(function() {
        $(this).hasClass('up') ? scroller.relative(-1) : scroller.relative(1);
      });

      window.addEventListener('resize', function() {
        scroller.toggleMobileSection('#info');
        if (!scroller.scrolling) {
          scroller.targetIndex = scroller.curIndex();
        }
      })
      window.addEventListener('optimizedScroll', function() {
        scroller.showArrows();
        if (!scroller.scrolling) {
          scroller.targetIndex = scroller.curIndex();
        }
      })
      scroller.toggleMobileSection('#info');
      scroller.targetIndex = scroller.curIndex();
      scroller.maxTargetIndex = sections.length - 1;
    },
    sections: function() {
      return document.querySelectorAll(this.sectionSelectors);
    },
    curIndex: function() {
      var curIndex = 0;
      var scrollCenter = $(window).scrollTop() + $(window).height() / 2;

      var sections = document.querySelectorAll(scroller.sectionSelectors);
      for (var i = sections.length - 1; i >= 0; i--) {
        var section = sections[i];
        var offsets = getMarginOffset(section);
        if (scrollCenter >= offsets[0] && scrollCenter < offsets[1]) {
          return i;
        }
      };
    },
    absolute: function(index) {
      var scroller = this;
      var section = scroller.sections()[index];
      section = $(section);
      if (scroller.scrolling) {
        $('html, body').stop(true);
      }
      scroller.scrolling = true;
      $('html, body').animate({
        scrollTop: section.offset().top - parseInt(section.css('margin-top'))
      }, 1000, function() {
        scroller.targetIndex = scroller.curIndex();
        scroller.scrolling = false;
      });
    },
    relative: function(relativeIndex) {
      if (relativeIndex === 0) {
        return;
      }
      var arrowClass;
      if (relativeIndex < 0) {
        scroller.targetIndex = Math.max(0, this.targetIndex + relativeIndex);
        arrowClass = this.arrowSelector + '.up';
      }
      else if (relativeIndex > 0) {
        scroller.targetIndex = Math.min(this.targetIndex + relativeIndex, this.maxTargetIndex);
        arrowClass = this.arrowSelector + '.down';
      }
      $(arrowClass).find('path').css('opacity', '1');
      setTimeout(function() {
        $(arrowClass).find('path').css('opacity', '0.5');
      }, 200);
      this.absolute(scroller.targetIndex);
    },
    showArrows: function() {
      var curIndex = this.curIndex()
      var hideSelector;
      if (curIndex == 0) {
        hideSelector = '.up'
      }
      else if (curIndex == this.maxTargetIndex) {
        hideSelector = '.down'
      }
      if (hideSelector) {
        $(this.arrowSelector + hideSelector).fadeOut();
        $(this.arrowSelector + ':not(' + hideSelector + ')').fadeIn();
      }
      else {
        $(this.arrowSelector).fadeIn();
      }
    },
    toggleMobileSection: function(selector) {
      var index = scroller.sectionSelectors.indexOf(selector);
      if (viewport().width < 900) {
        if (index === -1) {
          this.sectionSelectors.push(selector);
        }
      }
      else if (index > -1) {
        this.sectionSelectors.splice(index, 1);
      }
    }
  }
  scroller.init();

  function vertCenterScreen(elt) {
    elt = $(elt);
    var windowHeight = $(window).height(),
      eltHeight = elt.outerHeight(),
      delHeight = (windowHeight - eltHeight) / 2;

    if (eltHeight < windowHeight) {
      elt.css('margin-top', delHeight);
      elt.css('margin-bottom', delHeight);
    }
  }

  function getMarginOffset(elt) {
    elt = $(elt);
    return [elt.offset().top - parseInt(elt.css('margin-top')), elt.offset().top + elt.outerHeight() + parseInt(elt.css('margin-bottom'))]
  }

  $('#resume ul li').click(function() {
    $(this).toggleClass('selected');
    $(this).children('ul').first().slideToggle();
  });
})();
