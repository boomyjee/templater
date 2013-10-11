ui.fontCombo = ui.combo.extendOptions({  
    itemTpl:[
        "<div class='font-set-item combo-item'>",
        "{{if value}}",
            "<div style='font-family:${value};font-size:14px;'>${value}</div>",
        "{{else}}",
            "<div style='font-weight:bold;font-size:14px;'>auto</div>",
        "{{/if}}",
        "</div>"
    ].join(''),    
    buttonClass: 'icon-button',
    selectedIndex: 0, preview: true,
    items: [
        {value: false},
        {value: 'Verdana'},
        {value: 'Lucida Grande'},
        {value: 'Arial'},
        {value: 'Georgia'},
        {value: 'Times New Roman'},
        {value: 'Trebuchet MS'},
        {value: 'Palatino Linotype'},
        {value: 'Comic Sans MS'},
        {value: 'Century Gothic'}
    ],
    multiLabel: ui.lengthCombo.prototype.multiLabel
});