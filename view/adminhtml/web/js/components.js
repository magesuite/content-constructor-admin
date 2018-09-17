require([
    "jquery"
], function($){
    'use strict';

    $ = 'default' in $ ? $['default'] : $;

    /**
     * Define const vars
     */
    var ns$1 = 'm2c-component-creator';
    var jsNs$1 = 'js-component-creator';

    /**
     * Method for returning previous creator element based on given argument
     * @param $elem {element} - element that function refers to when selecring previous creator. $elem should be right after creator in the DOM tree.
     * @return {element} component-creator element
     */
    var getPreviousCreatorElement = function getPreviousCreatorElement($elem) {
        if ($elem && $elem.prev('.' + ns$1).length) {
            return $elem.prev('.' + ns$1);
        }

        return false;
    };

    /**
     * Method for returning next creator element based on given argument
     * @param $elem {element} - element that function refers to when selecring previous creator. $elem should be right before creator in the DOM tree.
     * @return {element} component-creator element
     */
    var getNextCreatorElement = function getNextCreatorElement($elem) {
        if ($elem && $elem.next('.' + ns$1).length) {
            return $elem.next('.' + ns$1);
        }

        return false;
    };

    /**
     * Sends AJAX request to get HTML of `.component-creator` component.
     * @return {string} component-creator HTML
     */
    var getCreatorMarkup = function getCreatorMarkup() {
        return $.ajax({
            type: 'POST',
            url: '/admin/landing_pages/ajax/componentCreator'
        });
    };

    /**
     * This method is responsible for adding new component after "plus" has been clicked. Step by step:
     * 1. Runs getCreatorMarkup to get HTML in string and then puts it right after $creator which is the target
     * 2. Runs createComponentPlaceholder to create placeholder for upcomming component and then:
     * 3. Sends AJAX request to get desired component and puts it to `.component-placeholder__inner`
     * @param {string} $creator - creator component containing button that has been clicked to know where to put new component
     */
    var addComponent = function addComponent($creator) {
        getCreatorMarkup($creator).then(function (html) {
            $(html).insertAfter($creator);
        })
        .then(function () {
            createComponentPlaceholder($creator)
                .then(function ($component) {
                    $.ajax({
                        type: 'POST',
                        url: $creator.data('component-url')
                    }).done(function (html) {
                        if (html) {
                            $component.find('.m2c-component-placeholder__inner').append(html);
                        }
                    });
                }, function (error) {
                    console.warn(error);
                });
        });
    };

    /**
     * This function will init our component if needed.
     */
    var init$1 = function init() {
        $(document).on('click', '.' + jsNs$1 + '-add', function () {
            addComponent($(this).parents('.' + ns$1));
        });
    };

    /**
     * Define const vars
     */
    var ns = 'm2c-component-placeholder';
    var jsNs = 'js-component-placeholder';
    var $moveUpButton = $('.' + jsNs + '-move-up');
    var $moveDownButton = $('.' + jsNs + '-move-down');

    /**
     * Checks for the first & last component and disables move up/down arrows for them
     */
    var toggleButtonsState = function toggleButtonsState() {
        var $buttons = $('.' + jsNs + '-move-up').add('.' + jsNs + '-move-down');
        var $sections = $('.' + ns);

        if($sections.length > 1) {
            // Reset state first - enable all buttons
            $buttons.prop('disabled', false).removeClass('m2c-button--disabled');

            // Disable up arrow for first component and down arrow for last
            $.each($sections, function (idx) {
                if (idx === 0) {
                    $(this).find('.' + jsNs + '-move-up').prop('disabled', true).addClass('m2c-button--disabled');
                } else if (idx === $sections.length - 1) {
                    $(this).find('.' + jsNs + '-move-down').prop('disabled', true).addClass('m2c-button--disabled');
                }
            });
        } else {
            $buttons.prop('disabled', true).addClass('m2c-button--disabled');
        }
    };

    /**
     * This method moves component up in the DOM tree.
     * Goes up in the DOM tree until it finds '.component-placeholder' and puts given block above it along with component creator section.
     * @param $block {element} - block to move
     */
    var moveComponentUp = function moveComponentUp($block) {
        $block.add(getNextCreatorElement($block)).insertBefore($block.prevAll('.' + ns + ':first'));
        toggleButtonsState();
    };

    /**
     * This method is similar to moveComponentUp() but it moves component down instead of up
     * @param $block {element} - block to move
     */
    var moveComponentDown = function moveComponentDown($block) {
        $block.add(getPreviousCreatorElement($block)).insertAfter($block.nextAll('.' + ns + ':first'));
        toggleButtonsState();
    };

    /**
     * Remove selected component after confirmation
     * @param $component {element} - component to move
     */
    var deleteComponent = function deleteComponent($component) {
        if (confirm('Are you sure you want to remove this component?')) {
            if ($component.nextAll('.' + ns).length) {
                $component.add(getNextCreatorElement($component)).remove();
            } else {
                $component.add(getPreviousCreatorElement($component)).remove();
            }
        }
    };

    /**
     * Creates new placeholder for the component
     * @param $target {element} - component after which new placeholder should be inserted
     * @return {promise} $el - resolve($el) is returned to trigering function so that it knows the element that was just created
     */
    var createComponentPlaceholder = function createComponentPlaceholder($target) {
        return new Promise(function (resolve, reject) {
            var $el = void 0;

            $.ajax({
                type: 'POST',
                url: $target.data('component-placeholder-url')
            }).done(function (html) {
                if (html && html !== '') {
                    $el = $(html);
                    $el.insertAfter($target).promise().done(function () {
                        var $placeholder = $(this).find('.' + ns + '__placeholder');

                        $placeholder.addClass(ns + '__placeholder--flash');

                        $('html, body').stop().animate({
                            scrollTop: $target.offset().top + $target.outerHeight()
                        }, 250);

                        setTimeout(function () {
                            $placeholder.removeClass(ns + '__placeholder--flash');
                        }, 1500);
                    });
                }

                toggleButtonsState();

                if ($el.length) {
                    resolve($el);
                } else {
                    reject('no HTML available');
                }
            });
        });
    };

    /**
     * Sets all needed events
     */
    var setEvents = function setEvents() {
        $(document).on('click', '.' + jsNs + '-move-up', function () {
            if (!$(this).is(':disabled')) {
                moveComponentUp($(this).parents('.' + ns));
            }
        });

        $(document).on('click', '.' + jsNs + '-move-down', function () {
            if (!$(this).is(':disabled')) {
                moveComponentDown($(this).parents('.' + ns));
            }
        });

        $(document).on('click', '.' + jsNs + '-delete', function () {
            deleteComponent($(this).parents('.' + ns));
        });
    };

    /**
     * This function will init our component if needed.
     */
    var init = function init() {
        setEvents();
        toggleButtonsState();
    };

    init();

    init$1();

    /******************************************************************************/

    /*******************************************************************************
     * Layouts
     ******************************************************************************/

    /******************************************************************************/

});