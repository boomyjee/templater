ui.paletteColorPicker = ui.colorPicker.extend({
    events: new ui.eventTarget
},{
    init: function (options) {
        this._super(options);
        this.bind("change",this.updatePalette);
    },
    setValue: function (val) {
        this._super(val);
        this.updatePalette();
    },
    updatePalette: function () {
        if (this.options.name) {
            teacss.functions[this.options.name] = this.getValue();
            ui.paletteColorPicker.events.trigger("paletteChange");
        }
    }
});