window.noteApp = new (function App(w) {

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
    var $ = w.$;
    var _appController;

    this.window = function(){
        return _window;
    };

    this.run = function() {
        _appController = this.getController('app');
        _appController.activate();

        activateController(this.getController('main'));
    };

    // Routing
    var _activeController = null;

    // capture clicks in links
    $('a').on('click', e => {
        let href = $(e.target).attr('href');
        if (!(href.startsWith('http://') || href.startsWith('https://')) && (!href.startsWith(_window.document.baseUri))) {
            e.preventDefault();
            let path;
            if (href.startsWith(_window.document.baseUri)) {
                path = href.substr(_windows.document.baseUri);
            } else {
                path = href;
            }
            this.navigateTo(path);
        }
    });

    // capture "history navigation"
    $(_window).on('popstate', e => {

    });

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
    this.addController = function (name, ctrlConstructor) {
        if (!_controllers.hasOwnProperty(name)) {
            ctrlConstructor.prototype = _baseController;
            ctrlConstructor.prototype.constructor = ctrlConstructor;
            var entry = { factory: ctrlConstructor, controller: null };

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
$(function() {
    window.noteApp.run();
});
