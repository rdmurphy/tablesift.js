var _options = {
    removeChars: [',', '$']
};

var _getDomHook = function(id) {
    return _isString(id) ? document.getElementById(id) : id;
};

var _collectTableRows = function(tableBody, removeChars, customSort) {
    var store = [];

    _each(tableBody.rows, function(row) {
        var cellStore = [];
        _each(row.children, function(cell) {
            var i = cell.cellIndex;
            var content = cell.textContent;

            if (customSort && customSort[i]) {
                cellStore.push(customSort[i](content, cell));
            } else {
                _each(removeChars, function(rc) {
                    content = content.replace(rc, '');
                });

                cellStore.push(isNaN(+content) ? content : +content);
            }
        });

        store.push([cellStore, row]);
    });

    return store;
};

var _classManager = function(el, cln, action) {
    var classList;

    if (el.className) {
        classList = el.className.split(' ');
    } else {
        classList = [];
    }

    if (action === 'add') {
        classList.push(cln);
    }

    if (action === 'remove') {
        var classIndex = classList.indexOf(cln);
        if (classIndex > -1) {
            classList.splice(classIndex, 1);
        }
    }

    el.className = classList.join(' ');
};

exports.init = function(id, options) {
    options = _extend(_options, options);

    var table = _getDomHook(id);
    var tableHeadCells = table.tHead.rows[0].cells;
    var tableBody = table.tBodies[0];
    var rowData = _collectTableRows(tableBody, options.removeChars, options.customSort);

    _each(tableHeadCells, function(c) {
        _classManager(c, 'siftable', 'add');

        c.addEventListener('click', function() {
            var i = c.cellIndex;

            var prevSortOrder = c.getAttribute('data-sort');

            var sorted = _sort(rowData, function(row) {
                return row[0][i];
            });

            _each(tableHeadCells, function(cj) {
                if (c !== cj) {
                    cj.setAttribute('data-sort', '');
                    _classManager(cj, 'siftable-asc', 'remove');
                    _classManager(cj, 'siftable-des', 'remove');
                }
            });

            if (prevSortOrder === 'asc') {
                sorted.reverse();
                c.setAttribute('data-sort', 'des');
                _classManager(c, 'siftable-des', 'add');
                _classManager(c, 'siftable-asc', 'remove');
            } else {
                c.setAttribute('data-sort', 'asc');
                _classManager(c, 'siftable-asc', 'add');
                _classManager(c, 'siftable-des', 'remove');
            }

            var frag = document.createDocumentFragment();

            _each(sorted, function(s) {
                frag.appendChild(s[1]);
            });

            tableBody = table.removeChild(tableBody).cloneNode();
            table.appendChild(tableBody).appendChild(frag);
        });
    });
};
