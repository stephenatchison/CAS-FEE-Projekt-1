window.noteApp.NoteView = function(note) {
    var _note = note;

    function formatDate(date) {
        return (date != null) ? this.moment(date).format('DD.MM.YYYY') : '';
    }

    this.id = _note.id;
    this.title = _note.title;
    this.description = _note.description;
    this.importance = (_note.importance > 0) ? '&#xf0e7;'.repeat(_note.importance) : '';
    this.creationDate = formatDate(_note.creationDate);
    this.dueDate = formatDate(_note.dueDate);
    this.completionDate = formatDate(_note.completionDate);
}

window.noteApp.NoteView.prototype = { moment: window.moment };
window.noteApp.NoteView.prototype.constructor = window.noteApp.NoteView;
