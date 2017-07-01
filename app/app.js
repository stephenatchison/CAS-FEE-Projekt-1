import {AppController} from "./appController";
import {ConfigService} from "./shared/configService";
import {NoteService} from "./shared/noteService";
import {NoteRESTClientService} from "./shared/noteRESTClientService";
import {RouterService} from "./shared/routerService";

import '../styles/layout.css';
import '../styles/hell.css';
import '../styles/dunkel.css';

export class NoteApp {
    constructor() {
        this.__configService = null;
        this.__noteService= null;
        this.__routerService = null;

        this.__appController = null;
    }

    get configService() { return this.__configService; }
    get noteService() { return this.__noteService; }
    get routerService() { return this.__routerService; }

    run() {
        // initialise services
        this.__configService = new ConfigService();
        this.__noteService = new NoteRESTClientService(location.origin + '/');
//        this.__noteService = new NoteService();
        this.__routerService = new RouterService();

        // initialise app view
        this.__appController = new AppController(this);
        this.__appController.activate();

        // start the router
        this.routerService.init(this, document.location.href);
    }
}

//start the application as soon as the document is ready
$().ready(e => {
    moment().locale('de-ch');

    let noteApp = new NoteApp();
    noteApp.run();
});
