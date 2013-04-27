ui.templateTree = ui.Panel.extend({
    init: function (o) {
        var me = this;
        this._super(o);
        
        var app = this.options.app;
        
        var addActions = function(){
            me.tree.find(".jstree-leaf")
                .css({position:'relative'})
                .append(
                    "<span style='position:absolute;top:0;right:16px' class='edit   ui-icon ui-icon-pencil'></span>",
                    "<span style='position:absolute;top:0;right:0px'  class='delete ui-icon ui-icon-close'></span>"
                );
        }        
        
        this.element.css({position:"relative"});
        this.push(
            ui.button({
                label:"Add template",
                click: function () {
                    var name;
                    if (name = prompt("Enter template name in form /some/path/name")) {
                        for (var key in app.settings.templates) {
                            if (key==name) return;
                        }
                        app.settings.templates[name] = {};
                        me.tree.jstree("refresh"); addActions();
                        app.trigger("change");
                    }
                }
            }).element.css({position:'absolute',right:0,bottom:0,margin:0})
         );
        
        this.tree = $("<div>").css({position:'absolute',left:0,right:0,top:0,bottom:28,overflow:'auto'}).appendTo(this.element);
        this.tree
            .bind("loaded.jstree",addActions)
            .on("click","span.edit",function(){
                var meta = $(this).parent().data();
                var path = prompt("Enter new name in form /some/path/name", meta.path);
                if (path) {
                    var val = app.settings.templates[meta.path];
                    delete app.settings.templates[meta.path];
                    app.settings.templates[path] = val;
                    me.tree.jstree("refresh"); addActions();
                    app.trigger("change");
                }
            })
            .on("click","span.delete",function(){
                var meta = $(this).parent().data();
                if (confirm("Sure to delete template "+meta.path+"?")) {
                    delete app.settings.templates[meta.path];
                    me.tree.jstree("refresh"); addActions();
                    app.trigger("change");
                }
            })
            .bind("dblclick.jstree", function (e, data) {
                var link = $(e.target).closest("a");
                if (link.length) me.trigger("dblclick");
            })
            .jstree({
                core: {
                    animation: 100
                },
                json_data: {
                    data: function(node,after){
                        function getList(base) {
                            var hash = {};
                            for (var t in app.settings.templates) {
                                var path = t;
                                
                                if (base) {
                                    if (t.indexOf(base+"/")===0) {
                                        t = t.substring(base.length+1);
                                    } else {
                                        continue;
                                    }
                                }
                                t = t.split("/")[0];
                                hash[t] = path;
                            }
                            
                            var list = [];
                            for (var t in hash) {
                                var children = getList(t);
                                list.push({
                                    data: { 
                                        title: t.replace("/"," / "), 
                                        icon: children.length ? 'folder' : 'file' 
                                    },
                                    state: children.length ? "open" : undefined,
                                    metadata: {
                                        folder: children.length ? true:false,
                                        path: hash[t]
                                    },
                                    children: children
                                });
                            }
                            return list;
                        }
                        if (node==-1) 
                            after(getList());
                        else
                            after();
                    }
                },
                ui: {
                    select_limit: 1
                },
                sort: function (a,b) {
                    var fa = $(a).data("folder")
                    var fb = $(b).data("folder");
                    if (fa==fb) {
                        return this.get_text(a) > this.get_text(b) ? 1 : -1;
                    } else {
                        return fb ? 1 : -1;
                    }
                },                
                plugins : ["themes","json_data","ui","sort","wholerow"]
            });
    },
    getValue: function () {
        var sel = this.tree.jstree('get_selected');
        return sel.data("path");
    }
});

ui.tabList = ui.Panel.extend({
    init: function (o) {
        var me = this;
        this._super(o);
        
        this.activeState = "ui-tabs-selected ui-state-active";
        this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all")
        
        this.element.append(
            this.list = $("<ul>").addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all")
        );
        this.element.css({padding:0});
        this.list.css({zIndex:10});
        
        this.element.on("click","li > span.ui-icon-close",function(e){
            e.preventDefault();
            $(this).parent().remove();
            me.trigger("change");
        });
        
        this.element.on("click","li > a",function(e){
            e.preventDefault();
            if ($(this).hasClass("add")) return me.tabDialog();
            me.list.find(">li").removeClass(me.activeState);
            $(this).parent().addClass(me.activeState);
            me.trigger("change");
        });
        
        this.list.sortable({
            axis: "x",
            items: "li:not(:last-child)",
            helper: function(e, item) {
                var h = item;
                h.width(item.width()+2);
                return h;
            },
            distance: 3,
            sort: function (event, ui) {
                var that = $(this),
                w = ui.helper.outerWidth();
                that.children().each(function () {
                    if ($(this).hasClass('ui-sortable-helper') || $(this).hasClass('ui-sortable-placeholder') || $(this).hasClass("add")) 
                        return true;
                    // If overlap is more than half of the dragged item
                    var dist = Math.abs(ui.position.left - $(this).position().left),
                        before = ui.position.left > $(this).position().left;
                    if ((w - dist) > (w / 2) && (dist < w)) {
                        if (before)
                            $('.ui-sortable-placeholder', that).insertBefore($(this));
                        else
                            $('.ui-sortable-placeholder', that).insertAfter($(this));
                        return false;
                    }
                });
            },    
            stop: function (e, ui) {
                $(this).children().css('width','');
                me.trigger("change");
            },
            containment: 'parent'
        });
        
        
    },
    
    tabDialog: function () {
        var me = this;
        var app = this.options.app;
        if (!me.dialog) {
            
            function submit() {
                var tpl = me.treeTemplate.getValue();
                if (!tpl) {
                    alert("Please, select template first");
                    return;
                }
                
                var page = {
                    title: me.textLabel.getValue() || tpl.split("/").pop(),
                    template: tpl,
                    data: me.selectData ? me.selectData.getValue() : undefined
                }
                me.dialog.element.dialog("close");                            

                me.addTab(page);
                me.selectTab(me.list.children().length-2);
                me.trigger("change");
            }
            
            me.dialog = ui.dialog({
                title: "Add Project Page", modal:true, width: 450,
                resizable: false, zIndex: 1000,
                buttons: {
                    "Add Page To Preview" : submit
                }
            });
            
            me.dialog.push(
                ui.label("Page Label"),"<br>",
                me.textLabel = ui.text({width:415}),"<br>"
            );
            
            if (app.settings.dataSources) {
                var items = [{label:"No data",value:false}];
                for (var value in app.settings.dataSources) {
                    var label = app.settings.dataSources[value];
                    items.push({ label: label, value: value });
                }
                if (items.length>1)
                    me.dialog.push(
                        ui.label("Page Data"),"<br>",
                        me.selectData = ui.select({width:415,items:items}),"<br>"
                    );
            }
                
            me.dialog.push(                    
                ui.label("Page Template"),"<br>",
                me.treeTemplate = ui.templateTree({
                    width: 415,
                    height: 400,
                    app: app
                })
            );
            me.treeTemplate.bind("dblclick",submit);
        }
        me.textLabel.setValue("");
        me.dialog.open();
    },    
    
    addTab: function (page) {
        var item;
        this.list.append(
            item = $("<li>").addClass("ui-state-default ui-corner-top")
            .append(
                // "<a href='#'>"+page.title+" ("+page.template+")"+"</a>",
                "<a href='#'>"+page.title+"</a>",
                "<span class='ui-icon ui-icon-close'>x</span>"
            )
        );
        item.data("page",page);
        this.list.find(">.add").appendTo(this.list);
        return item;
    },
    
    selectTab: function (n) {
        this.list.find(">li").removeClass(this.activeState);
        if (n!==false)
            this.list.find(">li").eq(n).addClass(this.activeState);
    },
    
    setValue: function (v) {
        this.list.html("");
        
        for (var i=0;i<v.list.length;i++) this.addTab(v.list[i]);
        this.selectTab(v.selected);
        
        this.list.append(
            $("<li class='add'>").addClass("ui-state-default ui-corner-top")
            .append("<a class='add' href='#'><span class='ui-icon ui-icon-circle-plus'>_</span></a>")
        )
    },
    
    getValue: function () {
        var me = this;
        var val = {list:[],selected:false}
        me.list.find(">*:not(.add)").each(function(){
            var page = $(this).data("page");
            if (page) val.list.push(page);
            if ($(this).hasClass("ui-state-active")) val.selected = $(this).index();
        });
        return val;        
    }
})