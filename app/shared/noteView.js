window.noteApp.NoteView = function(note) {
    var _note = note;

    function formatDate(date, forInput) {
        return (date != null) ? moment(date).format(forInput ? 'YYYY-MM-DD' : 'DD.MM.YYYY') : '';
    }

    if (note != null) {
        this.id = _note.id;
        this.title = _note.title;
        this.description = _note.description;
        this.importance = _note.importance;
        this.creationDate = _note.creationDate;
        this.dueDate = _note.dueDate;
        this.completionDate = _note.completionDate;

        this.isNew = false;
    } else {
        this.id = 0;
        this.title = '';
        this.description = '';
        this.importance = 1;
        this.creationDate = new Date();
        this.dueDate = new Date();
        this.completionDate = null;

        this.isNew = true;
    }

    this.importanceStr = (this.importance > 0) ? '&#xf0e7;'.repeat(this.importance) : '';
    this.creationDateStr = formatDate(this.creationDate, false);
    this.dueDateStr = formatDate(this.dueDate, false);
    this.dueDateInputStr = formatDate(this.dueDate, true);
    this.completionDateStr = formatDate(this.completionDate, false);
    this.completed = this.completionDate != null;
}

window.noteApp.NoteView.prototype.constructor = window.noteApp.NoteView;
