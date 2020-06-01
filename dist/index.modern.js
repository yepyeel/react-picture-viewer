import React, { createContext, useReducer, useContext, useRef, useMemo, useState, useEffect, useCallback, memo, Fragment } from 'react';
import { Portal } from 'react-portal';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var initialState = function initialState(_ref) {
  var picturesList = _ref.picturesList;
  return {
    picturesList: picturesList,
    layerShown: false,
    imgScale: 1,
    pictureOrder: 0,
    imgRotate: 0
  };
};

function reducer(state, action) {
  switch (action.type) {
    case 'SHOWN_LAYER':
      {
        var returnState = _extends(_extends({}, state), {}, {
          layerShown: action.visible
        });

        if (!action.visible) returnState.imgScale = 1;
        return returnState;
      }

    case 'SET_SCALE':
      {
        return _extends(_extends({}, state), {}, {
          imgScale: action.scale
        });
      }

    case 'SET_ROTATE':
      {
        return _extends(_extends({}, state), {}, {
          imgRotate: action.rotate
        });
      }

    case 'SET_PICTURE_ORDER':
      {
        var picturesListLength = state.picturesList.length;
        var picOrder = action.order;

        if (picOrder + 1 > picturesListLength) {
          picOrder = picturesListLength - 1;
        }

        if (picOrder < 0) {
          picOrder = 0;
        }

        return _extends(_extends({}, state), {}, {
          pictureOrder: picOrder,
          imgScale: 1,
          imgRotate: 0
        });
      }

    default:
      return state;
  }
}

var Context = createContext(null);

var ContextProvider = function ContextProvider(_ref) {
  var children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);

  var picturesList = props.picturesList;

  var _useReducer = useReducer(reducer, initialState({
    picturesList: picturesList
  })),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  return React.createElement(Context.Provider, {
    value: _extends({
      dispatch: dispatch
    }, state)
  }, children);
};

function useStore() {
  var store = useContext(Context);

  if (!store) {
    throw new Error('store is Empty');
  }

  return store;
}

var usePrevious = (function (state, compare) {
  var prevRef = useRef();
  var curRef = useRef();
  var needUpdate = typeof compare === 'function' ? compare(curRef.current, state) : true;

  if (needUpdate) {
    prevRef.current = curRef.current;
    curRef.current = state;
  }

  return prevRef.current;
});

var floor = function floor(num) {
  return Math.floor(num);
};

var abs = function abs(num) {
  return Math.abs(num);
};

function useWindowSize() {
  var _useState = useState(document.body.clientWidth),
      windowWidth = _useState[0],
      setWindowWidth = _useState[1];

  var _useState2 = useState(document.body.clientHeight),
      windowHeight = _useState2[0],
      setWindowHeight = _useState2[1];

  var setSize = useCallback(function () {
    setWindowWidth(document.body.clientWidth);
    setWindowHeight(document.body.clientHeight);
  }, []);
  useEffect(function () {
    window.addEventListener('resize', setSize);
    return function () {
      window.removeEventListener('resize', setSize);
    };
  }, []);
  return {
    windowWidth: windowWidth,
    windowHeight: windowHeight
  };
}
function useImgSize(fn) {
  var _useStore = useStore(),
      imgScale = _useStore.imgScale;

  var _useState3 = useState(0),
      imgWidth = _useState3[0],
      setImgWidth = _useState3[1];

  var _useState4 = useState(0),
      imgHeight = _useState4[0],
      setImgHeight = _useState4[1];

  useEffect(function () {
    var ele = fn();
    if (!ele) return;
    setImgWidth(ele.clientWidth * imgScale);
    setImgHeight(ele.clientHeight * imgScale);
  }, [fn]);
  return {
    imgWidth: imgWidth,
    imgHeight: imgHeight
  };
}
function useDragInfo() {
  var _useWindowSize = useWindowSize(),
      windowWidth = _useWindowSize.windowWidth,
      windowHeight = _useWindowSize.windowHeight;

  var _useImgSize = useImgSize(function () {
    return document.querySelector('#viewerImg');
  }),
      imgWidth = _useImgSize.imgWidth,
      imgHeight = _useImgSize.imgHeight;

  var isCanDrag = useMemo(function () {
    return imgWidth > windowWidth || imgHeight > windowHeight;
  }, [imgWidth, imgHeight, windowWidth, windowHeight]);
  return {
    isCanDrag: isCanDrag,
    windowWidth: windowWidth,
    windowHeight: windowHeight,
    imgWidth: imgWidth,
    imgHeight: imgHeight
  };
}
function useMove() {
  var _useStore2 = useStore(),
      imgScale = _useStore2.imgScale;

  var preImgScale = usePrevious(imgScale, function (prev, next) {
    return prev !== next;
  });

  var _useState5 = useState(false),
      dragStatus = _useState5[0],
      setDragStatus = _useState5[1];

  var _useState6 = useState({
    x: 0,
    y: 0
  }),
      lastReacordPos = _useState6[0],
      setLastRecordPos = _useState6[1];

  var _useState7 = useState({
    x: 0,
    y: 0
  }),
      startPos = _useState7[0],
      setStartPos = _useState7[1];

  var _useState8 = useState({
    x: 0,
    y: 0
  }),
      offsetPos = _useState8[0],
      setOffsetPos = _useState8[1];

  var _useDragInfo = useDragInfo(),
      isCanDrag = _useDragInfo.isCanDrag,
      windowWidth = _useDragInfo.windowWidth,
      imgWidth = _useDragInfo.imgWidth,
      windowHeight = _useDragInfo.windowHeight,
      imgHeight = _useDragInfo.imgHeight;

  useEffect(function () {
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
  var onStartMove = useCallback(function (e) {
    e.preventDefault();
    if (!isCanDrag) return;
    setDragStatus(true);
    setStartPos({
      x: e.clientX,
      y: e.clientY
    });
  }, [isCanDrag]);
  var onMoving = useCallback(function (e) {
    e.persist();
    if (!isCanDrag || !dragStatus) return;
    var newPosX = startPos.x - e.clientX + lastReacordPos.x;
    var newPosY = startPos.y - e.clientY + lastReacordPos.y;

    if (imgWidth > windowWidth || imgHeight > windowHeight) {
      if (abs(floor(newPosX)) < floor((imgWidth - windowWidth) / 2)) {
        setOffsetPos(function (pos) {
          return _extends(_extends({}, pos), {}, {
            x: newPosX
          });
        });
      }

      if (abs(floor(newPosY)) < floor((imgHeight - windowHeight) / 2)) {
        setOffsetPos(function (pos) {
          return _extends(_extends({}, pos), {}, {
            y: newPosY
          });
        });
      }
    }
  }, [isCanDrag, dragStatus, startPos, lastReacordPos, imgWidth, imgHeight, windowWidth, windowHeight]);
  var onEndMove = useCallback(function (e) {
    e.preventDefault();
    if (dragStatus === false) return;
    setDragStatus(false);
    setLastRecordPos({
      x: offsetPos.x,
      y: offsetPos.y
    });
  }, [isCanDrag, dragStatus, offsetPos]);
  return {
    onStartMove: onStartMove,
    onMoving: onMoving,
    onEndMove: onEndMove,
    offsetPos: offsetPos,
    dragStatus: dragStatus
  };
}

var styles = {"imgWrapper":"_2lMy8","container":"_2wixF"};

var Viewer = function Viewer() {
  var _picturesList$picture, _picturesList$picture2;

  var _useStore = useStore(),
      picturesList = _useStore.picturesList,
      pictureOrder = _useStore.pictureOrder,
      imgScale = _useStore.imgScale,
      imgRotate = _useStore.imgRotate;

  var _useDragInfo = useDragInfo(),
      isCanDrag = _useDragInfo.isCanDrag;

  var _useMove = useMove(),
      onStartMove = _useMove.onStartMove,
      onMoving = _useMove.onMoving,
      onEndMove = _useMove.onEndMove,
      offsetPos = _useMove.offsetPos,
      dragStatus = _useMove.dragStatus;

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
      transform: "translate(" + -offsetPos.x + "px, " + -offsetPos.y + "px) scale(" + imgScale + ") rotate(" + imgRotate + "deg)",
      transition: dragStatus ? "none" : 'transform 0.3s ease-in-out',
      cursor: isCanDrag ? 'grab' : 'inherit'
    },
    src: ((_picturesList$picture = picturesList[pictureOrder]) === null || _picturesList$picture === void 0 ? void 0 : _picturesList$picture.src) || '',
    alt: ((_picturesList$picture2 = picturesList[pictureOrder]) === null || _picturesList$picture2 === void 0 ? void 0 : _picturesList$picture2.alt) || '',
    onMouseDown: onStartMove,
    onMouseMove: onMoving
  })));
};

var Viewer$1 = memo(Viewer);

var styles$1 = {"tooltip":"_3v6O1","tooltipContent":"_kVYhz"};

var Tooltip = function Tooltip(_ref) {
  var content = _ref.content,
      children = _ref.children;
  return React.createElement("div", {
    className: styles$1.tooltip
  }, children, React.createElement("span", {
    className: styles$1.tooltipContent
  }, content));
};

var Tooltip$1 = memo(Tooltip);

function useKeyboardClose(usingStatus, onClose) {
  var listenEnterToClose = useCallback(function (e) {
    if (e.code !== 'Escape') return;
    e.preventDefault();
    onClose();
  }, [onClose]);
  useEffect(function () {
    if (!usingStatus) return;
    document.addEventListener('keyup', listenEnterToClose);
    return function () {
      document.removeEventListener('keyup', listenEnterToClose);
    };
  }, []);
}
function useIntoViewerShown() {
  var _useStore = useStore(),
      layerShown = _useStore.layerShown;

  var _useState = useState(true),
      controllerShown = _useState[0],
      setControllerShown = _useState[1];

  useEffect(function () {
    if (!layerShown) return;
    var timeout = null;
    timeout = setTimeout(function () {
      setControllerShown(false);
    }, 2000);
    return function () {
      if (timeout) clearTimeout(timeout);
    };
  }, [layerShown]);
  return controllerShown;
}
function useScale() {
  var _useStore2 = useStore(),
      dispatch = _useStore2.dispatch,
      imgScale = _useStore2.imgScale;

  var zoomin = useCallback(function () {
    if (imgScale >= 5) return;
    dispatch({
      type: 'SET_SCALE',
      scale: imgScale + 0.25
    });
  }, [imgScale]);
  var zoomout = useCallback(function () {
    if (imgScale <= 0.25) return;
    dispatch({
      type: 'SET_SCALE',
      scale: imgScale - 0.25
    });
  }, [imgScale]);
  var zoomreset = useCallback(function () {
    dispatch({
      type: 'SET_SCALE',
      scale: 1
    });
  }, []);
  return {
    zoomin: zoomin,
    zoomout: zoomout,
    zoomreset: zoomreset
  };
}
function useToggle() {
  var _useStore3 = useStore(),
      picturesList = _useStore3.picturesList,
      pictureOrder = _useStore3.pictureOrder,
      dispatch = _useStore3.dispatch;

  var isCanGoNext = useMemo(function () {
    return pictureOrder + 1 < picturesList.length;
  }, [pictureOrder, picturesList]);
  var isCanGoLast = useMemo(function () {
    return pictureOrder > 0;
  }, [pictureOrder]);
  var goNext = useCallback(function () {
    dispatch({
      type: 'SET_PICTURE_ORDER',
      order: pictureOrder + 1
    });
  }, [pictureOrder]);
  var goLast = useCallback(function () {
    dispatch({
      type: 'SET_PICTURE_ORDER',
      order: pictureOrder - 1
    });
  }, [pictureOrder]);
  return {
    goNext: goNext,
    goLast: goLast,
    isCanGoNext: isCanGoNext,
    isCanGoLast: isCanGoLast
  };
}
function useRotate() {
  var _useStore4 = useStore(),
      imgRotate = _useStore4.imgRotate,
      dispatch = _useStore4.dispatch;

  var rotate = useCallback(function () {
    dispatch({
      type: 'SET_ROTATE',
      rotate: imgRotate + 90
    });
  }, [imgRotate]);
  return {
    rotate: rotate
  };
}

var styles$2 = {"container":"_3HDoU","top":"_370j9","close":"_3E0KE","bottom":"_2MUcf","shown":"_3Np0V","controller":"_1LTsG","controllerItem":"_5vOXG","disabled":"_2amGt","separator":"_2AeAi"};

var Controller = function Controller(_ref) {
  var onClose = _ref.onClose,
      keyboard = _ref.keyboard;

  var _useStore = useStore(),
      dispatch = _useStore.dispatch;

  useKeyboardClose(keyboard, onClose);
  var controllerShown = useIntoViewerShown();

  var _useScale = useScale(),
      zoomin = _useScale.zoomin,
      zoomout = _useScale.zoomout,
      zoomreset = _useScale.zoomreset;

  var _useRotate = useRotate(),
      rotate = _useRotate.rotate;

  var _useToggle = useToggle(),
      goNext = _useToggle.goNext,
      goLast = _useToggle.goLast,
      isCanGoNext = _useToggle.isCanGoNext,
      isCanGoLast = _useToggle.isCanGoLast;

  return React.createElement("div", {
    className: styles$2.container
  }, React.createElement("div", {
    className: styles$2.top
  }, React.createElement("div", {
    className: styles$2.close,
    onClick: function onClick() {
      return dispatch({
        type: 'SHOWN_LAYER',
        visible: false
      });
    }
  }, React.createElement("i", {
    className: "iconfont icon-close"
  }))), React.createElement("div", {
    className: styles$2.bottom + (controllerShown ? " " + styles$2.shown : '')
  }, React.createElement("div", {
    className: styles$2.controller
  }, (isCanGoLast || isCanGoNext) && React.createElement(Fragment, null, React.createElement(Tooltip$1, {
    content: "\u4E0A\u4E00\u5F20"
  }, React.createElement("div", {
    className: "" + styles$2.controllerItem + ("" + (isCanGoLast ? '' : " " + styles$2.disabled)),
    onClick: goLast
  }, React.createElement("i", {
    className: "iconfont icon-arrow",
    style: {
      transform: 'rotate(180deg)'
    }
  }))), React.createElement(Tooltip$1, {
    content: "\u4E0B\u4E00\u5F20"
  }, React.createElement("div", {
    className: "" + styles$2.controllerItem + ("" + (isCanGoNext ? '' : " " + styles$2.disabled)),
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

var styles$3 = {"tooltip":"_1WUaC"};

var timeout = null;

var ScaleTip = function ScaleTip() {
  var _useStore = useStore(),
      imgScale = _useStore.imgScale;

  var _useState = useState(false),
      shown = _useState[0],
      setShown = _useState[1];

  useEffect(function () {
    if (timeout) {
      if (!shown) setShown(true);
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      setShown(false);
    }, 1000);
    return function () {
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

var styles$4 = {"wrapperLayer":"_GvF_3"};

var Browser = function Browser(props) {
  var keyboard = props.keyboard,
      pictureOrder = props.pictureOrder,
      zIndex = props.zIndex;

  var _useStore = useStore(),
      layerShown = _useStore.layerShown,
      dispatch = _useStore.dispatch;

  useEffect(function () {
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
    onClose: function onClose() {
      return dispatch({
        type: 'SHOWN_LAYER',
        visible: false
      });
    }
  }), React.createElement(ScaleTip$1, null))));
};

var Browser$1 = memo(Browser);

var ImgViewer = memo(function (props) {
  var style = props.style,
      className = props.className,
      firstImg = props.firstImg;

  var _useStore = useStore(),
      dispatch = _useStore.dispatch;

  return React.createElement("img", {
    className: className,
    style: _extends({
      cursor: 'zoom-in'
    }, style),
    src: firstImg.src,
    alt: firstImg.alt,
    onClick: function onClick() {
      return dispatch({
        type: 'SHOWN_LAYER',
        visible: true
      });
    }
  });
});

var PictureViewer = function PictureViewer(props) {
  var className = props.className,
      style = props.style,
      picture = props.picture,
      _props$zIndex = props.zIndex,
      zIndex = _props$zIndex === void 0 ? 1000 : _props$zIndex,
      _props$keyboard = props.keyboard,
      keyboard = _props$keyboard === void 0 ? true : _props$keyboard,
      _props$pictureOrder = props.pictureOrder,
      pictureOrder = _props$pictureOrder === void 0 ? 0 : _props$pictureOrder;
  var firstImg = useMemo(function () {
    return Array.isArray(picture) ? picture[0] : picture;
  }, [picture]);
  var picturesList = useMemo(function () {
    return Array.isArray(picture) ? picture : [picture];
  }, [picture]);
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
