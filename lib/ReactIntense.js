/*
 * React Intense v0.0.6
 * https://github.com/brycedorn/react-intense
 *
 * A port of the javascript library: https://github.com/tholman/intense-images
 *
 * Released under the MIT license
 * https://mit-license.org
 */

import React from 'react'
import autobind from 'autobind-decorator'

require('./ReactIntense.css')
require('./polyfills.js')
require('./loader.css')

const propTypes = {
  caption: React.PropTypes.string,
  classes: React.PropTypes.string,
  loader: React.PropTypes.string,
  src: React.PropTypes.string.isRequired,
  thumbnailSrc: React.PropTypes.string,
  title: React.PropTypes.string,
  trigger: React.PropTypes.element
}

const defaultProps = {
  invert: false,
  moveSpeed: 0.05,
  vertical: false,
}

const KEYCODE_ESC = 27

export default class ReactIntense extends React.Component {
  constructor(props) {
    super(props)

    const {innerWidth, innerHeight} = window

    this.state = {
      bindingsApplied: false,
      container: {
        width: innerWidth,
        height: innerHeight,
      },
      lastPosition: 0,
      loaded: false,
      mouseDest: {
        x: 0,
        y: 0,
      },
      mouseCurr: {
        x: innerWidth / 2,
        y: innerHeight / 2,
      },
      overflow: {
        x: 0,
        y: 0,
      },
      overflowValue: document.body.style.overflow,
      target: {
        width: 0,
        height: 0,
      },
      visible: false,
    }
  }

  // Manually set height & width
  @autobind
  setDimensions (target) {
    const { offsetHeight, offsetWidth } = target

    this.setState({
      overflow: {
        x: this.state.container.width - offsetWidth,
        y: this.state.container.height - offsetHeight,
      },
    })
  }

  @autobind
  positionTarget () {
    const { mouseCurr, mouseDest } = this.state
    const { moveSpeed } = this.props

    const newX = mouseCurr.x + (mouseDest.x - mouseCurr.x) * moveSpeed
    const newY = mouseCurr.y + (mouseDest.y - mouseCurr.y) * moveSpeed

    const dist = Math.abs(newX - mouseCurr.x) + Math.abs(newY - mouseCurr.y)

    if (dist > 0.0001) {
      this.setState({
        mouseCurr: {
          x: newX,
          y: newY,
        },
      })

      const { container, lastPosition, overflow } = this.state
      const { vertical } = this.props

      if (vertical) { // VERTICAL SCANNING
        if (newY !== lastPosition) {
          const overflowPosition = this.calcPosition(newY, container.height)
          const position = overflow.y * overflowPosition
          const transform = 'translate3d( 0px, ' + position + 'px, 0px)'

          this.setState({
            lastPosition: newY,
            transform: transform,
          })
        }
      } else { // HORIZONTAL SCANNING
        if (newX !== lastPosition) {
          const overflowPosition = this.calcPosition(newX, container.width)
          const position = overflow.x * overflowPosition
          const transform = 'translate3d(' + position + 'px, 0px, 0px)'

          this.setState({
            lastPosition: newX,
            transform: transform,
          })
        }
      }
    }
  }

  calcPosition (current, total) {
    return this.props.invert ? (total - current) / total : current / total
  }

  @autobind
  addEventListeners () {
    try {
      const container = this.refs.container
      const imgRef = container.children[0].children[0]

      imgRef.addEventListener('mousemove', this._onMouseMove)
      imgRef.addEventListener('touchmove', this._onTouchMove)
      imgRef.addEventListener('click', this.hideViewer)
      window.addEventListener('resize', this.setDimensions)
      window.addEventListener('keyup', this._onKeyUp)

      this.setState({ bindingsApplied: true })
    } catch(e) {}
  }

  @autobind
  removeEventListeners () {
    try {
      const container = this.refs.container
      const imgRef = container.children[0].children[0]

      imgRef.removeEventListener('mousemove', this._onMouseMove)
      imgRef.removeEventListener('touchmove', this._onTouchMove)
      imgRef.removeEventListener('click', this.hideViewer)
      window.removeEventListener('resize', this.setDimensions)
      window.removeEventListener('keyup', this._onKeyUp)

      this.setState({ bindingsApplied: false })
    } catch(e) {}
  }

  componentDidMount () {
    this.positionTarget()
  }

  componentWillUnmount () {
    if (this.state.bindingsApplied) {
      this.removeEventListeners()
    }
  }

  // Lock scroll on the document body.
  lockBody () {
    document.body.style.overflow = 'hidden'
  }

  // Unlock scroll on the document body.
  unlockBody () {
    document.body.style.overflow = this.state.overflowValue
  }

  // Stop animation
  stop (looper) {
    window.cancelAnimationFrame(looper)
  }

  // Start animation
  @autobind
  loop () {
    const looper = window.requestAnimationFrame(this.loop)

    this.setState({looper})
    this.positionTarget()
  }

  // Events
  @autobind
  _onClick (e) {
    e.preventDefault()
    this.setState({visible: true})
    this._onMouseMove.call(undefined, e)
    this.lockBody()
    this.loop()
  }

  _onKeyUp (e) {
    e.preventDefault()

    if (e.keyCode === KEYCODE_ESC) {
      this.hideViewer()
    }
  }

  @autobind
  _onLoad (e) {
    this.setState({
      loaded: true,
      source: {
        src: this.props.src,
        width: e.target.offsetWidth,
        height: e.target.offsetHeight,
      },
    })

    this.setDimensions.call(undefined, e.target)
    this.addEventListeners()
  }

  @autobind
  _onMouseMove (e) {
    this.setState({
      mouseDest: {
        x: e.clientX,
        y: e.clientY,
      }
    })
  }

  @autobind
  _onTouchMove (e) {
    e.preventDefault()
    this.setState({
      mouseDest: {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    })
  }

  // View helpers
  @autobind
  hideViewer () {
    this.setState({visible: false})
    this.stop(this.state.looper)
    this.unlockBody()
    this.removeEventListeners()
  }

  _renderLoader (loaderClassName, isVisible) {
    return isVisible && loaderClassName ? (
      <div className={`${loaderClassName} ri-loader`}>
        {[...Array(8)].map((e, i) => (<div key={i}><div></div></div>))}
      </div>
    ) : <div/>
  }

  _renderViewer () {
    const {container, loaded, transform, visible} = this.state
    const {height, width} = container
    const {caption, src, title} = this.props
    const transformStyle = {
      height: this.props.vertical ? '' : height,
      MozTransform: transform,
      transform: transform,
      WebkitTransform: transform,
      width: this.props.vertical ? width : '',
    }

    return visible ? (
      <div ref='container'>
        <figure className='ri-container' style={{opacity: loaded ? 1 : 0}}>
          <img src={src} style={transformStyle} onLoad={this._onLoad}/>
        <figcaption className='ri-caption-container'>
          <h1 className='ri-title'>
            {title}
          </h1>
          <h2 className='ri-caption'>
            {caption}
          </h2>
        </figcaption>
        </figure>
      </div>
    ) : <div ref='container'></div>
  }

  render () {
    const {classes, loader, src, thumbnailSrc, trigger} = this.props
    const {visible} = this.state

    const triggerProps = {
      children: this._renderLoader(loader, visible),
      className: classes + (visible ? ' clicked' : ''),
      onClick: this._onClick,
      style: {backgroundImage:'url('+ (thumbnailSrc || src) +')'},
    }

    const riTrigger = trigger ? <trigger {...triggerProps} /> : <a {...triggerProps} />

    return (
      <div className='ri-wrapper'>
        {riTrigger}
        {this._renderViewer()}
      </div>
    )
  }
}

ReactIntense.propTypes = propTypes
ReactIntense.defaultProps = defaultProps