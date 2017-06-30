export class NoteView {
    constructor(note, idx) {
        this.__note = note;
        this.__idx = idx;

        if (note != null) {
            this._id = this.__note._id;
            this.title = this.__note.title;
            this.description = this.__note.description;
            this.importance = this.__note.importance;
            this.creationDate = this.__note.creationDate;
            this.dueDate = this.__note.dueDate;
            this.completionDate = this.__note.completionDate;

            this.isNew = false;
        } else {
            this._id = '';
            this.title = '';
            this.description = '';
            this.importance = 1;
            this.creationDate = new Date();
            this.dueDate = new Date();
            this.completionDate = null;

            this.isNew = true;
        }

        this.importanceStr = (this.importance > 0) ? '&#xf0e7;'.repeat(this.importance) : '';
        this.creationDateStr = this.__formatDate(this.creationDate, false, true);
        this.dueDateStr = this.__formatDate(this.dueDate, false, false);
        this.dueDateInputStr = this.__formatDate(this.dueDate, true);
        this.completionDateStr = this.__formatDate(this.completionDate, false, true);
        this.completed = this.completionDate != null;
    }

    get idx() { return this.__idx; }

    get classes() {
        let list = [];
        if (this.completed) {
            list.push('completed');
        } else {
            let now = moment();
            let dueDate = moment(this.dueDate);

            if (now.isAfter(dueDate, 'day')) {
                list.push('overdue');
            } else if (now.isSame(dueDate, 'day')) {
                list.push('today');
            } else if (dueDate.diff(now, 'days') < 3) {
                list.push('soon');
            }
        }

        return list.join(' ');
    }

    __formatDate(date, forInput, includePrefix) {
        if (forInput) {
            return (date != null) ? moment(date).format('YYYY-MM-DD') : '';
        } else {
            if (date == null) {
                return '';
            } else {
                let momentDate = moment(date);
                let now = moment();
                if (momentDate.isSame(now, 'day')) {
                    return 'heute';
                } else {
                    let aWeekAgo = now.clone().subtract(7, 'days');
                    let inAWeek = now.clone().add(7, 'days');
                    if (momentDate.isBetween(aWeekAgo, inAWeek, 'day', '[]')) {
                        if (momentDate.isSame(now.clone().subtract(1, 'day'), 'day')) {
                            return 'gestern';
                        } else if (momentDate.isSame(now.clone().add(1, 'day'), 'day')) {
                            return 'morgen';
                        } else {
                            return (momentDate.isAfter(now, 'day') ? 'nächsten ' : 'letzten ') + momentDate.format('dddd');
                        }
                    } else {
                        return (date != null) ? (includePrefix ? 'am ' : '') + moment(date).format(forInput ? 'YYYY-MM-DD' : 'DD.MM.YYYY') : '';
                    }
                }
            }
        }
    }
}