ui.textureCombo = ui.combo.extend({
    init: function (options) {
        this._super($.extend({
            label:'Texture',
            itemData: { iconWidth: 68,iconHeight: 52 }, panelClass: 'only-icons',
            preview: true, closeOnSelect: false, comboHeight: 600, comboWidth: 340,
            
            dir: false,
            thumbs: false,
            
            items: function () {
                var items = [];
                items.push({value: false});
                
                var me = this;
                if (me.options.dir && me.options.thumbs) {
                    FileApi.dirSync(me.options.dir,function(res){ 
                        if (res.data) {
                            for (var i=0;i<res.data.length;i++) {
                                var item = res.data[i];
                                if (!item.folder) {
                                    items.push({
                                        value: item.path,
                                        icon: me.options.thumbs + "/" + item.name.replace(/\.[A-Za-z]*$/,".png")
                                    });
                                }
                            }
                        }
                    });
                }
                return items;
            }
        },options));
        
        this.options.itemTpl = 
            "{{if !value}}" +
                "<div class='combo-item'><div class='combo-icon' style='" +
                    "border:1px solid #007;background:#bdf;width:${iconWidth}px;height:${iconHeight}px;"+
                "'></div></div>" +
            "{{else}}" +
                this.options.itemTpl + 
            "{{/if}}";
        
        this.change(function(){
            this.updateLabel();
        });
        this.updateLabel();
    },
    setValue: function (val) {
        this._super(val);
        this.updateLabel();
    },
    updateLabel: function () {
        this.element.button("option",{label:this.multiLabel()+this.options.label});
    },
    multiLabel: function () {
        if (typeof this.value=="string") {
            var name = this.options.thumbs+"/"+this.value.split("/").pop().replace(/\.[A-Za-z]*$/,".png");
            var bg = "background:url("+name+");background-size:cover;";
            return "<span style='vertical-align:bottom;border:1px solid #777;display:inline-block;width:12px;height:12px;margin-right:4px;"+bg+"'></span>";
        }
        return "";
    }
})
