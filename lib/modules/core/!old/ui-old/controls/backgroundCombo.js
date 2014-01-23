ui.backgroundCombo = ui.presetSwitcherCombo.extend({
    init: function (o) {
        this._super($.extend({
            label: "Background",
            types: ["color","fullSize","pattern","gradient"],
            switcherWidth: 400,
            comboWidth: 600
        },o));
        this.bind("open",function(){
            this.refresh();
        });
    }
});

ui.backgroundCombo.color = ui.panel.extend({
    paletteLabel: true,
    switcherLabel: function (value,parent) {
        return ui.fillCombo.colorLabel(value.color);
    }
},{
    init: function (o) {
        this._super($.extend({label:"Color"},o));
        this.push(ui.fillCombo({
            name:"color",
            inline:true, width: '100%', height: '100%', margin: 0
        }));
    }
})
    
var assets = require.dir + "/../../assets";
    
ui.backgroundCombo.fullSize = ui.panel.extend({
    switcherLabel: function (value,parent) {
        return ui.imageCombo.switcherLabel(value ? value.texture : false);
    }
},{
    init: function (o) {
        this._super($.extend({label:"Full size"},o));
        var presets = [{group:"Built in",disabled:true}];
        $.each(ui.backgroundCombo.fullSize.presets,function(){
            presets.push({
                icon: assets + "/fullSize/thumbs/" + this + ".png",
                value: assets + "/fullSize/" + this + ".jpg"
            })
        });
        this.push(ui.imageCombo({
            name:"texture",
            uploadDir: "background.fullSize",
            inline: true, width: '100%', height: '100%', margin: 0,
            itemData: { iconWidth: 68,iconHeight: 52 },
            presets: presets
        }));        
    }
});
ui.backgroundCombo.fullSize.presets = [
    "shutterstock_21719962",
    "shutterstock_26797216",
    "shutterstock_26832193",
    "shutterstock_35686474"
];
    
ui.backgroundCombo.pattern = ui.panel.extend({
    paletteLabel: true,    
    switcherLabel: function (value,parent) {
        var l1 = ui.imageCombo.switcherLabel(value ? value.pattern : false);
        var l2 = ui.fillCombo.colorLabel(value.color);
        var l3 = ui.fillCombo.colorLabel(value.color_2);
        return l2+l3+l1;
    }
},{
    init: function (o) {
        this._super($.extend({label:"Pattern"},o));
        
        var panel = ui.panel({width: '35%', height: '100%', margin: 0});
        panel.element.css({'vertical-align':'top'})

        var presets = [{group:"Built in",disabled:true}];
        for (var i=1;i<=18;i++) {
            var name = 'new-retro-'+(i<10 ? '0'+i : i)+'b';
            presets.push({
                icon: assets + "/patterns/thumbs/" + name + ".png",
                value: assets + "/patterns/" + name + ".jpg"
            })
        }
        var combo = ui.imageCombo({
            name:"pattern",
            uploadDir: "background.pattern",
            inline: true, width: '65%', height: '100%', margin: 0,
            itemData: { iconWidth: 68,iconHeight: 52 },
            presets: presets
        });
        
        this.push(panel,combo);
        
        panel.push(
            ui.fillCombo({margin:"10px 10px 5px", width:120, name:"color"}),
            ui.fillCombo({margin:"10px 10px 5px", width:120, name:"color_2"}),
            ui.label("Transparency: "),
            ui.slider({margin:"5px 10px", name:"transparency"})
        );
    }
});