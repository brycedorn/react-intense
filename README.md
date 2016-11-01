# react-intense

[![npm version](https://badge.fury.io/js/react-intense.svg)](https://badge.fury.io/js/react-intense) [![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/brycedorn/react-intense/master/LICENSE)

This component is a port of [Intense Image Viewer](http://tholman.com/intense-images/) for use with React.

[Demo](http://bryce.io/react-intense).

## Usage

Simply replace your `<img>` element with a `<ReactIntense>` component:

```javascript
import ReactIntense from 'react-intense'

...

<ReactIntense src={'img.jpg'} />
```

and you're good to go!

## Additional Props

Title/caption:
```javascript
<ReactIntense caption={'caption'} src={'img.jpg'} title={'title'} />
```

Thumbnail image (for lazy load of main image):
```javascript
<ReactIntense src={'large_version.jpg'} thumbnail={'small_version.jpg'} />
```

Vertically-oriented images:
```javascript
<ReactIntense src={'tall_image.jpg'} vertical={true} />
```

## Styling

Feel free to use and/or customize the provided styles in `lib/ReactIntense.css`.

## Issues

 If you find any issues with this component, please [report](https://github.com/brycedorn/react-intense/issues) them!
 
## Thanks
* [Tim Holman](https://github.com/tholman)
* [Paul Irish](https://gist.github.com/paulirish/1579671)