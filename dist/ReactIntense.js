'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * React Intense v0.0.6
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * https://github.com/brycedorn/react-intense
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * A port of the javascript library: https://github.com/tholman/intense-images
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Released under the MIT license
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * https://mit-license.org
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

require('./ReactIntense.css');
require('./polyfills.js');
require('./loader.css');

var propTypes = {
  caption: _react2.default.PropTypes.string,
  classes: _react2.default.PropTypes.string,
  loader: _react2.default.PropTypes.string,
  src: _react2.default.PropTypes.string.isRequired,
  thumbnailSrc: _react2.default.PropTypes.string,
  title: _react2.default.PropTypes.string,
  trigger: _react2.default.PropTypes.element
};

var defaultProps = {
  invert: false,
  moveSpeed: 0.05,
  vertical: false
};

var KEYCODE_ESC = 27;

var ReactIntense = function (_React$Component) {
  _inherits(ReactIntense, _React$Component);

  function ReactIntense(props) {
    _classCallCheck(this, ReactIntense);

    var _this = _possibleConstructorReturn(this, (ReactIntense.__proto__ || Object.getPrototypeOf(ReactIntense)).call(this, props));

    var _window = window,
        innerWidth = _window.innerWidth,
        innerHeight = _window.innerHeight;


    _this.state = {
      bindingsApplied: false,
      container: {
        width: innerWidth,
        height: innerHeight
      },
      lastPosition: 0,
      loaded: false,
      mouseDest: {
        x: 0,
        y: 0
      },
      mouseCurr: {
        x: innerWidth / 2,
        y: innerHeight / 2
      },
      overflow: {
        x: 0,
        y: 0
      },
      overflowValue: document.body.style.overflow,
      target: {
        width: 0,
        height: 0
      },
      visible: false
    };

    _this.setDimensions = _this.setDimensions.bind(_this);
    _this.positionTarget = _this.positionTarget.bind(_this);
    _this.addEventListeners = _this.addEventListeners.bind(_this);
    _this.removeEventListeners = _this.removeEventListeners.bind(_this);
    _this.loop = _this.loop.bind(_this);
    _this._onClick = _this._onClick.bind(_this);
    _this._onLoad = _this._onLoad.bind(_this);
    _this._onMouseMove = _this._onMouseMove.bind(_this);
    _this._onTouchMove = _this._onTouchMove.bind(_this);
    _this.hideViewer = _this.hideViewer.bind(_this);
    return _this;
  }

  // Manually set height & width


  _createClass(ReactIntense, [{
    key: 'setDimensions',
    value: function setDimensions(target) {
      var offsetHeight = target.offsetHeight,
          offsetWidth = target.offsetWidth;


      this.setState({
        overflow: {
          x: this.state.container.width - offsetWidth,
          y: this.state.container.height - offsetHeight
        }
      });
    }
  }, {
    key: 'positionTarget',
    value: function positionTarget() {
      var _state = this.state,
          mouseCurr = _state.mouseCurr,
          mouseDest = _state.mouseDest;
      var moveSpeed = this.props.moveSpeed;


      var newX = mouseCurr.x + (mouseDest.x - mouseCurr.x) * moveSpeed;
      var newY = mouseCurr.y + (mouseDest.y - mouseCurr.y) * moveSpeed;

      var dist = Math.abs(newX - mouseCurr.x) + Math.abs(newY - mouseCurr.y);

      if (dist > 0.0001) {
        this.setState({
          mouseCurr: {
            x: newX,
            y: newY
          }
        });

        var _state2 = this.state,
            container = _state2.container,
            lastPosition = _state2.lastPosition,
            overflow = _state2.overflow;
        var vertical = this.props.vertical;


        if (vertical) {
          // VERTICAL SCANNING
          if (newY !== lastPosition) {
            var overflowPosition = this.calcPosition(newY, container.height);
            var position = overflow.y * overflowPosition;
            var transform = 'translate3d( 0px, ' + position + 'px, 0px)';

            this.setState({
              lastPosition: newY,
              transform: transform
            });
          }
        } else {
          // HORIZONTAL SCANNING
          if (newX !== lastPosition) {
            var _overflowPosition = this.calcPosition(newX, container.width);
            var _position = overflow.x * _overflowPosition;
            var _transform = 'translate3d(' + _position + 'px, 0px, 0px)';

            this.setState({
              lastPosition: newX,
              transform: _transform
            });
          }
        }
      }
    }
  }, {
    key: 'calcPosition',
    value: function calcPosition(current, total) {
      return this.props.invert ? (total - current) / total : current / total;
    }
  }, {
    key: 'addEventListeners',
    value: function addEventListeners() {
      try {
        var container = this.refs.container;
        var imgRef = container.children[0].children[0];

        imgRef.addEventListener('mousemove', this._onMouseMove);
        imgRef.addEventListener('touchmove', this._onTouchMove);
        imgRef.addEventListener('click', this.hideViewer);
        window.addEventListener('resize', this.setDimensions);
        window.addEventListener('keyup', this._onKeyUp);

        this.setState({ bindingsApplied: true });
      } catch (e) {}
    }
  }, {
    key: 'removeEventListeners',
    value: function removeEventListeners() {
      try {
        var container = this.refs.container;
        var imgRef = container.children[0].children[0];

        imgRef.removeEventListener('mousemove', this._onMouseMove);
        imgRef.removeEventListener('touchmove', this._onTouchMove);
        imgRef.removeEventListener('click', this.hideViewer);
        window.removeEventListener('resize', this.setDimensions);
        window.removeEventListener('keyup', this._onKeyUp);

        this.setState({ bindingsApplied: false });
      } catch (e) {}
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.positionTarget();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.state.bindingsApplied) {
        this.removeEventListeners();
      }
    }

    // Lock scroll on the document body.

  }, {
    key: 'lockBody',
    value: function lockBody() {
      document.body.style.overflow = 'hidden';
    }

    // Unlock scroll on the document body.

  }, {
    key: 'unlockBody',
    value: function unlockBody() {
      document.body.style.overflow = this.state.overflowValue;
    }

    // Stop animation

  }, {
    key: 'stop',
    value: function stop(looper) {
      window.cancelAnimationFrame(looper);
    }

    // Start animation

  }, {
    key: 'loop',
    value: function loop() {
      var looper = window.requestAnimationFrame(this.loop);

      this.setState({ looper: looper });
      this.positionTarget();
    }

    // Events

  }, {
    key: '_onClick',
    value: function _onClick(e) {
      e.preventDefault();

      if (this.props.onClick) {
        this.props.onClick();
      }

      this.setState({ visible: true });
      this._onMouseMove.call(undefined, e);
      this.lockBody();
      this.loop();
    }
  }, {
    key: '_onKeyUp',
    value: function _onKeyUp(e) {
      e.preventDefault();

      if (e.keyCode === KEYCODE_ESC) {
        this.hideViewer();
      }
    }
  }, {
    key: '_onLoad',
    value: function _onLoad(e) {
      this.setState({
        loaded: true,
        source: {
          src: this.props.src,
          width: e.target.offsetWidth,
          height: e.target.offsetHeight
        }
      });

      this.setDimensions.call(undefined, e.target);
      this.addEventListeners();
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(e) {
      this.setState({
        mouseDest: {
          x: e.clientX,
          y: e.clientY
        }
      });
    }
  }, {
    key: '_onTouchMove',
    value: function _onTouchMove(e) {
      e.preventDefault();
      this.setState({
        mouseDest: {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        }
      });
    }

    // View helpers

  }, {
    key: 'hideViewer',
    value: function hideViewer() {
      this.setState({ visible: false });
      this.stop(this.state.looper);
      this.unlockBody();
      this.removeEventListeners();
    }
  }, {
    key: '_renderLoader',
    value: function _renderLoader(loaderClassName, isVisible) {
      return isVisible && loaderClassName ? _react2.default.createElement(
        'div',
        { className: loaderClassName + ' ri-loader' },
        [].concat(_toConsumableArray(Array(8))).map(function (e, i) {
          return _react2.default.createElement(
            'div',
            { key: i },
            _react2.default.createElement('div', null)
          );
        })
      ) : _react2.default.createElement('div', null);
    }
  }, {
    key: '_renderViewer',
    value: function _renderViewer() {
      var _state3 = this.state,
          container = _state3.container,
          loaded = _state3.loaded,
          transform = _state3.transform,
          visible = _state3.visible;
      var height = container.height,
          width = container.width;
      var _props = this.props,
          caption = _props.caption,
          src = _props.src,
          title = _props.title;

      var transformStyle = {
        height: this.props.vertical ? '' : height,
        MozTransform: transform,
        transform: transform,
        WebkitTransform: transform,
        width: this.props.vertical ? width : ''
      };

      return visible ? _react2.default.createElement(
        'div',
        { ref: 'container' },
        _react2.default.createElement(
          'figure',
          { className: 'ri-container', style: { opacity: loaded ? 1 : 0 } },
          _react2.default.createElement('img', { src: src, style: transformStyle, onLoad: this._onLoad }),
          _react2.default.createElement(
            'figcaption',
            { className: 'ri-caption-container' },
            _react2.default.createElement(
              'h1',
              { className: 'ri-title' },
              title
            ),
            _react2.default.createElement(
              'h2',
              { className: 'ri-caption' },
              caption
            )
          )
        )
      ) : _react2.default.createElement('div', { ref: 'container' });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          classes = _props2.classes,
          loader = _props2.loader,
          src = _props2.src,
          thumbnailSrc = _props2.thumbnailSrc,
          trigger = _props2.trigger;
      var visible = this.state.visible;


      var triggerProps = {
        children: this._renderLoader(loader, visible),
        className: classes + ' ri-trigger' + (visible ? ' clicked' : ''),
        onClick: this._onClick,
        style: { backgroundImage: 'url(' + (thumbnailSrc || src) + ')' }
      };

      var riTrigger = trigger ? _react2.default.createElement('trigger', triggerProps) : _react2.default.createElement('a', triggerProps);

      return _react2.default.createElement(
        'div',
        { className: 'ri-wrapper' },
        riTrigger,
        this._renderViewer()
      );
    }
  }]);

  return ReactIntense;
}(_react2.default.Component);

exports.default = ReactIntense;


ReactIntense.propTypes = propTypes;
ReactIntense.defaultProps = defaultProps;

