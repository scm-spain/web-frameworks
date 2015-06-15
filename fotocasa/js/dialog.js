REALESTATE.modules.dialog = {

    _dialog: null,
    init: function () {
        _dialog = this;

        if ($('[data-module=dialog]').length <= 0) return this;

        $(document).on("click", '[data-dialog="inducer"]', function (e) {

            e.preventDefault();

            if (!($(this).data("manual") && $(this).data("manual") == true)) {

                var dialogId = $(this).data("target");

                //for multiples dialogs in the same view
                $('.dialog').removeClass("o-dialog--is-active");

                _dialog.open(dialogId);
                _dialog.center(dialogId);
                _dialog.showOverlay();
            }
        });

        $(document).on("click", '[data-dialog="close"], [data-dialog="overlay"]', function (e) {
            e.preventDefault();

            var dialogId = $(".o-dialog--is-active")[0].id;
            _dialog.close(dialogId);
            _dialog.hideOverlay();
        });

        return _dialog;
    },

    openManual: function (dialogId) {
        //for multiples dialogs in the same view
        $('.dialog').removeClass("o-dialog--is-active");
        _dialog.open(dialogId);
        _dialog.center(dialogId);
        _dialog.showOverlay();
    },

    open: function (dialogId) {
        $("#" + dialogId).addClass("o-dialog--is-active");
    },

    close: function (dialogId) {
        $("#" + dialogId).removeClass("o-dialog--is-active");
    },

    center: function (dialogId) {
        var el = $("#" + dialogId);
        var browserWindow = $(window);
        var browserHeight = browserWindow.height();
        var modalHeight = el.outerHeight();
        var shadowWidth = 20;

        el.css({
            'left': (browserWindow.width() / 2) - (el.outerWidth() / 2) - shadowWidth,
            'top': (browserHeight / 2) - (modalHeight / 2) + browserWindow.scrollTop()
        });

        if (modalHeight > browserHeight) {
            el.css("top", browserWindow.scrollTop() + 100);
        }
    },

    showOverlay: function () {
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();

        $("[data-dialog=overlay]").addClass("o-dialog-overlay--is-active");
    },

    hideOverlay: function () {
        $("[data-dialog=overlay]").removeClass("o-dialog-overlay--is-active");
    }

};
