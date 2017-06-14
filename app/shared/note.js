window.noteApp.Note = function() {
    this.id = 0;
    this.title = '';
    this.description = '';
    this.importance = 0;
    this.creationDate = new Date();
    this.dueDate = null;
    this.completionDate = null;

    this.completed = function() {
        return this.completionDate !== null;
    };

    this.toggleCompleted = function() {
        this.completionDate = this.completed() ? null : new Date();
    };

    if (arguments.length >= 1) {
        if (typeof arguments[0] === 'object') {
            this.init(arguments[0]);
        } else if (typeof arguments[0] === 'string') {
            this.initFromJSON(arguments[0]);
        }
    }
}

window.noteApp.Note.prototype.constructor = window.noteApp.Note;

window.noteApp.Note.prototype.initFromJSON = function(json) {
    return this.init(JSON.parse(json));
};

window.noteApp.Note.prototype.init = function(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.description = obj.description;
    this.importance = obj.importance;
    this.creationDate = (obj.creationDate != null) ? new Date(obj.creationDate) : null;
    this.dueDate = (obj.dueDate != null) ? new Date(obj.dueDate) : null;
    this.completionDate = (obj.completionDate != null) ? new Date(obj.completionDate) : null;

    return this;
};

window.noteApp.Note.prototype.update = function(note) {
    if (this.id === note.id) {
        this.title = note.title;
        this.description = note.description;
        this.importance = note.importance;
        this.dueDate = note.dueDate;
        this.completionDate = note.getCompletionDate;
    }
};

window.noteApp.Note.prototype.constructor = window.noteApp.Note;
