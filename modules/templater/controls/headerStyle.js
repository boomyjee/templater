ui.headerStyle = ui.switcherCombo.extendOptions({
    types: ["logo", "height"]
})
    
var assets = require.dir + "/../assets";

ui.headerStyle.logo = ui.panel.extendOptions({
    label: "Logo",
    items: function(){
        var path = assets + "/logo";
        return [
            ui.textureCombo({ 
                label:"Image", name: "logo",
                margin: "5px 0 0 5px", width: "50%",
                dir: path, thumbs: path
            }),
            "<br>",
            ui.lengthCombo({
                label:"Padding", name: "padding",
                width: "50%", margin: "5px 0 5px 5px", 
                options: [0,5,10,20,30,40,50],min:0,max:100
            }),
            "<br>",
            ui.check({
                label:"Inline", name: "inline",
                width: "50%", margin: "5px 0 5px 5px"
            }),            
        ]
    }
})
    
ui.headerStyle.height = ui.panel.extendOptions({
    label: "Height",
    items: function() {
        return ui.lengthCombo({
            inline: true, margin: 0, width: '100%', preview: false,
            options: [100,150,200,250,300],min:0,max:500,
            name: "height"
        })
    }
})