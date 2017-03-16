/**
 * Created by MC on 2017/2/9.
 */
var _= {};
_.forEach = function (arr, func) {
    if (arr == null) return;
    var i = 0;
    for (i = 0; i < arr.length; i++) {
        func(arr[i], i);
    }
}
_.first = function (arr, predict) {
    for (var i = 0; i < arr.length; i++) {
        if (typeof (predict) == 'object') {
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
        } else if (typeof (predict) == 'function') {
            if (predict(arr[i])) {
                return arr[i];
            }
        }
    }
}
/*//s*/
_.filter = function (arr, predict) {
    var a = [];
    var i = 0;
    for (i = 0; i < arr.length; i++) {
        if (typeof (predict) == 'object') {
            var allMeet = true;
            for (name in predict) {
                if (predict[name] != arr[i][name]) {
                    allMeet = false;
                    break;
                }
            }
            if (allMeet) {
                a.push(arr[i]);
            }
        } else if (typeof (predict) == 'function') {
            if (predict(arr[i])) {
                a.push(arr[i]);
            }
        }
    }
    return a;
}
_.extend = function () {
    var _isObject, _extend;
    _isObject = function (o) {
        return Object.prototype.toString.call(o) === '[object Object]';
    } //判断是否为Object
    _extend = function self(target, source) {
        var property;
        for (property in source) {
            if (_isObject(target[property]) && _isObject(source[property])) {
                self(target[property], source[property]);//递归
            }
            target[property] = source[property];
        }
    }
    var arg = arguments;
    if (arg.length <= 1) {
        return;//直接返回
    }
    else {
        var i;
        for (i = 1; i < arg.length; i++) {
            _extend(arg[0], arg[i]);
        }
    }
    if (arg.length > 0)
        return arg[0];
}

_.all = function (arr, func) {
    var isTrue = true;
    for (var i = 0; i < arr.length; i++) {
        if (!func(arr[i])) {
            isTrue = false;
            break;
        }
    }
    return isTrue;
}
_.clone = function (obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}

//公共基础类
NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach = function (func) {
    _.forEach(this, function (item, rowId) {
        func(item, rowId);
    })
}
NodeList.prototype.filter = HTMLCollection.prototype.filter = Array.prototype.filter = function (predict) {
    return _.filter(this, predict);
}
NodeList.prototype.first = HTMLCollection.prototype.first = Array.prototype.first = function (predict) {
    return _.first(this, predict);
}
Element.prototype.addClass = function (cls) {
    var obj = this
    var obj_class = obj.className; //获取 class 内容.
    if (obj_class != null) {
        obj_class.replace(/(\s+)/gi, ' ');
        var classArr = obj_class.split(' ');
        if (classArr.indexOf(cls) > -1)
            return;
    }
    blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
    added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
    obj.className = added;//替换原来的 class.
}
Element.prototype.removeClass = function (cls) {
    var obj = this;
    var obj_class = ' ' + obj.className + ' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' '),//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
        removed = obj_class.replace(' ' + cls + ' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed;//替换原来的 class.
}
Element.prototype.remove = function(){
    this.parentNode.removeChild(this);
}
Element.prototype.hasClass = function (cls) {
    var obj = this;
    var obj_class = obj.className,//获取 class 内容.
        obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
    x = 0;
    for (x in obj_class_lst) {
        if (obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
            return true;
        }
    }
    return false;
}
Element.prototype.parentTag = function (tagName) {
    var parentNode = this.parentNode;
    do {
        if (parentNode.tagName.toUpperCase() === tagName.toUpperCase() || parentNode.tagName.toUpperCase() == 'BODY') {
            break;
        }
        var parentNode = parentNode.parentNode;
    }
    while (true)
    if (parentNode.tagName.toUpperCase() === 'BODY') {
        return null;
    }
    else {
        return parentNode;
    }
}
function isInteger(obj) {
    return (obj | 0) === obj;
}
