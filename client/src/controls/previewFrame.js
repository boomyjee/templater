// Component is representation of template chunk with it's data and DOM
var Component = window.Component = $.Class.extend({
    baseId: (new Date()).getTime()
},{
    // constructor, children added later
    init: function (val) {
        this.value = val || {};
        this.styleControls = [];
        
        // unique id
        if (!this.value.id) 
            this.value.id = "id" + Component.baseId++;
            
        this.children = [];
        // save link to component type
        if (val && val.type) {
            this.type = Component.app.settings.components[val.type];
        }
    },
    
    // load single component data (used when user DnDs new component)
    load: function (parent,index) {
        this.parent = parent;
        this.index = index;
        // position before load, so we can get valid data from component
        this.position();
        
        var me = this;
        Component.app.request("component",{
            values:[this.value],
            dataSource: Component.previewFrame.value.data
        },function(data){
            me.html = data[0].html;
            me.form = data[0].form;
            me.afterLoad();
        });
    },
    
    // common code for all droppables (drop-handle and sort-handle)
    initDroppable: function (el,drop) {
        el = $(el);
        el.each(function(){
            this.ondragenter = function () {
                $(this).addClass("drag-over");
            }
            this.ondragover = function (e) {
                e.preventDefault();
            }
            this.ondragleave = function () {
                $(this).removeClass("drag-over");
            }
            this.ondrop = function (e) {
                e.preventDefault();
                $(this).removeClass("drag-over");
                if (e.dataTransfer.getData("text/plain")!="componentDraggable") return;
                if (drop) drop.call(this,e);
                Component.previewFrame.trigger("change");
            }                        
        });
        return el;
    },
    
    // run on component change or directly after data is loaded to create DOM and controls
    // old_element - true if no reposition is done or $ selector if element needs to be substituted
    afterLoad: function (old_element) {
        
        // create DOM for component
        if (!this.element) {
            this.scripts = [];
            var fragment = $.buildFragment([this.html],[document],this.scripts);
            this.element = $(this.html).eq(0);
            
            if (!this.element.attr("id"))
                this.element.attr("id",this.value.id);
            
            this.element.find("br.component-area").remove();
            this.element.data("component",this);
        }
        
        // and get container for child components
        if (!this.area && this.type && this.type.area) {
            // if type param is just true, then container is the element itself
            if (this.type.area===true) 
                this.area = this.element;
            // else it's an a selector
            else
                this.area = this.element.find(this.type.area).eq(0);
        }
        if (this.area)
            this.area.data("area-component",this);
        
        var me = this;
    
        // we can drop components on this area
        if (this.area && !this.inherited) this.area.addClass("area-handle").append(
            this.initDroppable("<div class='drop-handle'>",function(){
                var draggable = ui.previewFrame.draggable;
                if (draggable.create) {
                    var cmp = new Component({type:draggable.type.id});
                    cmp.load(me);
                } else {
                    draggable.position(me,undefined);
                }
            })
        );
        
        var timer;
        function showOverlay() {
            if (!me.controls || !me.controls.length) return;
            if (!me.componentOverlay) {
                me.componentOverlay = $("<div>").addClass("component-overlay");
                me.componentOverlay.appendTo(teacss.ui.layer);
                me.componentOverlay
                    .mouseover(function() { clearTimeout(timer); })
                    .mouseout(function() { timer = setTimeout(hideOverlay,1); })
            }
            
            var off = me.element.offset();
            var i_off = Component.previewFrame.frame.offset();
            
            me.componentOverlay.show();
            me.componentOverlay.css({
                position: 'absolute',
                top: i_off.top + off.top,
                left: i_off.left + off.left,
                width: $(this).width(),
                height: 0,
                background: 'red',
                zIndex: 900
            });
            
            for (var i=0;i<me.controls.length;i++) {
                var ctl = me.controls[i];
                me.componentOverlay.append(ctl.element);
                
            }
            me.componentHandle.addClass("hover");
        }
        
        function hideOverlay() {
            if (me.componentOverlay) me.componentOverlay.hide();
            me.componentHandle.removeClass("hover");
        }
        
        
        // extra div for dashed border and one for controls
        this.element.append(
            me.componentHandle = $("<div class='component-handle'>")
                .mouseover(function() { clearTimeout(timer); showOverlay(); })
                .mouseout(function() { timer = setTimeout(hideOverlay,1); })
                .click(function (){
                    Component.previewFrame.$f(".component-handle").removeClass("selected");
                    me.componentHandle.addClass("selected");
                })
            .append(
                this.controls = $("<div class='controls-handle visible'>")
            )
        );
        
        // for inherited components we can redefine them in current template
        if (this.area && this.inherited) this.controls.append(
            $("<div class='redefine-handle'>").click(function(){ me.redefine(); })
        );
        // or cancel this redefine to get original children
        if (this.area && !this.inherited && this.parent && this.parent.inherited) this.controls.append(
            $("<div class='undefine-handle'>").click(function(){ me.undefine(); })
        );
        
        // drag to drop somewhere later
        if (this.parent && !this.inherited && !this.parent.inherited)
            this.element.children(".component-handle").each(function(){
                this.draggable = true;
                this.ondragstart = function (e) { return Component.app.previewFrame.dragStart(e,me); }
                this.ondragend = function (e) { Component.app.previewFrame.dragEnd(); }
                $(this).addClass("drag-handle");
            })
        
        // we can edit component parameters in separate dialog
        /*if (this.form && !this.inherited && this.parent && !this.parent.inherited) this.controls.append(
            $("<div class='edit-handle visible'>").click(function(){ me.edit(); })
        );*/
        
        if (this.parent) {
            if (!this.inherited && !this.parent.inherited) this.element.append(
                // drop in to append before or after
                this.initDroppable("<div class='sort-handle'>",function(e){
                    var draggable = ui.previewFrame.draggable;
                    var before = e.clientY - $(this).offset().top < $(this).height()*0.5;
                    var index = before ? {before:me} : {after:me};
                    if (draggable.create) {
                        var cmp = new Component({type:draggable.type.id});
                        cmp.load(me.parent,index);
                        Component.previewFrame.componentsHash[cmp.value.id] = cmp;
                    } else {
                        draggable.position(me.parent,index);
                    }
                })
            )
            
            // remove component    
            /*if (!this.inherited && !this.parent.inherited) this.controls.append(
                $("<div class='close-handle'>").click(function(){
                    me.remove();
                })
            )*/                

            if (this.element.css("position")!="absolute") this.element.css("position","relative");
            this.element.css({minHeight:20});

            // replace DOM if needed
            if (old_element) {
                if (old_element.replaceWith) {
                    old_element.replaceWith(this.element);
                    $.each(this.children,function(){
                        me.area.append(this.element);
                    });
                }
            } else
                this.position();
        }
    },
    
    // reposition component in tree, if parent is set then it will be used
    position: function (parent,index) {
        var i = this.parent.children.indexOf(this);
        if (i>=0) this.parent.children.splice(i,1);
        
        if (parent) {
            this.parent = parent;
            this.index = index;
        }
        
        if (this.index===undefined) {
            this.parent.children.push(this);
            this.parent.area.append(this.element);
            
            if (this.scripts && this.scripts.length) {
                var me = this;
                setTimeout(function(){
                    var doc = Component.previewFrame.frame[0].contentWindow.document;
                    var head = doc.head || doc.getElementsByTagName('head')[0];
                    var loader = teacss.LazyLoad_f(doc);
                    
                    var q = teacss.queue(1);
                    for (var s=0;s<me.scripts.length;s++) {
                        var script = me.scripts[s];
                        if (script.src) {
                            q.defer(function(what,done){
                                loader.js([what],function(){
                                    done();
                                });
                            },script.src);
                        } else {
                            q.defer(function (code,done){
                                el = doc.createElement("script");
                                el.innerHTML = code;
                                head.appendChild(el);
                                done();
                            },script.innerHTML);                            
                        }
                    }
                    q.await(function(){});
                    me.scripts = [];
                },1);
            }
        } else {
            var i = this.parent.children.indexOf(this.index.before || this.index.after);
            if (this.index.before) {
                this.parent.children.splice(i,0,this);
                this.index.before.element.before(this.element);
            } else {
                if (i==this.parent.children.length-1)
                    this.parent.children.push(this);
                else
                    this.parent.children.splice(i+1,0,this);
                this.index.after.element.after(this.element);
            }
        }
    },
    
    // redefine component in child template
    redefine: function () {
        // just empty children and mark inherited as false
        this.inherited = false;
        this.children = [];
        this.area.empty();
        this.afterLoad(true);
        this.element.find(".redefine-handle").remove();
        Component.previewFrame.trigger("change");
    },
    
    // cancel component redefine
    undefine: function () {
        // completely reload template because some data from parent template may be missing
        this.remove();
        Component.previewFrame.trigger("change");
        var pf = Component.previewFrame;
        pf.setValue(pf.getValue());
    },
    
    // remove component
    remove: function() {
        // just remove from parent.children and remove DOM
        var i = this.parent.children.indexOf(this);
        if (i>=0) this.parent.children.splice(i,1);
        this.element.detach();
        Component.previewFrame.trigger("change");
    },
    
    // show dialog for component edit
    edit: function () {
        var me = this;
        if (!me.dialog) {
            
            var width = 600;
            if (me.form && me.form.control && me.form.width)
                width = me.form.width;
            
            me.dialog = teacss.ui.dialog({
                modal: true,
                resizable: false,
                width: width,
                title: me.type.name,
                dialogClass: "component-form",
                buttons: {
                    "Save" : function () {
                        if (me.dialog.control) {
                            var value = me.dialog.control.getValue();
                        } else {
                            var value = $.extend({id:me.value.id,type:me.value.type},me.dialog.element.find(":input").serializeObject());
                        }
                        
                        $(this).dialog("close");
                        
                        // send request to server to get new form and html
                        Component.app.request("component",{
                            values:[value],
                            dataSource: Component.previewFrame.value.data
                        },function(data){
                            me.html = data[0].html;
                            me.form = data[0].form;
                            me.value = data[0].value;
                            var old_element = me.element;
                            
                            delete me.element;
                            delete me.area;
                            
                            // if all is OK, recreate element and replace old DOM with a new one
                            me.afterLoad(old_element);
                            Component.previewFrame.trigger("change");
                        });                        
                    },
                    "Cancel": function () {
                        $(this).dialog("close");
                    }
                }
            });
            
            if (me.form && me.form.control) {
                me.dialog.control = eval(me.form.control)();
                me.dialog.push(me.dialog.control);
            }
        }
        
        if (me.dialog.control) {
            me.dialog.control.form = me.form;
            me.dialog.control.setValue(me.value);
        } else {
            me.dialog.element.html("");
            me.dialog.push(me.form);
            me.dialog.element.each(function(){
                var dlg = this;
                $(dlg).find("[data-value]").each(function(){
                    var value = $.parseJSON($(this).attr("data-value"));
                    var name = $(this).attr("data-name");
                    var tpl = $(this);
                    var dummy = $("<span>");
                    tpl.removeAttr("data-value");
                    tpl.replaceWith(dummy);

                    var cnt = 0;
                    function addItem(value) {
                        var item = tpl.clone();
                        dummy.before(item);
                        item.find("[name]").each(function(){
                            var s = $(this).attr("name");
                            $(this).attr("name", name+"[item_"+cnt+"]["+s+"]");
                            if (value && value[s]) $(this).val(value[s]);
                        });
                        item.find(".remove").click(function(e){
                            e.preventDefault();
                            item.remove();
                        });
                        cnt++;
                    }
                    
                    for (var i=0;i<value.length;i++) addItem(value[i]);
                    $(dlg).find(".add[data-name='"+name+"']").click(function(e){
                        e.preventDefault();
                        addItem();
                    });
                });
            });
        }
        me.dialog.open();
    }    
});

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
            .css({position:"absolute",left:0,right:0,top:0,height:99,lineHeight:"18px",
                  borderBottom:"1px solid #aaa",padding:"0",color:"#555"})
            .appendTo(this.element);
        
        var fs;
        this.toolbar.append(
            fs = $("<fieldset>").append(
                $("<legend>").html("Template")
            )
        );
        
        fs.append(
            $("<label>").html("Template parent:").css({marginTop:20,display:'block'}),
            this.templateStatus = $("<a href='#' class='template-status'>").click(function(e){
                e.preventDefault();
                me.editParentTemplate();
            })
        );
            
        this.frameWrapper = $("<div>")
            .css({position:"absolute",left:0,right:0,top:100,bottom:0})
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
        $f("body").click(function(e){e.preventDefault();});
        
        this.toolbar.hide();
        if (!val || !val.template) return;
        this.toolbar.show();
        
        // create root element and DOM for it manually (it stands for body)
        var root = me.root = new Component(val.template.value);
        root.element = $f("body");
        root.area = $f("body");
        root.afterLoad();
        
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
            if (what && what.element && $(this).parents().index(what.element) >= 0) return;
            $(this).addClass("visible");
        });
        me.$f(".drop-handle").each(function(){
            var cmp = $(this).parent().data("area-component");
            if (cmp.children.length) return;
            if (what && what.element && $(this).parents().index(what.element) >= 0) return;
            
            $(this).addClass("visible");
            if ($(this).parent().css("position")!="absolute") $(this).parent().css("position","relative");
        });
    },
    
    // hide drag ui
    dragEnd: function () {
        var me = this;
        me.$f(".controls-handle").addClass("visible");
        me.$f(".sort-handle").removeClass("visible");
        me.$f(".drop-handle").removeClass("visible");
        if (me.dragScroll) me.dragScroll.both.hide();
    }
});