/*
 * React Intense v0.2.0
 * https://github.com/brycedorn/react-intense
 *
 * A React component of https://github.com/tholman/intense-images
 *
 * Released under the MIT license
 * https://mit-license.org
 *
 * @flow
 */

import React, { useRef, useState } from 'react';

type Props = {
  caption: string;
  className: string;
  loader: string;
  moveSpeed?: number;
  onClick?: (e: React.MouseEvent) => void;
  src: string;
  thumbnailSrc: string;
  title: string;
  invert?: boolean;
  trigger?: typeof React.Component;
  vertical?: boolean;
};

const KEYCODE_ESC = 27;
const MIN_DIST_THRESHOLD = 0.0001;
const DEFAULT_MOVE_SPEED = 0.02;

const initialOverflowValue = document.body.style.overflow || 'unset';

function ReactIntense(props: Props) {
  const {
    className,
    loader,
    src,
    thumbnailSrc,
    trigger,
    onClick,
    moveSpeed = DEFAULT_MOVE_SPEED,
    vertical,
    invert,
    caption,
    title,
  } = props;

  const [distance, setDistance] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const mouseDest = useRef<{ x: number; y: number } | undefined>({
    x: 0,
    y: 0,
  });
  const mouseCurr = useRef<{ x: number; y: number } | undefined>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [transform, setTransform] = useState('');
  const [visible, setVisible] = useState(false);
  const intervalKey = useRef<number | undefined>();

  function positionTarget() {
    if (!imgRef.current || !mouseCurr.current || !mouseDest.current) {
      return;
    }

    const newX = mouseCurr.current.x + (mouseDest.current.x - mouseCurr.current.x) * moveSpeed;
    const newY = mouseCurr.current.y + (mouseDest.current.y - mouseCurr.current.y) * moveSpeed;
    const dist = Math.abs(newX - mouseCurr.current.x) + Math.abs(newY - mouseCurr.current.y);

    if (dist > MIN_DIST_THRESHOLD) {
      const newMouseCurr = {
        x: newX,
        y: newY,
      };

      let newTransform = '';
      let newDistance = -1;
      if (vertical) {
        if (newY !== distance) {
          const overflowPosition = calcPosition(newY, window.innerHeight);
          const yOverflow = window.innerHeight - imgRef.current?.offsetHeight;
          const position = yOverflow * overflowPosition;
          newTransform = `translate3d(0px, ${position}px, 0px)`;
          newDistance = newY;
        }
      } else {
        if (newX !== distance) {
          const overflowPosition = calcPosition(newX, window.innerWidth);
          const xOverflow = window.innerWidth - imgRef.current?.offsetWidth;
          const position = xOverflow * overflowPosition;
          newTransform = `translate3d(${position}px, 0px, 0px)`;
          newDistance = newX;
        }
      }

      setTransform(newTransform);
      setDistance(newDistance);

      mouseCurr.current = newMouseCurr;
    }
  }

  function calcPosition(current: number, total: number) {
    return invert ? (total - current) / total : current / total;
  }

  function addEventListeners() {
    imgRef.current?.addEventListener('mousemove', (e) => _onMouseMove(e.clientX, e.clientY));
    imgRef.current?.addEventListener('touchmove', (e) => _onTouchMove(e.touches[0]));
    imgRef.current?.addEventListener('click', hideViewer);
    window.addEventListener('keyup', _onKeyUp);
    loop();
  }

  function removeEventListeners() {
    imgRef.current?.removeEventListener('mousemove', (e) => _onMouseMove(e.clientX, e.clientY));
    imgRef.current?.removeEventListener('touchmove', (e) => _onTouchMove(e.touches[0]));
    imgRef.current?.removeEventListener('click', hideViewer);
    window.removeEventListener('keyup', _onKeyUp);
  }

  // Lock scroll on the document body.
  function lockBody() {
    document.body.style.overflow = 'hidden';
  }

  // Unlock scroll on the document body.
  function unlockBody() {
    document.body.style.overflow = initialOverflowValue;
  }

  // Stop animation
  function stop() {
    if (intervalKey.current) {
      window.cancelAnimationFrame(intervalKey.current);
    }
    intervalKey.current = undefined;
    removeEventListeners();
    unlockBody();
  }

  // Start animation
  function loop() {
    const newIntervalKey = window.requestAnimationFrame(loop);
    intervalKey.current = newIntervalKey;
    positionTarget();
  }

  // Events
  function _onClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    if (onClick) {
      onClick(e);
    }

    setVisible(true);
    lockBody();
  }

  function _onKeyUp(e: KeyboardEvent) {
    e.preventDefault();

    if (e.keyCode === KEYCODE_ESC) {
      hideViewer();
    }
  }

  function _onLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    setLoaded(true);
    addEventListeners();
  }

  function _onMouseMove(x: number, y: number) {
    mouseDest.current = {
      x,
      y,
    };
  }

  function _onTouchMove(touch: Touch) {
    mouseDest.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  // View helpers
  function hideViewer() {
    setVisible(false);
    stop();
  }

  function renderLoader(loaderClassName: string) {
    return visible && loaderClassName ? (
      <div className={`${loaderClassName} ri-loader`}>
        {[...Array(8)].map((e, i) => (
          <div key={`${i}-outer`}>
            <div key={`${i}-inner`}></div>
          </div>
        ))}
      </div>
    ) : null;
  }

  function renderViewer() {
    const transformStyle = {
      height: vertical ? '' : window.innerHeight,
      MozTransform: transform,
      transform: transform,
      WebkitTransform: transform,
      width: vertical ? window.innerWidth : '',
    };

    return visible ? (
      <figure className="ri-container" style={{ opacity: loaded ? 1 : 0 }}>
        <img ref={imgRef} src={src} style={transformStyle} onLoad={_onLoad} />
        <figcaption className="ri-caption-container">
          <h1 className="ri-title">{title}</h1>
          <h2 className="ri-caption">{caption}</h2>
        </figcaption>
      </figure>
    ) : null;
  }

  const imgRef = useRef<HTMLImageElement>(null);
  const TriggerElement = trigger || 'div';

  return (
    <div className="ri-wrapper">
      <TriggerElement
        children={renderLoader(loader)}
        className={`${className} ri-trigger ${visible ? ' clicked' : ''}`}
        onClick={(e) => _onClick(e)}
        style={{ backgroundImage: `url(${thumbnailSrc || src})` }}
      />
      {renderViewer()}
    </div>
  );
}

export default ReactIntense;
