import { __spreadArray } from 'tslib';
function equal(a, b) {
    if (a === b) {
        return true;
    }
    if (a !== a && b !== b) {
        return true;
    }
    return false;
}
var component2 = my.canIUse('component2');
export default (function (_a) {
    var _b;
    if (_a === void 0) {
        var _c = {};
    } else {
        var _c = _a;
    }
    var _d = _c.valueKey;
    if (_d === void 0) {
        var valueKey = 'value';
    } else {
        var valueKey = _d;
    }
    var _e = _c.defaultValueKey;
    var defaultValueKey = _e === void 0 ? 'defaultValue' : _e;
    var _f = _c.scopeKey;
    var scopeKey = _f === void 0 ? 'mixin' : _f;
    var _g = _c.transformValue;
    var transformValue =
        _g === void 0
            ? function (value) {
                  return {
                      needUpdate: true,
                      value: value
                  };
              }
            : _g;
    return {
        data: {},
        onInit: function () {
            var value = typeof this.props[valueKey] !== 'undefined' ? this.props[valueKey] : this.props[defaultValueKey];
            var needUpdate = this.update(value, {
                nextProps: this.props
            }).needUpdate;
            if (!needUpdate) {
                this.updateControlled();
            }
        },
        deriveDataFromProps: function (nextProps) {
            if (!equal(nextProps[valueKey], this.props[valueKey])) {
                this.update(nextProps[valueKey], {
                    nextProps: nextProps
                });
            }
        },
        didUpdate: function (prevProps) {
            if (component2) {
                return;
            }
            if (!equal(prevProps[valueKey], this.props[valueKey])) {
                this.update(this.props[valueKey], {
                    nextProps: this.props
                });
            }
        },
        didMount: function () {
            if (component2) {
                return;
            }
            var value = typeof this.props[valueKey] !== 'undefined' ? this.props[valueKey] : this.props[defaultValueKey];
            var needUpdate = this.update(value, {
                nextProps: this.props
            }).needUpdate;
            if (!needUpdate) {
                this.updateControlled();
            }
        },
        methods: {
            getValue: function (prevData) {
                return (prevData || this)[scopeKey].value;
            },
            isEqualValue: function (prevData) {
                if (!prevData[scopeKey].updated) {
                    return true;
                }
                return equal(this.getValue(prevData), this.getValue());
            },
            isControlled: function () {
                if ('controlled' in this.props) {
                    return this.props.controlled;
                }
                return valueKey in this.props;
            },
            updateControlled: function () {
                var _a;
                this.setData({
                    controlled: this.isControlled()
                });
            },
            update: function (val, extra) {
                var _a;
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                var _b = transformValue.call.apply(transformValue, __spreadArray([this, val, extra], args, false)) || {};
                var needUpdate = _b.needUpdate;
                var value = _b.value;
                if (needUpdate) {
                    this.setData({
                        value: value,
                        updated: true,
                        controlled: this.isControlled()
                    });
                }
                return {
                    needUpdate: needUpdate,
                    value: value
                };
            }
        }
    };
});
