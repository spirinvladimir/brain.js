'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.predict = predict;
exports.compare = compare;

var _types = require('./types');

var _kernel = require('../utilities/kernel');

var _sigmoid = require('../activation/sigmoid');

var _zeros2d = require('../utilities/zeros-2d');

var _zeros2d2 = _interopRequireDefault(_zeros2d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function predict(inputs) {
  return (0, _sigmoid.activate)(inputs[this.thread.y][this.thread.x]);
}

function compare(weights, deltas) {
  var weight = weights[this.thread.y][this.thread.x];
  var delta = deltas[this.thread.y][this.thread.x];
  return (0, _sigmoid.measure)(weight, delta);
}

var Sigmoid = function (_Activation) {
  _inherits(Sigmoid, _Activation);

  function Sigmoid(inputLayer) {
    _classCallCheck(this, Sigmoid);

    var _this = _possibleConstructorReturn(this, (Sigmoid.__proto__ || Object.getPrototypeOf(Sigmoid)).call(this));

    _this.inputLayer = inputLayer;

    var width = inputLayer.width,
        height = inputLayer.height;

    _this.width = width;
    _this.height = height;
    _this.validate();
    _this.weights = (0, _zeros2d2.default)(_this.width, _this.height);
    _this.deltas = (0, _zeros2d2.default)(_this.width, _this.height);
    return _this;
  }

  _createClass(Sigmoid, [{
    key: 'setupKernels',
    value: function setupKernels() {
      this.predictKernel = (0, _kernel.makeKernel)(predict, {
        output: [this.width, this.height],
        functions: [_sigmoid.activate]
      });

      this.compareKernel = (0, _kernel.makeKernel)(compare, {
        output: [this.width, this.height],
        functions: [_sigmoid.measure]
      });
    }
  }, {
    key: 'predict',
    value: function predict() {
      this.weights = this.predictKernel(this.inputLayer.weights);
    }
  }, {
    key: 'compare',
    value: function compare() {
      this.inputLayer.deltas = this.compareKernel(this.weights, this.deltas);
    }
  }]);

  return Sigmoid;
}(_types.Activation);

exports.default = Sigmoid;