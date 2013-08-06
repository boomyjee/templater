ui.imageCombo = ui.presetCombo.extend({
    switcherLabel: function (value) {
        if (value) {
            var parts = value.split("/");
            var name = parts.pop().replace(".jpg",".png");
            var dir = parts.join("/");
            name = dir + "/thumbs/" + name;
            var bg = "background:url("+name+");background-size:cover;";
            return "<span style='vertical-align:middle;border:1px solid #777;display:inline-block;width:22px;height:22px;margin-right:4px;"+bg+"'></span>";
        }
        return "";
    }
},{
    init: function (o) {
        this._super($.extend({
            itemData: { iconWidth: 100,iconHeight: 100 }, panelClass: 'only-icons'
        },o));
    },
    initPresets: function () {
        var me = this;
        this._super();
        this.itemPanel.css({marginTop:30});
        
        var uploader = $("<input type='file' multiple='true'>").css({position:'fixed',top:0,left:0,zIndex:10000,width:0}).hide().appendTo("body");
        uploader.change(function(){
            var data = new FormData();
            $.each(uploader[0].files, function(i, file) {
                data.append('file-'+i, file);
            });
            data.append('_type','upload');
            data.append('name',me.options.uploadDir || "imageCombo");
            data.append('iconWidth',me.options.itemData.iconWidth);
            data.append('iconHeight',me.options.itemData.iconHeight);
            
            $.ajax({
                url: Component.app.options.ajax_url,
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data){
                    data = $.parseJSON(data);
                    if (me.presets) {
                        me.presets.value = me.presets.value || [];
                        for (var i=0;i<data.length;i++) {
                            var d = data[i];
                            me.presets.value.splice(0,0,{value:d.url,icon:d.icon});
                        }
                        me.presets.trigger("change");
                    }                    
                }
            });            
        });
        
        this.itemPanel.parent().prepend(
            $("<a href='#'>").text("Upload").css({
                height: 30, lineHeight: "30px",
                display: 'block',
                background: "#f4f4f4",
                textAlign: 'center'
            }).click(function(e){
                e.preventDefault();
                uploader.show();
                uploader.click();
                uploader.hide();
            })
        );
    }
});
ui.imageCombo.presets = [];