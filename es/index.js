import _typeof from '@babel/runtime/helpers/esm/typeof';
import { getColorFromRgbValue, getRgbaValue } from '@jiaminghi/color';
import transition from '@jiaminghi/transition';
import { bezierCurveToPolyline, polylineToBezierCurve } from '@jiaminghi/bezier-curve';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var Status;

(function (Status) {
  Status["STATIC"] = "STATIC";
  Status["HOVER"] = "HOVER";
  Status["ACTIVE"] = "ACTIVE";
  Status["DRAG"] = "DRAG";
})(Status || (Status = {}));

/**
 * reverse: false | string    -> RgbaValue
 * reverse: true  | RgbaValue -> string
 */

function transformColor(reverse) {
  // eslint-disable-next-line
  return function (color) {
    var isString = typeof color === 'string';
    var isArray = Array.isArray(color);
    if (isString && reverse) return color;
    if (isArray && !reverse) return __spreadArrays(color);
    if (isString && !reverse) return getRgbaValue(color);
    if (isArray && reverse) return getColorFromRgbValue(color);
    throw new Error('CRender Style transformColor: Unexpected color!');
  };
}
function getCtxRealColorWithOpacity(opacity) {
  return function (color) {
    var _color = __spreadArrays(color);

    _color[3] * opacity;
    return getColorFromRgbValue(_color);
  };
}
function gradientColorValidator(style) {
  var gradientColor = style.gradientColor,
      gradientParams = style.gradientParams,
      gradientType = style.gradientType,
      gradientWith = style.gradientWith,
      gradientStops = style.gradientStops;
  if (!gradientColor || !gradientParams) return false;

  if (gradientColor.length === 1) {
    console.warn('CRender Style: The gradient needs to provide at least two colors');
    return false;
  }

  if (gradientType !== 'linear' && gradientType !== 'radial') {
    console.warn("CRender Style: GradientType only supports linear or radial, current value is " + gradientType);
    return false;
  }

  var gradientParamsLength = gradientParams.length;

  if (gradientType === 'linear' && gradientParamsLength !== 4 || gradientType === 'radial' && gradientParamsLength !== 6) {
    console.warn("CRender Style: The expected length of gradientParams is " + (gradientType === 'linear' ? '4' : '6'));
    return false;
  }

  if (gradientWith !== 'fill' && gradientWith !== 'stroke') {
    console.warn("CRender Style: GradientWith only supports fill or stroke, current value is " + gradientWith);
    return false;
  }

  if (gradientStops !== 'auto' && !(gradientStops instanceof Array)) {
    console.warn("CRender Style: gradientStops only supports 'auto' or Number Array ([0, .5, 1]), current value is " + gradientStops);
    return false;
  }

  return true;
}
function getAutoColorStops(color) {
  var stopGap = 1 / (color.length - 1);
  return color.map(function (foo, i) {
    return stopGap * i;
  });
}

var Style =
/** @class */
function () {
  function Style(style) {
    /**
     * @description Rgba value of graph fill color
     */
    this.fill = [0, 0, 0, 1];
    /**
     * @description Rgba value of graph stroke color
     */

    this.stroke = [0, 0, 0, 0];
    /**
     * @description Opacity of graph
     */

    this.opacity = 1;
    /**
     * @description LineCap of Ctx
     */

    this.lineCap = 'butt';
    /**
     * @description Linejoin of Ctx
     */

    this.lineJoin = 'miter';
    /**
     * @description LineDash of Ctx
     */

    this.lineDash = [];
    /**
     * @description LineDashOffset of Ctx
     */

    this.lineDashOffset = 0;
    /**
     * @description ShadowBlur of Ctx
     */

    this.shadowBlur = 0;
    /**
     * @description Rgba value of graph shadow color
     */

    this.shadowColor = [0, 0, 0, 0];
    /**
     * @description ShadowOffsetX of Ctx
     */

    this.shadowOffsetX = 0;
    /**
     * @description ShadowOffsetY of Ctx
     */

    this.shadowOffsetY = 0;
    /**
     * @description LineWidth of Ctx
     */

    this.lineWidth = 1;
    /**
     * @description Cursor status when hover
     */

    this.hoverCursor = 'pointer';
    /**
     * @description Font style of Ctx
     */

    this.fontStyle = 'normal';
    /**
     * @description Font varient of Ctx
     */

    this.fontVarient = 'normal';
    /**
     * @description Font weight of Ctx
     */

    this.fontWeight = 'normal';
    /**
     * @description Font size of Ctx
     */

    this.fontSize = 10;
    /**
     * @description Font family of Ctx
     */

    this.fontFamily = 'Arial';
    /**
     * @description TextAlign of Ctx
     */

    this.textAlign = 'center';
    /**
     * @description TextBaseline of Ctx
     */

    this.textBaseline = 'middle';
    /**
     * @description Gradient type
     */

    this.gradientType = 'linear';
    /**
     * @description When to use gradients
     */

    this.gradientWith = 'stroke';
    /**
     * @description Gradient color stops
     */

    this.gradientStops = 'auto';
    if (style) this.update(style);
  }

  Style.prototype.update = function (style) {
    Object.assign(this, Style.colorProcessor(style));
  };

  Style.colorProcessor = function (style, reverse) {
    var processedStyle = __assign({}, style);

    var transform = transformColor(reverse);
    processedStyle.fill = transform(processedStyle.fill);
    processedStyle.stroke = transform(processedStyle.stroke);
    processedStyle.shadowColor = transform(processedStyle.shadowColor);
    processedStyle.gradientColor = (processedStyle.gradientColor || []).map(transform);

    if (reverse) {
      return processedStyle;
    } else {
      return processedStyle;
    }
  };

  Style.prototype.setCtx = function (ctx) {
    Style.setCtxTransform(ctx, this);
    Style.setCtxStyle(ctx, this);
    Style.setCtxGradientColor(ctx, this);
  };

  Style.setCtxTransform = function (ctx, style) {
    ctx.save();
    var graphCenter = style.graphCenter,
        rotate = style.rotate,
        scale = style.scale,
        translate = style.translate;
    if (!(graphCenter instanceof Array)) return;
    ctx.translate.apply(ctx, graphCenter);
    if (rotate) ctx.rotate(rotate * Math.PI / 180);
    if (scale instanceof Array) ctx.scale.apply(ctx, scale);
    if (translate) ctx.translate.apply(ctx, translate);
    ctx.translate(-graphCenter[0], -graphCenter[1]);
  };

  Style.setCtxStyle = function (ctx, style) {
    // Set directly
    ctx.lineCap = style.lineCap;
    ctx.lineJoin = style.lineJoin;
    ctx.lineDashOffset = style.lineDashOffset;
    ctx.shadowOffsetX = style.shadowOffsetX;
    ctx.shadowOffsetY = style.shadowOffsetY;
    ctx.lineWidth = style.lineWidth;
    ctx.textAlign = style.textAlign;
    ctx.textBaseline = style.textBaseline; // Merge global opacity into colors

    var fill = style.fill,
        stroke = style.stroke,
        shadowColor = style.shadowColor,
        opacity = style.opacity;
    var getCtxRealColor = getCtxRealColorWithOpacity(opacity);
    ctx.fillStyle = getCtxRealColor(fill);
    ctx.strokeStyle = getCtxRealColor(stroke);
    ctx.shadowColor = getCtxRealColor(shadowColor);
    var lineDash = style.lineDash,
        shadowBlur = style.shadowBlur; // Avoid negative values

    if (lineDash) ctx.setLineDash(lineDash.map(function (v) {
      return v >= 0 ? v : 0;
    }));
    if (typeof shadowBlur === 'number') ctx.shadowBlur = shadowBlur > 0 ? shadowBlur : 0.001; // Set Ctx font

    var fontStyle = style.fontStyle,
        fontVarient = style.fontVarient,
        fontWeight = style.fontWeight,
        fontSize = style.fontSize,
        fontFamily = style.fontFamily;
    ctx.font = fontStyle + " " + fontVarient + " " + fontWeight + " " + fontSize + "px " + fontFamily;
  };

  Style.setCtxGradientColor = function (ctx, style) {
    if (!gradientColorValidator(style)) return;
    var gradientColor = style.gradientColor,
        gradientParams = style.gradientParams,
        gradientType = style.gradientType,
        gradientWith = style.gradientWith,
        gradientStops = style.gradientStops,
        opacity = style.opacity;
    var getCtxRealColor = getCtxRealColorWithOpacity(opacity);

    var _gradientColor = gradientColor.map(getCtxRealColor);

    var _gradientStops = gradientStops === 'auto' ? getAutoColorStops(_gradientColor) : gradientStops;

    var gradient;

    if (gradientType === 'linear') {
      gradient = ctx.createLinearGradient.apply(ctx, gradientParams);
    } else {
      gradient = ctx.createRadialGradient.apply(ctx, gradientParams);
    }

    _gradientStops.forEach(function (stop, i) {
      return gradient.addColorStop(stop, _gradientColor[i]);
    });

    ctx[gradientWith === 'fill' ? 'fillStyle' : 'strokeStyle'] = gradient;
  };

  Style.prototype.restoreCtx = function (ctx) {
    ctx.restore();
  };

  return Style;
}();

/**
 * @description Get the coordinates of the rotated point
 */
function getRotatePointPos(rotate, point, origin) {
  if (rotate === void 0) {
    rotate = 0;
  }

  if (origin === void 0) {
    origin = [0, 0];
  }

  if (rotate % 360 === 0) return point;
  var x = point[0],
      y = point[1];
  var ox = origin[0],
      oy = origin[1];
  rotate *= Math.PI / 180;
  return [(x - ox) * Math.cos(rotate) - (y - oy) * Math.sin(rotate) + ox, (x - ox) * Math.sin(rotate) + (y - oy) * Math.cos(rotate) + oy];
}
/**
 * @description Get the coordinates of the scaled point
 */

function getScalePointPos(scale, point, origin) {
  if (scale === void 0) {
    scale = [1, 1];
  }

  if (origin === void 0) {
    origin = [0, 0];
  }

  var x = point[0],
      y = point[1];
  var ox = origin[0],
      oy = origin[1];
  var xs = scale[0],
      ys = scale[1];
  var relativePosX = x - ox;
  var relativePosY = y - oy;
  return [relativePosX * xs + ox, relativePosY * ys + oy];
}
/**
 * @description Get the coordinates of the scaled point
 */

function getTranslatePointPos(translate, point) {
  var x = point[0],
      y = point[1];
  var tx = translate[0],
      ty = translate[1];
  return [x + tx, y + ty];
}
/**
 * @description Check if the point is inside the rect
 */

function checkPointIsInRect(_a, x, y, width, height) {
  var px = _a[0],
      py = _a[1];
  if (px < x) return false;
  if (py < y) return false;
  if (px > x + width) return false;
  if (py > y + height) return false;
  return true;
}
/**
 * @description Return a timed release Promise
 */

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// eslint-disable-next-line
function deepClone(obj, cache) {
  if (cache === void 0) {
    cache = new Map([]);
  }

  if (obj === null || _typeof(obj) !== 'object') return obj;
  if (cache.has(obj)) return cache.get(obj); // eslint-disable-next-line

  var clone = Array.isArray(obj) ? [] : {};
  cache.set(obj, clone); // @ts-ignore

  Object.keys(obj).forEach(function (key) {
    return clone[key] = deepClone(obj[key], cache);
  });
  return clone;
}

var Graph =
/** @class */
function () {
  function Graph(graphModel, config, render) {
    /**
     * @description Weather to render graph
     */
    this.visible = true;
    /**
     * @description Whether to enable drag
     */

    this.drag = false;
    /**
     * @description Whether to enable hover
     */

    this.hover = false;
    /**
     * @description Graph rendering index
     *  Give priority to index high graph in rendering
     */

    this.index = 1;
    /**
     * @description Animation delay time(ms)
     */

    this.animationDelay = 0;
    /**
     * @description Number of animation frames
     */

    this.animationFrame = 30;
    /**
     * @description Animation dynamic curve (Supported by transition)
     * @link https://github.com/jiaming743/Transition
     */

    this.animationCurve = 'linear';
    /**
     * @description Weather to pause graph animation
     */

    this.animationPause = false;
    /**
     * @description Graph current status
     */

    this.status = Status.STATIC;
    /**
     * @description Graph animation frame state
     */

    this.animationQueue = [];
    var shape = Object.assign({}, graphModel.shape, config.shape);
    var style = new Style(config.style);
    Object.assign(this, graphModel, config, {
      shape: shape,
      style: style
    }, {
      status: Status.STATIC,
      animationRoot: [],
      animationKeys: [],
      animationFrameState: [],
      cache: {},
      render: render
    });
    if (this.setGraphCenter) this.setGraphCenter(this); // The life cycle 'added'

    if (this.added) this.added();
  }

  Graph.prototype.drawProcessor = function () {
    var render = this.render;
    var ctx = render.ctx;
    this.style.setCtx(ctx);
    if (this.beforeDraw) this.beforeDraw(render);
    this.draw(render, this);
    if (this.drawed) this.drawed(render);
    this.style.restoreCtx(ctx);
  };

  Graph.prototype.hoverCheckProcessor = function (point) {
    var _a = this,
        hoverRect = _a.hoverRect,
        style = _a.style;

    var graphCenter = style.graphCenter,
        rotate = style.rotate,
        scale = style.scale,
        translate = style.translate;
    if (!this.hoverCheck) return false;

    if (graphCenter) {
      if (rotate) point = getRotatePointPos(-rotate, point, graphCenter);
      if (scale) point = getScalePointPos(scale.map(function (s) {
        return 1 / s;
      }), point, graphCenter);
      if (translate) point = getTranslatePointPos(translate.map(function (v) {
        return v * -1;
      }), point);
    }

    if (hoverRect) return checkPointIsInRect.apply(void 0, __spreadArrays([point], hoverRect));
    return this.hoverCheck(point, this);
  };

  Graph.prototype.moveProcessor = function (e) {
    if (!this.move) return;
    if (this.beforeMove) this.beforeMove(e);
    this.move(e, this);
    if (this.moved) this.moved(e);
    if (this.setGraphCenter) this.setGraphCenter(this);
  };
  /**
   * @description Update graph attribute
   */


  Graph.prototype.attr = function (key, value, reDraw) {
    if (reDraw === void 0) {
      reDraw = true;
    }

    var isObject = _typeof(this[key]) === 'object';
    if (isObject) value = deepClone(value);
    var render = this.render;

    if (key === 'style') {
      this.style.update(value);
    } else if (isObject) {
      Object.assign(this[key], value);
    } else {
      // @ts-ignore
      this[key] = value;
    }

    if (key === 'index') render.sortGraphsByIndex();
    if (reDraw) render.drawAllGraph();
  };

  Graph.prototype.animation = function (key, value, wait) {
    if (wait === void 0) {
      wait = false;
    }

    return __awaiter(this, void 0, void 0, function () {
      var valueRoot, valueKeys, beforeValue, _a, animationFrame, animationCurve, animationDelay, frameState, render;

      var _this = this;

      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (key !== 'shape' && key !== 'style') {
              console.error('Graph animation: Only supported shape and style animation!');
              return [2
              /*return*/
              ];
            }

            if (_typeof(value) !== 'object') {
              console.error('Graph animation: Shape or style must be an object!');
              return [2
              /*return*/
              ];
            }

            value = deepClone(value);
            if (key === 'style') value = Style.colorProcessor(value);
            valueRoot = this[key];
            valueKeys = Object.keys(value);
            beforeValue = valueKeys.reduce(function (state, currentKey) {
              var _a;

              return __assign(__assign({}, state), (_a = {}, _a[currentKey] = valueRoot[currentKey], _a));
            }, Object.create(null));
            _a = this, animationFrame = _a.animationFrame, animationCurve = _a.animationCurve, animationDelay = _a.animationDelay;
            frameState = transition(animationCurve, beforeValue, value, animationFrame, true);
            this.animationQueue.push({
              key: key,
              frameState: frameState
            });
            if (wait) return [2
            /*return*/
            ];
            if (!(animationDelay > 0)) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , delay(animationDelay)];

          case 1:
            _b.sent();

            _b.label = 2;

          case 2:
            render = this.render;
            return [2
            /*return*/
            , new Promise(function (resolve) {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4
                      /*yield*/
                      , render.launchAnimation()];

                    case 1:
                      _a.sent();

                      resolve();
                      return [2
                      /*return*/
                      ];
                  }
                });
              });
            })];
        }
      });
    });
  };
  /**
   * @description Extract the next frame of data from the animation queue
   * and update the graph state
   * @param timeStamp {number} Animation start timestamp
   */


  Graph.prototype.turnNextAnimationFrame = function (timeStamp) {
    var _this = this;

    var _a = this,
        animationPause = _a.animationPause,
        animationDelay = _a.animationDelay,
        animationQueue = _a.animationQueue;

    if (animationPause || Date.now() - timeStamp < animationDelay) return;
    this.animationQueue = animationQueue.reduce(function (queue, _a) {
      var key = _a.key,
          frameState = _a.frameState;
      Object.assign(_this[key], frameState.shift());

      if (frameState.length) {
        return __spreadArrays(queue, [{
          key: key,
          frameState: frameState
        }]);
      } else {
        return queue;
      }
    }, []);
  };
  /**
   * @description Skip to the last frame of animation
   */


  Graph.prototype.animationEnd = function () {
    var _this = this;

    var _a = this,
        animationQueue = _a.animationQueue,
        render = _a.render;

    animationQueue.forEach(function (_a) {
      var key = _a.key,
          frameState = _a.frameState;
      return Object.assign(_this[key], frameState.pop());
    });
    this.animationQueue = [];
    return render.drawAllGraph();
  };
  /**
   * @description Pause animation behavior
   */


  Graph.prototype.pauseAnimation = function () {
    this.attr('animationPause', true);
  };
  /**
   * @description Try animate
   */


  Graph.prototype.playAnimation = function () {
    var _this = this;

    var render = this.render;
    this.attr('animationPause', false);
    return new Promise(function (resolve) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4
              /*yield*/
              , render.launchAnimation()];

            case 1:
              _a.sent();

              resolve();
              return [2
              /*return*/
              ];
          }
        });
      });
    });
  };
  /**
   * @description Processor of delete
   */


  Graph.prototype.delProcessor = function () {
    var _this = this;

    var graphs = this.render.graphs;
    var index = graphs.findIndex(function (graph) {
      return graph === _this;
    });
    if (index === -1) return;
    if (this.beforeDelete) this.beforeDelete();
    graphs.splice(index, 1);
    if (this.deleted) this.deleted();
  };

  return Graph;
}();

function getTwoPointDistance(_a, _b) {
  var xa = _a[0],
      ya = _a[1];
  var xb = _b[0],
      yb = _b[1];
  var minusX = Math.abs(xa - xb);
  var minusY = Math.abs(ya - yb);
  return Math.sqrt(minusX * minusX + minusY * minusY);
}
function checkPointIsInCircle(point, _a) {
  var rx = _a.rx,
      ry = _a.ry,
      r = _a.r;
  return getTwoPointDistance(point, [rx, ry]) <= r;
}
function checkPointIsInRect$1(_a, _b) {
  var px = _a[0],
      py = _a[1];
  var x = _b.x,
      y = _b.y,
      w = _b.w,
      h = _b.h;
  if (px < x) return false;
  if (py < y) return false;
  if (px > x + w) return false;
  if (py > y + h) return false;
  return true;
}
/**
 * @description Determine if the point is in the clockwise direction of the vector
 */

function isClockWise(vArm, vPoint) {
  var ax = vArm[0],
      ay = vArm[1];
  var px = vPoint[0],
      py = vPoint[1];
  return -ay * px + ax * py > 0;
}
/**
 * @description Get the coordinates of the specified radian on the circle
 */

function getCircleRadianPoint(x, y, radius, radian) {
  return [x + Math.cos(radian) * radius, y + Math.sin(radian) * radius];
}
function checkPointIsInSector(point, _a) {
  var _b, _c, _d;

  var rx = _a.rx,
      ry = _a.ry,
      r = _a.r,
      startAngle = _a.startAngle,
      endAngle = _a.endAngle,
      clockWise = _a.clockWise;
  if (!point) return false;
  if (getTwoPointDistance(point, [rx, ry]) > r) return false;
  if (!clockWise) _b = [endAngle, startAngle], startAngle = _b[0], endAngle = _b[1];
  var reverseBE = startAngle > endAngle;
  if (reverseBE) _c = [endAngle, startAngle], startAngle = _c[0], endAngle = _c[1];
  var minus = endAngle - startAngle;
  if (minus >= Math.PI * 2) return true;
  var x = point[0],
      y = point[1];

  var _e = getCircleRadianPoint(rx, ry, r, startAngle),
      bx = _e[0],
      by = _e[1];

  var _f = getCircleRadianPoint(rx, ry, r, endAngle),
      ex = _f[0],
      ey = _f[1];

  var vPoint = [x - rx, y - ry];
  var vBArm = [bx - rx, by - ry];
  var vEArm = [ex - rx, ey - ry];
  var reverse = minus > Math.PI;
  if (reverse) _d = [vEArm, vBArm], vBArm = _d[0], vEArm = _d[1];
  var inSector = isClockWise(vBArm, vPoint) && !isClockWise(vEArm, vPoint);
  if (reverse) inSector = !inSector;
  if (reverseBE) inSector = !inSector;
  return inSector;
}
/**
 * @description Get the points that make up a regular polygon
 */

function getRegularPolygonPoints(_a, minus) {
  var rx = _a.rx,
      ry = _a.ry,
      r = _a.r,
      side = _a.side;

  if (minus === void 0) {
    minus = Math.PI * -0.5;
  }

  var radianGap = Math.PI * 2 / side;
  var radians = new Array(side).fill('').map(function (t, i) {
    return i * radianGap + minus;
  });
  return radians.map(function (radian) {
    return getCircleRadianPoint(rx, ry, r, radian);
  });
}
/**
 * @description Check if the point is inside the polygon
 */

function checkPointIsInPolygon(point, polygon) {
  var counter = 0;
  var x = point[0],
      y = point[1];
  var pointNum = polygon.length;

  for (var i = 1, p1 = polygon[0]; i <= pointNum; i++) {
    var p2 = polygon[i % pointNum];

    if (x > Math.min(p1[0], p2[0]) && x <= Math.max(p1[0], p2[0])) {
      if (y <= Math.max(p1[1], p2[1])) {
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
 * @description Check if the point is inside the polyline
 */

function checkPointIsNearPolyline(point, polyline, lineWidth) {
  var halfLineWidth = lineWidth / 2;
  var moveUpPolyline = polyline.map(function (_a) {
    var x = _a[0],
        y = _a[1];
    return [x, y - halfLineWidth];
  });
  var moveDownPolyline = polyline.map(function (_a) {
    var x = _a[0],
        y = _a[1];
    return [x, y + halfLineWidth];
  });

  var polygon = __spreadArrays(moveUpPolyline, moveDownPolyline.reverse());

  return checkPointIsInPolygon(point, polygon);
}
/**
 * @description Eliminate line blur due to 1px line width
 */

function eliminateBlur(points) {
  return points.map(function (_a) {
    var x = _a[0],
        y = _a[1];
    return [(x | 0) + 0.5, (y | 0) + 0.5];
  });
}

var arc = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    startAngle: 0,
    endAngle: 0,
    clockWise: true
  },
  validator: function validator(_a) {
    var shape = _a.shape;
    var keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle'];

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number';
    })) {
      console.error('CRender Graph Arc: Arc shape configuration is invalid!');
      return false;
    }

    return true;
  },
  draw: function draw(_a, _b) {
    var ctx = _a.ctx;
    var shape = _b.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        startAngle = shape.startAngle,
        endAngle = shape.endAngle,
        clockWise = shape.clockWise;
    ctx.beginPath();
    ctx.arc(rx, ry, r > 0 ? r : 0, startAngle, endAngle, !clockWise);
    ctx.stroke();
  },
  hoverCheck: function hoverCheck(point, _a) {
    var shape = _a.shape,
        style = _a.style;
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
    var inSide = checkPointIsInSector(point, {
      rx: rx,
      ry: ry,
      r: insideRadius,
      startAngle: startAngle,
      endAngle: endAngle,
      clockWise: clockWise
    });
    var outSide = checkPointIsInSector(point, {
      rx: rx,
      ry: ry,
      r: outsideRadius,
      startAngle: startAngle,
      endAngle: endAngle,
      clockWise: clockWise
    });
    return !inSide && outSide;
  },
  setGraphCenter: function setGraphCenter(_a) {
    var shape = _a.shape,
        style = _a.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_a, arc) {
    var movementX = _a.movementX,
        movementY = _a.movementY;
    var shape = arc.shape;
    arc.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    });
  }
};

/**
 * @description Draw a polyline path
 */
function drawPolylinePath(ctx, points, beginPath, closePath) {
  if (beginPath === void 0) {
    beginPath = false;
  }

  if (closePath === void 0) {
    closePath = false;
  }

  if (points.length < 2) return;
  if (beginPath) ctx.beginPath();
  points.forEach(function (point, i) {
    return point && (i === 0 ? ctx.moveTo.apply(ctx, point) : ctx.lineTo.apply(ctx, point));
  });
  if (closePath) ctx.closePath();
}
/**
 * @description Draw a bezier curve path
 */

function drawBezierCurvePath(ctx, points, moveTo, beginPath, closePath) {
  if (moveTo === void 0) {
    moveTo = false;
  }

  if (beginPath === void 0) {
    beginPath = false;
  }

  if (closePath === void 0) {
    closePath = false;
  }

  if (!ctx || !points) return;
  if (beginPath) ctx.beginPath();
  if (moveTo) ctx.moveTo.apply(ctx, moveTo);
  points.forEach(function (item) {
    return ctx.bezierCurveTo(item[0][0], item[0][1], item[1][0], item[1][1], item[2][0], item[2][1]);
  });
  if (closePath) ctx.closePath();
}

var bezierCurve = {
  shape: {
    points: [],
    close: false
  },
  validator: function validator(_a) {
    var shape = _a.shape;
    var points = shape.points;

    if (!(points instanceof Array)) {
      console.error('CRender Graph BezierCurve: BezierCurve points should be an array!');
      return false;
    }

    return true;
  },
  draw: function draw(_a, _b) {
    var ctx = _a.ctx;
    var shape = _b.shape,
        cache = _b.cache;
    var points = shape.points,
        close = shape.close;

    if (!cache.points || cache.points.toString() !== points.toString()) {
      var hoverPoints = bezierCurveToPolyline(points, 20);
      Object.assign(cache, {
        points: deepClone(points),
        hoverPoints: hoverPoints
      });
    }

    ctx.beginPath();
    drawBezierCurvePath(ctx, points.slice(1), points[0]);

    if (close) {
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.stroke();
    }
  },
  hoverCheck: function hoverCheck(point, _a) {
    var cache = _a.cache,
        shape = _a.shape,
        style = _a.style;
    var hoverPoints = cache.hoverPoints;
    var close = shape.close;
    var lineWidth = style.lineWidth;

    if (close) {
      return checkPointIsInPolygon(point, hoverPoints);
    } else {
      return checkPointIsNearPolyline(point, hoverPoints, lineWidth);
    }
  },
  setGraphCenter: function setGraphCenter(_a) {
    var shape = _a.shape,
        style = _a.style;
    var points = shape.points;
    style.graphCenter = points[0];
  },
  move: function move(_a, bezierCurve) {
    var movementX = _a.movementX,
        movementY = _a.movementY;
    var shape = bezierCurve.shape,
        cache = bezierCurve.cache;
    var points = shape.points;
    var _b = points[0],
        fx = _b[0],
        fy = _b[1];
    var curves = points.slice(1);

    var bezierCurvePoints = __spreadArrays([[fx + movementX, fy + movementY]], curves.map(function (curve) {
      return curve.map(function (_a) {
        var x = _a[0],
            y = _a[1];
        return [x + movementX, y + movementY];
      });
    }));

    cache.points = bezierCurvePoints;
    cache.hoverPoints = cache.hoverPoints.map(function (_a) {
      var x = _a[0],
          y = _a[1];
      return [x + movementX, y + movementY];
    });
    bezierCurve.attr('shape', {
      points: bezierCurvePoints
    });
  }
};

var circle = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0
  },
  validator: function validator(_a) {
    var shape = _a.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;

    if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
      console.error('CRender Graph Circle: Circle shape configuration is invalid!');
      return false;
    }

    return true;
  },
  draw: function draw(_a, _b) {
    var ctx = _a.ctx;
    var shape = _b.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;
    ctx.beginPath();
    ctx.arc(rx, ry, r > 0 ? r : 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  },
  hoverCheck: function hoverCheck(point, _a) {
    var shape = _a.shape;
    return checkPointIsInCircle(point, shape);
  },
  setGraphCenter: function setGraphCenter(_a) {
    var shape = _a.shape,
        style = _a.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_a, circle) {
    var movementX = _a.movementX,
        movementY = _a.movementY;
    var shape = circle.shape;
    circle.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    });
  }
};

var ellipse = {
  shape: {
    rx: 0,
    ry: 0,
    hr: 0,
    vr: 0
  },
  validator: function validator(_a) {
    var shape = _a.shape;
    var rx = shape.rx,
        ry = shape.ry,
        hr = shape.hr,
        vr = shape.vr;

    if (typeof rx !== 'number' || typeof ry !== 'number' || typeof hr !== 'number' || typeof vr !== 'number') {
      console.error('CRender Graph Ellipse: Ellipse shape configuration is invalid!');
      return false;
    }

    return true;
  },
  draw: function draw(_a, _b) {
    var ctx = _a.ctx;
    var shape = _b.shape;
    var rx = shape.rx,
        ry = shape.ry,
        hr = shape.hr,
        vr = shape.vr;
    ctx.beginPath();
    ctx.ellipse(rx, ry, hr > 0 ? hr : 0, vr > 0 ? vr : 0, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  },
  hoverCheck: function hoverCheck(point, _a) {
    var shape = _a.shape;
    var rx = shape.rx,
        ry = shape.ry,
        hr = shape.hr,
        vr = shape.vr;
    var a = Math.max(hr, vr);
    var b = Math.min(hr, vr);
    var c = Math.sqrt(a * a - b * b);
    var leftFocusPoint = [rx - c, ry];
    var rightFocusPoint = [rx + c, ry];
    var distance = getTwoPointDistance(point, leftFocusPoint) + getTwoPointDistance(point, rightFocusPoint);
    return distance <= 2 * a;
  },
  setGraphCenter: function setGraphCenter(_a) {
    var shape = _a.shape,
        style = _a.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_a, ellipse) {
    var movementX = _a.movementX,
        movementY = _a.movementY;
    var shape = ellipse.shape;
    ellipse.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    });
  }
};

var polyline = {
  shape: {
    points: [],
    close: false
  },
  validator: function validator(_a) {
    var shape = _a.shape;
    var points = shape.points;

    if (!(points instanceof Array)) {
      console.error('CRender Graph Polyline: Polyline points should be an array!');
      return false;
    }

    return true;
  },
  draw: function draw(_a, _b) {
    var ctx = _a.ctx;
    var shape = _b.shape,
        lineWidth = _b.style.lineWidth;
    var points = shape.points,
        close = shape.close;
    ctx.beginPath();
    drawPolylinePath(ctx, lineWidth === 1 ? eliminateBlur(points) : points);

    if (close) {
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.stroke();
    }
  },
  hoverCheck: function hoverCheck(point, _a) {
    var shape = _a.shape,
        style = _a.style;
    var points = shape.points,
        close = shape.close;
    var lineWidth = style.lineWidth;

    if (close) {
      return checkPointIsInPolygon(point, points);
    } else {
      return checkPointIsNearPolyline(point, points, lineWidth);
    }
  },
  setGraphCenter: function setGraphCenter(_a) {
    var shape = _a.shape,
        style = _a.style;
    var points = shape.points;
    style.graphCenter = points[0];
  },
  move: function move(_a, polyline) {
    var movementX = _a.movementX,
        movementY = _a.movementY;
    var points = polyline.shape.points;
    var moveAfterPoints = points.map(function (_a) {
      var x = _a[0],
          y = _a[1];
      return [x + movementX, y + movementY];
    });
    polyline.attr('shape', {
      points: moveAfterPoints
    });
  }
};

var rect = {
  shape: {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  },
  validator: function validator(_a) {
    var shape = _a.shape;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;

    if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number') {
      console.error('CRender Graph Rect: Rect shape configuration is invalid!');
      return false;
    }

    return true;
  },
  draw: function draw(_a, _b) {
    var ctx = _a.ctx;
    var shape = _b.shape;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
  },
  hoverCheck: function hoverCheck(point, _a) {
    var shape = _a.shape;
    return checkPointIsInRect$1(point, shape);
  },
  setGraphCenter: function setGraphCenter(_a) {
    var shape = _a.shape,
        style = _a.style;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;
    style.graphCenter = [x + w / 2, y + h / 2];
  },
  move: function move(_a, rect) {
    var movementX = _a.movementX,
        movementY = _a.movementY;
    var shape = rect.shape;
    rect.attr('shape', {
      x: shape.x + movementX,
      y: shape.y + movementY
    });
  }
};

var regPolygon = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    side: 0
  },
  validator: function validator(_a) {
    var shape = _a.shape;
    var side = shape.side;
    var keys = ['rx', 'ry', 'r', 'side'];

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number';
    })) {
      console.error('CRender Graph RegPolygon: RegPolygon shape configuration is invalid!');
      return false;
    }

    if (side < 3) {
      console.error('CRender Graph RegPolygon: RegPolygon at least trigon!');
      return false;
    }

    return true;
  },
  draw: function draw(_a, _b) {
    var ctx = _a.ctx;
    var shape = _b.shape,
        cache = _b.cache;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        side = shape.side;

    if (cache.points || cache.rx !== rx || cache.ry !== ry || cache.r !== r || cache.side !== side) {
      var points_1 = getRegularPolygonPoints(shape);
      Object.assign(cache, {
        points: points_1,
        rx: rx,
        ry: ry,
        r: r,
        side: side
      });
    }

    var points = cache.points;
    ctx.beginPath();
    drawPolylinePath(ctx, points);
    ctx.stroke();
    ctx.fill();
  },
  hoverCheck: function hoverCheck(point, _a) {
    var cache = _a.cache;
    var points = cache.points;
    return checkPointIsInPolygon(point, points);
  },
  setGraphCenter: function setGraphCenter(_a) {
    var shape = _a.shape,
        style = _a.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_a, regPolygon) {
    var movementX = _a.movementX,
        movementY = _a.movementY;
    var shape = regPolygon.shape,
        cache = regPolygon.cache;
    var rx = shape.rx,
        ry = shape.ry;
    cache.rx += movementX;
    cache.ry += movementY;
    regPolygon.attr('shape', {
      rx: rx + movementX,
      ry: ry + movementY
    });
    cache.points = cache.points.map(function (_a) {
      var x = _a[0],
          y = _a[1];
      return [x + movementX, y + movementY];
    });
  }
};

var ring = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0
  },
  validator: function validator(_a) {
    var shape = _a.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;

    if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
      console.error('CRender Graph Ring: Ring shape configuration is invalid!');
      return false;
    }

    return true;
  },
  draw: function draw(_a, _b) {
    var ctx = _a.ctx;
    var shape = _b.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;
    ctx.beginPath();
    ctx.arc(rx, ry, r > 0 ? r : 0, 0, Math.PI * 2);
    ctx.stroke();
  },
  hoverCheck: function hoverCheck(point, _a) {
    var shape = _a.shape,
        style = _a.style;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;
    var lineWidth = style.lineWidth;
    var halfLineWidth = lineWidth / 2;
    var minDistance = r - halfLineWidth;
    var maxDistance = r + halfLineWidth;
    var distance = getTwoPointDistance(point, [rx, ry]);
    return distance >= minDistance && distance <= maxDistance;
  },
  setGraphCenter: function setGraphCenter(_a) {
    var shape = _a.shape,
        style = _a.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_a, ring) {
    var movementX = _a.movementX,
        movementY = _a.movementY;
    var shape = ring.shape;
    ring.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    });
  }
};

var sector = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    startAngle: 0,
    endAngle: 0,
    clockWise: true
  },
  validator: function validator(_a) {
    var shape = _a.shape;
    var keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle'];

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number';
    })) {
      console.error('CRender Graph Sector: Sector shape configuration is invalid!');
      return false;
    }

    return true;
  },
  draw: function draw(_a, _b) {
    var ctx = _a.ctx;
    var shape = _b.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        startAngle = shape.startAngle,
        endAngle = shape.endAngle,
        clockWise = shape.clockWise;
    ctx.beginPath();
    ctx.arc(rx, ry, r > 0 ? r : 0, startAngle, endAngle, !clockWise);
    ctx.lineTo(rx, ry);
    ctx.stroke();
    ctx.fill();
  },
  hoverCheck: function hoverCheck(point, _a) {
    var shape = _a.shape;
    return checkPointIsInSector(point, shape);
  },
  setGraphCenter: function setGraphCenter(_a) {
    var shape = _a.shape,
        style = _a.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_a, sector) {
    var movementX = _a.movementX,
        movementY = _a.movementY;
    var _b = sector.shape,
        rx = _b.rx,
        ry = _b.ry;
    sector.attr('shape', {
      rx: rx + movementX,
      ry: ry + movementY
    });
  }
};

var smoothline = {
  shape: {
    points: [],
    close: false
  },
  validator: function validator(_a) {
    var shape = _a.shape;
    var points = shape.points;

    if (!(points instanceof Array)) {
      console.error('CRender Graph Smoothline: Smoothline points should be an array!');
      return false;
    }

    return true;
  },
  draw: function draw(_a, _b) {
    var ctx = _a.ctx;
    var shape = _b.shape,
        cache = _b.cache;
    var points = shape.points,
        close = shape.close;

    if (!cache.points || cache.points.toString() !== points.toString()) {
      var bezierCurve_1 = polylineToBezierCurve(points, close);
      var hoverPoints = bezierCurveToPolyline(bezierCurve_1);
      Object.assign(cache, {
        points: deepClone(points),
        bezierCurve: bezierCurve_1,
        hoverPoints: hoverPoints
      });
    }

    var bezierCurve = cache.bezierCurve;
    ctx.beginPath();
    drawBezierCurvePath(ctx, bezierCurve.slice(1), bezierCurve[0]);

    if (close) {
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.stroke();
    }
  },
  hoverCheck: function hoverCheck(point, _a) {
    var cache = _a.cache,
        shape = _a.shape,
        style = _a.style;
    var hoverPoints = cache.hoverPoints;
    var close = shape.close;
    var lineWidth = style.lineWidth;

    if (close) {
      return checkPointIsInPolygon(point, hoverPoints);
    } else {
      return checkPointIsNearPolyline(point, hoverPoints, lineWidth);
    }
  },
  setGraphCenter: function setGraphCenter(_a) {
    var shape = _a.shape,
        style = _a.style;
    var points = shape.points;
    style.graphCenter = points[0];
  },
  move: function move(_a, smoothline) {
    var movementX = _a.movementX,
        movementY = _a.movementY;
    var shape = smoothline.shape,
        cache = smoothline.cache;
    var points = shape.points;
    var moveAfterPoints = points.map(function (_a) {
      var x = _a[0],
          y = _a[1];
      return [x + movementX, y + movementY];
    });
    cache.points = moveAfterPoints;
    var _b = cache.bezierCurve[0],
        fx = _b[0],
        fy = _b[1];
    var curves = cache.bezierCurve.slice(1);
    cache.bezierCurve = __spreadArrays([[fx + movementX, fy + movementY]], curves.map(function (curve) {
      return curve.map(function (_a) {
        var x = _a[0],
            y = _a[1];
        return [x + movementX, y + movementY];
      });
    }));
    cache.hoverPoints = cache.hoverPoints.map(function (_a) {
      var x = _a[0],
          y = _a[1];
      return [x + movementX, y + movementY];
    });
    smoothline.attr('shape', {
      points: moveAfterPoints
    });
  }
};

var text = {
  shape: {
    content: '',
    position: [0, 0],
    maxWidth: undefined,
    rowGap: 0
  },
  validator: function validator(_a) {
    var shape = _a.shape;
    var content = shape.content,
        position = shape.position,
        rowGap = shape.rowGap;

    if (typeof content !== 'string') {
      console.error('CRender Graph Text: Text content should be a string!');
      return false;
    }

    if (!Array.isArray(position)) {
      console.error('CRender Graph Text: Text position should be an array!');
      return false;
    }

    if (typeof rowGap !== 'number') {
      console.error('CRender Graph Text: Text rowGap should be a number!');
      return false;
    }

    return true;
  },
  draw: function draw(_a, _b) {
    var ctx = _a.ctx;
    var shape = _b.shape;
    var content = shape.content,
        position = shape.position,
        maxWidth = shape.maxWidth,
        rowGap = shape.rowGap;
    var textBaseline = ctx.textBaseline,
        font = ctx.font;
    var contentArr = content.split('\n');
    var rowNum = contentArr.length;
    var fontSize = parseInt(font.replace(/\D/g, ''));
    var lineHeight = fontSize + rowGap;
    var allHeight = rowNum * lineHeight - rowGap;
    var offset = 0;
    var x = position[0];
    var y = position[1];

    if (textBaseline === 'middle') {
      offset = allHeight / 2;
      y += fontSize / 2;
    }

    if (textBaseline === 'bottom') {
      offset = allHeight;
      y += fontSize;
    }

    var positions = new Array(rowNum).fill(0).map(function (_, i) {
      return [x, y + i * lineHeight - offset];
    });
    ctx.beginPath();
    contentArr.forEach(function (text, i) {
      ctx.fillText(text, positions[i][0], positions[i][1], maxWidth);
      ctx.strokeText(text, positions[i][0], positions[i][1], maxWidth);
    });
    ctx.closePath();
  },
  hoverCheck: function hoverCheck() {
    return false;
  },
  setGraphCenter: function setGraphCenter(_a) {
    var shape = _a.shape,
        style = _a.style;
    var position = shape.position;
    style.graphCenter = __spreadArrays(position);
  },
  move: function move(_a, text) {
    var movementX = _a.movementX,
        movementY = _a.movementY;
    var _b = text.shape.position,
        x = _b[0],
        y = _b[1];
    text.attr('shape', {
      position: [x + movementX, y + movementY]
    });
  }
};

var GRAPHS = new Map([['arc', arc], ['bezierCurve', bezierCurve], ['circle', circle], ['ellipse', ellipse], ['polyline', polyline], ['rect', rect], ['regPolygon', regPolygon], ['ring', ring], ['sector', sector], ['smoothline', smoothline], ['text', text]]);
function extendNewGraph(name, graphModel) {
  if (!name || !graphModel) {
    console.error('CRender extendNewGraph: Missing Parameters!');
    return;
  }

  if (!graphModel.shape) {
    console.error('CRender extendNewGraph: Required attribute of shape to extendNewGraph!');
    return;
  }

  if (!graphModel.validator) {
    console.error('CRender extendNewGraph: Required function of validator to extendNewGraph!');
    return;
  }

  if (!graphModel.draw) {
    console.error('CRender extendNewGraph: Required function of draw to extendNewGraph!');
    return;
  }

  GRAPHS.set(name, graphModel);
}

var CRender =
/** @class */
function () {
  function CRender(canvas) {
    /**
     * @description Width and height of the canvas
     */
    this.area = [0, 0];
    /**
     * @description Whether render is in animation rendering
     */

    this.animationStatus = false;
    /**
     * @description Added graph
     */

    this.graphs = [];

    if (!canvas) {
      console.error('CRender: Missing parameters!');
      return;
    }

    var ctx = canvas.getContext('2d');
    var clientWidth = canvas.clientWidth,
        clientHeight = canvas.clientHeight;
    var area = [clientWidth, clientHeight];
    canvas.setAttribute('width', clientWidth + '');
    canvas.setAttribute('height', clientHeight + '');
    Object.assign(this, {
      canvas: canvas,
      ctx: ctx,
      area: area
    });
    canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    canvas.addEventListener('mouseup', this.mouseUp.bind(this));
  }

  CRender.prototype.clearArea = function () {
    var _a = this,
        canvas = _a.canvas,
        area = _a.area;

    canvas.width = area[0];
  };
  /**
   * @description Sort the graphs by index
   * Give priority to index high graph in rendering
   */


  CRender.prototype.sortGraphsByIndex = function () {
    var graphs = this.graphs;
    graphs.sort(function (_a, _b) {
      var a = _a.index;
      var b = _b.index;
      return a - b;
    });
  };

  CRender.prototype.drawAllGraph = function () {
    this.clearArea();
    this.graphs.filter(function (graph) {
      return graph.visible;
    }).forEach(function (graph) {
      return graph.drawProcessor();
    });
  };

  CRender.prototype.add = function (config) {
    var name = config.name;

    if (!name) {
      console.error('CRender add: Missing parameters!');
      return null;
    }

    var graphConfig = GRAPHS.get(name);

    if (!graphConfig) {
      console.warn('CRender add: No corresponding graph configuration found!');
      return null;
    }

    if (!graphConfig.validator(config)) return null;
    var graph = new Graph(graphConfig, config, this);
    this.graphs.push(graph);
    this.sortGraphsByIndex();
    this.drawAllGraph();
    return graph;
  };

  CRender.prototype.delGraph = function (graph) {
    graph.delProcessor();
    this.drawAllGraph();
  };

  CRender.prototype.delAllGraph = function () {
    this.graphs.forEach(function (graph) {
      return graph.delProcessor();
    });
    this.clearArea();
  };

  CRender.prototype.clone = function (graph) {
    var config = deepClone(__assign({}, graph));
    return this.add(config);
  };
  /**
   * @description Animate the graph whose animation queue is not empty
   * and the animationPause is false
   */


  CRender.prototype.launchAnimation = function () {
    var _this = this;

    var animationStatus = this.animationStatus;
    if (animationStatus) return;
    this.animationStatus = true;
    return new Promise(function (resolve) {
      _this.animate(function () {
        _this.animationStatus = false;
        resolve();
      }, Date.now());
    });
  };

  CRender.prototype.animate = function (callback, timeStamp) {
    var graphs = this.graphs;

    if (!this.animateAble()) {
      callback();
      return;
    }

    graphs.forEach(function (graph) {
      return graph.turnNextAnimationFrame(timeStamp);
    });
    this.drawAllGraph();
    requestAnimationFrame(this.animate.bind(this, callback, timeStamp));
  };

  CRender.prototype.animateAble = function () {
    var graphs = this.graphs;
    return !!graphs.find(function (graph) {
      return !graph.animationPause && graph.animationQueue.length;
    });
  };
  /**
   * @description Handler of CRender mousedown event
   */


  CRender.prototype.mouseDown = function () {
    var graphs = this.graphs;
    var hoverGraph = graphs.find(function (graph) {
      return graph.status === Status.HOVER;
    });
    if (!hoverGraph) return;
    hoverGraph.status = Status.ACTIVE;
  };
  /**
   * @description Handler of CRender mousemove event
   */


  CRender.prototype.mouseMove = function (e) {
    var offsetX = e.offsetX,
        offsetY = e.offsetY;
    var position = [offsetX, offsetY];
    var graphs = this.graphs;
    var activeGraph = graphs.find(function (graph) {
      return graph.status === Status.ACTIVE || graph.status === Status.DRAG;
    }); // Active Graph | Drag Able | Move Able

    if (activeGraph && activeGraph.drag && activeGraph.move) {
      activeGraph.moveProcessor(e);
      activeGraph.status = Status.DRAG;
      return;
    }

    var hoverGraph = graphs.find(function (graph) {
      return graph.status === Status.HOVER;
    });
    var hoverAbleGraphs = graphs.filter(function (graph) {
      return graph.hover && (graph.hoverCheck || graph.hoverRect);
    });
    var hoveredGraph = hoverAbleGraphs.find(function (graph) {
      return graph.hoverCheckProcessor(position);
    }); // Hover Graph

    if (hoveredGraph) {
      document.body.style.cursor = hoveredGraph.style.hoverCursor;
    } else {
      document.body.style.cursor = 'default';
    } // No hover graph


    if (!hoveredGraph && !hoverGraph) return; // Same hover graph

    if (hoveredGraph === hoverGraph) return; // No hoverd graph But before had

    if (!hoveredGraph && hoverGraph) {
      if (hoverGraph.onMouseOuter) hoverGraph.onMouseOuter(e);
      hoverGraph.status = Status.STATIC;
      return;
    } // Only has hovered graph


    if (hoveredGraph && !hoverGraph) {
      if (hoveredGraph.onMouseEnter) hoveredGraph.onMouseEnter(e);
      hoveredGraph.status = Status.HOVER;
      return;
    } // Not a same graph


    if (hoverGraph.onMouseOuter) hoverGraph.onMouseOuter(e);
    hoverGraph.status = Status.STATIC;
    if (hoveredGraph.onMouseEnter) hoveredGraph.onMouseEnter(e);
    hoveredGraph.status = Status.HOVER;
  };
  /**
   * @description Handler of CRender mouseup event
   * @return {Undefined} Void
   */


  CRender.prototype.mouseUp = function (e) {
    var graphs = this.graphs;
    var activeGraph = graphs.find(function (graph) {
      return graph.status === Status.ACTIVE;
    });
    var dragGraph = graphs.find(function (graph) {
      return graph.status === Status.DRAG;
    });
    if (activeGraph && activeGraph.onClick) activeGraph.onClick(e);
    graphs.forEach(function (graph) {
      return graph.status = Status.STATIC;
    });
    if (activeGraph) activeGraph.status = Status.HOVER;
    if (dragGraph) dragGraph.status = Status.HOVER;
  };

  return CRender;
}();

export default CRender;
export { CRender, extendNewGraph };