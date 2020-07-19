(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var CRender = require('../lib/index')

window.CRender = CRender
},{"../lib/index":6}],2:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _color = _interopRequireDefault(require("@jiaminghi/color"));

var _bezierCurve = _interopRequireDefault(require("@jiaminghi/bezier-curve"));

var _util = require("../plugin/util");

var _graphs = _interopRequireDefault(require("../config/graphs"));

var _graph = _interopRequireDefault(require("./graph.class"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @description           Class of CRender
 * @param {Object} canvas Canvas DOM
 * @return {CRender}      Instance of CRender
 */
var CRender = function CRender(canvas) {
  (0, _classCallCheck2["default"])(this, CRender);

  if (!canvas) {
    console.error('CRender Missing parameters!');
    return;
  }

  var ctx = canvas.getContext('2d');
  var clientWidth = canvas.clientWidth,
      clientHeight = canvas.clientHeight;
  var area = [clientWidth, clientHeight];
  canvas.setAttribute('width', clientWidth);
  canvas.setAttribute('height', clientHeight);
  /**
   * @description Context of the canvas
   * @type {Object}
   * @example ctx = canvas.getContext('2d')
   */

  this.ctx = ctx;
  /**
   * @description Width and height of the canvas
   * @type {Array}
   * @example area = [300，100]
   */

  this.area = area;
  /**
   * @description Whether render is in animation rendering
   * @type {Boolean}
   * @example animationStatus = true|false
   */

  this.animationStatus = false;
  /**
   * @description Added graph
   * @type {[Graph]}
   * @example graphs = [Graph, Graph, ...]
   */

  this.graphs = [];
  /**
   * @description Color plugin
   * @type {Object}
   * @link https://github.com/jiaming743/color
   */

  this.color = _color["default"];
  /**
   * @description Bezier Curve plugin
   * @type {Object}
   * @link https://github.com/jiaming743/BezierCurve
   */

  this.bezierCurve = _bezierCurve["default"]; // bind event handler

  canvas.addEventListener('mousedown', mouseDown.bind(this));
  canvas.addEventListener('mousemove', mouseMove.bind(this));
  canvas.addEventListener('mouseup', mouseUp.bind(this));
};
/**
 * @description        Clear canvas drawing area
 * @return {Undefined} Void
 */


exports["default"] = CRender;

CRender.prototype.clearArea = function () {
  var _this$ctx;

  var area = this.area;

  (_this$ctx = this.ctx).clearRect.apply(_this$ctx, [0, 0].concat((0, _toConsumableArray2["default"])(area)));
};
/**
 * @description           Add graph to render
 * @param {Object} config Graph configuration
 * @return {Graph}        Graph instance
 */


CRender.prototype.add = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var name = config.name;

  if (!name) {
    console.error('add Missing parameters!');
    return;
  }

  var graphConfig = _graphs["default"].get(name);

  if (!graphConfig) {
    console.warn('No corresponding graph configuration found!');
    return;
  }

  var graph = new _graph["default"](graphConfig, config);
  if (!graph.validator(graph)) return;
  graph.render = this;
  this.graphs.push(graph);
  this.sortGraphsByIndex();
  this.drawAllGraph();
  return graph;
};
/**
 * @description Sort the graph by index
 * @return {Undefined} Void
 */


CRender.prototype.sortGraphsByIndex = function () {
  var graphs = this.graphs;
  graphs.sort(function (a, b) {
    if (a.index > b.index) return 1;
    if (a.index === b.index) return 0;
    if (a.index < b.index) return -1;
  });
};
/**
 * @description         Delete graph in render
 * @param {Graph} graph The graph to be deleted
 * @return {Undefined}  Void
 */


CRender.prototype.delGraph = function (graph) {
  if (typeof graph.delProcessor !== 'function') return;
  graph.delProcessor(this);
  this.graphs = this.graphs.filter(function (graph) {
    return graph;
  });
  this.drawAllGraph();
};
/**
 * @description        Delete all graph in render
 * @return {Undefined} Void
 */


CRender.prototype.delAllGraph = function () {
  var _this = this;

  this.graphs.forEach(function (graph) {
    return graph.delProcessor(_this);
  });
  this.graphs = this.graphs.filter(function (graph) {
    return graph;
  });
  this.drawAllGraph();
};
/**
 * @description        Draw all the graphs in the render
 * @return {Undefined} Void
 */


CRender.prototype.drawAllGraph = function () {
  var _this2 = this;

  this.clearArea();
  this.graphs.filter(function (graph) {
    return graph && graph.visible;
  }).forEach(function (graph) {
    return graph.drawProcessor(_this2, graph);
  });
};
/**
 * @description      Animate the graph whose animation queue is not empty
 *                   and the animationPause is equal to false
 * @return {Promise} Animation Promise
 */


CRender.prototype.launchAnimation = function () {
  var _this3 = this;

  var animationStatus = this.animationStatus;
  if (animationStatus) return;
  this.animationStatus = true;
  return new Promise(function (resolve) {
    animation.call(_this3, function () {
      _this3.animationStatus = false;
      resolve();
    }, Date.now());
  });
};
/**
 * @description Try to animate every graph
 * @param {Function} callback Callback in animation end
 * @param {Number} timeStamp  Time stamp of animation start
 * @return {Undefined} Void
 */


function animation(callback, timeStamp) {
  var graphs = this.graphs;

  if (!animationAble(graphs)) {
    callback();
    return;
  }

  graphs.forEach(function (graph) {
    return graph.turnNextAnimationFrame(timeStamp);
  });
  this.drawAllGraph();
  requestAnimationFrame(animation.bind(this, callback, timeStamp));
}
/**
 * @description Find if there are graph that can be animated
 * @param {[Graph]} graphs
 * @return {Boolean}
 */


function animationAble(graphs) {
  return graphs.find(function (graph) {
    return !graph.animationPause && graph.animationFrameState.length;
  });
}
/**
 * @description Handler of CRender mousedown event
 * @return {Undefined} Void
 */


function mouseDown(e) {
  var graphs = this.graphs;
  var hoverGraph = graphs.find(function (graph) {
    return graph.status === 'hover';
  });
  if (!hoverGraph) return;
  hoverGraph.status = 'active';
}
/**
 * @description Handler of CRender mousemove event
 * @return {Undefined} Void
 */


function mouseMove(e) {
  var offsetX = e.offsetX,
      offsetY = e.offsetY;
  var position = [offsetX, offsetY];
  var graphs = this.graphs;
  var activeGraph = graphs.find(function (graph) {
    return graph.status === 'active' || graph.status === 'drag';
  });

  if (activeGraph) {
    if (!activeGraph.drag) return;

    if (typeof activeGraph.move !== 'function') {
      console.error('No move method is provided, cannot be dragged!');
      return;
    }

    activeGraph.moveProcessor(e);
    activeGraph.status = 'drag';
    return;
  }

  var hoverGraph = graphs.find(function (graph) {
    return graph.status === 'hover';
  });
  var hoverAbleGraphs = graphs.filter(function (graph) {
    return graph.hover && (typeof graph.hoverCheck === 'function' || graph.hoverRect);
  });
  var hoveredGraph = hoverAbleGraphs.find(function (graph) {
    return graph.hoverCheckProcessor(position, graph);
  });

  if (hoveredGraph) {
    document.body.style.cursor = hoveredGraph.style.hoverCursor;
  } else {
    document.body.style.cursor = 'default';
  }

  var hoverGraphMouseOuterIsFun = false,
      hoveredGraphMouseEnterIsFun = false;
  if (hoverGraph) hoverGraphMouseOuterIsFun = typeof hoverGraph.mouseOuter === 'function';
  if (hoveredGraph) hoveredGraphMouseEnterIsFun = typeof hoveredGraph.mouseEnter === 'function';
  if (!hoveredGraph && !hoverGraph) return;

  if (!hoveredGraph && hoverGraph) {
    if (hoverGraphMouseOuterIsFun) hoverGraph.mouseOuter(e, hoverGraph);
    hoverGraph.status = 'static';
    return;
  }

  if (hoveredGraph && hoveredGraph === hoverGraph) return;

  if (hoveredGraph && !hoverGraph) {
    if (hoveredGraphMouseEnterIsFun) hoveredGraph.mouseEnter(e, hoveredGraph);
    hoveredGraph.status = 'hover';
    return;
  }

  if (hoveredGraph && hoverGraph && hoveredGraph !== hoverGraph) {
    if (hoverGraphMouseOuterIsFun) hoverGraph.mouseOuter(e, hoverGraph);
    hoverGraph.status = 'static';
    if (hoveredGraphMouseEnterIsFun) hoveredGraph.mouseEnter(e, hoveredGraph);
    hoveredGraph.status = 'hover';
  }
}
/**
 * @description Handler of CRender mouseup event
 * @return {Undefined} Void
 */


function mouseUp(e) {
  var graphs = this.graphs;
  var activeGraph = graphs.find(function (graph) {
    return graph.status === 'active';
  });
  var dragGraph = graphs.find(function (graph) {
    return graph.status === 'drag';
  });
  if (activeGraph && typeof activeGraph.click === 'function') activeGraph.click(e, activeGraph);
  graphs.forEach(function (graph) {
    return graph && (graph.status = 'static');
  });
  if (activeGraph) activeGraph.status = 'hover';
  if (dragGraph) dragGraph.status = 'hover';
}
/**
 * @description         Clone Graph
 * @param {Graph} graph The target to be cloned
 * @return {Graph}      Cloned graph
 */


CRender.prototype.clone = function (graph) {
  var style = graph.style.getStyle();

  var clonedGraph = _objectSpread(_objectSpread({}, graph), {}, {
    style: style
  });

  delete clonedGraph.render;
  clonedGraph = (0, _util.deepClone)(clonedGraph, true);
  return this.add(clonedGraph);
};
},{"../config/graphs":5,"../plugin/util":8,"./graph.class":3,"@babel/runtime/helpers/classCallCheck":13,"@babel/runtime/helpers/defineProperty":14,"@babel/runtime/helpers/interopRequireDefault":15,"@babel/runtime/helpers/toConsumableArray":21,"@jiaminghi/bezier-curve":27,"@jiaminghi/color":29}],3:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _style = _interopRequireDefault(require("./style.class"));

var _transition = _interopRequireDefault(require("@jiaminghi/transition"));

var _util = require("../plugin/util");

/**
 * @description Class Graph
 * @param {Object} graph  Graph default configuration
 * @param {Object} config Graph config
 * @return {Graph} Instance of Graph
 */
var Graph = function Graph(graph, config) {
  (0, _classCallCheck2["default"])(this, Graph);
  config = (0, _util.deepClone)(config, true);
  var defaultConfig = {
    /**
     * @description Weather to render graph
     * @type {Boolean}
     * @default visible = true
     */
    visible: true,

    /**
     * @description Whether to enable drag
     * @type {Boolean}
     * @default drag = false
     */
    drag: false,

    /**
     * @description Whether to enable hover
     * @type {Boolean}
     * @default hover = false
     */
    hover: false,

    /**
     * @description Graph rendering index
     *  Give priority to index high graph in rendering
     * @type {Number}
     * @example index = 1
     */
    index: 1,

    /**
     * @description Animation delay time(ms)
     * @type {Number}
     * @default animationDelay = 0
     */
    animationDelay: 0,

    /**
     * @description Number of animation frames
     * @type {Number}
     * @default animationFrame = 30
     */
    animationFrame: 30,

    /**
     * @description Animation dynamic curve (Supported by transition)
     * @type {String}
     * @default animationCurve = 'linear'
     * @link https://github.com/jiaming743/Transition
     */
    animationCurve: 'linear',

    /**
     * @description Weather to pause graph animation
     * @type {Boolean}
     * @default animationPause = false
     */
    animationPause: false,

    /**
     * @description Rectangular hover detection zone
     *  Use this method for hover detection first
     * @type {Null|Array}
     * @default hoverRect = null
     * @example hoverRect = [0, 0, 100, 100] // [Rect start x, y, Rect width, height]
     */
    hoverRect: null,

    /**
     * @description Mouse enter event handler
     * @type {Function|Null}
     * @default mouseEnter = null
     */
    mouseEnter: null,

    /**
     * @description Mouse outer event handler
     * @type {Function|Null}
     * @default mouseOuter = null
     */
    mouseOuter: null,

    /**
     * @description Mouse click event handler
     * @type {Function|Null}
     * @default click = null
     */
    click: null
  };
  var configAbleNot = {
    status: 'static',
    animationRoot: [],
    animationKeys: [],
    animationFrameState: [],
    cache: {}
  };
  if (!config.shape) config.shape = {};
  if (!config.style) config.style = {};
  var shape = Object.assign({}, graph.shape, config.shape);
  Object.assign(defaultConfig, config, configAbleNot);
  Object.assign(this, graph, defaultConfig);
  this.shape = shape;
  this.style = new _style["default"](config.style);
  this.addedProcessor();
};
/**
 * @description Processor of added
 * @return {Undefined} Void
 */


exports["default"] = Graph;

Graph.prototype.addedProcessor = function () {
  if (typeof this.setGraphCenter === 'function') this.setGraphCenter(null, this); // The life cycle 'added"

  if (typeof this.added === 'function') this.added(this);
};
/**
 * @description Processor of draw
 * @param {CRender} render Instance of CRender
 * @param {Graph} graph    Instance of Graph
 * @return {Undefined} Void
 */


Graph.prototype.drawProcessor = function (render, graph) {
  var ctx = render.ctx;
  graph.style.initStyle(ctx);
  if (typeof this.beforeDraw === 'function') this.beforeDraw(this, render);
  graph.draw(render, graph);
  if (typeof this.drawed === 'function') this.drawed(this, render);
  graph.style.restoreTransform(ctx);
};
/**
 * @description Processor of hover check
 * @param {Array} position Mouse Position
 * @param {Graph} graph    Instance of Graph
 * @return {Boolean} Result of hover check
 */


Graph.prototype.hoverCheckProcessor = function (position, _ref) {
  var hoverRect = _ref.hoverRect,
      style = _ref.style,
      hoverCheck = _ref.hoverCheck;
  var graphCenter = style.graphCenter,
      rotate = style.rotate,
      scale = style.scale,
      translate = style.translate;

  if (graphCenter) {
    if (rotate) position = (0, _util.getRotatePointPos)(-rotate, position, graphCenter);
    if (scale) position = (0, _util.getScalePointPos)(scale.map(function (s) {
      return 1 / s;
    }), position, graphCenter);
    if (translate) position = (0, _util.getTranslatePointPos)(translate.map(function (v) {
      return v * -1;
    }), position);
  }

  console.log('hoverRect = ', hoverRect);
  if (hoverRect) return _util.checkPointIsInRect.apply(void 0, [position].concat((0, _toConsumableArray2["default"])(hoverRect)));
  return hoverCheck(position, this);
};
/**
 * @description Processor of move
 * @param {Event} e Mouse movement event
 * @return {Undefined} Void
 */


Graph.prototype.moveProcessor = function (e) {
  this.move(e, this);
  if (typeof this.beforeMove === 'function') this.beforeMove(e, this);
  if (typeof this.setGraphCenter === 'function') this.setGraphCenter(e, this);
  if (typeof this.moved === 'function') this.moved(e, this);
};
/**
 * @description Update graph state
 * @param {String} attrName Updated attribute name
 * @param {Any} change      Updated value
 * @return {Undefined} Void
 */


Graph.prototype.attr = function (attrName) {
  var change = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  if (!attrName || change === undefined) return false;
  var isObject = (0, _typeof2["default"])(this[attrName]) === 'object';
  if (isObject) change = (0, _util.deepClone)(change, true);
  var render = this.render;

  if (attrName === 'style') {
    this.style.update(change);
  } else if (isObject) {
    Object.assign(this[attrName], change);
  } else {
    this[attrName] = change;
  }

  if (attrName === 'index') render.sortGraphsByIndex();
  render.drawAllGraph();
};
/**
 * @description Update graphics state (with animation)
 *  Only shape and style attributes are supported
 * @param {String} attrName Updated attribute name
 * @param {Any} change      Updated value
 * @param {Boolean} wait    Whether to store the animation waiting
 *                          for the next animation request
 * @return {Promise} Animation Promise
 */


Graph.prototype.animation = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(attrName, change) {
    var wait,
        changeRoot,
        changeKeys,
        beforeState,
        animationFrame,
        animationCurve,
        animationDelay,
        animationFrameState,
        render,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            wait = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;

            if (!(attrName !== 'shape' && attrName !== 'style')) {
              _context2.next = 4;
              break;
            }

            console.error('Only supported shape and style animation!');
            return _context2.abrupt("return");

          case 4:
            change = (0, _util.deepClone)(change, true);
            if (attrName === 'style') this.style.colorProcessor(change);
            changeRoot = this[attrName];
            changeKeys = Object.keys(change);
            beforeState = {};
            changeKeys.forEach(function (key) {
              return beforeState[key] = changeRoot[key];
            });
            animationFrame = this.animationFrame, animationCurve = this.animationCurve, animationDelay = this.animationDelay;
            animationFrameState = (0, _transition["default"])(animationCurve, beforeState, change, animationFrame, true);
            this.animationRoot.push(changeRoot);
            this.animationKeys.push(changeKeys);
            this.animationFrameState.push(animationFrameState);

            if (!wait) {
              _context2.next = 17;
              break;
            }

            return _context2.abrupt("return");

          case 17:
            if (!(animationDelay > 0)) {
              _context2.next = 20;
              break;
            }

            _context2.next = 20;
            return delay(animationDelay);

          case 20:
            render = this.render;
            return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return render.launchAnimation();

                      case 2:
                        resolve();

                      case 3:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @description Extract the next frame of data from the animation queue
 *              and update the graph state
 * @return {Undefined} Void
 */


Graph.prototype.turnNextAnimationFrame = function (timeStamp) {
  var animationDelay = this.animationDelay,
      animationRoot = this.animationRoot,
      animationKeys = this.animationKeys,
      animationFrameState = this.animationFrameState,
      animationPause = this.animationPause;
  if (animationPause) return;
  if (Date.now() - timeStamp < animationDelay) return;
  animationRoot.forEach(function (root, i) {
    animationKeys[i].forEach(function (key) {
      root[key] = animationFrameState[i][0][key];
    });
  });
  animationFrameState.forEach(function (stateItem, i) {
    stateItem.shift();
    var noFrame = stateItem.length === 0;
    if (noFrame) animationRoot[i] = null;
    if (noFrame) animationKeys[i] = null;
  });
  this.animationFrameState = animationFrameState.filter(function (state) {
    return state.length;
  });
  this.animationRoot = animationRoot.filter(function (root) {
    return root;
  });
  this.animationKeys = animationKeys.filter(function (keys) {
    return keys;
  });
};
/**
 * @description Skip to the last frame of animation
 * @return {Undefined} Void
 */


Graph.prototype.animationEnd = function () {
  var animationFrameState = this.animationFrameState,
      animationKeys = this.animationKeys,
      animationRoot = this.animationRoot,
      render = this.render;
  animationRoot.forEach(function (root, i) {
    var currentKeys = animationKeys[i];
    var lastState = animationFrameState[i].pop();
    currentKeys.forEach(function (key) {
      return root[key] = lastState[key];
    });
  });
  this.animationFrameState = [];
  this.animationKeys = [];
  this.animationRoot = [];
  return render.drawAllGraph();
};
/**
 * @description Pause animation behavior
 * @return {Undefined} Void
 */


Graph.prototype.pauseAnimation = function () {
  this.attr('animationPause', true);
};
/**
 * @description Try animation behavior
 * @return {Undefined} Void
 */


Graph.prototype.playAnimation = function () {
  var render = this.render;
  this.attr('animationPause', false);
  return new Promise( /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(resolve) {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return render.launchAnimation();

            case 2:
              resolve();

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());
};
/**
 * @description Processor of delete
 * @param {CRender} render Instance of CRender
 * @return {Undefined} Void
 */


Graph.prototype.delProcessor = function (render) {
  var _this = this;

  var graphs = render.graphs;
  var index = graphs.findIndex(function (graph) {
    return graph === _this;
  });
  if (index === -1) return;
  if (typeof this.beforeDelete === 'function') this.beforeDelete(this);
  graphs.splice(index, 1, null);
  if (typeof this.deleted === 'function') this.deleted(this);
};
/**
 * @description Return a timed release Promise
 * @param {Number} time Release time
 * @return {Promise} A timed release Promise
 */


function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
},{"../plugin/util":8,"./style.class":4,"@babel/runtime/helpers/asyncToGenerator":12,"@babel/runtime/helpers/classCallCheck":13,"@babel/runtime/helpers/interopRequireDefault":15,"@babel/runtime/helpers/toConsumableArray":21,"@babel/runtime/helpers/typeof":22,"@babel/runtime/regenerator":24,"@jiaminghi/transition":31}],4:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _color = require("@jiaminghi/color");

var _util = require("../plugin/util");

/**
 * @description Class Style
 * @param {Object} style  Style configuration
 * @return {Style} Instance of Style
 */
var Style = function Style(style) {
  (0, _classCallCheck2["default"])(this, Style);
  this.colorProcessor(style);
  var defaultStyle = {
    /**
     * @description Rgba value of graph fill color
     * @type {Array}
     * @default fill = [0, 0, 0, 1]
     */
    fill: [0, 0, 0, 1],

    /**
     * @description Rgba value of graph stroke color
     * @type {Array}
     * @default stroke = [0, 0, 0, 1]
     */
    stroke: [0, 0, 0, 0],

    /**
     * @description Opacity of graph
     * @type {Number}
     * @default opacity = 1
     */
    opacity: 1,

    /**
     * @description LineCap of Ctx
     * @type {String}
     * @default lineCap = null
     * @example lineCap = 'butt'|'round'|'square'
     */
    lineCap: null,

    /**
     * @description Linejoin of Ctx
     * @type {String}
     * @default lineJoin = null
     * @example lineJoin = 'round'|'bevel'|'miter'
     */
    lineJoin: null,

    /**
     * @description LineDash of Ctx
     * @type {Array}
     * @default lineDash = null
     * @example lineDash = [10, 10]
     */
    lineDash: null,

    /**
     * @description LineDashOffset of Ctx
     * @type {Number}
     * @default lineDashOffset = null
     * @example lineDashOffset = 10
     */
    lineDashOffset: null,

    /**
     * @description ShadowBlur of Ctx
     * @type {Number}
     * @default shadowBlur = 0
     */
    shadowBlur: 0,

    /**
     * @description Rgba value of graph shadow color
     * @type {Array}
     * @default shadowColor = [0, 0, 0, 0]
     */
    shadowColor: [0, 0, 0, 0],

    /**
     * @description ShadowOffsetX of Ctx
     * @type {Number}
     * @default shadowOffsetX = 0
     */
    shadowOffsetX: 0,

    /**
     * @description ShadowOffsetY of Ctx
     * @type {Number}
     * @default shadowOffsetY = 0
     */
    shadowOffsetY: 0,

    /**
     * @description LineWidth of Ctx
     * @type {Number}
     * @default lineWidth = 0
     */
    lineWidth: 0,

    /**
     * @description Center point of the graph
     * @type {Array}
     * @default graphCenter = null
     * @example graphCenter = [10, 10]
     */
    graphCenter: null,

    /**
     * @description Graph scale
     * @type {Array}
     * @default scale = null
     * @example scale = [1.5, 1.5]
     */
    scale: null,

    /**
     * @description Graph rotation degree
     * @type {Number}
     * @default rotate = null
     * @example rotate = 10
     */
    rotate: null,

    /**
     * @description Graph translate distance
     * @type {Array}
     * @default translate = null
     * @example translate = [10, 10]
     */
    translate: null,

    /**
     * @description Cursor status when hover
     * @type {String}
     * @default hoverCursor = 'pointer'
     * @example hoverCursor = 'default'|'pointer'|'auto'|'crosshair'|'move'|'wait'|...
     */
    hoverCursor: 'pointer',

    /**
     * @description Font style of Ctx
     * @type {String}
     * @default fontStyle = 'normal'
     * @example fontStyle = 'normal'|'italic'|'oblique'
     */
    fontStyle: 'normal',

    /**
     * @description Font varient of Ctx
     * @type {String}
     * @default fontVarient = 'normal'
     * @example fontVarient = 'normal'|'small-caps'
     */
    fontVarient: 'normal',

    /**
     * @description Font weight of Ctx
     * @type {String|Number}
     * @default fontWeight = 'normal'
     * @example fontWeight = 'normal'|'bold'|'bolder'|'lighter'|Number
     */
    fontWeight: 'normal',

    /**
     * @description Font size of Ctx
     * @type {Number}
     * @default fontSize = 10
     */
    fontSize: 10,

    /**
     * @description Font family of Ctx
     * @type {String}
     * @default fontFamily = 'Arial'
     */
    fontFamily: 'Arial',

    /**
     * @description TextAlign of Ctx
     * @type {String}
     * @default textAlign = 'center'
     * @example textAlign = 'start'|'end'|'left'|'right'|'center'
     */
    textAlign: 'center',

    /**
     * @description TextBaseline of Ctx
     * @type {String}
     * @default textBaseline = 'middle'
     * @example textBaseline = 'top'|'bottom'|'middle'|'alphabetic'|'hanging'
     */
    textBaseline: 'middle',

    /**
     * @description The color used to create the gradient
     * @type {Array}
     * @default gradientColor = null
     * @example gradientColor = ['#000', '#111', '#222']
     */
    gradientColor: null,

    /**
     * @description Gradient type
     * @type {String}
     * @default gradientType = 'linear'
     * @example gradientType = 'linear' | 'radial'
     */
    gradientType: 'linear',

    /**
     * @description Gradient params
     * @type {Array}
     * @default gradientParams = null
     * @example gradientParams = [x0, y0, x1, y1] (Linear Gradient)
     * @example gradientParams = [x0, y0, r0, x1, y1, r1] (Radial Gradient)
     */
    gradientParams: null,

    /**
     * @description When to use gradients
     * @type {String}
     * @default gradientWith = 'stroke'
     * @example gradientWith = 'stroke' | 'fill'
     */
    gradientWith: 'stroke',

    /**
     * @description Gradient color stops
     * @type {String}
     * @default gradientStops = 'auto'
     * @example gradientStops = 'auto' | [0, .2, .3, 1]
     */
    gradientStops: 'auto',

    /**
     * @description Extended color that supports animation transition
     * @type {Array|Object}
     * @default colors = null
     * @example colors = ['#000', '#111', '#222', 'red' ]
     * @example colors = { a: '#000', b: '#111' }
     */
    colors: null
  };
  Object.assign(this, defaultStyle, style);
};
/**
 * @description Set colors to rgba value
 * @param {Object} style style config
 * @param {Boolean} reverse Whether to perform reverse operation
 * @return {Undefined} Void
 */


exports["default"] = Style;

Style.prototype.colorProcessor = function (style) {
  var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var processor = reverse ? _color.getColorFromRgbValue : _color.getRgbaValue;
  var colorProcessorKeys = ['fill', 'stroke', 'shadowColor'];
  var allKeys = Object.keys(style);
  var colorKeys = allKeys.filter(function (key) {
    return colorProcessorKeys.find(function (k) {
      return k === key;
    });
  });
  colorKeys.forEach(function (key) {
    return style[key] = processor(style[key]);
  });
  var gradientColor = style.gradientColor,
      colors = style.colors;
  if (gradientColor) style.gradientColor = gradientColor.map(function (c) {
    return processor(c);
  });

  if (colors) {
    var colorsKeys = Object.keys(colors);
    colorsKeys.forEach(function (key) {
      return colors[key] = processor(colors[key]);
    });
  }
};
/**
 * @description Init graph style
 * @param {Object} ctx Context of canvas
 * @return {Undefined} Void
 */


Style.prototype.initStyle = function (ctx) {
  initTransform(ctx, this);
  initGraphStyle(ctx, this);
  initGradient(ctx, this);
};
/**
 * @description Init canvas transform
 * @param {Object} ctx  Context of canvas
 * @param {Style} style Instance of Style
 * @return {Undefined} Void
 */


function initTransform(ctx, style) {
  ctx.save();
  var graphCenter = style.graphCenter,
      rotate = style.rotate,
      scale = style.scale,
      translate = style.translate;
  if (!(graphCenter instanceof Array)) return;
  ctx.translate.apply(ctx, (0, _toConsumableArray2["default"])(graphCenter));
  if (rotate) ctx.rotate(rotate * Math.PI / 180);
  if (scale instanceof Array) ctx.scale.apply(ctx, (0, _toConsumableArray2["default"])(scale));
  if (translate) ctx.translate.apply(ctx, (0, _toConsumableArray2["default"])(translate));
  ctx.translate(-graphCenter[0], -graphCenter[1]);
}

var autoSetStyleKeys = ['lineCap', 'lineJoin', 'lineDashOffset', 'shadowOffsetX', 'shadowOffsetY', 'lineWidth', 'textAlign', 'textBaseline'];
/**
 * @description Set the style of canvas ctx
 * @param {Object} ctx  Context of canvas
 * @param {Style} style Instance of Style
 * @return {Undefined} Void
 */

function initGraphStyle(ctx, style) {
  var fill = style.fill,
      stroke = style.stroke,
      shadowColor = style.shadowColor,
      opacity = style.opacity;
  autoSetStyleKeys.forEach(function (key) {
    if (key || typeof key === 'number') ctx[key] = style[key];
  });
  fill = (0, _toConsumableArray2["default"])(fill);
  stroke = (0, _toConsumableArray2["default"])(stroke);
  shadowColor = (0, _toConsumableArray2["default"])(shadowColor);
  fill[3] *= opacity;
  stroke[3] *= opacity;
  shadowColor[3] *= opacity;
  ctx.fillStyle = (0, _color.getColorFromRgbValue)(fill);
  ctx.strokeStyle = (0, _color.getColorFromRgbValue)(stroke);
  ctx.shadowColor = (0, _color.getColorFromRgbValue)(shadowColor);
  var lineDash = style.lineDash,
      shadowBlur = style.shadowBlur;

  if (lineDash) {
    lineDash = lineDash.map(function (v) {
      return v >= 0 ? v : 0;
    });
    ctx.setLineDash(lineDash);
  }

  if (typeof shadowBlur === 'number') ctx.shadowBlur = shadowBlur > 0 ? shadowBlur : 0.001;
  var fontStyle = style.fontStyle,
      fontVarient = style.fontVarient,
      fontWeight = style.fontWeight,
      fontSize = style.fontSize,
      fontFamily = style.fontFamily;
  ctx.font = fontStyle + ' ' + fontVarient + ' ' + fontWeight + ' ' + fontSize + 'px' + ' ' + fontFamily;
}
/**
 * @description Set the gradient color of canvas ctx
 * @param {Object} ctx  Context of canvas
 * @param {Style} style Instance of Style
 * @return {Undefined} Void
 */


function initGradient(ctx, style) {
  if (!gradientValidator(style)) return;
  var gradientColor = style.gradientColor,
      gradientParams = style.gradientParams,
      gradientType = style.gradientType,
      gradientWith = style.gradientWith,
      gradientStops = style.gradientStops,
      opacity = style.opacity;
  gradientColor = gradientColor.map(function (color) {
    var colorOpacity = color[3] * opacity;
    var clonedColor = (0, _toConsumableArray2["default"])(color);
    clonedColor[3] = colorOpacity;
    return clonedColor;
  });
  gradientColor = gradientColor.map(function (c) {
    return (0, _color.getColorFromRgbValue)(c);
  });
  if (gradientStops === 'auto') gradientStops = getAutoColorStops(gradientColor);
  var gradient = ctx["create".concat(gradientType.slice(0, 1).toUpperCase() + gradientType.slice(1), "Gradient")].apply(ctx, (0, _toConsumableArray2["default"])(gradientParams));
  gradientStops.forEach(function (stop, i) {
    return gradient.addColorStop(stop, gradientColor[i]);
  });
  ctx["".concat(gradientWith, "Style")] = gradient;
}
/**
 * @description Check if the gradient configuration is legal
 * @param {Style} style Instance of Style
 * @return {Boolean} Check Result
 */


function gradientValidator(style) {
  var gradientColor = style.gradientColor,
      gradientParams = style.gradientParams,
      gradientType = style.gradientType,
      gradientWith = style.gradientWith,
      gradientStops = style.gradientStops;
  if (!gradientColor || !gradientParams) return false;

  if (gradientColor.length === 1) {
    console.warn('The gradient needs to provide at least two colors');
    return false;
  }

  if (gradientType !== 'linear' && gradientType !== 'radial') {
    console.warn('GradientType only supports linear or radial, current value is ' + gradientType);
    return false;
  }

  var gradientParamsLength = gradientParams.length;

  if (gradientType === 'linear' && gradientParamsLength !== 4 || gradientType === 'radial' && gradientParamsLength !== 6) {
    console.warn('The expected length of gradientParams is ' + (gradientType === 'linear' ? '4' : '6'));
    return false;
  }

  if (gradientWith !== 'fill' && gradientWith !== 'stroke') {
    console.warn('GradientWith only supports fill or stroke, current value is ' + gradientWith);
    return false;
  }

  if (gradientStops !== 'auto' && !(gradientStops instanceof Array)) {
    console.warn("gradientStops only supports 'auto' or Number Array ([0, .5, 1]), current value is " + gradientStops);
    return false;
  }

  return true;
}
/**
 * @description Get a uniform gradient color stop
 * @param {Array} color Gradient color
 * @return {Array} Gradient color stop
 */


function getAutoColorStops(color) {
  var stopGap = 1 / (color.length - 1);
  return color.map(function (foo, i) {
    return stopGap * i;
  });
}
/**
 * @description Restore canvas ctx transform
 * @param {Object} ctx  Context of canvas
 * @return {Undefined} Void
 */


Style.prototype.restoreTransform = function (ctx) {
  ctx.restore();
};
/**
 * @description Update style data
 * @param {Object} change Changed data
 * @return {Undefined} Void
 */


Style.prototype.update = function (change) {
  this.colorProcessor(change);
  Object.assign(this, change);
};
/**
 * @description Get the current style configuration
 * @return {Object} Style configuration
 */


Style.prototype.getStyle = function () {
  var clonedStyle = (0, _util.deepClone)(this, true);
  this.colorProcessor(clonedStyle, true);
  return clonedStyle;
};
},{"../plugin/util":8,"@babel/runtime/helpers/classCallCheck":13,"@babel/runtime/helpers/interopRequireDefault":15,"@babel/runtime/helpers/toConsumableArray":21,"@jiaminghi/color":29}],5:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendNewGraph = extendNewGraph;
exports["default"] = exports.text = exports.bezierCurve = exports.smoothline = exports.polyline = exports.regPolygon = exports.sector = exports.arc = exports.ring = exports.rect = exports.ellipse = exports.circle = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _bezierCurve2 = _interopRequireDefault(require("@jiaminghi/bezier-curve"));

var _util = require("../plugin/util");

var _canvas = require("../plugin/canvas");

var polylineToBezierCurve = _bezierCurve2["default"].polylineToBezierCurve,
    bezierCurveToPolyline = _bezierCurve2["default"].bezierCurveToPolyline;
var circle = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0
  },
  validator: function validator(_ref) {
    var shape = _ref.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;

    if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
      console.error('Circle shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref2, _ref3) {
    var ctx = _ref2.ctx;
    var shape = _ref3.shape;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;
    ctx.arc(rx, ry, r > 0 ? r : 0.01, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  },
  hoverCheck: function hoverCheck(position, _ref4) {
    var shape = _ref4.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;
    return (0, _util.checkPointIsInCircle)(position, rx, ry, r);
  },
  setGraphCenter: function setGraphCenter(e, _ref5) {
    var shape = _ref5.shape,
        style = _ref5.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_ref6, _ref7) {
    var movementX = _ref6.movementX,
        movementY = _ref6.movementY;
    var shape = _ref7.shape;
    this.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    });
  }
};
exports.circle = circle;
var ellipse = {
  shape: {
    rx: 0,
    ry: 0,
    hr: 0,
    vr: 0
  },
  validator: function validator(_ref8) {
    var shape = _ref8.shape;
    var rx = shape.rx,
        ry = shape.ry,
        hr = shape.hr,
        vr = shape.vr;

    if (typeof rx !== 'number' || typeof ry !== 'number' || typeof hr !== 'number' || typeof vr !== 'number') {
      console.error('Ellipse shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref9, _ref10) {
    var ctx = _ref9.ctx;
    var shape = _ref10.shape;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        hr = shape.hr,
        vr = shape.vr;
    ctx.ellipse(rx, ry, hr > 0 ? hr : 0.01, vr > 0 ? vr : 0.01, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  },
  hoverCheck: function hoverCheck(position, _ref11) {
    var shape = _ref11.shape;
    var rx = shape.rx,
        ry = shape.ry,
        hr = shape.hr,
        vr = shape.vr;
    var a = Math.max(hr, vr);
    var b = Math.min(hr, vr);
    var c = Math.sqrt(a * a - b * b);
    var leftFocusPoint = [rx - c, ry];
    var rightFocusPoint = [rx + c, ry];
    var distance = (0, _util.getTwoPointDistance)(position, leftFocusPoint) + (0, _util.getTwoPointDistance)(position, rightFocusPoint);
    return distance <= 2 * a;
  },
  setGraphCenter: function setGraphCenter(e, _ref12) {
    var shape = _ref12.shape,
        style = _ref12.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_ref13, _ref14) {
    var movementX = _ref13.movementX,
        movementY = _ref13.movementY;
    var shape = _ref14.shape;
    this.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    });
  }
};
exports.ellipse = ellipse;
var rect = {
  shape: {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  },
  validator: function validator(_ref15) {
    var shape = _ref15.shape;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;

    if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number') {
      console.error('Rect shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref16, _ref17) {
    var ctx = _ref16.ctx;
    var shape = _ref17.shape;
    ctx.beginPath();
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  },
  hoverCheck: function hoverCheck(position, _ref18) {
    var shape = _ref18.shape;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;
    return (0, _util.checkPointIsInRect)(position, x, y, w, h);
  },
  setGraphCenter: function setGraphCenter(e, _ref19) {
    var shape = _ref19.shape,
        style = _ref19.style;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;
    style.graphCenter = [x + w / 2, y + h / 2];
  },
  move: function move(_ref20, _ref21) {
    var movementX = _ref20.movementX,
        movementY = _ref20.movementY;
    var shape = _ref21.shape;
    this.attr('shape', {
      x: shape.x + movementX,
      y: shape.y + movementY
    });
  }
};
exports.rect = rect;
var ring = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0
  },
  validator: function validator(_ref22) {
    var shape = _ref22.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;

    if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
      console.error('Ring shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref23, _ref24) {
    var ctx = _ref23.ctx;
    var shape = _ref24.shape;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;
    ctx.arc(rx, ry, r > 0 ? r : 0.01, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  },
  hoverCheck: function hoverCheck(position, _ref25) {
    var shape = _ref25.shape,
        style = _ref25.style;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;
    var lineWidth = style.lineWidth;
    var halfLineWidth = lineWidth / 2;
    var minDistance = r - halfLineWidth;
    var maxDistance = r + halfLineWidth;
    var distance = (0, _util.getTwoPointDistance)(position, [rx, ry]);
    return distance >= minDistance && distance <= maxDistance;
  },
  setGraphCenter: function setGraphCenter(e, _ref26) {
    var shape = _ref26.shape,
        style = _ref26.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_ref27, _ref28) {
    var movementX = _ref27.movementX,
        movementY = _ref27.movementY;
    var shape = _ref28.shape;
    this.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    });
  }
};
exports.ring = ring;
var arc = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    startAngle: 0,
    endAngle: 0,
    clockWise: true
  },
  validator: function validator(_ref29) {
    var shape = _ref29.shape;
    var keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle'];

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number';
    })) {
      console.error('Arc shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref30, _ref31) {
    var ctx = _ref30.ctx;
    var shape = _ref31.shape;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        startAngle = shape.startAngle,
        endAngle = shape.endAngle,
        clockWise = shape.clockWise;
    ctx.arc(rx, ry, r > 0 ? r : 0.001, startAngle, endAngle, !clockWise);
    ctx.stroke();
    ctx.closePath();
  },
  hoverCheck: function hoverCheck(position, _ref32) {
    var shape = _ref32.shape,
        style = _ref32.style;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        startAngle = shape.startAngle,
        endAngle = shape.endAngle,
        clockWise = shape.clockWise;
    var lineWidth = style.lineWidth;
    var halfLineWidth = lineWidth / 2;
    var insideRadius = r - halfLineWidth;
    var outsideRadius = r + halfLineWidth;
    return !(0, _util.checkPointIsInSector)(position, rx, ry, insideRadius, startAngle, endAngle, clockWise) && (0, _util.checkPointIsInSector)(position, rx, ry, outsideRadius, startAngle, endAngle, clockWise);
  },
  setGraphCenter: function setGraphCenter(e, _ref33) {
    var shape = _ref33.shape,
        style = _ref33.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_ref34, _ref35) {
    var movementX = _ref34.movementX,
        movementY = _ref34.movementY;
    var shape = _ref35.shape;
    this.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    });
  }
};
exports.arc = arc;
var sector = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    startAngle: 0,
    endAngle: 0,
    clockWise: true
  },
  validator: function validator(_ref36) {
    var shape = _ref36.shape;
    var keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle'];

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number';
    })) {
      console.error('Sector shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref37, _ref38) {
    var ctx = _ref37.ctx;
    var shape = _ref38.shape;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        startAngle = shape.startAngle,
        endAngle = shape.endAngle,
        clockWise = shape.clockWise;
    ctx.arc(rx, ry, r > 0 ? r : 0.01, startAngle, endAngle, !clockWise);
    ctx.lineTo(rx, ry);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  },
  hoverCheck: function hoverCheck(position, _ref39) {
    var shape = _ref39.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        startAngle = shape.startAngle,
        endAngle = shape.endAngle,
        clockWise = shape.clockWise;
    return (0, _util.checkPointIsInSector)(position, rx, ry, r, startAngle, endAngle, clockWise);
  },
  setGraphCenter: function setGraphCenter(e, _ref40) {
    var shape = _ref40.shape,
        style = _ref40.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_ref41, _ref42) {
    var movementX = _ref41.movementX,
        movementY = _ref41.movementY;
    var shape = _ref42.shape;
    var rx = shape.rx,
        ry = shape.ry;
    this.attr('shape', {
      rx: rx + movementX,
      ry: ry + movementY
    });
  }
};
exports.sector = sector;
var regPolygon = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    side: 0
  },
  validator: function validator(_ref43) {
    var shape = _ref43.shape;
    var side = shape.side;
    var keys = ['rx', 'ry', 'r', 'side'];

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number';
    })) {
      console.error('RegPolygon shape configuration is abnormal!');
      return false;
    }

    if (side < 3) {
      console.error('RegPolygon at least trigon!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref44, _ref45) {
    var ctx = _ref44.ctx;
    var shape = _ref45.shape,
        cache = _ref45.cache;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        side = shape.side;

    if (!cache.points || cache.rx !== rx || cache.ry !== ry || cache.r !== r || cache.side !== side) {
      var _points = (0, _util.getRegularPolygonPoints)(rx, ry, r, side);

      Object.assign(cache, {
        points: _points,
        rx: rx,
        ry: ry,
        r: r,
        side: side
      });
    }

    var points = cache.points;
    (0, _canvas.drawPolylinePath)(ctx, points);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  },
  hoverCheck: function hoverCheck(position, _ref46) {
    var cache = _ref46.cache;
    var points = cache.points;
    return (0, _util.checkPointIsInPolygon)(position, points);
  },
  setGraphCenter: function setGraphCenter(e, _ref47) {
    var shape = _ref47.shape,
        style = _ref47.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_ref48, _ref49) {
    var movementX = _ref48.movementX,
        movementY = _ref48.movementY;
    var shape = _ref49.shape,
        cache = _ref49.cache;
    var rx = shape.rx,
        ry = shape.ry;
    cache.rx += movementX;
    cache.ry += movementY;
    this.attr('shape', {
      rx: rx + movementX,
      ry: ry + movementY
    });
    cache.points = cache.points.map(function (_ref50) {
      var _ref51 = (0, _slicedToArray2["default"])(_ref50, 2),
          x = _ref51[0],
          y = _ref51[1];

      return [x + movementX, y + movementY];
    });
  }
};
exports.regPolygon = regPolygon;
var polyline = {
  shape: {
    points: [],
    close: false
  },
  validator: function validator(_ref52) {
    var shape = _ref52.shape;
    var points = shape.points;

    if (!(points instanceof Array)) {
      console.error('Polyline points should be an array!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref53, _ref54) {
    var ctx = _ref53.ctx;
    var shape = _ref54.shape,
        lineWidth = _ref54.style.lineWidth;
    ctx.beginPath();
    var points = shape.points,
        close = shape.close;
    if (lineWidth === 1) points = (0, _util.eliminateBlur)(points);
    (0, _canvas.drawPolylinePath)(ctx, points);

    if (close) {
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.stroke();
    }
  },
  hoverCheck: function hoverCheck(position, _ref55) {
    var shape = _ref55.shape,
        style = _ref55.style;
    var points = shape.points,
        close = shape.close;
    var lineWidth = style.lineWidth;

    if (close) {
      return (0, _util.checkPointIsInPolygon)(position, points);
    } else {
      return (0, _util.checkPointIsNearPolyline)(position, points, lineWidth);
    }
  },
  setGraphCenter: function setGraphCenter(e, _ref56) {
    var shape = _ref56.shape,
        style = _ref56.style;
    var points = shape.points;
    style.graphCenter = points[0];
  },
  move: function move(_ref57, _ref58) {
    var movementX = _ref57.movementX,
        movementY = _ref57.movementY;
    var shape = _ref58.shape;
    var points = shape.points;
    var moveAfterPoints = points.map(function (_ref59) {
      var _ref60 = (0, _slicedToArray2["default"])(_ref59, 2),
          x = _ref60[0],
          y = _ref60[1];

      return [x + movementX, y + movementY];
    });
    this.attr('shape', {
      points: moveAfterPoints
    });
  }
};
exports.polyline = polyline;
var smoothline = {
  shape: {
    points: [],
    close: false
  },
  validator: function validator(_ref61) {
    var shape = _ref61.shape;
    var points = shape.points;

    if (!(points instanceof Array)) {
      console.error('Smoothline points should be an array!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref62, _ref63) {
    var ctx = _ref62.ctx;
    var shape = _ref63.shape,
        cache = _ref63.cache;
    var points = shape.points,
        close = shape.close;

    if (!cache.points || cache.points.toString() !== points.toString()) {
      var _bezierCurve = polylineToBezierCurve(points, close);

      var hoverPoints = bezierCurveToPolyline(_bezierCurve);
      Object.assign(cache, {
        points: (0, _util.deepClone)(points, true),
        bezierCurve: _bezierCurve,
        hoverPoints: hoverPoints
      });
    }

    var bezierCurve = cache.bezierCurve;
    ctx.beginPath();
    (0, _canvas.drawBezierCurvePath)(ctx, bezierCurve.slice(1), bezierCurve[0]);

    if (close) {
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.stroke();
    }
  },
  hoverCheck: function hoverCheck(position, _ref64) {
    var cache = _ref64.cache,
        shape = _ref64.shape,
        style = _ref64.style;
    var hoverPoints = cache.hoverPoints;
    var close = shape.close;
    var lineWidth = style.lineWidth;

    if (close) {
      return (0, _util.checkPointIsInPolygon)(position, hoverPoints);
    } else {
      return (0, _util.checkPointIsNearPolyline)(position, hoverPoints, lineWidth);
    }
  },
  setGraphCenter: function setGraphCenter(e, _ref65) {
    var shape = _ref65.shape,
        style = _ref65.style;
    var points = shape.points;
    style.graphCenter = points[0];
  },
  move: function move(_ref66, _ref67) {
    var movementX = _ref66.movementX,
        movementY = _ref66.movementY;
    var shape = _ref67.shape,
        cache = _ref67.cache;
    var points = shape.points;
    var moveAfterPoints = points.map(function (_ref68) {
      var _ref69 = (0, _slicedToArray2["default"])(_ref68, 2),
          x = _ref69[0],
          y = _ref69[1];

      return [x + movementX, y + movementY];
    });
    cache.points = moveAfterPoints;

    var _cache$bezierCurve$ = (0, _slicedToArray2["default"])(cache.bezierCurve[0], 2),
        fx = _cache$bezierCurve$[0],
        fy = _cache$bezierCurve$[1];

    var curves = cache.bezierCurve.slice(1);
    cache.bezierCurve = [[fx + movementX, fy + movementY]].concat((0, _toConsumableArray2["default"])(curves.map(function (curve) {
      return curve.map(function (_ref70) {
        var _ref71 = (0, _slicedToArray2["default"])(_ref70, 2),
            x = _ref71[0],
            y = _ref71[1];

        return [x + movementX, y + movementY];
      });
    })));
    cache.hoverPoints = cache.hoverPoints.map(function (_ref72) {
      var _ref73 = (0, _slicedToArray2["default"])(_ref72, 2),
          x = _ref73[0],
          y = _ref73[1];

      return [x + movementX, y + movementY];
    });
    this.attr('shape', {
      points: moveAfterPoints
    });
  }
};
exports.smoothline = smoothline;
var bezierCurve = {
  shape: {
    points: [],
    close: false
  },
  validator: function validator(_ref74) {
    var shape = _ref74.shape;
    var points = shape.points;

    if (!(points instanceof Array)) {
      console.error('BezierCurve points should be an array!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref75, _ref76) {
    var ctx = _ref75.ctx;
    var shape = _ref76.shape,
        cache = _ref76.cache;
    var points = shape.points,
        close = shape.close;

    if (!cache.points || cache.points.toString() !== points.toString()) {
      var hoverPoints = bezierCurveToPolyline(points, 20);
      Object.assign(cache, {
        points: (0, _util.deepClone)(points, true),
        hoverPoints: hoverPoints
      });
    }

    ctx.beginPath();
    (0, _canvas.drawBezierCurvePath)(ctx, points.slice(1), points[0]);

    if (close) {
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.stroke();
    }
  },
  hoverCheck: function hoverCheck(position, _ref77) {
    var cache = _ref77.cache,
        shape = _ref77.shape,
        style = _ref77.style;
    var hoverPoints = cache.hoverPoints;
    var close = shape.close;
    var lineWidth = style.lineWidth;

    if (close) {
      return (0, _util.checkPointIsInPolygon)(position, hoverPoints);
    } else {
      return (0, _util.checkPointIsNearPolyline)(position, hoverPoints, lineWidth);
    }
  },
  setGraphCenter: function setGraphCenter(e, _ref78) {
    var shape = _ref78.shape,
        style = _ref78.style;
    var points = shape.points;
    style.graphCenter = points[0];
  },
  move: function move(_ref79, _ref80) {
    var movementX = _ref79.movementX,
        movementY = _ref79.movementY;
    var shape = _ref80.shape,
        cache = _ref80.cache;
    var points = shape.points;

    var _points$ = (0, _slicedToArray2["default"])(points[0], 2),
        fx = _points$[0],
        fy = _points$[1];

    var curves = points.slice(1);
    var bezierCurve = [[fx + movementX, fy + movementY]].concat((0, _toConsumableArray2["default"])(curves.map(function (curve) {
      return curve.map(function (_ref81) {
        var _ref82 = (0, _slicedToArray2["default"])(_ref81, 2),
            x = _ref82[0],
            y = _ref82[1];

        return [x + movementX, y + movementY];
      });
    })));
    cache.points = bezierCurve;
    cache.hoverPoints = cache.hoverPoints.map(function (_ref83) {
      var _ref84 = (0, _slicedToArray2["default"])(_ref83, 2),
          x = _ref84[0],
          y = _ref84[1];

      return [x + movementX, y + movementY];
    });
    this.attr('shape', {
      points: bezierCurve
    });
  }
};
exports.bezierCurve = bezierCurve;
var text = {
  shape: {
    content: '',
    position: [],
    maxWidth: undefined,
    rowGap: 0
  },
  validator: function validator(_ref85) {
    var shape = _ref85.shape;
    var content = shape.content,
        position = shape.position,
        rowGap = shape.rowGap;

    if (typeof content !== 'string') {
      console.error('Text content should be a string!');
      return false;
    }

    if (!(position instanceof Array)) {
      console.error('Text position should be an array!');
      return false;
    }

    if (typeof rowGap !== 'number') {
      console.error('Text rowGap should be a number!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref86, _ref87) {
    var ctx = _ref86.ctx;
    var shape = _ref87.shape;
    var content = shape.content,
        position = shape.position,
        maxWidth = shape.maxWidth,
        rowGap = shape.rowGap;
    var textBaseline = ctx.textBaseline,
        font = ctx.font;
    var fontSize = parseInt(font.replace(/\D/g, ''));

    var _position = position,
        _position2 = (0, _slicedToArray2["default"])(_position, 2),
        x = _position2[0],
        y = _position2[1];

    content = content.split('\n');
    var rowNum = content.length;
    var lineHeight = fontSize + rowGap;
    var allHeight = rowNum * lineHeight - rowGap;
    var offset = 0;

    if (textBaseline === 'middle') {
      offset = allHeight / 2;
      y += fontSize / 2;
    }

    if (textBaseline === 'bottom') {
      offset = allHeight;
      y += fontSize;
    }

    position = new Array(rowNum).fill(0).map(function (foo, i) {
      return [x, y + i * lineHeight - offset];
    });
    ctx.beginPath();
    content.forEach(function (text, i) {
      ctx.fillText.apply(ctx, [text].concat((0, _toConsumableArray2["default"])(position[i]), [maxWidth]));
      ctx.strokeText.apply(ctx, [text].concat((0, _toConsumableArray2["default"])(position[i]), [maxWidth]));
    });
    ctx.closePath();
  },
  hoverCheck: function hoverCheck(position, _ref88) {
    var shape = _ref88.shape,
        style = _ref88.style;
    return false;
  },
  setGraphCenter: function setGraphCenter(e, _ref89) {
    var shape = _ref89.shape,
        style = _ref89.style;
    var position = shape.position;
    style.graphCenter = (0, _toConsumableArray2["default"])(position);
  },
  move: function move(_ref90, _ref91) {
    var movementX = _ref90.movementX,
        movementY = _ref90.movementY;
    var shape = _ref91.shape;

    var _shape$position = (0, _slicedToArray2["default"])(shape.position, 2),
        x = _shape$position[0],
        y = _shape$position[1];

    this.attr('shape', {
      position: [x + movementX, y + movementY]
    });
  }
};
exports.text = text;
var graphs = new Map([['circle', circle], ['ellipse', ellipse], ['rect', rect], ['ring', ring], ['arc', arc], ['sector', sector], ['regPolygon', regPolygon], ['polyline', polyline], ['smoothline', smoothline], ['bezierCurve', bezierCurve], ['text', text]]);
var _default = graphs;
/**
 * @description Extend new graph
 * @param {String} name   Name of Graph
 * @param {Object} config Configuration of Graph
 * @return {Undefined} Void
 */

exports["default"] = _default;

function extendNewGraph(name, config) {
  if (!name || !config) {
    console.error('ExtendNewGraph Missing Parameters!');
    return;
  }

  if (!config.shape) {
    console.error('Required attribute of shape to extendNewGraph!');
    return;
  }

  if (!config.validator) {
    console.error('Required function of validator to extendNewGraph!');
    return;
  }

  if (!config.draw) {
    console.error('Required function of draw to extendNewGraph!');
    return;
  }

  graphs.set(name, config);
}
},{"../plugin/canvas":7,"../plugin/util":8,"@babel/runtime/helpers/interopRequireDefault":15,"@babel/runtime/helpers/slicedToArray":20,"@babel/runtime/helpers/toConsumableArray":21,"@jiaminghi/bezier-curve":27}],6:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CRender", {
  enumerable: true,
  get: function get() {
    return _crender["default"];
  }
});
Object.defineProperty(exports, "extendNewGraph", {
  enumerable: true,
  get: function get() {
    return _graphs.extendNewGraph;
  }
});
exports["default"] = void 0;

var _crender = _interopRequireDefault(require("./class/crender.class"));

var _graphs = require("./config/graphs");

var _default = _crender["default"];
exports["default"] = _default;
},{"./class/crender.class":2,"./config/graphs":5,"@babel/runtime/helpers/interopRequireDefault":15}],7:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawPolylinePath = drawPolylinePath;
exports.drawBezierCurvePath = drawBezierCurvePath;
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

/**
 * @description Draw a polyline path
 * @param {Object} ctx        Canvas 2d context
 * @param {Array} points      The points that makes up a polyline
 * @param {Boolean} beginPath Whether to execute beginPath
 * @param {Boolean} closePath Whether to execute closePath
 * @return {Undefined} Void
 */
function drawPolylinePath(ctx, points) {
  var beginPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var closePath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!ctx || points.length < 2) return false;
  if (beginPath) ctx.beginPath();
  points.forEach(function (point, i) {
    return point && (i === 0 ? ctx.moveTo.apply(ctx, (0, _toConsumableArray2["default"])(point)) : ctx.lineTo.apply(ctx, (0, _toConsumableArray2["default"])(point)));
  });
  if (closePath) ctx.closePath();
}
/**
 * @description Draw a bezier curve path
 * @param {Object} ctx        Canvas 2d context
 * @param {Array} points      The points that makes up a bezier curve
 * @param {Array} moveTo      The point need to excute moveTo
 * @param {Boolean} beginPath Whether to execute beginPath
 * @param {Boolean} closePath Whether to execute closePath
 * @return {Undefined} Void
 */


function drawBezierCurvePath(ctx, points) {
  var moveTo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var beginPath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var closePath = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (!ctx || !points) return false;
  if (beginPath) ctx.beginPath();
  if (moveTo) ctx.moveTo.apply(ctx, (0, _toConsumableArray2["default"])(moveTo));
  points.forEach(function (item) {
    return item && ctx.bezierCurveTo.apply(ctx, (0, _toConsumableArray2["default"])(item[0]).concat((0, _toConsumableArray2["default"])(item[1]), (0, _toConsumableArray2["default"])(item[2])));
  });
  if (closePath) ctx.closePath();
}

var _default = {
  drawPolylinePath: drawPolylinePath,
  drawBezierCurvePath: drawBezierCurvePath
};
exports["default"] = _default;
},{"@babel/runtime/helpers/interopRequireDefault":15,"@babel/runtime/helpers/toConsumableArray":21}],8:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepClone = deepClone;
exports.eliminateBlur = eliminateBlur;
exports.checkPointIsInCircle = checkPointIsInCircle;
exports.getTwoPointDistance = getTwoPointDistance;
exports.checkPointIsInPolygon = checkPointIsInPolygon;
exports.checkPointIsInSector = checkPointIsInSector;
exports.checkPointIsNearPolyline = checkPointIsNearPolyline;
exports.checkPointIsInRect = checkPointIsInRect;
exports.getRotatePointPos = getRotatePointPos;
exports.getScalePointPos = getScalePointPos;
exports.getTranslatePointPos = getTranslatePointPos;
exports.getDistanceBetweenPointAndLine = getDistanceBetweenPointAndLine;
exports.getCircleRadianPoint = getCircleRadianPoint;
exports.getRegularPolygonPoints = getRegularPolygonPoints;
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var abs = Math.abs,
    sqrt = Math.sqrt,
    sin = Math.sin,
    cos = Math.cos,
    max = Math.max,
    min = Math.min,
    PI = Math.PI;
/**
 * @description Clone an object or array
 * @param {Object|Array} object Cloned object
 * @param {Boolean} recursion   Whether to use recursive cloning
 * @return {Object|Array} Clone object
 */

function deepClone(object) {
  var recursion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!object) return object;
  var parse = JSON.parse,
      stringify = JSON.stringify;
  if (!recursion) return parse(stringify(object));
  var clonedObj = object instanceof Array ? [] : {};

  if (object && (0, _typeof2["default"])(object) === 'object') {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (object[key] && (0, _typeof2["default"])(object[key]) === 'object') {
          clonedObj[key] = deepClone(object[key], true);
        } else {
          clonedObj[key] = object[key];
        }
      }
    }
  }

  return clonedObj;
}
/**
 * @description Eliminate line blur due to 1px line width
 * @param {Array} points Line points
 * @return {Array} Line points after processed
 */


function eliminateBlur(points) {
  return points.map(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        x = _ref2[0],
        y = _ref2[1];

    return [parseInt(x) + 0.5, parseInt(y) + 0.5];
  });
}
/**
 * @description Check if the point is inside the circle
 * @param {Array} point Postion of point
 * @param {Number} rx   Circle x coordinate
 * @param {Number} ry   Circle y coordinate
 * @param {Number} r    Circle radius
 * @return {Boolean} Result of check
 */


function checkPointIsInCircle(point, rx, ry, r) {
  return getTwoPointDistance(point, [rx, ry]) <= r;
}
/**
 * @description Get the distance between two points
 * @param {Array} point1 point1
 * @param {Array} point2 point2
 * @return {Number} Distance between two points
 */


function getTwoPointDistance(_ref3, _ref4) {
  var _ref5 = (0, _slicedToArray2["default"])(_ref3, 2),
      xa = _ref5[0],
      ya = _ref5[1];

  var _ref6 = (0, _slicedToArray2["default"])(_ref4, 2),
      xb = _ref6[0],
      yb = _ref6[1];

  var minusX = abs(xa - xb);
  var minusY = abs(ya - yb);
  return sqrt(minusX * minusX + minusY * minusY);
}
/**
 * @description Check if the point is inside the polygon
 * @param {Array} point  Postion of point
 * @param {Array} points The points that makes up a polyline
 * @return {Boolean} Result of check
 */


function checkPointIsInPolygon(point, polygon) {
  var counter = 0;

  var _point = (0, _slicedToArray2["default"])(point, 2),
      x = _point[0],
      y = _point[1];

  var pointNum = polygon.length;

  for (var i = 1, p1 = polygon[0]; i <= pointNum; i++) {
    var p2 = polygon[i % pointNum];

    if (x > min(p1[0], p2[0]) && x <= max(p1[0], p2[0])) {
      if (y <= max(p1[1], p2[1])) {
        if (p1[0] !== p2[0]) {
          var xinters = (x - p1[0]) * (p2[1] - p1[1]) / (p2[0] - p1[0]) + p1[1];

          if (p1[1] === p2[1] || y <= xinters) {
            counter++;
          }
        }
      }
    }

    p1 = p2;
  }

  return counter % 2 === 1;
}
/**
 * @description Check if the point is inside the sector
 * @param {Array} point       Postion of point
 * @param {Number} rx         Sector x coordinate
 * @param {Number} ry         Sector y coordinate
 * @param {Number} r          Sector radius
 * @param {Number} startAngle Sector start angle
 * @param {Number} endAngle   Sector end angle
 * @param {Boolean} clockWise Whether the sector angle is clockwise
 * @return {Boolean} Result of check
 */


function checkPointIsInSector(point, rx, ry, r, startAngle, endAngle, clockWise) {
  if (!point) return false;
  if (getTwoPointDistance(point, [rx, ry]) > r) return false;

  if (!clockWise) {
    var _deepClone = deepClone([endAngle, startAngle]);

    var _deepClone2 = (0, _slicedToArray2["default"])(_deepClone, 2);

    startAngle = _deepClone2[0];
    endAngle = _deepClone2[1];
  }

  var reverseBE = startAngle > endAngle;

  if (reverseBE) {
    var _ref7 = [endAngle, startAngle];
    startAngle = _ref7[0];
    endAngle = _ref7[1];
  }

  var minus = endAngle - startAngle;
  if (minus >= PI * 2) return true;

  var _point2 = (0, _slicedToArray2["default"])(point, 2),
      x = _point2[0],
      y = _point2[1];

  var _getCircleRadianPoint = getCircleRadianPoint(rx, ry, r, startAngle),
      _getCircleRadianPoint2 = (0, _slicedToArray2["default"])(_getCircleRadianPoint, 2),
      bx = _getCircleRadianPoint2[0],
      by = _getCircleRadianPoint2[1];

  var _getCircleRadianPoint3 = getCircleRadianPoint(rx, ry, r, endAngle),
      _getCircleRadianPoint4 = (0, _slicedToArray2["default"])(_getCircleRadianPoint3, 2),
      ex = _getCircleRadianPoint4[0],
      ey = _getCircleRadianPoint4[1];

  var vPoint = [x - rx, y - ry];
  var vBArm = [bx - rx, by - ry];
  var vEArm = [ex - rx, ey - ry];
  var reverse = minus > PI;

  if (reverse) {
    var _deepClone3 = deepClone([vEArm, vBArm]);

    var _deepClone4 = (0, _slicedToArray2["default"])(_deepClone3, 2);

    vBArm = _deepClone4[0];
    vEArm = _deepClone4[1];
  }

  var inSector = isClockWise(vBArm, vPoint) && !isClockWise(vEArm, vPoint);
  if (reverse) inSector = !inSector;
  if (reverseBE) inSector = !inSector;
  return inSector;
}
/**
 * @description Determine if the point is in the clockwise direction of the vector
 * @param {Array} vArm   Vector
 * @param {Array} vPoint Point
 * @return {Boolean} Result of check
 */


function isClockWise(vArm, vPoint) {
  var _vArm = (0, _slicedToArray2["default"])(vArm, 2),
      ax = _vArm[0],
      ay = _vArm[1];

  var _vPoint = (0, _slicedToArray2["default"])(vPoint, 2),
      px = _vPoint[0],
      py = _vPoint[1];

  return -ay * px + ax * py > 0;
}
/**
 * @description Check if the point is inside the polyline
 * @param {Array} point      Postion of point
 * @param {Array} polyline   The points that makes up a polyline
 * @param {Number} lineWidth Polyline linewidth
 * @return {Boolean} Result of check
 */


function checkPointIsNearPolyline(point, polyline, lineWidth) {
  var halfLineWidth = lineWidth / 2;
  var moveUpPolyline = polyline.map(function (_ref8) {
    var _ref9 = (0, _slicedToArray2["default"])(_ref8, 2),
        x = _ref9[0],
        y = _ref9[1];

    return [x, y - halfLineWidth];
  });
  var moveDownPolyline = polyline.map(function (_ref10) {
    var _ref11 = (0, _slicedToArray2["default"])(_ref10, 2),
        x = _ref11[0],
        y = _ref11[1];

    return [x, y + halfLineWidth];
  });
  var polygon = [].concat((0, _toConsumableArray2["default"])(moveUpPolyline), (0, _toConsumableArray2["default"])(moveDownPolyline.reverse()));
  return checkPointIsInPolygon(point, polygon);
}
/**
 * @description Check if the point is inside the rect
 * @param {Array} point   Postion of point
 * @param {Number} x      Rect start x coordinate
 * @param {Number} y      Rect start y coordinate
 * @param {Number} width  Rect width
 * @param {Number} height Rect height
 * @return {Boolean} Result of check
 */


function checkPointIsInRect(_ref12, x, y, width, height) {
  var _ref13 = (0, _slicedToArray2["default"])(_ref12, 2),
      px = _ref13[0],
      py = _ref13[1];

  if (px < x) return false;
  if (py < y) return false;
  if (px > x + width) return false;
  if (py > y + height) return false;
  return true;
}
/**
 * @description Get the coordinates of the rotated point
 * @param {Number} rotate Degree of rotation
 * @param {Array} point   Postion of point
 * @param {Array} origin  Rotation center
 * @param {Array} origin  Rotation center
 * @return {Number} Coordinates after rotation
 */


function getRotatePointPos() {
  var rotate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var point = arguments.length > 1 ? arguments[1] : undefined;
  var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
  if (!point) return false;
  if (rotate % 360 === 0) return point;

  var _point3 = (0, _slicedToArray2["default"])(point, 2),
      x = _point3[0],
      y = _point3[1];

  var _origin = (0, _slicedToArray2["default"])(origin, 2),
      ox = _origin[0],
      oy = _origin[1];

  rotate *= PI / 180;
  return [(x - ox) * cos(rotate) - (y - oy) * sin(rotate) + ox, (x - ox) * sin(rotate) + (y - oy) * cos(rotate) + oy];
}
/**
 * @description Get the coordinates of the scaled point
 * @param {Array} scale  Scale factor
 * @param {Array} point  Postion of point
 * @param {Array} origin Scale center
 * @return {Number} Coordinates after scale
 */


function getScalePointPos() {
  var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1, 1];
  var point = arguments.length > 1 ? arguments[1] : undefined;
  var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
  if (!point) return false;
  if (scale === 1) return point;

  var _point4 = (0, _slicedToArray2["default"])(point, 2),
      x = _point4[0],
      y = _point4[1];

  var _origin2 = (0, _slicedToArray2["default"])(origin, 2),
      ox = _origin2[0],
      oy = _origin2[1];

  var _scale = (0, _slicedToArray2["default"])(scale, 2),
      xs = _scale[0],
      ys = _scale[1];

  var relativePosX = x - ox;
  var relativePosY = y - oy;
  return [relativePosX * xs + ox, relativePosY * ys + oy];
}
/**
 * @description Get the coordinates of the scaled point
 * @param {Array} translate Translation distance
 * @param {Array} point     Postion of point
 * @return {Number} Coordinates after translation
 */


function getTranslatePointPos(translate, point) {
  if (!translate || !point) return false;

  var _point5 = (0, _slicedToArray2["default"])(point, 2),
      x = _point5[0],
      y = _point5[1];

  var _translate = (0, _slicedToArray2["default"])(translate, 2),
      tx = _translate[0],
      ty = _translate[1];

  return [x + tx, y + ty];
}
/**
 * @description Get the distance from the point to the line
 * @param {Array} point     Postion of point
 * @param {Array} lineBegin Line start position
 * @param {Array} lineEnd   Line end position
 * @return {Number} Distance between point and line
 */


function getDistanceBetweenPointAndLine(point, lineBegin, lineEnd) {
  if (!point || !lineBegin || !lineEnd) return false;

  var _point6 = (0, _slicedToArray2["default"])(point, 2),
      x = _point6[0],
      y = _point6[1];

  var _lineBegin = (0, _slicedToArray2["default"])(lineBegin, 2),
      x1 = _lineBegin[0],
      y1 = _lineBegin[1];

  var _lineEnd = (0, _slicedToArray2["default"])(lineEnd, 2),
      x2 = _lineEnd[0],
      y2 = _lineEnd[1];

  var a = y2 - y1;
  var b = x1 - x2;
  var c = y1 * (x2 - x1) - x1 * (y2 - y1);
  var molecule = abs(a * x + b * y + c);
  var denominator = sqrt(a * a + b * b);
  return molecule / denominator;
}
/**
 * @description Get the coordinates of the specified radian on the circle
 * @param {Number} x      Circle x coordinate
 * @param {Number} y      Circle y coordinate
 * @param {Number} radius Circle radius
 * @param {Number} radian Specfied radian
 * @return {Array} Postion of point
 */


function getCircleRadianPoint(x, y, radius, radian) {
  return [x + cos(radian) * radius, y + sin(radian) * radius];
}
/**
 * @description Get the points that make up a regular polygon
 * @param {Number} x     X coordinate of the polygon inscribed circle
 * @param {Number} y     Y coordinate of the polygon inscribed circle
 * @param {Number} r     Radius of the polygon inscribed circle
 * @param {Number} side  Side number
 * @param {Number} minus Radian offset
 * @return {Array} Points that make up a regular polygon
 */


function getRegularPolygonPoints(rx, ry, r, side) {
  var minus = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : PI * -0.5;
  var radianGap = PI * 2 / side;
  var radians = new Array(side).fill('').map(function (t, i) {
    return i * radianGap + minus;
  });
  return radians.map(function (radian) {
    return getCircleRadianPoint(rx, ry, r, radian);
  });
}

var _default = {
  deepClone: deepClone,
  eliminateBlur: eliminateBlur,
  checkPointIsInCircle: checkPointIsInCircle,
  checkPointIsInPolygon: checkPointIsInPolygon,
  checkPointIsInSector: checkPointIsInSector,
  checkPointIsNearPolyline: checkPointIsNearPolyline,
  getTwoPointDistance: getTwoPointDistance,
  getRotatePointPos: getRotatePointPos,
  getScalePointPos: getScalePointPos,
  getTranslatePointPos: getTranslatePointPos,
  getCircleRadianPoint: getCircleRadianPoint,
  getRegularPolygonPoints: getRegularPolygonPoints,
  getDistanceBetweenPointAndLine: getDistanceBetweenPointAndLine
};
exports["default"] = _default;
},{"@babel/runtime/helpers/interopRequireDefault":15,"@babel/runtime/helpers/slicedToArray":20,"@babel/runtime/helpers/toConsumableArray":21,"@babel/runtime/helpers/typeof":22}],9:[function(require,module,exports){
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
},{}],10:[function(require,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],11:[function(require,module,exports){
var arrayLikeToArray = require("./arrayLikeToArray");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;
},{"./arrayLikeToArray":9}],12:[function(require,module,exports){
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],13:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],14:[function(require,module,exports){
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],15:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],16:[function(require,module,exports){
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

module.exports = _iterableToArray;
},{}],17:[function(require,module,exports){
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{}],18:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
},{}],19:[function(require,module,exports){
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;
},{}],20:[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var unsupportedIterableToArray = require("./unsupportedIterableToArray");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":10,"./iterableToArrayLimit":17,"./nonIterableRest":18,"./unsupportedIterableToArray":23}],21:[function(require,module,exports){
var arrayWithoutHoles = require("./arrayWithoutHoles");

var iterableToArray = require("./iterableToArray");

var unsupportedIterableToArray = require("./unsupportedIterableToArray");

var nonIterableSpread = require("./nonIterableSpread");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
},{"./arrayWithoutHoles":11,"./iterableToArray":16,"./nonIterableSpread":19,"./unsupportedIterableToArray":23}],22:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],23:[function(require,module,exports){
var arrayLikeToArray = require("./arrayLikeToArray");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
},{"./arrayLikeToArray":9}],24:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":32}],25:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bezierCurveToPolyline = bezierCurveToPolyline;
exports.getBezierCurveLength = getBezierCurveLength;
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var sqrt = Math.sqrt,
    pow = Math.pow,
    ceil = Math.ceil,
    abs = Math.abs; // Initialize the number of points per curve

var defaultSegmentPointsNum = 50;
/**
 * @example data structure of bezierCurve
 * bezierCurve = [
 *  // Starting point of the curve
 *  [10, 10],
 *  // BezierCurve segment data (controlPoint1, controlPoint2, endPoint)
 *  [
 *    [20, 20], [40, 20], [50, 10]
 *  ],
 *  ...
 * ]
 */

/**
 * @description               Abstract the curve as a polyline consisting of N points
 * @param {Array} bezierCurve bezierCurve data
 * @param {Number} precision  calculation accuracy. Recommended for 1-20. Default = 5
 * @return {Object}           Calculation results and related data
 * @return {Array}            Option.segmentPoints Point data that constitutes a polyline after calculation
 * @return {Number}           Option.cycles Number of iterations
 * @return {Number}           Option.rounds The number of recursions for the last iteration
 */

function abstractBezierCurveToPolyline(bezierCurve) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  var segmentsNum = bezierCurve.length - 1;
  var startPoint = bezierCurve[0];
  var endPoint = bezierCurve[segmentsNum][2];
  var segments = bezierCurve.slice(1);
  var getSegmentTPointFuns = segments.map(function (seg, i) {
    var beginPoint = i === 0 ? startPoint : segments[i - 1][2];
    return createGetBezierCurveTPointFun.apply(void 0, [beginPoint].concat((0, _toConsumableArray2["default"])(seg)));
  }); // Initialize the curve to a polyline

  var segmentPointsNum = new Array(segmentsNum).fill(defaultSegmentPointsNum);
  var segmentPoints = getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum); // Calculate uniformly distributed points by iteratively

  var result = calcUniformPointsByIteration(segmentPoints, getSegmentTPointFuns, segments, precision);
  result.segmentPoints.push(endPoint);
  return result;
}
/**
 * @description  Generate a method for obtaining corresponding point by t according to curve data
 * @param {Array} beginPoint    BezierCurve begin point. [x, y]
 * @param {Array} controlPoint1 BezierCurve controlPoint1. [x, y]
 * @param {Array} controlPoint2 BezierCurve controlPoint2. [x, y]
 * @param {Array} endPoint      BezierCurve end point. [x, y]
 * @return {Function} Expected function
 */


function createGetBezierCurveTPointFun(beginPoint, controlPoint1, controlPoint2, endPoint) {
  return function (t) {
    var tSubed1 = 1 - t;
    var tSubed1Pow3 = pow(tSubed1, 3);
    var tSubed1Pow2 = pow(tSubed1, 2);
    var tPow3 = pow(t, 3);
    var tPow2 = pow(t, 2);
    return [beginPoint[0] * tSubed1Pow3 + 3 * controlPoint1[0] * t * tSubed1Pow2 + 3 * controlPoint2[0] * tPow2 * tSubed1 + endPoint[0] * tPow3, beginPoint[1] * tSubed1Pow3 + 3 * controlPoint1[1] * t * tSubed1Pow2 + 3 * controlPoint2[1] * tPow2 * tSubed1 + endPoint[1] * tPow3];
  };
}
/**
 * @description Get the distance between two points
 * @param {Array} point1 BezierCurve begin point. [x, y]
 * @param {Array} point2 BezierCurve controlPoint1. [x, y]
 * @return {Number} Expected distance
 */


function getTwoPointDistance(_ref, _ref2) {
  var _ref3 = (0, _slicedToArray2["default"])(_ref, 2),
      ax = _ref3[0],
      ay = _ref3[1];

  var _ref4 = (0, _slicedToArray2["default"])(_ref2, 2),
      bx = _ref4[0],
      by = _ref4[1];

  return sqrt(pow(ax - bx, 2) + pow(ay - by, 2));
}
/**
 * @description Get the sum of the array of numbers
 * @param {Array} nums An array of numbers
 * @return {Number} Expected sum
 */


function getNumsSum(nums) {
  return nums.reduce(function (sum, num) {
    return sum + num;
  }, 0);
}
/**
 * @description Get the distance of multiple sets of points
 * @param {Array} segmentPoints Multiple sets of point data
 * @return {Array} Distance of multiple sets of point data
 */


function getSegmentPointsDistance(segmentPoints) {
  return segmentPoints.map(function (points, i) {
    return new Array(points.length - 1).fill(0).map(function (temp, j) {
      return getTwoPointDistance(points[j], points[j + 1]);
    });
  });
}
/**
 * @description Get the distance of multiple sets of points
 * @param {Array} segmentPoints Multiple sets of point data
 * @return {Array} Distance of multiple sets of point data
 */


function getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum) {
  return getSegmentTPointFuns.map(function (getSegmentTPointFun, i) {
    var tGap = 1 / segmentPointsNum[i];
    return new Array(segmentPointsNum[i]).fill('').map(function (foo, j) {
      return getSegmentTPointFun(j * tGap);
    });
  });
}
/**
 * @description Get the sum of deviations between line segment and the average length
 * @param {Array} segmentPointsDistance Segment length of polyline
 * @param {Number} avgLength            Average length of the line segment
 * @return {Number} Deviations
 */


function getAllDeviations(segmentPointsDistance, avgLength) {
  return segmentPointsDistance.map(function (seg) {
    return seg.map(function (s) {
      return abs(s - avgLength);
    });
  }).map(function (seg) {
    return getNumsSum(seg);
  }).reduce(function (total, v) {
    return total + v;
  }, 0);
}
/**
 * @description Calculate uniformly distributed points by iteratively
 * @param {Array} segmentPoints        Multiple setd of points that make up a polyline
 * @param {Array} getSegmentTPointFuns Functions of get a point on the curve with t
 * @param {Array} segments             BezierCurve data
 * @param {Number} precision           Calculation accuracy
 * @return {Object} Calculation results and related data
 * @return {Array}  Option.segmentPoints Point data that constitutes a polyline after calculation
 * @return {Number} Option.cycles Number of iterations
 * @return {Number} Option.rounds The number of recursions for the last iteration
 */


function calcUniformPointsByIteration(segmentPoints, getSegmentTPointFuns, segments, precision) {
  // The number of loops for the current iteration
  var rounds = 4; // Number of iterations

  var cycles = 1;

  var _loop = function _loop() {
    // Recalculate the number of points per curve based on the last iteration data
    var totalPointsNum = segmentPoints.reduce(function (total, seg) {
      return total + seg.length;
    }, 0); // Add last points of segment to calc exact segment length

    segmentPoints.forEach(function (seg, i) {
      return seg.push(segments[i][2]);
    });
    var segmentPointsDistance = getSegmentPointsDistance(segmentPoints);
    var lineSegmentNum = segmentPointsDistance.reduce(function (total, seg) {
      return total + seg.length;
    }, 0);
    var segmentlength = segmentPointsDistance.map(function (seg) {
      return getNumsSum(seg);
    });
    var totalLength = getNumsSum(segmentlength);
    var avgLength = totalLength / lineSegmentNum; // Check if precision is reached

    var allDeviations = getAllDeviations(segmentPointsDistance, avgLength);
    if (allDeviations <= precision) return "break";
    totalPointsNum = ceil(avgLength / precision * totalPointsNum * 1.1);
    var segmentPointsNum = segmentlength.map(function (length) {
      return ceil(length / totalLength * totalPointsNum);
    }); // Calculate the points after redistribution

    segmentPoints = getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum);
    totalPointsNum = segmentPoints.reduce(function (total, seg) {
      return total + seg.length;
    }, 0);
    var segmentPointsForLength = JSON.parse(JSON.stringify(segmentPoints));
    segmentPointsForLength.forEach(function (seg, i) {
      return seg.push(segments[i][2]);
    });
    segmentPointsDistance = getSegmentPointsDistance(segmentPointsForLength);
    lineSegmentNum = segmentPointsDistance.reduce(function (total, seg) {
      return total + seg.length;
    }, 0);
    segmentlength = segmentPointsDistance.map(function (seg) {
      return getNumsSum(seg);
    });
    totalLength = getNumsSum(segmentlength);
    avgLength = totalLength / lineSegmentNum;
    var stepSize = 1 / totalPointsNum / 10; // Recursively for each segment of the polyline

    getSegmentTPointFuns.forEach(function (getSegmentTPointFun, i) {
      var currentSegmentPointsNum = segmentPointsNum[i];
      var t = new Array(currentSegmentPointsNum).fill('').map(function (foo, j) {
        return j / segmentPointsNum[i];
      }); // Repeated recursive offset

      for (var r = 0; r < rounds; r++) {
        var distance = getSegmentPointsDistance([segmentPoints[i]])[0];
        var deviations = distance.map(function (d) {
          return d - avgLength;
        });
        var offset = 0;

        for (var j = 0; j < currentSegmentPointsNum; j++) {
          if (j === 0) return;
          offset += deviations[j - 1];
          t[j] -= stepSize * offset;
          if (t[j] > 1) t[j] = 1;
          if (t[j] < 0) t[j] = 0;
          segmentPoints[i][j] = getSegmentTPointFun(t[j]);
        }
      }
    });
    rounds *= 4;
    cycles++;
  };

  do {
    var _ret = _loop();

    if (_ret === "break") break;
  } while (rounds <= 1025);

  segmentPoints = segmentPoints.reduce(function (all, seg) {
    return all.concat(seg);
  }, []);
  return {
    segmentPoints: segmentPoints,
    cycles: cycles,
    rounds: rounds
  };
}
/**
 * @description Get the polyline corresponding to the Bezier curve
 * @param {Array} bezierCurve BezierCurve data
 * @param {Number} precision  Calculation accuracy. Recommended for 1-20. Default = 5
 * @return {Array|Boolean} Point data that constitutes a polyline after calculation (Invalid input will return false)
 */


function bezierCurveToPolyline(bezierCurve) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

  if (!bezierCurve) {
    console.error('bezierCurveToPolyline: Missing parameters!');
    return false;
  }

  if (!(bezierCurve instanceof Array)) {
    console.error('bezierCurveToPolyline: Parameter bezierCurve must be an array!');
    return false;
  }

  if (typeof precision !== 'number') {
    console.error('bezierCurveToPolyline: Parameter precision must be a number!');
    return false;
  }

  var _abstractBezierCurveT = abstractBezierCurveToPolyline(bezierCurve, precision),
      segmentPoints = _abstractBezierCurveT.segmentPoints;

  return segmentPoints;
}
/**
 * @description Get the bezier curve length
 * @param {Array} bezierCurve bezierCurve data
 * @param {Number} precision  calculation accuracy. Recommended for 5-10. Default = 5
 * @return {Number|Boolean} BezierCurve length (Invalid input will return false)
 */


function getBezierCurveLength(bezierCurve) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

  if (!bezierCurve) {
    console.error('getBezierCurveLength: Missing parameters!');
    return false;
  }

  if (!(bezierCurve instanceof Array)) {
    console.error('getBezierCurveLength: Parameter bezierCurve must be an array!');
    return false;
  }

  if (typeof precision !== 'number') {
    console.error('getBezierCurveLength: Parameter precision must be a number!');
    return false;
  }

  var _abstractBezierCurveT2 = abstractBezierCurveToPolyline(bezierCurve, precision),
      segmentPoints = _abstractBezierCurveT2.segmentPoints; // Calculate the total length of the points that make up the polyline


  var pointsDistance = getSegmentPointsDistance([segmentPoints])[0];
  var length = getNumsSum(pointsDistance);
  return length;
}

var _default = bezierCurveToPolyline;
exports["default"] = _default;
},{"@babel/runtime/helpers/interopRequireDefault":15,"@babel/runtime/helpers/slicedToArray":20,"@babel/runtime/helpers/toConsumableArray":21}],26:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

/**
 * @description Abstract the polyline formed by N points into a set of bezier curve
 * @param {Array} polyline A set of points that make up a polyline
 * @param {Boolean} close  Closed curve
 * @param {Number} offsetA Smoothness
 * @param {Number} offsetB Smoothness
 * @return {Array|Boolean} A set of bezier curve (Invalid input will return false)
 */
function polylineToBezierCurve(polyline) {
  var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var offsetA = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.25;
  var offsetB = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25;

  if (!(polyline instanceof Array)) {
    console.error('polylineToBezierCurve: Parameter polyline must be an array!');
    return false;
  }

  if (polyline.length <= 2) {
    console.error('polylineToBezierCurve: Converting to a curve requires at least 3 points!');
    return false;
  }

  var startPoint = polyline[0];
  var bezierCurveLineNum = polyline.length - 1;
  var bezierCurvePoints = new Array(bezierCurveLineNum).fill(0).map(function (foo, i) {
    return [].concat((0, _toConsumableArray2["default"])(getBezierCurveLineControlPoints(polyline, i, close, offsetA, offsetB)), [polyline[i + 1]]);
  });
  if (close) closeBezierCurve(bezierCurvePoints, startPoint);
  bezierCurvePoints.unshift(polyline[0]);
  return bezierCurvePoints;
}
/**
 * @description Get the control points of the Bezier curve
 * @param {Array} polyline A set of points that make up a polyline
 * @param {Number} index   The index of which get controls points's point in polyline
 * @param {Boolean} close  Closed curve
 * @param {Number} offsetA Smoothness
 * @param {Number} offsetB Smoothness
 * @return {Array} Control points
 */


function getBezierCurveLineControlPoints(polyline, index) {
  var close = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var offsetA = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25;
  var offsetB = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.25;
  var pointNum = polyline.length;
  if (pointNum < 3 || index >= pointNum) return;
  var beforePointIndex = index - 1;
  if (beforePointIndex < 0) beforePointIndex = close ? pointNum + beforePointIndex : 0;
  var afterPointIndex = index + 1;
  if (afterPointIndex >= pointNum) afterPointIndex = close ? afterPointIndex - pointNum : pointNum - 1;
  var afterNextPointIndex = index + 2;
  if (afterNextPointIndex >= pointNum) afterNextPointIndex = close ? afterNextPointIndex - pointNum : pointNum - 1;
  var pointBefore = polyline[beforePointIndex];
  var pointMiddle = polyline[index];
  var pointAfter = polyline[afterPointIndex];
  var pointAfterNext = polyline[afterNextPointIndex];
  return [[pointMiddle[0] + offsetA * (pointAfter[0] - pointBefore[0]), pointMiddle[1] + offsetA * (pointAfter[1] - pointBefore[1])], [pointAfter[0] - offsetB * (pointAfterNext[0] - pointMiddle[0]), pointAfter[1] - offsetB * (pointAfterNext[1] - pointMiddle[1])]];
}
/**
 * @description Get the last curve of the closure
 * @param {Array} bezierCurve A set of sub-curve
 * @param {Array} startPoint  Start point
 * @return {Array} The last curve for closure
 */


function closeBezierCurve(bezierCurve, startPoint) {
  var firstSubCurve = bezierCurve[0];
  var lastSubCurve = bezierCurve.slice(-1)[0];
  bezierCurve.push([getSymmetryPoint(lastSubCurve[1], lastSubCurve[2]), getSymmetryPoint(firstSubCurve[0], startPoint), startPoint]);
  return bezierCurve;
}
/**
 * @description Get the symmetry point
 * @param {Array} point       Symmetric point
 * @param {Array} centerPoint Symmetric center
 * @return {Array} Symmetric point
 */


function getSymmetryPoint(point, centerPoint) {
  var _point = (0, _slicedToArray2["default"])(point, 2),
      px = _point[0],
      py = _point[1];

  var _centerPoint = (0, _slicedToArray2["default"])(centerPoint, 2),
      cx = _centerPoint[0],
      cy = _centerPoint[1];

  var minusX = cx - px;
  var minusY = cy - py;
  return [cx + minusX, cy + minusY];
}

var _default = polylineToBezierCurve;
exports["default"] = _default;
},{"@babel/runtime/helpers/interopRequireDefault":15,"@babel/runtime/helpers/slicedToArray":20,"@babel/runtime/helpers/toConsumableArray":21}],27:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "bezierCurveToPolyline", {
  enumerable: true,
  get: function get() {
    return _bezierCurveToPolyline.bezierCurveToPolyline;
  }
});
Object.defineProperty(exports, "getBezierCurveLength", {
  enumerable: true,
  get: function get() {
    return _bezierCurveToPolyline.getBezierCurveLength;
  }
});
Object.defineProperty(exports, "polylineToBezierCurve", {
  enumerable: true,
  get: function get() {
    return _polylineToBezierCurve["default"];
  }
});
exports["default"] = void 0;

var _bezierCurveToPolyline = require("./core/bezierCurveToPolyline");

var _polylineToBezierCurve = _interopRequireDefault(require("./core/polylineToBezierCurve"));

var _default = {
  bezierCurveToPolyline: _bezierCurveToPolyline.bezierCurveToPolyline,
  getBezierCurveLength: _bezierCurveToPolyline.getBezierCurveLength,
  polylineToBezierCurve: _polylineToBezierCurve["default"]
};
exports["default"] = _default;
},{"./core/bezierCurveToPolyline":25,"./core/polylineToBezierCurve":26,"@babel/runtime/helpers/interopRequireDefault":15}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = new Map([['transparent', 'rgba(0,0,0,0)'], ['black', '#000000'], ['silver', '#C0C0C0'], ['gray', '#808080'], ['white', '#FFFFFF'], ['maroon', '#800000'], ['red', '#FF0000'], ['purple', '#800080'], ['fuchsia', '#FF00FF'], ['green', '#008000'], ['lime', '#00FF00'], ['olive', '#808000'], ['yellow', '#FFFF00'], ['navy', '#000080'], ['blue', '#0000FF'], ['teal', '#008080'], ['aqua', '#00FFFF'], ['aliceblue', '#f0f8ff'], ['antiquewhite', '#faebd7'], ['aquamarine', '#7fffd4'], ['azure', '#f0ffff'], ['beige', '#f5f5dc'], ['bisque', '#ffe4c4'], ['blanchedalmond', '#ffebcd'], ['blueviolet', '#8a2be2'], ['brown', '#a52a2a'], ['burlywood', '#deb887'], ['cadetblue', '#5f9ea0'], ['chartreuse', '#7fff00'], ['chocolate', '#d2691e'], ['coral', '#ff7f50'], ['cornflowerblue', '#6495ed'], ['cornsilk', '#fff8dc'], ['crimson', '#dc143c'], ['cyan', '#00ffff'], ['darkblue', '#00008b'], ['darkcyan', '#008b8b'], ['darkgoldenrod', '#b8860b'], ['darkgray', '#a9a9a9'], ['darkgreen', '#006400'], ['darkgrey', '#a9a9a9'], ['darkkhaki', '#bdb76b'], ['darkmagenta', '#8b008b'], ['darkolivegreen', '#556b2f'], ['darkorange', '#ff8c00'], ['darkorchid', '#9932cc'], ['darkred', '#8b0000'], ['darksalmon', '#e9967a'], ['darkseagreen', '#8fbc8f'], ['darkslateblue', '#483d8b'], ['darkslategray', '#2f4f4f'], ['darkslategrey', '#2f4f4f'], ['darkturquoise', '#00ced1'], ['darkviolet', '#9400d3'], ['deeppink', '#ff1493'], ['deepskyblue', '#00bfff'], ['dimgray', '#696969'], ['dimgrey', '#696969'], ['dodgerblue', '#1e90ff'], ['firebrick', '#b22222'], ['floralwhite', '#fffaf0'], ['forestgreen', '#228b22'], ['gainsboro', '#dcdcdc'], ['ghostwhite', '#f8f8ff'], ['gold', '#ffd700'], ['goldenrod', '#daa520'], ['greenyellow', '#adff2f'], ['grey', '#808080'], ['honeydew', '#f0fff0'], ['hotpink', '#ff69b4'], ['indianred', '#cd5c5c'], ['indigo', '#4b0082'], ['ivory', '#fffff0'], ['khaki', '#f0e68c'], ['lavender', '#e6e6fa'], ['lavenderblush', '#fff0f5'], ['lawngreen', '#7cfc00'], ['lemonchiffon', '#fffacd'], ['lightblue', '#add8e6'], ['lightcoral', '#f08080'], ['lightcyan', '#e0ffff'], ['lightgoldenrodyellow', '#fafad2'], ['lightgray', '#d3d3d3'], ['lightgreen', '#90ee90'], ['lightgrey', '#d3d3d3'], ['lightpink', '#ffb6c1'], ['lightsalmon', '#ffa07a'], ['lightseagreen', '#20b2aa'], ['lightskyblue', '#87cefa'], ['lightslategray', '#778899'], ['lightslategrey', '#778899'], ['lightsteelblue', '#b0c4de'], ['lightyellow', '#ffffe0'], ['limegreen', '#32cd32'], ['linen', '#faf0e6'], ['magenta', '#ff00ff'], ['mediumaquamarine', '#66cdaa'], ['mediumblue', '#0000cd'], ['mediumorchid', '#ba55d3'], ['mediumpurple', '#9370db'], ['mediumseagreen', '#3cb371'], ['mediumslateblue', '#7b68ee'], ['mediumspringgreen', '#00fa9a'], ['mediumturquoise', '#48d1cc'], ['mediumvioletred', '#c71585'], ['midnightblue', '#191970'], ['mintcream', '#f5fffa'], ['mistyrose', '#ffe4e1'], ['moccasin', '#ffe4b5'], ['navajowhite', '#ffdead'], ['oldlace', '#fdf5e6'], ['olivedrab', '#6b8e23'], ['orange', '#ffa500'], ['orangered', '#ff4500'], ['orchid', '#da70d6'], ['palegoldenrod', '#eee8aa'], ['palegreen', '#98fb98'], ['paleturquoise', '#afeeee'], ['palevioletred', '#db7093'], ['papayawhip', '#ffefd5'], ['peachpuff', '#ffdab9'], ['peru', '#cd853f'], ['pink', '#ffc0cb'], ['plum', '#dda0dd'], ['powderblue', '#b0e0e6'], ['rosybrown', '#bc8f8f'], ['royalblue', '#4169e1'], ['saddlebrown', '#8b4513'], ['salmon', '#fa8072'], ['sandybrown', '#f4a460'], ['seagreen', '#2e8b57'], ['seashell', '#fff5ee'], ['sienna', '#a0522d'], ['skyblue', '#87ceeb'], ['slateblue', '#6a5acd'], ['slategray', '#708090'], ['slategrey', '#708090'], ['snow', '#fffafa'], ['springgreen', '#00ff7f'], ['steelblue', '#4682b4'], ['tan', '#d2b48c'], ['thistle', '#d8bfd8'], ['tomato', '#ff6347'], ['turquoise', '#40e0d0'], ['violet', '#ee82ee'], ['wheat', '#f5deb3'], ['whitesmoke', '#f5f5f5'], ['yellowgreen', '#9acd32']]);

exports["default"] = _default;
},{}],29:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRgbValue = getRgbValue;
exports.getRgbaValue = getRgbaValue;
exports.getOpacity = getOpacity;
exports.toRgb = toRgb;
exports.toHex = toHex;
exports.getColorFromRgbValue = getColorFromRgbValue;
exports.darken = darken;
exports.lighten = lighten;
exports.fade = fade;
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _keywords = _interopRequireDefault(require("./config/keywords"));

var hexReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
var rgbReg = /^(rgb|rgba|RGB|RGBA)/;
var rgbaReg = /^(rgba|RGBA)/;
/**
 * @description Color validator
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {String|Boolean} Valid color Or false
 */

function validator(color) {
  var isHex = hexReg.test(color);
  var isRgb = rgbReg.test(color);
  if (isHex || isRgb) return color;
  color = getColorByKeyword(color);

  if (!color) {
    console.error('Color: Invalid color!');
    return false;
  }

  return color;
}
/**
 * @description Get color by keyword
 * @param {String} keyword Color keyword like red, green and etc.
 * @return {String|Boolean} Hex or rgba color (Invalid keyword will return false)
 */


function getColorByKeyword(keyword) {
  if (!keyword) {
    console.error('getColorByKeywords: Missing parameters!');
    return false;
  }

  if (!_keywords["default"].has(keyword)) return false;
  return _keywords["default"].get(keyword);
}
/**
 * @description Get the Rgb value of the color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Array<Number>|Boolean} Rgb value of the color (Invalid input will return false)
 */


function getRgbValue(color) {
  if (!color) {
    console.error('getRgbValue: Missing parameters!');
    return false;
  }

  color = validator(color);
  if (!color) return false;
  var isHex = hexReg.test(color);
  var isRgb = rgbReg.test(color);
  var lowerColor = color.toLowerCase();
  if (isHex) return getRgbValueFromHex(lowerColor);
  if (isRgb) return getRgbValueFromRgb(lowerColor);
}
/**
 * @description Get the rgb value of the hex color
 * @param {String} color Hex color
 * @return {Array<Number>} Rgb value of the color
 */


function getRgbValueFromHex(color) {
  color = color.replace('#', '');
  if (color.length === 3) color = Array.from(color).map(function (hexNum) {
    return hexNum + hexNum;
  }).join('');
  color = color.split('');
  return new Array(3).fill(0).map(function (t, i) {
    return parseInt("0x".concat(color[i * 2]).concat(color[i * 2 + 1]));
  });
}
/**
 * @description Get the rgb value of the rgb/rgba color
 * @param {String} color Hex color
 * @return {Array} Rgb value of the color
 */


function getRgbValueFromRgb(color) {
  return color.replace(/rgb\(|rgba\(|\)/g, '').split(',').slice(0, 3).map(function (n) {
    return parseInt(n);
  });
}
/**
 * @description Get the Rgba value of the color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Array<Number>|Boolean} Rgba value of the color (Invalid input will return false)
 */


function getRgbaValue(color) {
  if (!color) {
    console.error('getRgbaValue: Missing parameters!');
    return false;
  }

  var colorValue = getRgbValue(color);
  if (!colorValue) return false;
  colorValue.push(getOpacity(color));
  return colorValue;
}
/**
 * @description Get the opacity of color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Number|Boolean} Color opacity (Invalid input will return false)
 */


function getOpacity(color) {
  if (!color) {
    console.error('getOpacity: Missing parameters!');
    return false;
  }

  color = validator(color);
  if (!color) return false;
  var isRgba = rgbaReg.test(color);
  if (!isRgba) return 1;
  color = color.toLowerCase();
  return Number(color.split(',').slice(-1)[0].replace(/[)|\s]/g, ''));
}
/**
 * @description Convert color to Rgb|Rgba color
 * @param {String} color   Hex|Rgb|Rgba color or color keyword
 * @param {Number} opacity The opacity of color
 * @return {String|Boolean} Rgb|Rgba color (Invalid input will return false)
 */


function toRgb(color, opacity) {
  if (!color) {
    console.error('toRgb: Missing parameters!');
    return false;
  }

  var rgbValue = getRgbValue(color);
  if (!rgbValue) return false;
  var addOpacity = typeof opacity === 'number';
  if (addOpacity) return 'rgba(' + rgbValue.join(',') + ",".concat(opacity, ")");
  return 'rgb(' + rgbValue.join(',') + ')';
}
/**
 * @description Convert color to Hex color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {String|Boolean} Hex color (Invalid input will return false)
 */


function toHex(color) {
  if (!color) {
    console.error('toHex: Missing parameters!');
    return false;
  }

  if (hexReg.test(color)) return color;
  color = getRgbValue(color);
  if (!color) return false;
  return '#' + color.map(function (n) {
    return Number(n).toString(16);
  }).map(function (n) {
    return n === '0' ? '00' : n;
  }).join('');
}
/**
 * @description Get Color from Rgb|Rgba value
 * @param {Array<Number>} value Rgb|Rgba color value
 * @return {String|Boolean} Rgb|Rgba color (Invalid input will return false)
 */


function getColorFromRgbValue(value) {
  if (!value) {
    console.error('getColorFromRgbValue: Missing parameters!');
    return false;
  }

  var valueLength = value.length;

  if (valueLength !== 3 && valueLength !== 4) {
    console.error('getColorFromRgbValue: Value is illegal!');
    return false;
  }

  var color = valueLength === 3 ? 'rgb(' : 'rgba(';
  color += value.join(',') + ')';
  return color;
}
/**
 * @description Deepen color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Number} Percent of Deepen (1-100)
 * @return {String|Boolean} Rgba color (Invalid input will return false)
 */


function darken(color) {
  var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!color) {
    console.error('darken: Missing parameters!');
    return false;
  }

  var rgbaValue = getRgbaValue(color);
  if (!rgbaValue) return false;
  rgbaValue = rgbaValue.map(function (v, i) {
    return i === 3 ? v : v - Math.ceil(2.55 * percent);
  }).map(function (v) {
    return v < 0 ? 0 : v;
  });
  return getColorFromRgbValue(rgbaValue);
}
/**
 * @description Brighten color
 * @param {String} color Hex|Rgb|Rgba color or color keyword
 * @return {Number} Percent of brighten (1-100)
 * @return {String|Boolean} Rgba color (Invalid input will return false)
 */


function lighten(color) {
  var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!color) {
    console.error('lighten: Missing parameters!');
    return false;
  }

  var rgbaValue = getRgbaValue(color);
  if (!rgbaValue) return false;
  rgbaValue = rgbaValue.map(function (v, i) {
    return i === 3 ? v : v + Math.ceil(2.55 * percent);
  }).map(function (v) {
    return v > 255 ? 255 : v;
  });
  return getColorFromRgbValue(rgbaValue);
}
/**
 * @description Adjust color opacity
 * @param {String} color   Hex|Rgb|Rgba color or color keyword
 * @param {Number} Percent of opacity
 * @return {String|Boolean} Rgba color (Invalid input will return false)
 */


function fade(color) {
  var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

  if (!color) {
    console.error('fade: Missing parameters!');
    return false;
  }

  var rgbValue = getRgbValue(color);
  if (!rgbValue) return false;
  var rgbaValue = [].concat((0, _toConsumableArray2["default"])(rgbValue), [percent / 100]);
  return getColorFromRgbValue(rgbaValue);
}

var _default = {
  fade: fade,
  toHex: toHex,
  toRgb: toRgb,
  darken: darken,
  lighten: lighten,
  getOpacity: getOpacity,
  getRgbValue: getRgbValue,
  getRgbaValue: getRgbaValue,
  getColorFromRgbValue: getColorFromRgbValue
};
exports["default"] = _default;
},{"./config/keywords":28,"@babel/runtime/helpers/interopRequireDefault":15,"@babel/runtime/helpers/toConsumableArray":21}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.easeInOutBounce = exports.easeOutBounce = exports.easeInBounce = exports.easeInOutElastic = exports.easeOutElastic = exports.easeInElastic = exports.easeInOutBack = exports.easeOutBack = exports.easeInBack = exports.easeInOutQuint = exports.easeOutQuint = exports.easeInQuint = exports.easeInOutQuart = exports.easeOutQuart = exports.easeInQuart = exports.easeInOutCubic = exports.easeOutCubic = exports.easeInCubic = exports.easeInOutQuad = exports.easeOutQuad = exports.easeInQuad = exports.easeInOutSine = exports.easeOutSine = exports.easeInSine = exports.linear = void 0;
var linear = [[[0, 1], '', [0.33, 0.67]], [[1, 0], [0.67, 0.33]]];
/**
 * @description Sine
 */

exports.linear = linear;
var easeInSine = [[[0, 1]], [[0.538, 0.564], [0.169, 0.912], [0.880, 0.196]], [[1, 0]]];
exports.easeInSine = easeInSine;
var easeOutSine = [[[0, 1]], [[0.444, 0.448], [0.169, 0.736], [0.718, 0.16]], [[1, 0]]];
exports.easeOutSine = easeOutSine;
var easeInOutSine = [[[0, 1]], [[0.5, 0.5], [0.2, 1], [0.8, 0]], [[1, 0]]];
/**
 * @description Quad
 */

exports.easeInOutSine = easeInOutSine;
var easeInQuad = [[[0, 1]], [[0.550, 0.584], [0.231, 0.904], [0.868, 0.264]], [[1, 0]]];
exports.easeInQuad = easeInQuad;
var easeOutQuad = [[[0, 1]], [[0.413, 0.428], [0.065, 0.816], [0.760, 0.04]], [[1, 0]]];
exports.easeOutQuad = easeOutQuad;
var easeInOutQuad = [[[0, 1]], [[0.5, 0.5], [0.3, 0.9], [0.7, 0.1]], [[1, 0]]];
/**
 * @description Cubic
 */

exports.easeInOutQuad = easeInOutQuad;
var easeInCubic = [[[0, 1]], [[0.679, 0.688], [0.366, 0.992], [0.992, 0.384]], [[1, 0]]];
exports.easeInCubic = easeInCubic;
var easeOutCubic = [[[0, 1]], [[0.321, 0.312], [0.008, 0.616], [0.634, 0.008]], [[1, 0]]];
exports.easeOutCubic = easeOutCubic;
var easeInOutCubic = [[[0, 1]], [[0.5, 0.5], [0.3, 1], [0.7, 0]], [[1, 0]]];
/**
 * @description Quart
 */

exports.easeInOutCubic = easeInOutCubic;
var easeInQuart = [[[0, 1]], [[0.812, 0.74], [0.611, 0.988], [1.013, 0.492]], [[1, 0]]];
exports.easeInQuart = easeInQuart;
var easeOutQuart = [[[0, 1]], [[0.152, 0.244], [0.001, 0.448], [0.285, -0.02]], [[1, 0]]];
exports.easeOutQuart = easeOutQuart;
var easeInOutQuart = [[[0, 1]], [[0.5, 0.5], [0.4, 1], [0.6, 0]], [[1, 0]]];
/**
 * @description Quint
 */

exports.easeInOutQuart = easeInOutQuart;
var easeInQuint = [[[0, 1]], [[0.857, 0.856], [0.714, 1], [1, 0.712]], [[1, 0]]];
exports.easeInQuint = easeInQuint;
var easeOutQuint = [[[0, 1]], [[0.108, 0.2], [0.001, 0.4], [0.214, -0.012]], [[1, 0]]];
exports.easeOutQuint = easeOutQuint;
var easeInOutQuint = [[[0, 1]], [[0.5, 0.5], [0.5, 1], [0.5, 0]], [[1, 0]]];
/**
 * @description Back
 */

exports.easeInOutQuint = easeInOutQuint;
var easeInBack = [[[0, 1]], [[0.667, 0.896], [0.380, 1.184], [0.955, 0.616]], [[1, 0]]];
exports.easeInBack = easeInBack;
var easeOutBack = [[[0, 1]], [[0.335, 0.028], [0.061, 0.22], [0.631, -0.18]], [[1, 0]]];
exports.easeOutBack = easeOutBack;
var easeInOutBack = [[[0, 1]], [[0.5, 0.5], [0.4, 1.4], [0.6, -0.4]], [[1, 0]]];
/**
 * @description Elastic
 */

exports.easeInOutBack = easeInOutBack;
var easeInElastic = [[[0, 1]], [[0.474, 0.964], [0.382, 0.988], [0.557, 0.952]], [[0.619, 1.076], [0.565, 1.088], [0.669, 1.08]], [[0.770, 0.916], [0.712, 0.924], [0.847, 0.904]], [[0.911, 1.304], [0.872, 1.316], [0.961, 1.34]], [[1, 0]]];
exports.easeInElastic = easeInElastic;
var easeOutElastic = [[[0, 1]], [[0.073, -0.32], [0.034, -0.328], [0.104, -0.344]], [[0.191, 0.092], [0.110, 0.06], [0.256, 0.08]], [[0.310, -0.076], [0.260, -0.068], [0.357, -0.076]], [[0.432, 0.032], [0.362, 0.028], [0.683, -0.004]], [[1, 0]]];
exports.easeOutElastic = easeOutElastic;
var easeInOutElastic = [[[0, 1]], [[0.210, 0.94], [0.167, 0.884], [0.252, 0.98]], [[0.299, 1.104], [0.256, 1.092], [0.347, 1.108]], [[0.5, 0.496], [0.451, 0.672], [0.548, 0.324]], [[0.696, -0.108], [0.652, -0.112], [0.741, -0.124]], [[0.805, 0.064], [0.756, 0.012], [0.866, 0.096]], [[1, 0]]];
/**
 * @description Bounce
 */

exports.easeInOutElastic = easeInOutElastic;
var easeInBounce = [[[0, 1]], [[0.148, 1], [0.075, 0.868], [0.193, 0.848]], [[0.326, 1], [0.276, 0.836], [0.405, 0.712]], [[0.600, 1], [0.511, 0.708], [0.671, 0.348]], [[1, 0]]];
exports.easeInBounce = easeInBounce;
var easeOutBounce = [[[0, 1]], [[0.357, 0.004], [0.270, 0.592], [0.376, 0.252]], [[0.604, -0.004], [0.548, 0.312], [0.669, 0.184]], [[0.820, 0], [0.749, 0.184], [0.905, 0.132]], [[1, 0]]];
exports.easeOutBounce = easeOutBounce;
var easeInOutBounce = [[[0, 1]], [[0.102, 1], [0.050, 0.864], [0.117, 0.86]], [[0.216, 0.996], [0.208, 0.844], [0.227, 0.808]], [[0.347, 0.996], [0.343, 0.8], [0.480, 0.292]], [[0.635, 0.004], [0.511, 0.676], [0.656, 0.208]], [[0.787, 0], [0.760, 0.2], [0.795, 0.144]], [[0.905, -0.004], [0.899, 0.164], [0.944, 0.144]], [[1, 0]]];
exports.easeInOutBounce = easeInOutBounce;

var _default = new Map([['linear', linear], ['easeInSine', easeInSine], ['easeOutSine', easeOutSine], ['easeInOutSine', easeInOutSine], ['easeInQuad', easeInQuad], ['easeOutQuad', easeOutQuad], ['easeInOutQuad', easeInOutQuad], ['easeInCubic', easeInCubic], ['easeOutCubic', easeOutCubic], ['easeInOutCubic', easeInOutCubic], ['easeInQuart', easeInQuart], ['easeOutQuart', easeOutQuart], ['easeInOutQuart', easeInOutQuart], ['easeInQuint', easeInQuint], ['easeOutQuint', easeOutQuint], ['easeInOutQuint', easeInOutQuint], ['easeInBack', easeInBack], ['easeOutBack', easeOutBack], ['easeInOutBack', easeInOutBack], ['easeInElastic', easeInElastic], ['easeOutElastic', easeOutElastic], ['easeInOutElastic', easeInOutElastic], ['easeInBounce', easeInBounce], ['easeOutBounce', easeOutBounce], ['easeInOutBounce', easeInOutBounce]]);

exports["default"] = _default;
},{}],31:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transition = transition;
exports.injectNewCurve = injectNewCurve;
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _curves = _interopRequireDefault(require("./config/curves"));

var defaultTransitionBC = 'linear';
/**
 * @description Get the N-frame animation state by the start and end state
 *              of the animation and the easing curve
 * @param {String|Array} tBC               Easing curve name or data
 * @param {Number|Array|Object} startState Animation start state
 * @param {Number|Array|Object} endState   Animation end state
 * @param {Number} frameNum                Number of Animation frames
 * @param {Boolean} deep                   Whether to use recursive mode
 * @return {Array|Boolean} State of each frame of the animation (Invalid input will return false)
 */

function transition(tBC) {
  var startState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var endState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var frameNum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30;
  var deep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (!checkParams.apply(void 0, arguments)) return false;

  try {
    // Get the transition bezier curve
    var bezierCurve = getBezierCurve(tBC); // Get the progress of each frame state

    var frameStateProgress = getFrameStateProgress(bezierCurve, frameNum); // If the recursion mode is not enabled or the state type is Number, the shallow state calculation is performed directly.

    if (!deep || typeof endState === 'number') return getTransitionState(startState, endState, frameStateProgress);
    return recursionTransitionState(startState, endState, frameStateProgress);
  } catch (_unused) {
    console.warn('Transition parameter may be abnormal!');
    return [endState];
  }
}
/**
 * @description Check if the parameters are legal
 * @param {String} tBC      Name of transition bezier curve
 * @param {Any} startState  Transition start state
 * @param {Any} endState    Transition end state
 * @param {Number} frameNum Number of transition frames
 * @return {Boolean} Is the parameter legal
 */


function checkParams(tBC) {
  var startState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var endState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var frameNum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30;

  if (!tBC || startState === false || endState === false || !frameNum) {
    console.error('transition: Missing Parameters!');
    return false;
  }

  if ((0, _typeof2["default"])(startState) !== (0, _typeof2["default"])(endState)) {
    console.error('transition: Inconsistent Status Types!');
    return false;
  }

  var stateType = (0, _typeof2["default"])(endState);

  if (stateType === 'string' || stateType === 'boolean' || !tBC.length) {
    console.error('transition: Unsupported Data Type of State!');
    return false;
  }

  if (!_curves["default"].has(tBC) && !(tBC instanceof Array)) {
    console.warn('transition: Transition curve not found, default curve will be used!');
  }

  return true;
}
/**
 * @description Get the transition bezier curve
 * @param {String} tBC Name of transition bezier curve
 * @return {Array} Bezier curve data
 */


function getBezierCurve(tBC) {
  var bezierCurve = '';

  if (_curves["default"].has(tBC)) {
    bezierCurve = _curves["default"].get(tBC);
  } else if (tBC instanceof Array) {
    bezierCurve = tBC;
  } else {
    bezierCurve = _curves["default"].get(defaultTransitionBC);
  }

  return bezierCurve;
}
/**
 * @description Get the progress of each frame state
 * @param {Array} bezierCurve Transition bezier curve
 * @param {Number} frameNum   Number of transition frames
 * @return {Array} Progress of each frame state
 */


function getFrameStateProgress(bezierCurve, frameNum) {
  var tMinus = 1 / (frameNum - 1);
  var tState = new Array(frameNum).fill(0).map(function (t, i) {
    return i * tMinus;
  });
  var frameState = tState.map(function (t) {
    return getFrameStateFromT(bezierCurve, t);
  });
  return frameState;
}
/**
 * @description Get the progress of the corresponding frame according to t
 * @param {Array} bezierCurve Transition bezier curve
 * @param {Number} t          Current frame t
 * @return {Number} Progress of current frame
 */


function getFrameStateFromT(bezierCurve, t) {
  var tBezierCurvePoint = getBezierCurvePointFromT(bezierCurve, t);
  var bezierCurvePointT = getBezierCurvePointTFromReT(tBezierCurvePoint, t);
  return getBezierCurveTState(tBezierCurvePoint, bezierCurvePointT);
}
/**
 * @description Get the corresponding sub-curve according to t
 * @param {Array} bezierCurve Transition bezier curve
 * @param {Number} t          Current frame t
 * @return {Array} Sub-curve of t
 */


function getBezierCurvePointFromT(bezierCurve, t) {
  var lastIndex = bezierCurve.length - 1;
  var begin = '',
      end = '';
  bezierCurve.findIndex(function (item, i) {
    if (i === lastIndex) return;
    begin = item;
    end = bezierCurve[i + 1];
    var currentMainPointX = begin[0][0];
    var nextMainPointX = end[0][0];
    return t >= currentMainPointX && t < nextMainPointX;
  });
  var p0 = begin[0];
  var p1 = begin[2] || begin[0];
  var p2 = end[1] || end[0];
  var p3 = end[0];
  return [p0, p1, p2, p3];
}
/**
 * @description Get local t based on t and sub-curve
 * @param {Array} bezierCurve Sub-curve
 * @param {Number} t          Current frame t
 * @return {Number} local t of sub-curve
 */


function getBezierCurvePointTFromReT(bezierCurve, t) {
  var reBeginX = bezierCurve[0][0];
  var reEndX = bezierCurve[3][0];
  var xMinus = reEndX - reBeginX;
  var tMinus = t - reBeginX;
  return tMinus / xMinus;
}
/**
 * @description Get the curve progress of t
 * @param {Array} bezierCurve Sub-curve
 * @param {Number} t          Current frame t
 * @return {Number} Progress of current frame
 */


function getBezierCurveTState(_ref, t) {
  var _ref2 = (0, _slicedToArray2["default"])(_ref, 4),
      _ref2$ = (0, _slicedToArray2["default"])(_ref2[0], 2),
      p0 = _ref2$[1],
      _ref2$2 = (0, _slicedToArray2["default"])(_ref2[1], 2),
      p1 = _ref2$2[1],
      _ref2$3 = (0, _slicedToArray2["default"])(_ref2[2], 2),
      p2 = _ref2$3[1],
      _ref2$4 = (0, _slicedToArray2["default"])(_ref2[3], 2),
      p3 = _ref2$4[1];

  var pow = Math.pow;
  var tMinus = 1 - t;
  var result1 = p0 * pow(tMinus, 3);
  var result2 = 3 * p1 * t * pow(tMinus, 2);
  var result3 = 3 * p2 * pow(t, 2) * tMinus;
  var result4 = p3 * pow(t, 3);
  return 1 - (result1 + result2 + result3 + result4);
}
/**
 * @description Get transition state according to frame progress
 * @param {Any} startState   Transition start state
 * @param {Any} endState     Transition end state
 * @param {Array} frameState Frame state progress
 * @return {Array} Transition frame state
 */


function getTransitionState(begin, end, frameState) {
  var stateType = 'object';
  if (typeof begin === 'number') stateType = 'number';
  if (begin instanceof Array) stateType = 'array';
  if (stateType === 'number') return getNumberTransitionState(begin, end, frameState);
  if (stateType === 'array') return getArrayTransitionState(begin, end, frameState);
  if (stateType === 'object') return getObjectTransitionState(begin, end, frameState);
  return frameState.map(function (t) {
    return end;
  });
}
/**
 * @description Get the transition data of the number type
 * @param {Number} startState Transition start state
 * @param {Number} endState   Transition end state
 * @param {Array} frameState  Frame state progress
 * @return {Array} Transition frame state
 */


function getNumberTransitionState(begin, end, frameState) {
  var minus = end - begin;
  return frameState.map(function (s) {
    return begin + minus * s;
  });
}
/**
 * @description Get the transition data of the array type
 * @param {Array} startState Transition start state
 * @param {Array} endState   Transition end state
 * @param {Array} frameState Frame state progress
 * @return {Array} Transition frame state
 */


function getArrayTransitionState(begin, end, frameState) {
  var minus = end.map(function (v, i) {
    if (typeof v !== 'number') return false;
    return v - begin[i];
  });
  return frameState.map(function (s) {
    return minus.map(function (v, i) {
      if (v === false) return end[i];
      return begin[i] + v * s;
    });
  });
}
/**
 * @description Get the transition data of the object type
 * @param {Object} startState Transition start state
 * @param {Object} endState   Transition end state
 * @param {Array} frameState  Frame state progress
 * @return {Array} Transition frame state
 */


function getObjectTransitionState(begin, end, frameState) {
  var keys = Object.keys(end);
  var beginValue = keys.map(function (k) {
    return begin[k];
  });
  var endValue = keys.map(function (k) {
    return end[k];
  });
  var arrayState = getArrayTransitionState(beginValue, endValue, frameState);
  return arrayState.map(function (item) {
    var frameData = {};
    item.forEach(function (v, i) {
      return frameData[keys[i]] = v;
    });
    return frameData;
  });
}
/**
 * @description Get the transition state data by recursion
 * @param {Array|Object} startState Transition start state
 * @param {Array|Object} endState   Transition end state
 * @param {Array} frameState        Frame state progress
 * @return {Array} Transition frame state
 */


function recursionTransitionState(begin, end, frameState) {
  var state = getTransitionState(begin, end, frameState);

  var _loop = function _loop(key) {
    var bTemp = begin[key];
    var eTemp = end[key];
    if ((0, _typeof2["default"])(eTemp) !== 'object') return "continue";
    var data = recursionTransitionState(bTemp, eTemp, frameState);
    state.forEach(function (fs, i) {
      return fs[key] = data[i];
    });
  };

  for (var key in end) {
    var _ret = _loop(key);

    if (_ret === "continue") continue;
  }

  return state;
}
/**
 * @description Inject new curve into curves as config
 * @param {Any} key     The key of curve
 * @param {Array} curve Bezier curve data
 * @return {Undefined} No return
 */


function injectNewCurve(key, curve) {
  if (!key || !curve) {
    console.error('InjectNewCurve Missing Parameters!');
    return;
  }

  _curves["default"].set(key, curve);
}

var _default = transition;
exports["default"] = _default;
},{"./config/curves":30,"@babel/runtime/helpers/interopRequireDefault":15,"@babel/runtime/helpers/slicedToArray":20,"@babel/runtime/helpers/typeof":22}],32:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9lbnRyeS5qcyIsImxpYi9jbGFzcy9jcmVuZGVyLmNsYXNzLmpzIiwibGliL2NsYXNzL2dyYXBoLmNsYXNzLmpzIiwibGliL2NsYXNzL3N0eWxlLmNsYXNzLmpzIiwibGliL2NvbmZpZy9ncmFwaHMuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvcGx1Z2luL2NhbnZhcy5qcyIsImxpYi9wbHVnaW4vdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FycmF5TGlrZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheVdpdGhIb2xlcy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FycmF5V2l0aG91dEhvbGVzLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXN5bmNUb0dlbmVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pdGVyYWJsZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pdGVyYWJsZVRvQXJyYXlMaW1pdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL25vbkl0ZXJhYmxlUmVzdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL25vbkl0ZXJhYmxlU3ByZWFkLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdHlwZW9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvQGppYW1pbmdoaS9iZXppZXItY3VydmUvbGliL2NvcmUvYmV6aWVyQ3VydmVUb1BvbHlsaW5lLmpzIiwibm9kZV9tb2R1bGVzL0BqaWFtaW5naGkvYmV6aWVyLWN1cnZlL2xpYi9jb3JlL3BvbHlsaW5lVG9CZXppZXJDdXJ2ZS5qcyIsIm5vZGVfbW9kdWxlcy9AamlhbWluZ2hpL2Jlemllci1jdXJ2ZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvQGppYW1pbmdoaS9jb2xvci9saWIvY29uZmlnL2tleXdvcmRzLmpzIiwibm9kZV9tb2R1bGVzL0BqaWFtaW5naGkvY29sb3IvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL0BqaWFtaW5naGkvdHJhbnNpdGlvbi9saWIvY29uZmlnL2N1cnZlcy5qcyIsIm5vZGVfbW9kdWxlcy9AamlhbWluZ2hpL3RyYW5zaXRpb24vbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwNEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwidmFyIENSZW5kZXIgPSByZXF1aXJlKCcuLi9saWIvaW5kZXgnKVxuXG53aW5kb3cuQ1JlbmRlciA9IENSZW5kZXIiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHRcIik7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2RlZmluZVByb3BlcnR5XCIpKTtcblxudmFyIF90b0NvbnN1bWFibGVBcnJheTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5XCIpKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrXCIpKTtcblxudmFyIF9jb2xvciA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBqaWFtaW5naGkvY29sb3JcIikpO1xuXG52YXIgX2JlemllckN1cnZlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGppYW1pbmdoaS9iZXppZXItY3VydmVcIikpO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKFwiLi4vcGx1Z2luL3V0aWxcIik7XG5cbnZhciBfZ3JhcGhzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vY29uZmlnL2dyYXBoc1wiKSk7XG5cbnZhciBfZ3JhcGggPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2dyYXBoLmNsYXNzXCIpKTtcblxuZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7IHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTsgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHsgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7IGlmIChlbnVtZXJhYmxlT25seSkgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHsgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7IH0pOyBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7IH0gcmV0dXJuIGtleXM7IH1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXSAhPSBudWxsID8gYXJndW1lbnRzW2ldIDoge307IGlmIChpICUgMikgeyBvd25LZXlzKE9iamVjdChzb3VyY2UpLCB0cnVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgKDAsIF9kZWZpbmVQcm9wZXJ0eTJbXCJkZWZhdWx0XCJdKSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pOyB9KTsgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykgeyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpOyB9IGVsc2UgeyBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7IH0pOyB9IH0gcmV0dXJuIHRhcmdldDsgfVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiAgICAgICAgICAgQ2xhc3Mgb2YgQ1JlbmRlclxuICogQHBhcmFtIHtPYmplY3R9IGNhbnZhcyBDYW52YXMgRE9NXG4gKiBAcmV0dXJuIHtDUmVuZGVyfSAgICAgIEluc3RhbmNlIG9mIENSZW5kZXJcbiAqL1xudmFyIENSZW5kZXIgPSBmdW5jdGlvbiBDUmVuZGVyKGNhbnZhcykge1xuICAoMCwgX2NsYXNzQ2FsbENoZWNrMltcImRlZmF1bHRcIl0pKHRoaXMsIENSZW5kZXIpO1xuXG4gIGlmICghY2FudmFzKSB7XG4gICAgY29uc29sZS5lcnJvcignQ1JlbmRlciBNaXNzaW5nIHBhcmFtZXRlcnMhJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICB2YXIgY2xpZW50V2lkdGggPSBjYW52YXMuY2xpZW50V2lkdGgsXG4gICAgICBjbGllbnRIZWlnaHQgPSBjYW52YXMuY2xpZW50SGVpZ2h0O1xuICB2YXIgYXJlYSA9IFtjbGllbnRXaWR0aCwgY2xpZW50SGVpZ2h0XTtcbiAgY2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBjbGllbnRXaWR0aCk7XG4gIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGNsaWVudEhlaWdodCk7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gQ29udGV4dCBvZiB0aGUgY2FudmFzXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBleGFtcGxlIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAqL1xuXG4gIHRoaXMuY3R4ID0gY3R4O1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGNhbnZhc1xuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqIEBleGFtcGxlIGFyZWEgPSBbMzAw77yMMTAwXVxuICAgKi9cblxuICB0aGlzLmFyZWEgPSBhcmVhO1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFdoZXRoZXIgcmVuZGVyIGlzIGluIGFuaW1hdGlvbiByZW5kZXJpbmdcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBleGFtcGxlIGFuaW1hdGlvblN0YXR1cyA9IHRydWV8ZmFsc2VcbiAgICovXG5cbiAgdGhpcy5hbmltYXRpb25TdGF0dXMgPSBmYWxzZTtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBBZGRlZCBncmFwaFxuICAgKiBAdHlwZSB7W0dyYXBoXX1cbiAgICogQGV4YW1wbGUgZ3JhcGhzID0gW0dyYXBoLCBHcmFwaCwgLi4uXVxuICAgKi9cblxuICB0aGlzLmdyYXBocyA9IFtdO1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIENvbG9yIHBsdWdpblxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vamlhbWluZzc0My9jb2xvclxuICAgKi9cblxuICB0aGlzLmNvbG9yID0gX2NvbG9yW1wiZGVmYXVsdFwiXTtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBCZXppZXIgQ3VydmUgcGx1Z2luXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9qaWFtaW5nNzQzL0JlemllckN1cnZlXG4gICAqL1xuXG4gIHRoaXMuYmV6aWVyQ3VydmUgPSBfYmV6aWVyQ3VydmVbXCJkZWZhdWx0XCJdOyAvLyBiaW5kIGV2ZW50IGhhbmRsZXJcblxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duLmJpbmQodGhpcykpO1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlLmJpbmQodGhpcykpO1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXAuYmluZCh0aGlzKSk7XG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gICAgICAgIENsZWFyIGNhbnZhcyBkcmF3aW5nIGFyZWFcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH0gVm9pZFxuICovXG5cblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBDUmVuZGVyO1xuXG5DUmVuZGVyLnByb3RvdHlwZS5jbGVhckFyZWEgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBfdGhpcyRjdHg7XG5cbiAgdmFyIGFyZWEgPSB0aGlzLmFyZWE7XG5cbiAgKF90aGlzJGN0eCA9IHRoaXMuY3R4KS5jbGVhclJlY3QuYXBwbHkoX3RoaXMkY3R4LCBbMCwgMF0uY29uY2F0KCgwLCBfdG9Db25zdW1hYmxlQXJyYXkyW1wiZGVmYXVsdFwiXSkoYXJlYSkpKTtcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiAgICAgICAgICAgQWRkIGdyYXBoIHRvIHJlbmRlclxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBHcmFwaCBjb25maWd1cmF0aW9uXG4gKiBAcmV0dXJuIHtHcmFwaH0gICAgICAgIEdyYXBoIGluc3RhbmNlXG4gKi9cblxuXG5DUmVuZGVyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjb25maWcgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICB2YXIgbmFtZSA9IGNvbmZpZy5uYW1lO1xuXG4gIGlmICghbmFtZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2FkZCBNaXNzaW5nIHBhcmFtZXRlcnMhJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGdyYXBoQ29uZmlnID0gX2dyYXBoc1tcImRlZmF1bHRcIl0uZ2V0KG5hbWUpO1xuXG4gIGlmICghZ3JhcGhDb25maWcpIHtcbiAgICBjb25zb2xlLndhcm4oJ05vIGNvcnJlc3BvbmRpbmcgZ3JhcGggY29uZmlndXJhdGlvbiBmb3VuZCEnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgZ3JhcGggPSBuZXcgX2dyYXBoW1wiZGVmYXVsdFwiXShncmFwaENvbmZpZywgY29uZmlnKTtcbiAgaWYgKCFncmFwaC52YWxpZGF0b3IoZ3JhcGgpKSByZXR1cm47XG4gIGdyYXBoLnJlbmRlciA9IHRoaXM7XG4gIHRoaXMuZ3JhcGhzLnB1c2goZ3JhcGgpO1xuICB0aGlzLnNvcnRHcmFwaHNCeUluZGV4KCk7XG4gIHRoaXMuZHJhd0FsbEdyYXBoKCk7XG4gIHJldHVybiBncmFwaDtcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBTb3J0IHRoZSBncmFwaCBieSBpbmRleFxuICogQHJldHVybiB7VW5kZWZpbmVkfSBWb2lkXG4gKi9cblxuXG5DUmVuZGVyLnByb3RvdHlwZS5zb3J0R3JhcGhzQnlJbmRleCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGdyYXBocyA9IHRoaXMuZ3JhcGhzO1xuICBncmFwaHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIGlmIChhLmluZGV4ID4gYi5pbmRleCkgcmV0dXJuIDE7XG4gICAgaWYgKGEuaW5kZXggPT09IGIuaW5kZXgpIHJldHVybiAwO1xuICAgIGlmIChhLmluZGV4IDwgYi5pbmRleCkgcmV0dXJuIC0xO1xuICB9KTtcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiAgICAgICAgIERlbGV0ZSBncmFwaCBpbiByZW5kZXJcbiAqIEBwYXJhbSB7R3JhcGh9IGdyYXBoIFRoZSBncmFwaCB0byBiZSBkZWxldGVkXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9ICBWb2lkXG4gKi9cblxuXG5DUmVuZGVyLnByb3RvdHlwZS5kZWxHcmFwaCA9IGZ1bmN0aW9uIChncmFwaCkge1xuICBpZiAodHlwZW9mIGdyYXBoLmRlbFByb2Nlc3NvciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuICBncmFwaC5kZWxQcm9jZXNzb3IodGhpcyk7XG4gIHRoaXMuZ3JhcGhzID0gdGhpcy5ncmFwaHMuZmlsdGVyKGZ1bmN0aW9uIChncmFwaCkge1xuICAgIHJldHVybiBncmFwaDtcbiAgfSk7XG4gIHRoaXMuZHJhd0FsbEdyYXBoKCk7XG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gICAgICAgIERlbGV0ZSBhbGwgZ3JhcGggaW4gcmVuZGVyXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9IFZvaWRcbiAqL1xuXG5cbkNSZW5kZXIucHJvdG90eXBlLmRlbEFsbEdyYXBoID0gZnVuY3Rpb24gKCkge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIHRoaXMuZ3JhcGhzLmZvckVhY2goZnVuY3Rpb24gKGdyYXBoKSB7XG4gICAgcmV0dXJuIGdyYXBoLmRlbFByb2Nlc3NvcihfdGhpcyk7XG4gIH0pO1xuICB0aGlzLmdyYXBocyA9IHRoaXMuZ3JhcGhzLmZpbHRlcihmdW5jdGlvbiAoZ3JhcGgpIHtcbiAgICByZXR1cm4gZ3JhcGg7XG4gIH0pO1xuICB0aGlzLmRyYXdBbGxHcmFwaCgpO1xufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uICAgICAgICBEcmF3IGFsbCB0aGUgZ3JhcGhzIGluIHRoZSByZW5kZXJcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH0gVm9pZFxuICovXG5cblxuQ1JlbmRlci5wcm90b3R5cGUuZHJhd0FsbEdyYXBoID0gZnVuY3Rpb24gKCkge1xuICB2YXIgX3RoaXMyID0gdGhpcztcblxuICB0aGlzLmNsZWFyQXJlYSgpO1xuICB0aGlzLmdyYXBocy5maWx0ZXIoZnVuY3Rpb24gKGdyYXBoKSB7XG4gICAgcmV0dXJuIGdyYXBoICYmIGdyYXBoLnZpc2libGU7XG4gIH0pLmZvckVhY2goZnVuY3Rpb24gKGdyYXBoKSB7XG4gICAgcmV0dXJuIGdyYXBoLmRyYXdQcm9jZXNzb3IoX3RoaXMyLCBncmFwaCk7XG4gIH0pO1xufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uICAgICAgQW5pbWF0ZSB0aGUgZ3JhcGggd2hvc2UgYW5pbWF0aW9uIHF1ZXVlIGlzIG5vdCBlbXB0eVxuICogICAgICAgICAgICAgICAgICAgYW5kIHRoZSBhbmltYXRpb25QYXVzZSBpcyBlcXVhbCB0byBmYWxzZVxuICogQHJldHVybiB7UHJvbWlzZX0gQW5pbWF0aW9uIFByb21pc2VcbiAqL1xuXG5cbkNSZW5kZXIucHJvdG90eXBlLmxhdW5jaEFuaW1hdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgdmFyIGFuaW1hdGlvblN0YXR1cyA9IHRoaXMuYW5pbWF0aW9uU3RhdHVzO1xuICBpZiAoYW5pbWF0aW9uU3RhdHVzKSByZXR1cm47XG4gIHRoaXMuYW5pbWF0aW9uU3RhdHVzID0gdHJ1ZTtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgYW5pbWF0aW9uLmNhbGwoX3RoaXMzLCBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpczMuYW5pbWF0aW9uU3RhdHVzID0gZmFsc2U7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSwgRGF0ZS5ub3coKSk7XG4gIH0pO1xufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIFRyeSB0byBhbmltYXRlIGV2ZXJ5IGdyYXBoXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBpbiBhbmltYXRpb24gZW5kXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZVN0YW1wICBUaW1lIHN0YW1wIG9mIGFuaW1hdGlvbiBzdGFydFxuICogQHJldHVybiB7VW5kZWZpbmVkfSBWb2lkXG4gKi9cblxuXG5mdW5jdGlvbiBhbmltYXRpb24oY2FsbGJhY2ssIHRpbWVTdGFtcCkge1xuICB2YXIgZ3JhcGhzID0gdGhpcy5ncmFwaHM7XG5cbiAgaWYgKCFhbmltYXRpb25BYmxlKGdyYXBocykpIHtcbiAgICBjYWxsYmFjaygpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGdyYXBocy5mb3JFYWNoKGZ1bmN0aW9uIChncmFwaCkge1xuICAgIHJldHVybiBncmFwaC50dXJuTmV4dEFuaW1hdGlvbkZyYW1lKHRpbWVTdGFtcCk7XG4gIH0pO1xuICB0aGlzLmRyYXdBbGxHcmFwaCgpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uLmJpbmQodGhpcywgY2FsbGJhY2ssIHRpbWVTdGFtcCkpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gRmluZCBpZiB0aGVyZSBhcmUgZ3JhcGggdGhhdCBjYW4gYmUgYW5pbWF0ZWRcbiAqIEBwYXJhbSB7W0dyYXBoXX0gZ3JhcGhzXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cblxuZnVuY3Rpb24gYW5pbWF0aW9uQWJsZShncmFwaHMpIHtcbiAgcmV0dXJuIGdyYXBocy5maW5kKGZ1bmN0aW9uIChncmFwaCkge1xuICAgIHJldHVybiAhZ3JhcGguYW5pbWF0aW9uUGF1c2UgJiYgZ3JhcGguYW5pbWF0aW9uRnJhbWVTdGF0ZS5sZW5ndGg7XG4gIH0pO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gSGFuZGxlciBvZiBDUmVuZGVyIG1vdXNlZG93biBldmVudFxuICogQHJldHVybiB7VW5kZWZpbmVkfSBWb2lkXG4gKi9cblxuXG5mdW5jdGlvbiBtb3VzZURvd24oZSkge1xuICB2YXIgZ3JhcGhzID0gdGhpcy5ncmFwaHM7XG4gIHZhciBob3ZlckdyYXBoID0gZ3JhcGhzLmZpbmQoZnVuY3Rpb24gKGdyYXBoKSB7XG4gICAgcmV0dXJuIGdyYXBoLnN0YXR1cyA9PT0gJ2hvdmVyJztcbiAgfSk7XG4gIGlmICghaG92ZXJHcmFwaCkgcmV0dXJuO1xuICBob3ZlckdyYXBoLnN0YXR1cyA9ICdhY3RpdmUnO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gSGFuZGxlciBvZiBDUmVuZGVyIG1vdXNlbW92ZSBldmVudFxuICogQHJldHVybiB7VW5kZWZpbmVkfSBWb2lkXG4gKi9cblxuXG5mdW5jdGlvbiBtb3VzZU1vdmUoZSkge1xuICB2YXIgb2Zmc2V0WCA9IGUub2Zmc2V0WCxcbiAgICAgIG9mZnNldFkgPSBlLm9mZnNldFk7XG4gIHZhciBwb3NpdGlvbiA9IFtvZmZzZXRYLCBvZmZzZXRZXTtcbiAgdmFyIGdyYXBocyA9IHRoaXMuZ3JhcGhzO1xuICB2YXIgYWN0aXZlR3JhcGggPSBncmFwaHMuZmluZChmdW5jdGlvbiAoZ3JhcGgpIHtcbiAgICByZXR1cm4gZ3JhcGguc3RhdHVzID09PSAnYWN0aXZlJyB8fCBncmFwaC5zdGF0dXMgPT09ICdkcmFnJztcbiAgfSk7XG5cbiAgaWYgKGFjdGl2ZUdyYXBoKSB7XG4gICAgaWYgKCFhY3RpdmVHcmFwaC5kcmFnKSByZXR1cm47XG5cbiAgICBpZiAodHlwZW9mIGFjdGl2ZUdyYXBoLm1vdmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vIG1vdmUgbWV0aG9kIGlzIHByb3ZpZGVkLCBjYW5ub3QgYmUgZHJhZ2dlZCEnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhY3RpdmVHcmFwaC5tb3ZlUHJvY2Vzc29yKGUpO1xuICAgIGFjdGl2ZUdyYXBoLnN0YXR1cyA9ICdkcmFnJztcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgaG92ZXJHcmFwaCA9IGdyYXBocy5maW5kKGZ1bmN0aW9uIChncmFwaCkge1xuICAgIHJldHVybiBncmFwaC5zdGF0dXMgPT09ICdob3Zlcic7XG4gIH0pO1xuICB2YXIgaG92ZXJBYmxlR3JhcGhzID0gZ3JhcGhzLmZpbHRlcihmdW5jdGlvbiAoZ3JhcGgpIHtcbiAgICByZXR1cm4gZ3JhcGguaG92ZXIgJiYgKHR5cGVvZiBncmFwaC5ob3ZlckNoZWNrID09PSAnZnVuY3Rpb24nIHx8IGdyYXBoLmhvdmVyUmVjdCk7XG4gIH0pO1xuICB2YXIgaG92ZXJlZEdyYXBoID0gaG92ZXJBYmxlR3JhcGhzLmZpbmQoZnVuY3Rpb24gKGdyYXBoKSB7XG4gICAgcmV0dXJuIGdyYXBoLmhvdmVyQ2hlY2tQcm9jZXNzb3IocG9zaXRpb24sIGdyYXBoKTtcbiAgfSk7XG5cbiAgaWYgKGhvdmVyZWRHcmFwaCkge1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gaG92ZXJlZEdyYXBoLnN0eWxlLmhvdmVyQ3Vyc29yO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xuICB9XG5cbiAgdmFyIGhvdmVyR3JhcGhNb3VzZU91dGVySXNGdW4gPSBmYWxzZSxcbiAgICAgIGhvdmVyZWRHcmFwaE1vdXNlRW50ZXJJc0Z1biA9IGZhbHNlO1xuICBpZiAoaG92ZXJHcmFwaCkgaG92ZXJHcmFwaE1vdXNlT3V0ZXJJc0Z1biA9IHR5cGVvZiBob3ZlckdyYXBoLm1vdXNlT3V0ZXIgPT09ICdmdW5jdGlvbic7XG4gIGlmIChob3ZlcmVkR3JhcGgpIGhvdmVyZWRHcmFwaE1vdXNlRW50ZXJJc0Z1biA9IHR5cGVvZiBob3ZlcmVkR3JhcGgubW91c2VFbnRlciA9PT0gJ2Z1bmN0aW9uJztcbiAgaWYgKCFob3ZlcmVkR3JhcGggJiYgIWhvdmVyR3JhcGgpIHJldHVybjtcblxuICBpZiAoIWhvdmVyZWRHcmFwaCAmJiBob3ZlckdyYXBoKSB7XG4gICAgaWYgKGhvdmVyR3JhcGhNb3VzZU91dGVySXNGdW4pIGhvdmVyR3JhcGgubW91c2VPdXRlcihlLCBob3ZlckdyYXBoKTtcbiAgICBob3ZlckdyYXBoLnN0YXR1cyA9ICdzdGF0aWMnO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChob3ZlcmVkR3JhcGggJiYgaG92ZXJlZEdyYXBoID09PSBob3ZlckdyYXBoKSByZXR1cm47XG5cbiAgaWYgKGhvdmVyZWRHcmFwaCAmJiAhaG92ZXJHcmFwaCkge1xuICAgIGlmIChob3ZlcmVkR3JhcGhNb3VzZUVudGVySXNGdW4pIGhvdmVyZWRHcmFwaC5tb3VzZUVudGVyKGUsIGhvdmVyZWRHcmFwaCk7XG4gICAgaG92ZXJlZEdyYXBoLnN0YXR1cyA9ICdob3Zlcic7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGhvdmVyZWRHcmFwaCAmJiBob3ZlckdyYXBoICYmIGhvdmVyZWRHcmFwaCAhPT0gaG92ZXJHcmFwaCkge1xuICAgIGlmIChob3ZlckdyYXBoTW91c2VPdXRlcklzRnVuKSBob3ZlckdyYXBoLm1vdXNlT3V0ZXIoZSwgaG92ZXJHcmFwaCk7XG4gICAgaG92ZXJHcmFwaC5zdGF0dXMgPSAnc3RhdGljJztcbiAgICBpZiAoaG92ZXJlZEdyYXBoTW91c2VFbnRlcklzRnVuKSBob3ZlcmVkR3JhcGgubW91c2VFbnRlcihlLCBob3ZlcmVkR3JhcGgpO1xuICAgIGhvdmVyZWRHcmFwaC5zdGF0dXMgPSAnaG92ZXInO1xuICB9XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBIYW5kbGVyIG9mIENSZW5kZXIgbW91c2V1cCBldmVudFxuICogQHJldHVybiB7VW5kZWZpbmVkfSBWb2lkXG4gKi9cblxuXG5mdW5jdGlvbiBtb3VzZVVwKGUpIHtcbiAgdmFyIGdyYXBocyA9IHRoaXMuZ3JhcGhzO1xuICB2YXIgYWN0aXZlR3JhcGggPSBncmFwaHMuZmluZChmdW5jdGlvbiAoZ3JhcGgpIHtcbiAgICByZXR1cm4gZ3JhcGguc3RhdHVzID09PSAnYWN0aXZlJztcbiAgfSk7XG4gIHZhciBkcmFnR3JhcGggPSBncmFwaHMuZmluZChmdW5jdGlvbiAoZ3JhcGgpIHtcbiAgICByZXR1cm4gZ3JhcGguc3RhdHVzID09PSAnZHJhZyc7XG4gIH0pO1xuICBpZiAoYWN0aXZlR3JhcGggJiYgdHlwZW9mIGFjdGl2ZUdyYXBoLmNsaWNrID09PSAnZnVuY3Rpb24nKSBhY3RpdmVHcmFwaC5jbGljayhlLCBhY3RpdmVHcmFwaCk7XG4gIGdyYXBocy5mb3JFYWNoKGZ1bmN0aW9uIChncmFwaCkge1xuICAgIHJldHVybiBncmFwaCAmJiAoZ3JhcGguc3RhdHVzID0gJ3N0YXRpYycpO1xuICB9KTtcbiAgaWYgKGFjdGl2ZUdyYXBoKSBhY3RpdmVHcmFwaC5zdGF0dXMgPSAnaG92ZXInO1xuICBpZiAoZHJhZ0dyYXBoKSBkcmFnR3JhcGguc3RhdHVzID0gJ2hvdmVyJztcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uICAgICAgICAgQ2xvbmUgR3JhcGhcbiAqIEBwYXJhbSB7R3JhcGh9IGdyYXBoIFRoZSB0YXJnZXQgdG8gYmUgY2xvbmVkXG4gKiBAcmV0dXJuIHtHcmFwaH0gICAgICBDbG9uZWQgZ3JhcGhcbiAqL1xuXG5cbkNSZW5kZXIucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKGdyYXBoKSB7XG4gIHZhciBzdHlsZSA9IGdyYXBoLnN0eWxlLmdldFN0eWxlKCk7XG5cbiAgdmFyIGNsb25lZEdyYXBoID0gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBncmFwaCksIHt9LCB7XG4gICAgc3R5bGU6IHN0eWxlXG4gIH0pO1xuXG4gIGRlbGV0ZSBjbG9uZWRHcmFwaC5yZW5kZXI7XG4gIGNsb25lZEdyYXBoID0gKDAsIF91dGlsLmRlZXBDbG9uZSkoY2xvbmVkR3JhcGgsIHRydWUpO1xuICByZXR1cm4gdGhpcy5hZGQoY2xvbmVkR3JhcGgpO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHRcIik7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9yZWdlbmVyYXRvciA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL3JlZ2VuZXJhdG9yXCIpKTtcblxudmFyIF9hc3luY1RvR2VuZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXN5bmNUb0dlbmVyYXRvclwiKSk7XG5cbnZhciBfdHlwZW9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvdHlwZW9mXCIpKTtcblxudmFyIF90b0NvbnN1bWFibGVBcnJheTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5XCIpKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrXCIpKTtcblxudmFyIF9zdHlsZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vc3R5bGUuY2xhc3NcIikpO1xuXG52YXIgX3RyYW5zaXRpb24gPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAamlhbWluZ2hpL3RyYW5zaXRpb25cIikpO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKFwiLi4vcGx1Z2luL3V0aWxcIik7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIENsYXNzIEdyYXBoXG4gKiBAcGFyYW0ge09iamVjdH0gZ3JhcGggIEdyYXBoIGRlZmF1bHQgY29uZmlndXJhdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBHcmFwaCBjb25maWdcbiAqIEByZXR1cm4ge0dyYXBofSBJbnN0YW5jZSBvZiBHcmFwaFxuICovXG52YXIgR3JhcGggPSBmdW5jdGlvbiBHcmFwaChncmFwaCwgY29uZmlnKSB7XG4gICgwLCBfY2xhc3NDYWxsQ2hlY2syW1wiZGVmYXVsdFwiXSkodGhpcywgR3JhcGgpO1xuICBjb25maWcgPSAoMCwgX3V0aWwuZGVlcENsb25lKShjb25maWcsIHRydWUpO1xuICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gV2VhdGhlciB0byByZW5kZXIgZ3JhcGhcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAZGVmYXVsdCB2aXNpYmxlID0gdHJ1ZVxuICAgICAqL1xuICAgIHZpc2libGU6IHRydWUsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gV2hldGhlciB0byBlbmFibGUgZHJhZ1xuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBkZWZhdWx0IGRyYWcgPSBmYWxzZVxuICAgICAqL1xuICAgIGRyYWc6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFdoZXRoZXIgdG8gZW5hYmxlIGhvdmVyXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQGRlZmF1bHQgaG92ZXIgPSBmYWxzZVxuICAgICAqL1xuICAgIGhvdmVyOiBmYWxzZSxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHcmFwaCByZW5kZXJpbmcgaW5kZXhcbiAgICAgKiAgR2l2ZSBwcmlvcml0eSB0byBpbmRleCBoaWdoIGdyYXBoIGluIHJlbmRlcmluZ1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQGV4YW1wbGUgaW5kZXggPSAxXG4gICAgICovXG4gICAgaW5kZXg6IDEsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQW5pbWF0aW9uIGRlbGF5IHRpbWUobXMpXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCBhbmltYXRpb25EZWxheSA9IDBcbiAgICAgKi9cbiAgICBhbmltYXRpb25EZWxheTogMCxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBOdW1iZXIgb2YgYW5pbWF0aW9uIGZyYW1lc1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQGRlZmF1bHQgYW5pbWF0aW9uRnJhbWUgPSAzMFxuICAgICAqL1xuICAgIGFuaW1hdGlvbkZyYW1lOiAzMCxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBBbmltYXRpb24gZHluYW1pYyBjdXJ2ZSAoU3VwcG9ydGVkIGJ5IHRyYW5zaXRpb24pXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBhbmltYXRpb25DdXJ2ZSA9ICdsaW5lYXInXG4gICAgICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2ppYW1pbmc3NDMvVHJhbnNpdGlvblxuICAgICAqL1xuICAgIGFuaW1hdGlvbkN1cnZlOiAnbGluZWFyJyxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBXZWF0aGVyIHRvIHBhdXNlIGdyYXBoIGFuaW1hdGlvblxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBkZWZhdWx0IGFuaW1hdGlvblBhdXNlID0gZmFsc2VcbiAgICAgKi9cbiAgICBhbmltYXRpb25QYXVzZTogZmFsc2UsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmVjdGFuZ3VsYXIgaG92ZXIgZGV0ZWN0aW9uIHpvbmVcbiAgICAgKiAgVXNlIHRoaXMgbWV0aG9kIGZvciBob3ZlciBkZXRlY3Rpb24gZmlyc3RcbiAgICAgKiBAdHlwZSB7TnVsbHxBcnJheX1cbiAgICAgKiBAZGVmYXVsdCBob3ZlclJlY3QgPSBudWxsXG4gICAgICogQGV4YW1wbGUgaG92ZXJSZWN0ID0gWzAsIDAsIDEwMCwgMTAwXSAvLyBbUmVjdCBzdGFydCB4LCB5LCBSZWN0IHdpZHRoLCBoZWlnaHRdXG4gICAgICovXG4gICAgaG92ZXJSZWN0OiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIE1vdXNlIGVudGVyIGV2ZW50IGhhbmRsZXJcbiAgICAgKiBAdHlwZSB7RnVuY3Rpb258TnVsbH1cbiAgICAgKiBAZGVmYXVsdCBtb3VzZUVudGVyID0gbnVsbFxuICAgICAqL1xuICAgIG1vdXNlRW50ZXI6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTW91c2Ugb3V0ZXIgZXZlbnQgaGFuZGxlclxuICAgICAqIEB0eXBlIHtGdW5jdGlvbnxOdWxsfVxuICAgICAqIEBkZWZhdWx0IG1vdXNlT3V0ZXIgPSBudWxsXG4gICAgICovXG4gICAgbW91c2VPdXRlcjogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBNb3VzZSBjbGljayBldmVudCBoYW5kbGVyXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufE51bGx9XG4gICAgICogQGRlZmF1bHQgY2xpY2sgPSBudWxsXG4gICAgICovXG4gICAgY2xpY2s6IG51bGxcbiAgfTtcbiAgdmFyIGNvbmZpZ0FibGVOb3QgPSB7XG4gICAgc3RhdHVzOiAnc3RhdGljJyxcbiAgICBhbmltYXRpb25Sb290OiBbXSxcbiAgICBhbmltYXRpb25LZXlzOiBbXSxcbiAgICBhbmltYXRpb25GcmFtZVN0YXRlOiBbXSxcbiAgICBjYWNoZToge31cbiAgfTtcbiAgaWYgKCFjb25maWcuc2hhcGUpIGNvbmZpZy5zaGFwZSA9IHt9O1xuICBpZiAoIWNvbmZpZy5zdHlsZSkgY29uZmlnLnN0eWxlID0ge307XG4gIHZhciBzaGFwZSA9IE9iamVjdC5hc3NpZ24oe30sIGdyYXBoLnNoYXBlLCBjb25maWcuc2hhcGUpO1xuICBPYmplY3QuYXNzaWduKGRlZmF1bHRDb25maWcsIGNvbmZpZywgY29uZmlnQWJsZU5vdCk7XG4gIE9iamVjdC5hc3NpZ24odGhpcywgZ3JhcGgsIGRlZmF1bHRDb25maWcpO1xuICB0aGlzLnNoYXBlID0gc2hhcGU7XG4gIHRoaXMuc3R5bGUgPSBuZXcgX3N0eWxlW1wiZGVmYXVsdFwiXShjb25maWcuc3R5bGUpO1xuICB0aGlzLmFkZGVkUHJvY2Vzc29yKCk7XG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gUHJvY2Vzc29yIG9mIGFkZGVkXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9IFZvaWRcbiAqL1xuXG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gR3JhcGg7XG5cbkdyYXBoLnByb3RvdHlwZS5hZGRlZFByb2Nlc3NvciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiB0aGlzLnNldEdyYXBoQ2VudGVyID09PSAnZnVuY3Rpb24nKSB0aGlzLnNldEdyYXBoQ2VudGVyKG51bGwsIHRoaXMpOyAvLyBUaGUgbGlmZSBjeWNsZSAnYWRkZWRcIlxuXG4gIGlmICh0eXBlb2YgdGhpcy5hZGRlZCA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5hZGRlZCh0aGlzKTtcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBQcm9jZXNzb3Igb2YgZHJhd1xuICogQHBhcmFtIHtDUmVuZGVyfSByZW5kZXIgSW5zdGFuY2Ugb2YgQ1JlbmRlclxuICogQHBhcmFtIHtHcmFwaH0gZ3JhcGggICAgSW5zdGFuY2Ugb2YgR3JhcGhcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH0gVm9pZFxuICovXG5cblxuR3JhcGgucHJvdG90eXBlLmRyYXdQcm9jZXNzb3IgPSBmdW5jdGlvbiAocmVuZGVyLCBncmFwaCkge1xuICB2YXIgY3R4ID0gcmVuZGVyLmN0eDtcbiAgZ3JhcGguc3R5bGUuaW5pdFN0eWxlKGN0eCk7XG4gIGlmICh0eXBlb2YgdGhpcy5iZWZvcmVEcmF3ID09PSAnZnVuY3Rpb24nKSB0aGlzLmJlZm9yZURyYXcodGhpcywgcmVuZGVyKTtcbiAgZ3JhcGguZHJhdyhyZW5kZXIsIGdyYXBoKTtcbiAgaWYgKHR5cGVvZiB0aGlzLmRyYXdlZCA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5kcmF3ZWQodGhpcywgcmVuZGVyKTtcbiAgZ3JhcGguc3R5bGUucmVzdG9yZVRyYW5zZm9ybShjdHgpO1xufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIFByb2Nlc3NvciBvZiBob3ZlciBjaGVja1xuICogQHBhcmFtIHtBcnJheX0gcG9zaXRpb24gTW91c2UgUG9zaXRpb25cbiAqIEBwYXJhbSB7R3JhcGh9IGdyYXBoICAgIEluc3RhbmNlIG9mIEdyYXBoXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXN1bHQgb2YgaG92ZXIgY2hlY2tcbiAqL1xuXG5cbkdyYXBoLnByb3RvdHlwZS5ob3ZlckNoZWNrUHJvY2Vzc29yID0gZnVuY3Rpb24gKHBvc2l0aW9uLCBfcmVmKSB7XG4gIHZhciBob3ZlclJlY3QgPSBfcmVmLmhvdmVyUmVjdCxcbiAgICAgIHN0eWxlID0gX3JlZi5zdHlsZSxcbiAgICAgIGhvdmVyQ2hlY2sgPSBfcmVmLmhvdmVyQ2hlY2s7XG4gIHZhciBncmFwaENlbnRlciA9IHN0eWxlLmdyYXBoQ2VudGVyLFxuICAgICAgcm90YXRlID0gc3R5bGUucm90YXRlLFxuICAgICAgc2NhbGUgPSBzdHlsZS5zY2FsZSxcbiAgICAgIHRyYW5zbGF0ZSA9IHN0eWxlLnRyYW5zbGF0ZTtcblxuICBpZiAoZ3JhcGhDZW50ZXIpIHtcbiAgICBpZiAocm90YXRlKSBwb3NpdGlvbiA9ICgwLCBfdXRpbC5nZXRSb3RhdGVQb2ludFBvcykoLXJvdGF0ZSwgcG9zaXRpb24sIGdyYXBoQ2VudGVyKTtcbiAgICBpZiAoc2NhbGUpIHBvc2l0aW9uID0gKDAsIF91dGlsLmdldFNjYWxlUG9pbnRQb3MpKHNjYWxlLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIDEgLyBzO1xuICAgIH0pLCBwb3NpdGlvbiwgZ3JhcGhDZW50ZXIpO1xuICAgIGlmICh0cmFuc2xhdGUpIHBvc2l0aW9uID0gKDAsIF91dGlsLmdldFRyYW5zbGF0ZVBvaW50UG9zKSh0cmFuc2xhdGUubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgICByZXR1cm4gdiAqIC0xO1xuICAgIH0pLCBwb3NpdGlvbik7XG4gIH1cblxuICBjb25zb2xlLmxvZygnaG92ZXJSZWN0ID0gJywgaG92ZXJSZWN0KTtcbiAgaWYgKGhvdmVyUmVjdCkgcmV0dXJuIF91dGlsLmNoZWNrUG9pbnRJc0luUmVjdC5hcHBseSh2b2lkIDAsIFtwb3NpdGlvbl0uY29uY2F0KCgwLCBfdG9Db25zdW1hYmxlQXJyYXkyW1wiZGVmYXVsdFwiXSkoaG92ZXJSZWN0KSkpO1xuICByZXR1cm4gaG92ZXJDaGVjayhwb3NpdGlvbiwgdGhpcyk7XG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gUHJvY2Vzc29yIG9mIG1vdmVcbiAqIEBwYXJhbSB7RXZlbnR9IGUgTW91c2UgbW92ZW1lbnQgZXZlbnRcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH0gVm9pZFxuICovXG5cblxuR3JhcGgucHJvdG90eXBlLm1vdmVQcm9jZXNzb3IgPSBmdW5jdGlvbiAoZSkge1xuICB0aGlzLm1vdmUoZSwgdGhpcyk7XG4gIGlmICh0eXBlb2YgdGhpcy5iZWZvcmVNb3ZlID09PSAnZnVuY3Rpb24nKSB0aGlzLmJlZm9yZU1vdmUoZSwgdGhpcyk7XG4gIGlmICh0eXBlb2YgdGhpcy5zZXRHcmFwaENlbnRlciA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5zZXRHcmFwaENlbnRlcihlLCB0aGlzKTtcbiAgaWYgKHR5cGVvZiB0aGlzLm1vdmVkID09PSAnZnVuY3Rpb24nKSB0aGlzLm1vdmVkKGUsIHRoaXMpO1xufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIFVwZGF0ZSBncmFwaCBzdGF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJOYW1lIFVwZGF0ZWQgYXR0cmlidXRlIG5hbWVcbiAqIEBwYXJhbSB7QW55fSBjaGFuZ2UgICAgICBVcGRhdGVkIHZhbHVlXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9IFZvaWRcbiAqL1xuXG5cbkdyYXBoLnByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24gKGF0dHJOYW1lKSB7XG4gIHZhciBjaGFuZ2UgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgaWYgKCFhdHRyTmFtZSB8fCBjaGFuZ2UgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICB2YXIgaXNPYmplY3QgPSAoMCwgX3R5cGVvZjJbXCJkZWZhdWx0XCJdKSh0aGlzW2F0dHJOYW1lXSkgPT09ICdvYmplY3QnO1xuICBpZiAoaXNPYmplY3QpIGNoYW5nZSA9ICgwLCBfdXRpbC5kZWVwQ2xvbmUpKGNoYW5nZSwgdHJ1ZSk7XG4gIHZhciByZW5kZXIgPSB0aGlzLnJlbmRlcjtcblxuICBpZiAoYXR0ck5hbWUgPT09ICdzdHlsZScpIHtcbiAgICB0aGlzLnN0eWxlLnVwZGF0ZShjaGFuZ2UpO1xuICB9IGVsc2UgaWYgKGlzT2JqZWN0KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzW2F0dHJOYW1lXSwgY2hhbmdlKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzW2F0dHJOYW1lXSA9IGNoYW5nZTtcbiAgfVxuXG4gIGlmIChhdHRyTmFtZSA9PT0gJ2luZGV4JykgcmVuZGVyLnNvcnRHcmFwaHNCeUluZGV4KCk7XG4gIHJlbmRlci5kcmF3QWxsR3JhcGgoKTtcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgZ3JhcGhpY3Mgc3RhdGUgKHdpdGggYW5pbWF0aW9uKVxuICogIE9ubHkgc2hhcGUgYW5kIHN0eWxlIGF0dHJpYnV0ZXMgYXJlIHN1cHBvcnRlZFxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJOYW1lIFVwZGF0ZWQgYXR0cmlidXRlIG5hbWVcbiAqIEBwYXJhbSB7QW55fSBjaGFuZ2UgICAgICBVcGRhdGVkIHZhbHVlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHdhaXQgICAgV2hldGhlciB0byBzdG9yZSB0aGUgYW5pbWF0aW9uIHdhaXRpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgdGhlIG5leHQgYW5pbWF0aW9uIHJlcXVlc3RcbiAqIEByZXR1cm4ge1Byb21pc2V9IEFuaW1hdGlvbiBQcm9taXNlXG4gKi9cblxuXG5HcmFwaC5wcm90b3R5cGUuYW5pbWF0aW9uID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgdmFyIF9yZWYyID0gKDAsIF9hc3luY1RvR2VuZXJhdG9yMltcImRlZmF1bHRcIl0pKCAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yW1wiZGVmYXVsdFwiXS5tYXJrKGZ1bmN0aW9uIF9jYWxsZWUyKGF0dHJOYW1lLCBjaGFuZ2UpIHtcbiAgICB2YXIgd2FpdCxcbiAgICAgICAgY2hhbmdlUm9vdCxcbiAgICAgICAgY2hhbmdlS2V5cyxcbiAgICAgICAgYmVmb3JlU3RhdGUsXG4gICAgICAgIGFuaW1hdGlvbkZyYW1lLFxuICAgICAgICBhbmltYXRpb25DdXJ2ZSxcbiAgICAgICAgYW5pbWF0aW9uRGVsYXksXG4gICAgICAgIGFuaW1hdGlvbkZyYW1lU3RhdGUsXG4gICAgICAgIHJlbmRlcixcbiAgICAgICAgX2FyZ3MyID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBfcmVnZW5lcmF0b3JbXCJkZWZhdWx0XCJdLndyYXAoZnVuY3Rpb24gX2NhbGxlZTIkKF9jb250ZXh0Mikge1xuICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgc3dpdGNoIChfY29udGV4dDIucHJldiA9IF9jb250ZXh0Mi5uZXh0KSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgd2FpdCA9IF9hcmdzMi5sZW5ndGggPiAyICYmIF9hcmdzMlsyXSAhPT0gdW5kZWZpbmVkID8gX2FyZ3MyWzJdIDogZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICghKGF0dHJOYW1lICE9PSAnc2hhcGUnICYmIGF0dHJOYW1lICE9PSAnc3R5bGUnKSkge1xuICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdPbmx5IHN1cHBvcnRlZCBzaGFwZSBhbmQgc3R5bGUgYW5pbWF0aW9uIScpO1xuICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Mi5hYnJ1cHQoXCJyZXR1cm5cIik7XG5cbiAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBjaGFuZ2UgPSAoMCwgX3V0aWwuZGVlcENsb25lKShjaGFuZ2UsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGF0dHJOYW1lID09PSAnc3R5bGUnKSB0aGlzLnN0eWxlLmNvbG9yUHJvY2Vzc29yKGNoYW5nZSk7XG4gICAgICAgICAgICBjaGFuZ2VSb290ID0gdGhpc1thdHRyTmFtZV07XG4gICAgICAgICAgICBjaGFuZ2VLZXlzID0gT2JqZWN0LmtleXMoY2hhbmdlKTtcbiAgICAgICAgICAgIGJlZm9yZVN0YXRlID0ge307XG4gICAgICAgICAgICBjaGFuZ2VLZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICByZXR1cm4gYmVmb3JlU3RhdGVba2V5XSA9IGNoYW5nZVJvb3Rba2V5XTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYW5pbWF0aW9uRnJhbWUgPSB0aGlzLmFuaW1hdGlvbkZyYW1lLCBhbmltYXRpb25DdXJ2ZSA9IHRoaXMuYW5pbWF0aW9uQ3VydmUsIGFuaW1hdGlvbkRlbGF5ID0gdGhpcy5hbmltYXRpb25EZWxheTtcbiAgICAgICAgICAgIGFuaW1hdGlvbkZyYW1lU3RhdGUgPSAoMCwgX3RyYW5zaXRpb25bXCJkZWZhdWx0XCJdKShhbmltYXRpb25DdXJ2ZSwgYmVmb3JlU3RhdGUsIGNoYW5nZSwgYW5pbWF0aW9uRnJhbWUsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25Sb290LnB1c2goY2hhbmdlUm9vdCk7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbktleXMucHVzaChjaGFuZ2VLZXlzKTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWVTdGF0ZS5wdXNoKGFuaW1hdGlvbkZyYW1lU3RhdGUpO1xuXG4gICAgICAgICAgICBpZiAoIXdhaXQpIHtcbiAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxNztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBfY29udGV4dDIuYWJydXB0KFwicmV0dXJuXCIpO1xuXG4gICAgICAgICAgY2FzZSAxNzpcbiAgICAgICAgICAgIGlmICghKGFuaW1hdGlvbkRlbGF5ID4gMCkpIHtcbiAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyMDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMjA7XG4gICAgICAgICAgICByZXR1cm4gZGVsYXkoYW5pbWF0aW9uRGVsYXkpO1xuXG4gICAgICAgICAgY2FzZSAyMDpcbiAgICAgICAgICAgIHJlbmRlciA9IHRoaXMucmVuZGVyO1xuICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Mi5hYnJ1cHQoXCJyZXR1cm5cIiwgbmV3IFByb21pc2UoIC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBfcmVmMyA9ICgwLCBfYXN5bmNUb0dlbmVyYXRvcjJbXCJkZWZhdWx0XCJdKSggLyojX19QVVJFX18qL19yZWdlbmVyYXRvcltcImRlZmF1bHRcIl0ubWFyayhmdW5jdGlvbiBfY2FsbGVlKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3JlZ2VuZXJhdG9yW1wiZGVmYXVsdFwiXS53cmFwKGZ1bmN0aW9uIF9jYWxsZWUkKF9jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0LnByZXYgPSBfY29udGV4dC5uZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyLmxhdW5jaEFuaW1hdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dC5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBfY2FsbGVlKTtcbiAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoX3gzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9yZWYzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KCkpKTtcblxuICAgICAgICAgIGNhc2UgMjI6XG4gICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Mi5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBfY2FsbGVlMiwgdGhpcyk7XG4gIH0pKTtcblxuICByZXR1cm4gZnVuY3Rpb24gKF94LCBfeDIpIHtcbiAgICByZXR1cm4gX3JlZjIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn0oKTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIEV4dHJhY3QgdGhlIG5leHQgZnJhbWUgb2YgZGF0YSBmcm9tIHRoZSBhbmltYXRpb24gcXVldWVcbiAqICAgICAgICAgICAgICBhbmQgdXBkYXRlIHRoZSBncmFwaCBzdGF0ZVxuICogQHJldHVybiB7VW5kZWZpbmVkfSBWb2lkXG4gKi9cblxuXG5HcmFwaC5wcm90b3R5cGUudHVybk5leHRBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uICh0aW1lU3RhbXApIHtcbiAgdmFyIGFuaW1hdGlvbkRlbGF5ID0gdGhpcy5hbmltYXRpb25EZWxheSxcbiAgICAgIGFuaW1hdGlvblJvb3QgPSB0aGlzLmFuaW1hdGlvblJvb3QsXG4gICAgICBhbmltYXRpb25LZXlzID0gdGhpcy5hbmltYXRpb25LZXlzLFxuICAgICAgYW5pbWF0aW9uRnJhbWVTdGF0ZSA9IHRoaXMuYW5pbWF0aW9uRnJhbWVTdGF0ZSxcbiAgICAgIGFuaW1hdGlvblBhdXNlID0gdGhpcy5hbmltYXRpb25QYXVzZTtcbiAgaWYgKGFuaW1hdGlvblBhdXNlKSByZXR1cm47XG4gIGlmIChEYXRlLm5vdygpIC0gdGltZVN0YW1wIDwgYW5pbWF0aW9uRGVsYXkpIHJldHVybjtcbiAgYW5pbWF0aW9uUm9vdC5mb3JFYWNoKGZ1bmN0aW9uIChyb290LCBpKSB7XG4gICAgYW5pbWF0aW9uS2V5c1tpXS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJvb3Rba2V5XSA9IGFuaW1hdGlvbkZyYW1lU3RhdGVbaV1bMF1ba2V5XTtcbiAgICB9KTtcbiAgfSk7XG4gIGFuaW1hdGlvbkZyYW1lU3RhdGUuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGVJdGVtLCBpKSB7XG4gICAgc3RhdGVJdGVtLnNoaWZ0KCk7XG4gICAgdmFyIG5vRnJhbWUgPSBzdGF0ZUl0ZW0ubGVuZ3RoID09PSAwO1xuICAgIGlmIChub0ZyYW1lKSBhbmltYXRpb25Sb290W2ldID0gbnVsbDtcbiAgICBpZiAobm9GcmFtZSkgYW5pbWF0aW9uS2V5c1tpXSA9IG51bGw7XG4gIH0pO1xuICB0aGlzLmFuaW1hdGlvbkZyYW1lU3RhdGUgPSBhbmltYXRpb25GcmFtZVN0YXRlLmZpbHRlcihmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICByZXR1cm4gc3RhdGUubGVuZ3RoO1xuICB9KTtcbiAgdGhpcy5hbmltYXRpb25Sb290ID0gYW5pbWF0aW9uUm9vdC5maWx0ZXIoZnVuY3Rpb24gKHJvb3QpIHtcbiAgICByZXR1cm4gcm9vdDtcbiAgfSk7XG4gIHRoaXMuYW5pbWF0aW9uS2V5cyA9IGFuaW1hdGlvbktleXMuZmlsdGVyKGZ1bmN0aW9uIChrZXlzKSB7XG4gICAgcmV0dXJuIGtleXM7XG4gIH0pO1xufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIFNraXAgdG8gdGhlIGxhc3QgZnJhbWUgb2YgYW5pbWF0aW9uXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9IFZvaWRcbiAqL1xuXG5cbkdyYXBoLnByb3RvdHlwZS5hbmltYXRpb25FbmQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBhbmltYXRpb25GcmFtZVN0YXRlID0gdGhpcy5hbmltYXRpb25GcmFtZVN0YXRlLFxuICAgICAgYW5pbWF0aW9uS2V5cyA9IHRoaXMuYW5pbWF0aW9uS2V5cyxcbiAgICAgIGFuaW1hdGlvblJvb3QgPSB0aGlzLmFuaW1hdGlvblJvb3QsXG4gICAgICByZW5kZXIgPSB0aGlzLnJlbmRlcjtcbiAgYW5pbWF0aW9uUm9vdC5mb3JFYWNoKGZ1bmN0aW9uIChyb290LCBpKSB7XG4gICAgdmFyIGN1cnJlbnRLZXlzID0gYW5pbWF0aW9uS2V5c1tpXTtcbiAgICB2YXIgbGFzdFN0YXRlID0gYW5pbWF0aW9uRnJhbWVTdGF0ZVtpXS5wb3AoKTtcbiAgICBjdXJyZW50S2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiByb290W2tleV0gPSBsYXN0U3RhdGVba2V5XTtcbiAgICB9KTtcbiAgfSk7XG4gIHRoaXMuYW5pbWF0aW9uRnJhbWVTdGF0ZSA9IFtdO1xuICB0aGlzLmFuaW1hdGlvbktleXMgPSBbXTtcbiAgdGhpcy5hbmltYXRpb25Sb290ID0gW107XG4gIHJldHVybiByZW5kZXIuZHJhd0FsbEdyYXBoKCk7XG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gUGF1c2UgYW5pbWF0aW9uIGJlaGF2aW9yXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9IFZvaWRcbiAqL1xuXG5cbkdyYXBoLnByb3RvdHlwZS5wYXVzZUFuaW1hdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5hdHRyKCdhbmltYXRpb25QYXVzZScsIHRydWUpO1xufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIFRyeSBhbmltYXRpb24gYmVoYXZpb3JcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH0gVm9pZFxuICovXG5cblxuR3JhcGgucHJvdG90eXBlLnBsYXlBbmltYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciByZW5kZXIgPSB0aGlzLnJlbmRlcjtcbiAgdGhpcy5hdHRyKCdhbmltYXRpb25QYXVzZScsIGZhbHNlKTtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKCAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIHZhciBfcmVmNCA9ICgwLCBfYXN5bmNUb0dlbmVyYXRvcjJbXCJkZWZhdWx0XCJdKSggLyojX19QVVJFX18qL19yZWdlbmVyYXRvcltcImRlZmF1bHRcIl0ubWFyayhmdW5jdGlvbiBfY2FsbGVlMyhyZXNvbHZlKSB7XG4gICAgICByZXR1cm4gX3JlZ2VuZXJhdG9yW1wiZGVmYXVsdFwiXS53cmFwKGZ1bmN0aW9uIF9jYWxsZWUzJChfY29udGV4dDMpIHtcbiAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0My5wcmV2ID0gX2NvbnRleHQzLm5leHQpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSAyO1xuICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyLmxhdW5jaEFuaW1hdGlvbigpO1xuXG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcblxuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQzLnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIF9jYWxsZWUzKTtcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKF94NCkge1xuICAgICAgcmV0dXJuIF9yZWY0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSgpKTtcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBQcm9jZXNzb3Igb2YgZGVsZXRlXG4gKiBAcGFyYW0ge0NSZW5kZXJ9IHJlbmRlciBJbnN0YW5jZSBvZiBDUmVuZGVyXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9IFZvaWRcbiAqL1xuXG5cbkdyYXBoLnByb3RvdHlwZS5kZWxQcm9jZXNzb3IgPSBmdW5jdGlvbiAocmVuZGVyKSB7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgdmFyIGdyYXBocyA9IHJlbmRlci5ncmFwaHM7XG4gIHZhciBpbmRleCA9IGdyYXBocy5maW5kSW5kZXgoZnVuY3Rpb24gKGdyYXBoKSB7XG4gICAgcmV0dXJuIGdyYXBoID09PSBfdGhpcztcbiAgfSk7XG4gIGlmIChpbmRleCA9PT0gLTEpIHJldHVybjtcbiAgaWYgKHR5cGVvZiB0aGlzLmJlZm9yZURlbGV0ZSA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5iZWZvcmVEZWxldGUodGhpcyk7XG4gIGdyYXBocy5zcGxpY2UoaW5kZXgsIDEsIG51bGwpO1xuICBpZiAodHlwZW9mIHRoaXMuZGVsZXRlZCA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5kZWxldGVkKHRoaXMpO1xufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIFJldHVybiBhIHRpbWVkIHJlbGVhc2UgUHJvbWlzZVxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgUmVsZWFzZSB0aW1lXG4gKiBAcmV0dXJuIHtQcm9taXNlfSBBIHRpbWVkIHJlbGVhc2UgUHJvbWlzZVxuICovXG5cblxuZnVuY3Rpb24gZGVsYXkodGltZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIHRpbWUpO1xuICB9KTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHRcIik7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF90b0NvbnN1bWFibGVBcnJheTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5XCIpKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrXCIpKTtcblxudmFyIF9jb2xvciA9IHJlcXVpcmUoXCJAamlhbWluZ2hpL2NvbG9yXCIpO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKFwiLi4vcGx1Z2luL3V0aWxcIik7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIENsYXNzIFN0eWxlXG4gKiBAcGFyYW0ge09iamVjdH0gc3R5bGUgIFN0eWxlIGNvbmZpZ3VyYXRpb25cbiAqIEByZXR1cm4ge1N0eWxlfSBJbnN0YW5jZSBvZiBTdHlsZVxuICovXG52YXIgU3R5bGUgPSBmdW5jdGlvbiBTdHlsZShzdHlsZSkge1xuICAoMCwgX2NsYXNzQ2FsbENoZWNrMltcImRlZmF1bHRcIl0pKHRoaXMsIFN0eWxlKTtcbiAgdGhpcy5jb2xvclByb2Nlc3NvcihzdHlsZSk7XG4gIHZhciBkZWZhdWx0U3R5bGUgPSB7XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJnYmEgdmFsdWUgb2YgZ3JhcGggZmlsbCBjb2xvclxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAZGVmYXVsdCBmaWxsID0gWzAsIDAsIDAsIDFdXG4gICAgICovXG4gICAgZmlsbDogWzAsIDAsIDAsIDFdLFxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJnYmEgdmFsdWUgb2YgZ3JhcGggc3Ryb2tlIGNvbG9yXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBkZWZhdWx0IHN0cm9rZSA9IFswLCAwLCAwLCAxXVxuICAgICAqL1xuICAgIHN0cm9rZTogWzAsIDAsIDAsIDBdLFxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIE9wYWNpdHkgb2YgZ3JhcGhcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IG9wYWNpdHkgPSAxXG4gICAgICovXG4gICAgb3BhY2l0eTogMSxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBMaW5lQ2FwIG9mIEN0eFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgbGluZUNhcCA9IG51bGxcbiAgICAgKiBAZXhhbXBsZSBsaW5lQ2FwID0gJ2J1dHQnfCdyb3VuZCd8J3NxdWFyZSdcbiAgICAgKi9cbiAgICBsaW5lQ2FwOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExpbmVqb2luIG9mIEN0eFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgbGluZUpvaW4gPSBudWxsXG4gICAgICogQGV4YW1wbGUgbGluZUpvaW4gPSAncm91bmQnfCdiZXZlbCd8J21pdGVyJ1xuICAgICAqL1xuICAgIGxpbmVKb2luOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExpbmVEYXNoIG9mIEN0eFxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAZGVmYXVsdCBsaW5lRGFzaCA9IG51bGxcbiAgICAgKiBAZXhhbXBsZSBsaW5lRGFzaCA9IFsxMCwgMTBdXG4gICAgICovXG4gICAgbGluZURhc2g6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTGluZURhc2hPZmZzZXQgb2YgQ3R4XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCBsaW5lRGFzaE9mZnNldCA9IG51bGxcbiAgICAgKiBAZXhhbXBsZSBsaW5lRGFzaE9mZnNldCA9IDEwXG4gICAgICovXG4gICAgbGluZURhc2hPZmZzZXQ6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2hhZG93Qmx1ciBvZiBDdHhcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IHNoYWRvd0JsdXIgPSAwXG4gICAgICovXG4gICAgc2hhZG93Qmx1cjogMCxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBSZ2JhIHZhbHVlIG9mIGdyYXBoIHNoYWRvdyBjb2xvclxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAZGVmYXVsdCBzaGFkb3dDb2xvciA9IFswLCAwLCAwLCAwXVxuICAgICAqL1xuICAgIHNoYWRvd0NvbG9yOiBbMCwgMCwgMCwgMF0sXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2hhZG93T2Zmc2V0WCBvZiBDdHhcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IHNoYWRvd09mZnNldFggPSAwXG4gICAgICovXG4gICAgc2hhZG93T2Zmc2V0WDogMCxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTaGFkb3dPZmZzZXRZIG9mIEN0eFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQGRlZmF1bHQgc2hhZG93T2Zmc2V0WSA9IDBcbiAgICAgKi9cbiAgICBzaGFkb3dPZmZzZXRZOiAwLFxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExpbmVXaWR0aCBvZiBDdHhcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IGxpbmVXaWR0aCA9IDBcbiAgICAgKi9cbiAgICBsaW5lV2lkdGg6IDAsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQ2VudGVyIHBvaW50IG9mIHRoZSBncmFwaFxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAZGVmYXVsdCBncmFwaENlbnRlciA9IG51bGxcbiAgICAgKiBAZXhhbXBsZSBncmFwaENlbnRlciA9IFsxMCwgMTBdXG4gICAgICovXG4gICAgZ3JhcGhDZW50ZXI6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR3JhcGggc2NhbGVcbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICogQGRlZmF1bHQgc2NhbGUgPSBudWxsXG4gICAgICogQGV4YW1wbGUgc2NhbGUgPSBbMS41LCAxLjVdXG4gICAgICovXG4gICAgc2NhbGU6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR3JhcGggcm90YXRpb24gZGVncmVlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCByb3RhdGUgPSBudWxsXG4gICAgICogQGV4YW1wbGUgcm90YXRlID0gMTBcbiAgICAgKi9cbiAgICByb3RhdGU6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR3JhcGggdHJhbnNsYXRlIGRpc3RhbmNlXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBkZWZhdWx0IHRyYW5zbGF0ZSA9IG51bGxcbiAgICAgKiBAZXhhbXBsZSB0cmFuc2xhdGUgPSBbMTAsIDEwXVxuICAgICAqL1xuICAgIHRyYW5zbGF0ZTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBDdXJzb3Igc3RhdHVzIHdoZW4gaG92ZXJcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IGhvdmVyQ3Vyc29yID0gJ3BvaW50ZXInXG4gICAgICogQGV4YW1wbGUgaG92ZXJDdXJzb3IgPSAnZGVmYXVsdCd8J3BvaW50ZXInfCdhdXRvJ3wnY3Jvc3NoYWlyJ3wnbW92ZSd8J3dhaXQnfC4uLlxuICAgICAqL1xuICAgIGhvdmVyQ3Vyc29yOiAncG9pbnRlcicsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRm9udCBzdHlsZSBvZiBDdHhcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IGZvbnRTdHlsZSA9ICdub3JtYWwnXG4gICAgICogQGV4YW1wbGUgZm9udFN0eWxlID0gJ25vcm1hbCd8J2l0YWxpYyd8J29ibGlxdWUnXG4gICAgICovXG4gICAgZm9udFN0eWxlOiAnbm9ybWFsJyxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBGb250IHZhcmllbnQgb2YgQ3R4XG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBmb250VmFyaWVudCA9ICdub3JtYWwnXG4gICAgICogQGV4YW1wbGUgZm9udFZhcmllbnQgPSAnbm9ybWFsJ3wnc21hbGwtY2FwcydcbiAgICAgKi9cbiAgICBmb250VmFyaWVudDogJ25vcm1hbCcsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRm9udCB3ZWlnaHQgb2YgQ3R4XG4gICAgICogQHR5cGUge1N0cmluZ3xOdW1iZXJ9XG4gICAgICogQGRlZmF1bHQgZm9udFdlaWdodCA9ICdub3JtYWwnXG4gICAgICogQGV4YW1wbGUgZm9udFdlaWdodCA9ICdub3JtYWwnfCdib2xkJ3wnYm9sZGVyJ3wnbGlnaHRlcid8TnVtYmVyXG4gICAgICovXG4gICAgZm9udFdlaWdodDogJ25vcm1hbCcsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRm9udCBzaXplIG9mIEN0eFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQGRlZmF1bHQgZm9udFNpemUgPSAxMFxuICAgICAqL1xuICAgIGZvbnRTaXplOiAxMCxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBGb250IGZhbWlseSBvZiBDdHhcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IGZvbnRGYW1pbHkgPSAnQXJpYWwnXG4gICAgICovXG4gICAgZm9udEZhbWlseTogJ0FyaWFsJyxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBUZXh0QWxpZ24gb2YgQ3R4XG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCB0ZXh0QWxpZ24gPSAnY2VudGVyJ1xuICAgICAqIEBleGFtcGxlIHRleHRBbGlnbiA9ICdzdGFydCd8J2VuZCd8J2xlZnQnfCdyaWdodCd8J2NlbnRlcidcbiAgICAgKi9cbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFRleHRCYXNlbGluZSBvZiBDdHhcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IHRleHRCYXNlbGluZSA9ICdtaWRkbGUnXG4gICAgICogQGV4YW1wbGUgdGV4dEJhc2VsaW5lID0gJ3RvcCd8J2JvdHRvbSd8J21pZGRsZSd8J2FscGhhYmV0aWMnfCdoYW5naW5nJ1xuICAgICAqL1xuICAgIHRleHRCYXNlbGluZTogJ21pZGRsZScsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gVGhlIGNvbG9yIHVzZWQgdG8gY3JlYXRlIHRoZSBncmFkaWVudFxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAZGVmYXVsdCBncmFkaWVudENvbG9yID0gbnVsbFxuICAgICAqIEBleGFtcGxlIGdyYWRpZW50Q29sb3IgPSBbJyMwMDAnLCAnIzExMScsICcjMjIyJ11cbiAgICAgKi9cbiAgICBncmFkaWVudENvbG9yOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdyYWRpZW50IHR5cGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IGdyYWRpZW50VHlwZSA9ICdsaW5lYXInXG4gICAgICogQGV4YW1wbGUgZ3JhZGllbnRUeXBlID0gJ2xpbmVhcicgfCAncmFkaWFsJ1xuICAgICAqL1xuICAgIGdyYWRpZW50VHlwZTogJ2xpbmVhcicsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR3JhZGllbnQgcGFyYW1zXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBkZWZhdWx0IGdyYWRpZW50UGFyYW1zID0gbnVsbFxuICAgICAqIEBleGFtcGxlIGdyYWRpZW50UGFyYW1zID0gW3gwLCB5MCwgeDEsIHkxXSAoTGluZWFyIEdyYWRpZW50KVxuICAgICAqIEBleGFtcGxlIGdyYWRpZW50UGFyYW1zID0gW3gwLCB5MCwgcjAsIHgxLCB5MSwgcjFdIChSYWRpYWwgR3JhZGllbnQpXG4gICAgICovXG4gICAgZ3JhZGllbnRQYXJhbXM6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gV2hlbiB0byB1c2UgZ3JhZGllbnRzXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBncmFkaWVudFdpdGggPSAnc3Ryb2tlJ1xuICAgICAqIEBleGFtcGxlIGdyYWRpZW50V2l0aCA9ICdzdHJva2UnIHwgJ2ZpbGwnXG4gICAgICovXG4gICAgZ3JhZGllbnRXaXRoOiAnc3Ryb2tlJyxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHcmFkaWVudCBjb2xvciBzdG9wc1xuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgZ3JhZGllbnRTdG9wcyA9ICdhdXRvJ1xuICAgICAqIEBleGFtcGxlIGdyYWRpZW50U3RvcHMgPSAnYXV0bycgfCBbMCwgLjIsIC4zLCAxXVxuICAgICAqL1xuICAgIGdyYWRpZW50U3RvcHM6ICdhdXRvJyxcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBFeHRlbmRlZCBjb2xvciB0aGF0IHN1cHBvcnRzIGFuaW1hdGlvbiB0cmFuc2l0aW9uXG4gICAgICogQHR5cGUge0FycmF5fE9iamVjdH1cbiAgICAgKiBAZGVmYXVsdCBjb2xvcnMgPSBudWxsXG4gICAgICogQGV4YW1wbGUgY29sb3JzID0gWycjMDAwJywgJyMxMTEnLCAnIzIyMicsICdyZWQnIF1cbiAgICAgKiBAZXhhbXBsZSBjb2xvcnMgPSB7IGE6ICcjMDAwJywgYjogJyMxMTEnIH1cbiAgICAgKi9cbiAgICBjb2xvcnM6IG51bGxcbiAgfTtcbiAgT2JqZWN0LmFzc2lnbih0aGlzLCBkZWZhdWx0U3R5bGUsIHN0eWxlKTtcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBTZXQgY29sb3JzIHRvIHJnYmEgdmFsdWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZSBzdHlsZSBjb25maWdcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmV2ZXJzZSBXaGV0aGVyIHRvIHBlcmZvcm0gcmV2ZXJzZSBvcGVyYXRpb25cbiAqIEByZXR1cm4ge1VuZGVmaW5lZH0gVm9pZFxuICovXG5cblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTdHlsZTtcblxuU3R5bGUucHJvdG90eXBlLmNvbG9yUHJvY2Vzc29yID0gZnVuY3Rpb24gKHN0eWxlKSB7XG4gIHZhciByZXZlcnNlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcbiAgdmFyIHByb2Nlc3NvciA9IHJldmVyc2UgPyBfY29sb3IuZ2V0Q29sb3JGcm9tUmdiVmFsdWUgOiBfY29sb3IuZ2V0UmdiYVZhbHVlO1xuICB2YXIgY29sb3JQcm9jZXNzb3JLZXlzID0gWydmaWxsJywgJ3N0cm9rZScsICdzaGFkb3dDb2xvciddO1xuICB2YXIgYWxsS2V5cyA9IE9iamVjdC5rZXlzKHN0eWxlKTtcbiAgdmFyIGNvbG9yS2V5cyA9IGFsbEtleXMuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gY29sb3JQcm9jZXNzb3JLZXlzLmZpbmQoZnVuY3Rpb24gKGspIHtcbiAgICAgIHJldHVybiBrID09PSBrZXk7XG4gICAgfSk7XG4gIH0pO1xuICBjb2xvcktleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHN0eWxlW2tleV0gPSBwcm9jZXNzb3Ioc3R5bGVba2V5XSk7XG4gIH0pO1xuICB2YXIgZ3JhZGllbnRDb2xvciA9IHN0eWxlLmdyYWRpZW50Q29sb3IsXG4gICAgICBjb2xvcnMgPSBzdHlsZS5jb2xvcnM7XG4gIGlmIChncmFkaWVudENvbG9yKSBzdHlsZS5ncmFkaWVudENvbG9yID0gZ3JhZGllbnRDb2xvci5tYXAoZnVuY3Rpb24gKGMpIHtcbiAgICByZXR1cm4gcHJvY2Vzc29yKGMpO1xuICB9KTtcblxuICBpZiAoY29sb3JzKSB7XG4gICAgdmFyIGNvbG9yc0tleXMgPSBPYmplY3Qua2V5cyhjb2xvcnMpO1xuICAgIGNvbG9yc0tleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gY29sb3JzW2tleV0gPSBwcm9jZXNzb3IoY29sb3JzW2tleV0pO1xuICAgIH0pO1xuICB9XG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gSW5pdCBncmFwaCBzdHlsZVxuICogQHBhcmFtIHtPYmplY3R9IGN0eCBDb250ZXh0IG9mIGNhbnZhc1xuICogQHJldHVybiB7VW5kZWZpbmVkfSBWb2lkXG4gKi9cblxuXG5TdHlsZS5wcm90b3R5cGUuaW5pdFN0eWxlID0gZnVuY3Rpb24gKGN0eCkge1xuICBpbml0VHJhbnNmb3JtKGN0eCwgdGhpcyk7XG4gIGluaXRHcmFwaFN0eWxlKGN0eCwgdGhpcyk7XG4gIGluaXRHcmFkaWVudChjdHgsIHRoaXMpO1xufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIEluaXQgY2FudmFzIHRyYW5zZm9ybVxuICogQHBhcmFtIHtPYmplY3R9IGN0eCAgQ29udGV4dCBvZiBjYW52YXNcbiAqIEBwYXJhbSB7U3R5bGV9IHN0eWxlIEluc3RhbmNlIG9mIFN0eWxlXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9IFZvaWRcbiAqL1xuXG5cbmZ1bmN0aW9uIGluaXRUcmFuc2Zvcm0oY3R4LCBzdHlsZSkge1xuICBjdHguc2F2ZSgpO1xuICB2YXIgZ3JhcGhDZW50ZXIgPSBzdHlsZS5ncmFwaENlbnRlcixcbiAgICAgIHJvdGF0ZSA9IHN0eWxlLnJvdGF0ZSxcbiAgICAgIHNjYWxlID0gc3R5bGUuc2NhbGUsXG4gICAgICB0cmFuc2xhdGUgPSBzdHlsZS50cmFuc2xhdGU7XG4gIGlmICghKGdyYXBoQ2VudGVyIGluc3RhbmNlb2YgQXJyYXkpKSByZXR1cm47XG4gIGN0eC50cmFuc2xhdGUuYXBwbHkoY3R4LCAoMCwgX3RvQ29uc3VtYWJsZUFycmF5MltcImRlZmF1bHRcIl0pKGdyYXBoQ2VudGVyKSk7XG4gIGlmIChyb3RhdGUpIGN0eC5yb3RhdGUocm90YXRlICogTWF0aC5QSSAvIDE4MCk7XG4gIGlmIChzY2FsZSBpbnN0YW5jZW9mIEFycmF5KSBjdHguc2NhbGUuYXBwbHkoY3R4LCAoMCwgX3RvQ29uc3VtYWJsZUFycmF5MltcImRlZmF1bHRcIl0pKHNjYWxlKSk7XG4gIGlmICh0cmFuc2xhdGUpIGN0eC50cmFuc2xhdGUuYXBwbHkoY3R4LCAoMCwgX3RvQ29uc3VtYWJsZUFycmF5MltcImRlZmF1bHRcIl0pKHRyYW5zbGF0ZSkpO1xuICBjdHgudHJhbnNsYXRlKC1ncmFwaENlbnRlclswXSwgLWdyYXBoQ2VudGVyWzFdKTtcbn1cblxudmFyIGF1dG9TZXRTdHlsZUtleXMgPSBbJ2xpbmVDYXAnLCAnbGluZUpvaW4nLCAnbGluZURhc2hPZmZzZXQnLCAnc2hhZG93T2Zmc2V0WCcsICdzaGFkb3dPZmZzZXRZJywgJ2xpbmVXaWR0aCcsICd0ZXh0QWxpZ24nLCAndGV4dEJhc2VsaW5lJ107XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBTZXQgdGhlIHN0eWxlIG9mIGNhbnZhcyBjdHhcbiAqIEBwYXJhbSB7T2JqZWN0fSBjdHggIENvbnRleHQgb2YgY2FudmFzXG4gKiBAcGFyYW0ge1N0eWxlfSBzdHlsZSBJbnN0YW5jZSBvZiBTdHlsZVxuICogQHJldHVybiB7VW5kZWZpbmVkfSBWb2lkXG4gKi9cblxuZnVuY3Rpb24gaW5pdEdyYXBoU3R5bGUoY3R4LCBzdHlsZSkge1xuICB2YXIgZmlsbCA9IHN0eWxlLmZpbGwsXG4gICAgICBzdHJva2UgPSBzdHlsZS5zdHJva2UsXG4gICAgICBzaGFkb3dDb2xvciA9IHN0eWxlLnNoYWRvd0NvbG9yLFxuICAgICAgb3BhY2l0eSA9IHN0eWxlLm9wYWNpdHk7XG4gIGF1dG9TZXRTdHlsZUtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKGtleSB8fCB0eXBlb2Yga2V5ID09PSAnbnVtYmVyJykgY3R4W2tleV0gPSBzdHlsZVtrZXldO1xuICB9KTtcbiAgZmlsbCA9ICgwLCBfdG9Db25zdW1hYmxlQXJyYXkyW1wiZGVmYXVsdFwiXSkoZmlsbCk7XG4gIHN0cm9rZSA9ICgwLCBfdG9Db25zdW1hYmxlQXJyYXkyW1wiZGVmYXVsdFwiXSkoc3Ryb2tlKTtcbiAgc2hhZG93Q29sb3IgPSAoMCwgX3RvQ29uc3VtYWJsZUFycmF5MltcImRlZmF1bHRcIl0pKHNoYWRvd0NvbG9yKTtcbiAgZmlsbFszXSAqPSBvcGFjaXR5O1xuICBzdHJva2VbM10gKj0gb3BhY2l0eTtcbiAgc2hhZG93Q29sb3JbM10gKj0gb3BhY2l0eTtcbiAgY3R4LmZpbGxTdHlsZSA9ICgwLCBfY29sb3IuZ2V0Q29sb3JGcm9tUmdiVmFsdWUpKGZpbGwpO1xuICBjdHguc3Ryb2tlU3R5bGUgPSAoMCwgX2NvbG9yLmdldENvbG9yRnJvbVJnYlZhbHVlKShzdHJva2UpO1xuICBjdHguc2hhZG93Q29sb3IgPSAoMCwgX2NvbG9yLmdldENvbG9yRnJvbVJnYlZhbHVlKShzaGFkb3dDb2xvcik7XG4gIHZhciBsaW5lRGFzaCA9IHN0eWxlLmxpbmVEYXNoLFxuICAgICAgc2hhZG93Qmx1ciA9IHN0eWxlLnNoYWRvd0JsdXI7XG5cbiAgaWYgKGxpbmVEYXNoKSB7XG4gICAgbGluZURhc2ggPSBsaW5lRGFzaC5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgIHJldHVybiB2ID49IDAgPyB2IDogMDtcbiAgICB9KTtcbiAgICBjdHguc2V0TGluZURhc2gobGluZURhc2gpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBzaGFkb3dCbHVyID09PSAnbnVtYmVyJykgY3R4LnNoYWRvd0JsdXIgPSBzaGFkb3dCbHVyID4gMCA/IHNoYWRvd0JsdXIgOiAwLjAwMTtcbiAgdmFyIGZvbnRTdHlsZSA9IHN0eWxlLmZvbnRTdHlsZSxcbiAgICAgIGZvbnRWYXJpZW50ID0gc3R5bGUuZm9udFZhcmllbnQsXG4gICAgICBmb250V2VpZ2h0ID0gc3R5bGUuZm9udFdlaWdodCxcbiAgICAgIGZvbnRTaXplID0gc3R5bGUuZm9udFNpemUsXG4gICAgICBmb250RmFtaWx5ID0gc3R5bGUuZm9udEZhbWlseTtcbiAgY3R4LmZvbnQgPSBmb250U3R5bGUgKyAnICcgKyBmb250VmFyaWVudCArICcgJyArIGZvbnRXZWlnaHQgKyAnICcgKyBmb250U2l6ZSArICdweCcgKyAnICcgKyBmb250RmFtaWx5O1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gU2V0IHRoZSBncmFkaWVudCBjb2xvciBvZiBjYW52YXMgY3R4XG4gKiBAcGFyYW0ge09iamVjdH0gY3R4ICBDb250ZXh0IG9mIGNhbnZhc1xuICogQHBhcmFtIHtTdHlsZX0gc3R5bGUgSW5zdGFuY2Ugb2YgU3R5bGVcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH0gVm9pZFxuICovXG5cblxuZnVuY3Rpb24gaW5pdEdyYWRpZW50KGN0eCwgc3R5bGUpIHtcbiAgaWYgKCFncmFkaWVudFZhbGlkYXRvcihzdHlsZSkpIHJldHVybjtcbiAgdmFyIGdyYWRpZW50Q29sb3IgPSBzdHlsZS5ncmFkaWVudENvbG9yLFxuICAgICAgZ3JhZGllbnRQYXJhbXMgPSBzdHlsZS5ncmFkaWVudFBhcmFtcyxcbiAgICAgIGdyYWRpZW50VHlwZSA9IHN0eWxlLmdyYWRpZW50VHlwZSxcbiAgICAgIGdyYWRpZW50V2l0aCA9IHN0eWxlLmdyYWRpZW50V2l0aCxcbiAgICAgIGdyYWRpZW50U3RvcHMgPSBzdHlsZS5ncmFkaWVudFN0b3BzLFxuICAgICAgb3BhY2l0eSA9IHN0eWxlLm9wYWNpdHk7XG4gIGdyYWRpZW50Q29sb3IgPSBncmFkaWVudENvbG9yLm1hcChmdW5jdGlvbiAoY29sb3IpIHtcbiAgICB2YXIgY29sb3JPcGFjaXR5ID0gY29sb3JbM10gKiBvcGFjaXR5O1xuICAgIHZhciBjbG9uZWRDb2xvciA9ICgwLCBfdG9Db25zdW1hYmxlQXJyYXkyW1wiZGVmYXVsdFwiXSkoY29sb3IpO1xuICAgIGNsb25lZENvbG9yWzNdID0gY29sb3JPcGFjaXR5O1xuICAgIHJldHVybiBjbG9uZWRDb2xvcjtcbiAgfSk7XG4gIGdyYWRpZW50Q29sb3IgPSBncmFkaWVudENvbG9yLm1hcChmdW5jdGlvbiAoYykge1xuICAgIHJldHVybiAoMCwgX2NvbG9yLmdldENvbG9yRnJvbVJnYlZhbHVlKShjKTtcbiAgfSk7XG4gIGlmIChncmFkaWVudFN0b3BzID09PSAnYXV0bycpIGdyYWRpZW50U3RvcHMgPSBnZXRBdXRvQ29sb3JTdG9wcyhncmFkaWVudENvbG9yKTtcbiAgdmFyIGdyYWRpZW50ID0gY3R4W1wiY3JlYXRlXCIuY29uY2F0KGdyYWRpZW50VHlwZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgZ3JhZGllbnRUeXBlLnNsaWNlKDEpLCBcIkdyYWRpZW50XCIpXS5hcHBseShjdHgsICgwLCBfdG9Db25zdW1hYmxlQXJyYXkyW1wiZGVmYXVsdFwiXSkoZ3JhZGllbnRQYXJhbXMpKTtcbiAgZ3JhZGllbnRTdG9wcy5mb3JFYWNoKGZ1bmN0aW9uIChzdG9wLCBpKSB7XG4gICAgcmV0dXJuIGdyYWRpZW50LmFkZENvbG9yU3RvcChzdG9wLCBncmFkaWVudENvbG9yW2ldKTtcbiAgfSk7XG4gIGN0eFtcIlwiLmNvbmNhdChncmFkaWVudFdpdGgsIFwiU3R5bGVcIildID0gZ3JhZGllbnQ7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBDaGVjayBpZiB0aGUgZ3JhZGllbnQgY29uZmlndXJhdGlvbiBpcyBsZWdhbFxuICogQHBhcmFtIHtTdHlsZX0gc3R5bGUgSW5zdGFuY2Ugb2YgU3R5bGVcbiAqIEByZXR1cm4ge0Jvb2xlYW59IENoZWNrIFJlc3VsdFxuICovXG5cblxuZnVuY3Rpb24gZ3JhZGllbnRWYWxpZGF0b3Ioc3R5bGUpIHtcbiAgdmFyIGdyYWRpZW50Q29sb3IgPSBzdHlsZS5ncmFkaWVudENvbG9yLFxuICAgICAgZ3JhZGllbnRQYXJhbXMgPSBzdHlsZS5ncmFkaWVudFBhcmFtcyxcbiAgICAgIGdyYWRpZW50VHlwZSA9IHN0eWxlLmdyYWRpZW50VHlwZSxcbiAgICAgIGdyYWRpZW50V2l0aCA9IHN0eWxlLmdyYWRpZW50V2l0aCxcbiAgICAgIGdyYWRpZW50U3RvcHMgPSBzdHlsZS5ncmFkaWVudFN0b3BzO1xuICBpZiAoIWdyYWRpZW50Q29sb3IgfHwgIWdyYWRpZW50UGFyYW1zKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGdyYWRpZW50Q29sb3IubGVuZ3RoID09PSAxKSB7XG4gICAgY29uc29sZS53YXJuKCdUaGUgZ3JhZGllbnQgbmVlZHMgdG8gcHJvdmlkZSBhdCBsZWFzdCB0d28gY29sb3JzJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGdyYWRpZW50VHlwZSAhPT0gJ2xpbmVhcicgJiYgZ3JhZGllbnRUeXBlICE9PSAncmFkaWFsJykge1xuICAgIGNvbnNvbGUud2FybignR3JhZGllbnRUeXBlIG9ubHkgc3VwcG9ydHMgbGluZWFyIG9yIHJhZGlhbCwgY3VycmVudCB2YWx1ZSBpcyAnICsgZ3JhZGllbnRUeXBlKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgZ3JhZGllbnRQYXJhbXNMZW5ndGggPSBncmFkaWVudFBhcmFtcy5sZW5ndGg7XG5cbiAgaWYgKGdyYWRpZW50VHlwZSA9PT0gJ2xpbmVhcicgJiYgZ3JhZGllbnRQYXJhbXNMZW5ndGggIT09IDQgfHwgZ3JhZGllbnRUeXBlID09PSAncmFkaWFsJyAmJiBncmFkaWVudFBhcmFtc0xlbmd0aCAhPT0gNikge1xuICAgIGNvbnNvbGUud2FybignVGhlIGV4cGVjdGVkIGxlbmd0aCBvZiBncmFkaWVudFBhcmFtcyBpcyAnICsgKGdyYWRpZW50VHlwZSA9PT0gJ2xpbmVhcicgPyAnNCcgOiAnNicpKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoZ3JhZGllbnRXaXRoICE9PSAnZmlsbCcgJiYgZ3JhZGllbnRXaXRoICE9PSAnc3Ryb2tlJykge1xuICAgIGNvbnNvbGUud2FybignR3JhZGllbnRXaXRoIG9ubHkgc3VwcG9ydHMgZmlsbCBvciBzdHJva2UsIGN1cnJlbnQgdmFsdWUgaXMgJyArIGdyYWRpZW50V2l0aCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGdyYWRpZW50U3RvcHMgIT09ICdhdXRvJyAmJiAhKGdyYWRpZW50U3RvcHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICBjb25zb2xlLndhcm4oXCJncmFkaWVudFN0b3BzIG9ubHkgc3VwcG9ydHMgJ2F1dG8nIG9yIE51bWJlciBBcnJheSAoWzAsIC41LCAxXSksIGN1cnJlbnQgdmFsdWUgaXMgXCIgKyBncmFkaWVudFN0b3BzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIEdldCBhIHVuaWZvcm0gZ3JhZGllbnQgY29sb3Igc3RvcFxuICogQHBhcmFtIHtBcnJheX0gY29sb3IgR3JhZGllbnQgY29sb3JcbiAqIEByZXR1cm4ge0FycmF5fSBHcmFkaWVudCBjb2xvciBzdG9wXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRBdXRvQ29sb3JTdG9wcyhjb2xvcikge1xuICB2YXIgc3RvcEdhcCA9IDEgLyAoY29sb3IubGVuZ3RoIC0gMSk7XG4gIHJldHVybiBjb2xvci5tYXAoZnVuY3Rpb24gKGZvbywgaSkge1xuICAgIHJldHVybiBzdG9wR2FwICogaTtcbiAgfSk7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBSZXN0b3JlIGNhbnZhcyBjdHggdHJhbnNmb3JtXG4gKiBAcGFyYW0ge09iamVjdH0gY3R4ICBDb250ZXh0IG9mIGNhbnZhc1xuICogQHJldHVybiB7VW5kZWZpbmVkfSBWb2lkXG4gKi9cblxuXG5TdHlsZS5wcm90b3R5cGUucmVzdG9yZVRyYW5zZm9ybSA9IGZ1bmN0aW9uIChjdHgpIHtcbiAgY3R4LnJlc3RvcmUoKTtcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBVcGRhdGUgc3R5bGUgZGF0YVxuICogQHBhcmFtIHtPYmplY3R9IGNoYW5nZSBDaGFuZ2VkIGRhdGFcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH0gVm9pZFxuICovXG5cblxuU3R5bGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChjaGFuZ2UpIHtcbiAgdGhpcy5jb2xvclByb2Nlc3NvcihjaGFuZ2UpO1xuICBPYmplY3QuYXNzaWduKHRoaXMsIGNoYW5nZSk7XG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSBjdXJyZW50IHN0eWxlIGNvbmZpZ3VyYXRpb25cbiAqIEByZXR1cm4ge09iamVjdH0gU3R5bGUgY29uZmlndXJhdGlvblxuICovXG5cblxuU3R5bGUucHJvdG90eXBlLmdldFN0eWxlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY2xvbmVkU3R5bGUgPSAoMCwgX3V0aWwuZGVlcENsb25lKSh0aGlzLCB0cnVlKTtcbiAgdGhpcy5jb2xvclByb2Nlc3NvcihjbG9uZWRTdHlsZSwgdHJ1ZSk7XG4gIHJldHVybiBjbG9uZWRTdHlsZTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW50ZXJvcFJlcXVpcmVEZWZhdWx0XCIpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5leHRlbmROZXdHcmFwaCA9IGV4dGVuZE5ld0dyYXBoO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBleHBvcnRzLnRleHQgPSBleHBvcnRzLmJlemllckN1cnZlID0gZXhwb3J0cy5zbW9vdGhsaW5lID0gZXhwb3J0cy5wb2x5bGluZSA9IGV4cG9ydHMucmVnUG9seWdvbiA9IGV4cG9ydHMuc2VjdG9yID0gZXhwb3J0cy5hcmMgPSBleHBvcnRzLnJpbmcgPSBleHBvcnRzLnJlY3QgPSBleHBvcnRzLmVsbGlwc2UgPSBleHBvcnRzLmNpcmNsZSA9IHZvaWQgMDtcblxudmFyIF90b0NvbnN1bWFibGVBcnJheTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5XCIpKTtcblxudmFyIF9zbGljZWRUb0FycmF5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheVwiKSk7XG5cbnZhciBfYmV6aWVyQ3VydmUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGppYW1pbmdoaS9iZXppZXItY3VydmVcIikpO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKFwiLi4vcGx1Z2luL3V0aWxcIik7XG5cbnZhciBfY2FudmFzID0gcmVxdWlyZShcIi4uL3BsdWdpbi9jYW52YXNcIik7XG5cbnZhciBwb2x5bGluZVRvQmV6aWVyQ3VydmUgPSBfYmV6aWVyQ3VydmUyW1wiZGVmYXVsdFwiXS5wb2x5bGluZVRvQmV6aWVyQ3VydmUsXG4gICAgYmV6aWVyQ3VydmVUb1BvbHlsaW5lID0gX2JlemllckN1cnZlMltcImRlZmF1bHRcIl0uYmV6aWVyQ3VydmVUb1BvbHlsaW5lO1xudmFyIGNpcmNsZSA9IHtcbiAgc2hhcGU6IHtcbiAgICByeDogMCxcbiAgICByeTogMCxcbiAgICByOiAwXG4gIH0sXG4gIHZhbGlkYXRvcjogZnVuY3Rpb24gdmFsaWRhdG9yKF9yZWYpIHtcbiAgICB2YXIgc2hhcGUgPSBfcmVmLnNoYXBlO1xuICAgIHZhciByeCA9IHNoYXBlLnJ4LFxuICAgICAgICByeSA9IHNoYXBlLnJ5LFxuICAgICAgICByID0gc2hhcGUucjtcblxuICAgIGlmICh0eXBlb2YgcnggIT09ICdudW1iZXInIHx8IHR5cGVvZiByeSAhPT0gJ251bWJlcicgfHwgdHlwZW9mIHIgIT09ICdudW1iZXInKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdDaXJjbGUgc2hhcGUgY29uZmlndXJhdGlvbiBpcyBhYm5vcm1hbCEnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgZHJhdzogZnVuY3Rpb24gZHJhdyhfcmVmMiwgX3JlZjMpIHtcbiAgICB2YXIgY3R4ID0gX3JlZjIuY3R4O1xuICAgIHZhciBzaGFwZSA9IF9yZWYzLnNoYXBlO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICB2YXIgcnggPSBzaGFwZS5yeCxcbiAgICAgICAgcnkgPSBzaGFwZS5yeSxcbiAgICAgICAgciA9IHNoYXBlLnI7XG4gICAgY3R4LmFyYyhyeCwgcnksIHIgPiAwID8gciA6IDAuMDEsIDAsIE1hdGguUEkgKiAyKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gIH0sXG4gIGhvdmVyQ2hlY2s6IGZ1bmN0aW9uIGhvdmVyQ2hlY2socG9zaXRpb24sIF9yZWY0KSB7XG4gICAgdmFyIHNoYXBlID0gX3JlZjQuc2hhcGU7XG4gICAgdmFyIHJ4ID0gc2hhcGUucngsXG4gICAgICAgIHJ5ID0gc2hhcGUucnksXG4gICAgICAgIHIgPSBzaGFwZS5yO1xuICAgIHJldHVybiAoMCwgX3V0aWwuY2hlY2tQb2ludElzSW5DaXJjbGUpKHBvc2l0aW9uLCByeCwgcnksIHIpO1xuICB9LFxuICBzZXRHcmFwaENlbnRlcjogZnVuY3Rpb24gc2V0R3JhcGhDZW50ZXIoZSwgX3JlZjUpIHtcbiAgICB2YXIgc2hhcGUgPSBfcmVmNS5zaGFwZSxcbiAgICAgICAgc3R5bGUgPSBfcmVmNS5zdHlsZTtcbiAgICB2YXIgcnggPSBzaGFwZS5yeCxcbiAgICAgICAgcnkgPSBzaGFwZS5yeTtcbiAgICBzdHlsZS5ncmFwaENlbnRlciA9IFtyeCwgcnldO1xuICB9LFxuICBtb3ZlOiBmdW5jdGlvbiBtb3ZlKF9yZWY2LCBfcmVmNykge1xuICAgIHZhciBtb3ZlbWVudFggPSBfcmVmNi5tb3ZlbWVudFgsXG4gICAgICAgIG1vdmVtZW50WSA9IF9yZWY2Lm1vdmVtZW50WTtcbiAgICB2YXIgc2hhcGUgPSBfcmVmNy5zaGFwZTtcbiAgICB0aGlzLmF0dHIoJ3NoYXBlJywge1xuICAgICAgcng6IHNoYXBlLnJ4ICsgbW92ZW1lbnRYLFxuICAgICAgcnk6IHNoYXBlLnJ5ICsgbW92ZW1lbnRZXG4gICAgfSk7XG4gIH1cbn07XG5leHBvcnRzLmNpcmNsZSA9IGNpcmNsZTtcbnZhciBlbGxpcHNlID0ge1xuICBzaGFwZToge1xuICAgIHJ4OiAwLFxuICAgIHJ5OiAwLFxuICAgIGhyOiAwLFxuICAgIHZyOiAwXG4gIH0sXG4gIHZhbGlkYXRvcjogZnVuY3Rpb24gdmFsaWRhdG9yKF9yZWY4KSB7XG4gICAgdmFyIHNoYXBlID0gX3JlZjguc2hhcGU7XG4gICAgdmFyIHJ4ID0gc2hhcGUucngsXG4gICAgICAgIHJ5ID0gc2hhcGUucnksXG4gICAgICAgIGhyID0gc2hhcGUuaHIsXG4gICAgICAgIHZyID0gc2hhcGUudnI7XG5cbiAgICBpZiAodHlwZW9mIHJ4ICE9PSAnbnVtYmVyJyB8fCB0eXBlb2YgcnkgIT09ICdudW1iZXInIHx8IHR5cGVvZiBociAhPT0gJ251bWJlcicgfHwgdHlwZW9mIHZyICE9PSAnbnVtYmVyJykge1xuICAgICAgY29uc29sZS5lcnJvcignRWxsaXBzZSBzaGFwZSBjb25maWd1cmF0aW9uIGlzIGFibm9ybWFsIScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBkcmF3OiBmdW5jdGlvbiBkcmF3KF9yZWY5LCBfcmVmMTApIHtcbiAgICB2YXIgY3R4ID0gX3JlZjkuY3R4O1xuICAgIHZhciBzaGFwZSA9IF9yZWYxMC5zaGFwZTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgdmFyIHJ4ID0gc2hhcGUucngsXG4gICAgICAgIHJ5ID0gc2hhcGUucnksXG4gICAgICAgIGhyID0gc2hhcGUuaHIsXG4gICAgICAgIHZyID0gc2hhcGUudnI7XG4gICAgY3R4LmVsbGlwc2UocngsIHJ5LCBociA+IDAgPyBociA6IDAuMDEsIHZyID4gMCA/IHZyIDogMC4wMSwgMCwgMCwgTWF0aC5QSSAqIDIpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgfSxcbiAgaG92ZXJDaGVjazogZnVuY3Rpb24gaG92ZXJDaGVjayhwb3NpdGlvbiwgX3JlZjExKSB7XG4gICAgdmFyIHNoYXBlID0gX3JlZjExLnNoYXBlO1xuICAgIHZhciByeCA9IHNoYXBlLnJ4LFxuICAgICAgICByeSA9IHNoYXBlLnJ5LFxuICAgICAgICBociA9IHNoYXBlLmhyLFxuICAgICAgICB2ciA9IHNoYXBlLnZyO1xuICAgIHZhciBhID0gTWF0aC5tYXgoaHIsIHZyKTtcbiAgICB2YXIgYiA9IE1hdGgubWluKGhyLCB2cik7XG4gICAgdmFyIGMgPSBNYXRoLnNxcnQoYSAqIGEgLSBiICogYik7XG4gICAgdmFyIGxlZnRGb2N1c1BvaW50ID0gW3J4IC0gYywgcnldO1xuICAgIHZhciByaWdodEZvY3VzUG9pbnQgPSBbcnggKyBjLCByeV07XG4gICAgdmFyIGRpc3RhbmNlID0gKDAsIF91dGlsLmdldFR3b1BvaW50RGlzdGFuY2UpKHBvc2l0aW9uLCBsZWZ0Rm9jdXNQb2ludCkgKyAoMCwgX3V0aWwuZ2V0VHdvUG9pbnREaXN0YW5jZSkocG9zaXRpb24sIHJpZ2h0Rm9jdXNQb2ludCk7XG4gICAgcmV0dXJuIGRpc3RhbmNlIDw9IDIgKiBhO1xuICB9LFxuICBzZXRHcmFwaENlbnRlcjogZnVuY3Rpb24gc2V0R3JhcGhDZW50ZXIoZSwgX3JlZjEyKSB7XG4gICAgdmFyIHNoYXBlID0gX3JlZjEyLnNoYXBlLFxuICAgICAgICBzdHlsZSA9IF9yZWYxMi5zdHlsZTtcbiAgICB2YXIgcnggPSBzaGFwZS5yeCxcbiAgICAgICAgcnkgPSBzaGFwZS5yeTtcbiAgICBzdHlsZS5ncmFwaENlbnRlciA9IFtyeCwgcnldO1xuICB9LFxuICBtb3ZlOiBmdW5jdGlvbiBtb3ZlKF9yZWYxMywgX3JlZjE0KSB7XG4gICAgdmFyIG1vdmVtZW50WCA9IF9yZWYxMy5tb3ZlbWVudFgsXG4gICAgICAgIG1vdmVtZW50WSA9IF9yZWYxMy5tb3ZlbWVudFk7XG4gICAgdmFyIHNoYXBlID0gX3JlZjE0LnNoYXBlO1xuICAgIHRoaXMuYXR0cignc2hhcGUnLCB7XG4gICAgICByeDogc2hhcGUucnggKyBtb3ZlbWVudFgsXG4gICAgICByeTogc2hhcGUucnkgKyBtb3ZlbWVudFlcbiAgICB9KTtcbiAgfVxufTtcbmV4cG9ydHMuZWxsaXBzZSA9IGVsbGlwc2U7XG52YXIgcmVjdCA9IHtcbiAgc2hhcGU6IHtcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgdzogMCxcbiAgICBoOiAwXG4gIH0sXG4gIHZhbGlkYXRvcjogZnVuY3Rpb24gdmFsaWRhdG9yKF9yZWYxNSkge1xuICAgIHZhciBzaGFwZSA9IF9yZWYxNS5zaGFwZTtcbiAgICB2YXIgeCA9IHNoYXBlLngsXG4gICAgICAgIHkgPSBzaGFwZS55LFxuICAgICAgICB3ID0gc2hhcGUudyxcbiAgICAgICAgaCA9IHNoYXBlLmg7XG5cbiAgICBpZiAodHlwZW9mIHggIT09ICdudW1iZXInIHx8IHR5cGVvZiB5ICE9PSAnbnVtYmVyJyB8fCB0eXBlb2YgdyAhPT0gJ251bWJlcicgfHwgdHlwZW9mIGggIT09ICdudW1iZXInKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdSZWN0IHNoYXBlIGNvbmZpZ3VyYXRpb24gaXMgYWJub3JtYWwhJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGRyYXc6IGZ1bmN0aW9uIGRyYXcoX3JlZjE2LCBfcmVmMTcpIHtcbiAgICB2YXIgY3R4ID0gX3JlZjE2LmN0eDtcbiAgICB2YXIgc2hhcGUgPSBfcmVmMTcuc2hhcGU7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIHZhciB4ID0gc2hhcGUueCxcbiAgICAgICAgeSA9IHNoYXBlLnksXG4gICAgICAgIHcgPSBzaGFwZS53LFxuICAgICAgICBoID0gc2hhcGUuaDtcbiAgICBjdHgucmVjdCh4LCB5LCB3LCBoKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gIH0sXG4gIGhvdmVyQ2hlY2s6IGZ1bmN0aW9uIGhvdmVyQ2hlY2socG9zaXRpb24sIF9yZWYxOCkge1xuICAgIHZhciBzaGFwZSA9IF9yZWYxOC5zaGFwZTtcbiAgICB2YXIgeCA9IHNoYXBlLngsXG4gICAgICAgIHkgPSBzaGFwZS55LFxuICAgICAgICB3ID0gc2hhcGUudyxcbiAgICAgICAgaCA9IHNoYXBlLmg7XG4gICAgcmV0dXJuICgwLCBfdXRpbC5jaGVja1BvaW50SXNJblJlY3QpKHBvc2l0aW9uLCB4LCB5LCB3LCBoKTtcbiAgfSxcbiAgc2V0R3JhcGhDZW50ZXI6IGZ1bmN0aW9uIHNldEdyYXBoQ2VudGVyKGUsIF9yZWYxOSkge1xuICAgIHZhciBzaGFwZSA9IF9yZWYxOS5zaGFwZSxcbiAgICAgICAgc3R5bGUgPSBfcmVmMTkuc3R5bGU7XG4gICAgdmFyIHggPSBzaGFwZS54LFxuICAgICAgICB5ID0gc2hhcGUueSxcbiAgICAgICAgdyA9IHNoYXBlLncsXG4gICAgICAgIGggPSBzaGFwZS5oO1xuICAgIHN0eWxlLmdyYXBoQ2VudGVyID0gW3ggKyB3IC8gMiwgeSArIGggLyAyXTtcbiAgfSxcbiAgbW92ZTogZnVuY3Rpb24gbW92ZShfcmVmMjAsIF9yZWYyMSkge1xuICAgIHZhciBtb3ZlbWVudFggPSBfcmVmMjAubW92ZW1lbnRYLFxuICAgICAgICBtb3ZlbWVudFkgPSBfcmVmMjAubW92ZW1lbnRZO1xuICAgIHZhciBzaGFwZSA9IF9yZWYyMS5zaGFwZTtcbiAgICB0aGlzLmF0dHIoJ3NoYXBlJywge1xuICAgICAgeDogc2hhcGUueCArIG1vdmVtZW50WCxcbiAgICAgIHk6IHNoYXBlLnkgKyBtb3ZlbWVudFlcbiAgICB9KTtcbiAgfVxufTtcbmV4cG9ydHMucmVjdCA9IHJlY3Q7XG52YXIgcmluZyA9IHtcbiAgc2hhcGU6IHtcbiAgICByeDogMCxcbiAgICByeTogMCxcbiAgICByOiAwXG4gIH0sXG4gIHZhbGlkYXRvcjogZnVuY3Rpb24gdmFsaWRhdG9yKF9yZWYyMikge1xuICAgIHZhciBzaGFwZSA9IF9yZWYyMi5zaGFwZTtcbiAgICB2YXIgcnggPSBzaGFwZS5yeCxcbiAgICAgICAgcnkgPSBzaGFwZS5yeSxcbiAgICAgICAgciA9IHNoYXBlLnI7XG5cbiAgICBpZiAodHlwZW9mIHJ4ICE9PSAnbnVtYmVyJyB8fCB0eXBlb2YgcnkgIT09ICdudW1iZXInIHx8IHR5cGVvZiByICE9PSAnbnVtYmVyJykge1xuICAgICAgY29uc29sZS5lcnJvcignUmluZyBzaGFwZSBjb25maWd1cmF0aW9uIGlzIGFibm9ybWFsIScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBkcmF3OiBmdW5jdGlvbiBkcmF3KF9yZWYyMywgX3JlZjI0KSB7XG4gICAgdmFyIGN0eCA9IF9yZWYyMy5jdHg7XG4gICAgdmFyIHNoYXBlID0gX3JlZjI0LnNoYXBlO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICB2YXIgcnggPSBzaGFwZS5yeCxcbiAgICAgICAgcnkgPSBzaGFwZS5yeSxcbiAgICAgICAgciA9IHNoYXBlLnI7XG4gICAgY3R4LmFyYyhyeCwgcnksIHIgPiAwID8gciA6IDAuMDEsIDAsIE1hdGguUEkgKiAyKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICB9LFxuICBob3ZlckNoZWNrOiBmdW5jdGlvbiBob3ZlckNoZWNrKHBvc2l0aW9uLCBfcmVmMjUpIHtcbiAgICB2YXIgc2hhcGUgPSBfcmVmMjUuc2hhcGUsXG4gICAgICAgIHN0eWxlID0gX3JlZjI1LnN0eWxlO1xuICAgIHZhciByeCA9IHNoYXBlLnJ4LFxuICAgICAgICByeSA9IHNoYXBlLnJ5LFxuICAgICAgICByID0gc2hhcGUucjtcbiAgICB2YXIgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoO1xuICAgIHZhciBoYWxmTGluZVdpZHRoID0gbGluZVdpZHRoIC8gMjtcbiAgICB2YXIgbWluRGlzdGFuY2UgPSByIC0gaGFsZkxpbmVXaWR0aDtcbiAgICB2YXIgbWF4RGlzdGFuY2UgPSByICsgaGFsZkxpbmVXaWR0aDtcbiAgICB2YXIgZGlzdGFuY2UgPSAoMCwgX3V0aWwuZ2V0VHdvUG9pbnREaXN0YW5jZSkocG9zaXRpb24sIFtyeCwgcnldKTtcbiAgICByZXR1cm4gZGlzdGFuY2UgPj0gbWluRGlzdGFuY2UgJiYgZGlzdGFuY2UgPD0gbWF4RGlzdGFuY2U7XG4gIH0sXG4gIHNldEdyYXBoQ2VudGVyOiBmdW5jdGlvbiBzZXRHcmFwaENlbnRlcihlLCBfcmVmMjYpIHtcbiAgICB2YXIgc2hhcGUgPSBfcmVmMjYuc2hhcGUsXG4gICAgICAgIHN0eWxlID0gX3JlZjI2LnN0eWxlO1xuICAgIHZhciByeCA9IHNoYXBlLnJ4LFxuICAgICAgICByeSA9IHNoYXBlLnJ5O1xuICAgIHN0eWxlLmdyYXBoQ2VudGVyID0gW3J4LCByeV07XG4gIH0sXG4gIG1vdmU6IGZ1bmN0aW9uIG1vdmUoX3JlZjI3LCBfcmVmMjgpIHtcbiAgICB2YXIgbW92ZW1lbnRYID0gX3JlZjI3Lm1vdmVtZW50WCxcbiAgICAgICAgbW92ZW1lbnRZID0gX3JlZjI3Lm1vdmVtZW50WTtcbiAgICB2YXIgc2hhcGUgPSBfcmVmMjguc2hhcGU7XG4gICAgdGhpcy5hdHRyKCdzaGFwZScsIHtcbiAgICAgIHJ4OiBzaGFwZS5yeCArIG1vdmVtZW50WCxcbiAgICAgIHJ5OiBzaGFwZS5yeSArIG1vdmVtZW50WVxuICAgIH0pO1xuICB9XG59O1xuZXhwb3J0cy5yaW5nID0gcmluZztcbnZhciBhcmMgPSB7XG4gIHNoYXBlOiB7XG4gICAgcng6IDAsXG4gICAgcnk6IDAsXG4gICAgcjogMCxcbiAgICBzdGFydEFuZ2xlOiAwLFxuICAgIGVuZEFuZ2xlOiAwLFxuICAgIGNsb2NrV2lzZTogdHJ1ZVxuICB9LFxuICB2YWxpZGF0b3I6IGZ1bmN0aW9uIHZhbGlkYXRvcihfcmVmMjkpIHtcbiAgICB2YXIgc2hhcGUgPSBfcmVmMjkuc2hhcGU7XG4gICAgdmFyIGtleXMgPSBbJ3J4JywgJ3J5JywgJ3InLCAnc3RhcnRBbmdsZScsICdlbmRBbmdsZSddO1xuXG4gICAgaWYgKGtleXMuZmluZChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHNoYXBlW2tleV0gIT09ICdudW1iZXInO1xuICAgIH0pKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdBcmMgc2hhcGUgY29uZmlndXJhdGlvbiBpcyBhYm5vcm1hbCEnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgZHJhdzogZnVuY3Rpb24gZHJhdyhfcmVmMzAsIF9yZWYzMSkge1xuICAgIHZhciBjdHggPSBfcmVmMzAuY3R4O1xuICAgIHZhciBzaGFwZSA9IF9yZWYzMS5zaGFwZTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgdmFyIHJ4ID0gc2hhcGUucngsXG4gICAgICAgIHJ5ID0gc2hhcGUucnksXG4gICAgICAgIHIgPSBzaGFwZS5yLFxuICAgICAgICBzdGFydEFuZ2xlID0gc2hhcGUuc3RhcnRBbmdsZSxcbiAgICAgICAgZW5kQW5nbGUgPSBzaGFwZS5lbmRBbmdsZSxcbiAgICAgICAgY2xvY2tXaXNlID0gc2hhcGUuY2xvY2tXaXNlO1xuICAgIGN0eC5hcmMocngsIHJ5LCByID4gMCA/IHIgOiAwLjAwMSwgc3RhcnRBbmdsZSwgZW5kQW5nbGUsICFjbG9ja1dpc2UpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gIH0sXG4gIGhvdmVyQ2hlY2s6IGZ1bmN0aW9uIGhvdmVyQ2hlY2socG9zaXRpb24sIF9yZWYzMikge1xuICAgIHZhciBzaGFwZSA9IF9yZWYzMi5zaGFwZSxcbiAgICAgICAgc3R5bGUgPSBfcmVmMzIuc3R5bGU7XG4gICAgdmFyIHJ4ID0gc2hhcGUucngsXG4gICAgICAgIHJ5ID0gc2hhcGUucnksXG4gICAgICAgIHIgPSBzaGFwZS5yLFxuICAgICAgICBzdGFydEFuZ2xlID0gc2hhcGUuc3RhcnRBbmdsZSxcbiAgICAgICAgZW5kQW5nbGUgPSBzaGFwZS5lbmRBbmdsZSxcbiAgICAgICAgY2xvY2tXaXNlID0gc2hhcGUuY2xvY2tXaXNlO1xuICAgIHZhciBsaW5lV2lkdGggPSBzdHlsZS5saW5lV2lkdGg7XG4gICAgdmFyIGhhbGZMaW5lV2lkdGggPSBsaW5lV2lkdGggLyAyO1xuICAgIHZhciBpbnNpZGVSYWRpdXMgPSByIC0gaGFsZkxpbmVXaWR0aDtcbiAgICB2YXIgb3V0c2lkZVJhZGl1cyA9IHIgKyBoYWxmTGluZVdpZHRoO1xuICAgIHJldHVybiAhKDAsIF91dGlsLmNoZWNrUG9pbnRJc0luU2VjdG9yKShwb3NpdGlvbiwgcngsIHJ5LCBpbnNpZGVSYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBjbG9ja1dpc2UpICYmICgwLCBfdXRpbC5jaGVja1BvaW50SXNJblNlY3RvcikocG9zaXRpb24sIHJ4LCByeSwgb3V0c2lkZVJhZGl1cywgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGNsb2NrV2lzZSk7XG4gIH0sXG4gIHNldEdyYXBoQ2VudGVyOiBmdW5jdGlvbiBzZXRHcmFwaENlbnRlcihlLCBfcmVmMzMpIHtcbiAgICB2YXIgc2hhcGUgPSBfcmVmMzMuc2hhcGUsXG4gICAgICAgIHN0eWxlID0gX3JlZjMzLnN0eWxlO1xuICAgIHZhciByeCA9IHNoYXBlLnJ4LFxuICAgICAgICByeSA9IHNoYXBlLnJ5O1xuICAgIHN0eWxlLmdyYXBoQ2VudGVyID0gW3J4LCByeV07XG4gIH0sXG4gIG1vdmU6IGZ1bmN0aW9uIG1vdmUoX3JlZjM0LCBfcmVmMzUpIHtcbiAgICB2YXIgbW92ZW1lbnRYID0gX3JlZjM0Lm1vdmVtZW50WCxcbiAgICAgICAgbW92ZW1lbnRZID0gX3JlZjM0Lm1vdmVtZW50WTtcbiAgICB2YXIgc2hhcGUgPSBfcmVmMzUuc2hhcGU7XG4gICAgdGhpcy5hdHRyKCdzaGFwZScsIHtcbiAgICAgIHJ4OiBzaGFwZS5yeCArIG1vdmVtZW50WCxcbiAgICAgIHJ5OiBzaGFwZS5yeSArIG1vdmVtZW50WVxuICAgIH0pO1xuICB9XG59O1xuZXhwb3J0cy5hcmMgPSBhcmM7XG52YXIgc2VjdG9yID0ge1xuICBzaGFwZToge1xuICAgIHJ4OiAwLFxuICAgIHJ5OiAwLFxuICAgIHI6IDAsXG4gICAgc3RhcnRBbmdsZTogMCxcbiAgICBlbmRBbmdsZTogMCxcbiAgICBjbG9ja1dpc2U6IHRydWVcbiAgfSxcbiAgdmFsaWRhdG9yOiBmdW5jdGlvbiB2YWxpZGF0b3IoX3JlZjM2KSB7XG4gICAgdmFyIHNoYXBlID0gX3JlZjM2LnNoYXBlO1xuICAgIHZhciBrZXlzID0gWydyeCcsICdyeScsICdyJywgJ3N0YXJ0QW5nbGUnLCAnZW5kQW5nbGUnXTtcblxuICAgIGlmIChrZXlzLmZpbmQoZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiBzaGFwZVtrZXldICE9PSAnbnVtYmVyJztcbiAgICB9KSkge1xuICAgICAgY29uc29sZS5lcnJvcignU2VjdG9yIHNoYXBlIGNvbmZpZ3VyYXRpb24gaXMgYWJub3JtYWwhJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGRyYXc6IGZ1bmN0aW9uIGRyYXcoX3JlZjM3LCBfcmVmMzgpIHtcbiAgICB2YXIgY3R4ID0gX3JlZjM3LmN0eDtcbiAgICB2YXIgc2hhcGUgPSBfcmVmMzguc2hhcGU7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIHZhciByeCA9IHNoYXBlLnJ4LFxuICAgICAgICByeSA9IHNoYXBlLnJ5LFxuICAgICAgICByID0gc2hhcGUucixcbiAgICAgICAgc3RhcnRBbmdsZSA9IHNoYXBlLnN0YXJ0QW5nbGUsXG4gICAgICAgIGVuZEFuZ2xlID0gc2hhcGUuZW5kQW5nbGUsXG4gICAgICAgIGNsb2NrV2lzZSA9IHNoYXBlLmNsb2NrV2lzZTtcbiAgICBjdHguYXJjKHJ4LCByeSwgciA+IDAgPyByIDogMC4wMSwgc3RhcnRBbmdsZSwgZW5kQW5nbGUsICFjbG9ja1dpc2UpO1xuICAgIGN0eC5saW5lVG8ocngsIHJ5KTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5maWxsKCk7XG4gIH0sXG4gIGhvdmVyQ2hlY2s6IGZ1bmN0aW9uIGhvdmVyQ2hlY2socG9zaXRpb24sIF9yZWYzOSkge1xuICAgIHZhciBzaGFwZSA9IF9yZWYzOS5zaGFwZTtcbiAgICB2YXIgcnggPSBzaGFwZS5yeCxcbiAgICAgICAgcnkgPSBzaGFwZS5yeSxcbiAgICAgICAgciA9IHNoYXBlLnIsXG4gICAgICAgIHN0YXJ0QW5nbGUgPSBzaGFwZS5zdGFydEFuZ2xlLFxuICAgICAgICBlbmRBbmdsZSA9IHNoYXBlLmVuZEFuZ2xlLFxuICAgICAgICBjbG9ja1dpc2UgPSBzaGFwZS5jbG9ja1dpc2U7XG4gICAgcmV0dXJuICgwLCBfdXRpbC5jaGVja1BvaW50SXNJblNlY3RvcikocG9zaXRpb24sIHJ4LCByeSwgciwgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGNsb2NrV2lzZSk7XG4gIH0sXG4gIHNldEdyYXBoQ2VudGVyOiBmdW5jdGlvbiBzZXRHcmFwaENlbnRlcihlLCBfcmVmNDApIHtcbiAgICB2YXIgc2hhcGUgPSBfcmVmNDAuc2hhcGUsXG4gICAgICAgIHN0eWxlID0gX3JlZjQwLnN0eWxlO1xuICAgIHZhciByeCA9IHNoYXBlLnJ4LFxuICAgICAgICByeSA9IHNoYXBlLnJ5O1xuICAgIHN0eWxlLmdyYXBoQ2VudGVyID0gW3J4LCByeV07XG4gIH0sXG4gIG1vdmU6IGZ1bmN0aW9uIG1vdmUoX3JlZjQxLCBfcmVmNDIpIHtcbiAgICB2YXIgbW92ZW1lbnRYID0gX3JlZjQxLm1vdmVtZW50WCxcbiAgICAgICAgbW92ZW1lbnRZID0gX3JlZjQxLm1vdmVtZW50WTtcbiAgICB2YXIgc2hhcGUgPSBfcmVmNDIuc2hhcGU7XG4gICAgdmFyIHJ4ID0gc2hhcGUucngsXG4gICAgICAgIHJ5ID0gc2hhcGUucnk7XG4gICAgdGhpcy5hdHRyKCdzaGFwZScsIHtcbiAgICAgIHJ4OiByeCArIG1vdmVtZW50WCxcbiAgICAgIHJ5OiByeSArIG1vdmVtZW50WVxuICAgIH0pO1xuICB9XG59O1xuZXhwb3J0cy5zZWN0b3IgPSBzZWN0b3I7XG52YXIgcmVnUG9seWdvbiA9IHtcbiAgc2hhcGU6IHtcbiAgICByeDogMCxcbiAgICByeTogMCxcbiAgICByOiAwLFxuICAgIHNpZGU6IDBcbiAgfSxcbiAgdmFsaWRhdG9yOiBmdW5jdGlvbiB2YWxpZGF0b3IoX3JlZjQzKSB7XG4gICAgdmFyIHNoYXBlID0gX3JlZjQzLnNoYXBlO1xuICAgIHZhciBzaWRlID0gc2hhcGUuc2lkZTtcbiAgICB2YXIga2V5cyA9IFsncngnLCAncnknLCAncicsICdzaWRlJ107XG5cbiAgICBpZiAoa2V5cy5maW5kKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygc2hhcGVba2V5XSAhPT0gJ251bWJlcic7XG4gICAgfSkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlZ1BvbHlnb24gc2hhcGUgY29uZmlndXJhdGlvbiBpcyBhYm5vcm1hbCEnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoc2lkZSA8IDMpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlZ1BvbHlnb24gYXQgbGVhc3QgdHJpZ29uIScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBkcmF3OiBmdW5jdGlvbiBkcmF3KF9yZWY0NCwgX3JlZjQ1KSB7XG4gICAgdmFyIGN0eCA9IF9yZWY0NC5jdHg7XG4gICAgdmFyIHNoYXBlID0gX3JlZjQ1LnNoYXBlLFxuICAgICAgICBjYWNoZSA9IF9yZWY0NS5jYWNoZTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgdmFyIHJ4ID0gc2hhcGUucngsXG4gICAgICAgIHJ5ID0gc2hhcGUucnksXG4gICAgICAgIHIgPSBzaGFwZS5yLFxuICAgICAgICBzaWRlID0gc2hhcGUuc2lkZTtcblxuICAgIGlmICghY2FjaGUucG9pbnRzIHx8IGNhY2hlLnJ4ICE9PSByeCB8fCBjYWNoZS5yeSAhPT0gcnkgfHwgY2FjaGUuciAhPT0gciB8fCBjYWNoZS5zaWRlICE9PSBzaWRlKSB7XG4gICAgICB2YXIgX3BvaW50cyA9ICgwLCBfdXRpbC5nZXRSZWd1bGFyUG9seWdvblBvaW50cykocngsIHJ5LCByLCBzaWRlKTtcblxuICAgICAgT2JqZWN0LmFzc2lnbihjYWNoZSwge1xuICAgICAgICBwb2ludHM6IF9wb2ludHMsXG4gICAgICAgIHJ4OiByeCxcbiAgICAgICAgcnk6IHJ5LFxuICAgICAgICByOiByLFxuICAgICAgICBzaWRlOiBzaWRlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgcG9pbnRzID0gY2FjaGUucG9pbnRzO1xuICAgICgwLCBfY2FudmFzLmRyYXdQb2x5bGluZVBhdGgpKGN0eCwgcG9pbnRzKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5maWxsKCk7XG4gIH0sXG4gIGhvdmVyQ2hlY2s6IGZ1bmN0aW9uIGhvdmVyQ2hlY2socG9zaXRpb24sIF9yZWY0Nikge1xuICAgIHZhciBjYWNoZSA9IF9yZWY0Ni5jYWNoZTtcbiAgICB2YXIgcG9pbnRzID0gY2FjaGUucG9pbnRzO1xuICAgIHJldHVybiAoMCwgX3V0aWwuY2hlY2tQb2ludElzSW5Qb2x5Z29uKShwb3NpdGlvbiwgcG9pbnRzKTtcbiAgfSxcbiAgc2V0R3JhcGhDZW50ZXI6IGZ1bmN0aW9uIHNldEdyYXBoQ2VudGVyKGUsIF9yZWY0Nykge1xuICAgIHZhciBzaGFwZSA9IF9yZWY0Ny5zaGFwZSxcbiAgICAgICAgc3R5bGUgPSBfcmVmNDcuc3R5bGU7XG4gICAgdmFyIHJ4ID0gc2hhcGUucngsXG4gICAgICAgIHJ5ID0gc2hhcGUucnk7XG4gICAgc3R5bGUuZ3JhcGhDZW50ZXIgPSBbcngsIHJ5XTtcbiAgfSxcbiAgbW92ZTogZnVuY3Rpb24gbW92ZShfcmVmNDgsIF9yZWY0OSkge1xuICAgIHZhciBtb3ZlbWVudFggPSBfcmVmNDgubW92ZW1lbnRYLFxuICAgICAgICBtb3ZlbWVudFkgPSBfcmVmNDgubW92ZW1lbnRZO1xuICAgIHZhciBzaGFwZSA9IF9yZWY0OS5zaGFwZSxcbiAgICAgICAgY2FjaGUgPSBfcmVmNDkuY2FjaGU7XG4gICAgdmFyIHJ4ID0gc2hhcGUucngsXG4gICAgICAgIHJ5ID0gc2hhcGUucnk7XG4gICAgY2FjaGUucnggKz0gbW92ZW1lbnRYO1xuICAgIGNhY2hlLnJ5ICs9IG1vdmVtZW50WTtcbiAgICB0aGlzLmF0dHIoJ3NoYXBlJywge1xuICAgICAgcng6IHJ4ICsgbW92ZW1lbnRYLFxuICAgICAgcnk6IHJ5ICsgbW92ZW1lbnRZXG4gICAgfSk7XG4gICAgY2FjaGUucG9pbnRzID0gY2FjaGUucG9pbnRzLm1hcChmdW5jdGlvbiAoX3JlZjUwKSB7XG4gICAgICB2YXIgX3JlZjUxID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9yZWY1MCwgMiksXG4gICAgICAgICAgeCA9IF9yZWY1MVswXSxcbiAgICAgICAgICB5ID0gX3JlZjUxWzFdO1xuXG4gICAgICByZXR1cm4gW3ggKyBtb3ZlbWVudFgsIHkgKyBtb3ZlbWVudFldO1xuICAgIH0pO1xuICB9XG59O1xuZXhwb3J0cy5yZWdQb2x5Z29uID0gcmVnUG9seWdvbjtcbnZhciBwb2x5bGluZSA9IHtcbiAgc2hhcGU6IHtcbiAgICBwb2ludHM6IFtdLFxuICAgIGNsb3NlOiBmYWxzZVxuICB9LFxuICB2YWxpZGF0b3I6IGZ1bmN0aW9uIHZhbGlkYXRvcihfcmVmNTIpIHtcbiAgICB2YXIgc2hhcGUgPSBfcmVmNTIuc2hhcGU7XG4gICAgdmFyIHBvaW50cyA9IHNoYXBlLnBvaW50cztcblxuICAgIGlmICghKHBvaW50cyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgY29uc29sZS5lcnJvcignUG9seWxpbmUgcG9pbnRzIHNob3VsZCBiZSBhbiBhcnJheSEnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgZHJhdzogZnVuY3Rpb24gZHJhdyhfcmVmNTMsIF9yZWY1NCkge1xuICAgIHZhciBjdHggPSBfcmVmNTMuY3R4O1xuICAgIHZhciBzaGFwZSA9IF9yZWY1NC5zaGFwZSxcbiAgICAgICAgbGluZVdpZHRoID0gX3JlZjU0LnN0eWxlLmxpbmVXaWR0aDtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgdmFyIHBvaW50cyA9IHNoYXBlLnBvaW50cyxcbiAgICAgICAgY2xvc2UgPSBzaGFwZS5jbG9zZTtcbiAgICBpZiAobGluZVdpZHRoID09PSAxKSBwb2ludHMgPSAoMCwgX3V0aWwuZWxpbWluYXRlQmx1cikocG9pbnRzKTtcbiAgICAoMCwgX2NhbnZhcy5kcmF3UG9seWxpbmVQYXRoKShjdHgsIHBvaW50cyk7XG5cbiAgICBpZiAoY2xvc2UpIHtcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gIH0sXG4gIGhvdmVyQ2hlY2s6IGZ1bmN0aW9uIGhvdmVyQ2hlY2socG9zaXRpb24sIF9yZWY1NSkge1xuICAgIHZhciBzaGFwZSA9IF9yZWY1NS5zaGFwZSxcbiAgICAgICAgc3R5bGUgPSBfcmVmNTUuc3R5bGU7XG4gICAgdmFyIHBvaW50cyA9IHNoYXBlLnBvaW50cyxcbiAgICAgICAgY2xvc2UgPSBzaGFwZS5jbG9zZTtcbiAgICB2YXIgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoO1xuXG4gICAgaWYgKGNsb3NlKSB7XG4gICAgICByZXR1cm4gKDAsIF91dGlsLmNoZWNrUG9pbnRJc0luUG9seWdvbikocG9zaXRpb24sIHBvaW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoMCwgX3V0aWwuY2hlY2tQb2ludElzTmVhclBvbHlsaW5lKShwb3NpdGlvbiwgcG9pbnRzLCBsaW5lV2lkdGgpO1xuICAgIH1cbiAgfSxcbiAgc2V0R3JhcGhDZW50ZXI6IGZ1bmN0aW9uIHNldEdyYXBoQ2VudGVyKGUsIF9yZWY1Nikge1xuICAgIHZhciBzaGFwZSA9IF9yZWY1Ni5zaGFwZSxcbiAgICAgICAgc3R5bGUgPSBfcmVmNTYuc3R5bGU7XG4gICAgdmFyIHBvaW50cyA9IHNoYXBlLnBvaW50cztcbiAgICBzdHlsZS5ncmFwaENlbnRlciA9IHBvaW50c1swXTtcbiAgfSxcbiAgbW92ZTogZnVuY3Rpb24gbW92ZShfcmVmNTcsIF9yZWY1OCkge1xuICAgIHZhciBtb3ZlbWVudFggPSBfcmVmNTcubW92ZW1lbnRYLFxuICAgICAgICBtb3ZlbWVudFkgPSBfcmVmNTcubW92ZW1lbnRZO1xuICAgIHZhciBzaGFwZSA9IF9yZWY1OC5zaGFwZTtcbiAgICB2YXIgcG9pbnRzID0gc2hhcGUucG9pbnRzO1xuICAgIHZhciBtb3ZlQWZ0ZXJQb2ludHMgPSBwb2ludHMubWFwKGZ1bmN0aW9uIChfcmVmNTkpIHtcbiAgICAgIHZhciBfcmVmNjAgPSAoMCwgX3NsaWNlZFRvQXJyYXkyW1wiZGVmYXVsdFwiXSkoX3JlZjU5LCAyKSxcbiAgICAgICAgICB4ID0gX3JlZjYwWzBdLFxuICAgICAgICAgIHkgPSBfcmVmNjBbMV07XG5cbiAgICAgIHJldHVybiBbeCArIG1vdmVtZW50WCwgeSArIG1vdmVtZW50WV07XG4gICAgfSk7XG4gICAgdGhpcy5hdHRyKCdzaGFwZScsIHtcbiAgICAgIHBvaW50czogbW92ZUFmdGVyUG9pbnRzXG4gICAgfSk7XG4gIH1cbn07XG5leHBvcnRzLnBvbHlsaW5lID0gcG9seWxpbmU7XG52YXIgc21vb3RobGluZSA9IHtcbiAgc2hhcGU6IHtcbiAgICBwb2ludHM6IFtdLFxuICAgIGNsb3NlOiBmYWxzZVxuICB9LFxuICB2YWxpZGF0b3I6IGZ1bmN0aW9uIHZhbGlkYXRvcihfcmVmNjEpIHtcbiAgICB2YXIgc2hhcGUgPSBfcmVmNjEuc2hhcGU7XG4gICAgdmFyIHBvaW50cyA9IHNoYXBlLnBvaW50cztcblxuICAgIGlmICghKHBvaW50cyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgY29uc29sZS5lcnJvcignU21vb3RobGluZSBwb2ludHMgc2hvdWxkIGJlIGFuIGFycmF5IScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBkcmF3OiBmdW5jdGlvbiBkcmF3KF9yZWY2MiwgX3JlZjYzKSB7XG4gICAgdmFyIGN0eCA9IF9yZWY2Mi5jdHg7XG4gICAgdmFyIHNoYXBlID0gX3JlZjYzLnNoYXBlLFxuICAgICAgICBjYWNoZSA9IF9yZWY2My5jYWNoZTtcbiAgICB2YXIgcG9pbnRzID0gc2hhcGUucG9pbnRzLFxuICAgICAgICBjbG9zZSA9IHNoYXBlLmNsb3NlO1xuXG4gICAgaWYgKCFjYWNoZS5wb2ludHMgfHwgY2FjaGUucG9pbnRzLnRvU3RyaW5nKCkgIT09IHBvaW50cy50b1N0cmluZygpKSB7XG4gICAgICB2YXIgX2JlemllckN1cnZlID0gcG9seWxpbmVUb0JlemllckN1cnZlKHBvaW50cywgY2xvc2UpO1xuXG4gICAgICB2YXIgaG92ZXJQb2ludHMgPSBiZXppZXJDdXJ2ZVRvUG9seWxpbmUoX2JlemllckN1cnZlKTtcbiAgICAgIE9iamVjdC5hc3NpZ24oY2FjaGUsIHtcbiAgICAgICAgcG9pbnRzOiAoMCwgX3V0aWwuZGVlcENsb25lKShwb2ludHMsIHRydWUpLFxuICAgICAgICBiZXppZXJDdXJ2ZTogX2JlemllckN1cnZlLFxuICAgICAgICBob3ZlclBvaW50czogaG92ZXJQb2ludHNcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBiZXppZXJDdXJ2ZSA9IGNhY2hlLmJlemllckN1cnZlO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAoMCwgX2NhbnZhcy5kcmF3QmV6aWVyQ3VydmVQYXRoKShjdHgsIGJlemllckN1cnZlLnNsaWNlKDEpLCBiZXppZXJDdXJ2ZVswXSk7XG5cbiAgICBpZiAoY2xvc2UpIHtcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gIH0sXG4gIGhvdmVyQ2hlY2s6IGZ1bmN0aW9uIGhvdmVyQ2hlY2socG9zaXRpb24sIF9yZWY2NCkge1xuICAgIHZhciBjYWNoZSA9IF9yZWY2NC5jYWNoZSxcbiAgICAgICAgc2hhcGUgPSBfcmVmNjQuc2hhcGUsXG4gICAgICAgIHN0eWxlID0gX3JlZjY0LnN0eWxlO1xuICAgIHZhciBob3ZlclBvaW50cyA9IGNhY2hlLmhvdmVyUG9pbnRzO1xuICAgIHZhciBjbG9zZSA9IHNoYXBlLmNsb3NlO1xuICAgIHZhciBsaW5lV2lkdGggPSBzdHlsZS5saW5lV2lkdGg7XG5cbiAgICBpZiAoY2xvc2UpIHtcbiAgICAgIHJldHVybiAoMCwgX3V0aWwuY2hlY2tQb2ludElzSW5Qb2x5Z29uKShwb3NpdGlvbiwgaG92ZXJQb2ludHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKDAsIF91dGlsLmNoZWNrUG9pbnRJc05lYXJQb2x5bGluZSkocG9zaXRpb24sIGhvdmVyUG9pbnRzLCBsaW5lV2lkdGgpO1xuICAgIH1cbiAgfSxcbiAgc2V0R3JhcGhDZW50ZXI6IGZ1bmN0aW9uIHNldEdyYXBoQ2VudGVyKGUsIF9yZWY2NSkge1xuICAgIHZhciBzaGFwZSA9IF9yZWY2NS5zaGFwZSxcbiAgICAgICAgc3R5bGUgPSBfcmVmNjUuc3R5bGU7XG4gICAgdmFyIHBvaW50cyA9IHNoYXBlLnBvaW50cztcbiAgICBzdHlsZS5ncmFwaENlbnRlciA9IHBvaW50c1swXTtcbiAgfSxcbiAgbW92ZTogZnVuY3Rpb24gbW92ZShfcmVmNjYsIF9yZWY2Nykge1xuICAgIHZhciBtb3ZlbWVudFggPSBfcmVmNjYubW92ZW1lbnRYLFxuICAgICAgICBtb3ZlbWVudFkgPSBfcmVmNjYubW92ZW1lbnRZO1xuICAgIHZhciBzaGFwZSA9IF9yZWY2Ny5zaGFwZSxcbiAgICAgICAgY2FjaGUgPSBfcmVmNjcuY2FjaGU7XG4gICAgdmFyIHBvaW50cyA9IHNoYXBlLnBvaW50cztcbiAgICB2YXIgbW92ZUFmdGVyUG9pbnRzID0gcG9pbnRzLm1hcChmdW5jdGlvbiAoX3JlZjY4KSB7XG4gICAgICB2YXIgX3JlZjY5ID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9yZWY2OCwgMiksXG4gICAgICAgICAgeCA9IF9yZWY2OVswXSxcbiAgICAgICAgICB5ID0gX3JlZjY5WzFdO1xuXG4gICAgICByZXR1cm4gW3ggKyBtb3ZlbWVudFgsIHkgKyBtb3ZlbWVudFldO1xuICAgIH0pO1xuICAgIGNhY2hlLnBvaW50cyA9IG1vdmVBZnRlclBvaW50cztcblxuICAgIHZhciBfY2FjaGUkYmV6aWVyQ3VydmUkID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKGNhY2hlLmJlemllckN1cnZlWzBdLCAyKSxcbiAgICAgICAgZnggPSBfY2FjaGUkYmV6aWVyQ3VydmUkWzBdLFxuICAgICAgICBmeSA9IF9jYWNoZSRiZXppZXJDdXJ2ZSRbMV07XG5cbiAgICB2YXIgY3VydmVzID0gY2FjaGUuYmV6aWVyQ3VydmUuc2xpY2UoMSk7XG4gICAgY2FjaGUuYmV6aWVyQ3VydmUgPSBbW2Z4ICsgbW92ZW1lbnRYLCBmeSArIG1vdmVtZW50WV1dLmNvbmNhdCgoMCwgX3RvQ29uc3VtYWJsZUFycmF5MltcImRlZmF1bHRcIl0pKGN1cnZlcy5tYXAoZnVuY3Rpb24gKGN1cnZlKSB7XG4gICAgICByZXR1cm4gY3VydmUubWFwKGZ1bmN0aW9uIChfcmVmNzApIHtcbiAgICAgICAgdmFyIF9yZWY3MSA9ICgwLCBfc2xpY2VkVG9BcnJheTJbXCJkZWZhdWx0XCJdKShfcmVmNzAsIDIpLFxuICAgICAgICAgICAgeCA9IF9yZWY3MVswXSxcbiAgICAgICAgICAgIHkgPSBfcmVmNzFbMV07XG5cbiAgICAgICAgcmV0dXJuIFt4ICsgbW92ZW1lbnRYLCB5ICsgbW92ZW1lbnRZXTtcbiAgICAgIH0pO1xuICAgIH0pKSk7XG4gICAgY2FjaGUuaG92ZXJQb2ludHMgPSBjYWNoZS5ob3ZlclBvaW50cy5tYXAoZnVuY3Rpb24gKF9yZWY3Mikge1xuICAgICAgdmFyIF9yZWY3MyA9ICgwLCBfc2xpY2VkVG9BcnJheTJbXCJkZWZhdWx0XCJdKShfcmVmNzIsIDIpLFxuICAgICAgICAgIHggPSBfcmVmNzNbMF0sXG4gICAgICAgICAgeSA9IF9yZWY3M1sxXTtcblxuICAgICAgcmV0dXJuIFt4ICsgbW92ZW1lbnRYLCB5ICsgbW92ZW1lbnRZXTtcbiAgICB9KTtcbiAgICB0aGlzLmF0dHIoJ3NoYXBlJywge1xuICAgICAgcG9pbnRzOiBtb3ZlQWZ0ZXJQb2ludHNcbiAgICB9KTtcbiAgfVxufTtcbmV4cG9ydHMuc21vb3RobGluZSA9IHNtb290aGxpbmU7XG52YXIgYmV6aWVyQ3VydmUgPSB7XG4gIHNoYXBlOiB7XG4gICAgcG9pbnRzOiBbXSxcbiAgICBjbG9zZTogZmFsc2VcbiAgfSxcbiAgdmFsaWRhdG9yOiBmdW5jdGlvbiB2YWxpZGF0b3IoX3JlZjc0KSB7XG4gICAgdmFyIHNoYXBlID0gX3JlZjc0LnNoYXBlO1xuICAgIHZhciBwb2ludHMgPSBzaGFwZS5wb2ludHM7XG5cbiAgICBpZiAoIShwb2ludHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0JlemllckN1cnZlIHBvaW50cyBzaG91bGQgYmUgYW4gYXJyYXkhJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGRyYXc6IGZ1bmN0aW9uIGRyYXcoX3JlZjc1LCBfcmVmNzYpIHtcbiAgICB2YXIgY3R4ID0gX3JlZjc1LmN0eDtcbiAgICB2YXIgc2hhcGUgPSBfcmVmNzYuc2hhcGUsXG4gICAgICAgIGNhY2hlID0gX3JlZjc2LmNhY2hlO1xuICAgIHZhciBwb2ludHMgPSBzaGFwZS5wb2ludHMsXG4gICAgICAgIGNsb3NlID0gc2hhcGUuY2xvc2U7XG5cbiAgICBpZiAoIWNhY2hlLnBvaW50cyB8fCBjYWNoZS5wb2ludHMudG9TdHJpbmcoKSAhPT0gcG9pbnRzLnRvU3RyaW5nKCkpIHtcbiAgICAgIHZhciBob3ZlclBvaW50cyA9IGJlemllckN1cnZlVG9Qb2x5bGluZShwb2ludHMsIDIwKTtcbiAgICAgIE9iamVjdC5hc3NpZ24oY2FjaGUsIHtcbiAgICAgICAgcG9pbnRzOiAoMCwgX3V0aWwuZGVlcENsb25lKShwb2ludHMsIHRydWUpLFxuICAgICAgICBob3ZlclBvaW50czogaG92ZXJQb2ludHNcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAoMCwgX2NhbnZhcy5kcmF3QmV6aWVyQ3VydmVQYXRoKShjdHgsIHBvaW50cy5zbGljZSgxKSwgcG9pbnRzWzBdKTtcblxuICAgIGlmIChjbG9zZSkge1xuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgfSxcbiAgaG92ZXJDaGVjazogZnVuY3Rpb24gaG92ZXJDaGVjayhwb3NpdGlvbiwgX3JlZjc3KSB7XG4gICAgdmFyIGNhY2hlID0gX3JlZjc3LmNhY2hlLFxuICAgICAgICBzaGFwZSA9IF9yZWY3Ny5zaGFwZSxcbiAgICAgICAgc3R5bGUgPSBfcmVmNzcuc3R5bGU7XG4gICAgdmFyIGhvdmVyUG9pbnRzID0gY2FjaGUuaG92ZXJQb2ludHM7XG4gICAgdmFyIGNsb3NlID0gc2hhcGUuY2xvc2U7XG4gICAgdmFyIGxpbmVXaWR0aCA9IHN0eWxlLmxpbmVXaWR0aDtcblxuICAgIGlmIChjbG9zZSkge1xuICAgICAgcmV0dXJuICgwLCBfdXRpbC5jaGVja1BvaW50SXNJblBvbHlnb24pKHBvc2l0aW9uLCBob3ZlclBvaW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoMCwgX3V0aWwuY2hlY2tQb2ludElzTmVhclBvbHlsaW5lKShwb3NpdGlvbiwgaG92ZXJQb2ludHMsIGxpbmVXaWR0aCk7XG4gICAgfVxuICB9LFxuICBzZXRHcmFwaENlbnRlcjogZnVuY3Rpb24gc2V0R3JhcGhDZW50ZXIoZSwgX3JlZjc4KSB7XG4gICAgdmFyIHNoYXBlID0gX3JlZjc4LnNoYXBlLFxuICAgICAgICBzdHlsZSA9IF9yZWY3OC5zdHlsZTtcbiAgICB2YXIgcG9pbnRzID0gc2hhcGUucG9pbnRzO1xuICAgIHN0eWxlLmdyYXBoQ2VudGVyID0gcG9pbnRzWzBdO1xuICB9LFxuICBtb3ZlOiBmdW5jdGlvbiBtb3ZlKF9yZWY3OSwgX3JlZjgwKSB7XG4gICAgdmFyIG1vdmVtZW50WCA9IF9yZWY3OS5tb3ZlbWVudFgsXG4gICAgICAgIG1vdmVtZW50WSA9IF9yZWY3OS5tb3ZlbWVudFk7XG4gICAgdmFyIHNoYXBlID0gX3JlZjgwLnNoYXBlLFxuICAgICAgICBjYWNoZSA9IF9yZWY4MC5jYWNoZTtcbiAgICB2YXIgcG9pbnRzID0gc2hhcGUucG9pbnRzO1xuXG4gICAgdmFyIF9wb2ludHMkID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKHBvaW50c1swXSwgMiksXG4gICAgICAgIGZ4ID0gX3BvaW50cyRbMF0sXG4gICAgICAgIGZ5ID0gX3BvaW50cyRbMV07XG5cbiAgICB2YXIgY3VydmVzID0gcG9pbnRzLnNsaWNlKDEpO1xuICAgIHZhciBiZXppZXJDdXJ2ZSA9IFtbZnggKyBtb3ZlbWVudFgsIGZ5ICsgbW92ZW1lbnRZXV0uY29uY2F0KCgwLCBfdG9Db25zdW1hYmxlQXJyYXkyW1wiZGVmYXVsdFwiXSkoY3VydmVzLm1hcChmdW5jdGlvbiAoY3VydmUpIHtcbiAgICAgIHJldHVybiBjdXJ2ZS5tYXAoZnVuY3Rpb24gKF9yZWY4MSkge1xuICAgICAgICB2YXIgX3JlZjgyID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9yZWY4MSwgMiksXG4gICAgICAgICAgICB4ID0gX3JlZjgyWzBdLFxuICAgICAgICAgICAgeSA9IF9yZWY4MlsxXTtcblxuICAgICAgICByZXR1cm4gW3ggKyBtb3ZlbWVudFgsIHkgKyBtb3ZlbWVudFldO1xuICAgICAgfSk7XG4gICAgfSkpKTtcbiAgICBjYWNoZS5wb2ludHMgPSBiZXppZXJDdXJ2ZTtcbiAgICBjYWNoZS5ob3ZlclBvaW50cyA9IGNhY2hlLmhvdmVyUG9pbnRzLm1hcChmdW5jdGlvbiAoX3JlZjgzKSB7XG4gICAgICB2YXIgX3JlZjg0ID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9yZWY4MywgMiksXG4gICAgICAgICAgeCA9IF9yZWY4NFswXSxcbiAgICAgICAgICB5ID0gX3JlZjg0WzFdO1xuXG4gICAgICByZXR1cm4gW3ggKyBtb3ZlbWVudFgsIHkgKyBtb3ZlbWVudFldO1xuICAgIH0pO1xuICAgIHRoaXMuYXR0cignc2hhcGUnLCB7XG4gICAgICBwb2ludHM6IGJlemllckN1cnZlXG4gICAgfSk7XG4gIH1cbn07XG5leHBvcnRzLmJlemllckN1cnZlID0gYmV6aWVyQ3VydmU7XG52YXIgdGV4dCA9IHtcbiAgc2hhcGU6IHtcbiAgICBjb250ZW50OiAnJyxcbiAgICBwb3NpdGlvbjogW10sXG4gICAgbWF4V2lkdGg6IHVuZGVmaW5lZCxcbiAgICByb3dHYXA6IDBcbiAgfSxcbiAgdmFsaWRhdG9yOiBmdW5jdGlvbiB2YWxpZGF0b3IoX3JlZjg1KSB7XG4gICAgdmFyIHNoYXBlID0gX3JlZjg1LnNoYXBlO1xuICAgIHZhciBjb250ZW50ID0gc2hhcGUuY29udGVudCxcbiAgICAgICAgcG9zaXRpb24gPSBzaGFwZS5wb3NpdGlvbixcbiAgICAgICAgcm93R2FwID0gc2hhcGUucm93R2FwO1xuXG4gICAgaWYgKHR5cGVvZiBjb250ZW50ICE9PSAnc3RyaW5nJykge1xuICAgICAgY29uc29sZS5lcnJvcignVGV4dCBjb250ZW50IHNob3VsZCBiZSBhIHN0cmluZyEnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIShwb3NpdGlvbiBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgY29uc29sZS5lcnJvcignVGV4dCBwb3NpdGlvbiBzaG91bGQgYmUgYW4gYXJyYXkhJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiByb3dHYXAgIT09ICdudW1iZXInKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXh0IHJvd0dhcCBzaG91bGQgYmUgYSBudW1iZXIhJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGRyYXc6IGZ1bmN0aW9uIGRyYXcoX3JlZjg2LCBfcmVmODcpIHtcbiAgICB2YXIgY3R4ID0gX3JlZjg2LmN0eDtcbiAgICB2YXIgc2hhcGUgPSBfcmVmODcuc2hhcGU7XG4gICAgdmFyIGNvbnRlbnQgPSBzaGFwZS5jb250ZW50LFxuICAgICAgICBwb3NpdGlvbiA9IHNoYXBlLnBvc2l0aW9uLFxuICAgICAgICBtYXhXaWR0aCA9IHNoYXBlLm1heFdpZHRoLFxuICAgICAgICByb3dHYXAgPSBzaGFwZS5yb3dHYXA7XG4gICAgdmFyIHRleHRCYXNlbGluZSA9IGN0eC50ZXh0QmFzZWxpbmUsXG4gICAgICAgIGZvbnQgPSBjdHguZm9udDtcbiAgICB2YXIgZm9udFNpemUgPSBwYXJzZUludChmb250LnJlcGxhY2UoL1xcRC9nLCAnJykpO1xuXG4gICAgdmFyIF9wb3NpdGlvbiA9IHBvc2l0aW9uLFxuICAgICAgICBfcG9zaXRpb24yID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9wb3NpdGlvbiwgMiksXG4gICAgICAgIHggPSBfcG9zaXRpb24yWzBdLFxuICAgICAgICB5ID0gX3Bvc2l0aW9uMlsxXTtcblxuICAgIGNvbnRlbnQgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcbiAgICB2YXIgcm93TnVtID0gY29udGVudC5sZW5ndGg7XG4gICAgdmFyIGxpbmVIZWlnaHQgPSBmb250U2l6ZSArIHJvd0dhcDtcbiAgICB2YXIgYWxsSGVpZ2h0ID0gcm93TnVtICogbGluZUhlaWdodCAtIHJvd0dhcDtcbiAgICB2YXIgb2Zmc2V0ID0gMDtcblxuICAgIGlmICh0ZXh0QmFzZWxpbmUgPT09ICdtaWRkbGUnKSB7XG4gICAgICBvZmZzZXQgPSBhbGxIZWlnaHQgLyAyO1xuICAgICAgeSArPSBmb250U2l6ZSAvIDI7XG4gICAgfVxuXG4gICAgaWYgKHRleHRCYXNlbGluZSA9PT0gJ2JvdHRvbScpIHtcbiAgICAgIG9mZnNldCA9IGFsbEhlaWdodDtcbiAgICAgIHkgKz0gZm9udFNpemU7XG4gICAgfVxuXG4gICAgcG9zaXRpb24gPSBuZXcgQXJyYXkocm93TnVtKS5maWxsKDApLm1hcChmdW5jdGlvbiAoZm9vLCBpKSB7XG4gICAgICByZXR1cm4gW3gsIHkgKyBpICogbGluZUhlaWdodCAtIG9mZnNldF07XG4gICAgfSk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGNvbnRlbnQuZm9yRWFjaChmdW5jdGlvbiAodGV4dCwgaSkge1xuICAgICAgY3R4LmZpbGxUZXh0LmFwcGx5KGN0eCwgW3RleHRdLmNvbmNhdCgoMCwgX3RvQ29uc3VtYWJsZUFycmF5MltcImRlZmF1bHRcIl0pKHBvc2l0aW9uW2ldKSwgW21heFdpZHRoXSkpO1xuICAgICAgY3R4LnN0cm9rZVRleHQuYXBwbHkoY3R4LCBbdGV4dF0uY29uY2F0KCgwLCBfdG9Db25zdW1hYmxlQXJyYXkyW1wiZGVmYXVsdFwiXSkocG9zaXRpb25baV0pLCBbbWF4V2lkdGhdKSk7XG4gICAgfSk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICB9LFxuICBob3ZlckNoZWNrOiBmdW5jdGlvbiBob3ZlckNoZWNrKHBvc2l0aW9uLCBfcmVmODgpIHtcbiAgICB2YXIgc2hhcGUgPSBfcmVmODguc2hhcGUsXG4gICAgICAgIHN0eWxlID0gX3JlZjg4LnN0eWxlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgc2V0R3JhcGhDZW50ZXI6IGZ1bmN0aW9uIHNldEdyYXBoQ2VudGVyKGUsIF9yZWY4OSkge1xuICAgIHZhciBzaGFwZSA9IF9yZWY4OS5zaGFwZSxcbiAgICAgICAgc3R5bGUgPSBfcmVmODkuc3R5bGU7XG4gICAgdmFyIHBvc2l0aW9uID0gc2hhcGUucG9zaXRpb247XG4gICAgc3R5bGUuZ3JhcGhDZW50ZXIgPSAoMCwgX3RvQ29uc3VtYWJsZUFycmF5MltcImRlZmF1bHRcIl0pKHBvc2l0aW9uKTtcbiAgfSxcbiAgbW92ZTogZnVuY3Rpb24gbW92ZShfcmVmOTAsIF9yZWY5MSkge1xuICAgIHZhciBtb3ZlbWVudFggPSBfcmVmOTAubW92ZW1lbnRYLFxuICAgICAgICBtb3ZlbWVudFkgPSBfcmVmOTAubW92ZW1lbnRZO1xuICAgIHZhciBzaGFwZSA9IF9yZWY5MS5zaGFwZTtcblxuICAgIHZhciBfc2hhcGUkcG9zaXRpb24gPSAoMCwgX3NsaWNlZFRvQXJyYXkyW1wiZGVmYXVsdFwiXSkoc2hhcGUucG9zaXRpb24sIDIpLFxuICAgICAgICB4ID0gX3NoYXBlJHBvc2l0aW9uWzBdLFxuICAgICAgICB5ID0gX3NoYXBlJHBvc2l0aW9uWzFdO1xuXG4gICAgdGhpcy5hdHRyKCdzaGFwZScsIHtcbiAgICAgIHBvc2l0aW9uOiBbeCArIG1vdmVtZW50WCwgeSArIG1vdmVtZW50WV1cbiAgICB9KTtcbiAgfVxufTtcbmV4cG9ydHMudGV4dCA9IHRleHQ7XG52YXIgZ3JhcGhzID0gbmV3IE1hcChbWydjaXJjbGUnLCBjaXJjbGVdLCBbJ2VsbGlwc2UnLCBlbGxpcHNlXSwgWydyZWN0JywgcmVjdF0sIFsncmluZycsIHJpbmddLCBbJ2FyYycsIGFyY10sIFsnc2VjdG9yJywgc2VjdG9yXSwgWydyZWdQb2x5Z29uJywgcmVnUG9seWdvbl0sIFsncG9seWxpbmUnLCBwb2x5bGluZV0sIFsnc21vb3RobGluZScsIHNtb290aGxpbmVdLCBbJ2JlemllckN1cnZlJywgYmV6aWVyQ3VydmVdLCBbJ3RleHQnLCB0ZXh0XV0pO1xudmFyIF9kZWZhdWx0ID0gZ3JhcGhzO1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gRXh0ZW5kIG5ldyBncmFwaFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICBOYW1lIG9mIEdyYXBoXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIENvbmZpZ3VyYXRpb24gb2YgR3JhcGhcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH0gVm9pZFxuICovXG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbmZ1bmN0aW9uIGV4dGVuZE5ld0dyYXBoKG5hbWUsIGNvbmZpZykge1xuICBpZiAoIW5hbWUgfHwgIWNvbmZpZykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0V4dGVuZE5ld0dyYXBoIE1pc3NpbmcgUGFyYW1ldGVycyEnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIWNvbmZpZy5zaGFwZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVpcmVkIGF0dHJpYnV0ZSBvZiBzaGFwZSB0byBleHRlbmROZXdHcmFwaCEnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIWNvbmZpZy52YWxpZGF0b3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdSZXF1aXJlZCBmdW5jdGlvbiBvZiB2YWxpZGF0b3IgdG8gZXh0ZW5kTmV3R3JhcGghJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFjb25maWcuZHJhdykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVpcmVkIGZ1bmN0aW9uIG9mIGRyYXcgdG8gZXh0ZW5kTmV3R3JhcGghJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZ3JhcGhzLnNldChuYW1lLCBjb25maWcpO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdFwiKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIkNSZW5kZXJcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NyZW5kZXJbXCJkZWZhdWx0XCJdO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImV4dGVuZE5ld0dyYXBoXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9ncmFwaHMuZXh0ZW5kTmV3R3JhcGg7XG4gIH1cbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfY3JlbmRlciA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vY2xhc3MvY3JlbmRlci5jbGFzc1wiKSk7XG5cbnZhciBfZ3JhcGhzID0gcmVxdWlyZShcIi4vY29uZmlnL2dyYXBoc1wiKTtcblxudmFyIF9kZWZhdWx0ID0gX2NyZW5kZXJbXCJkZWZhdWx0XCJdO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHRcIik7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRyYXdQb2x5bGluZVBhdGggPSBkcmF3UG9seWxpbmVQYXRoO1xuZXhwb3J0cy5kcmF3QmV6aWVyQ3VydmVQYXRoID0gZHJhd0JlemllckN1cnZlUGF0aDtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX3RvQ29uc3VtYWJsZUFycmF5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvdG9Db25zdW1hYmxlQXJyYXlcIikpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBEcmF3IGEgcG9seWxpbmUgcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IGN0eCAgICAgICAgQ2FudmFzIDJkIGNvbnRleHRcbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50cyAgICAgIFRoZSBwb2ludHMgdGhhdCBtYWtlcyB1cCBhIHBvbHlsaW5lXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGJlZ2luUGF0aCBXaGV0aGVyIHRvIGV4ZWN1dGUgYmVnaW5QYXRoXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNsb3NlUGF0aCBXaGV0aGVyIHRvIGV4ZWN1dGUgY2xvc2VQYXRoXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9IFZvaWRcbiAqL1xuZnVuY3Rpb24gZHJhd1BvbHlsaW5lUGF0aChjdHgsIHBvaW50cykge1xuICB2YXIgYmVnaW5QYXRoID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmYWxzZTtcbiAgdmFyIGNsb3NlUGF0aCA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogZmFsc2U7XG4gIGlmICghY3R4IHx8IHBvaW50cy5sZW5ndGggPCAyKSByZXR1cm4gZmFsc2U7XG4gIGlmIChiZWdpblBhdGgpIGN0eC5iZWdpblBhdGgoKTtcbiAgcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKHBvaW50LCBpKSB7XG4gICAgcmV0dXJuIHBvaW50ICYmIChpID09PSAwID8gY3R4Lm1vdmVUby5hcHBseShjdHgsICgwLCBfdG9Db25zdW1hYmxlQXJyYXkyW1wiZGVmYXVsdFwiXSkocG9pbnQpKSA6IGN0eC5saW5lVG8uYXBwbHkoY3R4LCAoMCwgX3RvQ29uc3VtYWJsZUFycmF5MltcImRlZmF1bHRcIl0pKHBvaW50KSkpO1xuICB9KTtcbiAgaWYgKGNsb3NlUGF0aCkgY3R4LmNsb3NlUGF0aCgpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gRHJhdyBhIGJlemllciBjdXJ2ZSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gY3R4ICAgICAgICBDYW52YXMgMmQgY29udGV4dFxuICogQHBhcmFtIHtBcnJheX0gcG9pbnRzICAgICAgVGhlIHBvaW50cyB0aGF0IG1ha2VzIHVwIGEgYmV6aWVyIGN1cnZlXG4gKiBAcGFyYW0ge0FycmF5fSBtb3ZlVG8gICAgICBUaGUgcG9pbnQgbmVlZCB0byBleGN1dGUgbW92ZVRvXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGJlZ2luUGF0aCBXaGV0aGVyIHRvIGV4ZWN1dGUgYmVnaW5QYXRoXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNsb3NlUGF0aCBXaGV0aGVyIHRvIGV4ZWN1dGUgY2xvc2VQYXRoXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9IFZvaWRcbiAqL1xuXG5cbmZ1bmN0aW9uIGRyYXdCZXppZXJDdXJ2ZVBhdGgoY3R4LCBwb2ludHMpIHtcbiAgdmFyIG1vdmVUbyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XG4gIHZhciBiZWdpblBhdGggPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IGZhbHNlO1xuICB2YXIgY2xvc2VQYXRoID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiBmYWxzZTtcbiAgaWYgKCFjdHggfHwgIXBvaW50cykgcmV0dXJuIGZhbHNlO1xuICBpZiAoYmVnaW5QYXRoKSBjdHguYmVnaW5QYXRoKCk7XG4gIGlmIChtb3ZlVG8pIGN0eC5tb3ZlVG8uYXBwbHkoY3R4LCAoMCwgX3RvQ29uc3VtYWJsZUFycmF5MltcImRlZmF1bHRcIl0pKG1vdmVUbykpO1xuICBwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBpdGVtICYmIGN0eC5iZXppZXJDdXJ2ZVRvLmFwcGx5KGN0eCwgKDAsIF90b0NvbnN1bWFibGVBcnJheTJbXCJkZWZhdWx0XCJdKShpdGVtWzBdKS5jb25jYXQoKDAsIF90b0NvbnN1bWFibGVBcnJheTJbXCJkZWZhdWx0XCJdKShpdGVtWzFdKSwgKDAsIF90b0NvbnN1bWFibGVBcnJheTJbXCJkZWZhdWx0XCJdKShpdGVtWzJdKSkpO1xuICB9KTtcbiAgaWYgKGNsb3NlUGF0aCkgY3R4LmNsb3NlUGF0aCgpO1xufVxuXG52YXIgX2RlZmF1bHQgPSB7XG4gIGRyYXdQb2x5bGluZVBhdGg6IGRyYXdQb2x5bGluZVBhdGgsXG4gIGRyYXdCZXppZXJDdXJ2ZVBhdGg6IGRyYXdCZXppZXJDdXJ2ZVBhdGhcbn07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdFwiKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVlcENsb25lID0gZGVlcENsb25lO1xuZXhwb3J0cy5lbGltaW5hdGVCbHVyID0gZWxpbWluYXRlQmx1cjtcbmV4cG9ydHMuY2hlY2tQb2ludElzSW5DaXJjbGUgPSBjaGVja1BvaW50SXNJbkNpcmNsZTtcbmV4cG9ydHMuZ2V0VHdvUG9pbnREaXN0YW5jZSA9IGdldFR3b1BvaW50RGlzdGFuY2U7XG5leHBvcnRzLmNoZWNrUG9pbnRJc0luUG9seWdvbiA9IGNoZWNrUG9pbnRJc0luUG9seWdvbjtcbmV4cG9ydHMuY2hlY2tQb2ludElzSW5TZWN0b3IgPSBjaGVja1BvaW50SXNJblNlY3RvcjtcbmV4cG9ydHMuY2hlY2tQb2ludElzTmVhclBvbHlsaW5lID0gY2hlY2tQb2ludElzTmVhclBvbHlsaW5lO1xuZXhwb3J0cy5jaGVja1BvaW50SXNJblJlY3QgPSBjaGVja1BvaW50SXNJblJlY3Q7XG5leHBvcnRzLmdldFJvdGF0ZVBvaW50UG9zID0gZ2V0Um90YXRlUG9pbnRQb3M7XG5leHBvcnRzLmdldFNjYWxlUG9pbnRQb3MgPSBnZXRTY2FsZVBvaW50UG9zO1xuZXhwb3J0cy5nZXRUcmFuc2xhdGVQb2ludFBvcyA9IGdldFRyYW5zbGF0ZVBvaW50UG9zO1xuZXhwb3J0cy5nZXREaXN0YW5jZUJldHdlZW5Qb2ludEFuZExpbmUgPSBnZXREaXN0YW5jZUJldHdlZW5Qb2ludEFuZExpbmU7XG5leHBvcnRzLmdldENpcmNsZVJhZGlhblBvaW50ID0gZ2V0Q2lyY2xlUmFkaWFuUG9pbnQ7XG5leHBvcnRzLmdldFJlZ3VsYXJQb2x5Z29uUG9pbnRzID0gZ2V0UmVndWxhclBvbHlnb25Qb2ludHM7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF90b0NvbnN1bWFibGVBcnJheTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5XCIpKTtcblxudmFyIF9zbGljZWRUb0FycmF5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheVwiKSk7XG5cbnZhciBfdHlwZW9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvdHlwZW9mXCIpKTtcblxudmFyIGFicyA9IE1hdGguYWJzLFxuICAgIHNxcnQgPSBNYXRoLnNxcnQsXG4gICAgc2luID0gTWF0aC5zaW4sXG4gICAgY29zID0gTWF0aC5jb3MsXG4gICAgbWF4ID0gTWF0aC5tYXgsXG4gICAgbWluID0gTWF0aC5taW4sXG4gICAgUEkgPSBNYXRoLlBJO1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gQ2xvbmUgYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqZWN0IENsb25lZCBvYmplY3RcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVjdXJzaW9uICAgV2hldGhlciB0byB1c2UgcmVjdXJzaXZlIGNsb25pbmdcbiAqIEByZXR1cm4ge09iamVjdHxBcnJheX0gQ2xvbmUgb2JqZWN0XG4gKi9cblxuZnVuY3Rpb24gZGVlcENsb25lKG9iamVjdCkge1xuICB2YXIgcmVjdXJzaW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcbiAgaWYgKCFvYmplY3QpIHJldHVybiBvYmplY3Q7XG4gIHZhciBwYXJzZSA9IEpTT04ucGFyc2UsXG4gICAgICBzdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgaWYgKCFyZWN1cnNpb24pIHJldHVybiBwYXJzZShzdHJpbmdpZnkob2JqZWN0KSk7XG4gIHZhciBjbG9uZWRPYmogPSBvYmplY3QgaW5zdGFuY2VvZiBBcnJheSA/IFtdIDoge307XG5cbiAgaWYgKG9iamVjdCAmJiAoMCwgX3R5cGVvZjJbXCJkZWZhdWx0XCJdKShvYmplY3QpID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBpZiAob2JqZWN0W2tleV0gJiYgKDAsIF90eXBlb2YyW1wiZGVmYXVsdFwiXSkob2JqZWN0W2tleV0pID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGNsb25lZE9ialtrZXldID0gZGVlcENsb25lKG9iamVjdFtrZXldLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbG9uZWRPYmpba2V5XSA9IG9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNsb25lZE9iajtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIEVsaW1pbmF0ZSBsaW5lIGJsdXIgZHVlIHRvIDFweCBsaW5lIHdpZHRoXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgTGluZSBwb2ludHNcbiAqIEByZXR1cm4ge0FycmF5fSBMaW5lIHBvaW50cyBhZnRlciBwcm9jZXNzZWRcbiAqL1xuXG5cbmZ1bmN0aW9uIGVsaW1pbmF0ZUJsdXIocG9pbnRzKSB7XG4gIHJldHVybiBwb2ludHMubWFwKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgdmFyIF9yZWYyID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9yZWYsIDIpLFxuICAgICAgICB4ID0gX3JlZjJbMF0sXG4gICAgICAgIHkgPSBfcmVmMlsxXTtcblxuICAgIHJldHVybiBbcGFyc2VJbnQoeCkgKyAwLjUsIHBhcnNlSW50KHkpICsgMC41XTtcbiAgfSk7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBDaGVjayBpZiB0aGUgcG9pbnQgaXMgaW5zaWRlIHRoZSBjaXJjbGVcbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50IFBvc3Rpb24gb2YgcG9pbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSByeCAgIENpcmNsZSB4IGNvb3JkaW5hdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByeSAgIENpcmNsZSB5IGNvb3JkaW5hdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByICAgIENpcmNsZSByYWRpdXNcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJlc3VsdCBvZiBjaGVja1xuICovXG5cblxuZnVuY3Rpb24gY2hlY2tQb2ludElzSW5DaXJjbGUocG9pbnQsIHJ4LCByeSwgcikge1xuICByZXR1cm4gZ2V0VHdvUG9pbnREaXN0YW5jZShwb2ludCwgW3J4LCByeV0pIDw9IHI7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50c1xuICogQHBhcmFtIHtBcnJheX0gcG9pbnQxIHBvaW50MVxuICogQHBhcmFtIHtBcnJheX0gcG9pbnQyIHBvaW50MlxuICogQHJldHVybiB7TnVtYmVyfSBEaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFR3b1BvaW50RGlzdGFuY2UoX3JlZjMsIF9yZWY0KSB7XG4gIHZhciBfcmVmNSA9ICgwLCBfc2xpY2VkVG9BcnJheTJbXCJkZWZhdWx0XCJdKShfcmVmMywgMiksXG4gICAgICB4YSA9IF9yZWY1WzBdLFxuICAgICAgeWEgPSBfcmVmNVsxXTtcblxuICB2YXIgX3JlZjYgPSAoMCwgX3NsaWNlZFRvQXJyYXkyW1wiZGVmYXVsdFwiXSkoX3JlZjQsIDIpLFxuICAgICAgeGIgPSBfcmVmNlswXSxcbiAgICAgIHliID0gX3JlZjZbMV07XG5cbiAgdmFyIG1pbnVzWCA9IGFicyh4YSAtIHhiKTtcbiAgdmFyIG1pbnVzWSA9IGFicyh5YSAtIHliKTtcbiAgcmV0dXJuIHNxcnQobWludXNYICogbWludXNYICsgbWludXNZICogbWludXNZKTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIENoZWNrIGlmIHRoZSBwb2ludCBpcyBpbnNpZGUgdGhlIHBvbHlnb25cbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50ICBQb3N0aW9uIG9mIHBvaW50XG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgVGhlIHBvaW50cyB0aGF0IG1ha2VzIHVwIGEgcG9seWxpbmVcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJlc3VsdCBvZiBjaGVja1xuICovXG5cblxuZnVuY3Rpb24gY2hlY2tQb2ludElzSW5Qb2x5Z29uKHBvaW50LCBwb2x5Z29uKSB7XG4gIHZhciBjb3VudGVyID0gMDtcblxuICB2YXIgX3BvaW50ID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKHBvaW50LCAyKSxcbiAgICAgIHggPSBfcG9pbnRbMF0sXG4gICAgICB5ID0gX3BvaW50WzFdO1xuXG4gIHZhciBwb2ludE51bSA9IHBvbHlnb24ubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAxLCBwMSA9IHBvbHlnb25bMF07IGkgPD0gcG9pbnROdW07IGkrKykge1xuICAgIHZhciBwMiA9IHBvbHlnb25baSAlIHBvaW50TnVtXTtcblxuICAgIGlmICh4ID4gbWluKHAxWzBdLCBwMlswXSkgJiYgeCA8PSBtYXgocDFbMF0sIHAyWzBdKSkge1xuICAgICAgaWYgKHkgPD0gbWF4KHAxWzFdLCBwMlsxXSkpIHtcbiAgICAgICAgaWYgKHAxWzBdICE9PSBwMlswXSkge1xuICAgICAgICAgIHZhciB4aW50ZXJzID0gKHggLSBwMVswXSkgKiAocDJbMV0gLSBwMVsxXSkgLyAocDJbMF0gLSBwMVswXSkgKyBwMVsxXTtcblxuICAgICAgICAgIGlmIChwMVsxXSA9PT0gcDJbMV0gfHwgeSA8PSB4aW50ZXJzKSB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcDEgPSBwMjtcbiAgfVxuXG4gIHJldHVybiBjb3VudGVyICUgMiA9PT0gMTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIENoZWNrIGlmIHRoZSBwb2ludCBpcyBpbnNpZGUgdGhlIHNlY3RvclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnQgICAgICAgUG9zdGlvbiBvZiBwb2ludFxuICogQHBhcmFtIHtOdW1iZXJ9IHJ4ICAgICAgICAgU2VjdG9yIHggY29vcmRpbmF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJ5ICAgICAgICAgU2VjdG9yIHkgY29vcmRpbmF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHIgICAgICAgICAgU2VjdG9yIHJhZGl1c1xuICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0QW5nbGUgU2VjdG9yIHN0YXJ0IGFuZ2xlXG4gKiBAcGFyYW0ge051bWJlcn0gZW5kQW5nbGUgICBTZWN0b3IgZW5kIGFuZ2xlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNsb2NrV2lzZSBXaGV0aGVyIHRoZSBzZWN0b3IgYW5nbGUgaXMgY2xvY2t3aXNlXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXN1bHQgb2YgY2hlY2tcbiAqL1xuXG5cbmZ1bmN0aW9uIGNoZWNrUG9pbnRJc0luU2VjdG9yKHBvaW50LCByeCwgcnksIHIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBjbG9ja1dpc2UpIHtcbiAgaWYgKCFwb2ludCkgcmV0dXJuIGZhbHNlO1xuICBpZiAoZ2V0VHdvUG9pbnREaXN0YW5jZShwb2ludCwgW3J4LCByeV0pID4gcikgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICghY2xvY2tXaXNlKSB7XG4gICAgdmFyIF9kZWVwQ2xvbmUgPSBkZWVwQ2xvbmUoW2VuZEFuZ2xlLCBzdGFydEFuZ2xlXSk7XG5cbiAgICB2YXIgX2RlZXBDbG9uZTIgPSAoMCwgX3NsaWNlZFRvQXJyYXkyW1wiZGVmYXVsdFwiXSkoX2RlZXBDbG9uZSwgMik7XG5cbiAgICBzdGFydEFuZ2xlID0gX2RlZXBDbG9uZTJbMF07XG4gICAgZW5kQW5nbGUgPSBfZGVlcENsb25lMlsxXTtcbiAgfVxuXG4gIHZhciByZXZlcnNlQkUgPSBzdGFydEFuZ2xlID4gZW5kQW5nbGU7XG5cbiAgaWYgKHJldmVyc2VCRSkge1xuICAgIHZhciBfcmVmNyA9IFtlbmRBbmdsZSwgc3RhcnRBbmdsZV07XG4gICAgc3RhcnRBbmdsZSA9IF9yZWY3WzBdO1xuICAgIGVuZEFuZ2xlID0gX3JlZjdbMV07XG4gIH1cblxuICB2YXIgbWludXMgPSBlbmRBbmdsZSAtIHN0YXJ0QW5nbGU7XG4gIGlmIChtaW51cyA+PSBQSSAqIDIpIHJldHVybiB0cnVlO1xuXG4gIHZhciBfcG9pbnQyID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKHBvaW50LCAyKSxcbiAgICAgIHggPSBfcG9pbnQyWzBdLFxuICAgICAgeSA9IF9wb2ludDJbMV07XG5cbiAgdmFyIF9nZXRDaXJjbGVSYWRpYW5Qb2ludCA9IGdldENpcmNsZVJhZGlhblBvaW50KHJ4LCByeSwgciwgc3RhcnRBbmdsZSksXG4gICAgICBfZ2V0Q2lyY2xlUmFkaWFuUG9pbnQyID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9nZXRDaXJjbGVSYWRpYW5Qb2ludCwgMiksXG4gICAgICBieCA9IF9nZXRDaXJjbGVSYWRpYW5Qb2ludDJbMF0sXG4gICAgICBieSA9IF9nZXRDaXJjbGVSYWRpYW5Qb2ludDJbMV07XG5cbiAgdmFyIF9nZXRDaXJjbGVSYWRpYW5Qb2ludDMgPSBnZXRDaXJjbGVSYWRpYW5Qb2ludChyeCwgcnksIHIsIGVuZEFuZ2xlKSxcbiAgICAgIF9nZXRDaXJjbGVSYWRpYW5Qb2ludDQgPSAoMCwgX3NsaWNlZFRvQXJyYXkyW1wiZGVmYXVsdFwiXSkoX2dldENpcmNsZVJhZGlhblBvaW50MywgMiksXG4gICAgICBleCA9IF9nZXRDaXJjbGVSYWRpYW5Qb2ludDRbMF0sXG4gICAgICBleSA9IF9nZXRDaXJjbGVSYWRpYW5Qb2ludDRbMV07XG5cbiAgdmFyIHZQb2ludCA9IFt4IC0gcngsIHkgLSByeV07XG4gIHZhciB2QkFybSA9IFtieCAtIHJ4LCBieSAtIHJ5XTtcbiAgdmFyIHZFQXJtID0gW2V4IC0gcngsIGV5IC0gcnldO1xuICB2YXIgcmV2ZXJzZSA9IG1pbnVzID4gUEk7XG5cbiAgaWYgKHJldmVyc2UpIHtcbiAgICB2YXIgX2RlZXBDbG9uZTMgPSBkZWVwQ2xvbmUoW3ZFQXJtLCB2QkFybV0pO1xuXG4gICAgdmFyIF9kZWVwQ2xvbmU0ID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9kZWVwQ2xvbmUzLCAyKTtcblxuICAgIHZCQXJtID0gX2RlZXBDbG9uZTRbMF07XG4gICAgdkVBcm0gPSBfZGVlcENsb25lNFsxXTtcbiAgfVxuXG4gIHZhciBpblNlY3RvciA9IGlzQ2xvY2tXaXNlKHZCQXJtLCB2UG9pbnQpICYmICFpc0Nsb2NrV2lzZSh2RUFybSwgdlBvaW50KTtcbiAgaWYgKHJldmVyc2UpIGluU2VjdG9yID0gIWluU2VjdG9yO1xuICBpZiAocmV2ZXJzZUJFKSBpblNlY3RvciA9ICFpblNlY3RvcjtcbiAgcmV0dXJuIGluU2VjdG9yO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gRGV0ZXJtaW5lIGlmIHRoZSBwb2ludCBpcyBpbiB0aGUgY2xvY2t3aXNlIGRpcmVjdGlvbiBvZiB0aGUgdmVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSB2QXJtICAgVmVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSB2UG9pbnQgUG9pbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJlc3VsdCBvZiBjaGVja1xuICovXG5cblxuZnVuY3Rpb24gaXNDbG9ja1dpc2UodkFybSwgdlBvaW50KSB7XG4gIHZhciBfdkFybSA9ICgwLCBfc2xpY2VkVG9BcnJheTJbXCJkZWZhdWx0XCJdKSh2QXJtLCAyKSxcbiAgICAgIGF4ID0gX3ZBcm1bMF0sXG4gICAgICBheSA9IF92QXJtWzFdO1xuXG4gIHZhciBfdlBvaW50ID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKHZQb2ludCwgMiksXG4gICAgICBweCA9IF92UG9pbnRbMF0sXG4gICAgICBweSA9IF92UG9pbnRbMV07XG5cbiAgcmV0dXJuIC1heSAqIHB4ICsgYXggKiBweSA+IDA7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBDaGVjayBpZiB0aGUgcG9pbnQgaXMgaW5zaWRlIHRoZSBwb2x5bGluZVxuICogQHBhcmFtIHtBcnJheX0gcG9pbnQgICAgICBQb3N0aW9uIG9mIHBvaW50XG4gKiBAcGFyYW0ge0FycmF5fSBwb2x5bGluZSAgIFRoZSBwb2ludHMgdGhhdCBtYWtlcyB1cCBhIHBvbHlsaW5lXG4gKiBAcGFyYW0ge051bWJlcn0gbGluZVdpZHRoIFBvbHlsaW5lIGxpbmV3aWR0aFxuICogQHJldHVybiB7Qm9vbGVhbn0gUmVzdWx0IG9mIGNoZWNrXG4gKi9cblxuXG5mdW5jdGlvbiBjaGVja1BvaW50SXNOZWFyUG9seWxpbmUocG9pbnQsIHBvbHlsaW5lLCBsaW5lV2lkdGgpIHtcbiAgdmFyIGhhbGZMaW5lV2lkdGggPSBsaW5lV2lkdGggLyAyO1xuICB2YXIgbW92ZVVwUG9seWxpbmUgPSBwb2x5bGluZS5tYXAoZnVuY3Rpb24gKF9yZWY4KSB7XG4gICAgdmFyIF9yZWY5ID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9yZWY4LCAyKSxcbiAgICAgICAgeCA9IF9yZWY5WzBdLFxuICAgICAgICB5ID0gX3JlZjlbMV07XG5cbiAgICByZXR1cm4gW3gsIHkgLSBoYWxmTGluZVdpZHRoXTtcbiAgfSk7XG4gIHZhciBtb3ZlRG93blBvbHlsaW5lID0gcG9seWxpbmUubWFwKGZ1bmN0aW9uIChfcmVmMTApIHtcbiAgICB2YXIgX3JlZjExID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9yZWYxMCwgMiksXG4gICAgICAgIHggPSBfcmVmMTFbMF0sXG4gICAgICAgIHkgPSBfcmVmMTFbMV07XG5cbiAgICByZXR1cm4gW3gsIHkgKyBoYWxmTGluZVdpZHRoXTtcbiAgfSk7XG4gIHZhciBwb2x5Z29uID0gW10uY29uY2F0KCgwLCBfdG9Db25zdW1hYmxlQXJyYXkyW1wiZGVmYXVsdFwiXSkobW92ZVVwUG9seWxpbmUpLCAoMCwgX3RvQ29uc3VtYWJsZUFycmF5MltcImRlZmF1bHRcIl0pKG1vdmVEb3duUG9seWxpbmUucmV2ZXJzZSgpKSk7XG4gIHJldHVybiBjaGVja1BvaW50SXNJblBvbHlnb24ocG9pbnQsIHBvbHlnb24pO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQ2hlY2sgaWYgdGhlIHBvaW50IGlzIGluc2lkZSB0aGUgcmVjdFxuICogQHBhcmFtIHtBcnJheX0gcG9pbnQgICBQb3N0aW9uIG9mIHBvaW50XG4gKiBAcGFyYW0ge051bWJlcn0geCAgICAgIFJlY3Qgc3RhcnQgeCBjb29yZGluYXRlXG4gKiBAcGFyYW0ge051bWJlcn0geSAgICAgIFJlY3Qgc3RhcnQgeSBjb29yZGluYXRlXG4gKiBAcGFyYW0ge051bWJlcn0gd2lkdGggIFJlY3Qgd2lkdGhcbiAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgUmVjdCBoZWlnaHRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJlc3VsdCBvZiBjaGVja1xuICovXG5cblxuZnVuY3Rpb24gY2hlY2tQb2ludElzSW5SZWN0KF9yZWYxMiwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICB2YXIgX3JlZjEzID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9yZWYxMiwgMiksXG4gICAgICBweCA9IF9yZWYxM1swXSxcbiAgICAgIHB5ID0gX3JlZjEzWzFdO1xuXG4gIGlmIChweCA8IHgpIHJldHVybiBmYWxzZTtcbiAgaWYgKHB5IDwgeSkgcmV0dXJuIGZhbHNlO1xuICBpZiAocHggPiB4ICsgd2lkdGgpIHJldHVybiBmYWxzZTtcbiAgaWYgKHB5ID4geSArIGhlaWdodCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gdHJ1ZTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHJvdGF0ZWQgcG9pbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSByb3RhdGUgRGVncmVlIG9mIHJvdGF0aW9uXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludCAgIFBvc3Rpb24gb2YgcG9pbnRcbiAqIEBwYXJhbSB7QXJyYXl9IG9yaWdpbiAgUm90YXRpb24gY2VudGVyXG4gKiBAcGFyYW0ge0FycmF5fSBvcmlnaW4gIFJvdGF0aW9uIGNlbnRlclxuICogQHJldHVybiB7TnVtYmVyfSBDb29yZGluYXRlcyBhZnRlciByb3RhdGlvblxuICovXG5cblxuZnVuY3Rpb24gZ2V0Um90YXRlUG9pbnRQb3MoKSB7XG4gIHZhciByb3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gIHZhciBwb2ludCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICB2YXIgb3JpZ2luID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbMCwgMF07XG4gIGlmICghcG9pbnQpIHJldHVybiBmYWxzZTtcbiAgaWYgKHJvdGF0ZSAlIDM2MCA9PT0gMCkgcmV0dXJuIHBvaW50O1xuXG4gIHZhciBfcG9pbnQzID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKHBvaW50LCAyKSxcbiAgICAgIHggPSBfcG9pbnQzWzBdLFxuICAgICAgeSA9IF9wb2ludDNbMV07XG5cbiAgdmFyIF9vcmlnaW4gPSAoMCwgX3NsaWNlZFRvQXJyYXkyW1wiZGVmYXVsdFwiXSkob3JpZ2luLCAyKSxcbiAgICAgIG94ID0gX29yaWdpblswXSxcbiAgICAgIG95ID0gX29yaWdpblsxXTtcblxuICByb3RhdGUgKj0gUEkgLyAxODA7XG4gIHJldHVybiBbKHggLSBveCkgKiBjb3Mocm90YXRlKSAtICh5IC0gb3kpICogc2luKHJvdGF0ZSkgKyBveCwgKHggLSBveCkgKiBzaW4ocm90YXRlKSArICh5IC0gb3kpICogY29zKHJvdGF0ZSkgKyBveV07XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBzY2FsZWQgcG9pbnRcbiAqIEBwYXJhbSB7QXJyYXl9IHNjYWxlICBTY2FsZSBmYWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50ICBQb3N0aW9uIG9mIHBvaW50XG4gKiBAcGFyYW0ge0FycmF5fSBvcmlnaW4gU2NhbGUgY2VudGVyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IENvb3JkaW5hdGVzIGFmdGVyIHNjYWxlXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRTY2FsZVBvaW50UG9zKCkge1xuICB2YXIgc2NhbGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFsxLCAxXTtcbiAgdmFyIHBvaW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gIHZhciBvcmlnaW4gPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IFswLCAwXTtcbiAgaWYgKCFwb2ludCkgcmV0dXJuIGZhbHNlO1xuICBpZiAoc2NhbGUgPT09IDEpIHJldHVybiBwb2ludDtcblxuICB2YXIgX3BvaW50NCA9ICgwLCBfc2xpY2VkVG9BcnJheTJbXCJkZWZhdWx0XCJdKShwb2ludCwgMiksXG4gICAgICB4ID0gX3BvaW50NFswXSxcbiAgICAgIHkgPSBfcG9pbnQ0WzFdO1xuXG4gIHZhciBfb3JpZ2luMiA9ICgwLCBfc2xpY2VkVG9BcnJheTJbXCJkZWZhdWx0XCJdKShvcmlnaW4sIDIpLFxuICAgICAgb3ggPSBfb3JpZ2luMlswXSxcbiAgICAgIG95ID0gX29yaWdpbjJbMV07XG5cbiAgdmFyIF9zY2FsZSA9ICgwLCBfc2xpY2VkVG9BcnJheTJbXCJkZWZhdWx0XCJdKShzY2FsZSwgMiksXG4gICAgICB4cyA9IF9zY2FsZVswXSxcbiAgICAgIHlzID0gX3NjYWxlWzFdO1xuXG4gIHZhciByZWxhdGl2ZVBvc1ggPSB4IC0gb3g7XG4gIHZhciByZWxhdGl2ZVBvc1kgPSB5IC0gb3k7XG4gIHJldHVybiBbcmVsYXRpdmVQb3NYICogeHMgKyBveCwgcmVsYXRpdmVQb3NZICogeXMgKyBveV07XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBzY2FsZWQgcG9pbnRcbiAqIEBwYXJhbSB7QXJyYXl9IHRyYW5zbGF0ZSBUcmFuc2xhdGlvbiBkaXN0YW5jZVxuICogQHBhcmFtIHtBcnJheX0gcG9pbnQgICAgIFBvc3Rpb24gb2YgcG9pbnRcbiAqIEByZXR1cm4ge051bWJlcn0gQ29vcmRpbmF0ZXMgYWZ0ZXIgdHJhbnNsYXRpb25cbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFRyYW5zbGF0ZVBvaW50UG9zKHRyYW5zbGF0ZSwgcG9pbnQpIHtcbiAgaWYgKCF0cmFuc2xhdGUgfHwgIXBvaW50KSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIF9wb2ludDUgPSAoMCwgX3NsaWNlZFRvQXJyYXkyW1wiZGVmYXVsdFwiXSkocG9pbnQsIDIpLFxuICAgICAgeCA9IF9wb2ludDVbMF0sXG4gICAgICB5ID0gX3BvaW50NVsxXTtcblxuICB2YXIgX3RyYW5zbGF0ZSA9ICgwLCBfc2xpY2VkVG9BcnJheTJbXCJkZWZhdWx0XCJdKSh0cmFuc2xhdGUsIDIpLFxuICAgICAgdHggPSBfdHJhbnNsYXRlWzBdLFxuICAgICAgdHkgPSBfdHJhbnNsYXRlWzFdO1xuXG4gIHJldHVybiBbeCArIHR4LCB5ICsgdHldO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBwb2ludCB0byB0aGUgbGluZVxuICogQHBhcmFtIHtBcnJheX0gcG9pbnQgICAgIFBvc3Rpb24gb2YgcG9pbnRcbiAqIEBwYXJhbSB7QXJyYXl9IGxpbmVCZWdpbiBMaW5lIHN0YXJ0IHBvc2l0aW9uXG4gKiBAcGFyYW0ge0FycmF5fSBsaW5lRW5kICAgTGluZSBlbmQgcG9zaXRpb25cbiAqIEByZXR1cm4ge051bWJlcn0gRGlzdGFuY2UgYmV0d2VlbiBwb2ludCBhbmQgbGluZVxuICovXG5cblxuZnVuY3Rpb24gZ2V0RGlzdGFuY2VCZXR3ZWVuUG9pbnRBbmRMaW5lKHBvaW50LCBsaW5lQmVnaW4sIGxpbmVFbmQpIHtcbiAgaWYgKCFwb2ludCB8fCAhbGluZUJlZ2luIHx8ICFsaW5lRW5kKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIF9wb2ludDYgPSAoMCwgX3NsaWNlZFRvQXJyYXkyW1wiZGVmYXVsdFwiXSkocG9pbnQsIDIpLFxuICAgICAgeCA9IF9wb2ludDZbMF0sXG4gICAgICB5ID0gX3BvaW50NlsxXTtcblxuICB2YXIgX2xpbmVCZWdpbiA9ICgwLCBfc2xpY2VkVG9BcnJheTJbXCJkZWZhdWx0XCJdKShsaW5lQmVnaW4sIDIpLFxuICAgICAgeDEgPSBfbGluZUJlZ2luWzBdLFxuICAgICAgeTEgPSBfbGluZUJlZ2luWzFdO1xuXG4gIHZhciBfbGluZUVuZCA9ICgwLCBfc2xpY2VkVG9BcnJheTJbXCJkZWZhdWx0XCJdKShsaW5lRW5kLCAyKSxcbiAgICAgIHgyID0gX2xpbmVFbmRbMF0sXG4gICAgICB5MiA9IF9saW5lRW5kWzFdO1xuXG4gIHZhciBhID0geTIgLSB5MTtcbiAgdmFyIGIgPSB4MSAtIHgyO1xuICB2YXIgYyA9IHkxICogKHgyIC0geDEpIC0geDEgKiAoeTIgLSB5MSk7XG4gIHZhciBtb2xlY3VsZSA9IGFicyhhICogeCArIGIgKiB5ICsgYyk7XG4gIHZhciBkZW5vbWluYXRvciA9IHNxcnQoYSAqIGEgKyBiICogYik7XG4gIHJldHVybiBtb2xlY3VsZSAvIGRlbm9taW5hdG9yO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSBjb29yZGluYXRlcyBvZiB0aGUgc3BlY2lmaWVkIHJhZGlhbiBvbiB0aGUgY2lyY2xlXG4gKiBAcGFyYW0ge051bWJlcn0geCAgICAgIENpcmNsZSB4IGNvb3JkaW5hdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSB5ICAgICAgQ2lyY2xlIHkgY29vcmRpbmF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyBDaXJjbGUgcmFkaXVzXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkaWFuIFNwZWNmaWVkIHJhZGlhblxuICogQHJldHVybiB7QXJyYXl9IFBvc3Rpb24gb2YgcG9pbnRcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldENpcmNsZVJhZGlhblBvaW50KHgsIHksIHJhZGl1cywgcmFkaWFuKSB7XG4gIHJldHVybiBbeCArIGNvcyhyYWRpYW4pICogcmFkaXVzLCB5ICsgc2luKHJhZGlhbikgKiByYWRpdXNdO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSBwb2ludHMgdGhhdCBtYWtlIHVwIGEgcmVndWxhciBwb2x5Z29uXG4gKiBAcGFyYW0ge051bWJlcn0geCAgICAgWCBjb29yZGluYXRlIG9mIHRoZSBwb2x5Z29uIGluc2NyaWJlZCBjaXJjbGVcbiAqIEBwYXJhbSB7TnVtYmVyfSB5ICAgICBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvbHlnb24gaW5zY3JpYmVkIGNpcmNsZVxuICogQHBhcmFtIHtOdW1iZXJ9IHIgICAgIFJhZGl1cyBvZiB0aGUgcG9seWdvbiBpbnNjcmliZWQgY2lyY2xlXG4gKiBAcGFyYW0ge051bWJlcn0gc2lkZSAgU2lkZSBudW1iZXJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtaW51cyBSYWRpYW4gb2Zmc2V0XG4gKiBAcmV0dXJuIHtBcnJheX0gUG9pbnRzIHRoYXQgbWFrZSB1cCBhIHJlZ3VsYXIgcG9seWdvblxuICovXG5cblxuZnVuY3Rpb24gZ2V0UmVndWxhclBvbHlnb25Qb2ludHMocngsIHJ5LCByLCBzaWRlKSB7XG4gIHZhciBtaW51cyA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogUEkgKiAtMC41O1xuICB2YXIgcmFkaWFuR2FwID0gUEkgKiAyIC8gc2lkZTtcbiAgdmFyIHJhZGlhbnMgPSBuZXcgQXJyYXkoc2lkZSkuZmlsbCgnJykubWFwKGZ1bmN0aW9uICh0LCBpKSB7XG4gICAgcmV0dXJuIGkgKiByYWRpYW5HYXAgKyBtaW51cztcbiAgfSk7XG4gIHJldHVybiByYWRpYW5zLm1hcChmdW5jdGlvbiAocmFkaWFuKSB7XG4gICAgcmV0dXJuIGdldENpcmNsZVJhZGlhblBvaW50KHJ4LCByeSwgciwgcmFkaWFuKTtcbiAgfSk7XG59XG5cbnZhciBfZGVmYXVsdCA9IHtcbiAgZGVlcENsb25lOiBkZWVwQ2xvbmUsXG4gIGVsaW1pbmF0ZUJsdXI6IGVsaW1pbmF0ZUJsdXIsXG4gIGNoZWNrUG9pbnRJc0luQ2lyY2xlOiBjaGVja1BvaW50SXNJbkNpcmNsZSxcbiAgY2hlY2tQb2ludElzSW5Qb2x5Z29uOiBjaGVja1BvaW50SXNJblBvbHlnb24sXG4gIGNoZWNrUG9pbnRJc0luU2VjdG9yOiBjaGVja1BvaW50SXNJblNlY3RvcixcbiAgY2hlY2tQb2ludElzTmVhclBvbHlsaW5lOiBjaGVja1BvaW50SXNOZWFyUG9seWxpbmUsXG4gIGdldFR3b1BvaW50RGlzdGFuY2U6IGdldFR3b1BvaW50RGlzdGFuY2UsXG4gIGdldFJvdGF0ZVBvaW50UG9zOiBnZXRSb3RhdGVQb2ludFBvcyxcbiAgZ2V0U2NhbGVQb2ludFBvczogZ2V0U2NhbGVQb2ludFBvcyxcbiAgZ2V0VHJhbnNsYXRlUG9pbnRQb3M6IGdldFRyYW5zbGF0ZVBvaW50UG9zLFxuICBnZXRDaXJjbGVSYWRpYW5Qb2ludDogZ2V0Q2lyY2xlUmFkaWFuUG9pbnQsXG4gIGdldFJlZ3VsYXJQb2x5Z29uUG9pbnRzOiBnZXRSZWd1bGFyUG9seWdvblBvaW50cyxcbiAgZ2V0RGlzdGFuY2VCZXR3ZWVuUG9pbnRBbmRMaW5lOiBnZXREaXN0YW5jZUJldHdlZW5Qb2ludEFuZExpbmVcbn07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0OyIsImZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykge1xuICAgIGFycjJbaV0gPSBhcnJbaV07XG4gIH1cblxuICByZXR1cm4gYXJyMjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlMaWtlVG9BcnJheTsiLCJmdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FycmF5V2l0aEhvbGVzOyIsInZhciBhcnJheUxpa2VUb0FycmF5ID0gcmVxdWlyZShcIi4vYXJyYXlMaWtlVG9BcnJheVwiKTtcblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShhcnIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hcnJheVdpdGhvdXRIb2xlczsiLCJmdW5jdGlvbiBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIGtleSwgYXJnKSB7XG4gIHRyeSB7XG4gICAgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpO1xuICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVqZWN0KGVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaW5mby5kb25lKSB7XG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKF9uZXh0LCBfdGhyb3cpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9hc3luY1RvR2VuZXJhdG9yKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgZ2VuID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7XG5cbiAgICAgIGZ1bmN0aW9uIF9uZXh0KHZhbHVlKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJuZXh0XCIsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3Rocm93KGVycikge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwidGhyb3dcIiwgZXJyKTtcbiAgICAgIH1cblxuICAgICAgX25leHQodW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXN5bmNUb0dlbmVyYXRvcjsiLCJmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9jbGFzc0NhbGxDaGVjazsiLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZGVmaW5lUHJvcGVydHk7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHtcbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyKSkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2l0ZXJhYmxlVG9BcnJheTsiLCJmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuO1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2l0ZXJhYmxlVG9BcnJheUxpbWl0OyIsImZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX25vbkl0ZXJhYmxlUmVzdDsiLCJmdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9ub25JdGVyYWJsZVNwcmVhZDsiLCJ2YXIgYXJyYXlXaXRoSG9sZXMgPSByZXF1aXJlKFwiLi9hcnJheVdpdGhIb2xlc1wiKTtcblxudmFyIGl0ZXJhYmxlVG9BcnJheUxpbWl0ID0gcmVxdWlyZShcIi4vaXRlcmFibGVUb0FycmF5TGltaXRcIik7XG5cbnZhciB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSA9IHJlcXVpcmUoXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5XCIpO1xuXG52YXIgbm9uSXRlcmFibGVSZXN0ID0gcmVxdWlyZShcIi4vbm9uSXRlcmFibGVSZXN0XCIpO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHtcbiAgcmV0dXJuIGFycmF5V2l0aEhvbGVzKGFycikgfHwgaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IG5vbkl0ZXJhYmxlUmVzdCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zbGljZWRUb0FycmF5OyIsInZhciBhcnJheVdpdGhvdXRIb2xlcyA9IHJlcXVpcmUoXCIuL2FycmF5V2l0aG91dEhvbGVzXCIpO1xuXG52YXIgaXRlcmFibGVUb0FycmF5ID0gcmVxdWlyZShcIi4vaXRlcmFibGVUb0FycmF5XCIpO1xuXG52YXIgdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkgPSByZXF1aXJlKFwiLi91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheVwiKTtcblxudmFyIG5vbkl0ZXJhYmxlU3ByZWFkID0gcmVxdWlyZShcIi4vbm9uSXRlcmFibGVTcHJlYWRcIik7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHtcbiAgcmV0dXJuIGFycmF5V2l0aG91dEhvbGVzKGFycikgfHwgaXRlcmFibGVUb0FycmF5KGFycikgfHwgdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBub25JdGVyYWJsZVNwcmVhZCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF90b0NvbnN1bWFibGVBcnJheTsiLCJmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7XG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF90eXBlb2Y7IiwidmFyIGFycmF5TGlrZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9hcnJheUxpa2VUb0FycmF5XCIpO1xuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gIGlmICghbykgcmV0dXJuO1xuICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG4gIHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcbiAgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTtcbiAgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7XG4gIGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW50ZXJvcFJlcXVpcmVEZWZhdWx0XCIpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5iZXppZXJDdXJ2ZVRvUG9seWxpbmUgPSBiZXppZXJDdXJ2ZVRvUG9seWxpbmU7XG5leHBvcnRzLmdldEJlemllckN1cnZlTGVuZ3RoID0gZ2V0QmV6aWVyQ3VydmVMZW5ndGg7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9zbGljZWRUb0FycmF5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheVwiKSk7XG5cbnZhciBfdG9Db25zdW1hYmxlQXJyYXkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy90b0NvbnN1bWFibGVBcnJheVwiKSk7XG5cbnZhciBzcXJ0ID0gTWF0aC5zcXJ0LFxuICAgIHBvdyA9IE1hdGgucG93LFxuICAgIGNlaWwgPSBNYXRoLmNlaWwsXG4gICAgYWJzID0gTWF0aC5hYnM7IC8vIEluaXRpYWxpemUgdGhlIG51bWJlciBvZiBwb2ludHMgcGVyIGN1cnZlXG5cbnZhciBkZWZhdWx0U2VnbWVudFBvaW50c051bSA9IDUwO1xuLyoqXHJcbiAqIEBleGFtcGxlIGRhdGEgc3RydWN0dXJlIG9mIGJlemllckN1cnZlXHJcbiAqIGJlemllckN1cnZlID0gW1xyXG4gKiAgLy8gU3RhcnRpbmcgcG9pbnQgb2YgdGhlIGN1cnZlXHJcbiAqICBbMTAsIDEwXSxcclxuICogIC8vIEJlemllckN1cnZlIHNlZ21lbnQgZGF0YSAoY29udHJvbFBvaW50MSwgY29udHJvbFBvaW50MiwgZW5kUG9pbnQpXHJcbiAqICBbXHJcbiAqICAgIFsyMCwgMjBdLCBbNDAsIDIwXSwgWzUwLCAxMF1cclxuICogIF0sXHJcbiAqICAuLi5cclxuICogXVxyXG4gKi9cblxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiAgICAgICAgICAgICAgIEFic3RyYWN0IHRoZSBjdXJ2ZSBhcyBhIHBvbHlsaW5lIGNvbnNpc3Rpbmcgb2YgTiBwb2ludHNcclxuICogQHBhcmFtIHtBcnJheX0gYmV6aWVyQ3VydmUgYmV6aWVyQ3VydmUgZGF0YVxyXG4gKiBAcGFyYW0ge051bWJlcn0gcHJlY2lzaW9uICBjYWxjdWxhdGlvbiBhY2N1cmFjeS4gUmVjb21tZW5kZWQgZm9yIDEtMjAuIERlZmF1bHQgPSA1XHJcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgIENhbGN1bGF0aW9uIHJlc3VsdHMgYW5kIHJlbGF0ZWQgZGF0YVxyXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgICAgICAgICBPcHRpb24uc2VnbWVudFBvaW50cyBQb2ludCBkYXRhIHRoYXQgY29uc3RpdHV0ZXMgYSBwb2x5bGluZSBhZnRlciBjYWxjdWxhdGlvblxyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICAgICAgICBPcHRpb24uY3ljbGVzIE51bWJlciBvZiBpdGVyYXRpb25zXHJcbiAqIEByZXR1cm4ge051bWJlcn0gICAgICAgICAgIE9wdGlvbi5yb3VuZHMgVGhlIG51bWJlciBvZiByZWN1cnNpb25zIGZvciB0aGUgbGFzdCBpdGVyYXRpb25cclxuICovXG5cbmZ1bmN0aW9uIGFic3RyYWN0QmV6aWVyQ3VydmVUb1BvbHlsaW5lKGJlemllckN1cnZlKSB7XG4gIHZhciBwcmVjaXNpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDU7XG4gIHZhciBzZWdtZW50c051bSA9IGJlemllckN1cnZlLmxlbmd0aCAtIDE7XG4gIHZhciBzdGFydFBvaW50ID0gYmV6aWVyQ3VydmVbMF07XG4gIHZhciBlbmRQb2ludCA9IGJlemllckN1cnZlW3NlZ21lbnRzTnVtXVsyXTtcbiAgdmFyIHNlZ21lbnRzID0gYmV6aWVyQ3VydmUuc2xpY2UoMSk7XG4gIHZhciBnZXRTZWdtZW50VFBvaW50RnVucyA9IHNlZ21lbnRzLm1hcChmdW5jdGlvbiAoc2VnLCBpKSB7XG4gICAgdmFyIGJlZ2luUG9pbnQgPSBpID09PSAwID8gc3RhcnRQb2ludCA6IHNlZ21lbnRzW2kgLSAxXVsyXTtcbiAgICByZXR1cm4gY3JlYXRlR2V0QmV6aWVyQ3VydmVUUG9pbnRGdW4uYXBwbHkodm9pZCAwLCBbYmVnaW5Qb2ludF0uY29uY2F0KCgwLCBfdG9Db25zdW1hYmxlQXJyYXkyW1wiZGVmYXVsdFwiXSkoc2VnKSkpO1xuICB9KTsgLy8gSW5pdGlhbGl6ZSB0aGUgY3VydmUgdG8gYSBwb2x5bGluZVxuXG4gIHZhciBzZWdtZW50UG9pbnRzTnVtID0gbmV3IEFycmF5KHNlZ21lbnRzTnVtKS5maWxsKGRlZmF1bHRTZWdtZW50UG9pbnRzTnVtKTtcbiAgdmFyIHNlZ21lbnRQb2ludHMgPSBnZXRTZWdtZW50UG9pbnRzQnlOdW0oZ2V0U2VnbWVudFRQb2ludEZ1bnMsIHNlZ21lbnRQb2ludHNOdW0pOyAvLyBDYWxjdWxhdGUgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkIHBvaW50cyBieSBpdGVyYXRpdmVseVxuXG4gIHZhciByZXN1bHQgPSBjYWxjVW5pZm9ybVBvaW50c0J5SXRlcmF0aW9uKHNlZ21lbnRQb2ludHMsIGdldFNlZ21lbnRUUG9pbnRGdW5zLCBzZWdtZW50cywgcHJlY2lzaW9uKTtcbiAgcmVzdWx0LnNlZ21lbnRQb2ludHMucHVzaChlbmRQb2ludCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uICBHZW5lcmF0ZSBhIG1ldGhvZCBmb3Igb2J0YWluaW5nIGNvcnJlc3BvbmRpbmcgcG9pbnQgYnkgdCBhY2NvcmRpbmcgdG8gY3VydmUgZGF0YVxyXG4gKiBAcGFyYW0ge0FycmF5fSBiZWdpblBvaW50ICAgIEJlemllckN1cnZlIGJlZ2luIHBvaW50LiBbeCwgeV1cclxuICogQHBhcmFtIHtBcnJheX0gY29udHJvbFBvaW50MSBCZXppZXJDdXJ2ZSBjb250cm9sUG9pbnQxLiBbeCwgeV1cclxuICogQHBhcmFtIHtBcnJheX0gY29udHJvbFBvaW50MiBCZXppZXJDdXJ2ZSBjb250cm9sUG9pbnQyLiBbeCwgeV1cclxuICogQHBhcmFtIHtBcnJheX0gZW5kUG9pbnQgICAgICBCZXppZXJDdXJ2ZSBlbmQgcG9pbnQuIFt4LCB5XVxyXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gRXhwZWN0ZWQgZnVuY3Rpb25cclxuICovXG5cblxuZnVuY3Rpb24gY3JlYXRlR2V0QmV6aWVyQ3VydmVUUG9pbnRGdW4oYmVnaW5Qb2ludCwgY29udHJvbFBvaW50MSwgY29udHJvbFBvaW50MiwgZW5kUG9pbnQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0KSB7XG4gICAgdmFyIHRTdWJlZDEgPSAxIC0gdDtcbiAgICB2YXIgdFN1YmVkMVBvdzMgPSBwb3codFN1YmVkMSwgMyk7XG4gICAgdmFyIHRTdWJlZDFQb3cyID0gcG93KHRTdWJlZDEsIDIpO1xuICAgIHZhciB0UG93MyA9IHBvdyh0LCAzKTtcbiAgICB2YXIgdFBvdzIgPSBwb3codCwgMik7XG4gICAgcmV0dXJuIFtiZWdpblBvaW50WzBdICogdFN1YmVkMVBvdzMgKyAzICogY29udHJvbFBvaW50MVswXSAqIHQgKiB0U3ViZWQxUG93MiArIDMgKiBjb250cm9sUG9pbnQyWzBdICogdFBvdzIgKiB0U3ViZWQxICsgZW5kUG9pbnRbMF0gKiB0UG93MywgYmVnaW5Qb2ludFsxXSAqIHRTdWJlZDFQb3czICsgMyAqIGNvbnRyb2xQb2ludDFbMV0gKiB0ICogdFN1YmVkMVBvdzIgKyAzICogY29udHJvbFBvaW50MlsxXSAqIHRQb3cyICogdFN1YmVkMSArIGVuZFBvaW50WzFdICogdFBvdzNdO1xuICB9O1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50c1xyXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludDEgQmV6aWVyQ3VydmUgYmVnaW4gcG9pbnQuIFt4LCB5XVxyXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludDIgQmV6aWVyQ3VydmUgY29udHJvbFBvaW50MS4gW3gsIHldXHJcbiAqIEByZXR1cm4ge051bWJlcn0gRXhwZWN0ZWQgZGlzdGFuY2VcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0VHdvUG9pbnREaXN0YW5jZShfcmVmLCBfcmVmMikge1xuICB2YXIgX3JlZjMgPSAoMCwgX3NsaWNlZFRvQXJyYXkyW1wiZGVmYXVsdFwiXSkoX3JlZiwgMiksXG4gICAgICBheCA9IF9yZWYzWzBdLFxuICAgICAgYXkgPSBfcmVmM1sxXTtcblxuICB2YXIgX3JlZjQgPSAoMCwgX3NsaWNlZFRvQXJyYXkyW1wiZGVmYXVsdFwiXSkoX3JlZjIsIDIpLFxuICAgICAgYnggPSBfcmVmNFswXSxcbiAgICAgIGJ5ID0gX3JlZjRbMV07XG5cbiAgcmV0dXJuIHNxcnQocG93KGF4IC0gYngsIDIpICsgcG93KGF5IC0gYnksIDIpKTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSBzdW0gb2YgdGhlIGFycmF5IG9mIG51bWJlcnNcclxuICogQHBhcmFtIHtBcnJheX0gbnVtcyBBbiBhcnJheSBvZiBudW1iZXJzXHJcbiAqIEByZXR1cm4ge051bWJlcn0gRXhwZWN0ZWQgc3VtXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldE51bXNTdW0obnVtcykge1xuICByZXR1cm4gbnVtcy5yZWR1Y2UoZnVuY3Rpb24gKHN1bSwgbnVtKSB7XG4gICAgcmV0dXJuIHN1bSArIG51bTtcbiAgfSwgMCk7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgZGlzdGFuY2Ugb2YgbXVsdGlwbGUgc2V0cyBvZiBwb2ludHNcclxuICogQHBhcmFtIHtBcnJheX0gc2VnbWVudFBvaW50cyBNdWx0aXBsZSBzZXRzIG9mIHBvaW50IGRhdGFcclxuICogQHJldHVybiB7QXJyYXl9IERpc3RhbmNlIG9mIG11bHRpcGxlIHNldHMgb2YgcG9pbnQgZGF0YVxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRTZWdtZW50UG9pbnRzRGlzdGFuY2Uoc2VnbWVudFBvaW50cykge1xuICByZXR1cm4gc2VnbWVudFBvaW50cy5tYXAoZnVuY3Rpb24gKHBvaW50cywgaSkge1xuICAgIHJldHVybiBuZXcgQXJyYXkocG9pbnRzLmxlbmd0aCAtIDEpLmZpbGwoMCkubWFwKGZ1bmN0aW9uICh0ZW1wLCBqKSB7XG4gICAgICByZXR1cm4gZ2V0VHdvUG9pbnREaXN0YW5jZShwb2ludHNbal0sIHBvaW50c1tqICsgMV0pO1xuICAgIH0pO1xuICB9KTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSBkaXN0YW5jZSBvZiBtdWx0aXBsZSBzZXRzIG9mIHBvaW50c1xyXG4gKiBAcGFyYW0ge0FycmF5fSBzZWdtZW50UG9pbnRzIE11bHRpcGxlIHNldHMgb2YgcG9pbnQgZGF0YVxyXG4gKiBAcmV0dXJuIHtBcnJheX0gRGlzdGFuY2Ugb2YgbXVsdGlwbGUgc2V0cyBvZiBwb2ludCBkYXRhXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFNlZ21lbnRQb2ludHNCeU51bShnZXRTZWdtZW50VFBvaW50RnVucywgc2VnbWVudFBvaW50c051bSkge1xuICByZXR1cm4gZ2V0U2VnbWVudFRQb2ludEZ1bnMubWFwKGZ1bmN0aW9uIChnZXRTZWdtZW50VFBvaW50RnVuLCBpKSB7XG4gICAgdmFyIHRHYXAgPSAxIC8gc2VnbWVudFBvaW50c051bVtpXTtcbiAgICByZXR1cm4gbmV3IEFycmF5KHNlZ21lbnRQb2ludHNOdW1baV0pLmZpbGwoJycpLm1hcChmdW5jdGlvbiAoZm9vLCBqKSB7XG4gICAgICByZXR1cm4gZ2V0U2VnbWVudFRQb2ludEZ1bihqICogdEdhcCk7XG4gICAgfSk7XG4gIH0pO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIHN1bSBvZiBkZXZpYXRpb25zIGJldHdlZW4gbGluZSBzZWdtZW50IGFuZCB0aGUgYXZlcmFnZSBsZW5ndGhcclxuICogQHBhcmFtIHtBcnJheX0gc2VnbWVudFBvaW50c0Rpc3RhbmNlIFNlZ21lbnQgbGVuZ3RoIG9mIHBvbHlsaW5lXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBhdmdMZW5ndGggICAgICAgICAgICBBdmVyYWdlIGxlbmd0aCBvZiB0aGUgbGluZSBzZWdtZW50XHJcbiAqIEByZXR1cm4ge051bWJlcn0gRGV2aWF0aW9uc1xyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRBbGxEZXZpYXRpb25zKHNlZ21lbnRQb2ludHNEaXN0YW5jZSwgYXZnTGVuZ3RoKSB7XG4gIHJldHVybiBzZWdtZW50UG9pbnRzRGlzdGFuY2UubWFwKGZ1bmN0aW9uIChzZWcpIHtcbiAgICByZXR1cm4gc2VnLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIGFicyhzIC0gYXZnTGVuZ3RoKTtcbiAgICB9KTtcbiAgfSkubWFwKGZ1bmN0aW9uIChzZWcpIHtcbiAgICByZXR1cm4gZ2V0TnVtc1N1bShzZWcpO1xuICB9KS5yZWR1Y2UoZnVuY3Rpb24gKHRvdGFsLCB2KSB7XG4gICAgcmV0dXJuIHRvdGFsICsgdjtcbiAgfSwgMCk7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIENhbGN1bGF0ZSB1bmlmb3JtbHkgZGlzdHJpYnV0ZWQgcG9pbnRzIGJ5IGl0ZXJhdGl2ZWx5XHJcbiAqIEBwYXJhbSB7QXJyYXl9IHNlZ21lbnRQb2ludHMgICAgICAgIE11bHRpcGxlIHNldGQgb2YgcG9pbnRzIHRoYXQgbWFrZSB1cCBhIHBvbHlsaW5lXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGdldFNlZ21lbnRUUG9pbnRGdW5zIEZ1bmN0aW9ucyBvZiBnZXQgYSBwb2ludCBvbiB0aGUgY3VydmUgd2l0aCB0XHJcbiAqIEBwYXJhbSB7QXJyYXl9IHNlZ21lbnRzICAgICAgICAgICAgIEJlemllckN1cnZlIGRhdGFcclxuICogQHBhcmFtIHtOdW1iZXJ9IHByZWNpc2lvbiAgICAgICAgICAgQ2FsY3VsYXRpb24gYWNjdXJhY3lcclxuICogQHJldHVybiB7T2JqZWN0fSBDYWxjdWxhdGlvbiByZXN1bHRzIGFuZCByZWxhdGVkIGRhdGFcclxuICogQHJldHVybiB7QXJyYXl9ICBPcHRpb24uc2VnbWVudFBvaW50cyBQb2ludCBkYXRhIHRoYXQgY29uc3RpdHV0ZXMgYSBwb2x5bGluZSBhZnRlciBjYWxjdWxhdGlvblxyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IE9wdGlvbi5jeWNsZXMgTnVtYmVyIG9mIGl0ZXJhdGlvbnNcclxuICogQHJldHVybiB7TnVtYmVyfSBPcHRpb24ucm91bmRzIFRoZSBudW1iZXIgb2YgcmVjdXJzaW9ucyBmb3IgdGhlIGxhc3QgaXRlcmF0aW9uXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGNhbGNVbmlmb3JtUG9pbnRzQnlJdGVyYXRpb24oc2VnbWVudFBvaW50cywgZ2V0U2VnbWVudFRQb2ludEZ1bnMsIHNlZ21lbnRzLCBwcmVjaXNpb24pIHtcbiAgLy8gVGhlIG51bWJlciBvZiBsb29wcyBmb3IgdGhlIGN1cnJlbnQgaXRlcmF0aW9uXG4gIHZhciByb3VuZHMgPSA0OyAvLyBOdW1iZXIgb2YgaXRlcmF0aW9uc1xuXG4gIHZhciBjeWNsZXMgPSAxO1xuXG4gIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKCkge1xuICAgIC8vIFJlY2FsY3VsYXRlIHRoZSBudW1iZXIgb2YgcG9pbnRzIHBlciBjdXJ2ZSBiYXNlZCBvbiB0aGUgbGFzdCBpdGVyYXRpb24gZGF0YVxuICAgIHZhciB0b3RhbFBvaW50c051bSA9IHNlZ21lbnRQb2ludHMucmVkdWNlKGZ1bmN0aW9uICh0b3RhbCwgc2VnKSB7XG4gICAgICByZXR1cm4gdG90YWwgKyBzZWcubGVuZ3RoO1xuICAgIH0sIDApOyAvLyBBZGQgbGFzdCBwb2ludHMgb2Ygc2VnbWVudCB0byBjYWxjIGV4YWN0IHNlZ21lbnQgbGVuZ3RoXG5cbiAgICBzZWdtZW50UG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKHNlZywgaSkge1xuICAgICAgcmV0dXJuIHNlZy5wdXNoKHNlZ21lbnRzW2ldWzJdKTtcbiAgICB9KTtcbiAgICB2YXIgc2VnbWVudFBvaW50c0Rpc3RhbmNlID0gZ2V0U2VnbWVudFBvaW50c0Rpc3RhbmNlKHNlZ21lbnRQb2ludHMpO1xuICAgIHZhciBsaW5lU2VnbWVudE51bSA9IHNlZ21lbnRQb2ludHNEaXN0YW5jZS5yZWR1Y2UoZnVuY3Rpb24gKHRvdGFsLCBzZWcpIHtcbiAgICAgIHJldHVybiB0b3RhbCArIHNlZy5sZW5ndGg7XG4gICAgfSwgMCk7XG4gICAgdmFyIHNlZ21lbnRsZW5ndGggPSBzZWdtZW50UG9pbnRzRGlzdGFuY2UubWFwKGZ1bmN0aW9uIChzZWcpIHtcbiAgICAgIHJldHVybiBnZXROdW1zU3VtKHNlZyk7XG4gICAgfSk7XG4gICAgdmFyIHRvdGFsTGVuZ3RoID0gZ2V0TnVtc1N1bShzZWdtZW50bGVuZ3RoKTtcbiAgICB2YXIgYXZnTGVuZ3RoID0gdG90YWxMZW5ndGggLyBsaW5lU2VnbWVudE51bTsgLy8gQ2hlY2sgaWYgcHJlY2lzaW9uIGlzIHJlYWNoZWRcblxuICAgIHZhciBhbGxEZXZpYXRpb25zID0gZ2V0QWxsRGV2aWF0aW9ucyhzZWdtZW50UG9pbnRzRGlzdGFuY2UsIGF2Z0xlbmd0aCk7XG4gICAgaWYgKGFsbERldmlhdGlvbnMgPD0gcHJlY2lzaW9uKSByZXR1cm4gXCJicmVha1wiO1xuICAgIHRvdGFsUG9pbnRzTnVtID0gY2VpbChhdmdMZW5ndGggLyBwcmVjaXNpb24gKiB0b3RhbFBvaW50c051bSAqIDEuMSk7XG4gICAgdmFyIHNlZ21lbnRQb2ludHNOdW0gPSBzZWdtZW50bGVuZ3RoLm1hcChmdW5jdGlvbiAobGVuZ3RoKSB7XG4gICAgICByZXR1cm4gY2VpbChsZW5ndGggLyB0b3RhbExlbmd0aCAqIHRvdGFsUG9pbnRzTnVtKTtcbiAgICB9KTsgLy8gQ2FsY3VsYXRlIHRoZSBwb2ludHMgYWZ0ZXIgcmVkaXN0cmlidXRpb25cblxuICAgIHNlZ21lbnRQb2ludHMgPSBnZXRTZWdtZW50UG9pbnRzQnlOdW0oZ2V0U2VnbWVudFRQb2ludEZ1bnMsIHNlZ21lbnRQb2ludHNOdW0pO1xuICAgIHRvdGFsUG9pbnRzTnVtID0gc2VnbWVudFBvaW50cy5yZWR1Y2UoZnVuY3Rpb24gKHRvdGFsLCBzZWcpIHtcbiAgICAgIHJldHVybiB0b3RhbCArIHNlZy5sZW5ndGg7XG4gICAgfSwgMCk7XG4gICAgdmFyIHNlZ21lbnRQb2ludHNGb3JMZW5ndGggPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHNlZ21lbnRQb2ludHMpKTtcbiAgICBzZWdtZW50UG9pbnRzRm9yTGVuZ3RoLmZvckVhY2goZnVuY3Rpb24gKHNlZywgaSkge1xuICAgICAgcmV0dXJuIHNlZy5wdXNoKHNlZ21lbnRzW2ldWzJdKTtcbiAgICB9KTtcbiAgICBzZWdtZW50UG9pbnRzRGlzdGFuY2UgPSBnZXRTZWdtZW50UG9pbnRzRGlzdGFuY2Uoc2VnbWVudFBvaW50c0Zvckxlbmd0aCk7XG4gICAgbGluZVNlZ21lbnROdW0gPSBzZWdtZW50UG9pbnRzRGlzdGFuY2UucmVkdWNlKGZ1bmN0aW9uICh0b3RhbCwgc2VnKSB7XG4gICAgICByZXR1cm4gdG90YWwgKyBzZWcubGVuZ3RoO1xuICAgIH0sIDApO1xuICAgIHNlZ21lbnRsZW5ndGggPSBzZWdtZW50UG9pbnRzRGlzdGFuY2UubWFwKGZ1bmN0aW9uIChzZWcpIHtcbiAgICAgIHJldHVybiBnZXROdW1zU3VtKHNlZyk7XG4gICAgfSk7XG4gICAgdG90YWxMZW5ndGggPSBnZXROdW1zU3VtKHNlZ21lbnRsZW5ndGgpO1xuICAgIGF2Z0xlbmd0aCA9IHRvdGFsTGVuZ3RoIC8gbGluZVNlZ21lbnROdW07XG4gICAgdmFyIHN0ZXBTaXplID0gMSAvIHRvdGFsUG9pbnRzTnVtIC8gMTA7IC8vIFJlY3Vyc2l2ZWx5IGZvciBlYWNoIHNlZ21lbnQgb2YgdGhlIHBvbHlsaW5lXG5cbiAgICBnZXRTZWdtZW50VFBvaW50RnVucy5mb3JFYWNoKGZ1bmN0aW9uIChnZXRTZWdtZW50VFBvaW50RnVuLCBpKSB7XG4gICAgICB2YXIgY3VycmVudFNlZ21lbnRQb2ludHNOdW0gPSBzZWdtZW50UG9pbnRzTnVtW2ldO1xuICAgICAgdmFyIHQgPSBuZXcgQXJyYXkoY3VycmVudFNlZ21lbnRQb2ludHNOdW0pLmZpbGwoJycpLm1hcChmdW5jdGlvbiAoZm9vLCBqKSB7XG4gICAgICAgIHJldHVybiBqIC8gc2VnbWVudFBvaW50c051bVtpXTtcbiAgICAgIH0pOyAvLyBSZXBlYXRlZCByZWN1cnNpdmUgb2Zmc2V0XG5cbiAgICAgIGZvciAodmFyIHIgPSAwOyByIDwgcm91bmRzOyByKyspIHtcbiAgICAgICAgdmFyIGRpc3RhbmNlID0gZ2V0U2VnbWVudFBvaW50c0Rpc3RhbmNlKFtzZWdtZW50UG9pbnRzW2ldXSlbMF07XG4gICAgICAgIHZhciBkZXZpYXRpb25zID0gZGlzdGFuY2UubWFwKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgcmV0dXJuIGQgLSBhdmdMZW5ndGg7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgb2Zmc2V0ID0gMDtcblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGN1cnJlbnRTZWdtZW50UG9pbnRzTnVtOyBqKyspIHtcbiAgICAgICAgICBpZiAoaiA9PT0gMCkgcmV0dXJuO1xuICAgICAgICAgIG9mZnNldCArPSBkZXZpYXRpb25zW2ogLSAxXTtcbiAgICAgICAgICB0W2pdIC09IHN0ZXBTaXplICogb2Zmc2V0O1xuICAgICAgICAgIGlmICh0W2pdID4gMSkgdFtqXSA9IDE7XG4gICAgICAgICAgaWYgKHRbal0gPCAwKSB0W2pdID0gMDtcbiAgICAgICAgICBzZWdtZW50UG9pbnRzW2ldW2pdID0gZ2V0U2VnbWVudFRQb2ludEZ1bih0W2pdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJvdW5kcyAqPSA0O1xuICAgIGN5Y2xlcysrO1xuICB9O1xuXG4gIGRvIHtcbiAgICB2YXIgX3JldCA9IF9sb29wKCk7XG5cbiAgICBpZiAoX3JldCA9PT0gXCJicmVha1wiKSBicmVhaztcbiAgfSB3aGlsZSAocm91bmRzIDw9IDEwMjUpO1xuXG4gIHNlZ21lbnRQb2ludHMgPSBzZWdtZW50UG9pbnRzLnJlZHVjZShmdW5jdGlvbiAoYWxsLCBzZWcpIHtcbiAgICByZXR1cm4gYWxsLmNvbmNhdChzZWcpO1xuICB9LCBbXSk7XG4gIHJldHVybiB7XG4gICAgc2VnbWVudFBvaW50czogc2VnbWVudFBvaW50cyxcbiAgICBjeWNsZXM6IGN5Y2xlcyxcbiAgICByb3VuZHM6IHJvdW5kc1xuICB9O1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIHBvbHlsaW5lIGNvcnJlc3BvbmRpbmcgdG8gdGhlIEJlemllciBjdXJ2ZVxyXG4gKiBAcGFyYW0ge0FycmF5fSBiZXppZXJDdXJ2ZSBCZXppZXJDdXJ2ZSBkYXRhXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBwcmVjaXNpb24gIENhbGN1bGF0aW9uIGFjY3VyYWN5LiBSZWNvbW1lbmRlZCBmb3IgMS0yMC4gRGVmYXVsdCA9IDVcclxuICogQHJldHVybiB7QXJyYXl8Qm9vbGVhbn0gUG9pbnQgZGF0YSB0aGF0IGNvbnN0aXR1dGVzIGEgcG9seWxpbmUgYWZ0ZXIgY2FsY3VsYXRpb24gKEludmFsaWQgaW5wdXQgd2lsbCByZXR1cm4gZmFsc2UpXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGJlemllckN1cnZlVG9Qb2x5bGluZShiZXppZXJDdXJ2ZSkge1xuICB2YXIgcHJlY2lzaW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiA1O1xuXG4gIGlmICghYmV6aWVyQ3VydmUpIHtcbiAgICBjb25zb2xlLmVycm9yKCdiZXppZXJDdXJ2ZVRvUG9seWxpbmU6IE1pc3NpbmcgcGFyYW1ldGVycyEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIShiZXppZXJDdXJ2ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2JlemllckN1cnZlVG9Qb2x5bGluZTogUGFyYW1ldGVyIGJlemllckN1cnZlIG11c3QgYmUgYW4gYXJyYXkhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBwcmVjaXNpb24gIT09ICdudW1iZXInKSB7XG4gICAgY29uc29sZS5lcnJvcignYmV6aWVyQ3VydmVUb1BvbHlsaW5lOiBQYXJhbWV0ZXIgcHJlY2lzaW9uIG11c3QgYmUgYSBudW1iZXIhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIF9hYnN0cmFjdEJlemllckN1cnZlVCA9IGFic3RyYWN0QmV6aWVyQ3VydmVUb1BvbHlsaW5lKGJlemllckN1cnZlLCBwcmVjaXNpb24pLFxuICAgICAgc2VnbWVudFBvaW50cyA9IF9hYnN0cmFjdEJlemllckN1cnZlVC5zZWdtZW50UG9pbnRzO1xuXG4gIHJldHVybiBzZWdtZW50UG9pbnRzO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIGJlemllciBjdXJ2ZSBsZW5ndGhcclxuICogQHBhcmFtIHtBcnJheX0gYmV6aWVyQ3VydmUgYmV6aWVyQ3VydmUgZGF0YVxyXG4gKiBAcGFyYW0ge051bWJlcn0gcHJlY2lzaW9uICBjYWxjdWxhdGlvbiBhY2N1cmFjeS4gUmVjb21tZW5kZWQgZm9yIDUtMTAuIERlZmF1bHQgPSA1XHJcbiAqIEByZXR1cm4ge051bWJlcnxCb29sZWFufSBCZXppZXJDdXJ2ZSBsZW5ndGggKEludmFsaWQgaW5wdXQgd2lsbCByZXR1cm4gZmFsc2UpXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldEJlemllckN1cnZlTGVuZ3RoKGJlemllckN1cnZlKSB7XG4gIHZhciBwcmVjaXNpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDU7XG5cbiAgaWYgKCFiZXppZXJDdXJ2ZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldEJlemllckN1cnZlTGVuZ3RoOiBNaXNzaW5nIHBhcmFtZXRlcnMhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCEoYmV6aWVyQ3VydmUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdnZXRCZXppZXJDdXJ2ZUxlbmd0aDogUGFyYW1ldGVyIGJlemllckN1cnZlIG11c3QgYmUgYW4gYXJyYXkhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBwcmVjaXNpb24gIT09ICdudW1iZXInKSB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0QmV6aWVyQ3VydmVMZW5ndGg6IFBhcmFtZXRlciBwcmVjaXNpb24gbXVzdCBiZSBhIG51bWJlciEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgX2Fic3RyYWN0QmV6aWVyQ3VydmVUMiA9IGFic3RyYWN0QmV6aWVyQ3VydmVUb1BvbHlsaW5lKGJlemllckN1cnZlLCBwcmVjaXNpb24pLFxuICAgICAgc2VnbWVudFBvaW50cyA9IF9hYnN0cmFjdEJlemllckN1cnZlVDIuc2VnbWVudFBvaW50czsgLy8gQ2FsY3VsYXRlIHRoZSB0b3RhbCBsZW5ndGggb2YgdGhlIHBvaW50cyB0aGF0IG1ha2UgdXAgdGhlIHBvbHlsaW5lXG5cblxuICB2YXIgcG9pbnRzRGlzdGFuY2UgPSBnZXRTZWdtZW50UG9pbnRzRGlzdGFuY2UoW3NlZ21lbnRQb2ludHNdKVswXTtcbiAgdmFyIGxlbmd0aCA9IGdldE51bXNTdW0ocG9pbnRzRGlzdGFuY2UpO1xuICByZXR1cm4gbGVuZ3RoO1xufVxuXG52YXIgX2RlZmF1bHQgPSBiZXppZXJDdXJ2ZVRvUG9seWxpbmU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdFwiKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX3NsaWNlZFRvQXJyYXkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5XCIpKTtcblxudmFyIF90b0NvbnN1bWFibGVBcnJheTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5XCIpKTtcblxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBBYnN0cmFjdCB0aGUgcG9seWxpbmUgZm9ybWVkIGJ5IE4gcG9pbnRzIGludG8gYSBzZXQgb2YgYmV6aWVyIGN1cnZlXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBvbHlsaW5lIEEgc2V0IG9mIHBvaW50cyB0aGF0IG1ha2UgdXAgYSBwb2x5bGluZVxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNsb3NlICBDbG9zZWQgY3VydmVcclxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldEEgU21vb3RobmVzc1xyXG4gKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0QiBTbW9vdGhuZXNzXHJcbiAqIEByZXR1cm4ge0FycmF5fEJvb2xlYW59IEEgc2V0IG9mIGJlemllciBjdXJ2ZSAoSW52YWxpZCBpbnB1dCB3aWxsIHJldHVybiBmYWxzZSlcclxuICovXG5mdW5jdGlvbiBwb2x5bGluZVRvQmV6aWVyQ3VydmUocG9seWxpbmUpIHtcbiAgdmFyIGNsb3NlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcbiAgdmFyIG9mZnNldEEgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDAuMjU7XG4gIHZhciBvZmZzZXRCID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAwLjI1O1xuXG4gIGlmICghKHBvbHlsaW5lIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgY29uc29sZS5lcnJvcigncG9seWxpbmVUb0JlemllckN1cnZlOiBQYXJhbWV0ZXIgcG9seWxpbmUgbXVzdCBiZSBhbiBhcnJheSEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocG9seWxpbmUubGVuZ3RoIDw9IDIpIHtcbiAgICBjb25zb2xlLmVycm9yKCdwb2x5bGluZVRvQmV6aWVyQ3VydmU6IENvbnZlcnRpbmcgdG8gYSBjdXJ2ZSByZXF1aXJlcyBhdCBsZWFzdCAzIHBvaW50cyEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgc3RhcnRQb2ludCA9IHBvbHlsaW5lWzBdO1xuICB2YXIgYmV6aWVyQ3VydmVMaW5lTnVtID0gcG9seWxpbmUubGVuZ3RoIC0gMTtcbiAgdmFyIGJlemllckN1cnZlUG9pbnRzID0gbmV3IEFycmF5KGJlemllckN1cnZlTGluZU51bSkuZmlsbCgwKS5tYXAoZnVuY3Rpb24gKGZvbywgaSkge1xuICAgIHJldHVybiBbXS5jb25jYXQoKDAsIF90b0NvbnN1bWFibGVBcnJheTJbXCJkZWZhdWx0XCJdKShnZXRCZXppZXJDdXJ2ZUxpbmVDb250cm9sUG9pbnRzKHBvbHlsaW5lLCBpLCBjbG9zZSwgb2Zmc2V0QSwgb2Zmc2V0QikpLCBbcG9seWxpbmVbaSArIDFdXSk7XG4gIH0pO1xuICBpZiAoY2xvc2UpIGNsb3NlQmV6aWVyQ3VydmUoYmV6aWVyQ3VydmVQb2ludHMsIHN0YXJ0UG9pbnQpO1xuICBiZXppZXJDdXJ2ZVBvaW50cy51bnNoaWZ0KHBvbHlsaW5lWzBdKTtcbiAgcmV0dXJuIGJlemllckN1cnZlUG9pbnRzO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIGNvbnRyb2wgcG9pbnRzIG9mIHRoZSBCZXppZXIgY3VydmVcclxuICogQHBhcmFtIHtBcnJheX0gcG9seWxpbmUgQSBzZXQgb2YgcG9pbnRzIHRoYXQgbWFrZSB1cCBhIHBvbHlsaW5lXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCAgIFRoZSBpbmRleCBvZiB3aGljaCBnZXQgY29udHJvbHMgcG9pbnRzJ3MgcG9pbnQgaW4gcG9seWxpbmVcclxuICogQHBhcmFtIHtCb29sZWFufSBjbG9zZSAgQ2xvc2VkIGN1cnZlXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXRBIFNtb290aG5lc3NcclxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldEIgU21vb3RobmVzc1xyXG4gKiBAcmV0dXJuIHtBcnJheX0gQ29udHJvbCBwb2ludHNcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0QmV6aWVyQ3VydmVMaW5lQ29udHJvbFBvaW50cyhwb2x5bGluZSwgaW5kZXgpIHtcbiAgdmFyIGNsb3NlID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmYWxzZTtcbiAgdmFyIG9mZnNldEEgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IDAuMjU7XG4gIHZhciBvZmZzZXRCID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiAwLjI1O1xuICB2YXIgcG9pbnROdW0gPSBwb2x5bGluZS5sZW5ndGg7XG4gIGlmIChwb2ludE51bSA8IDMgfHwgaW5kZXggPj0gcG9pbnROdW0pIHJldHVybjtcbiAgdmFyIGJlZm9yZVBvaW50SW5kZXggPSBpbmRleCAtIDE7XG4gIGlmIChiZWZvcmVQb2ludEluZGV4IDwgMCkgYmVmb3JlUG9pbnRJbmRleCA9IGNsb3NlID8gcG9pbnROdW0gKyBiZWZvcmVQb2ludEluZGV4IDogMDtcbiAgdmFyIGFmdGVyUG9pbnRJbmRleCA9IGluZGV4ICsgMTtcbiAgaWYgKGFmdGVyUG9pbnRJbmRleCA+PSBwb2ludE51bSkgYWZ0ZXJQb2ludEluZGV4ID0gY2xvc2UgPyBhZnRlclBvaW50SW5kZXggLSBwb2ludE51bSA6IHBvaW50TnVtIC0gMTtcbiAgdmFyIGFmdGVyTmV4dFBvaW50SW5kZXggPSBpbmRleCArIDI7XG4gIGlmIChhZnRlck5leHRQb2ludEluZGV4ID49IHBvaW50TnVtKSBhZnRlck5leHRQb2ludEluZGV4ID0gY2xvc2UgPyBhZnRlck5leHRQb2ludEluZGV4IC0gcG9pbnROdW0gOiBwb2ludE51bSAtIDE7XG4gIHZhciBwb2ludEJlZm9yZSA9IHBvbHlsaW5lW2JlZm9yZVBvaW50SW5kZXhdO1xuICB2YXIgcG9pbnRNaWRkbGUgPSBwb2x5bGluZVtpbmRleF07XG4gIHZhciBwb2ludEFmdGVyID0gcG9seWxpbmVbYWZ0ZXJQb2ludEluZGV4XTtcbiAgdmFyIHBvaW50QWZ0ZXJOZXh0ID0gcG9seWxpbmVbYWZ0ZXJOZXh0UG9pbnRJbmRleF07XG4gIHJldHVybiBbW3BvaW50TWlkZGxlWzBdICsgb2Zmc2V0QSAqIChwb2ludEFmdGVyWzBdIC0gcG9pbnRCZWZvcmVbMF0pLCBwb2ludE1pZGRsZVsxXSArIG9mZnNldEEgKiAocG9pbnRBZnRlclsxXSAtIHBvaW50QmVmb3JlWzFdKV0sIFtwb2ludEFmdGVyWzBdIC0gb2Zmc2V0QiAqIChwb2ludEFmdGVyTmV4dFswXSAtIHBvaW50TWlkZGxlWzBdKSwgcG9pbnRBZnRlclsxXSAtIG9mZnNldEIgKiAocG9pbnRBZnRlck5leHRbMV0gLSBwb2ludE1pZGRsZVsxXSldXTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSBsYXN0IGN1cnZlIG9mIHRoZSBjbG9zdXJlXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGJlemllckN1cnZlIEEgc2V0IG9mIHN1Yi1jdXJ2ZVxyXG4gKiBAcGFyYW0ge0FycmF5fSBzdGFydFBvaW50ICBTdGFydCBwb2ludFxyXG4gKiBAcmV0dXJuIHtBcnJheX0gVGhlIGxhc3QgY3VydmUgZm9yIGNsb3N1cmVcclxuICovXG5cblxuZnVuY3Rpb24gY2xvc2VCZXppZXJDdXJ2ZShiZXppZXJDdXJ2ZSwgc3RhcnRQb2ludCkge1xuICB2YXIgZmlyc3RTdWJDdXJ2ZSA9IGJlemllckN1cnZlWzBdO1xuICB2YXIgbGFzdFN1YkN1cnZlID0gYmV6aWVyQ3VydmUuc2xpY2UoLTEpWzBdO1xuICBiZXppZXJDdXJ2ZS5wdXNoKFtnZXRTeW1tZXRyeVBvaW50KGxhc3RTdWJDdXJ2ZVsxXSwgbGFzdFN1YkN1cnZlWzJdKSwgZ2V0U3ltbWV0cnlQb2ludChmaXJzdFN1YkN1cnZlWzBdLCBzdGFydFBvaW50KSwgc3RhcnRQb2ludF0pO1xuICByZXR1cm4gYmV6aWVyQ3VydmU7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgc3ltbWV0cnkgcG9pbnRcclxuICogQHBhcmFtIHtBcnJheX0gcG9pbnQgICAgICAgU3ltbWV0cmljIHBvaW50XHJcbiAqIEBwYXJhbSB7QXJyYXl9IGNlbnRlclBvaW50IFN5bW1ldHJpYyBjZW50ZXJcclxuICogQHJldHVybiB7QXJyYXl9IFN5bW1ldHJpYyBwb2ludFxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRTeW1tZXRyeVBvaW50KHBvaW50LCBjZW50ZXJQb2ludCkge1xuICB2YXIgX3BvaW50ID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKHBvaW50LCAyKSxcbiAgICAgIHB4ID0gX3BvaW50WzBdLFxuICAgICAgcHkgPSBfcG9pbnRbMV07XG5cbiAgdmFyIF9jZW50ZXJQb2ludCA9ICgwLCBfc2xpY2VkVG9BcnJheTJbXCJkZWZhdWx0XCJdKShjZW50ZXJQb2ludCwgMiksXG4gICAgICBjeCA9IF9jZW50ZXJQb2ludFswXSxcbiAgICAgIGN5ID0gX2NlbnRlclBvaW50WzFdO1xuXG4gIHZhciBtaW51c1ggPSBjeCAtIHB4O1xuICB2YXIgbWludXNZID0gY3kgLSBweTtcbiAgcmV0dXJuIFtjeCArIG1pbnVzWCwgY3kgKyBtaW51c1ldO1xufVxuXG52YXIgX2RlZmF1bHQgPSBwb2x5bGluZVRvQmV6aWVyQ3VydmU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdFwiKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImJlemllckN1cnZlVG9Qb2x5bGluZVwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfYmV6aWVyQ3VydmVUb1BvbHlsaW5lLmJlemllckN1cnZlVG9Qb2x5bGluZTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJnZXRCZXppZXJDdXJ2ZUxlbmd0aFwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfYmV6aWVyQ3VydmVUb1BvbHlsaW5lLmdldEJlemllckN1cnZlTGVuZ3RoO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInBvbHlsaW5lVG9CZXppZXJDdXJ2ZVwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfcG9seWxpbmVUb0JlemllckN1cnZlW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9iZXppZXJDdXJ2ZVRvUG9seWxpbmUgPSByZXF1aXJlKFwiLi9jb3JlL2JlemllckN1cnZlVG9Qb2x5bGluZVwiKTtcblxudmFyIF9wb2x5bGluZVRvQmV6aWVyQ3VydmUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2NvcmUvcG9seWxpbmVUb0JlemllckN1cnZlXCIpKTtcblxudmFyIF9kZWZhdWx0ID0ge1xuICBiZXppZXJDdXJ2ZVRvUG9seWxpbmU6IF9iZXppZXJDdXJ2ZVRvUG9seWxpbmUuYmV6aWVyQ3VydmVUb1BvbHlsaW5lLFxuICBnZXRCZXppZXJDdXJ2ZUxlbmd0aDogX2JlemllckN1cnZlVG9Qb2x5bGluZS5nZXRCZXppZXJDdXJ2ZUxlbmd0aCxcbiAgcG9seWxpbmVUb0JlemllckN1cnZlOiBfcG9seWxpbmVUb0JlemllckN1cnZlW1wiZGVmYXVsdFwiXVxufTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9kZWZhdWx0ID0gbmV3IE1hcChbWyd0cmFuc3BhcmVudCcsICdyZ2JhKDAsMCwwLDApJ10sIFsnYmxhY2snLCAnIzAwMDAwMCddLCBbJ3NpbHZlcicsICcjQzBDMEMwJ10sIFsnZ3JheScsICcjODA4MDgwJ10sIFsnd2hpdGUnLCAnI0ZGRkZGRiddLCBbJ21hcm9vbicsICcjODAwMDAwJ10sIFsncmVkJywgJyNGRjAwMDAnXSwgWydwdXJwbGUnLCAnIzgwMDA4MCddLCBbJ2Z1Y2hzaWEnLCAnI0ZGMDBGRiddLCBbJ2dyZWVuJywgJyMwMDgwMDAnXSwgWydsaW1lJywgJyMwMEZGMDAnXSwgWydvbGl2ZScsICcjODA4MDAwJ10sIFsneWVsbG93JywgJyNGRkZGMDAnXSwgWyduYXZ5JywgJyMwMDAwODAnXSwgWydibHVlJywgJyMwMDAwRkYnXSwgWyd0ZWFsJywgJyMwMDgwODAnXSwgWydhcXVhJywgJyMwMEZGRkYnXSwgWydhbGljZWJsdWUnLCAnI2YwZjhmZiddLCBbJ2FudGlxdWV3aGl0ZScsICcjZmFlYmQ3J10sIFsnYXF1YW1hcmluZScsICcjN2ZmZmQ0J10sIFsnYXp1cmUnLCAnI2YwZmZmZiddLCBbJ2JlaWdlJywgJyNmNWY1ZGMnXSwgWydiaXNxdWUnLCAnI2ZmZTRjNCddLCBbJ2JsYW5jaGVkYWxtb25kJywgJyNmZmViY2QnXSwgWydibHVldmlvbGV0JywgJyM4YTJiZTInXSwgWydicm93bicsICcjYTUyYTJhJ10sIFsnYnVybHl3b29kJywgJyNkZWI4ODcnXSwgWydjYWRldGJsdWUnLCAnIzVmOWVhMCddLCBbJ2NoYXJ0cmV1c2UnLCAnIzdmZmYwMCddLCBbJ2Nob2NvbGF0ZScsICcjZDI2OTFlJ10sIFsnY29yYWwnLCAnI2ZmN2Y1MCddLCBbJ2Nvcm5mbG93ZXJibHVlJywgJyM2NDk1ZWQnXSwgWydjb3Juc2lsaycsICcjZmZmOGRjJ10sIFsnY3JpbXNvbicsICcjZGMxNDNjJ10sIFsnY3lhbicsICcjMDBmZmZmJ10sIFsnZGFya2JsdWUnLCAnIzAwMDA4YiddLCBbJ2RhcmtjeWFuJywgJyMwMDhiOGInXSwgWydkYXJrZ29sZGVucm9kJywgJyNiODg2MGInXSwgWydkYXJrZ3JheScsICcjYTlhOWE5J10sIFsnZGFya2dyZWVuJywgJyMwMDY0MDAnXSwgWydkYXJrZ3JleScsICcjYTlhOWE5J10sIFsnZGFya2toYWtpJywgJyNiZGI3NmInXSwgWydkYXJrbWFnZW50YScsICcjOGIwMDhiJ10sIFsnZGFya29saXZlZ3JlZW4nLCAnIzU1NmIyZiddLCBbJ2RhcmtvcmFuZ2UnLCAnI2ZmOGMwMCddLCBbJ2RhcmtvcmNoaWQnLCAnIzk5MzJjYyddLCBbJ2RhcmtyZWQnLCAnIzhiMDAwMCddLCBbJ2RhcmtzYWxtb24nLCAnI2U5OTY3YSddLCBbJ2RhcmtzZWFncmVlbicsICcjOGZiYzhmJ10sIFsnZGFya3NsYXRlYmx1ZScsICcjNDgzZDhiJ10sIFsnZGFya3NsYXRlZ3JheScsICcjMmY0ZjRmJ10sIFsnZGFya3NsYXRlZ3JleScsICcjMmY0ZjRmJ10sIFsnZGFya3R1cnF1b2lzZScsICcjMDBjZWQxJ10sIFsnZGFya3Zpb2xldCcsICcjOTQwMGQzJ10sIFsnZGVlcHBpbmsnLCAnI2ZmMTQ5MyddLCBbJ2RlZXBza3libHVlJywgJyMwMGJmZmYnXSwgWydkaW1ncmF5JywgJyM2OTY5NjknXSwgWydkaW1ncmV5JywgJyM2OTY5NjknXSwgWydkb2RnZXJibHVlJywgJyMxZTkwZmYnXSwgWydmaXJlYnJpY2snLCAnI2IyMjIyMiddLCBbJ2Zsb3JhbHdoaXRlJywgJyNmZmZhZjAnXSwgWydmb3Jlc3RncmVlbicsICcjMjI4YjIyJ10sIFsnZ2FpbnNib3JvJywgJyNkY2RjZGMnXSwgWydnaG9zdHdoaXRlJywgJyNmOGY4ZmYnXSwgWydnb2xkJywgJyNmZmQ3MDAnXSwgWydnb2xkZW5yb2QnLCAnI2RhYTUyMCddLCBbJ2dyZWVueWVsbG93JywgJyNhZGZmMmYnXSwgWydncmV5JywgJyM4MDgwODAnXSwgWydob25leWRldycsICcjZjBmZmYwJ10sIFsnaG90cGluaycsICcjZmY2OWI0J10sIFsnaW5kaWFucmVkJywgJyNjZDVjNWMnXSwgWydpbmRpZ28nLCAnIzRiMDA4MiddLCBbJ2l2b3J5JywgJyNmZmZmZjAnXSwgWydraGFraScsICcjZjBlNjhjJ10sIFsnbGF2ZW5kZXInLCAnI2U2ZTZmYSddLCBbJ2xhdmVuZGVyYmx1c2gnLCAnI2ZmZjBmNSddLCBbJ2xhd25ncmVlbicsICcjN2NmYzAwJ10sIFsnbGVtb25jaGlmZm9uJywgJyNmZmZhY2QnXSwgWydsaWdodGJsdWUnLCAnI2FkZDhlNiddLCBbJ2xpZ2h0Y29yYWwnLCAnI2YwODA4MCddLCBbJ2xpZ2h0Y3lhbicsICcjZTBmZmZmJ10sIFsnbGlnaHRnb2xkZW5yb2R5ZWxsb3cnLCAnI2ZhZmFkMiddLCBbJ2xpZ2h0Z3JheScsICcjZDNkM2QzJ10sIFsnbGlnaHRncmVlbicsICcjOTBlZTkwJ10sIFsnbGlnaHRncmV5JywgJyNkM2QzZDMnXSwgWydsaWdodHBpbmsnLCAnI2ZmYjZjMSddLCBbJ2xpZ2h0c2FsbW9uJywgJyNmZmEwN2EnXSwgWydsaWdodHNlYWdyZWVuJywgJyMyMGIyYWEnXSwgWydsaWdodHNreWJsdWUnLCAnIzg3Y2VmYSddLCBbJ2xpZ2h0c2xhdGVncmF5JywgJyM3Nzg4OTknXSwgWydsaWdodHNsYXRlZ3JleScsICcjNzc4ODk5J10sIFsnbGlnaHRzdGVlbGJsdWUnLCAnI2IwYzRkZSddLCBbJ2xpZ2h0eWVsbG93JywgJyNmZmZmZTAnXSwgWydsaW1lZ3JlZW4nLCAnIzMyY2QzMiddLCBbJ2xpbmVuJywgJyNmYWYwZTYnXSwgWydtYWdlbnRhJywgJyNmZjAwZmYnXSwgWydtZWRpdW1hcXVhbWFyaW5lJywgJyM2NmNkYWEnXSwgWydtZWRpdW1ibHVlJywgJyMwMDAwY2QnXSwgWydtZWRpdW1vcmNoaWQnLCAnI2JhNTVkMyddLCBbJ21lZGl1bXB1cnBsZScsICcjOTM3MGRiJ10sIFsnbWVkaXVtc2VhZ3JlZW4nLCAnIzNjYjM3MSddLCBbJ21lZGl1bXNsYXRlYmx1ZScsICcjN2I2OGVlJ10sIFsnbWVkaXVtc3ByaW5nZ3JlZW4nLCAnIzAwZmE5YSddLCBbJ21lZGl1bXR1cnF1b2lzZScsICcjNDhkMWNjJ10sIFsnbWVkaXVtdmlvbGV0cmVkJywgJyNjNzE1ODUnXSwgWydtaWRuaWdodGJsdWUnLCAnIzE5MTk3MCddLCBbJ21pbnRjcmVhbScsICcjZjVmZmZhJ10sIFsnbWlzdHlyb3NlJywgJyNmZmU0ZTEnXSwgWydtb2NjYXNpbicsICcjZmZlNGI1J10sIFsnbmF2YWpvd2hpdGUnLCAnI2ZmZGVhZCddLCBbJ29sZGxhY2UnLCAnI2ZkZjVlNiddLCBbJ29saXZlZHJhYicsICcjNmI4ZTIzJ10sIFsnb3JhbmdlJywgJyNmZmE1MDAnXSwgWydvcmFuZ2VyZWQnLCAnI2ZmNDUwMCddLCBbJ29yY2hpZCcsICcjZGE3MGQ2J10sIFsncGFsZWdvbGRlbnJvZCcsICcjZWVlOGFhJ10sIFsncGFsZWdyZWVuJywgJyM5OGZiOTgnXSwgWydwYWxldHVycXVvaXNlJywgJyNhZmVlZWUnXSwgWydwYWxldmlvbGV0cmVkJywgJyNkYjcwOTMnXSwgWydwYXBheWF3aGlwJywgJyNmZmVmZDUnXSwgWydwZWFjaHB1ZmYnLCAnI2ZmZGFiOSddLCBbJ3BlcnUnLCAnI2NkODUzZiddLCBbJ3BpbmsnLCAnI2ZmYzBjYiddLCBbJ3BsdW0nLCAnI2RkYTBkZCddLCBbJ3Bvd2RlcmJsdWUnLCAnI2IwZTBlNiddLCBbJ3Jvc3licm93bicsICcjYmM4ZjhmJ10sIFsncm95YWxibHVlJywgJyM0MTY5ZTEnXSwgWydzYWRkbGVicm93bicsICcjOGI0NTEzJ10sIFsnc2FsbW9uJywgJyNmYTgwNzInXSwgWydzYW5keWJyb3duJywgJyNmNGE0NjAnXSwgWydzZWFncmVlbicsICcjMmU4YjU3J10sIFsnc2Vhc2hlbGwnLCAnI2ZmZjVlZSddLCBbJ3NpZW5uYScsICcjYTA1MjJkJ10sIFsnc2t5Ymx1ZScsICcjODdjZWViJ10sIFsnc2xhdGVibHVlJywgJyM2YTVhY2QnXSwgWydzbGF0ZWdyYXknLCAnIzcwODA5MCddLCBbJ3NsYXRlZ3JleScsICcjNzA4MDkwJ10sIFsnc25vdycsICcjZmZmYWZhJ10sIFsnc3ByaW5nZ3JlZW4nLCAnIzAwZmY3ZiddLCBbJ3N0ZWVsYmx1ZScsICcjNDY4MmI0J10sIFsndGFuJywgJyNkMmI0OGMnXSwgWyd0aGlzdGxlJywgJyNkOGJmZDgnXSwgWyd0b21hdG8nLCAnI2ZmNjM0NyddLCBbJ3R1cnF1b2lzZScsICcjNDBlMGQwJ10sIFsndmlvbGV0JywgJyNlZTgyZWUnXSwgWyd3aGVhdCcsICcjZjVkZWIzJ10sIFsnd2hpdGVzbW9rZScsICcjZjVmNWY1J10sIFsneWVsbG93Z3JlZW4nLCAnIzlhY2QzMiddXSk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW50ZXJvcFJlcXVpcmVEZWZhdWx0XCIpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5nZXRSZ2JWYWx1ZSA9IGdldFJnYlZhbHVlO1xuZXhwb3J0cy5nZXRSZ2JhVmFsdWUgPSBnZXRSZ2JhVmFsdWU7XG5leHBvcnRzLmdldE9wYWNpdHkgPSBnZXRPcGFjaXR5O1xuZXhwb3J0cy50b1JnYiA9IHRvUmdiO1xuZXhwb3J0cy50b0hleCA9IHRvSGV4O1xuZXhwb3J0cy5nZXRDb2xvckZyb21SZ2JWYWx1ZSA9IGdldENvbG9yRnJvbVJnYlZhbHVlO1xuZXhwb3J0cy5kYXJrZW4gPSBkYXJrZW47XG5leHBvcnRzLmxpZ2h0ZW4gPSBsaWdodGVuO1xuZXhwb3J0cy5mYWRlID0gZmFkZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX3RvQ29uc3VtYWJsZUFycmF5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvdG9Db25zdW1hYmxlQXJyYXlcIikpO1xuXG52YXIgX2tleXdvcmRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9jb25maWcva2V5d29yZHNcIikpO1xuXG52YXIgaGV4UmVnID0gL14jKFswLTlhLWZBLWZdezN9fFswLTlhLWZBLWZdezZ9KSQvO1xudmFyIHJnYlJlZyA9IC9eKHJnYnxyZ2JhfFJHQnxSR0JBKS87XG52YXIgcmdiYVJlZyA9IC9eKHJnYmF8UkdCQSkvO1xuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBDb2xvciB2YWxpZGF0b3JcclxuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIEhleHxSZ2J8UmdiYSBjb2xvciBvciBjb2xvciBrZXl3b3JkXHJcbiAqIEByZXR1cm4ge1N0cmluZ3xCb29sZWFufSBWYWxpZCBjb2xvciBPciBmYWxzZVxyXG4gKi9cblxuZnVuY3Rpb24gdmFsaWRhdG9yKGNvbG9yKSB7XG4gIHZhciBpc0hleCA9IGhleFJlZy50ZXN0KGNvbG9yKTtcbiAgdmFyIGlzUmdiID0gcmdiUmVnLnRlc3QoY29sb3IpO1xuICBpZiAoaXNIZXggfHwgaXNSZ2IpIHJldHVybiBjb2xvcjtcbiAgY29sb3IgPSBnZXRDb2xvckJ5S2V5d29yZChjb2xvcik7XG5cbiAgaWYgKCFjb2xvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0NvbG9yOiBJbnZhbGlkIGNvbG9yIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBjb2xvcjtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IGNvbG9yIGJ5IGtleXdvcmRcclxuICogQHBhcmFtIHtTdHJpbmd9IGtleXdvcmQgQ29sb3Iga2V5d29yZCBsaWtlIHJlZCwgZ3JlZW4gYW5kIGV0Yy5cclxuICogQHJldHVybiB7U3RyaW5nfEJvb2xlYW59IEhleCBvciByZ2JhIGNvbG9yIChJbnZhbGlkIGtleXdvcmQgd2lsbCByZXR1cm4gZmFsc2UpXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldENvbG9yQnlLZXl3b3JkKGtleXdvcmQpIHtcbiAgaWYgKCFrZXl3b3JkKSB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0Q29sb3JCeUtleXdvcmRzOiBNaXNzaW5nIHBhcmFtZXRlcnMhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFfa2V5d29yZHNbXCJkZWZhdWx0XCJdLmhhcyhrZXl3b3JkKSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gX2tleXdvcmRzW1wiZGVmYXVsdFwiXS5nZXQoa2V5d29yZCk7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgUmdiIHZhbHVlIG9mIHRoZSBjb2xvclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sb3IgSGV4fFJnYnxSZ2JhIGNvbG9yIG9yIGNvbG9yIGtleXdvcmRcclxuICogQHJldHVybiB7QXJyYXk8TnVtYmVyPnxCb29sZWFufSBSZ2IgdmFsdWUgb2YgdGhlIGNvbG9yIChJbnZhbGlkIGlucHV0IHdpbGwgcmV0dXJuIGZhbHNlKVxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRSZ2JWYWx1ZShjb2xvcikge1xuICBpZiAoIWNvbG9yKSB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0UmdiVmFsdWU6IE1pc3NpbmcgcGFyYW1ldGVycyEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb2xvciA9IHZhbGlkYXRvcihjb2xvcik7XG4gIGlmICghY29sb3IpIHJldHVybiBmYWxzZTtcbiAgdmFyIGlzSGV4ID0gaGV4UmVnLnRlc3QoY29sb3IpO1xuICB2YXIgaXNSZ2IgPSByZ2JSZWcudGVzdChjb2xvcik7XG4gIHZhciBsb3dlckNvbG9yID0gY29sb3IudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGlzSGV4KSByZXR1cm4gZ2V0UmdiVmFsdWVGcm9tSGV4KGxvd2VyQ29sb3IpO1xuICBpZiAoaXNSZ2IpIHJldHVybiBnZXRSZ2JWYWx1ZUZyb21SZ2IobG93ZXJDb2xvcik7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgcmdiIHZhbHVlIG9mIHRoZSBoZXggY29sb3JcclxuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIEhleCBjb2xvclxyXG4gKiBAcmV0dXJuIHtBcnJheTxOdW1iZXI+fSBSZ2IgdmFsdWUgb2YgdGhlIGNvbG9yXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFJnYlZhbHVlRnJvbUhleChjb2xvcikge1xuICBjb2xvciA9IGNvbG9yLnJlcGxhY2UoJyMnLCAnJyk7XG4gIGlmIChjb2xvci5sZW5ndGggPT09IDMpIGNvbG9yID0gQXJyYXkuZnJvbShjb2xvcikubWFwKGZ1bmN0aW9uIChoZXhOdW0pIHtcbiAgICByZXR1cm4gaGV4TnVtICsgaGV4TnVtO1xuICB9KS5qb2luKCcnKTtcbiAgY29sb3IgPSBjb2xvci5zcGxpdCgnJyk7XG4gIHJldHVybiBuZXcgQXJyYXkoMykuZmlsbCgwKS5tYXAoZnVuY3Rpb24gKHQsIGkpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoXCIweFwiLmNvbmNhdChjb2xvcltpICogMl0pLmNvbmNhdChjb2xvcltpICogMiArIDFdKSk7XG4gIH0pO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIHJnYiB2YWx1ZSBvZiB0aGUgcmdiL3JnYmEgY29sb3JcclxuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIEhleCBjb2xvclxyXG4gKiBAcmV0dXJuIHtBcnJheX0gUmdiIHZhbHVlIG9mIHRoZSBjb2xvclxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRSZ2JWYWx1ZUZyb21SZ2IoY29sb3IpIHtcbiAgcmV0dXJuIGNvbG9yLnJlcGxhY2UoL3JnYlxcKHxyZ2JhXFwofFxcKS9nLCAnJykuc3BsaXQoJywnKS5zbGljZSgwLCAzKS5tYXAoZnVuY3Rpb24gKG4pIHtcbiAgICByZXR1cm4gcGFyc2VJbnQobik7XG4gIH0pO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIFJnYmEgdmFsdWUgb2YgdGhlIGNvbG9yXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciBIZXh8UmdifFJnYmEgY29sb3Igb3IgY29sb3Iga2V5d29yZFxyXG4gKiBAcmV0dXJuIHtBcnJheTxOdW1iZXI+fEJvb2xlYW59IFJnYmEgdmFsdWUgb2YgdGhlIGNvbG9yIChJbnZhbGlkIGlucHV0IHdpbGwgcmV0dXJuIGZhbHNlKVxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRSZ2JhVmFsdWUoY29sb3IpIHtcbiAgaWYgKCFjb2xvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldFJnYmFWYWx1ZTogTWlzc2luZyBwYXJhbWV0ZXJzIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBjb2xvclZhbHVlID0gZ2V0UmdiVmFsdWUoY29sb3IpO1xuICBpZiAoIWNvbG9yVmFsdWUpIHJldHVybiBmYWxzZTtcbiAgY29sb3JWYWx1ZS5wdXNoKGdldE9wYWNpdHkoY29sb3IpKTtcbiAgcmV0dXJuIGNvbG9yVmFsdWU7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgb3BhY2l0eSBvZiBjb2xvclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sb3IgSGV4fFJnYnxSZ2JhIGNvbG9yIG9yIGNvbG9yIGtleXdvcmRcclxuICogQHJldHVybiB7TnVtYmVyfEJvb2xlYW59IENvbG9yIG9wYWNpdHkgKEludmFsaWQgaW5wdXQgd2lsbCByZXR1cm4gZmFsc2UpXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldE9wYWNpdHkoY29sb3IpIHtcbiAgaWYgKCFjb2xvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldE9wYWNpdHk6IE1pc3NpbmcgcGFyYW1ldGVycyEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb2xvciA9IHZhbGlkYXRvcihjb2xvcik7XG4gIGlmICghY29sb3IpIHJldHVybiBmYWxzZTtcbiAgdmFyIGlzUmdiYSA9IHJnYmFSZWcudGVzdChjb2xvcik7XG4gIGlmICghaXNSZ2JhKSByZXR1cm4gMTtcbiAgY29sb3IgPSBjb2xvci50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gTnVtYmVyKGNvbG9yLnNwbGl0KCcsJykuc2xpY2UoLTEpWzBdLnJlcGxhY2UoL1spfFxcc10vZywgJycpKTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQ29udmVydCBjb2xvciB0byBSZ2J8UmdiYSBjb2xvclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sb3IgICBIZXh8UmdifFJnYmEgY29sb3Igb3IgY29sb3Iga2V5d29yZFxyXG4gKiBAcGFyYW0ge051bWJlcn0gb3BhY2l0eSBUaGUgb3BhY2l0eSBvZiBjb2xvclxyXG4gKiBAcmV0dXJuIHtTdHJpbmd8Qm9vbGVhbn0gUmdifFJnYmEgY29sb3IgKEludmFsaWQgaW5wdXQgd2lsbCByZXR1cm4gZmFsc2UpXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIHRvUmdiKGNvbG9yLCBvcGFjaXR5KSB7XG4gIGlmICghY29sb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCd0b1JnYjogTWlzc2luZyBwYXJhbWV0ZXJzIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciByZ2JWYWx1ZSA9IGdldFJnYlZhbHVlKGNvbG9yKTtcbiAgaWYgKCFyZ2JWYWx1ZSkgcmV0dXJuIGZhbHNlO1xuICB2YXIgYWRkT3BhY2l0eSA9IHR5cGVvZiBvcGFjaXR5ID09PSAnbnVtYmVyJztcbiAgaWYgKGFkZE9wYWNpdHkpIHJldHVybiAncmdiYSgnICsgcmdiVmFsdWUuam9pbignLCcpICsgXCIsXCIuY29uY2F0KG9wYWNpdHksIFwiKVwiKTtcbiAgcmV0dXJuICdyZ2IoJyArIHJnYlZhbHVlLmpvaW4oJywnKSArICcpJztcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQ29udmVydCBjb2xvciB0byBIZXggY29sb3JcclxuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIEhleHxSZ2J8UmdiYSBjb2xvciBvciBjb2xvciBrZXl3b3JkXHJcbiAqIEByZXR1cm4ge1N0cmluZ3xCb29sZWFufSBIZXggY29sb3IgKEludmFsaWQgaW5wdXQgd2lsbCByZXR1cm4gZmFsc2UpXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIHRvSGV4KGNvbG9yKSB7XG4gIGlmICghY29sb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCd0b0hleDogTWlzc2luZyBwYXJhbWV0ZXJzIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChoZXhSZWcudGVzdChjb2xvcikpIHJldHVybiBjb2xvcjtcbiAgY29sb3IgPSBnZXRSZ2JWYWx1ZShjb2xvcik7XG4gIGlmICghY29sb3IpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuICcjJyArIGNvbG9yLm1hcChmdW5jdGlvbiAobikge1xuICAgIHJldHVybiBOdW1iZXIobikudG9TdHJpbmcoMTYpO1xuICB9KS5tYXAoZnVuY3Rpb24gKG4pIHtcbiAgICByZXR1cm4gbiA9PT0gJzAnID8gJzAwJyA6IG47XG4gIH0pLmpvaW4oJycpO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgQ29sb3IgZnJvbSBSZ2J8UmdiYSB2YWx1ZVxyXG4gKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IHZhbHVlIFJnYnxSZ2JhIGNvbG9yIHZhbHVlXHJcbiAqIEByZXR1cm4ge1N0cmluZ3xCb29sZWFufSBSZ2J8UmdiYSBjb2xvciAoSW52YWxpZCBpbnB1dCB3aWxsIHJldHVybiBmYWxzZSlcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0Q29sb3JGcm9tUmdiVmFsdWUodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldENvbG9yRnJvbVJnYlZhbHVlOiBNaXNzaW5nIHBhcmFtZXRlcnMhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHZhbHVlTGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuXG4gIGlmICh2YWx1ZUxlbmd0aCAhPT0gMyAmJiB2YWx1ZUxlbmd0aCAhPT0gNCkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2dldENvbG9yRnJvbVJnYlZhbHVlOiBWYWx1ZSBpcyBpbGxlZ2FsIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBjb2xvciA9IHZhbHVlTGVuZ3RoID09PSAzID8gJ3JnYignIDogJ3JnYmEoJztcbiAgY29sb3IgKz0gdmFsdWUuam9pbignLCcpICsgJyknO1xuICByZXR1cm4gY29sb3I7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIERlZXBlbiBjb2xvclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sb3IgSGV4fFJnYnxSZ2JhIGNvbG9yIG9yIGNvbG9yIGtleXdvcmRcclxuICogQHJldHVybiB7TnVtYmVyfSBQZXJjZW50IG9mIERlZXBlbiAoMS0xMDApXHJcbiAqIEByZXR1cm4ge1N0cmluZ3xCb29sZWFufSBSZ2JhIGNvbG9yIChJbnZhbGlkIGlucHV0IHdpbGwgcmV0dXJuIGZhbHNlKVxyXG4gKi9cblxuXG5mdW5jdGlvbiBkYXJrZW4oY29sb3IpIHtcbiAgdmFyIHBlcmNlbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG5cbiAgaWYgKCFjb2xvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2RhcmtlbjogTWlzc2luZyBwYXJhbWV0ZXJzIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciByZ2JhVmFsdWUgPSBnZXRSZ2JhVmFsdWUoY29sb3IpO1xuICBpZiAoIXJnYmFWYWx1ZSkgcmV0dXJuIGZhbHNlO1xuICByZ2JhVmFsdWUgPSByZ2JhVmFsdWUubWFwKGZ1bmN0aW9uICh2LCBpKSB7XG4gICAgcmV0dXJuIGkgPT09IDMgPyB2IDogdiAtIE1hdGguY2VpbCgyLjU1ICogcGVyY2VudCk7XG4gIH0pLm1hcChmdW5jdGlvbiAodikge1xuICAgIHJldHVybiB2IDwgMCA/IDAgOiB2O1xuICB9KTtcbiAgcmV0dXJuIGdldENvbG9yRnJvbVJnYlZhbHVlKHJnYmFWYWx1ZSk7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEJyaWdodGVuIGNvbG9yXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciBIZXh8UmdifFJnYmEgY29sb3Igb3IgY29sb3Iga2V5d29yZFxyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IFBlcmNlbnQgb2YgYnJpZ2h0ZW4gKDEtMTAwKVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd8Qm9vbGVhbn0gUmdiYSBjb2xvciAoSW52YWxpZCBpbnB1dCB3aWxsIHJldHVybiBmYWxzZSlcclxuICovXG5cblxuZnVuY3Rpb24gbGlnaHRlbihjb2xvcikge1xuICB2YXIgcGVyY2VudCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcblxuICBpZiAoIWNvbG9yKSB7XG4gICAgY29uc29sZS5lcnJvcignbGlnaHRlbjogTWlzc2luZyBwYXJhbWV0ZXJzIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciByZ2JhVmFsdWUgPSBnZXRSZ2JhVmFsdWUoY29sb3IpO1xuICBpZiAoIXJnYmFWYWx1ZSkgcmV0dXJuIGZhbHNlO1xuICByZ2JhVmFsdWUgPSByZ2JhVmFsdWUubWFwKGZ1bmN0aW9uICh2LCBpKSB7XG4gICAgcmV0dXJuIGkgPT09IDMgPyB2IDogdiArIE1hdGguY2VpbCgyLjU1ICogcGVyY2VudCk7XG4gIH0pLm1hcChmdW5jdGlvbiAodikge1xuICAgIHJldHVybiB2ID4gMjU1ID8gMjU1IDogdjtcbiAgfSk7XG4gIHJldHVybiBnZXRDb2xvckZyb21SZ2JWYWx1ZShyZ2JhVmFsdWUpO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBBZGp1c3QgY29sb3Igb3BhY2l0eVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sb3IgICBIZXh8UmdifFJnYmEgY29sb3Igb3IgY29sb3Iga2V5d29yZFxyXG4gKiBAcGFyYW0ge051bWJlcn0gUGVyY2VudCBvZiBvcGFjaXR5XHJcbiAqIEByZXR1cm4ge1N0cmluZ3xCb29sZWFufSBSZ2JhIGNvbG9yIChJbnZhbGlkIGlucHV0IHdpbGwgcmV0dXJuIGZhbHNlKVxyXG4gKi9cblxuXG5mdW5jdGlvbiBmYWRlKGNvbG9yKSB7XG4gIHZhciBwZXJjZW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAxMDA7XG5cbiAgaWYgKCFjb2xvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2ZhZGU6IE1pc3NpbmcgcGFyYW1ldGVycyEnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcmdiVmFsdWUgPSBnZXRSZ2JWYWx1ZShjb2xvcik7XG4gIGlmICghcmdiVmFsdWUpIHJldHVybiBmYWxzZTtcbiAgdmFyIHJnYmFWYWx1ZSA9IFtdLmNvbmNhdCgoMCwgX3RvQ29uc3VtYWJsZUFycmF5MltcImRlZmF1bHRcIl0pKHJnYlZhbHVlKSwgW3BlcmNlbnQgLyAxMDBdKTtcbiAgcmV0dXJuIGdldENvbG9yRnJvbVJnYlZhbHVlKHJnYmFWYWx1ZSk7XG59XG5cbnZhciBfZGVmYXVsdCA9IHtcbiAgZmFkZTogZmFkZSxcbiAgdG9IZXg6IHRvSGV4LFxuICB0b1JnYjogdG9SZ2IsXG4gIGRhcmtlbjogZGFya2VuLFxuICBsaWdodGVuOiBsaWdodGVuLFxuICBnZXRPcGFjaXR5OiBnZXRPcGFjaXR5LFxuICBnZXRSZ2JWYWx1ZTogZ2V0UmdiVmFsdWUsXG4gIGdldFJnYmFWYWx1ZTogZ2V0UmdiYVZhbHVlLFxuICBnZXRDb2xvckZyb21SZ2JWYWx1ZTogZ2V0Q29sb3JGcm9tUmdiVmFsdWVcbn07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0OyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBleHBvcnRzLmVhc2VJbk91dEJvdW5jZSA9IGV4cG9ydHMuZWFzZU91dEJvdW5jZSA9IGV4cG9ydHMuZWFzZUluQm91bmNlID0gZXhwb3J0cy5lYXNlSW5PdXRFbGFzdGljID0gZXhwb3J0cy5lYXNlT3V0RWxhc3RpYyA9IGV4cG9ydHMuZWFzZUluRWxhc3RpYyA9IGV4cG9ydHMuZWFzZUluT3V0QmFjayA9IGV4cG9ydHMuZWFzZU91dEJhY2sgPSBleHBvcnRzLmVhc2VJbkJhY2sgPSBleHBvcnRzLmVhc2VJbk91dFF1aW50ID0gZXhwb3J0cy5lYXNlT3V0UXVpbnQgPSBleHBvcnRzLmVhc2VJblF1aW50ID0gZXhwb3J0cy5lYXNlSW5PdXRRdWFydCA9IGV4cG9ydHMuZWFzZU91dFF1YXJ0ID0gZXhwb3J0cy5lYXNlSW5RdWFydCA9IGV4cG9ydHMuZWFzZUluT3V0Q3ViaWMgPSBleHBvcnRzLmVhc2VPdXRDdWJpYyA9IGV4cG9ydHMuZWFzZUluQ3ViaWMgPSBleHBvcnRzLmVhc2VJbk91dFF1YWQgPSBleHBvcnRzLmVhc2VPdXRRdWFkID0gZXhwb3J0cy5lYXNlSW5RdWFkID0gZXhwb3J0cy5lYXNlSW5PdXRTaW5lID0gZXhwb3J0cy5lYXNlT3V0U2luZSA9IGV4cG9ydHMuZWFzZUluU2luZSA9IGV4cG9ydHMubGluZWFyID0gdm9pZCAwO1xudmFyIGxpbmVhciA9IFtbWzAsIDFdLCAnJywgWzAuMzMsIDAuNjddXSwgW1sxLCAwXSwgWzAuNjcsIDAuMzNdXV07XG4vKipcclxuICogQGRlc2NyaXB0aW9uIFNpbmVcclxuICovXG5cbmV4cG9ydHMubGluZWFyID0gbGluZWFyO1xudmFyIGVhc2VJblNpbmUgPSBbW1swLCAxXV0sIFtbMC41MzgsIDAuNTY0XSwgWzAuMTY5LCAwLjkxMl0sIFswLjg4MCwgMC4xOTZdXSwgW1sxLCAwXV1dO1xuZXhwb3J0cy5lYXNlSW5TaW5lID0gZWFzZUluU2luZTtcbnZhciBlYXNlT3V0U2luZSA9IFtbWzAsIDFdXSwgW1swLjQ0NCwgMC40NDhdLCBbMC4xNjksIDAuNzM2XSwgWzAuNzE4LCAwLjE2XV0sIFtbMSwgMF1dXTtcbmV4cG9ydHMuZWFzZU91dFNpbmUgPSBlYXNlT3V0U2luZTtcbnZhciBlYXNlSW5PdXRTaW5lID0gW1tbMCwgMV1dLCBbWzAuNSwgMC41XSwgWzAuMiwgMV0sIFswLjgsIDBdXSwgW1sxLCAwXV1dO1xuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBRdWFkXHJcbiAqL1xuXG5leHBvcnRzLmVhc2VJbk91dFNpbmUgPSBlYXNlSW5PdXRTaW5lO1xudmFyIGVhc2VJblF1YWQgPSBbW1swLCAxXV0sIFtbMC41NTAsIDAuNTg0XSwgWzAuMjMxLCAwLjkwNF0sIFswLjg2OCwgMC4yNjRdXSwgW1sxLCAwXV1dO1xuZXhwb3J0cy5lYXNlSW5RdWFkID0gZWFzZUluUXVhZDtcbnZhciBlYXNlT3V0UXVhZCA9IFtbWzAsIDFdXSwgW1swLjQxMywgMC40MjhdLCBbMC4wNjUsIDAuODE2XSwgWzAuNzYwLCAwLjA0XV0sIFtbMSwgMF1dXTtcbmV4cG9ydHMuZWFzZU91dFF1YWQgPSBlYXNlT3V0UXVhZDtcbnZhciBlYXNlSW5PdXRRdWFkID0gW1tbMCwgMV1dLCBbWzAuNSwgMC41XSwgWzAuMywgMC45XSwgWzAuNywgMC4xXV0sIFtbMSwgMF1dXTtcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQ3ViaWNcclxuICovXG5cbmV4cG9ydHMuZWFzZUluT3V0UXVhZCA9IGVhc2VJbk91dFF1YWQ7XG52YXIgZWFzZUluQ3ViaWMgPSBbW1swLCAxXV0sIFtbMC42NzksIDAuNjg4XSwgWzAuMzY2LCAwLjk5Ml0sIFswLjk5MiwgMC4zODRdXSwgW1sxLCAwXV1dO1xuZXhwb3J0cy5lYXNlSW5DdWJpYyA9IGVhc2VJbkN1YmljO1xudmFyIGVhc2VPdXRDdWJpYyA9IFtbWzAsIDFdXSwgW1swLjMyMSwgMC4zMTJdLCBbMC4wMDgsIDAuNjE2XSwgWzAuNjM0LCAwLjAwOF1dLCBbWzEsIDBdXV07XG5leHBvcnRzLmVhc2VPdXRDdWJpYyA9IGVhc2VPdXRDdWJpYztcbnZhciBlYXNlSW5PdXRDdWJpYyA9IFtbWzAsIDFdXSwgW1swLjUsIDAuNV0sIFswLjMsIDFdLCBbMC43LCAwXV0sIFtbMSwgMF1dXTtcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gUXVhcnRcclxuICovXG5cbmV4cG9ydHMuZWFzZUluT3V0Q3ViaWMgPSBlYXNlSW5PdXRDdWJpYztcbnZhciBlYXNlSW5RdWFydCA9IFtbWzAsIDFdXSwgW1swLjgxMiwgMC43NF0sIFswLjYxMSwgMC45ODhdLCBbMS4wMTMsIDAuNDkyXV0sIFtbMSwgMF1dXTtcbmV4cG9ydHMuZWFzZUluUXVhcnQgPSBlYXNlSW5RdWFydDtcbnZhciBlYXNlT3V0UXVhcnQgPSBbW1swLCAxXV0sIFtbMC4xNTIsIDAuMjQ0XSwgWzAuMDAxLCAwLjQ0OF0sIFswLjI4NSwgLTAuMDJdXSwgW1sxLCAwXV1dO1xuZXhwb3J0cy5lYXNlT3V0UXVhcnQgPSBlYXNlT3V0UXVhcnQ7XG52YXIgZWFzZUluT3V0UXVhcnQgPSBbW1swLCAxXV0sIFtbMC41LCAwLjVdLCBbMC40LCAxXSwgWzAuNiwgMF1dLCBbWzEsIDBdXV07XG4vKipcclxuICogQGRlc2NyaXB0aW9uIFF1aW50XHJcbiAqL1xuXG5leHBvcnRzLmVhc2VJbk91dFF1YXJ0ID0gZWFzZUluT3V0UXVhcnQ7XG52YXIgZWFzZUluUXVpbnQgPSBbW1swLCAxXV0sIFtbMC44NTcsIDAuODU2XSwgWzAuNzE0LCAxXSwgWzEsIDAuNzEyXV0sIFtbMSwgMF1dXTtcbmV4cG9ydHMuZWFzZUluUXVpbnQgPSBlYXNlSW5RdWludDtcbnZhciBlYXNlT3V0UXVpbnQgPSBbW1swLCAxXV0sIFtbMC4xMDgsIDAuMl0sIFswLjAwMSwgMC40XSwgWzAuMjE0LCAtMC4wMTJdXSwgW1sxLCAwXV1dO1xuZXhwb3J0cy5lYXNlT3V0UXVpbnQgPSBlYXNlT3V0UXVpbnQ7XG52YXIgZWFzZUluT3V0UXVpbnQgPSBbW1swLCAxXV0sIFtbMC41LCAwLjVdLCBbMC41LCAxXSwgWzAuNSwgMF1dLCBbWzEsIDBdXV07XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEJhY2tcclxuICovXG5cbmV4cG9ydHMuZWFzZUluT3V0UXVpbnQgPSBlYXNlSW5PdXRRdWludDtcbnZhciBlYXNlSW5CYWNrID0gW1tbMCwgMV1dLCBbWzAuNjY3LCAwLjg5Nl0sIFswLjM4MCwgMS4xODRdLCBbMC45NTUsIDAuNjE2XV0sIFtbMSwgMF1dXTtcbmV4cG9ydHMuZWFzZUluQmFjayA9IGVhc2VJbkJhY2s7XG52YXIgZWFzZU91dEJhY2sgPSBbW1swLCAxXV0sIFtbMC4zMzUsIDAuMDI4XSwgWzAuMDYxLCAwLjIyXSwgWzAuNjMxLCAtMC4xOF1dLCBbWzEsIDBdXV07XG5leHBvcnRzLmVhc2VPdXRCYWNrID0gZWFzZU91dEJhY2s7XG52YXIgZWFzZUluT3V0QmFjayA9IFtbWzAsIDFdXSwgW1swLjUsIDAuNV0sIFswLjQsIDEuNF0sIFswLjYsIC0wLjRdXSwgW1sxLCAwXV1dO1xuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBFbGFzdGljXHJcbiAqL1xuXG5leHBvcnRzLmVhc2VJbk91dEJhY2sgPSBlYXNlSW5PdXRCYWNrO1xudmFyIGVhc2VJbkVsYXN0aWMgPSBbW1swLCAxXV0sIFtbMC40NzQsIDAuOTY0XSwgWzAuMzgyLCAwLjk4OF0sIFswLjU1NywgMC45NTJdXSwgW1swLjYxOSwgMS4wNzZdLCBbMC41NjUsIDEuMDg4XSwgWzAuNjY5LCAxLjA4XV0sIFtbMC43NzAsIDAuOTE2XSwgWzAuNzEyLCAwLjkyNF0sIFswLjg0NywgMC45MDRdXSwgW1swLjkxMSwgMS4zMDRdLCBbMC44NzIsIDEuMzE2XSwgWzAuOTYxLCAxLjM0XV0sIFtbMSwgMF1dXTtcbmV4cG9ydHMuZWFzZUluRWxhc3RpYyA9IGVhc2VJbkVsYXN0aWM7XG52YXIgZWFzZU91dEVsYXN0aWMgPSBbW1swLCAxXV0sIFtbMC4wNzMsIC0wLjMyXSwgWzAuMDM0LCAtMC4zMjhdLCBbMC4xMDQsIC0wLjM0NF1dLCBbWzAuMTkxLCAwLjA5Ml0sIFswLjExMCwgMC4wNl0sIFswLjI1NiwgMC4wOF1dLCBbWzAuMzEwLCAtMC4wNzZdLCBbMC4yNjAsIC0wLjA2OF0sIFswLjM1NywgLTAuMDc2XV0sIFtbMC40MzIsIDAuMDMyXSwgWzAuMzYyLCAwLjAyOF0sIFswLjY4MywgLTAuMDA0XV0sIFtbMSwgMF1dXTtcbmV4cG9ydHMuZWFzZU91dEVsYXN0aWMgPSBlYXNlT3V0RWxhc3RpYztcbnZhciBlYXNlSW5PdXRFbGFzdGljID0gW1tbMCwgMV1dLCBbWzAuMjEwLCAwLjk0XSwgWzAuMTY3LCAwLjg4NF0sIFswLjI1MiwgMC45OF1dLCBbWzAuMjk5LCAxLjEwNF0sIFswLjI1NiwgMS4wOTJdLCBbMC4zNDcsIDEuMTA4XV0sIFtbMC41LCAwLjQ5Nl0sIFswLjQ1MSwgMC42NzJdLCBbMC41NDgsIDAuMzI0XV0sIFtbMC42OTYsIC0wLjEwOF0sIFswLjY1MiwgLTAuMTEyXSwgWzAuNzQxLCAtMC4xMjRdXSwgW1swLjgwNSwgMC4wNjRdLCBbMC43NTYsIDAuMDEyXSwgWzAuODY2LCAwLjA5Nl1dLCBbWzEsIDBdXV07XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEJvdW5jZVxyXG4gKi9cblxuZXhwb3J0cy5lYXNlSW5PdXRFbGFzdGljID0gZWFzZUluT3V0RWxhc3RpYztcbnZhciBlYXNlSW5Cb3VuY2UgPSBbW1swLCAxXV0sIFtbMC4xNDgsIDFdLCBbMC4wNzUsIDAuODY4XSwgWzAuMTkzLCAwLjg0OF1dLCBbWzAuMzI2LCAxXSwgWzAuMjc2LCAwLjgzNl0sIFswLjQwNSwgMC43MTJdXSwgW1swLjYwMCwgMV0sIFswLjUxMSwgMC43MDhdLCBbMC42NzEsIDAuMzQ4XV0sIFtbMSwgMF1dXTtcbmV4cG9ydHMuZWFzZUluQm91bmNlID0gZWFzZUluQm91bmNlO1xudmFyIGVhc2VPdXRCb3VuY2UgPSBbW1swLCAxXV0sIFtbMC4zNTcsIDAuMDA0XSwgWzAuMjcwLCAwLjU5Ml0sIFswLjM3NiwgMC4yNTJdXSwgW1swLjYwNCwgLTAuMDA0XSwgWzAuNTQ4LCAwLjMxMl0sIFswLjY2OSwgMC4xODRdXSwgW1swLjgyMCwgMF0sIFswLjc0OSwgMC4xODRdLCBbMC45MDUsIDAuMTMyXV0sIFtbMSwgMF1dXTtcbmV4cG9ydHMuZWFzZU91dEJvdW5jZSA9IGVhc2VPdXRCb3VuY2U7XG52YXIgZWFzZUluT3V0Qm91bmNlID0gW1tbMCwgMV1dLCBbWzAuMTAyLCAxXSwgWzAuMDUwLCAwLjg2NF0sIFswLjExNywgMC44Nl1dLCBbWzAuMjE2LCAwLjk5Nl0sIFswLjIwOCwgMC44NDRdLCBbMC4yMjcsIDAuODA4XV0sIFtbMC4zNDcsIDAuOTk2XSwgWzAuMzQzLCAwLjhdLCBbMC40ODAsIDAuMjkyXV0sIFtbMC42MzUsIDAuMDA0XSwgWzAuNTExLCAwLjY3Nl0sIFswLjY1NiwgMC4yMDhdXSwgW1swLjc4NywgMF0sIFswLjc2MCwgMC4yXSwgWzAuNzk1LCAwLjE0NF1dLCBbWzAuOTA1LCAtMC4wMDRdLCBbMC44OTksIDAuMTY0XSwgWzAuOTQ0LCAwLjE0NF1dLCBbWzEsIDBdXV07XG5leHBvcnRzLmVhc2VJbk91dEJvdW5jZSA9IGVhc2VJbk91dEJvdW5jZTtcblxudmFyIF9kZWZhdWx0ID0gbmV3IE1hcChbWydsaW5lYXInLCBsaW5lYXJdLCBbJ2Vhc2VJblNpbmUnLCBlYXNlSW5TaW5lXSwgWydlYXNlT3V0U2luZScsIGVhc2VPdXRTaW5lXSwgWydlYXNlSW5PdXRTaW5lJywgZWFzZUluT3V0U2luZV0sIFsnZWFzZUluUXVhZCcsIGVhc2VJblF1YWRdLCBbJ2Vhc2VPdXRRdWFkJywgZWFzZU91dFF1YWRdLCBbJ2Vhc2VJbk91dFF1YWQnLCBlYXNlSW5PdXRRdWFkXSwgWydlYXNlSW5DdWJpYycsIGVhc2VJbkN1YmljXSwgWydlYXNlT3V0Q3ViaWMnLCBlYXNlT3V0Q3ViaWNdLCBbJ2Vhc2VJbk91dEN1YmljJywgZWFzZUluT3V0Q3ViaWNdLCBbJ2Vhc2VJblF1YXJ0JywgZWFzZUluUXVhcnRdLCBbJ2Vhc2VPdXRRdWFydCcsIGVhc2VPdXRRdWFydF0sIFsnZWFzZUluT3V0UXVhcnQnLCBlYXNlSW5PdXRRdWFydF0sIFsnZWFzZUluUXVpbnQnLCBlYXNlSW5RdWludF0sIFsnZWFzZU91dFF1aW50JywgZWFzZU91dFF1aW50XSwgWydlYXNlSW5PdXRRdWludCcsIGVhc2VJbk91dFF1aW50XSwgWydlYXNlSW5CYWNrJywgZWFzZUluQmFja10sIFsnZWFzZU91dEJhY2snLCBlYXNlT3V0QmFja10sIFsnZWFzZUluT3V0QmFjaycsIGVhc2VJbk91dEJhY2tdLCBbJ2Vhc2VJbkVsYXN0aWMnLCBlYXNlSW5FbGFzdGljXSwgWydlYXNlT3V0RWxhc3RpYycsIGVhc2VPdXRFbGFzdGljXSwgWydlYXNlSW5PdXRFbGFzdGljJywgZWFzZUluT3V0RWxhc3RpY10sIFsnZWFzZUluQm91bmNlJywgZWFzZUluQm91bmNlXSwgWydlYXNlT3V0Qm91bmNlJywgZWFzZU91dEJvdW5jZV0sIFsnZWFzZUluT3V0Qm91bmNlJywgZWFzZUluT3V0Qm91bmNlXV0pO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdFwiKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XG5leHBvcnRzLmluamVjdE5ld0N1cnZlID0gaW5qZWN0TmV3Q3VydmU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9zbGljZWRUb0FycmF5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheVwiKSk7XG5cbnZhciBfdHlwZW9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvdHlwZW9mXCIpKTtcblxudmFyIF9jdXJ2ZXMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2NvbmZpZy9jdXJ2ZXNcIikpO1xuXG52YXIgZGVmYXVsdFRyYW5zaXRpb25CQyA9ICdsaW5lYXInO1xuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIE4tZnJhbWUgYW5pbWF0aW9uIHN0YXRlIGJ5IHRoZSBzdGFydCBhbmQgZW5kIHN0YXRlXHJcbiAqICAgICAgICAgICAgICBvZiB0aGUgYW5pbWF0aW9uIGFuZCB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSB0QkMgICAgICAgICAgICAgICBFYXNpbmcgY3VydmUgbmFtZSBvciBkYXRhXHJcbiAqIEBwYXJhbSB7TnVtYmVyfEFycmF5fE9iamVjdH0gc3RhcnRTdGF0ZSBBbmltYXRpb24gc3RhcnQgc3RhdGVcclxuICogQHBhcmFtIHtOdW1iZXJ8QXJyYXl8T2JqZWN0fSBlbmRTdGF0ZSAgIEFuaW1hdGlvbiBlbmQgc3RhdGVcclxuICogQHBhcmFtIHtOdW1iZXJ9IGZyYW1lTnVtICAgICAgICAgICAgICAgIE51bWJlciBvZiBBbmltYXRpb24gZnJhbWVzXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVlcCAgICAgICAgICAgICAgICAgICBXaGV0aGVyIHRvIHVzZSByZWN1cnNpdmUgbW9kZVxyXG4gKiBAcmV0dXJuIHtBcnJheXxCb29sZWFufSBTdGF0ZSBvZiBlYWNoIGZyYW1lIG9mIHRoZSBhbmltYXRpb24gKEludmFsaWQgaW5wdXQgd2lsbCByZXR1cm4gZmFsc2UpXHJcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uKHRCQykge1xuICB2YXIgc3RhcnRTdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgdmFyIGVuZFN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuICB2YXIgZnJhbWVOdW0gPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IDMwO1xuICB2YXIgZGVlcCA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogZmFsc2U7XG4gIGlmICghY2hlY2tQYXJhbXMuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpKSByZXR1cm4gZmFsc2U7XG5cbiAgdHJ5IHtcbiAgICAvLyBHZXQgdGhlIHRyYW5zaXRpb24gYmV6aWVyIGN1cnZlXG4gICAgdmFyIGJlemllckN1cnZlID0gZ2V0QmV6aWVyQ3VydmUodEJDKTsgLy8gR2V0IHRoZSBwcm9ncmVzcyBvZiBlYWNoIGZyYW1lIHN0YXRlXG5cbiAgICB2YXIgZnJhbWVTdGF0ZVByb2dyZXNzID0gZ2V0RnJhbWVTdGF0ZVByb2dyZXNzKGJlemllckN1cnZlLCBmcmFtZU51bSk7IC8vIElmIHRoZSByZWN1cnNpb24gbW9kZSBpcyBub3QgZW5hYmxlZCBvciB0aGUgc3RhdGUgdHlwZSBpcyBOdW1iZXIsIHRoZSBzaGFsbG93IHN0YXRlIGNhbGN1bGF0aW9uIGlzIHBlcmZvcm1lZCBkaXJlY3RseS5cblxuICAgIGlmICghZGVlcCB8fCB0eXBlb2YgZW5kU3RhdGUgPT09ICdudW1iZXInKSByZXR1cm4gZ2V0VHJhbnNpdGlvblN0YXRlKHN0YXJ0U3RhdGUsIGVuZFN0YXRlLCBmcmFtZVN0YXRlUHJvZ3Jlc3MpO1xuICAgIHJldHVybiByZWN1cnNpb25UcmFuc2l0aW9uU3RhdGUoc3RhcnRTdGF0ZSwgZW5kU3RhdGUsIGZyYW1lU3RhdGVQcm9ncmVzcyk7XG4gIH0gY2F0Y2ggKF91bnVzZWQpIHtcbiAgICBjb25zb2xlLndhcm4oJ1RyYW5zaXRpb24gcGFyYW1ldGVyIG1heSBiZSBhYm5vcm1hbCEnKTtcbiAgICByZXR1cm4gW2VuZFN0YXRlXTtcbiAgfVxufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBDaGVjayBpZiB0aGUgcGFyYW1ldGVycyBhcmUgbGVnYWxcclxuICogQHBhcmFtIHtTdHJpbmd9IHRCQyAgICAgIE5hbWUgb2YgdHJhbnNpdGlvbiBiZXppZXIgY3VydmVcclxuICogQHBhcmFtIHtBbnl9IHN0YXJ0U3RhdGUgIFRyYW5zaXRpb24gc3RhcnQgc3RhdGVcclxuICogQHBhcmFtIHtBbnl9IGVuZFN0YXRlICAgIFRyYW5zaXRpb24gZW5kIHN0YXRlXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBmcmFtZU51bSBOdW1iZXIgb2YgdHJhbnNpdGlvbiBmcmFtZXNcclxuICogQHJldHVybiB7Qm9vbGVhbn0gSXMgdGhlIHBhcmFtZXRlciBsZWdhbFxyXG4gKi9cblxuXG5mdW5jdGlvbiBjaGVja1BhcmFtcyh0QkMpIHtcbiAgdmFyIHN0YXJ0U3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuICB2YXIgZW5kU3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IGZhbHNlO1xuICB2YXIgZnJhbWVOdW0gPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IDMwO1xuXG4gIGlmICghdEJDIHx8IHN0YXJ0U3RhdGUgPT09IGZhbHNlIHx8IGVuZFN0YXRlID09PSBmYWxzZSB8fCAhZnJhbWVOdW0pIHtcbiAgICBjb25zb2xlLmVycm9yKCd0cmFuc2l0aW9uOiBNaXNzaW5nIFBhcmFtZXRlcnMhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCgwLCBfdHlwZW9mMltcImRlZmF1bHRcIl0pKHN0YXJ0U3RhdGUpICE9PSAoMCwgX3R5cGVvZjJbXCJkZWZhdWx0XCJdKShlbmRTdGF0ZSkpIHtcbiAgICBjb25zb2xlLmVycm9yKCd0cmFuc2l0aW9uOiBJbmNvbnNpc3RlbnQgU3RhdHVzIFR5cGVzIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBzdGF0ZVR5cGUgPSAoMCwgX3R5cGVvZjJbXCJkZWZhdWx0XCJdKShlbmRTdGF0ZSk7XG5cbiAgaWYgKHN0YXRlVHlwZSA9PT0gJ3N0cmluZycgfHwgc3RhdGVUeXBlID09PSAnYm9vbGVhbicgfHwgIXRCQy5sZW5ndGgpIHtcbiAgICBjb25zb2xlLmVycm9yKCd0cmFuc2l0aW9uOiBVbnN1cHBvcnRlZCBEYXRhIFR5cGUgb2YgU3RhdGUhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFfY3VydmVzW1wiZGVmYXVsdFwiXS5oYXModEJDKSAmJiAhKHRCQyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGNvbnNvbGUud2FybigndHJhbnNpdGlvbjogVHJhbnNpdGlvbiBjdXJ2ZSBub3QgZm91bmQsIGRlZmF1bHQgY3VydmUgd2lsbCBiZSB1c2VkIScpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgdHJhbnNpdGlvbiBiZXppZXIgY3VydmVcclxuICogQHBhcmFtIHtTdHJpbmd9IHRCQyBOYW1lIG9mIHRyYW5zaXRpb24gYmV6aWVyIGN1cnZlXHJcbiAqIEByZXR1cm4ge0FycmF5fSBCZXppZXIgY3VydmUgZGF0YVxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRCZXppZXJDdXJ2ZSh0QkMpIHtcbiAgdmFyIGJlemllckN1cnZlID0gJyc7XG5cbiAgaWYgKF9jdXJ2ZXNbXCJkZWZhdWx0XCJdLmhhcyh0QkMpKSB7XG4gICAgYmV6aWVyQ3VydmUgPSBfY3VydmVzW1wiZGVmYXVsdFwiXS5nZXQodEJDKTtcbiAgfSBlbHNlIGlmICh0QkMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGJlemllckN1cnZlID0gdEJDO1xuICB9IGVsc2Uge1xuICAgIGJlemllckN1cnZlID0gX2N1cnZlc1tcImRlZmF1bHRcIl0uZ2V0KGRlZmF1bHRUcmFuc2l0aW9uQkMpO1xuICB9XG5cbiAgcmV0dXJuIGJlemllckN1cnZlO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIHByb2dyZXNzIG9mIGVhY2ggZnJhbWUgc3RhdGVcclxuICogQHBhcmFtIHtBcnJheX0gYmV6aWVyQ3VydmUgVHJhbnNpdGlvbiBiZXppZXIgY3VydmVcclxuICogQHBhcmFtIHtOdW1iZXJ9IGZyYW1lTnVtICAgTnVtYmVyIG9mIHRyYW5zaXRpb24gZnJhbWVzXHJcbiAqIEByZXR1cm4ge0FycmF5fSBQcm9ncmVzcyBvZiBlYWNoIGZyYW1lIHN0YXRlXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldEZyYW1lU3RhdGVQcm9ncmVzcyhiZXppZXJDdXJ2ZSwgZnJhbWVOdW0pIHtcbiAgdmFyIHRNaW51cyA9IDEgLyAoZnJhbWVOdW0gLSAxKTtcbiAgdmFyIHRTdGF0ZSA9IG5ldyBBcnJheShmcmFtZU51bSkuZmlsbCgwKS5tYXAoZnVuY3Rpb24gKHQsIGkpIHtcbiAgICByZXR1cm4gaSAqIHRNaW51cztcbiAgfSk7XG4gIHZhciBmcmFtZVN0YXRlID0gdFN0YXRlLm1hcChmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiBnZXRGcmFtZVN0YXRlRnJvbVQoYmV6aWVyQ3VydmUsIHQpO1xuICB9KTtcbiAgcmV0dXJuIGZyYW1lU3RhdGU7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgcHJvZ3Jlc3Mgb2YgdGhlIGNvcnJlc3BvbmRpbmcgZnJhbWUgYWNjb3JkaW5nIHRvIHRcclxuICogQHBhcmFtIHtBcnJheX0gYmV6aWVyQ3VydmUgVHJhbnNpdGlvbiBiZXppZXIgY3VydmVcclxuICogQHBhcmFtIHtOdW1iZXJ9IHQgICAgICAgICAgQ3VycmVudCBmcmFtZSB0XHJcbiAqIEByZXR1cm4ge051bWJlcn0gUHJvZ3Jlc3Mgb2YgY3VycmVudCBmcmFtZVxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRGcmFtZVN0YXRlRnJvbVQoYmV6aWVyQ3VydmUsIHQpIHtcbiAgdmFyIHRCZXppZXJDdXJ2ZVBvaW50ID0gZ2V0QmV6aWVyQ3VydmVQb2ludEZyb21UKGJlemllckN1cnZlLCB0KTtcbiAgdmFyIGJlemllckN1cnZlUG9pbnRUID0gZ2V0QmV6aWVyQ3VydmVQb2ludFRGcm9tUmVUKHRCZXppZXJDdXJ2ZVBvaW50LCB0KTtcbiAgcmV0dXJuIGdldEJlemllckN1cnZlVFN0YXRlKHRCZXppZXJDdXJ2ZVBvaW50LCBiZXppZXJDdXJ2ZVBvaW50VCk7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0aGUgY29ycmVzcG9uZGluZyBzdWItY3VydmUgYWNjb3JkaW5nIHRvIHRcclxuICogQHBhcmFtIHtBcnJheX0gYmV6aWVyQ3VydmUgVHJhbnNpdGlvbiBiZXppZXIgY3VydmVcclxuICogQHBhcmFtIHtOdW1iZXJ9IHQgICAgICAgICAgQ3VycmVudCBmcmFtZSB0XHJcbiAqIEByZXR1cm4ge0FycmF5fSBTdWItY3VydmUgb2YgdFxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRCZXppZXJDdXJ2ZVBvaW50RnJvbVQoYmV6aWVyQ3VydmUsIHQpIHtcbiAgdmFyIGxhc3RJbmRleCA9IGJlemllckN1cnZlLmxlbmd0aCAtIDE7XG4gIHZhciBiZWdpbiA9ICcnLFxuICAgICAgZW5kID0gJyc7XG4gIGJlemllckN1cnZlLmZpbmRJbmRleChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgIGlmIChpID09PSBsYXN0SW5kZXgpIHJldHVybjtcbiAgICBiZWdpbiA9IGl0ZW07XG4gICAgZW5kID0gYmV6aWVyQ3VydmVbaSArIDFdO1xuICAgIHZhciBjdXJyZW50TWFpblBvaW50WCA9IGJlZ2luWzBdWzBdO1xuICAgIHZhciBuZXh0TWFpblBvaW50WCA9IGVuZFswXVswXTtcbiAgICByZXR1cm4gdCA+PSBjdXJyZW50TWFpblBvaW50WCAmJiB0IDwgbmV4dE1haW5Qb2ludFg7XG4gIH0pO1xuICB2YXIgcDAgPSBiZWdpblswXTtcbiAgdmFyIHAxID0gYmVnaW5bMl0gfHwgYmVnaW5bMF07XG4gIHZhciBwMiA9IGVuZFsxXSB8fCBlbmRbMF07XG4gIHZhciBwMyA9IGVuZFswXTtcbiAgcmV0dXJuIFtwMCwgcDEsIHAyLCBwM107XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCBsb2NhbCB0IGJhc2VkIG9uIHQgYW5kIHN1Yi1jdXJ2ZVxyXG4gKiBAcGFyYW0ge0FycmF5fSBiZXppZXJDdXJ2ZSBTdWItY3VydmVcclxuICogQHBhcmFtIHtOdW1iZXJ9IHQgICAgICAgICAgQ3VycmVudCBmcmFtZSB0XHJcbiAqIEByZXR1cm4ge051bWJlcn0gbG9jYWwgdCBvZiBzdWItY3VydmVcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0QmV6aWVyQ3VydmVQb2ludFRGcm9tUmVUKGJlemllckN1cnZlLCB0KSB7XG4gIHZhciByZUJlZ2luWCA9IGJlemllckN1cnZlWzBdWzBdO1xuICB2YXIgcmVFbmRYID0gYmV6aWVyQ3VydmVbM11bMF07XG4gIHZhciB4TWludXMgPSByZUVuZFggLSByZUJlZ2luWDtcbiAgdmFyIHRNaW51cyA9IHQgLSByZUJlZ2luWDtcbiAgcmV0dXJuIHRNaW51cyAvIHhNaW51cztcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSBjdXJ2ZSBwcm9ncmVzcyBvZiB0XHJcbiAqIEBwYXJhbSB7QXJyYXl9IGJlemllckN1cnZlIFN1Yi1jdXJ2ZVxyXG4gKiBAcGFyYW0ge051bWJlcn0gdCAgICAgICAgICBDdXJyZW50IGZyYW1lIHRcclxuICogQHJldHVybiB7TnVtYmVyfSBQcm9ncmVzcyBvZiBjdXJyZW50IGZyYW1lXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldEJlemllckN1cnZlVFN0YXRlKF9yZWYsIHQpIHtcbiAgdmFyIF9yZWYyID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9yZWYsIDQpLFxuICAgICAgX3JlZjIkID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9yZWYyWzBdLCAyKSxcbiAgICAgIHAwID0gX3JlZjIkWzFdLFxuICAgICAgX3JlZjIkMiA9ICgwLCBfc2xpY2VkVG9BcnJheTJbXCJkZWZhdWx0XCJdKShfcmVmMlsxXSwgMiksXG4gICAgICBwMSA9IF9yZWYyJDJbMV0sXG4gICAgICBfcmVmMiQzID0gKDAsIF9zbGljZWRUb0FycmF5MltcImRlZmF1bHRcIl0pKF9yZWYyWzJdLCAyKSxcbiAgICAgIHAyID0gX3JlZjIkM1sxXSxcbiAgICAgIF9yZWYyJDQgPSAoMCwgX3NsaWNlZFRvQXJyYXkyW1wiZGVmYXVsdFwiXSkoX3JlZjJbM10sIDIpLFxuICAgICAgcDMgPSBfcmVmMiQ0WzFdO1xuXG4gIHZhciBwb3cgPSBNYXRoLnBvdztcbiAgdmFyIHRNaW51cyA9IDEgLSB0O1xuICB2YXIgcmVzdWx0MSA9IHAwICogcG93KHRNaW51cywgMyk7XG4gIHZhciByZXN1bHQyID0gMyAqIHAxICogdCAqIHBvdyh0TWludXMsIDIpO1xuICB2YXIgcmVzdWx0MyA9IDMgKiBwMiAqIHBvdyh0LCAyKSAqIHRNaW51cztcbiAgdmFyIHJlc3VsdDQgPSBwMyAqIHBvdyh0LCAzKTtcbiAgcmV0dXJuIDEgLSAocmVzdWx0MSArIHJlc3VsdDIgKyByZXN1bHQzICsgcmVzdWx0NCk7XG59XG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCB0cmFuc2l0aW9uIHN0YXRlIGFjY29yZGluZyB0byBmcmFtZSBwcm9ncmVzc1xyXG4gKiBAcGFyYW0ge0FueX0gc3RhcnRTdGF0ZSAgIFRyYW5zaXRpb24gc3RhcnQgc3RhdGVcclxuICogQHBhcmFtIHtBbnl9IGVuZFN0YXRlICAgICBUcmFuc2l0aW9uIGVuZCBzdGF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5fSBmcmFtZVN0YXRlIEZyYW1lIHN0YXRlIHByb2dyZXNzXHJcbiAqIEByZXR1cm4ge0FycmF5fSBUcmFuc2l0aW9uIGZyYW1lIHN0YXRlXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFRyYW5zaXRpb25TdGF0ZShiZWdpbiwgZW5kLCBmcmFtZVN0YXRlKSB7XG4gIHZhciBzdGF0ZVR5cGUgPSAnb2JqZWN0JztcbiAgaWYgKHR5cGVvZiBiZWdpbiA9PT0gJ251bWJlcicpIHN0YXRlVHlwZSA9ICdudW1iZXInO1xuICBpZiAoYmVnaW4gaW5zdGFuY2VvZiBBcnJheSkgc3RhdGVUeXBlID0gJ2FycmF5JztcbiAgaWYgKHN0YXRlVHlwZSA9PT0gJ251bWJlcicpIHJldHVybiBnZXROdW1iZXJUcmFuc2l0aW9uU3RhdGUoYmVnaW4sIGVuZCwgZnJhbWVTdGF0ZSk7XG4gIGlmIChzdGF0ZVR5cGUgPT09ICdhcnJheScpIHJldHVybiBnZXRBcnJheVRyYW5zaXRpb25TdGF0ZShiZWdpbiwgZW5kLCBmcmFtZVN0YXRlKTtcbiAgaWYgKHN0YXRlVHlwZSA9PT0gJ29iamVjdCcpIHJldHVybiBnZXRPYmplY3RUcmFuc2l0aW9uU3RhdGUoYmVnaW4sIGVuZCwgZnJhbWVTdGF0ZSk7XG4gIHJldHVybiBmcmFtZVN0YXRlLm1hcChmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiBlbmQ7XG4gIH0pO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIHRyYW5zaXRpb24gZGF0YSBvZiB0aGUgbnVtYmVyIHR5cGVcclxuICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0U3RhdGUgVHJhbnNpdGlvbiBzdGFydCBzdGF0ZVxyXG4gKiBAcGFyYW0ge051bWJlcn0gZW5kU3RhdGUgICBUcmFuc2l0aW9uIGVuZCBzdGF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5fSBmcmFtZVN0YXRlICBGcmFtZSBzdGF0ZSBwcm9ncmVzc1xyXG4gKiBAcmV0dXJuIHtBcnJheX0gVHJhbnNpdGlvbiBmcmFtZSBzdGF0ZVxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXROdW1iZXJUcmFuc2l0aW9uU3RhdGUoYmVnaW4sIGVuZCwgZnJhbWVTdGF0ZSkge1xuICB2YXIgbWludXMgPSBlbmQgLSBiZWdpbjtcbiAgcmV0dXJuIGZyYW1lU3RhdGUubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgcmV0dXJuIGJlZ2luICsgbWludXMgKiBzO1xuICB9KTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSB0cmFuc2l0aW9uIGRhdGEgb2YgdGhlIGFycmF5IHR5cGVcclxuICogQHBhcmFtIHtBcnJheX0gc3RhcnRTdGF0ZSBUcmFuc2l0aW9uIHN0YXJ0IHN0YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGVuZFN0YXRlICAgVHJhbnNpdGlvbiBlbmQgc3RhdGVcclxuICogQHBhcmFtIHtBcnJheX0gZnJhbWVTdGF0ZSBGcmFtZSBzdGF0ZSBwcm9ncmVzc1xyXG4gKiBAcmV0dXJuIHtBcnJheX0gVHJhbnNpdGlvbiBmcmFtZSBzdGF0ZVxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRBcnJheVRyYW5zaXRpb25TdGF0ZShiZWdpbiwgZW5kLCBmcmFtZVN0YXRlKSB7XG4gIHZhciBtaW51cyA9IGVuZC5tYXAoZnVuY3Rpb24gKHYsIGkpIHtcbiAgICBpZiAodHlwZW9mIHYgIT09ICdudW1iZXInKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHYgLSBiZWdpbltpXTtcbiAgfSk7XG4gIHJldHVybiBmcmFtZVN0YXRlLm1hcChmdW5jdGlvbiAocykge1xuICAgIHJldHVybiBtaW51cy5tYXAoZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgIGlmICh2ID09PSBmYWxzZSkgcmV0dXJuIGVuZFtpXTtcbiAgICAgIHJldHVybiBiZWdpbltpXSArIHYgKiBzO1xuICAgIH0pO1xuICB9KTtcbn1cbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHRoZSB0cmFuc2l0aW9uIGRhdGEgb2YgdGhlIG9iamVjdCB0eXBlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFydFN0YXRlIFRyYW5zaXRpb24gc3RhcnQgc3RhdGVcclxuICogQHBhcmFtIHtPYmplY3R9IGVuZFN0YXRlICAgVHJhbnNpdGlvbiBlbmQgc3RhdGVcclxuICogQHBhcmFtIHtBcnJheX0gZnJhbWVTdGF0ZSAgRnJhbWUgc3RhdGUgcHJvZ3Jlc3NcclxuICogQHJldHVybiB7QXJyYXl9IFRyYW5zaXRpb24gZnJhbWUgc3RhdGVcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0T2JqZWN0VHJhbnNpdGlvblN0YXRlKGJlZ2luLCBlbmQsIGZyYW1lU3RhdGUpIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlbmQpO1xuICB2YXIgYmVnaW5WYWx1ZSA9IGtleXMubWFwKGZ1bmN0aW9uIChrKSB7XG4gICAgcmV0dXJuIGJlZ2luW2tdO1xuICB9KTtcbiAgdmFyIGVuZFZhbHVlID0ga2V5cy5tYXAoZnVuY3Rpb24gKGspIHtcbiAgICByZXR1cm4gZW5kW2tdO1xuICB9KTtcbiAgdmFyIGFycmF5U3RhdGUgPSBnZXRBcnJheVRyYW5zaXRpb25TdGF0ZShiZWdpblZhbHVlLCBlbmRWYWx1ZSwgZnJhbWVTdGF0ZSk7XG4gIHJldHVybiBhcnJheVN0YXRlLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgIHZhciBmcmFtZURhdGEgPSB7fTtcbiAgICBpdGVtLmZvckVhY2goZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgIHJldHVybiBmcmFtZURhdGFba2V5c1tpXV0gPSB2O1xuICAgIH0pO1xuICAgIHJldHVybiBmcmFtZURhdGE7XG4gIH0pO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgdGhlIHRyYW5zaXRpb24gc3RhdGUgZGF0YSBieSByZWN1cnNpb25cclxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IHN0YXJ0U3RhdGUgVHJhbnNpdGlvbiBzdGFydCBzdGF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gZW5kU3RhdGUgICBUcmFuc2l0aW9uIGVuZCBzdGF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5fSBmcmFtZVN0YXRlICAgICAgICBGcmFtZSBzdGF0ZSBwcm9ncmVzc1xyXG4gKiBAcmV0dXJuIHtBcnJheX0gVHJhbnNpdGlvbiBmcmFtZSBzdGF0ZVxyXG4gKi9cblxuXG5mdW5jdGlvbiByZWN1cnNpb25UcmFuc2l0aW9uU3RhdGUoYmVnaW4sIGVuZCwgZnJhbWVTdGF0ZSkge1xuICB2YXIgc3RhdGUgPSBnZXRUcmFuc2l0aW9uU3RhdGUoYmVnaW4sIGVuZCwgZnJhbWVTdGF0ZSk7XG5cbiAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3Aoa2V5KSB7XG4gICAgdmFyIGJUZW1wID0gYmVnaW5ba2V5XTtcbiAgICB2YXIgZVRlbXAgPSBlbmRba2V5XTtcbiAgICBpZiAoKDAsIF90eXBlb2YyW1wiZGVmYXVsdFwiXSkoZVRlbXApICE9PSAnb2JqZWN0JykgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICB2YXIgZGF0YSA9IHJlY3Vyc2lvblRyYW5zaXRpb25TdGF0ZShiVGVtcCwgZVRlbXAsIGZyYW1lU3RhdGUpO1xuICAgIHN0YXRlLmZvckVhY2goZnVuY3Rpb24gKGZzLCBpKSB7XG4gICAgICByZXR1cm4gZnNba2V5XSA9IGRhdGFbaV07XG4gICAgfSk7XG4gIH07XG5cbiAgZm9yICh2YXIga2V5IGluIGVuZCkge1xuICAgIHZhciBfcmV0ID0gX2xvb3Aoa2V5KTtcblxuICAgIGlmIChfcmV0ID09PSBcImNvbnRpbnVlXCIpIGNvbnRpbnVlO1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBJbmplY3QgbmV3IGN1cnZlIGludG8gY3VydmVzIGFzIGNvbmZpZ1xyXG4gKiBAcGFyYW0ge0FueX0ga2V5ICAgICBUaGUga2V5IG9mIGN1cnZlXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGN1cnZlIEJlemllciBjdXJ2ZSBkYXRhXHJcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH0gTm8gcmV0dXJuXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGluamVjdE5ld0N1cnZlKGtleSwgY3VydmUpIHtcbiAgaWYgKCFrZXkgfHwgIWN1cnZlKSB7XG4gICAgY29uc29sZS5lcnJvcignSW5qZWN0TmV3Q3VydmUgTWlzc2luZyBQYXJhbWV0ZXJzIScpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIF9jdXJ2ZXNbXCJkZWZhdWx0XCJdLnNldChrZXksIGN1cnZlKTtcbn1cblxudmFyIF9kZWZhdWx0ID0gdHJhbnNpdGlvbjtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG5cbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksXG4gICAgICBQcm9taXNlSW1wbFxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbn1cbiJdfQ==
