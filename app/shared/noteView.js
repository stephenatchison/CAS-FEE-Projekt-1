export class NoteView {
    constructor(note, idx) {
        this.__note = note;
        this.__idx = idx;

        if (note != null) {
            this.id = this.__note.id;
            this.title = this.__note.title;
            this.description = this.__note.description;
            this.importance = this.__note.importance;
            this.creationDate = this.__note.creationDate;
            this.dueDate = this.__note.dueDate;
            this.completionDate = this.__note.completionDate;

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
        this.creationDateStr = this.__formatDate(this.creationDate, false);
        this.dueDateStr = this.__formatDate(this.dueDate, false);
        this.dueDateInputStr = this.__formatDate(this.dueDate, true);
        this.completionDateStr = this.__formatDate(this.completionDate, false);
        this.completed = this.completionDate != null;
    }

    get idx() { return this.__idx; }

    __formatDate(date, forInput) {
        return (date != null) ? moment(date).format(forInput ? 'YYYY-MM-DD' : 'DD.MM.YYYY') : '';
    }
}