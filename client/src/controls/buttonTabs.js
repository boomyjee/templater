ui.buttonTabs = ui.control.extend({
    init: function (o) {
        this._super($.extend({
            width: 100,
        },o));
        
        this.element = $("<div>").css({
            width: 0,
            height: 0,
            margin: this.options.margin
        });
        this.panels = [];
    },
    
    push: function (what) {
        if (what instanceof teacss.ui.Control) {
            this.addTab(what);
        } else {
            this._super(what);
        }
        return this;
    },

    addTab: function (tab) {
        var me = this;
        var label = tab.options.label || "Tab "+teacss.ui.tabPanel.tabIndex++;
        var icons = tab.options.icons;
        
        var button = ui.button({
            label:label,width:this.options.width,icons:icons,margin:"0 0 5px 0",
            click: function(){
                me.select(dialog);
            }
        });
        
        var dialog = ui.dialog({
            draggable: false,
            resizable: false,
            width: tab.options.width,
            dialogClass: "button-tab",
            title: label
        });
        dialog.push(tab);
        tab.element.css({margin:0,width:"auto",display:"block"});
        
        this.element.append(button.element);
        this.panels.push(dialog);
        
        dialog.button = button;
        dialog.panel = tab;
    },
    
    select: function (dlg) {
        $.each(this.panels,function (){
            this.close();
        });
        
        var off = this.element.offset();
        off.left += this.options.width + 1;
        
        dlg.element.dialog("option","position",[off.left,off.top]);
        dlg.open();
        dlg.element.find(".ui-accordion").accordion("resize");
    }
})