exports = function (app) {
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
            ),
            ui.fieldset("Logo").push(
                ui.logo({name:"logo"})
            ),
            ui.fieldset("Menu").push(
                ui.menu({name:"menu"}),
                ui.marginCombo({ width: "50%", margin: "5px 5px 0 0", name:"menu.margin", label: "Margin" }),
                ui.check({ width:'50%',name:"menu.expand", label:"Expand", margin:"5px 0 0 0" })
            )
        ]
    });
    
    var layout = app.settings.templates.layout;
    $.each_deep(layout,function(i,parent){
        if (this && this.value && this.value.type=='container') {
            var id = this.value.id;
            var fs = ui.fieldset(this.value.title || this.value.id);
            
            fs.push(
                ui.backgroundCombo({ 
                    width:"100.0%", label:"Bg", margin: "0 0px 0 0", name:"container."+id+".background", 
                    types:["color","pattern","fullSize"] 
                }),
                "<br>",
                ui.marginCombo({ width: "50.0%", margin: "5px 5px 0 0", name:"container."+id+".margin"}),
                ui.paddingControl({ width: "50.0%", margin: "5px 0 0 0", name:"container."+id+".padding", max: 100}),
                ui.select({
                    width:"50.0%",margin: "5px 5px 0 0", name: "container."+id+".layout",
                    items: [
                        {label:"None",value:false},
                        {label:"Halfs",value:"oh"},
                        {label:"Thrids",value:"ot"}
                    ]
                })                
            );
            
            if (parent==layout) {
                fs.push(
                    ui.check({ width:'50.0%',name:"container."+id+".expand", label:"Expand", margin:"5px 0 0 0" })
                );
            }
            
            res.push({
                place: "Containers",
                controls: [fs]
            })
        }
    });
    return res;
}
    
