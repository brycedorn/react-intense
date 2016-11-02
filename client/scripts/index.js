'use strict';

require("../styles/index.styl");

import React from 'react'
import { render } from 'react-dom'
import ReactIntense from '../../lib/ReactIntense'

const DemoImages = [{
  caption: 'With lots of wheaty puffs. Love those puffs',
  classes: 'demo-image first',
  src: require("../img/h1_small.jpg"),
  thumbnailSrc: require("../img/h1_small_thumb.jpg"),
  title: 'Beautiful fields',
},
{ 
  caption: 'Longing for exploration. Explore me!',
  classes: 'demo-image second',
  src: require("../img/v1_small.jpg"),
  thumbnailSrc: require("../img/v1_small_thumb.jpg"),
  title: 'Fantastic cliffs',
  vertical: true,
}, {
  caption: 'To your breed, your fleece, your clan be true!',
  classes: 'demo-image third',
  src: require("../img/h2_small.jpg"),
  thumbnailSrc: require("../img/h2_small_thumb.jpg"),
  title: 'Chilling sheep',
}]

class IntenseDemos extends React.Component {
  _renderImages (images) {
    return images.map(
      ({ caption, classes, src, thumbnailSrc, title, vertical }) => (
        <ReactIntense 
          caption={caption}
          classes={classes}
          key={title}
          src={src}
          thumbnailSrc={thumbnailSrc}
          title={title}
          vertical={vertical}
        />
      )
    )
  }

  render() {
    return (
      <div id="react-root">
        {this._renderImages(DemoImages)}
      </div>
    );
  }
}

render(<IntenseDemos />, document.getElementById('demos'));
document.body.setAttribute("style","display:block");