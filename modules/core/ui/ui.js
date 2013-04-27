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

ui.formsCombo = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Forms",
    repository: { 
        'default': 'Default',
        'metro': 'Metro',
        'apple': 'Apple',
    }
});

ui.layoutCombo = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Layout"
});

ui.layoutCombo.default = ui.panel.extendOptions({
    items: [
        {value:'of', label: '1/4'},
        {value:'ot', label: '1/3'},
        {value:'oh', label: '1/2'},
        {value:'tt', label: '2/3'},
        {value:'tf', label: '3/4'},
        {value:'full', label: 'Full Width'}
    ],    
    switcherLabel: function (value,parent) {
        var res = "Full Width";
        $.each(this.items,function(){
            if (this.value==value.part) res = this.label;
        });
        return res;
    }
},{
    label: "Part Of",
    items: function() {
        var me = this;
        return [
            ui.combo({
                label:"Part Of",
                items: function(){return me.Class.items},
                name: "part",
                inline:true, width: '100%', height: '100%', margin: 0
            })
        ];
    }
});

ui.layoutCombo.absolute = ui.panel.extendOptions({
    label: "Absolute",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () {
        ui.lengthCombo({name:"position.x",label:"X"});
        ui.lengthCombo({name:"position.y",label:"Y"});
    }
})

exports = function (app) {
    
    $.each(app.previewFrame.componentsHash,function (id,cmp){
        var id = cmp.value.id;
        
        if (cmp.value.type=="logo") {
            cmp.controls.push(
                ui.logo({name:"logo"})            
            );
        }
        if (cmp.value.type=="menu") {
            cmp.controls.push(
                ui.menu({name:"menu."+id}),
                ui.marginCombo({ width: "100%", margin: "0", name:"menu.margin", label: "Margin" }),
                ui.check({ width:'100%',name:"menu.expand", label:"Expand", margin:"0" })
            );
        }
        if (cmp.value.type=="container") {
            cmp.controls.push(
                ui.backgroundCombo({ 
                    width:"100.0%", label:"Bg", margin: "0 0px 0 0", name:"container."+id+".background", 
                    types:["color","pattern","fullSize"] 
                }),
                ui.marginCombo({ width: "100.0%", margin: "0", name:"container."+id+".margin"}),
                ui.paddingControl({ width: "100.0%", margin: "0", name:"container."+id+".padding", max: 100}),
                ui.lengthCombo({ 
                    width: "100.0%", margin: "0", label:"Height", name:"container."+id+".height", max: 1000,
                    options:[{label:"auto",value:"auto"},100,150,200,300,400,500],
                })
            );
            cmp.controls.push(
                ui.check({ width:'100.0%',name:"container."+id+".expand", label:"Expand", margin:"0" })
            );
        }
        if (cmp.parent && cmp.parent.value.type=="container") {
            cmp.controls.push(
                ui.layoutCombo({name: "layout."+id})
            );
            cmp.overlayControls.push(
                ui.control.extend({
                    init: function (o) {
                        var me = this;
                        this._super(o);
                        this.element = $("<div>").addClass("move-handle");
                        this.element
                            .mousedown(function(e){
                                me.dragging = {pageX:e.pageX,pageY:e.pageY,x:0,y:0};
                                if (me.value && me.value.position) {
                                    me.dragging.x = parseFloat(me.value.position.x) || 0;
                                    me.dragging.y = parseFloat(me.value.position.y) || 0;
                                }
                                e.preventDefault();
                                e.stopPropagation();
                            })
                            .click(function(e){
                                e.stopPropagation();
                            })
                            .mouseup(function(e){
                                me.dragging = false;
                                setTimeout(function() {
                                    cmp.element.css({left:"",top:""});
                                },500);
                                me.trigger("change");
                            });
                            
                        $(document)
                            .mousemove(function(e){
                                if (me.dragging) {
                                    var x = me.dragging.x + e.pageX - me.dragging.pageX;
                                    var y = me.dragging.y + e.pageY - me.dragging.pageY;
                                    cmp.element.css({left:x,top:y});
                                    me.value.position = {x:x+"px",y:y+"px"};
                                }
                            });
                    },
                    setValue: function (val) {
                        this._super(val);
                        if (val && val.type=="absolute")
                            this.element.show();
                        else
                            this.element.hide();
                    }
                })({
                    name: "layout."+id
                })
            );
        }
    });
    
    var res = [];
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
                ui.formsCombo({name:"form", margin:"5px 0 0 0"}),
                ui.readingBoxCombo({name:"reading_box",margin:"5px 0 0 0"}),
                ui.personCombo({name: "person", margin: "5px 0 0 0"}),
                ui.progressCombo({name:"progress",margin:"5px 0 0 0"}),
                ui.pricingTableCombo({name:"pricing_table",margin:"5px 0 0 0"})
            )
        ]
    });
    return res;
}
    
