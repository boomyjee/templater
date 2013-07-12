ui.typography = ui.presetSwitcherCombo.extendOptions({
    width: "100.0%", margin: 0,
    types: ["basic"],
    itemTpl: function () {
        if (this.group) return "<div class='combo-group'>"+this.group+"</div>";
        var s = "<div class='combo-item'>";
        if (this.value) {
            var hfont = this.headingsFont;
            var tfont = this.textfont;
            s += "<div style='font-family:"+hfont+";font-size:14px;'>"+hfont+"</div>";
            s += "<div style='font-family:"+tfont+";font-size:12px;'>"+tfont+"</div>";
            s += "<div style='font-size:12px;'>"+this.fontSize+"px / "+this.lineHeight+"em</div>";
        }
        s += "</div>";
        return s;
    }
});

ui.typography.presets = [
    { group: "Built in", disabled: true },
    { value: { type: "basic", headingsFont: "Verdana", textFont: "Tahoma", fontSize: 14, lineHeight: 1.5 }},
    { value: { type: "basic", headingsFont: "Lucida Grande", textFont: "Lucida Grande", fontSize: 14, lineHeight: 1.5 }},
    { value: { type: "basic", headingsFont: "Arial", textFont: "Arial", fontSize: 14, lineHeight: 1.5 }},
    { value: { type: "basic", headingsFont: "Arial", textFont: "Tahoma", fontSize: 14, lineHeight: 1.5 }},
    { value: { type: "basic", headingsFont: "Georgia", textFont: "Georgia", fontSize: 14, lineHeight: 1.5 }},
    { value: { type: "basic", headingsFont: "Times New Roman", textFont: "Arial", fontSize: 14, lineHeight: 1.5 }},
    { value: { type: "basic", headingsFont: "Trebuchet MS", textFont: "Verdana", fontSize: 14, lineHeight: 1.5 }},
    { value: { type: "basic", headingsFont: "Palatino Linotype", textFont: "Verdana", fontSize: 14, lineHeight: 1.5 }},
    { value: { type: "basic", headingsFont: "Comic Sans MS", textFont: "Tahoma", fontSize: 14, lineHeight: 1.5 }},
    { value: { type: "basic", headingsFont: "Century Gothic", textFont: "Century Gothic", fontSize: 14, lineHeight: 1.5 }}
];

ui.typography.basic = ui.panel.extend({
    paletteLabel: true,
    switcherLabel: function (val) {
        val = val || {};
        return "<span class='button-label'>"+val.headingsFont+" / "+val.textFont+" "
            + val.fontSize+"px "+val.lineHeight+"em</span> - "
            + ui.fillCombo.colorLabel(val.textColor)    
            + ui.fillCombo.colorLabel(val.linkColor)    
            + ui.fillCombo.colorLabel(val.linkColorHover)
        ;
    }
},{
    init: function (o) {
        this._super($.extend({
            label:"Basic",
            layout:{width:"auto",margin:"10px 10px 0",display:"block"}
        },o));
        this.push(
            ui.label("Fonts"),
            ui.fontCombo({name:"headingsFont"}),
            ui.fontCombo({name:"textFont"}),
            ui.label("Sizes"),
            ui.lengthCombo({
                label:'font size',options:[10,12,14,16],min:8,max:20,units:0,
                name:"fontSize"
            }),
            ui.lengthCombo({
                label:'line height',options:[1,1.2,1.5,2.0,2.5],min:0.5,max:5,units:0,step:0.1,
                name:"lineHeight"
            }),
            ui.label("Colors"),
            ui.fillCombo({label:'text',name:"textColor"}),
            ui.fillCombo({label:'link',name:"linkColor"}),
            ui.fillCombo({label:'link:hover',name:"linkColorHover"})
        );
    }
})