// Component is representation of template chunk with it's data and DOM
var Component = window.Component = $.Class.extend({
    baseId: (new Date()).getTime()
},{
    // constructor, children added later
    init: function (val) {
        this.value = val || {};
        this.styleControls = [];
        this.zIndex = 100;
        
        // unique id
        if (!this.value.id) 
            this.value.id = "id" + Component.baseId++;
            
        this.children = [];
        // save link to component type
        if (val && val.type) {
            this.type = Component.app.settings.components[val.type];
        }
        this.type = this.type || {};
    },
    
    // load single component data (used when user DnDs new component)
    load: function (parent,index) {
        this.parent = parent;
        this.index = index;
        // position before load, so we can get valid data from component
        this.position();
        
        // load the default zero state for component width data source = null
        var me = this;        
        me.html = this.type.new.html;
        me.form = this.type.new.form;
        me.afterLoad();

        // if component type is not static = zero state depends on data source
        // then make a request to get right state
        if (!this.type.static) {
            Component.app.request("component",{
                values:[this.value],
                dataSource: Component.previewFrame.value.data
            },function(data){
                var old_element = me.element;
                delete me.element;
                delete me.area;
                
                me.html = data[0].html;
                me.form = data[0].form;
                me.afterLoad(old_element);
            });
        }
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
            this.menu = $("<div>").append("<div class='combo-group'>"+this.type.name+"</div>");
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
        
        var me = this;
        
        // extra div for selection and other handles
        Component.previewFrame.handleContainer.append(
            me.componentHandle = $("<div class='component-handle'>").data("component",this)
            .click(function(e){
                Component.previewFrame.select(me,e);
                Component.previewFrame.showContextMenu(me,e);
            })
            .append(
                this.controlPanel = $("<div class='controls-handle visible'>")
            ),
            me.areaHandle = $("<div class='area-handle'>")
        );
    
        // we can drop components on this area
        if (this.area && !this.inherited) this.areaHandle.data("component",this).append(
            $("<div class='drop-handle'>")
        );
        
        // for inherited components we can redefine them in current template
        if (this.area && this.inherited) this.menu.append(
            $("<div class='combo-item'>").html("Redefine").click(function(){ 
                Component.app.previewFrame.select(false);
                Component.app.previewFrame.showContextMenu(false);
                me.redefine(); 
            })
        );
        // or cancel this redefine to get original children
        if (this.area && !this.inherited && this.parent && this.parent.inherited) this.menu.append(
            $("<div class='combo-item'>").html("Undefine").click(function(){ 
                Component.app.previewFrame.select(false);
                Component.app.previewFrame.showContextMenu(false);
                me.undefine(); 
            })
        );
        
        // drag to drop somewhere later
        if (this.parent && !this.inherited && !this.parent.inherited)
            me.componentHandle.each(function(){
                this.draggable = true;
                this.ondragstart = function (e) { return Component.app.previewFrame.dragStart(e,me); }
                this.ondragend = function (e) { Component.app.previewFrame.dragEnd(); }
                $(this).addClass("drag-handle");
            })
        
        // we can edit component parameters in separate dialog
        if (this.form && !this.inherited && this.parent && !this.parent.inherited) this.menu.append(
            $("<div class='combo-item'>").html("Edit").click(function(){ 
                Component.app.previewFrame.select(false);
                Component.app.previewFrame.showContextMenu(false);
                me.edit(); 
            })
        );
        
        if (this.parent) {
            if (!this.inherited && !this.parent.inherited) me.componentHandle.append(
                // drop in to append before or after
                $("<div class='sort-handle'>")
            )
            
            // remove component    
            if (!this.inherited && !this.parent.inherited) this.menu.append(
                $("<div class='combo-item'>").html("Remove").click(function(){
                    Component.app.previewFrame.select(false);
                    Component.app.previewFrame.showContextMenu(false);
                    me.remove();
                })
            )

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
            
            this.setHandleIndex();
        }
    },
    
    setHandleIndex: function (immediate) {
        if (this.parent)
            this.zIndex = this.parent.zIndex + this.parent.children.indexOf(this) + 3;
        else
            this.zIndex = 100;
        
        var me = this;
        var update = function(){
            var off = me.element.offset();
            if (!off) off = {};
            me.componentHandle.css({
                zIndex:me.zIndex,
                left: off.left,
                top: off.top,
                width: me.element.outerWidth(),
                height: me.element.outerHeight()
            });
            
            if (me.areaHandle && me.area) {
                var off = me.area.offset();
                me.areaHandle.css({
                    zIndex: me.zIndex + 1,
                    left: off.left,
                    top: off.top,
                    width: Math.max(0,me.area.outerWidth()-2),
                    height: Math.max(0,me.area.outerHeight()-2)
                })
            }
        }
        
        if (me.element) {
            if (immediate) update(); else setTimeout(update,1);
        }
        
        $.each(this.children,function(){
            this.setHandleIndex();
        });
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
        this.componentHandle.remove();
        if (this.areaHandle) this.areaHandle.remove();
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