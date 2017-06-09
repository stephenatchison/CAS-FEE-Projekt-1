window.noteApp = new (function App(w) {

    // active controller
    var _activeController = null;

    function activateController(controller) {
        if (_activeController != null) {
            _activeController.deactivate();
        }

        _activeController = controller;

        if (_activeController != null) {
            _activeController.activate();
        }
    }

    var _that = this;
    var _window = w;
    var _document = w.document;
    var $ = w.$;
    var _appController;

    this.window = function(){
        return _window;
    };

    this.document = function(){
        return _document;
    };

    this.run = function() {
        // build routing table
        for(let name in _controllers) {
            let controller = _controllers[name];
            if (controller.path != null) {
                this.routerService.addRoute(controller.path, name);
            }
        }

        _appController = this.getController('app');
        _appController.activate();

        this.routerService.setInitialController('main');
    };

    this.setActiveController = function(name) {
        activateController(this.getController(name));
    }

    // Controllers, Views, HtmlGenerators
    _baseObject = {};
    _baseObject.app = this;
    _baseObject.$ = _window.$;

    _baseController = Object.create(_baseObject);
    _baseController.activate = function() {
        if (typeof(this.afterActivating) === 'function') {
            this.afterActivating();
        }
    };
    _baseController.deactivate = function() {
        if (typeof(this.beforeDeactivating) === 'function') {
            this.beforeDeactivating();
        }
    };

    var _controllers = {};
    this.addController = function (name, path, ctrlConstructor) {
        if (!_controllers.hasOwnProperty(name)) {
            ctrlConstructor.prototype = _baseController;
            ctrlConstructor.prototype.constructor = ctrlConstructor;
            var entry = { factory: ctrlConstructor, controller: null, path: path };

            _controllers[name] = entry;
        } else {
            throw 'A controller with the name ' + name + ' has already been registerd!';
        }
    };
    this.getController = function (name) {
        if (_controllers.hasOwnProperty(name)) {
            var entry = _controllers[name];
            if (entry.controller === null) {
                entry.controller = new entry.factory();
            }
            return entry.controller;
        } else {
            throw 'A controller with the name "' + name + '" has not been registerd!';
        }
    };


    _baseView = Object.create(_baseObject);
    _baseView.targetElement = (function(document) {
        let elems = _window.document.getElementsByTagName('main');
        if (elems.length === 0) {
            throw 'No MAIN tag found!';
        }
        return elems[0];
    })(_window.document);
    _baseView.render = function(data) {
        if (typeof(this.beforeRendering) === 'function') {
            this.beforeRendering(this.targetElement);
        }
        this.targetElement.innerHTML = (this.app.getHtmlGenerator(this.viewName))(data);
        if (typeof(this.afterRendering) === 'function') {
            this.afterRendering(this.targetElement);
        }
    };
    _baseView.destroy = function() {
        if (typeof(this.onDestroy) === 'function') {
            this.onDestroy();
        }
    }

    var _views = {};
    this.addView = function(name, viewConstructor) {
        if (!_views.hasOwnProperty(name)) {
            viewConstructor.prototype = _baseView;
            viewConstructor.prototype.constructor = viewConstructor;
            var entry = { factory: viewConstructor };
            _views[name] = entry;
        } else {
            throw 'A view with the name ' + name + ' has already been registered!';
        }
    };
    this.getView = function(name) {
        if (_views.hasOwnProperty(name)) {
            var entry = _views[name];
            return new entry.factory();
        } else {
            throw 'A view the name ' + name + ' has not been registered!';
        }
    }

    var _htmlGenerators = {};
    this.getHtmlGenerator = function(name) {
        if (!_htmlGenerators.hasOwnProperty(name)) {
            let templateElem = _window.document.getElementById(name);
            if (templateElem) {
                _htmlGenerators[name] = _window.Handlebars.compile(templateElem.textContent);
            } else {
                throw 'A template the name ' + name + ' could not be found in the document!';
            }
        }
        return _htmlGenerators[name];
    };
})(window);

//start the application
$().ready(e => window.noteApp.run());
