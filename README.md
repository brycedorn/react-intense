# react-intense

[![npm version](https://badge.fury.io/js/react-intense.svg)](https://badge.fury.io/js/react-intense) [![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/brycedorn/react-intense/master/LICENSE)

This component is a port of [Intense Image Viewer](http://tholman.com/intense-images/) for use with React.

[Demo](http://bryce.io/react-intense).

## Usage

Simply replace your `<img>` element with a `<ReactIntense>` component:

```javascript
import ReactIntense from 'react-intense'

...

<ReactIntense src='img.jpg' />
```

and you're good to go!

## Additional Props

Title/caption:
```javascript
<ReactIntense caption='caption' src='img.pg' title='title' />
```

Thumbnail image (for lazy loading of main image):
```javascript
<ReactIntense src='large_version.jpg' thumbnail='small_version.jpg' />
```

Trigger (override thumbnail image):
 - If you'd like to completely override the thumbnail image as the trigger for maximizing the image, you may pass in an entire React element.
 - It must accept an `onClick` prop in addition to the generic `className`, `ref`, and `style` props.
```javascript
<ReactIntense src='large_version.jpg' trigger={myTrigger} />
```

Vertical scrolling:
```javascript
<ReactIntense src='tall_img.jpg' vertical=true />
```

Scroll speed (default is `0.05`):
```javascript
<ReactIntense src='img.jpg' moveSpeed=0.05 />
```

Loading indicator (default is none):
 - Requires some CSS for [positioning](https://github.com/brycedorn/react-intense/blob/master/lib/ReactIntense.css#L67) and associated [`div` structure](https://github.com/brycedorn/react-intense/blob/master/lib/ReactIntense.js#L268); demo shows the `spin` loader from [loading.io](http://loading.io/) which is bundled in [`loader.css`](https://github.com/brycedorn/react-intense/blob/master/lib/loader.css).

```javascript
<ReactIntense src='img.jpg' loader='uil-spin-css' />
```

## Styling

Feel free to use and/or customize the provided styles in `lib/ReactIntense.css`.

## Issues

 If you find any issues with this component, please [report](https://github.com/brycedorn/react-intense/issues) them!
 
## Thanks
* [Tim Holman](https://github.com/tholman)
* [Paul Irish](https://gist.github.com/paulirish/1579671)
* [loading.io](http://loading.io)