ui.alignCombo = ui.select.extendOptions({
    items: {
        false : 'auto',
        'left' : 'Left',
        'center' : 'Center',
        'right' : 'Right',
        'fill' : 'Fill width'
    }
})

ui.buttonCombo = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    presetName: "presets.buttons",
    inlineEditor: true,
    editorWidth: 300,
    comboWidth: 200,
    comboHeight: 300,
    panelClass: false
});

ui.buttonCombo.presets = [
    {group:"Built-in",disabled:true},
    {value:{type:'default',color:false,color_2:false,font:false,fontSize:false}},
    {value:{type:'metro',color:false,font:false,fontSize:false}},
    {value:{type:'apple',color:false,color_2:false,font:false,fontSize:false}}
]

ui.buttonStylePanel = ui.panel.extendOptions({
    label: "Default",
    layout: { display: "block", width: "auto", margin: "10px 10px 0" },
    items: function () { 
        var items = [
            ui.label("Font:"),
            ui.fontCombo({name:"font"}),
            ui.lengthCombo({
                label:'font size',options:[{label:'auto',value:false},10,12,14,16],min:8,max:20,
                name:"fontSize"
            }),
            ui.label("Colors:"),
            ui.fillCombo({name:"color"})
        ];
        if (this.options.color_2)
            items.push(ui.fillCombo({name:"color_2"}));
        return items;
    }
});
ui.buttonStylePanel.switcherLabel = function (val) {
    val = val || {};
    var type = val.type || "default";
    return $("<div style='text-align:center;overflow:hidden;'>").append(
        teaSwitcherLabel("<button>"+type+"</button>",teacss.functions.button,val)
    );
}

ui.buttonCombo.default = ui.buttonStylePanel.extendOptions({label: "Default", color_2:true});
ui.buttonCombo.metro   = ui.buttonStylePanel.extendOptions({label: "Metro",   color_2:false});
ui.buttonCombo.apple   = ui.buttonStylePanel.extendOptions({label: "Apple",   color_2:true});