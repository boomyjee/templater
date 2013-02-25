window.ui = teacss.ui;
window.$ = teacss.jQuery;

require("./style.css");

require("./controls/tabList.js");
require("./controls/sortPanel.js");
require("./controls/previewFrame.js");

exports = ui.Control.extend({
    init: function (options) {
        var me = this;
        this._super(options);
        
        if (this.options.makefile)
            this.options.makefile = teacss.path.absolute(this.options.makefile);
                
        teacss.jQuery(function(){
            me.request('load',{},function (data){
                try {
                    me.settings = data || {};
                    me.settings.templates = me.settings.templates || {};
                    me.settings.pages = me.settings.pages || {};
                    me.settings.pages.list = me.settings.pages.list || [];
                    me.settings.theme = me.settings.theme || {};
                    
                    var cached = me.settings.cached;
                    for (var key in cached) {
                        teacss.files[teacss.path.absolute(key)] = cached[key];
                        window.require.cache.files[teacss.path.absolute(key)] = cached[key];
                    }
                    delete me.settings.cached;
                    
                } catch (e) {
                    alert(data);
                }
                
                require("./../../modules/templater/templater.js",function(){
                    me.createUI();
                });
            });            
        });
        
        this.bind("change",function(){
            me.request('save',{settings:JSON.stringify(me.settings)});
        })
    },
    
    request: function(action,data,callback) {
        $.ajax({
            url: this.options.ajax_url,
            type: "POST",
            data: $.extend({},{action:action},data),
            success: function (data) {
                if (callback) {
                    try {
                        var json = $.parseJSON(data);
                    } catch (e) {
                        alert(data);
                    }
                    callback(json);
                }
            }
        });
    },
    
    createUI: function () {
        var me = this;
        teacss.functions.theme = me.settings.theme;
        
        var previewFrame = me.previewFrame = ui.previewFrame({app:this});
        previewFrame.element.css({position:'absolute',left:me.options.sidebarWidth+1,right:0,top:28,bottom:0,margin:0,zIndex:1});
        previewFrame.bind("change",function(){
            var pages = me.settings.pages;
            var page = pages.list[pages.selected];
            var layout = this.getValue();
            me.settings.templates[page.template] = layout;
            me.trigger("change");
            me.updateUI();            
        });
        
        var previewTabs = ui.tabList({app:this});
        previewTabs.element.addClass("preview-tabs");
        previewTabs.element.css({position:'absolute',left:me.options.sidebarWidth,right:0,top:0,bottom:0,margin:0,
                                 borderTop:"none",borderBottom:"none",borderRight:"none"});
        previewTabs.bind("change",function(){
            me.settings.pages = this.getValue();
            me.updatePreview();
            me.trigger("change");
        });
        
        var sidebar = ui.panel();
        sidebar.element.css({position:'absolute',left:0,width:me.options.sidebarWidth,top:0,bottom:0});
        
        var toolbar = ui.panel();
        toolbar.element.addClass("editorPanel-toolbar");
        toolbar.element.css({position:'absolute',left:0,right:0,top:0,height:20,padding:"4px 0",margin:0});
        
        toolbar.push(
            ui.button({
                label:"Publish",
                icons:{ primary: "ui-icon-circle-triangle-e" },
                click: function () { me.save(); }
            })
        );
        sidebar.push(toolbar); 
        
        var sidebarTabs = me.sidebarTabs = ui.tabPanel({height:"auto"});
        sidebarTabs.element.css({position:'absolute',left:0,right:0,top:28,bottom:0,margin:0,border:"none"});
        sidebar.push(sidebarTabs);

        var panel = ui.panel();
        panel.element.css({position:'fixed',left:0,top:0,right:0,bottom:0,margin:0});
        panel.element.appendTo("body").addClass("teacss-ui");
        panel.push(sidebar,previewTabs,previewFrame);
        
        // load initial values
        me.settings.pages = me.settings.pages || { list: [{ title: "Home", template: "index.liquid" }],selected: 0 }
        previewTabs.setValue(me.settings.pages);
        
        me.settings.layout = me.settings.layout || [];
        me.previewFrame.frame.on("load",function() {
            if (me.options.ui)
                require(me.options.ui,afterUI);
            else
                afterUI();
                
            function afterUI(panelsCb) {
                me.updatePreview();
                me.panelsCb = panelsCb;
                
                me.styleTab = ui.panel("Style");
                me.sidebarTabs.push(me.styleTab);
                me.styleTab.element.css({position:'absolute',left:0,right:0,top:31,bottom:0,margin:0,height:"auto"});
    
                var sortPanel = ui.sortPanel({app:me,label:"Layout"});
                sortPanel.element.css({position:'absolute',left:0,right:0,top:31,bottom:0});
                sidebarTabs.push(sortPanel);
                sidebarTabs.bind("select",function(b,tab){
                    previewFrame.layoutMode(tab==sortPanel);
                });
            }
        });
        
        me.previewFrame.bind("loaded",function(){
            me.updateUI();
        });
        
    },
    
    updateUI: function () {
        var me = this;
        var panelList = [];
        var panelHash = {};
        
        me.previewFrame.$f("> .preview-ui").remove();
        
        var form = ui.form(function(){
            var panelsConfig = me.panelsCb(me);
            $.each(panelsConfig,function(){
                var place = this.place;
                if (place.id) {
                    var cmp = me.previewFrame.componentsHash[place.id];
                    if (cmp) {
                        cmp.styleControls = cmp.styleControls.concat(this.controls);
                        delete cmp.styleDialog;
                    }
                } else {
                    var panel = panelHash[place];
                    if (!panel) panel = panelHash[place] = ui.panel(place);
                    panel.push(this.controls);
                }
            });
            for (var key in panelHash) panelList.push(panelHash[key]);
        });
        form.setValue(me.settings.theme);
        form.bind('change',function(b,e){ 
            teacss.functions.theme = me.settings.theme = this.value;
            clearTimeout(form.processTimeout);
            form.processTimeout = setTimeout(function(){
                me.previewFrame.reloadTea();
            },50);
            clearTimeout(form.saveTimeout);
            form.saveTimeout = setTimeout(function(){
                me.trigger("change");
            },500);
        });
        
        var styleTab = me.styleTab;
        styleTab.element.empty();
        
        if (panelList.length) {
            var sidebarAccordion = ui.accordion({width:"100.0%",margin:0,height:"100.0%"});
            styleTab.push(sidebarAccordion);
            
            $.each(panelList,function(){
                sidebarAccordion.push(this);
            });
            
            setTimeout(function(){
                sidebarAccordion.element.find(".ui-accordion").accordion("resize");
                sidebarAccordion.inner.accordion("option",{animated:false});
            },1);
        }        
    },
    
    updatePreview: function () {
        var me = this;
        var pages = me.settings.pages;
        var page = pages.list[pages.selected];
        if (page) {
            if (me.previewFrame.template!=page.template) {
                me.previewFrame.template = page.template;
                me.previewFrame.setValue(me.settings.templates[page.template] || {});
            }
        } else {
            me.previewFrame.setValue(false);
        }
    }
    
});