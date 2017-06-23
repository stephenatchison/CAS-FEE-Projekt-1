// TO DO: add change-handlers to input fields, set Submit-Button status

import {View} from "../shared/view";

export class EditNoteView extends View {
    constructor() {
        super('editNoteView', true);

        this.onCancel = null;
        this.onSubmit = null;
        this.onValidate = null;

        this.__noteView = null;
        this.__currentValues = null;
        this.__canSubmit = false;

        this.__$titleElem = null;
        this.__$descriptionElem = null;
        this.__$importanceElem = null;
        this.__$dueDateElem = null;

        this.__$submitButton = null;
        this.__$cancelButton = null;

        this.__submitEventHandler = null;
        this.__cancelEventHandler = null;
        this.__changeEventHandler = null;
    }

    get title() { return (this.__$titleElem != null) ? this.__$titleElem.val() : ''; }
    get description() { return (this.__$descriptionElem != null) ? this.__$descriptionElem.val() : ''; }
    get importance() { return (this.__$importanceElem != null) ? this.__$importanceElem.val() : ''; }
    get dueDate() { return (this.__$dueDateElem != null) ? this.__$dueDateElem.val() : ''; }

    destroy() {
        this.__removeEventHandlers();
        super.destroy();
    }

    render(data) {
        this.__removeEventHandlers();

        let elem = super.render(data);

        this.__noteView = data;

        this.__findRequiredElements(elem);
        this.__setImportance(data.importance);
        this.__addEventHandlers();
    }

    initAndFocusOnFirstField() {
        this.__validate();
        if (this.__$titleElem != null) {
            this.__$titleElem.focus();
        }
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

    __updateSubmitButtonStatus() {
        if (this.__$submitButton != null) {
            this.__$submitButton.prop('disabled', !this.__canSubmit);
        }
    }

    __setImportance(value) {
        if (this.__$importanceElem != null) {
            this.__$importanceElem.val(value);
        }
    }

    __getCurrentNoteValues() {
        if (this.__currentValues === null) {
            this.__currentValues = {};
        }

        // update values
        this.__currentValues.title = this.title;
        this.__currentValues.description = this.description;
        this.__currentValues.importance = this.importance;
        this.__currentValues.dueDate = this.dueDate;
        
        return this.__currentValues;
    }

    __handleCancelEvent() {
        if (this.onCancel != null) {
            this.onCancel();
        }
    }

    __handleSubmitEvent() {
        if (this.onSubmit != null) {
            this.onSubmit(this.__getCurrentNoteValues());
        }
    }

    __handleValidateEvent() {
        if (this.onValidate != null) {
            this.__canSubmit = this.onValidate(this.__getCurrentNoteValues());
        } else  {
            this.__canSubmit = true;
        }
    }

    __addValidationTo($elem, eventName) {
        if ($elem != null) {
            if (this.__changeEventHandler === null) {
                this.__changeEventHandler = this.__validate.bind(this);
            }
            $elem.on(eventName, this.__changeEventHandler);
        }
    }

    __removeValidationFrom($elem, eventName) {
        if ($elem != null) {
            $elem.off(eventName);
        }
    }

    __addEventHandlers() {
        if (this.__$submitButton != null) {
            if (this.__submitEventHandler === null) {
                this.__submitEventHandler = this.__handleSubmitEvent.bind(this);
            }
            this.__$submitButton.on('click', this.__submitEventHandler);
        }

        if (this.__$cancelButton != null) {
            if (this.__cancelEventHandler === null) {
                this.__cancelEventHandler = this.__handleCancelEvent.bind(this);
            }
            this.__$cancelButton.on('click', this.__cancelEventHandler);
        }

        this.__addValidationTo(this.__$titleElem, 'input');
        this.__addValidationTo(this.__$descriptionElem, 'input');
        this.__addValidationTo(this.__$importanceElem, 'input');
        this.__addValidationTo(this.__$dueDateElem, 'input');
    }

    __removeEventHandlers() {
        if (this.__$submitButton != null) {
            this.__$submitButton.off('click');
        }

        if (this.__$cancelButton != null) {
            this.__$cancelButton.off('click');
        }

        this.__removeValidationFrom(this.__$titleElem, 'input');
        this.__removeValidationFrom(this.__$descriptionElem, 'input');
        this.__removeValidationFrom(this.__$importanceElem, 'input');
        this.__removeValidationFrom(this.__$dueDateElem, 'input');
    }

    __validate() {
        if (this.__noteView != null) {
            this.__handleValidateEvent();
        } else {
            this.__canSubmit = false;
        }
        this.__updateSubmitButtonStatus();
    }
}