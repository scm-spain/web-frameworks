REALESTATE.modules.switchlist = (function () {
    var switchSelector = "[data-component=switchlist] :radio, [data-component=switchlist] :checkbox";

    var init = function () {
        if ($(switchSelector).length) {
            bindEvents();
            selectSwitches(switchSelector);
        }
    };

    var handleChange = function (e) {
        var name = e.currentTarget.name;
        var switchesSelector = "[name='" + name + "']";
        selectSwitches(switchesSelector);
    };

    var bindEvents = function () {
        $(document).on("change", switchSelector, handleChange);
    };

    var selectSwitches = function (switches) {
        $(switches).each(function () {
            var self = $(this);
            var li = self.closest("li");

            self.prop("checked") ? li.addClass("selected") : li.removeClass("selected");
        });
    };

    return {
        init: init
    }
}());