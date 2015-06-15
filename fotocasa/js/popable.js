var popable = (function () {
    var self = {};
    var doc = $(document);
    var win = $(window);
    var wrapper = $("#panel-wrapper");

    self.getLayout = function (el) {
        var offset = el.offset();
        var width = el.outerWidth();
        var height = el.outerHeight();
        var top = offset.top;
        var left = offset.left;

        return {
            width: width,
            height: height,
            top: top,
            right: left + width,
            bottom: top + height,
            left: left
        }
    };

    self.isOpen = function (id) {
        var ownerId = self.getOwnerId(id);
        var cssClasses = self.getComponentCssClasses(ownerId);
        return $("#" + id).hasClass(cssClasses.active);
    };

    self.getOwnerId = function (id) {
        return $("[aria-owns=" + id + "]").attr("id");
    };

    self.getOwnerDataWidget = function (id) {
        return $("#" + id).attr("data-widget");

    };

    self.open = function (id) {
        var ownerId = self.getOwnerId(id);
        var ownerWidget = self.getOwnerDataWidget(id);
        var cssClasses = self.getComponentCssClasses(ownerId);

        $("#" + ownerId).addClass(cssClasses.ownerActive);
        $("#" + id).addClass(cssClasses.active);

        switch (ownerWidget) {
            case "panel":
                $("html").addClass("has-active-panels");
                break;
            case "panel-collapsable":
                $("html").addClass("has-active-collapsable");
                break
        }

    };

    self.close = function (id) {
        var ownerId = self.getOwnerId(id);
        var cssClasses = self.getComponentCssClasses(ownerId);

        $("#" + ownerId).removeClass(cssClasses.ownerActive);
        $("#" + id).removeClass(cssClasses.active).removeClass(cssClasses.superior).removeClass(cssClasses.inferior);
        $("html").removeClass("has-active-panels").removeClass("has-active-collapsable");
    };

    self.movePanelToWrapper = function (id) {
        var panel = $("#" + id);
        wrapper.append(panel);
    };

    self.toggle = function (id) {
        self.isOpen(id) ? self.close(id) : self.open(id);
    };

    self.position = function (id, coords) {
        $("#" + id).css({
            left: coords.x,
            top: coords.y
        });
    };

    self.setMinWidth = function (panelId, width) {
        if (width <= win.width()) {
            $("#" + panelId).css("min-width", width);
        }
    };

    self.getOwnerComponentType = function (id) {
        return $("#" + id).data("panel") || "";
    };

    self.getComponentCssClasses = function (id) {
        var componentType = self.getOwnerComponentType(id);

        if (componentType !== "") {
            componentType = componentType + "_";
        }

        return {
            active: componentType + "panel--active",
            superior: componentType + "panel--superior",
            inferior: componentType + "panel--inferior",
            anterior: componentType + "panel--anterior",
            posterior: componentType + "panel--posterior",
            center: componentType + "panel--center",
            ownerActive: "is-active"
        };
    };

    // @todo method does too much
    self.determineBestPanelPosition = function (panelOwnerEl, panelEl) {
        var position = {};
        var ownerLayout = self.getLayout(panelOwnerEl);
        var panelLayout = self.getLayout(panelEl);

        var exceedsRightBoundary = (ownerLayout.left + ownerLayout.width / 2 + panelLayout.width / 2) > win.width();
        var exceedsLeftBoundary = (ownerLayout.left + ownerLayout.width / 2 - panelLayout.width / 2) < 0;
        var exceedsBottomBoundary = (ownerLayout.bottom + panelLayout.height) > win.height() + doc.scrollTop();
        var exceedsTopBoundary = (ownerLayout.top - panelLayout.height) < doc.scrollTop();

        var cssClasses = self.getComponentCssClasses(panelOwnerEl[0].id);

        if (exceedsRightBoundary) {
            position.x = ownerLayout.right - panelLayout.width;
            panelEl.addClass(cssClasses.posterior).removeClass(cssClasses.anterior).removeClass(cssClasses.center);
        } else if (exceedsLeftBoundary) {
            position.x = ownerLayout.left;
            panelEl.addClass(cssClasses.anterior).removeClass(cssClasses.posterior).removeClass(cssClasses.center);
        } else {
            position.x = ownerLayout.left + ownerLayout.width / 2 - panelLayout.width / 2;
            panelEl.addClass(cssClasses.center).removeClass(cssClasses.posterior).removeClass(cssClasses.anterior);
        }

        if (exceedsBottomBoundary && !exceedsTopBoundary) {
            position.y = ownerLayout.top - panelLayout.height;
            panelEl.addClass(cssClasses.superior).removeClass(cssClasses.inferior);
        } else {
            position.y = ownerLayout.bottom;
            panelEl.addClass(cssClasses.inferior).removeClass(cssClasses.superior);
        }

        return position;
    };

    return self;
}());