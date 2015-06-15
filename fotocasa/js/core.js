var REALESTATE = {
    init: function () {
        var _self = this;
        var _modules = _self.modules;
        var _views = _self.views;

        if (_views) {
            this._initEach(_views);
        }

        if (_modules) {
            this._initEach(_modules);
        }
    },

    _initEach: function (list) {
        for (var item in list) {
            if (list[item].init) {
                list[item].init();
            }
        }
    },

    modules: {},
    views: {}
};

(function () {
    //Bindea los enlaces con querystring como attributo
    $('a[qs]').bind("click", function () {
        var qs = '';
        var link = $(this);

        if (link.attr('qs') != null) {
            qs = link.attr('qs');
        }

        if (qs.indexOf("?") < 0 && link.attr('href').indexOf('?') < 0) {
            qs = '?' + qs;
        }

        REALESTATE.utils.AutoClick(link.attr('href') + qs);
    });
}());

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};