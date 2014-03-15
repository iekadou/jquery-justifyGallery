/*!
 * jquery-justifyGallery v0.0.1 by @iekadou
 * Copyright (c) 2014 Jonas Braun
 *
 * http://www.noxic-action.de/page/programming/jquery-justifyGallery
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
(function ($) {

    'use strict';

    // JUSTIFYGALLERY CLASS DEFINITION
    // =================================

    var JustifyGallery = function (element, options) {
        this.$gallery = $(element);
        this.options = $.extend({}, JustifyGallery.defaults, options);
        this.indexImages();
        this.justify();
        this.registerLoadImages();
        this.registerWindowResize();
    };

    // JUSTIFYGALLERY DEFAULT OPTIONS
    // ================================

    JustifyGallery.defaults = {
        'maxRowHeight': '300px',
        'spacing': 2,
        'resizeCSS': {'min-width': '0',
                      'min-height': '0',
                      'height': 'auto',
                      'width': 'auto',
                      'max-width': 'none',
                      'max-height': 'none'}
    };

    // JUSTIFYGALLERY METHODS
    // ========================

    JustifyGallery.prototype.indexImages = function () {
        var self = this;
        var $body = $('body');
        var $gallery = self.$gallery;
        $gallery.css('position', 'relative');
        self.$images = $gallery.find('img');
        self.imgCount = self.$images.length;
        if (self.$images.length == 0) {
            return;
        }
        self.imageArray = [];
        self.$images.each(function() {
            var $img = $(this);
            var attrDict = {};
            var $parent = $img.parent('a');

            // reverting all styles and classes
            $parent.removeAttr('class', 'style');
            // img should be direct child of <a> tag

            if ($parent.length == 0) {
                $img.remove();
            } else {
                attrDict['parent'] = $parent;
                attrDict['el'] = $img;
                var $clone = $img.clone();
                $clone.css(self.options.resizeCSS).appendTo($body);
                attrDict['height'] = parseInt($clone.height());
                attrDict['width'] = parseInt($clone.width());
                $clone.remove();
                self.imageArray.push(attrDict);
                // cleanup structure
                if (!($parent.parent().is($gallery))) {
                    $parent.appendTo($gallery);
                }
                $parent.css({'display': 'block',
                             'overflow': 'hidden',
                             'position': 'absolute'});
                $img.css('position', 'relative');
            }
        });
        $gallery.children().not('a').each(function() {
           $(this).remove();
        });
        $gallery.children().each(function() {
            if ($(this).children().length != $(this).children('img').length) {
                $(this).remove();
            }
        });
    };

    JustifyGallery.prototype.justify = function () {
        var self = this;
        var inner_width = self.$gallery.innerWidth();
        var cur_row_starts_at = 0;
        var cur_row_width = 0;
        var rows = [];
        var total_height = 0;

        // FIRST LOOP
        // calculating which rows are needed
        for (var i = 0; i < self.imgCount; i++) {
            self.imageArray[i]['el'].css('max-width', '100%');
            cur_row_width += parseInt(self.imageArray[i]['width']);
            if (cur_row_starts_at != i) {
                cur_row_width += self.options.spacing;
            }
            if (cur_row_width > inner_width) {
                rows.push({'start': cur_row_starts_at, 'end': i, 'width': cur_row_width});
                cur_row_starts_at = i+1;
                cur_row_width = 0;
            }
        }

        //styling rows
        for (var i = 0; i < rows.length; i++) {
            var top = total_height;
            var left = 0;
            var images_in_row = rows[i]['end'] - rows[i]['start'] + 1;
            var too_width = rows[i]['width'] - inner_width;
            var per_img = parseInt(too_width / images_in_row);
            var last_img_correction = 0;
            var min_row_height = parseInt(self.options.maxRowHeight);
            for (var img_i = rows[i]['start']; img_i <= rows[i]['end']; img_i++) {

                if (img_i == rows[i]['end'] && images_in_row * per_img != too_width) {
                    last_img_correction = too_width - images_in_row * per_img;
                }
                var img_width = self.imageArray[img_i]['width']-per_img-last_img_correction;
                last_img_correction = 0;
                self.imageArray[img_i]['parent'].css({'top': top, 'left': left});
                self.imageArray[img_i]['parent'].css('width', img_width);
                left += img_width + self.options.spacing;
                var img_height = self.imageArray[img_i]['el'].innerHeight();
                if (img_height < min_row_height) {
                    min_row_height = img_height;
                }
                if (img_i == rows[i]['end']) {
                    total_height += parseInt(min_row_height) + self.options.spacing;
                    last_img_correction = 0;
                }
            }
            for (var img_i = rows[i]['start']; img_i <= rows[i]['end']; img_i++) {
                var img_height = self.imageArray[img_i]['el'].innerHeight();

                self.imageArray[img_i]['parent'].css('height', min_row_height);
                self.imageArray[img_i]['el'].css('top', parseInt((min_row_height - img_height)/2));
            }
        }
        var left_last = 0
        var min_row_height = parseInt(self.options.maxRowHeight);
        for (var i = rows[rows.length-1]['end']+1; i < self.imgCount; i++) {
            self.imageArray[i]['parent'].css({'top': total_height, 'left': left_last, 'width': self.imageArray[i]['width']});
            left_last += self.imageArray[img_i]['width'] + self.options.spacing;

            var img_height = self.imageArray[i]['el'].innerHeight();
            if (img_height < min_row_height) {
                min_row_height = img_height;
            }
            if (i == (self.imgCount -1)) {
                total_height += parseInt(min_row_height);
            }
        }
        for (var i = rows[rows.length-1]['end']+1; i < self.imgCount; i++) {
            self.imageArray[i]['parent'].css('height', min_row_height);
        }
        self.$gallery.css('height', total_height);
    };

    JustifyGallery.prototype.registerWindowResize = function () {
        var self = this;
        $(window).resize(function () {
            self.justify();
        });
    };

    JustifyGallery.prototype.registerLoadImages = function() {
        var self = this;
        self.$images.each(function() {
            $(this).load(function() {
                self.indexImages();
                self.justify();
            });
        });
    };

    // JUSTIFYGALLERY PLUGIN DEFINITION
    // ==================================

    var old = $.fn.justifyGallery;

    $.fn.justifyGallery = function (options) {
        return this.each(function () {
            var data = $(this).data('justifyGallery');
            if (!data) {
                $(this).data('justifyGallery', (data = new JustifyGallery($(this), options)));
            }
        });
    };

    $.fn.justifyGallery.Constructor = JustifyGallery;

    // JUSTIFYGALLERY NOCONFLICT
    // ===========================

    $.fn.justifyGallery.noConflict = function () {
        $.fn.justifyGallery = old;
        return this
    }

}(jQuery));
