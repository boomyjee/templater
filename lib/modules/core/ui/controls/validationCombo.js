ui.validationOption = ui.switcher.extendOptions({
    showSelect: true
});

ui.validationOption.required = ui.panel.extendOptions({
    label:"Required",
    padding: 0, margin: 0, display: 'block'
});

ui.validationOption.size = ui.composite.extendOptions({
    label: "Min/max size", skipForm: true,
    table: true, padding: "0.5em 0.5em 0 0.5em",  margin: 0, tableLabelWidth: 100,
    items: [
        { type: "text", name: "min", tableLabel: "Min" },
        { type: "text", name: "max", tableLabel: "Max" }
    ]
});

ui.validationOption.regexp = ui.composite.extendOptions({
    label: "RegExp", skipForm: true,
    table: true, padding: "0.5em 0.5em 0 0.5em",  margin: 0, tableLabelWidth: 100,
    items: [
        { type: "text", name: "regexp", tableLabel: "RegExp" }
    ]
});

ui.validationCombo = ui.combo.extend({
    getLabel: function () {
        if (this.value && this.value.rules && this.value.rules.length) {
            var list = [];
            $.each(this.value.rules,function(){
                this.type = this.type || 'required';
                list.push("<span class='button-label'>"+this.type+"</span>");
            });
            return list.join("<span>, </span>");
        } else {
            return $("<span class='button-label'>").text("none"); 
        }
    }
}).extendOptions({
    comboHeight: 400,
    comboDirection: "bottom",
    items: function () {
        return [
            ui.check({
                label:"Show test validation message",
                name: this.options.name + ".test", width: "100%", margin: "0.5em"
            }),
            ui.repeater({
                width: "100%", margin: 0, layout : {},
                name: this.options.name + ".rules",
                items: [
                    { type: "validationOption", name: "", margin: 0 },
                    { 
                        type: "composite", width: "100%", skipForm: true, padding: "0 0.5em 0 0.5em", margin: 0,
                        table: true, tableLabelWidth: 100,
                        items: [{ 
                            type: "text", skipForm: true, tableLabel: "Message",
                            name: "message"
                        }]
                    }
                ]
            })
        ];
    }
});