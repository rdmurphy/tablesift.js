(function(global) {
    var VERSION = "0.0.9alpha";
    var TableSift = {};
    var _each = _.each;
    var _map = _.map;
    var _sort = _.sortBy;
    var _extend = _.extend;
    var _isString = _.isString;
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
        var preppedRemoveChars = _map(options.removeChars, function(rc) {
            var c = rc.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            return new RegExp(c, "g");
        });
        _each(tableBody.rows, function(row) {
            var cellStore = [];
            _each(row.children, function(cell) {
                var i = cell.cellIndex;
                var content = cell.textContent;
                if (options.customSort && options.customSort[i]) {
                    cellStore.push(options.customSort[i](content, cell));
                } else {
                    _each(preppedRemoveChars, function(rc) {
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