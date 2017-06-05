window.noteApp.addController('app', function(){
    var _view = this.app.getView('app');
    _view.themeChanged = name => {
        _view.setTheme(name);
    };

    _view.setTheme('hell');
});
