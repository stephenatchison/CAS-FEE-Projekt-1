window.noteApp.routerService = new (function(app) {
    var that = this;
    var _app = app;
    var _baseUri = app.document().baseUri;
    var _history = _app.window().history;
    var _routes = [];

    this.addRoute = function(path, controllerName) {
        _routes.push( {path: path.toLowerCase(), controllerName: controllerName} );
    }

    this.navigateTo = function(path) {
        let lowerCasePath = path.toLowerCase();
        let route = _routes.find(function(r) {
            return lowerCasePath.startsWith(r.path);
        });

        if (route != null) {
            _history.pushState({ noteApp: true }, 'noteApp - ' + route.controllerName, path);
            _app.setActiveController(route.controllerName);
        }
    };

    // capture clicks in links
    $('a').on('click', function(e) {
        let href = $(e.target).attr('href');
        if (!(href.startsWith('http://') || href.startsWith('https://')) && (!href.startsWith(_window.document.baseUri))) {
            e.preventDefault();
            let path;
            if (href.startsWith(_window.document.baseUri)) {
                path = href.substr(_windows.document.baseUri);
            } else {
                path = href;
            }
            that.navigateTo(path);
        }
    });

    // capture "history navigation"
    _app.window().addEventListener('popstate', function(e) {
        if (e.state !== null) {
            that.navigateTo(_app.document().location.pathname);
        }
    });
})(window.noteApp);