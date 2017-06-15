window.noteApp.addView('app', function(){
    var that = this;
    var body = document.body;
    var themeSelect = document.getElementById('theme');

    var themes = [
        { displayName: 'Hell', className: 'hell' },
        { displayName: 'Dunkel', className: 'dunkel' }
    ];

    function notifyThemeChanged(name) {
        if (that.themeChanged != null) {
            that.themeChanged(name);
        }
    }

    this.setTheme = function(name) {
        for(let theme of themes) {
            body.classList.remove(theme.className);
        }
        body.classList.add(name);

        if (themeSelect != null) {
            themeSelect.value = name;
        }
    };

    this.themeChanged = null;

    // setup theme selectbox
    let html = '';
    for(let theme of themes) {
        html += '<option value="'+ theme.className +'">' + theme.displayName + '</option>';
    }
    themeSelect.innerHTML = html;

    // hook theme change event
    themeSelect.addEventListener('change', e => {
        notifyThemeChanged(e.target.value);
    });
});
