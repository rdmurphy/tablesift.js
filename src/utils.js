var aProto = Array.prototype;
var nativeEach = aProto.forEach;
var nativeMap = aProto.map;
var slice = aProto.slice;

var oProto = Object.prototype;
var toString = oProto.toString;

var _each = function(col, fn, scope) {
    if (col == null) {
        return;
    }

    if (nativeEach && col.forEach === nativeEach) {
        col.forEach(fn, scope);
    }

    var i, l;
    for (i = 0, l = col.length; i < l; ++i) {
        if (i in col) {
            fn.call(scope, col[i], i, col);
        }
    }
};

var _map = function(col, fn, scope) {
    var payload = [];

    if (col == null) {
        return payload;
    }

    if (nativeMap && col.map === nativeMap) {
        return col.map(fn, scope);
    }

    _each(col, function(val, idx, list) {
        payload.push(fn.call(scope, val, idx, list));
    });

    return payload;
};

var _sort = function(col, fn, scope) {
    return _map(_map(col, function(value, index, list) {
        return {
            value : value,
            index : index,
            criteria : fn.call(scope, value, index, list)
        };
    }).sort(function(left, right) {
        var a = left.criteria;
        var b = right.criteria;

        if (a !== b) {

            if (a > b || a === void 0) {
                return 1;
            }

            if (a < b || b === void 0) {
                return -1;
            }
        }

        return left.index < right.index ? -1 : 1;

        }), function(item) {
            return item.value;
        });
};

var _extend = function(obj) {
    _each(slice.call(arguments, 1), function(source) {
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    });

    return obj;
};

var _isString = function(obj) {
    return toString.call(obj) === '[object String]';
};
