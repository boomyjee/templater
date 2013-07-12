ui.buttonTabs = ui.control.extend({
    init: function (o) {
        this._super($.extend({
            width: 450,
        },o));
        
        this.element = $("<div>").addClass("ui-button-tabs ui-non-active").css({
            width: this.options.width,
            height: 500,
            margin: this.options.margin
        });
        var me = this;
        
        this.buttonDiv = $("<div>").addClass("ui-button-tabs-buttons").appendTo(this.element);
        this.contentDiv = $("<div>").addClass("ui-button-tabs-content").appendTo(this.element);
        this.titleDiv = $("<div>").addClass("ui-button-tabs-title").appendTo(this.element).html("Some title");
        
        this.titleDiv.click(function(e){
            e.stopPropagation();
        });
        
        this.pinButton = $("<span class='ui-icon ui-icon-pin-s ui-button-tabs-pin'>")
            .appendTo(this.element)
            .click(function(e){
                me.pin();
                e.stopPropagation();
            });
        this.closeButton = $("<span class='ui-icon ui-icon-close ui-button-tabs-close'>")
            .appendTo(this.element)
            .click(function(){
                me.select(false);
            });
        
        me.push(
            me.previewCheckPanel = ui.panel({
                label:"Preview",icons: { primary: "ui-icon-large ui-icon-view" }
            })
        );
        
        var previewFlag = false;
        me.previewCheckPanel.button.unbind("click").click(function(){
            previewFlag = !previewFlag;
            Component.app.previewFrame.layoutMode(!previewFlag);
            if (previewFlag)
                me.element.addClass('ui-preview');
            else
                me.element.removeClass('ui-preview');
            me.updatePin();
        });        
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
        var label = tab.options.label = tab.options.label || "Tab "+teacss.ui.tabPanel.tabIndex++;
        var icons = tab.options.icons;
        
        var button = $("<div>",{title:label})
            .html(label)
            .addClass(icons.primary)
            .css({margin:"0 0 5px 0"})
            .click(function(e){
                me.select(tab);
                e.stopPropagation();
            });
        
        tab.button = button;
        tab.element.css({margin:0,width:"auto",height:"auto",display:"block",position:"absolute",left:0,right:0,top:30,bottom:0});
        this.buttonDiv.append(button);
        button.tab = tab;
    },
    
    pin: function () {
        this.pinned = !this.pinned;
        this.updatePin();
    },
    
    updatePin: function () {
        var app = Component.app;
        var left = 0;
        if (!this.element.hasClass("ui-preview") && this.pinned && this.selected) {
            left = this.element.offset().left + this.element.width();
        }
        if (this.pinned)
            this.element.addClass("ui-pinned");
        else
            this.element.removeClass("ui-pinned");
        
        app.previewFrame.frameWrapper.css("left",left);
        app.previewFrame.updateHandles();
    },
    
    select: function (tab) {
        if (this.selected==tab) return;
        if (!tab) {
            var me = this;
            me.element.removeClass("ui-active ui-state-default");
            me.element.addClass("ui-non-active");
            this.prevSelected = this.selected;
            me.selected = false;
        } else {
            this.prevSelected = this.selected;
            this.selected = tab;
            var button = tab.button;
            button.show();
            this.element.addClass("ui-active ui-state-default");
            this.element.removeClass("ui-non-active");
            this.titleDiv.html(tab.options.label);
            this.contentDiv.find("> *").detach();
            this.contentDiv.append(tab.element);
            this.buttonDiv.find("> *").removeClass("ui-active");
            button.addClass("ui-active");
            tab.element.find(".ui-accordion").accordion("resize");
        }
        this.updatePin();
    },
    
    hide: function (tab) {
        tab.button.hide();
        if (tab==this.selected)
            this.select(this.prevSelected);
    }
})