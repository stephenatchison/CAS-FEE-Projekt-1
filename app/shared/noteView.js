window.noteApp.NoteView = function(note) {
    var _note = note;

    function formatDate(date) {
        return (date != null) ? this.moment(date).format('DD.MM.YYYY') : '';
    }

    if (note != null) {
        this.id = _note.id;
        this.title = _note.title;
        this.description = _note.description;
        this.importance = _note.importance;
        this.importanceStr = (_note.importance > 0) ? '&#xf0e7;'.repeat(_note.importance) : '';
        this.creationDate = _note.creationDate;
        this.creationDateStr = formatDate(_note.creationDate);
        this.dueDate = _note.dueDate;
        this.dueDateStr = formatDate(_note.dueDate);
        this.completionDate = _note.completionDate;
        this.completionDateStr = formatDate(_note.completionDate);

        this.isNew = false;
    } else {
        this.id = 0;
        this.title = '';
        this.description = '';
        this.importance = 1;
        this.importanceStr = (this.importance > 0) ? '&#xf0e7;'.repeat(this.importance) : '';
        this.creationDate = new Date();
        this.creationDateStr = formatDate(this.creationDate);
        this.dueDate = new Date();
        this.dueDateStr = formatDate(this.dueDate);
        this.completionDate = null;
        this.completionDateStr = formatDate(this.completionDate);

        this.isNew = true;
    }
}

window.noteApp.NoteView.prototype = { moment: window.moment };
window.noteApp.NoteView.prototype.constructor = window.noteApp.NoteView;
