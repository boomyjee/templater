ui.table = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Tables"    
});

ui.table.default = ui.panel.extendOptions({
    label: "Default",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
            ui.check({label:"Bordered",name:"bordered"}),
            ui.check({label:"Striped",name:"striped"})
        ];
    }
});

ui.table.metro = ui.panel.extendOptions({
    label: "Metro",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
        ];
    }
});

ui.buttonCombo = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Buttons"    
});

ui.buttonCombo.default = ui.panel.extendOptions({
    label: "Default",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
        ];
    }
});

ui.buttonCombo.metro = ui.panel.extendOptions({
    label: "Metro",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
        ];
    }
});

ui.buttonCombo.apple = ui.panel.extendOptions({
    label: "Apple",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
        ];
    }
});

ui.tabsCombo = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Tabs"    
});

ui.tabsCombo.default = ui.panel.extendOptions({
    label: "Default",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
        ];
    }
});

ui.tabsCombo.metro = ui.panel.extendOptions({
    label: "Metro",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
        ];
    }
});


ui.tabsCombo.apple = ui.panel.extendOptions({
    label: "Apple",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
            ui.fillCombo({label:"Header color",name:"header_color"})
        ];
    }
});

ui.alertsCombo = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Alerts",
    repository: { 
        'default': 'Default',
        'metro': 'Metro',
        'apple': 'Apple'
    }
});

ui.toggleCombo = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Toggles"
});

ui.toggleCombo.default = ui.panel.extendOptions({
    label: "Default",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
        ];
    }
});

ui.toggleCombo.metro = ui.panel.extendOptions({
    label: "Metro",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
        ];
    }
});
    
ui.toggleCombo.apple = ui.panel.extendOptions({
    label: "Apple",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
            ui.fillCombo({label:"Background",name:"background"})
        ];
    }
});  

ui.readingBoxCombo = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Reading (promo) box",
    repository: { 
        'default': 'Default',
        'metro': 'Metro',
        'apple': 'Apple'
    }
});

ui.personCombo = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Person info"
});

ui.personCombo.default = ui.panel.extendOptions({
    label: "Default",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function() {
        return [
            ui.check({label:"Mirrored",name:"mirrored"})
        ];
    }
});

ui.personCombo.metro = ui.panel.extendOptions({
    label: "Metro",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function() {
        return [
            ui.check({label:"Mirrored",name:"mirrored"}),
            ui.fillCombo({label: "Background", name:"background"})
        ];
    }
});

ui.personCombo.apple = ui.panel.extendOptions({
    label: "Apple",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function() {
        return [
            ui.check({label:"Mirrored",name:"mirrored"})
        ];
    }
});


ui.progressCombo = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Progress bars",
    repository: { 
        'default': 'Default',
        'metro': 'Metro',
        'apple': 'Apple',
    }
});

ui.pricingTableCombo = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Pricing tables",
    repository: { 
        'default': 'Default',
        'metro': 'Metro',
        'apple': 'Apple',
    }
});


exports = function (app) {
    
    /*$.each(app.previewFrame.componentsHash,function (id,cmp){
        cmp.controls.push(
            ui.button({ label:"edit", click: function(){ cmp.edit() }}),
            ui.button({ label:"x",    click: function(){ cmp.remove() }}),
            ui.combo({ 
                label:"layout"
            })
        );
    });*/
    
    /*var res = [];
    res.push({
        place: "Common",
        controls: [
            ui.fieldset("Palette colors").push(
                ui.paletteColorPicker({ name: "color1", width: 40, height: 20 }),
                ui.paletteColorPicker({ name: "color2", width: 40, height: 20 }),
                ui.paletteColorPicker({ name: "color3", width: 40, height: 20 })
            ),
            ui.fieldset("Typography").push(
                ui.typography({ name: "typography" })
            ),
            ui.fieldset("Layout").push(
                ui.lengthCombo({
                    width:'50%',name:"sheet.width", label:"Site width",
                    options:[800,900,1000,1100,1200],min:800,max:1200 })
            ),
            ui.fieldset("Logo").push(
                ui.logo({name:"logo"})
            )
        ]
    });
    
    res.push({
        place: "Content",
        controls: [
            ui.fieldset("Content").push(
                ui.table({name:"table"}),
                ui.buttonCombo({name:"button",margin:"5px 0 0 0"}),
                ui.tabsCombo({name:"tabs",margin:"5px 0 0 0"}),
                ui.alertsCombo({name:"alerts",margin:"5px 0 0 0"}),
                ui.toggleCombo({name:"toggle",margin:"5px 0 0 0"}),
                ui.readingBoxCombo({name:"reading_box",margin:"5px 0 0 0"}),
                ui.personCombo({name: "person", margin: "5px 0 0 0"}),
                ui.progressCombo({name:"progress",margin:"5px 0 0 0"}),
                ui.pricingTableCombo({name:"pricing_table",margin:"5px 0 0 0"})
            )
        ]
    });

    var layout = app.settings.templates.layout;
    
    $.each_deep(layout,function(i,parent){
        if (this && this.value && this.value.type=='menu') {
            res.push({
                place: "Menus",
                controls: [
                    ui.fieldset(this.value.id).push(
                        ui.menu({name:"menu."+this.value.id}),
                        ui.marginCombo({ width: "50%", margin: "5px 5px 0 0", name:"menu.margin", label: "Margin" }),
                        ui.check({ width:'50%',name:"menu.expand", label:"Expand", margin:"5px 0 0 0" })
                    )
                ]
            });
        }
    });
    
    
    $.each_deep(layout,function(i,parent){
        if (this && this.value && this.value.type=='container') {
            var id = this.value.id;
            var fs = ui.fieldset(this.value.title || this.value.id);
            
            fs.push(
                ui.backgroundCombo({ 
                    width:"100.0%", label:"Bg", margin: "0 0px 0 0", name:"container."+id+".background", 
                    types:["color","pattern","fullSize"] 
                }),
                "<br>",
                ui.marginCombo({ width: "50.0%", margin: "5px 5px 0 0", name:"container."+id+".margin"}),
                ui.paddingControl({ width: "50.0%", margin: "5px 0 0 0", name:"container."+id+".padding", max: 100})
            );
            
            if (parent==layout) {
                fs.push(
                    ui.check({ width:'50.0%',name:"container."+id+".expand", label:"Expand", margin:"5px 5px 0 0" })
                );
            }
            
            res.push({
                place: "Containers",
                controls: [fs]
            })
        }
    });
    
    app.previewFrame.$f(".control-handle").remove();
    for (var id in app.previewFrame.componentsHash) {
        var cmp = app.previewFrame.componentsHash[id];
        $.each([cmp],function(){
            if (!this.inherited && this.parent && this.parent.value.type=="container") 
            {
                var ctl = ui.control.extend({
                    init: function (o) {
                        var me = this;
                        this._super(o);
                        this.element = $("<div>",{class:'control-handle'}).css({fontFamily:"monospace"}).append(
                            $("<span> ◄ </span>").click($.proxy(this.left,this)),
                            this.valueSpan = $("<span></span>"),
                            $("<span> ► </span>").click($.proxy(this.right,this))
                        );
                        this.list = {
                            'of'   : '1/4',
                            'ot'   : '1/3',
                            'oh'   : '1/2',
                            'tt'   : '2/3',
                            'tf'   : '3/4',
                            'full' : '-/-',
                        }
                    },
                    setValue: function (val) {
                        this._super(val);
                        this.valueSpan.html(this.list[val] || this.list['full']);
                    },
                    left: function () {
                        var arr = [];
                        for (var key in this.list) arr.push(key);
                        var i = arr.indexOf(this.value||"full");
                        i = (i+arr.length-1)%arr.length;
                        this.setValue(arr[i]);
                        this.trigger("change");
                    },
                    right: function () {
                        var arr = [];
                        for (var key in this.list) arr.push(key);
                        var i = arr.indexOf(this.value||"full");
                        i = (i+1)%arr.length;
                        this.setValue(arr[i]);
                        this.trigger("change");
                    }
                })({
                    name: "layout."+id
                });
                
                this.controls.append(ctl.element);
            }
        });
    }*/
    
    return res;
}
    
