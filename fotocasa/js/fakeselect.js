REALESTATE.modules.fakeselect = (function () {

    var handleClick = function (e) {
        var el = $(e.currentTarget);
        updateText(el);
    };
    
    // safari for windows does not update the changed text
    var triggerWebkitRepaint = function (el) {
        if (typeof(el) != 'undefined')
        {
            el.style.display = 'none';
            el.offsetHeight;
            el.style.display = 'block';
        }
    };

    var updateText = function (el) {
        var switchList = el.closest("[data-select=list]");
        var labelText = el.closest("label").text();
        var target = $("[data-select-list='" + switchList.attr("id") + "']");
        target.text(labelText);
        triggerWebkitRepaint(target[0]);
    };

    var updateAllSelects = function () {
        $("[data-select=list]").each(function () {
            var checkedEl = $(this).find(":radio:checked");
            updateText(checkedEl);
        });
    };

    self.init = function () {
        self.bindEvents();
        updateAllSelects();
    };

    self.bindEvents = function () {
        $(document).on("change", "[data-select=list] :radio", handleClick);
    };

    return self;
}());