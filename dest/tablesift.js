(function(global) {
    var VERSION = "0.0.7";
    var TableSift = {};
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
        } else {
            var i, l;
            for (i = 0, l = col.length; i < l; ++i) {
                if (i in col) {
                    fn.call(scope, col[i], i, col);
                }
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
                value: value,
                index: index,
                criteria: fn.call(scope, value, index, list)
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
        return toString.call(obj) === "[object String]";
    };
    var _options = {
        classAsc: "sift-asc",
        classDes: "sift-des",
        customSort: {},
        noSort: [],
        removeChars: [ ",", "$" ]
    };
    var _getDomHook = function(id) {
        return _isString(id) ? document.getElementById(id) : id;
    };
    var _collectTableRows = function(tableBody, options) {
        var store = [];
        _each(tableBody.rows, function(row) {
            var cellStore = [];
            _each(row.children, function(cell) {
                var i = cell.cellIndex;
                var content = cell.textContent;
                if (options.customSort && options.customSort[i]) {
                    cellStore.push(options.customSort[i](content, cell));
                } else {
                    _each(options.removeChars, function(rc) {
                        content = content.replace(rc, "");
                    });
                    cellStore.push(isNaN(+content) ? content : +content);
                }
            });
            store.push([ cellStore, row ]);
        });
        return store;
    };
    var _classManager = function(el, cln, action) {
        var classList;
        if (el.className) {
            classList = el.className.split(" ");
        } else {
            classList = [];
        }
        _each(cln, function(c, i) {
            if (action[i] === "+") {
                classList.push(c);
            }
            if (action[i] === "-") {
                var classIndex = classList.indexOf(c);
                if (classIndex > -1) {
                    classList.splice(classIndex, 1);
                }
            }
        });
        el.className = classList.join(" ");
    };
    var _fragBuild = function(sortedRows) {
        var frag = document.createDocumentFragment();
        _each(sortedRows, function(s) {
            frag.appendChild(s[1]);
        });
        return frag;
    };
    var init = function(id, options) {
        options = this.options = _extend(_options, options);
        var table = this._table = _getDomHook(id);
        var tableHeadCells = table.tHead.rows[0].cells;
        var tableBody = table.tBodies[0];
        var rowData = this._rowData = _collectTableRows(tableBody, options);
        _each(tableHeadCells, function(c) {
            var i = c.cellIndex;
            if (options.noSort && options.noSort.indexOf(i) > -1) {
                return false;
            }
            _classManager(c, [ "siftable" ], [ "+" ]);
            c.addEventListener("click", function() {
                var prevSortOrder = c.getAttribute("data-sort");
                var sorted = _sort(rowData, function(row) {
                    return row[0][i];
                });
                _each(tableHeadCells, function(cj) {
                    if (c !== cj) {
                        cj.setAttribute("data-sort", "");
                        _classManager(cj, [ options.classAsc, options.classDes ], [ "-", "-" ]);
                    }
                });
                if (prevSortOrder === "asc") {
                    sorted.reverse();
                    c.setAttribute("data-sort", "des");
                    _classManager(c, [ options.classDes, options.classAsc ], [ "+", "-" ]);
                } else {
                    c.setAttribute("data-sort", "asc");
                    _classManager(c, [ options.classAsc, options.classDes ], [ "+", "-" ]);
                }
                var frag = _fragBuild(sorted);
                tableBody = table.removeChild(tableBody).cloneNode();
                table.appendChild(tableBody).appendChild(frag);
            });
        });
    };
    TableSift.init = init;
    TableSift.VERSION = VERSION;
    global.TableSift = TableSift;
})(window);