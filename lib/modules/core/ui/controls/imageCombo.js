ui.imageCombo = ui.presetCombo.extend({
    switcherLabel: function (value) {
        if (value) {
            var name = ui.imageCombo.iconPath(value);
            var bg = "background-image:url("+name+")";
            return "<span class='button-image-label' style='"+bg+"'></span>";
        } else {
            return "<span class='button-image-label'>N/A</span>";
        }
        return "";
    },
    presetTpl: function(item) {
        return $("<div class='combo-item'>").append(
            $("<div class='combo-icon'>").css({width:this.iconWidth,height:this.iconHeight}).append(
                $("<img>",{
                    src:ui.imageCombo.iconPath(item.value||"")
                })
            )
        );           
    },    
    iconPath: function (value) {
        var parts = value.split("/");
        var name = parts.pop().replace(".jpg",".png");
        var dir = parts.join("/");
        return dir + "/thumbs/" + name;
    },
    iconWidth: 64,
    iconHeight: 52
},{
    init: function (o) {
        this._super($.extend({
            presetEditor: true,
            disableNewGroup: true,
            uploadDir: "imageCombo",
            relativePath: false
        },o));
    },
    
    removePreset: function (item) {
        var me = this;
        var upload = Component.app.settings.upload[me.options.uploadDir] || [];
        var name = item.value.split("/").pop();
        var i = upload.indexOf(name);
        
        if (i>=0) {
            upload.splice(i,1);
            Component.app.request("upload_delete",{
                dir: me.options.uploadDir,
                file: name
            });
            me.presets.change();
        }
    },    
    
    initPresets: function () {
        var me = this;
        
        this.presets = {
            getValue: function () {
                var files = Component.app.settings.upload[me.options.uploadDir] || [];
                var res = [];
                $.each(files,function(){
                    var rel = me.options.uploadDir+"/"+this;
                    var path = Component.app.options.upload_url+"/"+rel;
                    res.push({
                        value: path,
                        preset: true
                    });
                });
                return res;
            },
            change: function () {
                me.items = me.getItems();
                me.refresh();
                me.setSelected();                        
            }
        };
        
        this.itemPanel.css({marginTop:30});
        
        var uploader = $("<input type='file' multiple='true'>").css({position:'fixed',top:0,left:0,zIndex:10000,width:0}).hide().appendTo("body");
        uploader.change(function(){
            var data = new FormData();
            $.each(uploader[0].files, function(i, file) {
                data.append('file-'+i, file);
            });
            data.append('_type','upload');
            data.append('name',me.options.uploadDir);
            data.append('iconWidth',me.Class.iconWidth);
            data.append('iconHeight',me.Class.iconHeight);
            
            $.ajax({
                url: Component.app.options.ajax_url,
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data){
                    data = $.parseJSON(data);
                    
                    var upload = Component.app.settings.upload;
                    upload[me.options.uploadDir] = upload[me.options.uploadDir] || [];
                    
                    for (var i=0;i<data.length;i++) {
                        var d = data[i];
                        upload[me.options.uploadDir].push(d.name);
                    }           
                    
                    if (data.length) {
                        me.presets.change();
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