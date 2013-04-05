ui.select = ui.select || function (options) {
    if (options.items && options.items.constructor==Object) {
        var items = [];
        for (var key in options.items) {
            items.push({label:options.items[key],value:key});
        }
        options.items = items;
    }
    return ui.combo($.extend({
        buttonClass: 'icon-button centered',
        comboDirection: 'bottom',
        preview: true,
        selectedIndex: 0
    },options))
}