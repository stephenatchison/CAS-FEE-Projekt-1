window.noteApp.routerService = new (function(app) {
    var that = this;
    var _baseUri = document.baseURI.toLowerCase();
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
            history.replaceState({}, 'noteApp - ' + controllerName, path);
            app.setActiveController(controllerName);
        }
    };

    this.navigateTo = function(path, addToHistory) {
        let controllerName = findControllerForPath(path);
        if (controllerName != null) {
            if (addToHistory) {
                history.pushState({ noteApp: true }, 'noteApp - ' + controllerName, path);
            }
            app.setActiveController(controllerName);
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
    window.addEventListener('popstate', function(e) {
        if (e.state !== null) {
            that.navigateTo(document.location.href, false);
        }
    });
})(window.noteApp);