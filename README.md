# react-intense

[![npm version](https://badge.fury.io/js/react-intense.svg)](https://badge.fury.io/js/react-intense) [![Build and Deploy](https://github.com/brycedorn/react-intense/actions/workflows/deploy.yml/badge.svg)](https://github.com/brycedorn/react-intense/actions/workflows/deploy.yml)

This component is a port of [Intense Image Viewer](http://tholman.com/intense-images/) for use with React. Now with hooks!

[Demo](https://bryce.io/react-intense).

## Usage

Simply replace your `<img>` element with a `<ReactIntense>` component:

```javascript
import ReactIntense from 'react-intense'

...

<ReactIntense src='img.jpg' />
```

## Optional Props

| Name      | Type           | Description                                                                                                                      |
| --------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| title     | string         | Renders in corner in maximized view.                                                                                             |
| caption   | string         | Renders below title in maximized view.                                                                                           |
| trigger   | Component<any> | Option to override the thumbnail image as the trigger to maximize the image. Passed `onClick` as prop to trigger maximized view. |
| vertical  | boolean        | Images lock to scrolling either horizontally (default) or vertically.                                                            |
| moveSpeed | number         | How fast to scroll images when following mouse.                                                                                  |
| loader    | string         | The class for the loading animation that shows when the image is being loaded for maximized view. Default is in `loader.css`.    |

## Styling

Feel free to use and/or customize the provided styles in `lib/ReactIntense.css`.

## Issues

If you find any issues with this component, please [report](https://github.com/brycedorn/react-intense/issues) them!

## Thanks

- [Tim Holman](https://github.com/tholman)
- [Paul Irish](https://gist.github.com/paulirish/1579671)
- [loading.io](http://loading.io)
