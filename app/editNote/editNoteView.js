import {View} from "../shared/view";

export class EditNoteView extends View {
    constructor() {
        super('editNoteView', true);

        this.onCancel = null;
        this.onSubmit = null;

        this.__$titleElem = null;
        this.__$$descriptionElem = null;
        this.__$$importanceElem = null;
        this.__$$dueDateElem = null;

        this.__$$submitButton = null;
        this.__$$cancelButton = null;
    }

    destroy() {
        this.__removeEventHandlers();
        super.destroy();
    }

    render(data) {
        this.__removeEventHandlers();

        let elem = super.render(data);

        this.__findRequiredElements(elem);
        this.__setImportance(data.importance);
        this.__addEventHandlers();
    }

    __findRequiredElements(elem) {
        // find form fields
        this.__$titleElem = $('#title', elem);
        this.__$descriptionElem = $('#description', elem);
        this.__$importanceElem = $('#importance', elem);
        this.__$dueDateElem = $('#dueDate', elem);

        // find buttons
        this.__$submitButton = $('#submit', elem);
        this.__$cancelButton = $('#cancel', elem);
    }

    __setImportance(value) {
        if (this.__$importanceElem != null) {
            this.__$importanceElem.val(value);
        }
    }

    __handleCancelEvent() {
        if (this.onCancel != null) {
            this.onCancel();
        }
    }

    __handleSubmitEvent() {
        if (this.onSubmit != null) {
            this.onSubmit({
                title: (this.__$titleElem != null) ? this.__$titleElem.val() : '',
                description: (this.__$descriptionElem != null) ? this.__$descriptionElem.val() : '',
                importance: (this.__$importanceElem != null) ? this.__$importanceElem.val() : '',
                dueDate: (this.__$dueDateElem != null) ? this.__$dueDateElem.val() : ''
            });
        }
    }

    __addEventHandlers() {
        if (this.__$submitButton != null) {
            this.__$submitButton.on('click', this.__handleSubmitEvent.bind(this));
        }

        if (this.__$cancelButton != null) {
            this.__$cancelButton.on('click', this.__handleCancelEvent.bind(this));
        }
    }

    __removeEventHandlers() {
        if (this.__$submitButton != null) {
            this.__$submitButton.off('click');
        }

        if (this.__$cancelButton != null) {
            this.__$cancelButton.off('click');
        }
    }
}