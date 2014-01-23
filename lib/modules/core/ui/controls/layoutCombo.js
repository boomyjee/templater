ui.layoutCombo = ui.switcherCombo.extendOptions({
    width: "100%", margin: 0,
    label: "Layout"
});

ui.layoutCombo.default = ui.panel.extendOptions({
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