/*
 * React Intense v0.0.3
 * https://github.com/brycedorn/react-intense
 *
 * A port of the javascript library: https://github.com/tholman/intense-images
 *
 * Released under the MIT license
 * https://mit-license.org
 */

// https://gist.github.com/paulirish/1579671
(function() {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

import React from 'react'

require('./ReactIntense.css')

export default class ReactIntense extends React.Component {
  static propTypes = {
    caption: React.PropTypes.string,
    classes: React.PropTypes.string,
    src: React.PropTypes.string.isRequired,
    thumbnailSrc: React.PropTypes.string,
    title: React.PropTypes.string,
  }

  static defaultProps = {
    invert: false,
    moveSpeed: 0.05,
    vertical: false,
  }

  state = {
    bindingsApplied: false,
    container: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    lastPosition: 0,
    loaded: false,
    mouseDest: {
      x: 0,
      y: 0,
    },
    mouseCurr: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
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

  // Manually set height & width
  setDimensions (target) {
    const { offsetHeight, offsetWidth } = target

    this.setState({
      overflow: {
        x: this.state.container.width - offsetWidth,
        y: this.state.container.height - offsetHeight,
      },
    })
  }

  positionTarget () {
    const { mouseCurr, mouseDest } = this.state
    const { moveSpeed } = this.props

    const newX = mouseCurr.x + (mouseDest.x - mouseCurr.x) * moveSpeed
    const newY = mouseCurr.y + (mouseDest.y - mouseCurr.y) * moveSpeed

    if(newX && newY) {
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

  addBindings () {
    try {
      const container = this.refs.container 
      const imgRef = container.children[0].children[0]
      
      imgRef.addEventListener('mousemove', this._onMouseMove.bind(this), false)
      imgRef.addEventListener('touchmove', this._onTouchMove.bind(this), false)
      imgRef.addEventListener('click', this._hideViewer.bind(this), false)
      window.addEventListener('resize', this.setDimensions.bind(this), false)
      window.addEventListener('keyup', this._onKeyUp.bind(this), false)
      
      this.setState({ bindingsApplied: true })
    } catch(e) {}
  }

  removeBindings () {
    try {
      const container = this.refs.container 
      const imgRef = container.children[0].children[0]
      
      imgRef.removeEventListener('mousemove', this._onMouseMove.bind(this), false)
      imgRef.removeEventListener('touchmove', this._onTouchMove.bind(this), false)
      imgRef.removeEventListener('click', this._hideViewer.bind(this), false)
      window.removeEventListener('resize', this.setDimensions.bind(this), false)
      window.removeEventListener('keyup', this._onKeyUp.bind(this), false)
      
      this.setState({ bindingsApplied: false })
    } catch(e) {}
  }

  componentDidMount () {
    this.positionTarget.bind(this).apply()
  }

  componentWillUnmount () {
    if(this.state.bindingsApplied) {
      this.removeBindings.bind(this).apply()
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
  loop () {
    const looper = window.requestAnimationFrame(this.loop.bind(this))
    this.setState({looper: looper})
    this.positionTarget.bind(this).apply()
  }

  // Events
  _onClick (e) {
    e.preventDefault()
    this.setState({visible: true})
    this._onMouseMove.bind(this).call(undefined, e)
    this.lockBody()
    this.loop.bind(this).apply()
  }

  _onKeyUp (e) {
    e.preventDefault()
    const KEYCODE_ESC = 27
    if (e.keyCode === KEYCODE_ESC) {
      this._hideViewer.bind(this).call();
    }
  }

  _onLoad (e) {
    this.setState({
      loaded: true,
      source: {
        src: this.props.src,
        width: e.target.offsetWidth,
        height: e.target.offsetHeight,
      },
    })

    this.setDimensions.bind(this).call(undefined, e.target)
    this.addBindings.bind(this).apply()
  }

  _onMouseMove (e) {
    this.setState({
      mouseDest: {
        x: e.clientX,
        y: e.clientY,
      }
    })
  }

  _onTouchMove (e) {
    e.preventDefault();
    this.setState({
      mouseDest: {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    })
  }

  // View helpers
  _hideViewer () {
    this.setState({visible: false})
    this.stop(this.state.looper)
    this.unlockBody.bind(this).apply()
    this.removeBindings.bind(this).apply()
  }

  _renderViewer () {
    const { height, width } = this.state.container
    const { loaded, transform, visible } = this.state
    const { caption, src, title } = this.props

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
          <img src={src} style={transformStyle} onLoad={this._onLoad.bind(this)}/>
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
    const { classes, src, thumbnailSrc } = this.props
    const { visible } = this.state
    const classNames = classes + (visible ? ' clicked' : '')
    return (
      <div className='ri-wrapper'>
        <a 
          className={classNames} 
          onClick={this._onClick.bind(this)}
          ref='thumbnail' 
          style={{backgroundImage:'url('+ (thumbnailSrc || src) +')'}} 
        />
        {this._renderViewer()}
      </div>
    )
  }
}