jquery-justifyGallery
=====================

A jQuery plugin to justify your Gallery.

## Demo

### Demo of only [jquery-justifyGallery](https://github.com/iekadou/jquery-justifyGallery/)
* http://www.noxic-action.de/page/programming/jquery-justifygallery/

### Demo of [jquery-justifyGallery](https://github.com/iekadou/jquery-justifyGallery/) and [bootstrap-gallery](https://github.com/iekadou/bootstrap-gallery/)
* http://www.noxic-action.de/page/photography/


## Installation

* Download the latest release: [v0.0.1](https://github.com/iekadou/jquery-justifyGallery/archive/0.0.1.zip)

## Usage

1. include `jquery.justifyGallery.js`
  
  js:
  ```html
<script type="text/javascript" src="js/jquery.justifyGallery.js></script>
  ```

2. code your gallery with markup like this

  ```html
  <div class="gallery">
    <a href="/path/to/img1.jpg">
      <img src="/path/to/thumb1.jpg" alt="thumb1">
    </a>
    <a href="/path/to/img2.jpg">
      <img src="/path/to/thumb2.jpg" alt="thumb1">
    </a>
  </div>
  ```

3. activate the plugin on the gallery container
  
  ```javascript
$('.gallery').justifyGallery();
  ```

## Settings

### default values

  ```javascript
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
  ```

## Copyright and license

Copyright 2014 Jonas Braun under [MIT license](https://github.com/iekadou/jquery-justifyGallery/blob/master/LICENSE).
