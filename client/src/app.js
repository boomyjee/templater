window.ui = teacss.ui;
window.$ = teacss.jQuery;

require("./style.css");

require("./controls/tabList.js");
require("./controls/sortPanel.js");
require("./controls/previewFrame.js");
require("./controls/serializeObject.js");

exports = ui.Control.extend({
    init: function (options) {
        var me = this;
        this._super(options);
        this.ui = [];
        this.styles = [];
        
        if (this.options.makefile)
            this.options.makefile = teacss.path.absolute(this.options.makefile);
        
        Component.app = this;
                
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
                
                me.options.modules = me.options.modules || [];
                me.options.modules.splice(0,0,"./../../modules/core/core.js");
                me.options.modules.push(function(){
                    me.createUI();
                });
                require.apply(require,me.options.modules);
            });            
        });
        
        this.bind("change",function(){
            me.request('save',{settings:JSON.stringify(me.settings)});
        })
    },
    
    request: function(action,data,callback) {
        var me = this;
        me.pending_request = true;
        $.ajax({
            url: this.options.ajax_url,
            type: "POST",
            data: $.extend({},{_type:action},data),
            success: function (data) {
                if (callback) {
                    try {
                        var json = $.parseJSON(data);
                    } catch (e) {
                        alert(data);
                    }
                    callback(json);
                    if (me.pending_request && me.pending_request.call)
                        me.pending_request();
                    me.pending_request = false;
                }
            }
        });
    },
    
    ready: function (f) {
        if (this.pending_request) {
            this.pending_request = f;
        } else {
            f.call(this);
        }
    },
    
    createUI: function () {
        var me = this;
        teacss.functions.theme = me.settings.theme;
        
        var previewFrame = me.previewFrame = ui.previewFrame({app:this,styles:me.styles});
        previewFrame.element.css({position:'absolute',left:me.options.sidebarWidth+1,right:0,top:28,bottom:0,margin:0,zIndex:1});
        previewFrame.bind("change",function(){
            var pages = me.settings.pages;
            var page = pages.list[pages.selected];
            var layout = this.getValue().template;
            me.settings.templates[page.template] = layout;
            me.trigger("change");
            me.ready(function(){
                me.updateUI();      
            });
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
        toolbar.element.css({position:'absolute',left:0,right:0,top:0,height:45,padding:0,margin:0});
        
        if (me.options.closeLink) toolbar.push(
            ui.button({
                label:"Close", margin: "7px 0 0 10px",
                icons:{ primary: "ui-icon-close" },
                click: function () { location.href = me.options.closeLink; }
            })
        );
        toolbar.push(
            me.publishButton = ui.button({
                label:"Publish", margin: "7px 10px 0 0",
                icons:{ primary: "ui-icon-circle-triangle-e" },
                click: function () { me.publish(); }
            })
        );
        me.publishButton.element.css({float:'right'});
        sidebar.push(toolbar); 
        
        var sidebarTabs = me.sidebarTabs = ui.tabPanel({height:"auto"});
        sidebarTabs.element.css({position:'absolute',left:0,right:0,top:45,bottom:0,margin:0,border:"none"});
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
            me.styleTab = ui.panel("Style");
            me.sidebarTabs.push(me.styleTab);
            me.styleTab.element.css({position:'absolute',left:0,right:0,top:31,bottom:0,margin:0,height:"auto"});
            
            var sortPanel = ui.sortPanel({app:me,label:"Components"});
            sidebarTabs.push(sortPanel);
            sortPanel.element.css({position:'absolute',left:0,right:0,top:31,bottom:0,height:"auto"});
            sidebarTabs.bind("select",function(b,tab){
                previewFrame.layoutMode(tab==sortPanel);
            });
            
            me.updatePreview();
        });
        
        me.previewFrame.bind("loaded",function(){
            if (me.frameLoaded) return;
            me.frameLoaded = true;
            me.updateUI();
        });
    },
    
    publish: function () {
        var me = this;
        teacss.build("templater_makefile.tea",{
            callback: function (files) {
                me.request("publish",{files:files},function(){
                    console.debug(files);
                    alert('publish success');
                });
            }
        })           
    },
    
    updateUI: function () {
        var me = this;
        var panelList = [];
        var panelHash = {};
        
        var form = ui.form(function(){
            
            var cmps = me.previewFrame.componentsHash;
            for (var id in cmps) {
                cmps[id].controls = [];
            }
            
            $.each(me.ui,function(){
                var panelsConfig = this(me);
                $.each(panelsConfig,function(){
                    var place = this.place;
                    var panel = panelHash[place];
                    if (!panel) panel = panelHash[place] = ui.panel(place);
                    panel.push(this.controls);
                });
                for (var key in panelHash) panelList.push(panelHash[key]);
            });
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
            me.previewFrame.setValue({
                template: me.settings.templates[page.template] || {},
                data: page.data
            });
        } else {
            me.previewFrame.setValue(false);
        }
    }
    
});