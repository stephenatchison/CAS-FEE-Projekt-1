export class ConfigService {
    constructor() {
        this.__idPrefix = "config_";
    }

    load(name) {
        let strJson = localStorage.getItem(this.__getId(name));
        return (strJson != null) ? JSON.parse(strJson) : {};
    }

    save(name, config) {
        if (config != null) {
            localStorage.setItem(this.__getId(name), JSON.stringify(config));
        } else {
            localStorage.removeItem(this.__getId(name));
        }
    }

    __getId(name) {
        return this.__idPrefix + name;
    }
}