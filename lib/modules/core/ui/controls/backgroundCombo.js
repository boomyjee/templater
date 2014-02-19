ui.backgroundCombo = ui.presetSwitcherCombo.extendOptions({
    defaultItem: { value: {type:"color"} }
},{
    label: "Background",
    comboDirection: "bottom",
    comboWidth: 200,
    editorWidth: 480,
    panelClass: false,
    presetName: "presets.backgrounds",
    noPresetItem: true,
    inlineEditor: true
});

ui.backgroundCombo.color = ui.composite.extend({
    switcherLabel: function (val) {
        return ui.fillCombo.colorLabel(val ? val.color:false,ui.imageCombo.iconWidth,ui.imageCombo.iconHeight,0);
    },
    colorLabel: true,
    defaultItem: { value: {color: false} }
},{
    randomize: function () {
        return {
            color: this.items[0].randomize()
        }
    }
}).extendOptions({
    label: "Color", skipForm: true,
    items: [{
        name:"color", type: "fillCombo",
        inline:true, width: '100%', height: '100%', margin: 0
    }]
});

var assets = require.dir + "/../../assets";
ui.backgroundCombo.pattern = ui.panel.extend({
    switcherLabel: function (value) {
        return $(ui.imageCombo.switcherLabel(value.pattern)).add(
            $("<span>").css({display:'inline-block',verticalAlign:'middle',lineHeight:0}).append(
                ui.fillCombo.colorLabel(value.pattern_color,30,20,0,"border-bottom:none"),
                "<br>",
                ui.fillCombo.colorLabel(value.pattern_color_2,30,20,0)
            )
        );
    },
    colorLabel: true,
    defaultItem: { 
        value: {
            pattern: false, 
            pattern_color: [1,13], 
            pattern_color_2: 'white', 
            transparency: 0 
        }
    }
},{
    randomize: function () {
        return {
            pattern: this.items[1].randomize(),
            pattern_color: this.items[0].items[0].randomize(),
            pattern_color_2: this.items[0].items[1].randomize()
        }
    },
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
            presets: presets
        });
        
        this.push(panel,combo);
        
        panel.push(
            ui.fillCombo({margin:"10px 10px 5px", width:150, name:"pattern_color", label: "Back", _label:false}),
            ui.fillCombo({margin:"10px 10px 5px", width:150, name:"pattern_color_2", label: "Front", _label: false}),
            ui.label({value:"Transparency: ",margin:"0 0 0 5px"}),
            ui.slider({margin:"5px 10px", name:"transparency"})
        );
    }    
});