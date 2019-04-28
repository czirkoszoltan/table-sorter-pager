/**
 * Add pager widget to table.
 * 
 * Usage: $(selector).tablepager();
 * 
 * Configuration:
 *   - If a row is hidden when the widget is initialized, itt will be hidden later as well.
 *   - <table data-pager-id="something"> put the widget in the DOM element with id given,
 *     instead of putting it above the table.
 *   - <table data-pager-template-id="something"> read HTML template for pager from an element.
 *     Can be a <script type="text/html"> as well.
 * 
 * Events:
 *   - Listens on 'tablesorter-sorted' to see if the order of rows is changed.
 *   - Trigger 'tablepager-elements' to tell the pager that the visibility or number of rows has changed.
 * 
 * Can only work with one table body.
 */
$.fn.tablepager = function() {
    function the_pager() {
        var table = this;
        var tbody = table.tBodies[0];
        var $pager;
        var count;
        var pagesize;
        var numpages;
        var page;
        
        /* Get the table rows that are to be paged.
         * The class .tablepager-initallyhidden is added to rows during initialization. */
        function rows() {
            var $rows = $(tbody).find('tr:not(.tablepager-initiallyhidden)');
            return $rows;
        }

        /* Sets the visibility of rows.
         * Hidden rows will be hidden by adding the clas .tablepager-hide. */
        function set_visibility() {
            var $rows = rows();
            var min = (page - 1) * pagesize;
            var max = page * pagesize;
            $rows.each(function(idx) {
                if (idx >= min && idx < max)
                    $(this).removeClass('tablepager-hide');
                else
                    $(this).addClass('tablepager-hide');
            });
        }

        /* Jump to new page. */
        function set_page(newpage) {
            page = newpage;
            if (page < 1) page = 1;
            if (page > numpages) page = numpages;
            $pager.find('.tablepager-display').val(page + "/" + numpages);
            set_visibility();
        }
        
        /* Recalculate number of elements. */
        function set_elements() {
            count = rows().length;
            numpages = Math.ceil(count / pagesize) || 1;
            set_page(page); /* Recalculate page number limits and visibility. */
        }
        
        /* Sets page size. */
        function set_pagesize(newpagesize) {
            var currpos = ((page || 1) - 1) * (pagesize || 1);
            pagesize = newpagesize;
            numpages = Math.ceil(count / pagesize) || 1;
            set_page(Math.floor(currpos / pagesize) + 1); /* Try to jump to the page so the same elements are shown. */
        }
        
        /* Creates pager widget from HTML template, adds event handlers. */
        function create_pager() {
            var pagerhtml = 
                '<div class="tablepager-pager">'+
                '<button type="button" class="tablepager-first"></button>'+
                '<button type="button" class="tablepager-prev"></button>'+
                '<input type="text" class="tablepager-display" readonly>'+
                '<button type="button" class="tablepager-next"></button>'+
                '<button type="button" class="tablepager-last"></button>'+
                '<select class="tablepager-pagesize">'+
                '<option selected value="10">×10</option>'+
                '<option value="20">×20</option>'+
                '<option value="50">×50</option>'+
                '<option value="999999">All</option>'+
                '</select>'+
                '</div>';
            var templateid = $(table).attr('data-pager-template-id') || "";
            if (templateid != "")
                $pager = $($('#' + templateid).html());
            else
                $pager = $(pagerhtml);
            var containerid = $(table).attr('data-pager-id') || "";
            if (containerid != "")
                $pager.appendTo($('#' + containerid));
            else
                $pager.insertBefore(table);

            $pager.find('.tablepager-first').on('click', function() { set_page(1); });
            $pager.find('.tablepager-prev').on('click', function() { set_page(page - 1); });
            $pager.find('.tablepager-next').on('click', function() { set_page(page + 1); });
            $pager.find('.tablepager-last').on('click', function() { set_page(numpages); });
            $pager.find('.tablepager-pagesize').on('change', function() { set_pagesize(+this.value || 10); });
            $(table).on('tablesorter-sorted', set_visibility);
            $(table).on('tablepager-elements', set_elements);
        }
        
        /* Initializes pager. */
        function initialize_pager() {
            $(tbody).find('tr:not(:visible)').addClass('tablepager-initiallyhidden');
            count = rows().length;
            set_pagesize(+$pager.find('.tablepager-pagesize').val() || 10);
        }
        
        /* inicializálás */
        create_pager();
        initialize_pager();
    }
    
    return this.each(the_pager);
};
