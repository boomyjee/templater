ui.formSelectEditor = ui.composite.extendOptions({
    items: [
        "Label",
        { type: "text", name: "label" },
        "Name",
        { type: "text", name: "name" },
        "Value",
        { type: "text", name: "value" },
        "Options",
        { 
            type: "tableRepeater", name: "options", 
            items: [
                { type: "text", name: "label", tableLabel: "label" },
                { type: "text", name: "value", tableLabel: "value" }
            ]
        }
    ]
});