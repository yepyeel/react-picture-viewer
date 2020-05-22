function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactPortal = require('react-portal');

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

var initialState = function initialState(picturesList) {
  return {
    picturesList: picturesList,
    layerShown: false,
    imgScale: 1
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

    default:
      return state;
  }
}

var Context = React.createContext(null);

var ContextProvider = function ContextProvider(_ref) {
  var children = _ref.children,
      picturesList = _ref.picturesList;

  var _useReducer = React.useReducer(reducer, initialState(picturesList)),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  return React__default.createElement(Context.Provider, {
    value: _extends({
      dispatch: dispatch
    }, state)
  }, children);
};

function useStore() {
  var store = React.useContext(Context);

  if (!store) {
    throw new Error('store is Empty');
  }

  return store;
}

function useWindowSize() {
  var _useState = React.useState(document.body.clientWidth),
      windowWidth = _useState[0],
      setWindowWidth = _useState[1];

  var _useState2 = React.useState(document.body.clientHeight),
      windowHeight = _useState2[0],
      setWindowHeight = _useState2[1];

  var setSize = React.useCallback(function () {
    setWindowWidth(document.body.clientWidth);
    setWindowHeight(document.body.clientHeight);
  }, []);
  React.useEffect(function () {
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

  var _useState3 = React.useState(0),
      imgWidth = _useState3[0],
      setImgWidth = _useState3[1];

  var _useState4 = React.useState(0),
      imgHeight = _useState4[0],
      setImgHeight = _useState4[1];

  React.useEffect(function () {
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

var styles = {"imgWrapper":"_style-module__imgWrapper__2lMy8","container":"_style-module__container__2wixF"};

var Viewer = function Viewer(_ref) {
  var currentOrder = _ref.currentOrder;

  var _useStore = useStore(),
      picturesList = _useStore.picturesList,
      imgScale = _useStore.imgScale;

  var _useWindowSize = useWindowSize(),
      windowWidth = _useWindowSize.windowWidth,
      windowHeight = _useWindowSize.windowHeight;

  var _useImgSize = useImgSize(function () {
    return document.querySelector('#viewerImg');
  }),
      imgWidth = _useImgSize.imgWidth,
      imgHeight = _useImgSize.imgHeight;

  var isCanDrag = React.useMemo(function () {
    return imgWidth > windowWidth || imgHeight > windowHeight;
  }, [imgWidth, imgHeight, windowWidth, windowHeight]);
  var startMove = React.useCallback(function (e) {
    e.preventDefault();
    if (!isCanDrag) return;
    console.log('startMove', e);
  }, [isCanDrag]);
  var endMove = React.useCallback(function (e) {
    if (!isCanDrag) return;
    console.log('endMove', e);
  }, [isCanDrag]);
  return React__default.createElement("div", {
    className: styles.imgWrapper
  }, React__default.createElement("div", {
    className: styles.container
  }, React__default.createElement("img", {
    id: "viewerImg",
    style: {
      transform: "scale(" + imgScale + ")",
      cursor: isCanDrag ? 'grab' : 'inherit'
    },
    src: picturesList[currentOrder].src,
    alt: picturesList[currentOrder].alt,
    onMouseDown: startMove,
    onMouseUp: endMove
  })));
};

var Viewer$1 = React.memo(Viewer);

var styles$1 = {"tooltip":"_styles-module__tooltip__3v6O1","tooltipContent":"_styles-module__tooltipContent__kVYhz"};

var Tooltip = function Tooltip(_ref) {
  var content = _ref.content,
      children = _ref.children;
  return React__default.createElement("div", {
    className: styles$1.tooltip
  }, children, React__default.createElement("span", {
    className: styles$1.tooltipContent
  }, content));
};

var Tooltip$1 = React.memo(Tooltip);

function useKeyboardClose(usingStatus, onClose) {
  var listenEnterToClose = React.useCallback(function (e) {
    if (e.code !== 'Escape') return;
    e.preventDefault();
    onClose();
  }, [onClose]);
  React.useEffect(function () {
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

  var _useState = React.useState(true),
      controllerShown = _useState[0],
      setControllerShown = _useState[1];

  React.useEffect(function () {
    if (!layerShown) return;
    setTimeout(function () {
      setControllerShown(false);
    }, 2000);
  }, [layerShown]);
  return controllerShown;
}
function useScaleFn() {
  var _useStore2 = useStore(),
      dispatch = _useStore2.dispatch,
      imgScale = _useStore2.imgScale;

  var zoomin = React.useCallback(function () {
    if (imgScale >= 5) return;
    dispatch({
      type: 'SET_SCALE',
      scale: imgScale + 0.25
    });
  }, [imgScale]);
  var zoomout = React.useCallback(function () {
    if (imgScale <= 0.25) return;
    dispatch({
      type: 'SET_SCALE',
      scale: imgScale - 0.25
    });
  }, [imgScale]);
  return {
    zoomin: zoomin,
    zoomout: zoomout
  };
}

var styles$2 = {"container":"_styles-module__container__3HDoU","top":"_styles-module__top__370j9","close":"_styles-module__close__3E0KE","bottom":"_styles-module__bottom__2MUcf","shown":"_styles-module__shown__3Np0V","controller":"_styles-module__controller__1LTsG","controllerItem":"_styles-module__controllerItem__5vOXG","separator":"_styles-module__separator__2AeAi"};

var Controller = function Controller(_ref) {
  var onClose = _ref.onClose,
      keyboard = _ref.keyboard;

  var _useStore = useStore(),
      dispatch = _useStore.dispatch;

  useKeyboardClose(keyboard, onClose);
  var controllerShown = useIntoViewerShown();

  var _useScaleFn = useScaleFn(),
      zoomin = _useScaleFn.zoomin,
      zoomout = _useScaleFn.zoomout;

  return React__default.createElement("div", {
    className: styles$2.container
  }, React__default.createElement("div", {
    className: styles$2.top
  }, React__default.createElement("div", {
    className: styles$2.close,
    onClick: function onClick() {
      return dispatch({
        type: 'SHOWN_LAYER',
        visible: false
      });
    }
  }, React__default.createElement("i", {
    className: "iconfont icon-close"
  }))), React__default.createElement("div", {
    className: styles$2.bottom + (controllerShown ? " " + styles$2.shown : '')
  }, React__default.createElement("div", {
    className: styles$2.controller
  }, React__default.createElement(Tooltip$1, {
    content: "\u4E0A\u4E00\u5F20"
  }, React__default.createElement("div", {
    className: styles$2.controllerItem,
    onClick: zoomin
  }, React__default.createElement("i", {
    className: "iconfont icon-arrow",
    style: {
      transform: 'rotate(180deg)'
    }
  }))), React__default.createElement(Tooltip$1, {
    content: "\u4E0B\u4E00\u5F20"
  }, React__default.createElement("div", {
    className: styles$2.controllerItem,
    onClick: zoomin
  }, React__default.createElement("i", {
    className: "iconfont icon-arrow"
  }))), React__default.createElement("span", {
    className: styles$2.separator
  }), React__default.createElement(Tooltip$1, {
    content: "\u653E\u5927"
  }, React__default.createElement("div", {
    className: styles$2.controllerItem,
    onClick: zoomin
  }, React__default.createElement("i", {
    className: "iconfont icon-zoomin"
  }))), React__default.createElement(Tooltip$1, {
    content: "\u7F29\u5C0F"
  }, React__default.createElement("div", {
    className: styles$2.controllerItem,
    onClick: zoomout
  }, React__default.createElement("i", {
    className: "iconfont icon-zoomout"
  }))))));
};

var Controller$1 = React.memo(Controller);

var styles$3 = {"tooltip":"_style-module__tooltip__1WUaC"};

var timeout = null;

var ScaleTip = function ScaleTip() {
  var _useStore = useStore(),
      imgScale = _useStore.imgScale;

  var _useState = React.useState(false),
      shown = _useState[0],
      setShown = _useState[1];

  React.useEffect(function () {
    if (timeout) {
      if (!shown) setShown(true);
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      setShown(false);
    }, 1000);
  }, [imgScale]);
  return React__default.createElement("div", {
    className: styles$3.tooltip,
    style: {
      opacity: shown ? 1 : 0,
      visibility: shown ? 'visible' : 'hidden'
    }
  }, imgScale * 100, "%");
};

var ScaleTip$1 = React.memo(ScaleTip);

var styles$4 = {"wrapperLayer":"_styles-module__wrapperLayer__GvF_3"};

var Browser = function Browser(props) {
  var keyboard = props.keyboard,
      currentOrder = props.currentOrder;

  var _useStore = useStore(),
      layerShown = _useStore.layerShown,
      dispatch = _useStore.dispatch;

  return React__default.createElement(React.Fragment, null, layerShown && React__default.createElement(reactPortal.Portal, null, React__default.createElement("div", {
    className: styles$4.wrapperLayer
  }, React__default.createElement(Viewer$1, {
    currentOrder: currentOrder
  }), React__default.createElement(Controller$1, {
    keyboard: keyboard,
    onClose: function onClose() {
      return dispatch({
        type: 'SHOWN_LAYER',
        visible: false
      });
    }
  }), React__default.createElement(ScaleTip$1, null))));
};

var Browser$1 = React.memo(Browser);

var ImgViewer = React.memo(function (props) {
  var style = props.style,
      className = props.className,
      firstImg = props.firstImg;

  var _useStore = useStore(),
      dispatch = _useStore.dispatch;

  return React__default.createElement("img", {
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
      _props$currentOrder = props.currentOrder,
      currentOrder = _props$currentOrder === void 0 ? 0 : _props$currentOrder;
  var firstImg = React.useMemo(function () {
    return Array.isArray(picture) ? picture[0] : picture;
  }, [picture]);
  var picturesList = React.useMemo(function () {
    return Array.isArray(picture) ? picture : [picture];
  }, [picture]);
  return React__default.createElement(ContextProvider, {
    picturesList: picturesList
  }, React__default.createElement(React.Fragment, null, React__default.createElement(ImgViewer, {
    firstImg: firstImg,
    style: style,
    className: className
  }), React__default.createElement(Browser$1, {
    zIndex: zIndex,
    keyboard: keyboard,
    currentOrder: currentOrder
  })));
};

exports.PictureViewer = PictureViewer;
exports.default = PictureViewer;
//# sourceMappingURL=index.js.map
