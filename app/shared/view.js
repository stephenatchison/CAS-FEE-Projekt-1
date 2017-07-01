export class View {
    constructor(name, hasTemplate) {
        this.__name = name;
        this.__hasTemplate = hasTemplate;
        this.__targetElement = this.__getTargetElement();
        this.__htmlGenerator = this.__getHtmlGenerator();
    }

    get name() { return this.__name; }

    deactivate() { }

    render(data) {
        if (this.__hasTemplate) {
            if ((this.__targetElement != null) && (this.__htmlGenerator != null)) {
                this.__targetElement.innerHTML = this.__htmlGenerator(data);
                return this.__targetElement;
            } else {
                throw 'View ' + this.name + ' could not be initialised correctly!';
            }
        } else {
            throw 'View ' + this.name + ' has no template - if cannot be rendered!';
        }
    };

    __getTargetElement() {
        let elems = document.getElementsByTagName('main');
        if (elems.length === 0) {
            throw 'No MAIN tag found!';
        }
        return elems[0];
    }

    // method to compile a named handlebars template
    __getHtmlGenerator() {
        if (this.__hasTemplate) {
            let templateElem = document.getElementById(this.name);
            if (templateElem) {
                return Handlebars.compile(templateElem.textContent);
            } else {
                throw 'A template with the name ' + this.name + ' could not be found in the document!';
            }
        } else {
            return null;
        }
    };

}