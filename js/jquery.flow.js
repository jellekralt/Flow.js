;(function ( $, window, undefined ) {

    /** Default settings */
    var defaults = {
        steps: [],
        animationValues: {
            'translateX': 0,
            'translateY': 0,
            'rotate': 0,
            'scale': 1,
            'opacity': 1
        },
        ending: ''
    };

    /** Constants */
    var DESKTOP_WIDTH = 1024;
    var PROPERTIES = ['translateX', 'translateY', 'rotate', 'scale', 'opacity'];


    function Flow(element, options) {
        this.parent = element; // Selected DOM element
        this.$parent = $(parent); // Selected jQuery element

        // Extend the defaults with the passed options
        this.options = $.extend( {}, defaults, options);

        // Object var definitions
        this.windowHeight = 0;
        this.prevWindowHeight = 0;
        this.endingTop = 0;

        this.init();
    }


    Flow.prototype.init = function () {
        var _this = this;
        var arrSelectors = this._getUniqueAnimatedSelectors();
        var step, prevAnimation;

        this.$ending = $(this.options.ending);

        // Loop all selectors
        for (var i = 0; i < arrSelectors.length; i++) {
            selector = arrSelectors[i];
            prevAnimation = null;

            // For every selector, loop all steps
            for (var j = 0; j < this.options.steps; j++) {
                step = steps[j];
                animationExists = false;

                // For every step, loop all animations
                for (var k = 0; k < step.animations; k++) {
                    animation = step.animations[k];

                    // Check if the animation selector eq the looped selector
                    if (animation.selector === selector) {
                        // It is eq, this means there is an animation for this selector
                        animationExists = true;
                        // Add the missing properties
                        this._addAnimationProperties(animation, prevAnimation);
                        // Set this animation as the previous
                        prevAnimation = animation;
                        break;
                    }
                }

                // Check if any animation exists for this selecot
                if (!animationExists) {
                    // There is none, create a new animation 
                    prevAnimation = this._addAnimationProperties({
                        selector: selector,
                        $el: $(selector)
                    }, prevAnimation);
                    // And add it to the animations for this step
                    step.animations.push(prevAnimation);
                }
            }
        }

        console.log(this.options.steps);
        // $window.resize(resizeHandler);
        // $doc.scroll(scrollHandler);
        // $doc.keydown(keydownHandler);
        // return resizeHandler();

        this._handlers.resize();
   
    };

    Flow.prototype.getDefaultAnimationValue = function(key) {
        return (key in this.options.animationValues) ? this.options.animationValues[key] : null;
    };

    
    //
    // PRIVATE FUNCTIONS
    //

    Flow.prototype._getUniqueAnimatedSelectors = function() {

        var animatedSelectors = [];
        var step, animation;

        // Loop all steps
        for (var i = 0; i < this.options.steps.length; i++) {
            step = this.options.steps[i];

            // Loop all animations
            for (var j = 0; j < step.animations.length; j++) {
                animation = step.animations[j];
                animation.$el = $(animation.selector);


                // Check if this selector is already in the selectors array
                if ($.inArray(animation.selector, animatedSelectors) === -1) {
                    // If not, push it into the array
                    animatedSelectors.push(animation.selector);
                }
            }
        }
        return animatedSelectors;
    };


    Flow.prototype._addAnimationProperties = function(animation, prevAnimation) {
        var prop, value, _i, _len;

        for (_i = 0, _len = PROPERTIES.length; _i < _len; _i++) {
            prop = PROPERTIES[_i];
            if (!(animation[prop] != null)) {
                if (prevAnimation) {
                    value = prevAnimation[prop][1];
                } else {
                    value = this.getDefaultAnimationValue(prop);
                }
                animation[prop] = [value, value];
            } else if (!$.isArray(animation[prop])) {
                if (prevAnimation) {
                    value = prevAnimation[prop][1];
                } else {
                    value = this.getDefaultAnimationValue(prop);
                }
                animation[prop] = [value, animation[prop]];
            }
        }
        return animation;
    };

    Flow.prototype._updateEnding = function() {
        var remainingHeight;
        remainingHeight = $endingSection.outerHeight() - (windowHeight - endingTop);
        steps[3].duration = remainingHeight * 2;
        steps[3].animations[0].translateY = [0, -remainingHeight];
        steps[3].animations[1].translateY = [-80, -(remainingHeight + 80)];
        steps[3].animations[2].translateY = [0, -remainingHeight];
        $content.height(steps[3].start + steps[3].duration + windowHeight - 200);
        bodyHeight = $body.outerHeight();
        return $window.scrollTop(scrollRatio * (bodyHeight - windowHeight));
    },

    Flow.prototype._handleBreakpoint = function() {
        this.endingTop = parseFloat($endingSection.css('top'));
        updateStepPositions();
        return updateEnding();
    };


    /** Handlers */
    Flow.prototype._handlers = {

        /** Resize */
        resize: function(e) {
            var windowWidth = window.innerWidth;

            this.windowHeight = window.innerHeight;

            this.handleBreakpoint();

            if (this.windowHeight !== this.prevWindowHeight) {
                this.updateEnding();
            }
        }
    };
  
    Flow.prototype._loadElements = function() {
       
    };

 

    /** jQuery wrapper */
    $.fn.flow = function ( options ) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'flow')) {
                    $.data(this, 'flow', new Flow( this, options ));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            return this.each(function () {
                var instance = $.data(this, 'flow');

                if (instance instanceof Flow && typeof instance[options] === 'function') {
                    instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                    // TODO: destroy instance classes, etc
                    $.data(this, 'flow', null);
                }
            });
        }
    };

}(jQuery, window));
