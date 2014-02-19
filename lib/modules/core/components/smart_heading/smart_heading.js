ui.smartHeadingEditor = ui.composite.extendOptions({
    items: [
        "Tag",
        { type: 'select', items: {h1:'h1',h2:'h2',h3:'h3',h4:'h4',h5:'h5',h6:'h6'} },
        "Text",
        { type: "text", name: "text" }
    ]
});

ui.textStyleCombo = ui.switcherCombo.extendOptions({
});

ui.textStyleCombo.default = ui.composite.extendOptions({
    /*switcherLabel: function (value) {
        return ui.typographyFonts.presetTpl({value:value})
            .css({textAlign:'left',padding:"0 5px",background:"white"})
    }*/
},{
    skipForm: true,
    padding: "5px 10px",
    items: [
        "Font",
        { 
            type: "fontCombo", name: "font" 
        },
        {
            label:'font size',options:[{label:'auto',value:false},16,18,24,48,64],min:8,max:64,
            name: 'fontSize', type: "lengthCombo"
        },
        { 
            type: 'fillCombo', label:'text color', name:"color" 
        },
        "Effects",
        { 
            type: 'lengthCombo', label: 'border width', name: 'border.width',
            options:[{value:false,label:'No border'},1,2,3,5,10]
        },
        { 
            type: 'fillCombo', label:'border color', name: "border.color" 
        }
    ]
})