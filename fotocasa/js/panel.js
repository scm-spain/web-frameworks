REALESTATE.modules.panel = (function () {

    var self = {};
    var doc = $(document);
    var win = $(window);
    var wrapper = null;
    var hasHoverBehavior = false;

    var setHasHoverBehavior = function (e) {
        var target = e.target;
        if ($(target).parents("[data-hoverbehavior]").length === 1) {
            hasHoverBehavior = true;
        }
        else {
            hasHoverBehavior = false;
        }
    };

    var handleDocumentClick = function (e) {
        var target = e.target;
        if ($(target).parents("#panel-wrapper").length <= 0) {
            self.closeCollapsableAll();
        }

        setHasHoverBehavior(e);

        if (panelToClose(e)) {  
            self.closeAll();
        }
    };

    var handlePanelOwnerClick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setHasHoverBehavior(e);

        var panelOwner = $(e.currentTarget);
        var panelOwnerWidth = panelOwner[0].getBoundingClientRect().width;
        var panelId = panelOwner.attr("aria-owns");
        var panel = $("#" + panelId);

        if (!panel.parent().is(wrapper)) {
            self.movePanelToWrapper(panelId);
        }

        self.setMinWidth(panelId, panelOwnerWidth);
        self.position(panelId, self.determineBestPanelPosition(panelOwner, panel));
        self.closeAllButSelf(panelId);
        self.toggle(panelId);
    };

    var handleCollapsableOwnerClick = function (e) {
        e.preventDefault();
        e.stopPropagation();

        var collapsableOwner = $(this);
        var collapsableWidth = collapsableOwner[0].getBoundingClientRect().width;
        var collapsableId = collapsableOwner.attr("aria-owns");
        var collapsable = $("#" + collapsableId);

        if (!collapsable.parent().is(wrapper)) {
            self.movePanelToWrapper(collapsableId);
        }

        self.setMinWidth(collapsableId, collapsableWidth);
        self.position(collapsableId, self.determineBestPanelPosition(collapsableOwner, collapsable));
        self.closeCollapsableAllButSelf(collapsableId);
        self.toggle(collapsableId);
    };

    var handleWindowResize = function (e) {
        self.closeAll();
    };

    var isWindowMobile = function (e) {
        if ($(window).width() < 650) {
            return true;
        }
        else {
            return false;
        }
    };

    var panelToClose = function (e) {
        if (isWindowMobile(e)) {
            return true;
        }
        else {
            if (!hasHoverBehavior) {
                return true
            }
            else {
                return false;
            }
        }        
    };

    //var handleDocumentClick = function (e) {
    //    setHasHoverBehavior(e);
    //    if (panelToClose(e)) {  
    //        self.closeAll();
    //    }
    //};
    

    self.handlePanelOwnerHover = function (e) {
        handlePanelOwnerClick(e);
    };
    
    self.handlePanelOwnerLeave = function (e) {
        self.closeAll();
    };

    self.init = function () {
        var wrapperId = "panel-wrapper";

        wrapper = $("#" + wrapperId).length === 0
                ? $("<div id='" + wrapperId + "'><div class='panel-overlay'></div></div>")
                : $("#" + wrapperId);

        wrapper.append($("[data-widget=panel]"));
        $("body").append(wrapper);

        this.bindEvents();
    };

    self.movePanelToWrapper = popable.movePanelToWrapper;

    self.getLayout = popable.getLayout;

    self.isOpen = popable.isOpen;

    self.getOwnerId = popable.getOwnerId;

    self.getOwnerDataWidget = popable.getOwnerDataWidget;

    self.open = popable.open;

    self.close = popable.close;

    self.closeCollapsableAll = function () {
        $("[data-widget=panel-collapsable]").each(function () {
            var id = $(this)[0].id;
            self.close(id);
        });
    };

    self.closeCollapsableAllButSelf = function (id) {
        $("[data-widget=panel-collapsable]").not("#" + id).each(function () {
            var id = $(this)[0].id;
            self.close(id);
            self.closeAll();
        });
    };

    self.closeAll = function () {
        $("[data-widget=panel]").each(function () {
            var id = $(this)[0].id;
            self.close(id);
        });
    };

    self.closeAllButSelf = function (id) {
        $("[data-widget=panel]").not("#" + id).each(function () {
            var id = $(this)[0].id;
            self.close(id);
        });
    };

    self.toggle = popable.toggle;

    self.position = popable.position;

    self.setMinWidth = popable.setMinWidth;

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
        if (hasHoverBehavior) {
            ownerLayout.bottom = ownerLayout.bottom + 9;
        }

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

    self.bindEvents = function () {
        doc.on("click", "[data-widget=collapsable]", handleCollapsableOwnerClick);
        doc.on("click", "[aria-haspopup=true][data-haspopup=true]", handlePanelOwnerClick);
        doc.on("click", handleDocumentClick);
        win.on("resize", handleWindowResize);
    };

    return self;
}());