ui.fontCombo = ui.combo.extendOptions({  
    
    itemTpl: function (item) {
        var ret = $("<div class='font-set-item combo-item'>");
        if (item.value) {
            ret.append("<div style='font-family:${value};font-size:11.6px;'>"+item.value+"</div>");
        } else {
            ret.append("<div style='font-weight:bold;font-size:11.6px;'>auto</div>");
        }
        return ret;
    },
    buttonClass: 'icon-button',
    selectedIndex: 0, preview: true,
    falseItem: true,
    items: function(){
        var ret = this.options.falseItem ? [{value:false}]:[];
        ret = ret.concat([
            {value: 'Verdana'},
            {value: 'Lucida Grande'},
            {value: 'Arial'},
            {value: 'Georgia'},
            {value: 'Impact'},
            {value: 'Times New Roman'},
            {value: 'Trebuchet MS'},
            {value: 'Palatino Linotype'},
            {value: 'Comic Sans MS'},
            {value: 'Century Gothic'}
        ]);
        return ret;
    },
    multiLabel: ui.lengthCombo.prototype.multiLabel
});