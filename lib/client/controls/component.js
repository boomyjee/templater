var $ = teacss.jQuery;

// Component is representation of template chunk with it's data and DOM
var Component = window.Component = $.Class.extend({
    baseId: (new Date()).getTime(),
    load: function (list,callback) {
        var components = [];
        var component_values = [];
        $.each(list,function(){
            if (!this.type) return;
            components.push(this);
            component_values.push(this.value);
        });
        
        var request = Component.request = {};
        if (components.length) {
            Component.app.request("component",{
                values:JSON.stringify(component_values)
            },function(data){
                if (Component.request!=request) return;
                $.each(components,function(i){
                    this.html = data[i].html;
                    this.form = data[i].form;
                });
                loaded();
            });
        } else {
            loaded();
        }        
        
        function loaded() {
            $.each(list,function(){
                this.afterLoad();
            });
            if (callback) callback();
        }
    },
    classFromName: function (name) {
        var parts = name.split(".");
        var name0 = parts[0];
        var cls;
        if (name0=='ui') {
            cls = teacss.ui;
        } else {
            cls = window[name0];
        }
        if (cls) {
            for (var i=1;i<parts.length;i++) {
                if (cls) cls = cls[parts[i]];
            }
        }
        if (!cls) throw new Error("Can't find class for name: "+name);
        return cls;
    }
},{
    // constructor, children added later
    init: function (val) {
        this.value = val || {};
        this.styleControls = [];
        this.zIndex = 100;
        
        // unique id
        if (!this.value.id) 
        {
            this.value.id = 'id'+(++this.Class.baseId);
        }
            
        this.children = [];
        // save link to component type
        if (val && val.type) {
            this.type = Component.app.components[val.type];
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
        this.html = this.type.new.html;
        this.form = this.type.new.form;
        this.afterLoad();
    },    
    
    // run on component change or directly after data is loaded to create DOM and controls
    // old_element - true if no reposition is done or $ selector if element needs to be substituted
    afterLoad: function (old_element) {
        
        // create DOM for component
        if (!this.element) {
            this.scripts = [];
            var fragment = $.buildFragment([this.html],document,this.scripts);
            this.element = $(this.html,Component.previewFrame.document).eq(0);
            
            if (!this.element.attr("id"))
                this.element.attr("id",this.value.id);
            
            this.element.find("br.component-area").remove();
            this.element.data("component",this);
            
            
            var typeLink;
            // we can change type of a component
            if (!this.inherited && this.parent && !this.parent.inherited) {
                typeLink = $("<a href='#'>").text(this.type.name).click(function(e){
                    e.preventDefault();
                    me.changeType();
                });
            } else {
                typeLink = $("<span>").text(this.type.name);
            }
            
            var closeLink = false;
            // remove component    
            if (this.parent && !this.inherited && !this.parent.inherited) {
                closeLink = $("<a href='#' class='close-link'>").text("del").click(function(e){
                    e.preventDefault();
                    Component.previewFrame.select(false);
                    me.remove();
                });
            } 
            
            var editLink = false;
            // we can edit component parameters in separate dialog
            if (this.form && !this.inherited && this.parent && !this.parent.inherited) {
                editLink = $("<a href='#' class='edit-link'>").text("edit").click(function(e){
                    e.preventDefault();
                    Component.previewFrame.select(false);
                    me.edit(); 
                });
            }
            
            var cloneLink = false;
            // we can clone component
            if (!this.inherited && this.parent && !this.parent.inherited) {
                cloneLink = $("<a href='#' class='edit-link'>").text("copy").click(function(e){
                    e.preventDefault();
                    me.clone(); 
                });
            }            
            
            this.menu = $("<div>").append(
                $("<div class='combo-group'>").append(
                    closeLink,
                    cloneLink,
                    editLink,
                    typeLink,
                    "<span>&nbsp;</span>",
                    this.idLink = $("<a href='#'>").text("#"+this.value.id).click(function(e){
                        e.preventDefault();
                        me.changeId();
                    })
                )
            );
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
        if (me.componentHandle) me.componentHandle.detach();
        if (me.parentComponentHandle) {
            me.parentComponentHandle.remove();
            delete me.parentComponentHandle;
        }
        
        if (this.type && this.type.area) {
            me.parentComponentHandle = $("<div class='parent-component-handle'>")
                .text("Parent")
                .click(function(e){
                    Component.previewFrame.select(me,e);
                });
        }
        
        // extra div for selection and other handles
        if (me.parent)  {
            me.componentHandle = $("<div class='component-handle'>").data("component",this)
                .click(function(e){
                    Component.previewFrame.select(me,e);
                })
                .append(
                    me.headingHandle = $("<div class='component-heading'>").html(this.type.name || "Root"),
                    me.controlsBack = $("<div class='controls-back'>").append(
                    ),
                    me.controlsCenter = $("<div class='controls-center'>").append(
                        me.addInsideButton = $("<span>+</span>").attr({title:'Add into this area'}).click(function(e){ 
                            me.addInside(e);
                        })
                    ),
                    me.controlsTop = $("<div class='controls-top'>").append(
                        me.addTopButton = $("<span>+</span>").attr({title:'Add before this component'}).click(function(e){ me.addTop(e) })
                    ),
                    me.controlsBottom = $("<div class='controls-bottom'>").append(
                        me.addBottomButton = $("<span>+</span>").attr({title:'Add after this component'}).click(function(e){ me.addBottom(e) })
                    ),
                    me.controlsLeft = $("<div class='controls-left'>").append(
                    ),
                    me.controlsRight = $("<div class='controls-right'>").append(
                    )
                );
        } else {
            me.componentHandle = $("<div class='controls-root'>");
            if (!me.inherited) me.componentHandle.append(
                $("<div class='add-section'>").append(
                    $("<span>").text(_t("Add Section")).click(function(e){ me.addInside(e) })
                )
            );
        }
        
        Component.previewFrame.handleContainer.append(me.componentHandle);
        Component.previewFrame.handleContainer.append(me.parentComponentHandle);
        
        // for inherited components we can redefine them in current template
        if (this.area && this.inherited && this.menu) this.menu.append(
            me.redefineHandle = $("<div class='combo-item'>").html("Redefine").click(function(){ 
                Component.previewFrame.select(false);
                me.redefine(); 
            })
        );
        // or cancel this redefine to get original children
        if (this.area && !this.inherited && this.parent && this.parent.inherited && this.menu) this.menu.append(
            $("<div class='combo-item'>").html("Undefine").click(function(){ 
                Component.previewFrame.select(false);
                me.undefine(); 
            })
        );
        
        // drag to drop somewhere later
        if (this.parent && !this.inherited && !this.parent.inherited)
            me.headingHandle.add(me.addTopButton).each(function(){
                $(this).addClass("draggable");
                $(this).data("component",me);
            })
            
            
        // select children on dblclick if they overlap (helpful for absolute positioned elements)
        if (this.parent) this.componentHandle.dblclick(function(e){ me.selectNext(e) });
        
        // we can edit component parameters in separate dialog
        if (this.form && !this.inherited && this.parent && !this.parent.inherited) {
            me.headingHandle.dblclick(function(){
                Component.previewFrame.select(false);
                me.edit(); 
                return false;
            });
        }

        if (this.parent) {
            if (!this.inherited && !this.parent.inherited) me.componentHandle.append(
                // drop in to append before or after
                $("<div class='sort-handle'>")
            )
            
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
        
        if (this.type.clientControl && !this.clientControl) {
            me.clientControl = Component.classFromName(this.type.clientControl)({cmp:me});
            me.clientControl.bind("change",function(){
                me.value = me.clientControl.getValue();
                
                clearTimeout(me.saveTimeout);
                me.saveTimeout = setTimeout(function(){
                    Component.previewFrame.trigger("change");
                },500);
            });
        }
        if (me.clientControl) {
            me.clientControl.setValue(me.value);
        }
    },
    
    // update controls and component handles positions and zIndex
    setHandleIndex: function (immediate,skipChildren) {
        if (this.parent)
            this.zIndex = this.parent.zIndex + this.parent.children.indexOf(this) + 3;
        else
            this.zIndex = 100;
        
        var me = this;
        var update = function(){
            var off = me.element.offset();
            var body_off = {left:0,top:0};
            
            if (!off) off = {};
            if (!body_off) body_off = {};
            
            if (me.element.is("body")) off.top = 0;
            
            var sx = me.elementScale ? me.elementScale.x : 1;
            var sy = me.elementScale ? me.elementScale.y : 1;
            
            var w = me.element.outerWidth();
            var h = me.element.outerHeight();
            
            if (me.parentComponentHandle) {
                var left = Math.floor(off.left - body_off.left)+"px";
                var top = Math.floor(off.top - body_off.top + h * sy)+"px";
                var el = me.parentComponentHandle[0];
                if (el.style.left!=left) el.style.left = left;
                if (el.style.top!=top) el.style.top = top;
            };
            
            if (me.componentHandle) {
                var el = me.componentHandle[0];
                var hash = {
                    zIndex: me.zIndex,
                    left: Math.floor(off.left - body_off.left)+"px",
                    top: Math.floor(off.top - body_off.top)+"px",
                    width: Math.floor(w * sx)+"px",
                    height: Math.floor(h * sy)+"px"
                }

                for (var key in hash) {
                    if (el.style[key]!=hash[key]) el.style[key] = hash[key];
                }
            }
        }
        
        if (me.element) {
            if (immediate) update(); else setTimeout(update,1);
        }
        
        if (!skipChildren) $.each(this.children,function(){
            this.setHandleIndex(immediate);
        });
    },
    
    selectNext: function (e) {
        var cmp = this;
        var before = [];
        var after = [];
        var afterFlag = false;
        $.each(cmp.parent.children,function(i,other){
            if (other==cmp) {
                afterFlag = true;
            } else {
                if (afterFlag) 
                    after.push(other);
                else
                    before.push(other);
            }
        });

        var list = after.concat(before);
        $.each(list,function(i,other){
            var el = other.element;
            var off = el.offset();
            var w = el.outerWidth();
            var h = el.outerHeight();
            var x = e.pageX;
            var y = e.pageY;

            if (x >= off.left && x <= off.left+w && y >= off.top && y <= off.top+h) {
                Component.previewFrame.select(other);
                return false;
            }
        });
    },
            
    // reposition component in tree, if parent is set then it will be used
    position: function (parent,index) {
        if (this.parent) {
            var i = this.parent.children.indexOf(this);
            if (i>=0) this.parent.children.splice(i,1);
        }
        
        if (parent) {
            this.parent = parent;
            this.index = index;
        }
        
        if (this.index===undefined) {
            this.parent.children.push(this);
            if (this.parent.area)
                this.parent.area.append(this.element);
            else
                console.debug('No area for',this);
            
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
        for (var i=0;i<this.children.length;i++) this.children[i].remove();
        this.children = [];
        this.area.empty();
        this.afterLoad(true);
        this.redefineHandle.remove();
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
        for (var i=0;i<this.children.length;i++) this.children[i].remove();
        this.removeControls();
        Component.previewFrame.root.setHandleIndex();
    },
    
    // remove controls
    removeControls: function () {
        if (this.controls && this.hasControls) {
            $.each(this.controls,function(i,ctl){
                if (ctl.form) {
                    var index = ctl.form.items.indexOf(ctl);
                    if (index!=-1) ctl.form.items.splice(index, 1);                    
                }
                ctl.element.remove();
            });
            this.hasControls = false;
            this.controls = [];
        }
    },
    
    clone: function () {
        
        var list = [];
        // function to clone component recursively
        function clone(cmp) {
            var val = $.extend(true,{},cmp.value);
            delete val.id;
            
            // create a new component based on same value but with new id
            var cloned = new Component(val);
            cloned.html = cmp.html;
            cloned.form = cmp.form;
            
            // clone styles
            var theme = Component.app.settings.theme;
            if (theme.cmp) {
                theme.cmp[cloned.value.id] = $.extend(true,{},theme.cmp[cmp.value.id]);
            }
            list.push(cloned);
            
            $.each(cmp.children,function(i,ch){
                var ch_cloned = clone(ch);
                ch_cloned.parent = cloned;
                cloned.children.push(ch_cloned);
            });
            return cloned;
        }
        
        // load top clone first and add it to DOM
        var cmp = clone(this);
        cmp.parent = this.parent;
        cmp.afterLoad();
        Component.previewFrame.dropComponent({type:'after',cmp:this},cmp);
        
        $.each(list,function(i,ch){
            // create DOM for child components
            if (ch!=cmp) ch.afterLoad();
            // register into hash
            Component.previewFrame.componentsHash[ch.value.id] = ch;
        });
        
        // select cloned component
        Component.previewFrame.select(cmp);
        Component.previewFrame.trigger("change");
    },
    
    addComponent: function (e,type,skipType) {
        e.preventDefault();
        
        // dropping silently without Select Type dialog
        if ((skipType || e.ctrlKey) && Component.app.options.allowSkipType) {
            var new_cmp = Component.previewFrame.dropComponent(
                { type:type,cmp:this},
                { create: true, type: { id: 'container'} }
            );
            Component.previewFrame.trigger("change");
            Component.previewFrame.select(new_cmp);
        } else {
            // or show dialog first
            this.changeType({type:type,cmp:this});
        }
    },
    
    addInside: function (e) {
        this.addComponent(e,'inside',this==Component.previewFrame.root);
    },
    
    addTop: function (e) {
        this.addComponent(e,'left',this.parent==Component.previewFrame.root);
    },
    
    addBottom: function (e) {
        this.addComponent(e,'right',this.parent==Component.previewFrame.root);
    },
    
    changeId: function () {
        var newId;
        var cmp = this;
        // prompt for new id
        if (newId = prompt("Enter new id",cmp.value.id)) {
            if (newId!=cmp.value.id) {
                var busy = false;
                // check if new id is not already taken
                $.each(Component.app.settings.templates,function(){
                    $.each_deep(this,function(){
                        if (this && this.value && this.value.id==newId) busy = true;
                    });
                });
                
                if (busy) {
                    alert("This id is already taken");
                } else {
                    // change id
                    var oldId = cmp.value.id;
                    cmp.value.id = newId;
                    cmp.element.attr("id",newId);
                    cmp.idLink.text("#"+newId);
                    cmp.removeControls();
                    
                    // change styles for this id
                    var form_val = Component.app.form.value;
                    $.each(form_val,function(i,space){
                        if (this[oldId]) {
                            this[newId] = this[oldId];
                            delete this[oldId];
                        }
                    });
                    Component.app.form.setValue(form_val);
                    Component.app.form.trigger("change");
                    Component.app.updateComponentUI(cmp);
                    Component.previewFrame.select(cmp);
                }
            }
        }
    },
    
    changeType: function (handle) {
        if (!Component.typeDialog) {
            Component.typeDialog = teacss.ui.dialog({
                modal: true,
                resizable: false,
                draggable: false,
                width: 600,
                dialogClass: 'change-type-dialog',
                title: _t("Select component type")
            });
            
            var types = Component.app.components;
            var by_cat = {};
            for (var id in types) {
                var type = types[id];
                if (!by_cat[type.category]) by_cat[type.category] = [];
                by_cat[type.category].push(type);
            }   
            
            var div = $("<div style='position:relative !important;'>")
                .addClass('button-select-panel')
                .click(function(e){
                    e.stopPropagation();
                })
            
            Component.typeDialog.element.css({padding:0}).append(div);
            div.append(div = $("<div>"));
            
            for (var cat in by_cat) {
                div.append("<div class='combo-group'>"+cat+"</div>");
                $.each(by_cat[cat],function(){
                    var type = this;
                    var item = 
                        $("<div class='combo-item'>").html(type.name).click(function(){
                            
                            var handle = Component.typeDialog.handle;
                            var me = Component.typeDialog.cmp;
                            
                            var new_cmp;
                            if (handle) {
                                new_cmp = Component.previewFrame.dropComponent(handle,{create:true,type:type});
                            } else {
                                me.hasControls = false;
                                me.controls = [];
                                me.value = {id:me.value.id, type:type.id};
                                me.type = type;

                                var old_element = me.element;

                                delete me.element;
                                delete me.area;

                                me.html = me.type.new.html;
                                me.form = me.type.new.form;
                                me.afterLoad(old_element);
                            }
                            
                            Component.previewFrame.reloadScript = true;
                            Component.previewFrame.trigger("change");
                            Component.previewFrame.select(new_cmp || me);
                            Component.previewFrame.reloadTea();
                            
                            Component.typeDialog.close();
                        });
                    if (type.description)
                        item.append($("<small>").html(type.description));
                    
                    div.append(item);

                });
            }
        }

        Component.typeDialog.cmp = this;
        Component.typeDialog.handle = handle;
        Component.typeDialog.element.css({maxHeight:$(window).height()*0.8});                
        Component.typeDialog.open();
    },
    
    // show dialog for component edit
    edit: function () {
        var me = this;
        if (!me.dialog) {
            
            var width = 800;
            if (me.form && me.form.control && me.form.width)
                width = me.form.width;
            
            me.dialog = teacss.ui.dialog({
                modal: true,
                resizable: false,
                draggable: false,
                width: width,
                title: me.type.name,
                dialogClass: "component-form",
                maxHeight: '90%',
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
                            values:JSON.stringify([value]),
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
                            Component.previewFrame.reloadScript = true;
                            Component.previewFrame.reloadTea();
                            Component.previewFrame.trigger("change");
                            
                            Component.previewFrame.select(me);
                        });                        
                    },
                    "Cancel": function () {
                        $(this).dialog("close");
                        Component.previewFrame.select(me);
                    }
                }
            });
            me.dialog.element.css({overflowY:'scroll',overflowX:'hidden'});
            me.dialog.reposition = function(){
                me.dialog.element.dialog("option", "position", { my: "center", at: "center", of: window });
                me.dialog.element.css({maxHeight:$(window).height()*0.9});
            };
            
            setInterval(me.dialog.reposition,100);
            
            if (me.form && me.form.control) {
                me.dialog.control = Component.classFromName(me.form.control)();
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
        Component.currentDialog = me.dialog;
    }
});