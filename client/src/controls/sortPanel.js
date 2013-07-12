ui.sortPanel = ui.panel.extend({
    init: function (o) {
        this._super(o);
        this.app = o.app;
        this.types = o.app.settings.components;
        this.updateUI();
    },
    
    updateUI: function () {
        var me = this;
        var by_cat = {};
        
        for (var id in this.types) {
            var type = this.types[id];
            if (!by_cat[type.category]) by_cat[type.category] = [];
            by_cat[type.category].push(type);
        }   
        
        this.element.css({padding:"0px 5px","-moz-box-sizing":"border-box","-webkit-box-sizing":"border-box","overflow-y":"scroll"});
        
        for (var cat in by_cat) {
            var f = $("<fieldset>");
            this.element.append(f);
            f.append($("<legend>").html(cat));
            
            $.each(by_cat[cat],function(){
                var type = this;
                f.append(
                    $("<div>").css({
                        border: "1px solid #ccc", background: "white", borderLeft: "none", borderRight: "none",
                        padding: "3px", margin: "0 0 2px 0", cursor: "move"
                    })
                    .html("<h4>"+type.name+"</h4>"+(type.description || ""))
                    .each(function(){ 
                        this.draggable = true;
                        this.ondragstart = function (e) { return me.app.previewFrame.dragStart(e,{type:type,create:true}); }
                        this.ondragend = function (e) { me.app.previewFrame.dragEnd(); }
                    })
                );
            });
        }
    }
});