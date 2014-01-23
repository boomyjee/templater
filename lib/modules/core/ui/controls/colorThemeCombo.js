var dir = require.dir;

ui.colorThemeEditor = ui.composite.extendOptions({
    items: function () {
        
        var p1 = ui.colorPicker({ type: "colorPicker", name: "color1", width: 40, height: 20, margin: "0 5px 0 0" });
        var p2 = ui.colorPicker({ type: "colorPicker", name: "color2", width: 40, height: 20, margin: "0 5px 0 0" });
        var p3 = ui.colorPicker({ type: "colorPicker", name: "color3", width: 40, height: 20, margin: "0 5px 0 0" });
        
        return [
            {
                type: "composite", skipForm: true, padding: "5px", height: 65,
                items: [
                    "Base colors", p1, p2, p3,
                    "Theme colors"
                ]
            },
            {
                type: "composite", skipForm :true, margin: 0, height: 425,
                items: [
                    { 
                        type: "repeater", name: "themeColors", table: false, height: '100%', margin: 0,
                        items: [
                            { type: "text", name: "key", tableLabel: "Key", width: 350, margin: "0 5px 2px 0" },
                            { 
                                type: "fillCombo", name: "value", tableLabel: "Color", 
                                width: 100, palettePickers: [p1,p2,p3], margin: 0 
                            }
                        ]
                    }
                ]
            }
        ];
    }
});

ui.colorThemeCombo = ui.presetCombo.extend({
    presetTpl: function (item) {
        var icon = item.icon || palette_thumb(item.value);
        return $("<div class='combo-item'>").append(
            $("<div class='combo-icon'>").css({width:item.iconWidth || 120,height:52}).append(
                $("<img>",{
                    src:icon
                })
            ),
            $("<span class='combo-label'>").text(item.label)
        );           
    },
    defaultItem: {
        label: "Custom",
        value:{
            color1:"red",
            color2:"green",
            color3:"blue",
            themeColors:[] 
        }
    }
},{
    init: function (o) {
        var changing = false;
        this._super($.extend({
            formChange: function () {
                if (changing) return;

                var form_val = this.form.value;
                var val = {
                    color1: form_val.color1,
                    color2: form_val.color2,
                    color3: form_val.color3
                };
                this.setValue(val);
            }
        },o));
        
        this.bind("change",function(){
            changing = true;
            var val = this.getValue();
            this.form.itemChanged(false,"color1",val.color1);
            this.form.itemChanged(false,"color2",val.color2);
            this.form.itemChanged(false,"color3",val.color3);
            this.form.trigger("change");
            changing = false;
        });
    },
    
    setSelected: function () {
        function eq_col(c1,c2) {
            if (c1==c2) return true;
            if ($.isArray(c1) && c1[0]==c2[0] && c1[2]==c2[1]) return true;
            return false;
        }
        
        function eq(x,y) {
            if (!eq_col(x.color1,y.color1)) return false;
            if (!eq_col(x.color2,y.color2)) return false;
            if (!eq_col(x.color3,y.color3)) return false;
            return true;
        }
        
        var me = this;
        me.itemPanel.find(">*").removeClass("selected").each(function(){
            var item = teacss.jQuery(this).data("item");
            if (item && item.value && me.selected_on_open && eq(item.value,me.selected_on_open.value)) {
                teacss.jQuery(this).addClass("selected");
            }
        })        
    },
    
    selectItem: function (item) {
        var me = this;
        me.selected_on_open = me.selected = teacss.jQuery(item).data("item");
        me.value = $.extend(true,{},me.selected.value);
        delete me.value._id;
        me.setSelected();
        me.change();
    },        
    
    getItems: function () {
        var me = this;
        if (!this.presetsLoaded) {
            $.ajax({
                url: dir + "/../../assets/colorThemes.json",
                async: true,
                dataType: "json",
                success: function (dt) {
                    me.presetsLoaded = true;
                    me.options.presets = dt;
                
                    $.each(me.options.presets,function(i,preset){
                        if (preset && preset.value && preset.value.themeColors) {
                            var tc = [];
                            $.each(preset.value.themeColors,function(key,col){
                                if (colorConversion[key]) {
                                    tc.push({key:colorConversion[key],value:col});
                                }
                            })
                            preset.value.themeColors = tc;
                        }
                    });

                    me.items = me.getItems();
                    me.refresh();
                    me.setSelected();
                }
            });        
            return [{
                disabled: true,
                label: "Loading...",
                icon: dir + "/../../assets/icons/loading_bar.gif",
                iconWidth: this.options.comboWidth
            }];          
        }
        return this._super();
    },
    
    refresh: function () {
        var me = this;
        this._super();
        if (!this.presetsLoaded) {
            if (me.newGroupButton) me.newGroupButton.detach();
        }
    }
    
}).extendOptions({
    presetName: "presets.colorThemes",
    label:'Color theme',
    margin: "0 5px -3px 5px",
    icons: {
        primary: 'ui-icon-gear',
        secondary: 'ui-icon-triangle-1-s'
    },
    comboWidth: 420, comboHeight: 500, panelClass: 'only-icons',
    closeOnSelect: false,
    preview: false,
    editor: ui.colorThemeEditor,
    editorWidth: 500
});

var colorConversion = {
     "SheetBackgroundColor":"container.sheet.background.color",
     "HeaderColor":"container.header.background.color"
}

function palette_thumb(value) {

    var canvas = document.createElement('canvas');
    canvas.width = 68;
    canvas.height = 52;
    
    function query(name) {
        if (!value.themeColors) return false;
        for (var i=0;i<value.themeColors.length;i++) {
            if (value.themeColors[i].key==name)
                return value.themeColors[i].value;
        }
        return false;
    }
    
    function get_color(name) {
        var color = query(name);
        
        if (!color) {
            if (colorConversion[name]) {
                color = query(colorConversion[name]);
            }
        }
        
        if (color && color.constructor==Array) {
            if (color.length<2) color = [1,1];
            color = teacss.functions.variate(value["color"+color[0]],color[1]-1);
        }
        if (!color) color = 'black';
        return color;
    }
    
    var ctx = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    var flag = true; // IsHeaderExists;
    var flag2 = true; // IsMenuExists;

    var color = get_color('PageBackgroundColor');
    var color2 = get_color('SheetBackgroundColor');
    var color3 = get_color('NavigationVerticalBlockBackgroundColor');

    var black = '#888';

    var color4 = get_color('NavigationVerticalItemActiveTextColor');
    var color5 = get_color('NavigationVerticalItemPassiveTextColor');
    var color6 = get_color('NavigationVerticalItemActiveBackgroundColor');


    ctx.fillStyle = color.toString();
    ctx.fillRect(0,0,width,height);

    var num = 0.029 * width;
    var num2 = num * 2;
    var num3 = 0.1369 * width;
    var num4 = 0.1 * height;

    ctx.fillStyle = color2.toString();

    ctx.beginPath();
    ctx.moveTo(num3+num,num4);
    ctx.lineTo(width,num4);
    ctx.lineTo(width,num4+height);
    ctx.lineTo(num3,num4+height);

    ctx.lineTo(num3,num4+num);
    ctx.arcTo(num3,num4,num3+num,num4,num);

    ctx.fill();
    ctx.closePath();

    var num5 = flag ? (0.24 * height) : 0;
    if (flag) {
        var color7 = get_color('HeaderColor');
        ctx.fillStyle = color7.toString();

        ctx.beginPath();
        ctx.moveTo(num3+num,num4);
        ctx.lineTo(width,num4);
        ctx.lineTo(width,num4+num5);
        ctx.lineTo(num3,num4+num5);
        ctx.lineTo(num3,num4+num);
        ctx.arcTo(num3,num4,num3+num,num4,num);

        ctx.fill();
        ctx.closePath();
    }

    var num6 = flag2 ? (0.12 * height) : 0;
    if (flag2)
    {
        var color8 = get_color('HNavMenuBackgroundColor');
        var color9 = get_color('HNavItemHoveredBackgroundColor');
        var color10 = get_color('HNavItemPassiveBackgroundColor');
        var color11 = get_color('HNavItemHoveredTextColor');
        var color12 = get_color('HNavItemPassiveTextColor');

        ctx.fillStyle = color8.toString();
        ctx.fillRect(num3,num4+num5,width-num3,num6);

        var num7 = 0.012 * width;
        var num8 = 0.008 * width;
        var num9 = 0.034 * height;
        var num10 = 0.02 * width;


        var text = "Menu Item";
        ctx.font = (0.04 * height)+"px Arial";
        var sizeF = ctx.measureText(text);

        var num11 = num3 + num7;
        var num12 = num4 + num5 + num9;
        var num13 = sizeF.width + num10 * 2;
        var num14 = num6 - num9;
        var h = 0.04*height;

        ctx.fillStyle = color9.toString();
        ctx.fillRect(num11, num12, num13, num14);

        ctx.fillStyle = color11.toString();
        ctx.fillText(text,num11 + (num13 - sizeF.width) / 2, num12 + (num14 + h) / 2);

        var sizeF2 = sizeF;
        var num15 = num3 + num7 + num8 + num13;
        var num16 = num4 + num5 + num9;
        var num17 = sizeF2.width + num10 * 2;
        var num18 = num6 - num9;
        ctx.fillStyle = color10.toString();
        ctx.fillRect(num15, num16, num17, num18);
        ctx.fillStyle = color12.toString();
        ctx.fillText(text, num15 + (num17 - sizeF2.width) / 2, num16 + (num18 + h) / 2);

        var sizeF3 = sizeF;
        var num19 = num3 + num7 + num8 + num13 + num8 + num17;
        var num20 = num4 + num5 + num9;
        var num21 = sizeF3.width + num10 * 2;
        var num22 = num6 - num9;
        ctx.fillStyle = color10.toString();
        ctx.fillRect(num19, num20, num21, num22);
        ctx.fillStyle = color12.toString();
        ctx.fillText(text, num19 + (num21 - sizeF3.width) / 2, num20 + (num22 + h) / 2);
    }

    var num23 = num3;
    var num24 = num4 + num5 + num6;
    var num25 = 0.3 * width;
    var height2 = height - num24;

    ctx.fillStyle = color3.toString();
    ctx.fillRect(num23, num24, num25, height2);

    var array = [
        'Menu Item 1',
        'Menu Item 2',
        'Menu Item 3',
        'Menu Item 4',
        'Menu Item 5'
    ];
    var num26 = Math.floor(0.086 * height);
    for (var i = 0; i < array.length; i++) {
        var h = num26 / 2.2;
        ctx.font = h + "px Arial";
        if (i == 3) {
            ctx.fillStyle = color6.toString();
            ctx.fillRect(num23, num24 + (num26 * i), num25, num26);
        }
        var text = array[i];
        var x = num23 + 0.02 * width;
        var y = num24 + (num26 * i) + (num26 + h) / 2;

        ctx.fillStyle = (i==3) ? color4.toString() : color5.toString();
        ctx.fillText(text, x, y);
    }

    var x2 = num23 + num25 + 0.045 * width;
    var num27 = num24 + 0.032 * height;

    var h = 0.05 * height;
    ctx.font = (0.05*height)+"px Arial";
    ctx.fillStyle = black;
    ctx.fillText('Some heading',x2,num27 + 0.07*height);

    var num28 = 0.059 * height;
    var num29 = 0.045 * height;
    var array2 = [
        "Some sample text tha gives",
        "you sort of understanding",
        "How the text would look like",
        "on a theme like this."
    ];
    ctx.font = (0.04*height)+"px Arial";
    for (var j = 0; j < array2.length; j++) {
        ctx.fillText(array2[j],x2, num27 + num28 + num29 * j + 0.08*height);
    }

   return canvas.toDataURL();
}