var transparent_url = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAGElEQVQYV2N4DwX/oYBhgARgDJjEAAkAAEC99wFuu0VFAAAAAElFTkSuQmCC)";

ui.fillCombo = ui.combo.extend({
    colorLabel: function (value,w,h,margin,css) {
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
            value = variate.call(this,value);
        }
        
        w = w || 64;
        h = h || 52;
        margin = margin===undefined ? 4 : margin;
        css = css || "";
        return "<span style='text-align:center;font-size:"+(h-8)+"px;line-height: "+h+"px; vertical-align:middle;border:1px solid #777;display:inline-block;width:"+w+"px;height:"+h+"px;margin-right:"+margin+"px;background:"+value+";"+css+"'>"+text+"</span>";
    }
},{
    init: function (options) {
        this._super($.extend({
            label: 'Fill',
            comboWidth: 595,
            comboHeight: 1000,
            preview: true,
            panelClass: 'only-icons',
            palettePickers: false,
            itemTpl: function (item,common) {
                if (item.group)
                    return $("<div class='combo-group'>").text(item.group);
                return $("<div class='combo-item'>").append(
                    ui.fillCombo.colorLabel.call(this,item.value,22,22,0)
                );
            },
            open: function() {
                this.updateItems();
            }
        },options));
        
        if (!this.value) this.value = false;
        
        this.change(function(){
            this.updatePicker();
            this.updateLabel();
        });
        
        var me = this;
        
        if (me.options.palettePickers) {
            var update = function(){me.updateLabel()};
            $.each(me.options.palettePickers,function(){
                this.bind("change",update);
                this.bind("setValue",update);
            });
        } else {
            ui.paletteColorPicker.events.bind("paletteChange",function(){
                if (me.options.inline) {
                    if (!me.parentCombo) {
                        me.parentCombo = me.element.parents(".button-select-panel").last().data("combo");
                        if (me.parentCombo) {
                            me.parentCombo.bind("open",function(){
                                if (me.needRefresh) {
                                    me.needRefresh = false;
                                    me.updateItems();
                                }
                            });
                        }
                    }
                    me.needRefresh = true;
                } else {
                    me.updateLabel();
                }
                
            });        
        }
        
        var combo = this;
        this.picker = ui.colorPicker({
            width:150,height:40,margin:5,
            nested:true,
            change: function () {
                combo.setValue(this.getValue());
                combo.change();
            }
        });
        this.updateLabel();
    },
    randomize: function () {
        this.options.open.call(this);
        return this._super();
    },
    variate: function (value) {
        var me = this;
        if (me && me.options && me.options.palettePickers) {
            var color = value;
            if (color && color.constructor==Array) {
                if (color.length<2) color = [1,1];
                color = teacss.functions.variate(me.options.palettePickers[color[0]-1].getValue(),color[1]-1);
            }
            return color;
            
        } else {
            return teacss.functions.color(value);
        }
    },
    multiLabel: function (parent) {
        if (parent) this.multiCombo = parent;
        return this.Class.colorLabel.call(this,this.value,20,20);
    },
    updateItems: function () {
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
            });
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
        
    },
    getLabel: function () {
        return this.multiLabel()+this.options.label;
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
