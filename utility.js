/**
 * Created by MC on 2017/2/7.
 */
var base = (function () {
    function base() {
    }
    base.prototype.forEach = function (arr, func) {
        for (var i = 0; i < arr.length; i++) {
            func(arr[i], i);
        }
    };
    //
    base.prototype.filter = function (arr, func) {
        var a = [];
        var i = 0;
        for (i = 0; i < arr.length; i++) {
            if (func(arr[i])) {
                a.push(arr[i]);
            }
        }
        return a;
    };
    base.prototype.first = function (arr, predict) {
        for (var i = 0; i < arr.length; i++) {
            if (predict instanceof Object) {
                var allMeet = true;
                for (name in predict) {
                    if (predict[name] != arr[i][name]) {
                        allMeet = false;
                        break;
                    }
                }
                if (allMeet) {
                    return arr[i];
                }
            }
            else if (predict instanceof Function) {
                if (predict(arr[i])) {
                    return arr[i];
                }
            }
        }
    };
    base.prototype.extend = function () {
        var _isObject, _extend;
        _isObject = function (o) {
            return Object.prototype.toString.call(o) === '[object Object]';
        }; //判断是否为Object
        _extend = function self(target, source) {
            var property;
            for (property in source) {
                if (_isObject(target[property]) && _isObject(source[property])) {
                    self(target[property], source[property]); //递归
                }
                target[property] = source[property];
            }
        };
        var arg = arguments;
        if (arg.length <= 1) {
            return; //直接返回
        }
        else {
            var i;
            for (i = 1; i < arg.length; i++) {
                _extend(arg[0], arg[i]);
            }
        }
        if (arg.length > 0)
            return arg[0];
    };
    base.prototype.getDefaultClass = function (selector) {
        var tb = document.querySelectorAll(selector);
        if (tb != null && tb.length > 0) {
            return tb[0].className;
        }
    };
    base.prototype.all = function (arr, func) {
        var isTrue = true;
        for (var i = 0; i < arr.length; i++) {
            if (!func(arr[i])) {
                isTrue = false;
                break;
            }
        }
        return isTrue;
    };
    base.prototype.clone = function (obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj)
            return obj;
        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            var copy1 = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy1[i] = this.clone(obj[i]);
            }
            return copy1;
        }
        // Handle Object
        if (obj instanceof Object) {
            var copy2 = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy2[attr] = this.clone(obj[attr]);
            }
            return copy2;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    };
    base.prototype.isInteger = function (obj) { return (obj | 0) === obj; };
    return base;
})();
exports.__esModule = true;
exports["default"] = base;
//# sourceMappingURL=utility.js.map