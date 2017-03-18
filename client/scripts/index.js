'use strict';

require("../styles/index.styl");

import React from 'react'
import { render } from 'react-dom'
import ReactIntense from '../../lib/ReactIntense'

const DemoImages = [{
  caption: 'An annual month-long festival in Kyoto',
  classes: 'demo-image first',
  src: require("../img/horse.jpg"),
  thumbnailSrc: require("../img/horse_thumb.jpg"),
  title: 'Gion Matsuri',
},
{ 
  caption: 'Umbrellas are key!',
  classes: 'demo-image second',
  src: require("../img/rain.jpg"),
  thumbnailSrc: require("../img/rain_thumb.jpg"),
  title: 'Rainy rain',
  vertical: true,
}, {
  caption: 'Ancient Buddhist temple on a cliff',
  classes: 'demo-image third',
  src: require("../img/temple.jpg"),
  thumbnailSrc: require("../img/temple_thumb.jpg"),
  title: 'Kiyomizu-dera',
}]

class IntenseDemos extends React.Component {
  _renderImages (images) {
    return images.map(
      ({ caption, classes, src, thumbnailSrc, title, vertical }) => (
        <ReactIntense 
          caption={caption}
          classes={classes}
          key={title}
          loader='uil-spin-css'
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