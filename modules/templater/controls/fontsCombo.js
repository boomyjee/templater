ui.fontsCombo = ui.combo.extendOptions({
    itemTpl:[
        "<div class='font-set-item combo-item'>",
        "{{if value}}",
            "<div style='font-family:${value.heading};font-size:14px;'>${value.heading}</div>",
            "<div style='font-family:${value.text};font-size:12px;'>${value.text}</div>",
        "{{/if}}",
        "</div>"
    ].join(''),
    buttonClass: 'icon-button',
    width:150, selectedIndex: 0, preview: true,
    items: function() { 
        return this.Class.options.map(function(item){ return {value:item}; }) 
    }
});
                                       
ui.fontsCombo.options = [
    {heading:'Verdana',text:'Tahoma'},
    {heading:'Lucida Grande',text:'Lucida Grande'},
    {heading:'Arial',text:'Arial'},
    {heading:'Arial',text:'Tahoma'},
    {heading:'Georgia',text:'Georgia'},
    {heading:'Times New Roman',text:'Arial'},
    {heading:'Trebuchet MS',text:'Verdana'},
    {heading:'Palatino Linotype',text:'Verdana'},
    {heading:'Comic Sans MS',text:'Tahoma'},
    {heading:'Century Gothic',text:'Century Gothic'}
];
