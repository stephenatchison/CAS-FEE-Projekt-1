import {View} from "./shared/view.js";

export class AppView extends View {
    constructor() {
        super("appView", false);

        this.themeChanged = null;

        this.__body = document.body;
        this.__themeSelect = document.getElementById('theme');

        this.__themes = [
            { displayName: 'Hell', className: 'hell' },
            { displayName: 'Dunkel', className: 'dunkel' }
        ];

        this.__initThemeSelect();
    }

    setTheme(name) {
        for(let theme of this.__themes) {
            this.__body.classList.remove(theme.className);
        }
        this.__body.classList.add(name);

        if (this.__themeSelect != null) {
            this.__themeSelect.value = name;
        }
    };

    __notifyThemeChanged(name) {
        if (this.themeChanged != null) {
            this.themeChanged(name);
        }
    }

    __initThemeSelect() {
        // setup theme selectbox
        let html = '';
        for(let theme of this.__themes) {
            html += '<option value="'+ theme.className +'">' + theme.displayName + '</option>';
        }
        this.__themeSelect.innerHTML = html;

        // hook theme change event
        this.__themeSelect.addEventListener('change', e => {
            this.__notifyThemeChanged(e.target.value);
        });
    }
}