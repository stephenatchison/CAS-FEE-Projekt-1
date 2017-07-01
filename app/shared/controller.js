export class Controller {
    constructor(app, name, viewFactory) {
        this.__app = app;

        this.__name = name;
        this.__config = null;

        this.__view = new viewFactory();
        this.initView(this.__view);
    }

    get configService() { return this.__app.configService; }
    get noteService() { return this.__app.noteService; }
    get routerService() { return this.__app.routerService; }

    get name() { return this.__name; }
    get config() { return this.__config; }
    get view() { return this.__view; }

    activate() {
        this.__loadConfig();
    };

    deactivate() {
        this.__saveConfig();
        this.__view.deactivate();
    };

    initView(view) { }

    navigateTo(path, addToHistory) {
        this.routerService.navigateTo(path, addToHistory);
    }

    __loadConfig() {
        let config = this.configService.load(this.name);

        config.showCompleted = config.showCompleted || false;
        config.sortOrder = config.sortOrder || 1;

        this.__config = config;
    }

    __saveConfig() {
        this.configService.save(this.name, this.__config);
    }
}