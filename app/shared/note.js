window.noteApp.Note = function() {
    var _title = '';
    var _description = '';
    var _importance = 0;
    var _dueDate = null;
    var _completionDate = null;

    this.getTitle = function() { return _title; };
    this.setTitle = function(value) { _title = value; };

    this.getDescription = function() { return _description; };
    this.setDescription = function(value) { _description = value; };

    this.getImportance = function() { return _importance; };
    this.setImportance = function(value) { _importance = value; };

    this.getDueDate = function() { return _dueDate; };
    this.setDueDate = function(value) {
        if (typeof value === 'undefined')
            value = null;

        _dueDate = value;
    };

    this.getCompletionDate = function() { return _completionDate; };
    this.setCompletionDate = function(value) {
        if (typeof value === 'undefined')
            value = null;

        _completionDate = value;
    };

    this.getCompleted = function() { return _completionDate !== null; };
    this.setCompleted = function(value) {
        if (value) {
            if (_completionDate === null) {
                _completionDate = new Date();
            }
        } else {
            _completionDate = null;
        }
    };

    this.toJSON = function() {
        return JSON.stringify({
            _title: _title,
            _description: _description,
            _importance: _importance,
            _dueDate: _dueDate,
            _completionDate: _completionDate
        });
    }

    this.initFromJSON = function(json) {
        obj = JSON.parse(json);

        _title = obj._title;
        _description = obj._description;
        _importance = obj._importance;
        _dueDate = obj._dueDate;
        _completionDate = obj._completionDate;

        return this;
    }
}