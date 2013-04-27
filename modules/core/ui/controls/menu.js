ui.menuWidthCombo = ui.lengthCombo.extendOptions({
    label:"Item width",
    name:"item_width",
    options:[{label:"auto",value:"auto"},100,120,140,160,200],
    min:50,max:300
})

ui.menu = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Menu"
});

ui.menu.default = ui.panel.extendOptions({
    label: "Default",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
            ui.check({label:"Inverse",name:"inverse"}),
            ui.menuWidthCombo({name:'item_width'})
        ];
    }
});

ui.menu.text = ui.panel.extendOptions({
    label: "Text"
});

ui.menu.metro = ui.panel.extendOptions({
    label: "Metro",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
            ui.fillCombo({label:"Background",name:"background"}),
            ui.menuWidthCombo({name:'item_width'})
        ];
    }
});

ui.menu.apple = ui.panel.extendOptions({
    label: "Apple",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
            ui.fillCombo({label:"Background",name:"background"}),
            ui.menuWidthCombo({name:'item_width'})
        ];
    }
});