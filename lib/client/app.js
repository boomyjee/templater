window.ui = teacss.ui;
window.$ = teacss.jQuery;

require("./style.css");

require("./controls/component.js");
require("./controls/previewFrame.js");
require("./controls/serializeObject.js");
require("./controls/html2canvas.js");

$.each_deep = function (parent,f) {
    if (parent && parent.children) $.each(parent.children,function(i){
        f.call(this,i,parent);
        if (this && this.children) $.each_deep(this,f);
    });
}

window.eachComponent = function (type,f) {
    if (!f) {
        f = type;
        type = false;
    }
    var app = Component.app;
    $.each(app.settings.templates,function(){
        var tpl = this;
        $.each_deep(tpl,function(i,parent){
            if (!type || this.value.type==type) f(this,this.value.id,parent==tpl ? false:parent);
        });
    });    
}

exports = ui.Control.extend({
    // control constructor and application entry point
    init: function (options) {
        var me = this;
        this._super(options);
        
        this.styles = [];
        
        this.options.template = this.options.template || "default";
        this.options.modules = this.options.modules || ["core"];
        
        Component.app = this;
        
        teacss.jQuery(function(){
            // load all components data
            me.request('load',{cache:1},function (data){
                try {
                    data = data || {};
                    
                    me.settings = {};
                    me.settings.templates = $.parseJSON(data.templates || "{}");
                    me.settings.theme = $.parseJSON(data.theme || "{}");
                    teacss.functions.settings = me.settings
                    
                    me.components = data.components;
                    me.settings.upload = data.upload;
                    
                    var cached = data.cached;
                    for (var key in cached) {
                        teacss.files[teacss.path.absolute(key)] = cached[key];
                        window.require.cache.files[teacss.path.absolute(key)] = cached[key];
                    }
                    delete me.settings.cached;
                    
                } catch (e) {
                    alert(data);
                }
                
                var js_list = [];
                $.each(me.options.modules,function(i,what){
                    if (what[0]!='/')
                        js_list.push("../modules/"+what+"/"+what+".js");
                    else
                        js_list.push(what);
                });
                js_list.push(function(){
                    me.initUI();
                });
                require.apply(require,js_list);
            });            
        });
        
        this.bind("change",function(){
            if (me.skipSave) return;
            me.request('save',{
                templates: JSON.stringify(me.settings.templates),
                theme: JSON.stringify(me.settings.theme,undefined, 2)
            });
        })        
    },
    
    request: function(action,data,callback) {
        var me = this;
        me.pending_request = action;
        $.ajax({
            url: this.options.ajax_url,
            type: "POST",
            data: $.extend({},{_type:action,_modules:me.options.modules,_project:me.options.project},data),
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
    
    initUI: function () {
        var me = this;
        var toolbarWidth = 350;
        var sidebarWidth = 400;

        var toolbar = ui.panel();
        toolbar.element.css({zIndex:2,position:'absolute',left:0,width:toolbarWidth,top:0,height:57});
        toolbar.element.addClass("preview-toolbar");
        toolbar.push(
            me.closeButton = ui.button({
                label:"Preview", margin: "15px 0 0 15px",
                icons:{ primary: "ui-icon-close" },
                click: function () {
                    var enable = me.frame.layoutModeEnabled;
                    me.frame.layoutMode(!enable);
                    $("body").toggleClass("view-layout",enable);
                    me.closeButton.element.button(
                        "option",
                        enable ? 
                            { label: "Editor", icons:{ primary: "ui-icon-gear" }}
                        :
                            { label: "Preview", icons:{ primary: "ui-icon-close" }}
                    );
                }
            }),
            me.view3dButton = ui.check({
                label: "3D", margin: "15px 0 0 5px", change: function () {
                    me.frame.view3dMode(this.value);
                }
            }),
            me.publishButton = ui.button({
                label:"Publish", margin: "15px 15px 0 0",
                icons:{ primary: "ui-icon-circle-triangle-e" },
                click: function () { me.publish(); }
            })
        );        
        me.closeButton.element.addClass("close-button");
        me.publishButton.element.css({float:'right'});
        
        var sidebar = ui.panel();
        sidebar.element.css({position:'absolute',left:0,width:0,top:57,bottom:0,zIndex:999});
        
        me.templateTabs = ui.tabPanel({margin:0});
        me.templateTabs.element.addClass("preview-tabs");
        me.templateTabs.element.css({position:'absolute',left:toolbarWidth,right:0,top:0,height:57});
        me.templateTabs.element.find(".ui-tabs-nav:first").sortable("destroy");
        me.templateTabs.element.click(function(){
            Component.previewFrame.select(false);
        });
        
        var panel = ui.panel();
        panel.element.css({position:'fixed',left:0,top:0,right:0,bottom:0,margin:0}).addClass("editor-panel");
        panel.element.appendTo(teacss.ui.layer);
        panel.push(me.templateTabs,toolbar,sidebar);
        
        me.frame = ui.previewFrame();
        me.frame.element.css({position:"absolute",left:sidebarWidth,right:0,margin:0,top:57,bottom:0}).addClass("frame-panel");
        me.frame.bind("init",function(){
            me.templateTabs.bind("select",function(e,tab) { me.selectTemplate(tab.template,tab) });
            me.initTabs();
            me.selectTemplate(me.options.template);
        });
        me.frame.bind("loaded",function(){
            me.updateUI();
        });
        me.frame.bind("change",function(){
            me.settings.templates[me.currentTemplate] = this.getValue().template;
            me.updateComponentUI();      
            me.trigger("change");
        });        
        
        panel.push(me.frame);
        
        me.componentPanel = ui.panel({});
        me.componentPanel.element.css({
            position: "absolute", top:0 ,bottom: 0, left: 0, height: "", width: sidebarWidth-2, margin: 0
        }).addClass("ui-button-tabs-content");
        
        me.stylePanel = ui.panel({});
        me.stylePanel.element.css({
            position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, margin: 0
        }).appendTo(me.componentPanel.element);
        sidebar.push(me.componentPanel);  
        
        me.trigger("initUI");
    },
    
    initTabs: function () {
        var me = this;
        me.tabList = me.tabList || [];
        me.tabHash = {};
        me.breadcrumbs = me.breadcrumbs || $("<span>");
        me.breadcrumbs.detach();
        
        $.each(me.tabList,function(){ me.templateTabs.closeTab(this) });
        
        var tpl = this.options.template;
        while (tpl) {
            var tab = ui.panel({label:tpl});
            tab.template = tpl;
            me.tabHash[tpl] = tab;
            me.templateTabs.push(tab);
            me.tabList.push(tab);
            
            var templateStatus = $("<div class='template-status'>").on("click",{tpl:tpl},function(e){
                e.preventDefault();
                e.stopPropagation();
                me.editParentTemplate(e.data.tpl);
            }).appendTo(tab.element);
            
            tpl = this.settings.templates[tpl] || {value:{}};
            tpl = tpl.value.parentTemplate;
            
            var editParent = $("<a href='#'>");
            if (tpl) {
                editParent.text("Child template for "+tpl);
            } else {
                editParent.text("Standalone template");
            }
            templateStatus.append(editParent);
        }
    },
    
    // dialog to change parent template
    editParentTemplate: function (tpl) {
        var me = this;
        var tpl_data = this.settings.templates[tpl];
        var curr = tpl_data ? (tpl_data.value.parentTemplate || "") : "";
        var ext = prompt("Enter template name in form /some/path/name",curr);
        if (ext!==null && ext!==curr) {
            this.settings.templates[tpl] = {
                value: {
                    parentTemplate: ext || undefined
                }
            };
            me.trigger("change");
            me.initTabs();
        }
    },
    
    selectTemplate: function (tpl) {
        var me = this;
        me.currentTemplate = tpl;
        this.frame.setValue({
            template: me.settings.templates[tpl] || {},
            data: false
        });
        me.tabHash[tpl].element.find(".template-status").append(me.breadcrumbs);
    },
    
    publish: function () {
        var me = this;
        teacss.build("templater_makefile.tea",{
            callback: function (files) {
                
                teacss.tea.Style.insert(Component.previewFrame.frame[0].contentWindow.document);
                
                if (me.options.publishScreenshot) {
                    var target = $("#preview_frame").contents().find("body");
                    html2canvas(target, {
                        onrendered: function(canvas) {
                            var screen = document.createElement("canvas");
                            var ctx = screen.getContext('2d');
                            
                            screen.width = 600;
                            screen.height = 450;
                            
                            var w = parseFloat(me.settings.theme.sheet.width);
                            w = (w || 1024)*1.05;
                            
                            var scale = screen.width / w;
                            var offset = (canvas.width - w) * 0.5 * scale;
                            
                            ctx.drawImage(canvas,-offset,0,canvas.width*scale,canvas.height*scale);
                            
                            var img = screen.toDataURL();
                            files["/screenshot.png"] = img;
                            
                            publish_request();
                        }
                    });                                
                } else {
                    publish_request();
                }
                
                function publish_request() {
                    me.request("publish",{files:files},function(){
                        console.debug(files);
                        alert('publish success');
                    });
                }
            }
        });
    },    
    
    updateComponentUI: function () {
        var me = this;
        var form = this.form;
        var old_active = teacss.ui.form.activeForm;
        var active = teacss.ui.form.activeForm = {newItems:[]};
        
        $.each(me.frame.componentsHash,function (id,cmp){
            cmp.controls = cmp.controls || [];
            me.trigger("component-controls",{cmp:cmp});
        });
        
        teacss.ui.form.activeForm = old_active;
        
        for (var i=0;i<active.newItems.length;i++) {
            var item = active.newItems[i];
            form.items.push(item);
            form.registerItem(item);
        }        
    },    
    
    updateUI: function () {
        var me = this;
        var panelList = [];
        var panelHash = {};
        
        var form = this.form = ui.form(function(){
            var cmps = me.frame.componentsHash;
            for (var id in cmps) {
                cmps[id].controls = [];
                cmps[id].overlayControls = [];
            }
            
            var e = {list:[]};
            me.trigger("common-controls",e);
            
            var panelsConfig = e.list;
            $.each(panelsConfig,function(){
                var place = this.place;
                var panel = panelHash[place];
                if (!panel) panel = panelHash[place] = ui.panel(place);
                panel.push(this.controls);
            });
            for (var key in panelHash) panelList.push(panelHash[key]);
        });
        
        me.updateComponentUI();
        
        form.setValue(me.settings.theme);
        form.bind('change',function(b,e){ 
            teacss.functions.theme = me.settings.theme = this.value;
            clearTimeout(form.processTimeout);
            form.processTimeout = setTimeout(function(){
                me.frame.reloadTea();
            },50);
            clearTimeout(form.saveTimeout);
            form.saveTimeout = setTimeout(function(){
                me.trigger("change");
            },500);
        });
        
        var stylePanel = me.stylePanel;
        stylePanel.element.empty();
        
        if (panelList.length) {
            var sidebarAccordion = ui.tabPanel({width:"100.0%",margin:0,height:"100%" });
            stylePanel.push(sidebarAccordion);
            
            $.each(panelList,function(){
                sidebarAccordion.push(this);
                this.element.css({padding:"10px 5px",display:"block",
                      width:"auto",height:"auto",position:"absolute",left:0,top:0,right:0,bottom:0});
            });
        }
    },
});