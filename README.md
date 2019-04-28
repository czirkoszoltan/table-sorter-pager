# table-sorter-pager

Minimalist table sorter and pager plugin for jQuery. 3 kbytes when minified, 1.1 kbytes minified and zipped.

## Demo

See [demo page](https://czirkoszoltan.github.io/table-sorter-pager/).

## Sorter: sorter.js + sorter.css

The sorter is 1.2 kbytes minified. Works with numeric and string content (auto-detected). Use with:

```js
$('.tablesorter').tablesorter();
```

Configuration options: add `<th data-tablesorter="false">` to table header to disable sorting for that column.

Triggers `tablesorter-sorted` event on table when sorting is finished.

## Pager: pager.js + pager.css

The pager is 1.7 kbytes when minified.

Usage:

```js
$('.tablepager').tablepager();
```

Configuration options:

  - If a row is hidden when the widget is initialized, itt will be hidden later as well.

  - `<table data-pager-id="something">`: put the widget in the DOM element with id given,
    instead of putting it above the table.

  - `<table data-pager-template-id="something">` read HTML template for pager from an element. Can be a `<script type="text/html">` as well.

Events:
  - Listens on `tablesorter-sorted` to see if the order of rows is changed. It works with the sorter.
  - Listens on `tablepager-elements` to see when the visibility or number of rows has changed.
