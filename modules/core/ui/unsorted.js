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

ui.layoutCombo = ui.switcherCombo.extendOptions({
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
        {value:'full', label: 'auto'}
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
                panelClass: 'only-icons',
                items: function(){return me.Class.items},
                name: "part",
                inline:true, width: '100%', height: '100%', margin: 0,
                itemTpl: [
                  "<div class='combo-item'>",
                      "<div class='combo-icon' style='width:50px;height:35px;'>",
                        "<span class='combo-label'>${label}</span>",
                      "</div>",
                  "</div>"
                ]
            })
        ];
    }
});

ui.layoutCombo.absolute = ui.panel.extendOptions({
    label: "Absolute",
    layout: { width: "45%", margin: "10px 0px 0 10px" },
    items: function () {
        ui.lengthCombo({name:"position.x",label:"X"});
        ui.lengthCombo({name:"position.y",label:"Y"});
    }
});

ui.moveHandle = ui.control.extend({
    init: function (o) {
        var me = this;
        var cmp = o.cmp;
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
                    cmp.setHandleIndex(true);
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
});


window.cleanTypeValues = function(type,path) {
    var app = Component.app;
    if (!path) path = type;
    app.settings.theme[type] = app.settings.theme[type] || {};
    $.each(app.settings.templates,function(){
        $.each_deep(this,function(){
            if (this.value && this.value.id && this.value.type==type) {
                var id = this.value.id;
                app.settings.theme[type][id] = app.settings.theme[type][id] || {};
            }
        });
    });
}