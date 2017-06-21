import {EditNoteController} from "../editNote/editNoteController";
import {MainController} from "../main/mainController";

export class RouterService {
    constructor() {
        this.__baseUri = document.baseURI.toLowerCase();
        this.__routes = [];
        this.__activeController = null;
        this.__initialising = false;
    }

    init(app, path) {
        // signal service is initialising
        this.__initialising = true;

        this.__addRoute('', new MainController(app));
        this.__addRoute("editNote", new EditNoteController(app));

        // capture clicks in links
        $(document).on('click', 'a', e => {
            let href = $(e.target).attr('href');
            if (!(href.startsWith('http://') || href.startsWith('https://')) && (!href.startsWith(window.document.baseUri))) {
                e.preventDefault();
                let path;
                if (href.startsWith(window.document.baseUri)) {
                    path = href.substr(window.document.baseUri);
                } else {
                    path = href;
                }
                this.navigateTo(path, true);
            }
        });

        // capture "history navigation"
        window.addEventListener('popstate', e => {
            if (e.state !== null) {
                this.navigateTo(document.location.href, false);
            }
        });

        // set initial controller
        this.navigateTo(path, true);

        // signal initialising ended
        this.__initialising = false;
    }

    navigateTo(path, addToHistory) {
        let controller = this.__findControllerForPath(path);
        if (controller != null) {
            if (addToHistory) {
                if (this.__initialising) {
                    history.replaceState({ noteApp: true }, 'noteApp - ' + controller.name, path);
                } else {
                    history.pushState({ noteApp: true }, 'noteApp - ' + controller.name, path);
                }
            }
            this.__setActiveController(controller);
        }
    };

    __setActiveController(controller) {
        if (this.__activeController != null) {
            this.__activeController.deactivate();
        }

        this.__activeController = controller;

        if (this.__activeController != null) {
            this.__activeController.activate();
        }
    }

    __findControllerForPath(path) {
        let lowerCasePath = path.toLowerCase();
        if (lowerCasePath.startsWith(this.__baseUri)) {
            lowerCasePath = lowerCasePath.substr(this.__baseUri.length);
        }
        let route = this.__routes.find(r => (r.path.length > 0) ? lowerCasePath.startsWith(r.path) : lowerCasePath === r.path);
        
        return (route === null) ? null : route.controller;
    }

    __addRoute(path, controller) {
        this.__routes.push( {path: path.toLowerCase(), controller: controller} );
    }
}