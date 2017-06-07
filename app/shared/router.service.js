window.noteApp.routerService = new (function(app) {
    var _app = app;

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
    //_app.window().addEventListener('popstate', e => {

    //})
})(window.noteApp);