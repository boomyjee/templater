var this_url = require.dir;

// iframe to display template preview
ui.previewFrame = ui.panel.extend({
    // constructor, creates some UI
    init: function (o) {
        var me = this;
        this._super(o);
        Component.previewFrame = this;
        
        var blank = dayside.url+"/plugins/live_preview/blank.htm";
        
        this.toolbar = $("<div>")
            .addClass("preview-toolbar")
            .css({position:"absolute",left:this.options.app.options.sidebarWidth,right:0,top:0,height:29,lineHeight:"29px",
                  borderBottom:"1px solid #aaa",padding:"0 10px",color:"#555"})
            .appendTo(this.element);
        
        this.toolbar.append(
            this.templateStatus = $("<a href='#' class='template-status'>").click(function(e){
                e.preventDefault();
                me.editParentTemplate();
            })
        );
        
        this.controlGroups = {};
        
        this.frameWrapper = $("<div>")
            .css({position:"absolute",left:0,right:0,top:30,bottom:0})
            .appendTo(this.element);
        
        this.frame = $("<iframe>")
            .attr("id","preview_frame")
            .attr("src", blank)
            .css({width: "100%", height: "100%"})
            .appendTo(this.frameWrapper);
    },
    
    // dialog to change parent template
    editParentTemplate: function () {
        var curr = this.root.value.parentTemplate||"";
        var ext = prompt("Enter template name in form /some/path/name",curr);
        if (ext!==null && ext!==curr) {
            var value = this.value;
            value.template = {
                value: {
                    parentTemplate: ext || undefined
                }
            };
            this.setValue(value);
            this.trigger("change");
        }
    },
    
    // load styles and scripts from tea file
    reloadTea: function (callback) {
        var me = this;
        var frame = this.frame;
        
        var makefile = "";
        for (var i=0;i<me.options.styles.length;i++) {
            makefile += '@import "'+me.options.styles[i]+'";\n';
        }
        
        teacss.files["templater_makefile.tea"] = makefile;
        teacss.process("templater_makefile.tea", function() {
            teacss.tea.Style.insert(frame[0].contentWindow.document);
            teacss.tea.Script.insert(frame[0].contentWindow.document);
            
            me.updateHandles();
            
            if (teacss.image.getDeferred()) {
                teacss.image.update = function () { me.reloadTea(callback); }
            } else {
                if (callback && callback.call) callback();
            }
        },frame[0].contentWindow.document);            
    },
    
    // enable/disable layout edit mode where widgets can be modified
    layoutMode: function (enable) {
        if (!this.$f) return;
        // add special class to iframe body so layout controls will be shown
        if (enable)
            this.$f("body").addClass("edit-layout");
        else
            this.$f("body").removeClass("edit-layout");
    },
    
    // load template into preview, create all components
    // val - single template data
    setValue: function (val) {
        this._super(val);
        
        var me = this;
        me.componentsHash = {};
        var win = this.frame[0].contentWindow;
        var doc = win.document;
        var context = this.frame.contents();
        var $f = this.$f = function (what) { return teacss.jQuery(what,context); }
            
        // add style for component controls
        $f("head").find("script").remove();
        $f("#template_styles").remove();
        $f("head").append($("<link>",{id:"template_styles",rel:"stylesheet",type:"text/css",href:this_url+"/../frame.css"}))
        $f("body").html("");
        $f("body").append(
            me.handleContainer = $("<div>").addClass("handle-container")
        );
        me.handleContainer[0].ondragover = function(e) { me.dragOver(e); }
        me.handleContainer[0].ondrop = function (e) { me.drop(e); }
        me.handleContainer[0].ondragenter = function () {}
        me.handleContainer[0].ondragleave = function () {};
        me.dropHandle = false;
        
        this.toolbar.hide();
        if (!val || !val.template) return;
        this.toolbar.show();
        
        // create root element and DOM for it manually (it stands for body)
        var root = me.root = new Component(val.template.value);
        root.element = $f("body");
        root.area = $f("body");
        
        if (!me.sendEvents) {
            me.sendEvents = true;
            $f(doc).mousedown(function(e){
                me.frame.parent().trigger('mousedown');
            });
            $f(doc).mousemove(function(e){
                me.frame.parent().trigger(e);
            });
            $f("body").click(function(e){
                e.preventDefault();
            });
            
            function document_click(e) {
                if (me.contextMenu && me.contextMenu.panelClick) {
                    setTimeout(function() {
                        me.contextMenu.panelClick = false; 
                    },1);
                } else {
                    me.select(false);
                    me.showContextMenu(false);
                }
            }
            
            $f(doc).click(document_click);
            $(document).click(document_click);
            
            setInterval(function(e){
                me.updateHandles();
            },1000);
        }
        root.afterLoad();
        root.componentHandle.detach();
        
        var hash = false, root_data = val.template, inherit = false;
        
        // if template has a parent then load parent template and create substitution has from current one
        if (me.root.value.parentTemplate) {
            this.templateStatus.text("Child template for "+me.root.value.parentTemplate);
            
            hash = {};
            function findRoot(data,inherit) {
                if (data.value && data.value.parentTemplate) {
                    findRoot(Component.app.settings.templates[data.value.parentTemplate] || {},true);
                    if (data.children) $.each(data.children,function(){
                        if (this.value && this.value.id) hash[this.value.id] = {data:this,inherit:inherit};
                    });
                } else {
                    root_data = data;
                }
            }
            findRoot(val.template,false);
            inherit = root.inherited = true;
        } else {
            this.templateStatus.text("Standalone template");
        }
        
        // get all components into list recursively taking into account template inheritance
        var components = [];
        var component_values = [];
        function createComponents(parent,data,inherit) {
            if (data.children) {
                $.each(data.children,function(){
                    var ch_data = this;
                    var ch_inherit = inherit;
                    if (this.value && this.value.id && hash && hash[this.value.id]) {
                        ch_data = hash[this.value.id].data;
                        ch_inherit = hash[this.value.id].inherit;
                    }
                    
                    var cmp = new Component(this.value);
                    cmp.parent = parent;
                    cmp.inherited = ch_inherit;
                    
                    components.push(cmp);
                    component_values.push(cmp.value);
                    
                    createComponents(cmp,ch_data,ch_inherit);
                    
                    me.componentsHash[cmp.value.id] = cmp;
                });
            }
        }
        createComponents(root,root_data,inherit);
        
        var request = me.request = {};
        if (components.length) {
            me.setLoading(true);
            this.options.app.request("component",{
                values:component_values,
                dataSource: Component.previewFrame.value.data
            },function(data){
                if (me.request!=request) return;
                me.setLoading(false);
                $.each(components,function(i){
                    this.html = data[i].html;
                    this.form = data[i].form;
                    this.afterLoad();
                });
                me.reloadTea();
                me.trigger("loaded");
            });
        } else {
            me.reloadTea();
            me.trigger("loaded");
        }
    },
    
    updateHandles: function () {
        if (this.root) this.root.setHandleIndex();
    },
    
    select: function (cmp,e) {
        var me = this;
        if (e) e.stopPropagation();
        
        if (this.$f)
            this.$f(".component-handle").removeClass("selected");
        
        if (cmp==me.root) return;        
        
        for (var key in me.controlGroups) {
            var g = me.controlGroups[key];
            g.hide().find(">*:not(legend)").detach();
        }
        
        if (cmp) {
            cmp.componentHandle.addClass("selected");
            $.each(cmp.overlayControls || [],function(){
                cmp.componentHandle.append(this.element);
            });
        }
    },
    
    showContextMenu: function (cmp,e) {
        var me = this;
        if (cmp==me.root) cmp = false;
        
        var app = me.options.app;
        if (!me.contextMenu) {
            me.contextMenu = $("<div>").addClass("button-select-panel");
            me.contextMenu.appendTo(app.componentPanel.element);
            me.contextMenu.click(function(e){
                e.stopPropagation();
            });
            me.contextMenu.data("combo",me.contextMenu);
            me.contextMenu.getParentCombo = function () { return false; }
        }
        
        if (cmp) {
            app.sidebarTabs.select(app.componentPanel);
            me.contextMenu.children().detach();
            me.contextMenu.append(cmp.menu);
            
            var list = cmp.controls;
            if (cmp.controls && cmp.controls.length) {
                me.contextMenu.append($("<div class='combo-group'>").html("Styles"));
                $.each(cmp.controls,function(){
                    me.contextMenu.append(this.element);
                    if (this.options.comboDirection=='default') this.options.comboDirection = 'right';
                });            
            }
        } else {
            app.sidebarTabs.hide(app.componentPanel);
        }
    },
    
    setLoading: function (flag) {
        if (flag) {
            this.$f("body").append("<div class='loading-handle'>");
        } else {
            this.$f(".loading-handle").remove();
        }
    },
    
    getValue: function () {
        // get value for standalone component recursively
        function get(cmp) {
            var res = {};
            res.value = cmp.value;
            if (cmp.children.length) {
                res.children = [];
                $.each(cmp.children,function(){
                    if (this && this.type && this.type.name)
                        res.children.push(get(this));
                });
            }
            return res;
        }
        
        var ret;
        // for inherited template first gather redefined components and set them
        // as first level children
        if (this.root.inherited) {
            var ch = this.root.children;
            
            var own = [];
            function get_i(cmp) {
                if (!cmp.inherited) {
                    own.push(cmp);
                } else {
                    $.each(cmp.children,function(){ get_i(this); });
                }
            }
            get_i(this.root);
            this.root.children = own;
            ret = get(this.root);
            this.root.children = ch;
        } else {
            ret = get(this.root);
        }
        return {template:ret,data:this.value.data};
    },
    
    // drag scroll is a mechanism to scroll page up/down when dragging towards screen borders
    initDragScroll: function () {
        var me = this;
        if (!me.dragScroll) {
            me.dragScroll = {
                top: $("<div>").css({top:0}),
                bottom: $("<div>").css({bottom:0})
            }
            var both = me.dragScroll.both = $(me.dragScroll.top).add(me.dragScroll.bottom);
            var lastTop;
            var lastBottom;                
            
            both.css({position:"fixed",left:0,right:0,height:20,zIndex:99999});
            both.bind('dragenter', function(e) {
                return true;
            });
            both.bind('dragover', function(e) {
                if (me.$f('html,body').is(':animated')) return true;
                
                var win = me.frame[0].contentWindow;
                var doc = win.document;                    
    
                var scrollTop = $(win).scrollTop();
                var direction = (parseInt($(this).css('top'))==0)?-1:+1;
                var last = (direction==-1)?lastTop:lastBottom;
                var current = (direction==-1)?scrollTop:$(doc).height()-(scrollTop+$(win).height());
    
                if (last != undefined && last == current && current > 0) {
                    var newScrollTop = scrollTop+direction*50;
                    me.$f('html,body').animate({scrollTop: newScrollTop},0,'linear');
                }
                if (direction == -1) lastTop = current; else lastBottom = current;
                return true;
            });
            both.bind('mouseover', function(){ $(this).hide() });
        }
        me.dragScroll.both.show().appendTo(me.$f("body"));
    },
    
    // start drag, called from any draggable to show ui
    dragStart: function (event,what) {
        var me = this;
        if (!me.$f) return;
        me.dragging = true;
        me.initDragScroll();
        me.Class.draggable = me.draggable = what;
        
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = 300;
        canvas.height = 40;
        ctx.fillStyle = "blue";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        
        event.dataTransfer.setDragImage(canvas,0,0);
        event.dataTransfer.setData('text/plain',"componentDraggable");
        event.dataTransfer.effectAllowed = 'link';
        
        me.$f(".controls-handle").removeClass("visible");
        me.$f(".sort-handle").each(function(){
            var cmp = $(this).parent().data("component");
            if (what instanceof Component) {
                while (cmp) {
                    if (cmp==what) return;
                    cmp = cmp.parent;
                }
            }
            $(this).addClass("visible");
        });
        me.$f(".drop-handle").each(function(){
            var cmp = $(this).parent().data("component");
            if (cmp.children.length) return;
            if (what instanceof Component) {
                while (cmp) {
                    if (cmp==what) return;
                    cmp = cmp.parent;
                }
            }
            $(this).parent().addClass("visible");
        });
    },
    
    dragOver: function (e) {
        if (!this.dragging) return;
        e.preventDefault();
        
        function sqr(x) { return x * x }
        function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
        function distToSegmentSquared(p, v, w) {
          var l2 = dist2(v, w);
          if (l2 == 0) return dist2(p, v);
          var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
          if (t < 0) return dist2(p, v);
          if (t > 1) return dist2(p, w);
          return dist2(p, { x: v.x + t * (w.x - v.x),
                            y: v.y + t * (w.y - v.y) });
        }
        
        var min = false;
        function check_min(test) {
            var dist = distToSegmentSquared({x:e.pageX,y:e.pageY},{x:test.x0,y:test.y0},{x:test.x1,y:test.y1});
            if (!min || dist < min.dist) {
                test.dist = dist;
                min = test;
            }
        }
        
        var me = this;
        $.each(me.componentsHash,function(){
            if (me.draggable==this) return;
            
            var cmp = this;
            var el = this.componentHandle;
            var off = el.offset();
            var x0 = off.left;
            var y0 = off.top;
            var x1 = off.left + el.width();
            var y1 = off.top + el.height();
            
            check_min({x0:x0,y0:y0,x1:x1,y1:y0,cmp:cmp,type:"top"});
            check_min({x0:x0,y0:y0,x1:x0,y1:y1,cmp:cmp,type:"left"});
            check_min({x0:x1,y0:y0,x1:x1,y1:y1,cmp:cmp,type:"right"});
            check_min({x0:x0,y0:y1,x1:x1,y1:y1,cmp:cmp,type:"bottom"});
        });
        
        var list = [me.root];
        $.each(me.componentsHash,function(){list.push(this)});
        $.each(list,function(){
            var cmp = this;
            if (this.areaHandle && this.children.length==0) {
                var el = this.areaHandle.children().eq(0);
                var off = el.offset();
                if (!off) return;
                
                var w = el.outerWidth();
                var h = el.outerHeight();
                var x0 = off.left;
                var y0 = off.top;
                var x1 = off.left + w;
                var y1 = off.top + h;
                
                if (e.pageX > x0 && e.pageY > y0 && e.pageX < x1 && e.pageY < y1) {
                    var dist = w * h;
                    if (!min || min.type!="inside" || dist < min.dist) {
                        min = {type:"inside",cmp:cmp,dist:dist,x0:x0,y0:y0,x1:x1,y1:y1};
                    }
                }
            }
        });

        
        if (min) {
            if (!me.dropHandle) {
                me.dropHandle = $("<div>")
                    .addClass('drop-marker')
                    .appendTo(me.handleContainer);
            }
            me.dropHandle.stop().show().css({opacity:1,left:min.x0,top:min.y0,width:min.x1-min.x0,height:min.y1-min.y0});
            me.dropHandle.min = min;
        }
    },
    
    drop: function (e) {
        var me = this;
        me.dragging = false;
        e.preventDefault();
        if (e.dataTransfer.getData("text/plain")!="componentDraggable") return;
        if (!me.dropHandle || !me.dropHandle.min) return;
        
        var min = me.dropHandle.min;
        var cmp = min.cmp;
        if (me.draggable==cmp) return;
        
        var parent = cmp.parent, index;
        if (min.type=="inside") {
            parent = cmp;
        }
        if (min.type=="left" || min.type=="top") {
            index = {before:cmp};
        }
        if (min.type=="right") {
            index = {after:cmp};
        }
        if (min.type=="bottom") {
            index = {after:cmp};
            var i = parent.children.indexOf(cmp) + 1;
            for (;i<parent.children.length;i++) {
                var ch = parent.children[i];
                if (ch==me.draggable) continue;
                var el = ch.componentHandle;
                if (el.offset().top + el.height() > min.y0) break;
                index = {after:ch};
            }
        }
        
        var draggable = me.draggable;
        if (draggable.create) {
            var cmp_new = new Component({type:draggable.type.id});
            cmp_new.load(parent,index);
            me.componentsHash[cmp_new.value.id] = cmp_new;
        } else {
            cmp_new = draggable;
            draggable.position(parent,index);
        }
        
        var el = cmp_new.element;
        var off = el.offset();
        me.dropHandle.stop().animate({left:off.left,top:off.top,width:el.outerWidth(),height:el.outerHeight()},600,function(){
            me.trigger("change");
        });
        me.root.setHandleIndex();
    },
    
    // hide drag ui
    dragEnd: function () {
        var me = this;
        if (me.dropHandle) me.dropHandle.animate({opacity:0},600,function(){ $(this).hide() });
        me.dragging = false;
        me.$f(".controls-handle").addClass("visible");
        me.$f(".sort-handle").removeClass("visible");
        me.$f(".area-handle").removeClass("visible");
        if (me.dragScroll) me.dragScroll.both.hide();
    }
});