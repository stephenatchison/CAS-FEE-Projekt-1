window.noteApp = (function App(w) {
    var that = this;
    var window = w;

    this.baseController = {};
    this.baseController.prototype.app = this;
    this.baseController.prototype.compileTemplate = function(name) {
        var elem = this.app.document.getElementById(name);
        if (elem === null) {
            throw 'Element with the Id "' + name + '" could not be found!';
        }

        return Handlebars.compileTemplate(elem.innerHTML);
    };

    this.controllers = {};
    this.addController = function (name, constructor) {
        var entry = { constructor: constructor, controller: null };
        entry.constructor.prototype = Object.create(this.baseController.prototype);
        entry.constructor.prototype.constructor = entry.constructor;

        that.controllers[name] = entry;
    };
    this.getController = function (name) {
        if (that.controllers.hasOwnProperty(name)) {
            var entry = that.controllers[name];
            if (entry.controller === null) {
                entry.controller = entry.constructor(window.document);
            }
        } else {
            throw 'A controller with the name "' + name + '" has not been registerd!';
        }
    };
})(window);