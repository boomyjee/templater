ui.typographyFonts = ui.presetCombo.extendOptions({
    presetTpl: function (item) {
        var val = item.value || {};
        var hfont = val.headingsFont || "auto";
        var tfont = val.textFont || "auto";
        return $("<div class='combo-item'>").append(
            $("<div>").text(hfont).css({fontSize:'14px',fontFamily:hfont}),
            $("<div>").text(tfont).css({fontSize:'12px',fontFamily:tfont})
        );
    }
},{
    panelClass: false,
    defaultItem: { value: { headingsFont: false, textFont: false }},
    editorHeight: "auto",
    editor: ui.composite.extendOptions({
        padding: 10,
        items: [
            "Headings font",
            { type: "fontCombo", name:"headingsFont" },
            "Text font",
            { type: "fontCombo", name:"textFont" }
        ]
    })
});

ui.typographyFonts.presets = [
    { group: "Built in", disabled: true },
    { value: { headingsFont: false, textFont: false }},
    { value: { headingsFont: "Verdana", textFont: "Tahoma" }},
    { value: { headingsFont: "Lucida Grande", textFont: "Lucida Grande" }},
    { value: { headingsFont: "Arial", textFont: "Arial" }},
    { value: { headingsFont: "Arial", textFont: "Tahoma" }},
    { value: { headingsFont: "Georgia", textFont: "Georgia" }},
    { value: { headingsFont: "Times New Roman", textFont: "Arial" }},
    { value: { headingsFont: "Trebuchet MS", textFont: "Verdana" }},
    { value: { headingsFont: "Palatino Linotype", textFont: "Verdana" }},
    { value: { headingsFont: "Comic Sans MS", textFont: "Tahoma" }},
    { value: { headingsFont: "Century Gothic", textFont: "Century Gothic" }}
];

ui.typography = ui.switcherCombo.extendOptions({
    width: "100.0%", margin: 0, 
    comboWidth: false
    // comboWidth: 500
});

ui.typography.default = ui.composite.extendOptions({
    switcherLabel: function (value) {
        return ui.typographyFonts.presetTpl({value:value})
            .css({textAlign:'left',padding:"0 5px",background:"white"})
    }
},{
    skipForm: true,
    items: [
        { 
            type: "composite", width: "100%", margin: 0, height: "100%", padding: "5px 10px",
            skipForm: true,
            items: [
                "Headings font",
                { 
                    type: "fontCombo", name: "headingsFont" 
                },
                "Text font",
                { 
                    type: "fontCombo", name: "textFont" 
                },
                "Sizes",
                {
                    label:'font size',options:[{label:'auto',value:false},10,12,14,16],min:8,max:20,units:0,
                    name:"fontSize", type: "lengthCombo"
                },
                {
                    label:'line height',options:[{label:'auto',value:false},1,1.2,1.5,2.0,2.5],min:0.5,max:5,units:0,step:0.1,
                    name:"lineHeight", type: "lengthCombo"
                },
                "Colors",
                { type: 'fillCombo', label:'text', name:"textColor" },
                { type: 'fillCombo', label:'link', name:"linkColor" },
                { type: 'fillCombo', label:'link:hover', name:"linkColorHover" }
            ]
        },
        /*{ 
            type: "typographyFonts", width: "50%", margin: 0, height: "100%", inline: true, 
            name: "", presetName: "presets.typographyFonts" 
        }*/
    ]
})