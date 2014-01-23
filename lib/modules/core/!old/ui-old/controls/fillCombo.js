var transparent_url = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAGElEQVQYV2N4DwX/oYBhgARgDJjEAAkAAEC99wFuu0VFAAAAAElFTkSuQmCC)";

ui.fillCombo = ui.Combo.extend({
    colorLabel: function (value) {
        var variate = ui.fillCombo.prototype.variate;
        var text = '';
        if (!value) {
            text = 'A';
            value = 'white';
        } 
        else if (value=='transparent') {
            value = transparent_url;
        }
        else {
            value = variate(value);
        }
        return "<span style='text-align:center;font-size:18px;line-height: 22px; vertical-align:middle;border:1px solid #777;display:inline-block;width:22px;height:22px;margin-right:4px;background:"+value+"'>"+text+"</span>";
    }
},{
    init: function (options) {
        this._super($.extend({
            label: 'Fill',
            comboWidth: 390,
            comboHeight: 1000,
            preview: true,
            itemTpl: [
                "{{if group}}",
                    "<div class='combo-group'>${group}</div>",
                "{{else}}",
                    "<div class='combo-item' style='padding:5px;display:inline-block;'>",
                        "{{if text}}",
                            "<div title='auto' style='vertical-align:top;width:15px;height:15px;display:inline-block;border:1px solid #aaa;text-align:center'>${text}</div>",
                        "{{else}}",
                            "<div style='vertical-align:top;width:15px;height:15px;display:inline-block;background:${color};border:1px solid #aaa;'></div>",
                        "{{/if}}",
                    "</div>",
                "{{/if}}"
            ],
            open: (function() {
                var items = [];
                
                items.push({group:"Extra",disabled:true});

                items.push({
                    value: false,
                    text: "A"
                });
                items.push({
                    value:"transparent",
                    // checker
                    color: transparent_url
                });
                
                items.push({group:"Grays",disabled:true});
                for (var d=0;d<14;d++) {
                    var l = Math.floor(255*d/13);
                    var color = new teacss.Color(l,l,l);
                    items.push({
                        value: color.toString(),
                        color: color
                    })
                }
                items.push({group:"Theme colors",disabled:true});
                for (var i=1;i<=9;i++) {
                    if (!teacss.functions["color"+i]) continue;
                    for (var d=1;d<=14;d++) {
                        items.push({
                            value: [i,d],
                            color: this.variate([i,d]).toString()
                        });
                    }
                    items.push(ui.html({html:"<br>"}));
                }
                
                items.push({group:"Custom color",disabled:true});
                items.push(this.picker);
                this.picker.element.detach();
                this.items = items;
                this.updatePicker();
                this.refresh();
            })
        },options));
        
        if (!this.value) this.value = false;
        
        this.change(function(){
            this.updatePicker();
            this.updateLabel();
        });
        
        var me = this;
        ui.paletteColorPicker.events.bind("paletteChange",function(){
            me.updateLabel();
            if (me.multiCombo) me.multiCombo.updateLabel();
        });        
        
        var combo = this;
        this.picker = ui.colorPicker({
            width:150,height:25,margin:5,
            nested:true,
            change: function () {
                combo.setValue(this.getValue());
                combo.change();
            }
        });
        this.updateLabel();
    },
    variate: function (value) {
        return teacss.functions.color(value);
    },
    multiLabel: function (parent) {
        if (parent) this.multiCombo = parent;
        return this.Class.colorLabel(this.value);
    },
    updateLabel: function () {
        this.element.button("option",{label:this.multiLabel()+this.options.label});
    },
    updatePicker: function() {
        var value = this.variate(this.value);
        this.picker.setValue(value);
    },
    setValue: function (value) {
        if (!value) value = false;
        if (typeof value=="string" && value.indexOf(",")!=-1) {
            var parts = value.split(",");
            if (parts.length==2) value = [parseInt(parts[0]),parseInt(parts[1])];
        }
        this._super(value);
        this.updatePicker();
        this.updateLabel();
    },
    getValue: function () {
        return this._super();
    }
})
