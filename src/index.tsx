import React from 'react'
import { render } from 'react-dom'
import ReactIntense from '../lib/ReactIntense'
import '../lib/polyfills'

import horse from "./img/horse.jpg"
import horse_thumb from "./img/horse_thumb.jpg"
import rain from "./img/rain.jpg"
import rain_thumb from "./img/rain_thumb.jpg"
import temple from "./img/temple.jpg"
import temple_thumb from "./img/temple_thumb.jpg"

const images = [{
  caption: 'An annual month-long festival in Kyoto',
  className: 'demo-image first',
  src: horse,
  thumbnailSrc: horse_thumb,
  title: 'Gion Matsuri',
},
{
  caption: 'Umbrellas are key!',
  className: 'demo-image second',
  src: rain,
  thumbnailSrc: rain_thumb,
  title: 'Rainy rain',
  vertical: true,
}, {
  caption: 'Ancient Buddhist temple on a cliff',
  className: 'demo-image third',
  src: temple,
  thumbnailSrc: temple_thumb,
  title: 'Kiyomizu-dera',
}]

function IntenseDemos() {
    return images.map(({ caption, className, src, thumbnailSrc, title, vertical }) => (
      <ReactIntense
        caption={caption}
        className={className}
        key={title}
        loader='uil-spin-css'
        src={src}
        thumbnailSrc={thumbnailSrc}
        title={title}
        vertical={!!vertical}
      />
    )
  )
}

render(<IntenseDemos />, document.getElementById('demos'))