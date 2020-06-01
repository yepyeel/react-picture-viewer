import React, { createContext, useReducer, useContext, useRef, useMemo, useState, useEffect, useCallback, memo, Fragment } from 'react';
import { Portal } from 'react-portal';

const initialState = ({
  picturesList
}) => ({
  picturesList,
  layerShown: false,
  imgScale: 1,
  pictureOrder: 0,
  imgRotate: 0
});

function reducer(state, action) {
  switch (action.type) {
    case 'SHOWN_LAYER':
      {
        const returnState = { ...state,
          layerShown: action.visible
        };
        if (!action.visible) returnState.imgScale = 1;
        return returnState;
      }

    case 'SET_SCALE':
      {
        return { ...state,
          imgScale: action.scale
        };
      }

    case 'SET_ROTATE':
      {
        return { ...state,
          imgRotate: action.rotate
        };
      }

    case 'SET_PICTURE_ORDER':
      {
        const picturesListLength = state.picturesList.length;
        let picOrder = action.order;

        if (picOrder + 1 > picturesListLength) {
          picOrder = picturesListLength - 1;
        }

        if (picOrder < 0) {
          picOrder = 0;
        }

        return { ...state,
          pictureOrder: picOrder,
          imgScale: 1,
          imgRotate: 0
        };
      }

    default:
      return state;
  }
}

const Context = createContext(null);

const ContextProvider = ({
  children,
  ...props
}) => {
  const {
    picturesList
  } = props;
  const [state, dispatch] = useReducer(reducer, initialState({
    picturesList
  }));
  return React.createElement(Context.Provider, {
    value: {
      dispatch,
      ...state
    }
  }, children);
};

function useStore() {
  const store = useContext(Context);

  if (!store) {
    throw new Error('store is Empty');
  }

  return store;
}

var usePrevious = ((state, compare) => {
  const prevRef = useRef();
  const curRef = useRef();
  const needUpdate = typeof compare === 'function' ? compare(curRef.current, state) : true;

  if (needUpdate) {
    prevRef.current = curRef.current;
    curRef.current = state;
  }

  return prevRef.current;
});

const floor = num => Math.floor(num);

const abs = num => Math.abs(num);

function useWindowSize() {
  const [windowWidth, setWindowWidth] = useState(document.body.clientWidth);
  const [windowHeight, setWindowHeight] = useState(document.body.clientHeight);
  const setSize = useCallback(() => {
    setWindowWidth(document.body.clientWidth);
    setWindowHeight(document.body.clientHeight);
  }, []);
  useEffect(() => {
    window.addEventListener('resize', setSize);
    return () => {
      window.removeEventListener('resize', setSize);
    };
  }, []);
  return {
    windowWidth,
    windowHeight
  };
}
function useImgSize(fn) {
  const {
    imgScale
  } = useStore();
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  useEffect(() => {
    const ele = fn();
    if (!ele) return;
    setImgWidth(ele.clientWidth * imgScale);
    setImgHeight(ele.clientHeight * imgScale);
  }, [fn]);
  return {
    imgWidth,
    imgHeight
  };
}
function useDragInfo() {
  const {
    windowWidth,
    windowHeight
  } = useWindowSize();
  const {
    imgWidth,
    imgHeight
  } = useImgSize(() => document.querySelector('#viewerImg'));
  const isCanDrag = useMemo(() => imgWidth > windowWidth || imgHeight > windowHeight, [imgWidth, imgHeight, windowWidth, windowHeight]);
  return {
    isCanDrag,
    windowWidth,
    windowHeight,
    imgWidth,
    imgHeight
  };
}
function useMove() {
  const {
    imgScale
  } = useStore();
  const preImgScale = usePrevious(imgScale, (prev, next) => prev !== next);
  const [dragStatus, setDragStatus] = useState(false);
  const [lastReacordPos, setLastRecordPos] = useState({
    x: 0,
    y: 0
  });
  const [startPos, setStartPos] = useState({
    x: 0,
    y: 0
  });
  const [offsetPos, setOffsetPos] = useState({
    x: 0,
    y: 0
  });
  const {
    isCanDrag,
    windowWidth,
    imgWidth,
    windowHeight,
    imgHeight
  } = useDragInfo();
  useEffect(() => {
    if (!isCanDrag) {
      setStartPos({
        x: 0,
        y: 0
      });
      setOffsetPos({
        x: 0,
        y: 0
      });
      setLastRecordPos({
        x: 0,
        y: 0
      });
    } else {
      if (!preImgScale) return;
      if (preImgScale < imgScale) return;
      setOffsetPos({
        x: 0,
        y: 0
      });
      setLastRecordPos({
        x: 0,
        y: 0
      });
    }
  }, [preImgScale, isCanDrag]);
  const onStartMove = useCallback(e => {
    e.preventDefault();
    if (!isCanDrag) return;
    setDragStatus(true);
    setStartPos({
      x: e.clientX,
      y: e.clientY
    });
  }, [isCanDrag]);
  const onMoving = useCallback(e => {
    e.persist();
    if (!isCanDrag || !dragStatus) return;
    const newPosX = startPos.x - e.clientX + lastReacordPos.x;
    const newPosY = startPos.y - e.clientY + lastReacordPos.y;

    if (imgWidth > windowWidth || imgHeight > windowHeight) {
      if (abs(floor(newPosX)) < floor((imgWidth - windowWidth) / 2)) {
        setOffsetPos(pos => ({ ...pos,
          x: newPosX
        }));
      }

      if (abs(floor(newPosY)) < floor((imgHeight - windowHeight) / 2)) {
        setOffsetPos(pos => ({ ...pos,
          y: newPosY
        }));
      }
    }
  }, [isCanDrag, dragStatus, startPos, lastReacordPos, imgWidth, imgHeight, windowWidth, windowHeight]);
  const onEndMove = useCallback(e => {
    e.preventDefault();
    if (dragStatus === false) return;
    setDragStatus(false);
    setLastRecordPos({
      x: offsetPos.x,
      y: offsetPos.y
    });
  }, [isCanDrag, dragStatus, offsetPos]);
  return {
    onStartMove,
    onMoving,
    onEndMove,
    offsetPos,
    dragStatus
  };
}

var styles = {"imgWrapper":"_style-module__imgWrapper__2lMy8","container":"_style-module__container__2wixF"};

const Viewer = () => {
  var _picturesList$picture, _picturesList$picture2;

  const {
    picturesList,
    pictureOrder,
    imgScale,
    imgRotate
  } = useStore();
  const {
    isCanDrag
  } = useDragInfo();
  const {
    onStartMove,
    onMoving,
    onEndMove,
    offsetPos,
    dragStatus
  } = useMove();
  return React.createElement("div", {
    className: styles.imgWrapper,
    onMouseUp: onEndMove,
    onMouseLeave: onEndMove
  }, React.createElement("div", {
    className: styles.container
  }, React.createElement("img", {
    id: "viewerImg",
    draggable: true,
    style: {
      transform: `translate(${-offsetPos.x}px, ${-offsetPos.y}px) scale(${imgScale}) rotate(${imgRotate}deg)`,
      transition: dragStatus ? `none` : 'transform 0.3s ease-in-out',
      cursor: isCanDrag ? 'grab' : 'inherit'
    },
    src: ((_picturesList$picture = picturesList[pictureOrder]) === null || _picturesList$picture === void 0 ? void 0 : _picturesList$picture.src) || '',
    alt: ((_picturesList$picture2 = picturesList[pictureOrder]) === null || _picturesList$picture2 === void 0 ? void 0 : _picturesList$picture2.alt) || '',
    onMouseDown: onStartMove,
    onMouseMove: onMoving
  })));
};

var Viewer$1 = memo(Viewer);

var styles$1 = {"tooltip":"_styles-module__tooltip__3v6O1","tooltipContent":"_styles-module__tooltipContent__kVYhz"};

const Tooltip = ({
  content,
  children
}) => {
  return React.createElement("div", {
    className: styles$1.tooltip
  }, children, React.createElement("span", {
    className: styles$1.tooltipContent
  }, content));
};

var Tooltip$1 = memo(Tooltip);

function useKeyboardClose(usingStatus, onClose) {
  const listenEnterToClose = useCallback(e => {
    if (e.code !== 'Escape') return;
    e.preventDefault();
    onClose();
  }, [onClose]);
  useEffect(() => {
    if (!usingStatus) return;
    document.addEventListener('keyup', listenEnterToClose);
    return () => {
      document.removeEventListener('keyup', listenEnterToClose);
    };
  }, []);
}
function useIntoViewerShown() {
  const {
    layerShown
  } = useStore();
  const [controllerShown, setControllerShown] = useState(true);
  useEffect(() => {
    if (!layerShown) return;
    let timeout = null;
    timeout = setTimeout(() => {
      setControllerShown(false);
    }, 2000);
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [layerShown]);
  return controllerShown;
}
function useScale() {
  const {
    dispatch,
    imgScale
  } = useStore();
  const zoomin = useCallback(() => {
    if (imgScale >= 5) return;
    dispatch({
      type: 'SET_SCALE',
      scale: imgScale + 0.25
    });
  }, [imgScale]);
  const zoomout = useCallback(() => {
    if (imgScale <= 0.25) return;
    dispatch({
      type: 'SET_SCALE',
      scale: imgScale - 0.25
    });
  }, [imgScale]);
  const zoomreset = useCallback(() => {
    dispatch({
      type: 'SET_SCALE',
      scale: 1
    });
  }, []);
  return {
    zoomin,
    zoomout,
    zoomreset
  };
}
function useToggle() {
  const {
    picturesList,
    pictureOrder,
    dispatch
  } = useStore();
  const isCanGoNext = useMemo(() => {
    return pictureOrder + 1 < picturesList.length;
  }, [pictureOrder, picturesList]);
  const isCanGoLast = useMemo(() => {
    return pictureOrder > 0;
  }, [pictureOrder]);
  const goNext = useCallback(() => {
    dispatch({
      type: 'SET_PICTURE_ORDER',
      order: pictureOrder + 1
    });
  }, [pictureOrder]);
  const goLast = useCallback(() => {
    dispatch({
      type: 'SET_PICTURE_ORDER',
      order: pictureOrder - 1
    });
  }, [pictureOrder]);
  return {
    goNext,
    goLast,
    isCanGoNext,
    isCanGoLast
  };
}
function useRotate() {
  const {
    imgRotate,
    dispatch
  } = useStore();
  const rotate = useCallback(() => {
    dispatch({
      type: 'SET_ROTATE',
      rotate: imgRotate + 90
    });
  }, [imgRotate]);
  return {
    rotate
  };
}

var styles$2 = {"container":"_styles-module__container__3HDoU","top":"_styles-module__top__370j9","close":"_styles-module__close__3E0KE","bottom":"_styles-module__bottom__2MUcf","shown":"_styles-module__shown__3Np0V","controller":"_styles-module__controller__1LTsG","controllerItem":"_styles-module__controllerItem__5vOXG","disabled":"_styles-module__disabled__2amGt","separator":"_styles-module__separator__2AeAi"};

const Controller = ({
  onClose,
  keyboard
}) => {
  const {
    dispatch
  } = useStore();
  useKeyboardClose(keyboard, onClose);
  const controllerShown = useIntoViewerShown();
  const {
    zoomin,
    zoomout,
    zoomreset
  } = useScale();
  const {
    rotate
  } = useRotate();
  const {
    goNext,
    goLast,
    isCanGoNext,
    isCanGoLast
  } = useToggle();
  return React.createElement("div", {
    className: styles$2.container
  }, React.createElement("div", {
    className: styles$2.top
  }, React.createElement("div", {
    className: styles$2.close,
    onClick: () => dispatch({
      type: 'SHOWN_LAYER',
      visible: false
    })
  }, React.createElement("i", {
    className: "iconfont icon-close"
  }))), React.createElement("div", {
    className: styles$2.bottom + (controllerShown ? ` ${styles$2.shown}` : '')
  }, React.createElement("div", {
    className: styles$2.controller
  }, (isCanGoLast || isCanGoNext) && React.createElement(Fragment, null, React.createElement(Tooltip$1, {
    content: "\u4E0A\u4E00\u5F20"
  }, React.createElement("div", {
    className: `${styles$2.controllerItem}` + `${isCanGoLast ? '' : ` ${styles$2.disabled}`}`,
    onClick: goLast
  }, React.createElement("i", {
    className: "iconfont icon-arrow",
    style: {
      transform: 'rotate(180deg)'
    }
  }))), React.createElement(Tooltip$1, {
    content: "\u4E0B\u4E00\u5F20"
  }, React.createElement("div", {
    className: `${styles$2.controllerItem}` + `${isCanGoNext ? '' : ` ${styles$2.disabled}`}`,
    onClick: goNext
  }, React.createElement("i", {
    className: "iconfont icon-arrow"
  }))), React.createElement("span", {
    className: styles$2.separator
  })), React.createElement(Tooltip$1, {
    content: "\u65CB\u8F6C"
  }, React.createElement("div", {
    className: styles$2.controllerItem,
    onClick: rotate
  }, React.createElement("i", {
    className: "iconfont icon-rotate",
    style: {
      transform: 'scaleX(-1) rotate(-90deg)'
    }
  }))), React.createElement(Tooltip$1, {
    content: "\u653E\u5927"
  }, React.createElement("div", {
    className: styles$2.controllerItem,
    onClick: zoomin
  }, React.createElement("i", {
    className: "iconfont icon-zoomin"
  }))), React.createElement(Tooltip$1, {
    content: "\u7F29\u5C0F"
  }, React.createElement("div", {
    className: styles$2.controllerItem,
    onClick: zoomout
  }, React.createElement("i", {
    className: "iconfont icon-zoomout"
  }))), React.createElement(Tooltip$1, {
    content: "\u8FD8\u539F\u6BD4\u4F8B"
  }, React.createElement("div", {
    className: styles$2.controllerItem,
    onClick: zoomreset
  }, React.createElement("i", {
    className: "iconfont icon-zoomreset"
  }))))));
};

var Controller$1 = memo(Controller);

var styles$3 = {"tooltip":"_style-module__tooltip__1WUaC"};

let timeout = null;

const ScaleTip = () => {
  const {
    imgScale
  } = useStore();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (timeout) {
      if (!shown) setShown(true);
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      setShown(false);
    }, 1000);
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [imgScale]);
  return React.createElement("div", {
    className: styles$3.tooltip,
    style: {
      opacity: shown ? 1 : 0,
      visibility: shown ? 'visible' : 'hidden'
    }
  }, imgScale * 100, "%");
};

var ScaleTip$1 = memo(ScaleTip);

var styles$4 = {"wrapperLayer":"_styles-module__wrapperLayer__GvF_3"};

const Browser = props => {
  const {
    keyboard,
    pictureOrder,
    zIndex
  } = props;
  const {
    layerShown,
    dispatch
  } = useStore();
  useEffect(() => {
    if (layerShown) {
      dispatch({
        type: 'SET_PICTURE_ORDER',
        order: pictureOrder
      });
    }
  }, [layerShown]);
  return React.createElement(Fragment, null, layerShown && React.createElement(Portal, null, React.createElement("div", {
    className: styles$4.wrapperLayer,
    style: {
      zIndex: +zIndex || 1000
    }
  }, React.createElement(Viewer$1, null), React.createElement(Controller$1, {
    keyboard: keyboard,
    onClose: () => dispatch({
      type: 'SHOWN_LAYER',
      visible: false
    })
  }), React.createElement(ScaleTip$1, null))));
};

var Browser$1 = memo(Browser);

const ImgViewer = memo(props => {
  const {
    style,
    className,
    firstImg
  } = props;
  const {
    dispatch
  } = useStore();
  return React.createElement("img", {
    className: className,
    style: {
      cursor: 'zoom-in',
      ...style
    },
    src: firstImg.src,
    alt: firstImg.alt,
    onClick: () => dispatch({
      type: 'SHOWN_LAYER',
      visible: true
    })
  });
});

const PictureViewer = props => {
  const {
    className,
    style,
    picture,
    zIndex = 1000,
    keyboard = true,
    pictureOrder = 0
  } = props;
  const firstImg = useMemo(() => Array.isArray(picture) ? picture[0] : picture, [picture]);
  const picturesList = useMemo(() => Array.isArray(picture) ? picture : [picture], [picture]);
  return React.createElement(ContextProvider, {
    picturesList: picturesList
  }, React.createElement(Fragment, null, React.createElement(ImgViewer, {
    firstImg: firstImg,
    style: style,
    className: className
  }), React.createElement(Browser$1, {
    zIndex: zIndex,
    keyboard: keyboard,
    pictureOrder: pictureOrder
  })));
};

export default PictureViewer;
//# sourceMappingURL=index.modern.js.map
