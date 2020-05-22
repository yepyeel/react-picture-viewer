import React, { createContext, useReducer, useContext, memo, useCallback, useEffect, useState, Fragment, useMemo } from 'react';
import { Portal } from 'react-portal';

const initialState = picturesList => ({
  picturesList,
  layerShown: false,
  imgScale: 1
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

    default:
      return state;
  }
}

const Context = createContext(null);

const ContextProvider = ({
  children,
  picturesList
}) => {
  const [state, dispatch] = useReducer(reducer, initialState(picturesList));
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

var styles = {"imgWrapper":"_style-module__imgWrapper__2lMy8","container":"_style-module__container__2wixF"};

const Viewer = ({
  currentOrder
}) => {
  const {
    picturesList,
    imgScale
  } = useStore();
  return React.createElement("div", {
    className: styles.imgWrapper
  }, React.createElement("div", {
    className: styles.container
  }, React.createElement("img", {
    style: {
      transform: `scale(${imgScale})`
    },
    src: picturesList[currentOrder].src,
    alt: picturesList[currentOrder].alt,
    onMouseDown: e => e.preventDefault()
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
    setTimeout(() => {
      setControllerShown(false);
    }, 2000);
  }, [layerShown]);
  return controllerShown;
}
function useScaleFn() {
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
  return {
    zoomin,
    zoomout
  };
}

var styles$2 = {"container":"_styles-module__container__3HDoU","top":"_styles-module__top__370j9","close":"_styles-module__close__3E0KE","bottom":"_styles-module__bottom__2MUcf","shown":"_styles-module__shown__3Np0V","controller":"_styles-module__controller__1LTsG","controllerItem":"_styles-module__controllerItem__5vOXG","separator":"_styles-module__separator__2AeAi"};

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
    zoomout
  } = useScaleFn();
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
  }, React.createElement(Tooltip$1, {
    content: "\u4E0A\u4E00\u5F20"
  }, React.createElement("div", {
    className: styles$2.controllerItem,
    onClick: zoomin
  }, React.createElement("i", {
    className: "iconfont icon-arrow",
    style: {
      transform: 'rotate(180deg)'
    }
  }))), React.createElement(Tooltip$1, {
    content: "\u4E0B\u4E00\u5F20"
  }, React.createElement("div", {
    className: styles$2.controllerItem,
    onClick: zoomin
  }, React.createElement("i", {
    className: "iconfont icon-arrow"
  }))), React.createElement("span", {
    className: styles$2.separator
  }), React.createElement(Tooltip$1, {
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
    currentOrder
  } = props;
  const {
    layerShown,
    dispatch
  } = useStore();
  return React.createElement(Fragment, null, layerShown && React.createElement(Portal, null, React.createElement("div", {
    className: styles$4.wrapperLayer
  }, React.createElement(Viewer$1, {
    currentOrder: currentOrder
  }), React.createElement(Controller$1, {
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
    currentOrder = 0
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
    currentOrder: currentOrder
  })));
};

export default PictureViewer;
export { PictureViewer };
//# sourceMappingURL=index.modern.js.map
