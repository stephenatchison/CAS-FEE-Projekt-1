window.noteApp.addView('editNote', function() {
    var that = this;
    this.viewName = 'editNoteView';

    var $titleElem;
    var $descriptionElem;
    var $importanceElem;
    var $dueDateElem;

    var $submitButton;
    var $cancelButton;

    function findRequiredElements(elem) {
        // find form fields
        $titleElem = $('#title', elem);
        $descriptionElem = $('#description', elem);
        $importanceElem = $('#importance', elem);
        $dueDateElem = $('#dueDate', elem);

        // find buttons
        $submitButton = $('#submit', elem);
        $cancelButton = $('#cancel', elem);
    }

    function setImportance(value) {
        if ($importanceElem != null) {
            $importanceElem.val(value);
        }
    }

    function handleCancelEvent() {
        if (that.onCancel != null) {
            that.onCancel();
        }
    }

    function handleSubmitEvent() {
        if (that.onSubmit != null) {
            that.onSubmit({
                title: ($titleElem != null) ? $titleElem.val() : '',
                description: ($descriptionElem != null) ? $descriptionElem.val() : '',
                importance: ($importanceElem != null) ? $importanceElem.val() : '',
                dueDate: ($dueDateElem != null) ? $dueDateElem.val() : ''
            });
        }
    }

    function addEventHandlers() {
        if ($submitButton != null) {
            $submitButton.on('click', handleSubmitEvent);
        }

        if ($cancelButton != null) {
            $cancelButton.on('click', handleCancelEvent);
        }
    }


    function removeEventHandlers() {
        if ($submitButton != null) {
            $submitButton.off('click');
        }

        if ($cancelButton != null) {
            $cancelButton.off('click');
        }
    }

    this.onCancel = null;
    this.onSubmit = null;

    this.onDestroy = function() {
        removeEventHandlers();
    }

    this.beforeRendering = function() {
        removeEventHandlers();
    };

    this.afterRendering = function(elem, data) {
        findRequiredElements(elem);
        setImportance(data.importance);
        addEventHandlers();
    };
});