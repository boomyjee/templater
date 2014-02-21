ui.smartImage = ui.combo.extendOptions({
    label: "Smart image", 
    width: "100%", 
    panelClass: 'only-icons',
    comboDirection: "bottom",
    
    itemTpl: function (item) {
        if (item.group!==undefined) return $("<div class='combo-group'>").html(item.group||"-");
        
        var w = this.options.iconWidth;
        var h = this.options.iconHeight;
        
        return $("<div class='combo-item'>").append(
            $("<div class='combo-icon'>").css({width:w,height:h}).append(
                $("<img>",{
                    src:item.value.image
                }).css({maxWidth:w,maxHeight:h})
            )
        );           
    },
    items: function () {
        return this.Class.presets;
    },
    iconWidth: 64,
    iconHeight: 52    
});

var dir = require.dir;

ui.smartImage.presets = [];

ui.smartImage.presets.push({group:"Arrows"});
ui.smartImage.presets.push({
    value: {
        type: "horizontal",
        left: 9, right: 50, width: 115, height: 97,
        image: dir + "/../../assets/smart/arrow1.png",
        color1: "#fcd05f"
    }
});
ui.smartImage.presets.push({
    value: {
        type: "horizontal",
        left: 13, right: 50, width: 115, height: 97,
        image: dir + "/../../assets/smart/arrow1.png",
        colorize: true
    }
});
ui.smartImage.presets.push({
    value: {
        type: "horizontal",
        left: 10, right: 50, width: 115, height: 97,
        image: dir + "/../../assets/smart/arrow1.png",
        colorize: true
    }
});
ui.smartImage.presets.push({
    value: {
        type: "horizontal",
        left: 11, right: 50, width: 115, height: 97,
        image: dir + "/../../assets/smart/arrow1.png",
        colorize: true
    }
});
ui.smartImage.presets.push({
    value: {
        type: "horizontal",
        left: 12, right: 50, width: 115, height: 97,
        image: dir + "/../../assets/smart/arrow1.png",
        colorize: true
    }
});
