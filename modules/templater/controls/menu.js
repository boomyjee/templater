ui.menu = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    label: "Menu", types: ["default","metro"]
});

ui.menu.default = ui.panel.extendOptions({
    label: "Default",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        return [
            ui.check({label:"Inverse",name:"inverse"})
        ];
    }
});

ui.menu.metro = ui.panel.extendOptions({
    label: "Metro",
    items: function () { 
        return [
            
        ];
    }
});