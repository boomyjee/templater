ui.templaterCodeTab = ui.codeTab.extend({
    optionsCombo: false
},{
    init: function (o) {
        if (!this.Class.optionsCombo) {
            this.Class.optionsCombo = ui.optionsCombo();
            // hack : remove theme options
            this.Class.optionsCombo.itemPanel.children().eq(0).children().slice(-2).remove();
        }
        
        var me = this;
        this._super(o);
        this.element.bind("contextmenu",function(e){
            e.preventDefault();
            me.Class.optionsCombo.panel.show().css({
                left: e.pageX,
                top: e.pageY
            });
            return false;
        });
    }
});

Component.app.bind("common-controls",function(d,e){
    Component.app.stylePanel.push(
        ui.tabPanel({width:"100%",height:"100%",margin:0}).push(
            ui.panel({label:"Common",padding:"10px 5px"}).push(
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
            ),
            ui.templaterCodeTab({
                label:"Extra JS",file:"extra.js"
            })
        )
    );
    
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
    
    if (cmp.hasControls) return;
    cmp.hasControls = true;
    
    if ($.inArray(cmp.value.type,["container","form","html","wysiwyg"])>-1) {
        cmp.controls.push(
            ui.typography({ width:"100.0%", margin: "0 0 10px 0", name:"cmp."+id+".typography" })
        );
    }
    
    if (cmp.value.type=="container" || cmp.value.type=="form") {
        cmp.controls.push(
            ui.panel({ width: "50%", margin: "0 0 5px 0" }).push(
                ui.label({template:"Background:",margin: "0 0 0 0",width:"100.0%"}),
                ui.backgroundCombo({ width:"100.0%", margin: "0 0 0 0", name:"cmp."+id+".background", randomize: true })
            ),
            ui.panel({ width: "50%", margin: "0 0 5px 5px" }).push(
                ui.label({template:"Mask and shadow:",margin: "0 0 0 0",width:"100.0%"}),
                ui.shadowCombo({ width: "100%", margin:"0 0 5px 0", name:"cmp."+id+".shadow" }),
                ui.backgroundMaskCombo({ width: "100%", margin: "0 0 0 0", name:"cmp."+id+".mask" })
            ),
            ui.label({template:"Padding and border:",margin: "0 0 0 0",width:"100.0%"}),
            ui.paddingCombo({ width: "33.33%", margin: "0 5px 5px 0", name:"cmp."+id+".padding", max: 100}),
            ui.borderCombo({ width:"33.33%", margin: "0 5px 5px 0", name:"cmp."+id+".border" }),
            ui.borderRadiusCombo({ width: "33.33%", margin: "0 0 5px 0", name:"cmp."+id+".borderRadius", max: 100})
        );
    }    
    
    if ($.inArray(cmp.value.type,["container","form","smart_text","smart_image"])>-1) {
        cmp.controls.push(
            ui.lengthCombo({ 
                name:"cmp."+id+".layout.height", label: "Height",
                width:"100.0%",margin: "0 0 10px 0",
                min: 0, max: 800, options: [{label:'auto',value:false},50,100,200,300,500] 
            })
        );
    }
    
    if (cmp.parent && (cmp.parent.value.type=="container" || cmp.parent.value.type=="form")) {
        cmp.controls.push(
            ui.label({template:"Layout:",margin: "0 0 0 0",width:"100.0%"}),
            ui.marginCombo({ width: "50.0%", margin: "0 0 5px 0", name:"cmp."+id+".layout.margin",comboWidth:150}),
            ui.overflowCombo({ width: "50.0%", margin: "0 0 5px 5px", name:"cmp."+id+".layout.overflow",comboWidth:150}),
            ui.layoutCombo({name: "cmp."+id+".layout",margin:"0 0 10px 0",width:"100.0%",inline:true,height:82,switcherWidth:200}),
            ui.layoutResizer({name:"cmp."+id+".layout",cmp:cmp,position:"controlsBack"})
        );
    }
    
    if (cmp.value.type=="smart_text") {
        cmp.controls.push(
            ui.smartText({name:"cmp."+id+".smart_text",cmp:cmp})
        );
    }
    
    if (cmp.value.type=="smart_image") {
        cmp.controls.push(
            ui.smartImage({name:"cmp."+id+".smart_image",cmp:cmp})
        );
    }
    
    if (cmp.value.type=="menu") {
        cmp.controls.push(
            ui.menu({name:"cmp."+id+".menu"})
        );
    }
    
    if (cmp.value.type=="countdown") {
        cmp.controls.push(
            ui.label({template:"Countdown style:",margin:"0 0 0 0"}),
            ui.countdown({name:"cmp."+id+".countdown",cmp:cmp})
        );
    }
    
    
    if (cmp.value.type=="logo") {
        cmp.controls.push(
            ui.logo({name:"cmp."+id+".logo",inline:true,margin:"0 0 10px 0",width:"100.0%"})
        );
    }
    
    if (cmp.value.type=="list") {
        cmp.controls.push(
            ui.label({template:"List style:",margin:"0 0 0 0"}),
            ui.listStyle({name:"cmp."+id+".list",margin:"0 0 10px 0",width:"100.0%"})
        );
    }
    
    if (cmp.value.type=="form") {
        cmp.controls.push(
            ui.label({template:"Form style and layout:",margin:"0",width:"100.0%"}),
            ui.formLayoutCombo({name:"cmp."+id+".form.layout",width:"50.0%",margin: "0 5px 10px 0"}),
            ui.formStyleCombo({name:"cmp."+id+".form.style",width:"50.0%",margin: "0 0 10px 0"})
        );
    }
    
    if ($.inArray(cmp.value.type,["form_text","form_select"])>-1) {
        cmp.controls.push(
            ui.label({template:"Client validation:",margin:"0"}),
            ui.validationCombo({name:"cmp."+id+".validation",width:"100.0%",margin:"0 0 10px 0",comboWidth: 500})
        )
    }
    
    if (cmp.value.type=="form_button") {
        cmp.controls.push(
            ui.alignCombo({width: "100.0%", margin: "0 0 10px 0", name:"cmp."+id+".button.align"}),
            ui.marginCombo({width: "100.0%", margin: "0 0 10px 0", name:"cmp."+id+".button.margin", label: "Margin", comboWidth: 150 }),
            ui.label({template:"Button style:",margin:"0"}),
            ui.buttonCombo({name:"cmp."+id+".button.style",margin:"0 0 10px 0",width:"100.0%",switcherWidth:200})
        );
    }
    
    if (cmp.value.type=="testimonial") {
        cmp.controls.push(
            ui.label({template:"Testimonial style:",margin:"0 0 5px 0"}),
            ui.testimonial({name:"cmp."+id+".testimonial",margin:"0 0 10px 0",width:"100.0%"})
        );
    }
});