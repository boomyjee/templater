ui.smartImage = ui.presetSwitcherCombo.extendOptions({
    label: "Smart image", 
    width: "100%", 
    panelClass: 'only-icons',
    comboDirection: "bottom",
    inlineEditor: true,
    presetName: "smartImage"
});

ui.smartImage.default = ui.composite.extendOptions({
    switcherLabel: function (val) {
        var img = val ? val.image : false;
        return ui.fileCombo.switcherLabel(img,true);
    }
},{
    label: "Static", skipForm: true, padding: 10,
    items: function () {
        var items = [
            "Image:",
            { type: "fileCombo", label: "Image", name: "image" },
            "Colors:"
        ];
        for (var i=1;i<=3;i++) {
            items.push({
                type: 'composite', skipForm: true, layout: { verticalAlign: 'middle' }, padding: "0 10px",
                items: [
                    { type: 'colorPicker', name: 'src_'+i, width: 30, height: 20, margin: "0 10px 0 0" },
                    { type: 'fillCombo', name: 'dst_'+i, width: 100, margin: "0 10px 0 0", label: 'Replace' },
                    { 
                        type: 'lengthCombo', name: 'delta_'+i, width: 120, units: false, margin: 0,
                        label:'Hue +/-',options:[{label:"0",value:false},10,20,30,40,360],min:0,max:360,
                    }
                ]
            });
        }
        return items;
    }
})

ui.smartImage.horizontal = ui.smartImage.default.extendOptions({
    label: "Horizontal"
});

var dir = require.dir;
ui.smartImage.presets = [];
ui.smartImage.presets.push({group:"Arrows"});
ui.smartImage.presets.push({
    value: {
        type: "horizontal",
        left: 9, right: 50, width: 115, height: 97,
        image: dir + "/../../assets/smart/arrow1.png",
        src_1: "#e4a424", dst_1: [2,3], delta_1: 20
    }
});