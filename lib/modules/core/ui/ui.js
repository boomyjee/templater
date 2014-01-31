Component.app.bind("common-controls",function(d,e){
    
    var res = e.list;
    
    res.push({
        place: "Common",
        controls: [
            ui.fieldset("Palette colors").push(
                ui.paletteColorPicker({ name: "color1", width: 40, height: 20 }),
                ui.paletteColorPicker({ name: "color2", width: 40, height: 20 }),
                ui.paletteColorPicker({ name: "color3", width: 40, height: 20 }),
                ui.colorThemeCombo()
            ),
            ui.fieldset("Typography").push(
                ui.typography({ name: "typography", randomize: true })
            ),
            ui.fieldset("Layout").push(
                ui.lengthCombo({
                    width:'100.0%',name:"sheet.width", label:"Site width", margin: 0,
                    options:[800,900,1000,1100,1200],min:800,max:1200 }
                ),
                ui.backgroundCombo({ 
                    width:"100.0%", label:"Background", margin: "5px 0 0 0", name:"background",
                    randomize: true
                })
            )
        ]
    });
    return;
    
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
});

Component.app.bind("component-controls",function(d,e){
    
    var cmp = e.cmp;
    var id = cmp.value.id;
    
    if (!cmp.rightResizer) {
        cmp.rightResizer = $("<div class='resizer right-resizer'>");
        cmp.rightResizer.appendTo(cmp.controlsRight);
        cmp.rightResizer.draggable({
            helper: function (e) {
                
            },
            drag: function (e) {
            },
            start: function (e) {
            },
            stop: function (e) {
            }
        });
    }
    
    
    if (cmp.hasControls) return;
    cmp.hasControls = true;
    
    if (cmp.value.type=="container" || cmp.value.type=="form") {
        cmp.controls.push(
            ui.backgroundCombo({ 
                width:"100.0%", label:"Background", margin: "0 0 10px 0", name:"container."+id+".background", randomize: true
            }),
            ui.typography({
                width:"100.0%", margin: "0 0 10px 0", name:"container."+id+".typography"
            }),
            ui.paddingControl({ width: "100.0%", margin: "0 0 10px 0", name:"container."+id+".padding", max: 100}),
            ui.borderControl({
                width:"100.0%", margin: "0 0 10px 0", name:"container."+id+".border"
            })
        );
    }    
    
    if (cmp.parent && (cmp.parent.value.type=="container" || cmp.parent.value.type=="form")) {
        cmp.controls.push(
            ui.label({template:"Layout:",margin: "0 0 0 0",width:"100.0%"}),
            ui.marginCombo({ width: "50.0%", margin: "0 0 5px 0", name:"layout."+id+".margin",comboWidth:150}),
            ui.overflowCombo({ width: "50.0%", margin: "0 0 5px 5px", name:"layout."+id+".overflow",comboWidth:150}),
            ui.layoutCombo({name: "layout."+id,margin:"0 0 10px 0",width:"100.0%",inline:true,height:82,switcherWidth:200})
        );
    }
    
    if (cmp.value.type=="logo") {
        cmp.controls.push(
            ui.logo({name:"logo."+id,inline:true,margin:"0 0 10px 0",width:"100.0%"})
        );
    }
    
    if (cmp.value.type=="list") {
        cmp.controls.push(
            ui.label({template:"List style:",margin:"0 0 5px 0"}),
            ui.listStyle({name:"list."+id,margin:"0 0 10px 0",width:"100.0%"})
        );
    }
    
    if (cmp.value.type=="form") {
        cmp.controls.push(
            ui.label({template:"Form layout:",margin:"0"}),
            ui.formLayoutCombo({name:"forms."+id+".layout",width:"100.0%",margin: "0 0 10px 0",inline:true}),
            ui.label({template:"Form style:",margin:"0"}),
            ui.formStyleCombo({name:"forms."+id+".style",width:"100.0%",margin: "0 0 10px 0",inline:true})
        );
    }
    
    if (cmp.value.type=="form_button") {
        cmp.controls.push(
            ui.alignCombo({width: "100.0%", margin: "0 0 10px 0", name:"buttons."+id+".align"}),
            ui.marginCombo({width: "100.0%", margin: "0 0 10px 0", name:"buttons."+id+".margin", label: "Margin", comboWidth: 150 }),
            ui.label({template:"Button style:",margin:"0"}),
            ui.buttonCombo({name:"buttons."+id+".style",margin:"0 0 10px 0",width:"100.0%",switcherWidth:200})
        );
    }
    
    if (cmp.value.type=="testimonial") {
        cmp.controls.push(
            ui.label({template:"Testimonial style:",margin:"0 0 5px 0"}),
            ui.testimonial({name:"testimonial."+id,margin:"0 0 10px 0",width:"100.0%"})
        );
    }
});