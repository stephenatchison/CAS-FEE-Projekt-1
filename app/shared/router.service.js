window.noteApp.routerService = new (function(app) {
    var that = this;
    var _app = app;
    var _baseUri = app.document().baseURI.toLowerCase();
    var _history = _app.window().history;
    var _routes = [];

    function findControllerForPath(path) {
        let lowerCasePath = path.toLowerCase();
        if (lowerCasePath.startsWith(_baseUri)) {
            lowerCasePath = lowerCasePath.substr(_baseUri.length);
        }
        let route = _routes.find(r => lowerCasePath.startsWith(r.path));
        
        return (route === null) ? null : route.controllerName;
    }

    this.addRoute = function(path, controllerName) {
        _routes.push( {path: path.toLowerCase(), controllerName: controllerName} );
    }

    this.setInitialController = function(path) {
        let controllerName = findControllerForPath(path);
        if (controllerName != null) {
            _history.replaceState({}, 'noteApp - ' + controllerName, path);
            _app.setActiveController(controllerName);
        }
    };

    this.navigateTo = function(path, addToHistory) {
        let controllerName = findControllerForPath(path);
        if (controllerName != null) {
            if (addToHistory) {
                _history.pushState({ noteApp: true }, 'noteApp - ' + controllerName, path);
            }
            _app.setActiveController(controllerName);
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
            that.navigateTo(path, true);
        }
    });

    // capture "history navigation"
    _app.window().addEventListener('popstate', function(e) {
        console.log(e);
        console.log(e.state);
        console.log(_app.window().location);
        console.log(_app.document().location);
        if (e.state !== null) {
            that.navigateTo(_app.document().location.href, false);
        }
    });
})(window.noteApp);