import {AppView} from "./appView";
import {Controller} from "./shared/controller";

export class AppController extends Controller {
    constructor(app) {
        super(app, "app", AppView)
    }

    initView(view) {
        view.themeChanged = name => {
            view.setTheme(name);
        };

        view.setTheme('hell');
    }
}