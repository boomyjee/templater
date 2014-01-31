ui.layoutCombo = ui.switcherCombo.extendOptions({
    width: "100%", margin: 0,
    label: "Layout"
});

ui.layoutCombo.column = ui.panel.extendOptions({
    label: "Columns",
    items: function () {
        return [
            ui.combo({
                panelClass: 'only-icons',
                items: function(){
                    var items = [];
                    for (var i=1;i<=12;i++) {
                        items.push({value:i,label:i,default: i==12});
                    }
                    return items;
                },
                name: "column",
                inline: true, width: '100%', height: '100%', margin: 0,
                itemTpl: [
                  "<div class='combo-item'>",
                      "<div class='combo-icon' style='width:20px;height:35px;'>",
                        "<span class='combo-label'>${label}</span>",
                      "</div>",
                  "</div>"
                ]
            })
        ];
    }
}).extend({
    init: function (o) {
        this._super(o);
        
        var me = this;
        this.element
            .mouseover(function(){ me.showGrid(true) })
            .mouseout(function(){ me.showGrid(false) })
    },
    showGrid: function(flag) {
        if (!this.Class.gridHandle) {
            this.Class.gridHandle = $("<div>").css({
                position: 'absolute',
                left: '50%', top: 0, bottom: 0,
                background: 'transparent',
                zIndex: 100500
            })
                .appendTo(Component.previewFrame.handleContainer)
            
            var m = 2;
            var w = (100-m*11)/12;
            var curr = 0;
            
            for (var i=0;i<12;i++) {
                this.Class.gridHandle.append(
                    $("<div>").css({
                        background: 'rgba(0,0,255,0.1)',
                        position: 'absolute',
                        top: 0, bottom: 0, 
                        left: curr+"%", width:w+"%"
                    })
                );
               curr += w + m;
            }
        }
        
        if (flag) {
            var theme = Component.app.settings.theme;
            var sheetWidth = parseFloat(theme.sheet.width);

            this.Class.gridHandle.show().css({
                marginLeft: -sheetWidth/2,
                width: sheetWidth
            });
        } else {
            this.Class.gridHandle.hide();
        }
    }
})

ui.layoutCombo.part = ui.panel.extendOptions({
    items: [
        {value:'of', label: '1/4'},
        {value:'ot', label: '1/3'},
        {value:'oh', label: '1/2'},
        {value:'tt', label: '2/3'},
        {value:'tf', label: '3/4'},
        {value:'full', label: 'auto',default: true}
    ],    
    switcherLabel: function (value,parent) {
        var res = "Full Width";
        $.each(this.items,function(){
            if (value && this.value==value.part) res = this.label;
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
                inline: true, width: '100%', height: '100%', margin: 0,
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