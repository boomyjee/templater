ui.formCombo = ui.combo.extend({
    init: function (options) {
        this._super(options);
    },
    itemsArray: function () {
        if (this.options.container) {
            var me = this;
            if (teacss.jQuery.isFunction(me.items)) {
                this.innerForm = new ui.form(function(){
                    me.items = me.items();
                });
                this.innerForm.setValue(this.value);
                this.innerForm.bind("change",function(){
                    me.trigger("change");
                });
                me.refresh();
            }
            return me.items;
        }
        return this._super();
    },    
    getValue: function () {
        if (this.innerForm && this.options.container) return this.innerForm.getValue();
        return this._super();
    },
    setValue: function (value) {
        if (this.innerForm && this.options.container) return this.innerForm.setValue(value||{});
        return this._super(value);
    }    
})

ui.multiCombo = ui.formCombo.extend({
    init: function (options) {
        var me = this;
        var onChange = function(){ me.updateLabel(); }
        
        this._super(options);
        
        if (this.items && this.items.call) {
            this.itemsArray();
        }
        for (var i=0;i<this.items.length;i++) {
            var item = this.items[i];
            if (item instanceof ui.Control)
                item.element.css({display:'block',width:'auto',margin:0});
            if (item && item.options && item.options.multiLabel) item.multiLabel = item.options.multiLabel;
            if (item.multiLabel && item.options && item.options.multiLabel!==false) {
                item.bind("setValue",onChange);
                item.bind("change"  ,onChange);
            }
        }
        this.updateLabel();
    },
    getLabel: function () {
        var label = "";
        for (var i=0;i<this.items.length;i++) {
            var item = this.items[i];
            if (item && item.multiLabel && item.options && item.options.multiLabel!==false)
                label += item.multiLabel(this);
        }
        label += this.options.label;
        return label;
    },
    updateLabel: function () {
        this.element.button("option",{label:this.getLabel()});
    }
})
    
ui.multiColorCombo = function (o) {
    o.items = [
        ui.fillCombo({ label: 'Passive', name: o.names.replace("${type}","passive") }),
        ui.fillCombo({ label: 'Current', name: o.names.replace("${type}","current") }),
        ui.fillCombo({ label: 'Hovered', name: o.names.replace("${type}","hovered") })
    ]
    return ui.multiCombo(o);
}