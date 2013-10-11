require("./logo.css");

ui.logo = ui.switcherCombo.extendOptions({
    width: "100.0%", margin: 0, label: "Logotype",
    types: ["image","builder"]
});

ui.logo.image = ui.panel.extend({
    init: function (o) {
        this._super($.extend({label:"Image"},o));
        this.push(
            ui.imageCombo({
                width:"100%",height:"100%",inline:true,margin:0,name:"image",
                uploadDir: "logo"
            })
        );
    }
})
    
ui.logo.builder = ui.panel.extend({
    init: function (o) {
        this._super($.extend({label:"Builder"},o));
        this.push(
            ui.logoCombo({width:"100%",height:"100%",inline:true,margin:0,name:"builder"})
        );
    }
})