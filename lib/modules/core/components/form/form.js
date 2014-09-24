ui.formEditor = ui.composite.extendOptions({
    items: [
        "Success message",
        { type: "text", name: "success" },
        "Redirect after",
        { type: "text", name: "redirect" }
    ]
});

ui.formLayoutCombo = ui.switcherCombo.extendOptions({
    height: 82, label: "Layout", 
    comboDirection: "bottom"
});

ui.formLayoutCombo.default = "Vertical";
ui.formLayoutCombo.horizontal = ui.composite.extendOptions({
    label: "Horizontal", skipForm: true,
    layout: {
        width:"auto",margin:"10px 10px 0",display:"block"
    },
    items: [{
        label: "Label width", _label: false,
        type: 'lengthCombo', name: 'labelWidth',options:[{label:'auto',value:false},100,150,200,250,300],min:50,max:400
    }]
});

ui.formStyleCombo = ui.switcherCombo.extendOptions({
    height: 120, label: "Style",
    comboDirection: "bottom"
});
ui.formStyleCombo.default = ui.composite.extendOptions({
    label: "Default", skipForm: true, padding: 10,
    items: [
        {
            label: "Controls padding",
            type: 'lengthCombo', name: 'controlPadding',options:[{label:'auto',value:false},0.5,1,1.5,2],min:0,max:4,units: "em"
        },
        {
            type: "check", label: "Float errors",
            name: "floatErrors"
        }
    ]
})