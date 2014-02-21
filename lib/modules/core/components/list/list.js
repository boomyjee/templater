ui.listEditor = ui.composite.extendOptions({
    items: [{
        type: "repeater", name: "items",
        items: [{
            type: "wysiwyg", name: "text"
        }]
    }]
});

ui.listBullet = ui.switcherCombo.extend({
    init: function (o) {
        this._super($.extend({
            comboHeight: 300,
        },o));
    }
})

ui.listBullet.default = ui.composite.extendOptions({
    switcherLabel: function (val) {
        val = val || {};
        val = fontAwesome.map[val.symbol] || "";
        var char = val.substring(1);
        char = char ? "&#x" + char + ";" : "-";
        
        return "<span class='button-label' style='vertical-align:middle;font-size:18px;line-height:18px;font-family:FontAwesome'>"+char+"</span>";
    }
},{
    label: "Symbol", skipForm: true,
    items: [{
        type: "composite", skipForm: true,
        width: "100%", height: "100%", padding: "0 0 70px 0", margin: 0,
        items: [{
            type: "combo",
            name: "symbol", preview: false,
            inline: true, width: '100%', height: '100%', margin: 0,
            itemTpl: function (item) {
                var s = "<div title='"+item.value+"' class='combo-item' style='font-family:FontAwesome;text-align:center;line-height:42px;font-size:36px;width:36px;height:36px;float:left'>";
                var val = fontAwesome.map[item.value] || "";
                var char = val.substring(1);
                if (char) {
                    s += "&#x" + char + ";";
                } else {
                    s += "-";
                }
                s += "</div>";
                return s;            
            },
            items: function () {
                var items = [];
                var map = fontAwesome.map;
                for (var key in map) {
                    items.push({value:key});
                }
                return items;
            }
        }]
    },{
        label: "bullet size", margin: "-65px 5px 5px 5px", comboDirection: 'right',
        type: 'lengthCombo', name: 'size',options:[{label:'auto',value:false},10,12,14,16,20,24,32,36,48],min:8,max:48,units:0
    },{
        label: "bullet color", margin: 5, comboDirection: 'right',
        type: 'fillCombo', name: 'color'
    }]
});

ui.listBullet.image = ui.composite.extendOptions({
    switcherLabel: function (value) {
        return ui.imageCombo.switcherLabel(value ? value.image : false);
    }
},{
    label: "Image", skipForm: true,
    items: [{
        type: "imageCombo",
        name: "image", preview: true,
        inline: true, width: '100%', height: '100%', margin: 0,
        itemData: { iconWidth: 68,iconHeight: 52 },
        uploadDir: "bullets"
    }]
});

ui.listStyle = ui.presetSwitcherCombo.extendOptions({
    comboWidth: 200,
    comboHeight: 400,
    editorHeight: 400,
    editorWidth: 300,
    panelClass: false,
    noPresetItem: true,
    inlineEditor: true,
    presetName: "presets.listStyle"
});

ui.listStyle.presets = [];
ui.listStyle.default = ui.composite.extendOptions({
    switcherLabel: function (value,obj,label) {
        var val = value || {};
        
        return teaSwitcherLabel(
            $("<div>").css({
                textAlign:'left',padding:"15px 10px 0",
                background:'white',lineHeight:1.8,overflow:'hidden'
            }).append(
                $("<ul>").append(
                    "<li><p>First item<br>&hellip;and some more</p></li>",
                    "<li><p>Second item<br>&hellip;and some more</p></li>"
                )
            ),
            teacss.functions.list,
            val
        );
        
        
    }
},{
    label: "Default", skipForm: true,
    items: [{
        type: "composite", skipForm: true,
        width: "100%", height: "100%", padding: "0 0 65px 0", margin: 0,
        items: [{
            type: "listBullet", name: 'bullet', inline: true,
            width: "100%", height: "100%", margin: 0
        }]
    },{
        label: "item margin", margin: "-65px 5px 5px 5px", comboDirection: 'right',
        type: 'lengthCombo', name: 'itemMargin',options:[{label:'auto',value:false},0.2,0.5,1.0,1.5,2.0],min:8,max:20,units:'em'
    },
    {
        label: "bullet indent", margin: "5px", comboDirection: 'right',
        type: 'lengthCombo', name: 'bullet.indent',options:[{label:'auto',value:false},-0.4,-0.2,0.2,0.5,1.0],min:-1.0,max:3,units:0
    }]
});