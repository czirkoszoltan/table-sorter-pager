/**
 * Table sorter plugin. Works with numeric and string content (auto-detected). Use with:
 *
 *  $(".tablesorter").tablesorter();
 *
 * Configuration options: add <th data-tablesorter="false"> to table header
 * to disable sorting for that column.
 *
 * Triggers 'tablesorter-sorted' event on table when sorting is finished.
 */
$.fn.tablesorter = function() {
    function the_sorter() {
        var table = this;

        /* Sort all table bodies of the table. */
        function sort(columnidx, colspan, descending) {

            /* Gets a table row, and determines the sort text.
             * Takes the column index and column span into consideration. */
            function gettext(row) {
                var text = "";
                for (var i = columnidx; i < columnidx + colspan; ++i) {
                    var cell = row.cells[i];
                    if (cell)
                        text += cell.textContent;
                }
                return text.trim();
            }

            /* Comparator function for two table rows. 
             * Empty strings compare as "small". If both strings contain
             * numbers, they are sorted as numbers. Otherwise localeCompare is used. */
            function cmp(rowtext1, rowtext2) {
                var str1 = rowtext1.text, str2 = rowtext2.text;
                if (str1 == "")
                    return +1;
                if (str2 == "")
                    return -1;
                var num1 = +str1, num2 = +str2;
                var res = isNaN(num1) || isNaN(num2) ? str1.localeCompare(str2) : num1 - num2;
                return descending ? -res : res;
            }

            /* Sort all table bodies. Determine the text for the table rows only
             * once before sorting, create a {row, text} object for each row. */
            $.each(table.tBodies, function() {
                var $tbody = $(this);
                var rowstexts = $.map($tbody.find('tr'), function(tr) {
                    return { 'tr': tr, 'text': gettext(tr) };
                });
                rowstexts.sort(cmp);
                var rows = $.map(rowstexts, function(rowtext) {
                    return rowtext.tr;
                });
                $(rows).appendTo($tbody);
            });
        }

        /* Handle click on a table column.
         * Arguments: columidx is the logical column index calculated by activate(),
         * and colspan is its column span to determine the text to be sorted in each
         * table cell. */
        function th_click(columnidx, colspan) {
            var $th = $(this);

            /* If this was the sorted column, with ascending sort, now switch to descending.
             * All other columns become unsorted, and this one becomes sorted. */
            var descending = $th.hasClass('tablesorter-asc');
            $th.siblings('.tablesorter-header').removeClass('tablesorter-asc tablesorter-desc').addClass('tablesorter-unsorted');
            $th.removeClass('tablesorter-unsorted tablesorter-asc tablesorter-desc').addClass(descending ? 'tablesorter-desc' : 'tablesorter-asc');

            /* Wait a while, until the UI uodates, then do the sort. */
            $th.addClass('tablesorter-sorting');
            setTimeout(function() {
                sort(columnidx, colspan, descending);
                $th.removeClass('tablesorter-sorting');
                $(table).trigger('tablesorter-sorted');
            }, 50);
        }

        /* Add click handlers to table headers, which will do the sorting.
         * Also, calculate the column index of the headers, as it might not be equal to the
         * index of the element in the DOM tree. If a header has a colspan greater than 1,
         * it counts as multiple columns. This index is used to determine the column index when the
         * header is clicked, eg.
         *   <thead>
         *     <th>  <th colspan="3">  <th id="this-is-clicked">
         *   <tbody>
         *     <td>  <td> <td> <td>    <td id="this-is-sorted">
         */
        function activate() {
            var columnidx = 0;
            $.each(table.tHead.rows[0].cells, function() {
                var $th = $(this);
                var colspan = +$th.attr('colspan') || 1;
                if ($th.attr('data-tablesorter') != 'false') {
                    $th.attr('tabindex', 0);
                    $th.addClass('tablesorter-header tablesorter-unsorted');
                    $th.on('click', th_click.bind(this, columnidx, colspan));
                }
                columnidx += colspan;
            });
            $(table.tBodies).attr('aria-live', 'polite');
        }

        activate();
    }

    return this.each(the_sorter);
}
