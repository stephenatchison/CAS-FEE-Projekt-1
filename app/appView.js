window.noteApp.addView('app', function(){
    var that = this;
    var $ = this.$;

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
            $('body').removeClass(theme.className);
        }
        $('body').addClass(name);

        $('#theme').val(name);
    };

    this.themeChanged = null;

    // setup theme selectbox
    let html = '';
    for(let theme of themes) {
        html += '<option value="'+ theme.className +'">' + theme.displayName + '</option>';
    }
    $('#theme').html(html);

    // hook theme change event
    $('#theme').on('change', e => {
        notifyThemeChanged(e.target.value);
    });
});
