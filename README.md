TableSift
=========

Let's get this party started.

![Siftin'](http://i.imgur.com/pg46mZ8.gif)

How to Use
----------

```js
TableSift.init(<id of table> (str) -or- <reference to table> (HTMLTableElement), <options> (object));
```

**Default options**

```js
{
    classAsc: 'sift-asc',  // class applied to columns sorted ascending
    classDes: 'sift-des',  // class applied to columns sorted descending
    customSort: {},  // custom functions to parse a column's cells, none by default
    noSort: [],  // don't active a sort feature on provided column indexes, none by default
    removeChars: [',', '$']  // ignore these characters when determining value for sort
}
```

**Different class names for sorted columns**
```js
{
    classAsc: 'sorted-a',
    classDes: 'sorted-d'
}
```

**Custom sorter for column index 2, parses number from a cell's text content**
```js
{
    customSort: {
        2: function(con, el) {  // 'con' == the cell's text, 'el' == the actual cell element
            return +con.match(/\d+/)[0];  // regex to find number in string, pull it out, and convert to number
        }
    }
}
```

**Don't enable sorting for column index 3**
```js
{
    noSort: [3]  // can take comma-delimited entry
}
```

**removeChars**
```js
{
    removeChars: [',', '£']  // comma-delimited characters to ignore; for example, pounds instead of dollars
}
```
