require("./unsorted.js");

exports = function (app) {
    
    cleanTypeValues("menu");
    cleanTypeValues("container");
    
    $.each(app.previewFrame.componentsHash,function (id,cmp){
        var id = cmp.value.id;
        
        if (cmp.parent && cmp.parent.value.type=="container") {
            cmp.controls.push(
                ui.label({template:"Layout:",margin:"0px 10px 0px"}),
                ui.layoutCombo({name: "layout."+id,margin:"0px 10px 0 10px",width:"100%",inline:true,height:80,switcherWidth:200})
            );
            cmp.overlayControls.push(
                ui.moveHandle({name: "layout."+id,cmp:cmp})
            );
        }
        if (cmp.value.type=="logo") {
            cmp.controls.push(
                ui.logo({name:"logo",inline:true,margin:"10px 10px 0 10px",width:"100%"})
            );
        }
        if (cmp.value.type=="menu") {
            cmp.controls.push(
                ui.menu({name:"menu."+id, margin: "10px 10px 0 10px" }),
                ui.marginCombo({ width: "100%", margin: "10px 10px 0 10px", name:"menu.margin", label: "Margin", comboWidth: 150 }),
                ui.check({ width:'100%',name:"menu.expand", label:"Expand", margin: "10px 10px 0 10px" })
            );
        }
        if (cmp.value.type=="form_button") {
            cmp.controls.push(
                ui.alignCombo({width: "100%", margin: "10px 10px 0 10px", name:"buttons."+id+".align"}),
                ui.marginCombo({width: "100%", margin: "10px 10px 0 10px", name:"buttons."+id+".margin", label: "Margin", comboWidth: 150 }),
                ui.buttonCombo({inline:true,name:"buttons."+id+".style",margin:"10px 10px 0 10px",width:"100%",switcherWidth:200})
            );
        }
        if (cmp.value.type=="container") {
            cmp.controls.push(
                ui.backgroundCombo({ 
                    width:"100%", label:"Background", margin: "10px 10px 0 10px", name:"container."+id+".background", 
                    types:["color","pattern","fullSize"] 
                }),
                ui.typography({
                    width:"100%", margin: "10px 10px 0 10px", name:"container."+id+".typography"
                }),
                ui.marginCombo({ width: "100%", margin: "10px 10px 0 10px", name:"container."+id+".margin",comboWidth:150}),
                ui.paddingControl({ width: "100%", margin: "10px 10px 0 10px", name:"container."+id+".padding", max: 100}),
                ui.lengthCombo({ 
                    width: "100%", margin: "10px 10px 0 10px", label:"Height", name:"container."+id+".height", max: 1000,
                    options:[{label:"auto",value:false},100,150,200,300,400,500], comboWidth: 150
                })
            );
            cmp.controls.push(
                ui.check({ width:'100%',name:"container."+id+".expand", label:"Expand", margin:"10px 10px 0 10px" })
            );
        }
    });
    
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
                    width:'100.0%',name:"sheet.width", label:"Site width",
                    options:[800,900,1000,1100,1200],min:800,max:1200 }),
                ui.backgroundCombo({ 
                    width:"100.0%", label:"Background", margin: "5px 0 0 0", name:"background", 
                    types:["color","pattern","fullSize"] 
                })
            )
        ]
    });
    
    res.push({
        place: "Content",
        controls: [
            ui.fieldset("Content").push(
                ui.table({name:"table"}),
                ui.buttonCombo({name:"button",margin:"5px 0 0 0"}),
                ui.tabsCombo({name:"tabs",margin:"5px 0 0 0"}),
                ui.alertsCombo({name:"alerts",margin:"5px 0 0 0"}),
                ui.toggleCombo({name:"toggle",margin:"5px 0 0 0"}),
                ui.formsCombo({name:"forms.default", margin:"5px 0 0 0"}),
                ui.readingBoxCombo({name:"reading_box",margin:"5px 0 0 0"}),
                ui.personCombo({name: "person", margin: "5px 0 0 0"}),
                ui.progressCombo({name:"progress",margin:"5px 0 0 0"}),
                ui.pricingTableCombo({name:"pricing_table",margin:"5px 0 0 0"})
            )
        ]
    });
    return res;
}
    
