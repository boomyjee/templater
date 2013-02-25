ui.text = ui.Control.extend({
    init: function (o) {
        this._super(o);
        this.element = $("<input type='text'>");
        this.element.css({
            width: o.width,
            margin: o.margin
        });
        var me = this;
        this.element.bind("keyup mouseup change",function(){
            me.trigger("change");
        });
    },
    getValue: function () {
        return this.element.val();
    },
    setValue: function (val) {
        return this.element.val(val);
    }
});