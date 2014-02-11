ui.presetCombo = ui.combo.extend({
    presetTpl: function() {
        return $("<div class='combo-item'>").append(
            $("<div>").text("N/A").css({width:40,height:40,lineHeight:"40px",border:"1px solid #777",textAlign:'center'})
        );
    },
    baseId: (new Date()).getTime(),
    list: [],
    value_equals: function (y,x,depth) {
        depth == depth || 0;
        if (depth==0) {
            
        }
    }
},{
    init: function (o) {
        var me = this;
        me.Class.list.push(me);
        
        o = o || {};
        if (o.inlineEditor) o.noPresetItem = true;
        this._super($.extend({
            presets: false,
            closeOnSelect: false,
            preview: false,
            items: function () {
                this.initPresets();
                return this.getItems();
            },
            itemTpl: function (item,common) {
                if (item.group!==undefined) return $("<div class='combo-group'>").html(item.group||"-");
                if (item.noPreset) {
                    return $("<div class='combo-item no-preset'>").html("No preset");
                }
                var tpl =  this.Class.presetTpl(item,common);
                if (!tpl) tpl = ui.presetCombo.presetTpl(item,common);
                return tpl;
            },
            comboWidth: 320,
            comboHeight: 500,
            editorWidth: 320,
            editorHeight: 500,
            comboDirection: "bottom",
            panelClass: 'only-icons',
            noPresetItem: false,
            inlineEditor: false
        },o));   
        
        if (!this.options.presets) this.options.presets = this.Class.presets;
        if (!this.options.presets) this.options.presets = [];
        
        this.bind("setValue",function(){
            me.prevValue = this.getValue() || {};
        });
        this.bind("change",function(){
            me.realValue = me.value || {};
            if ($.isPlainObject(me.realValue)) {
                me.prevValue = me.value = $.extend({},me.prevValue || {},me.realValue);
            }
        });
    },
    
    setValue: function(value) {
        this.value = value;
        this.selected = {value:value};
        this.updateLabel();
        if (this.panel.css("display")!="none") {
            this.selected_on_open = this.selected;
            this.setSelected();
        }
        this.trigger("setValue");
    },    
    
    selectItem: function (item) {
        var me = this;
        me.selected_on_open = me.selected = teacss.jQuery(item).data("item");
        
        if (me.selected.value && me.selected.value._id===false) {
            me.value = $.extend(true,me.value || {},me.selected.value);
        } else {
            me.value = me.selected.value;
        }
        
        if (me.options.closeOnSelect)
            me.hide();
        else
            me.setSelected();

        me.change();
        me.updateLabel();
    },    
    
    setSelected : function () {
        function value_equals(y,x) {
            if (y===x) return true;
            if (y==undefined || x==undefined) return false;
            if (typeof(y)!=typeof(x)) return false;
            if (y.constructor==Array) {
                if (x.constructor!=Array) return false;
                if (x.length!=y.length) return false;
                for (var i=0;i<x.length;i++) {
                    if (!value_equals(y[i],x[i])) return false;
                }
                return true;
            }
            if (typeof(y)!='object' && x!=y) return false;
            for (var p in y) {
                if (!value_equals(y[p],x[p])) return false;
            }
            return true;
        }             
        
        var me = this;
        var selectedItem = false;
        var oldSelectedElement = me.selectedElement;
        me.selectedElement = false;
        
        me.itemPanel.find(">*").removeClass("selected");
        me.itemPanel.find(">*").each(function(){
            var item = teacss.jQuery(this).data("item");
            var sel = me.selected_on_open;
            if (item && item.value && sel && sel.value && 
                (
                    (sel.value._id == item.value._id && sel.value._id) || 
                    sel.value==item.value
                )
            ) {
                me.selectedElement = $(this);
                selectedItem = item;
                return false;
            }
        });
        
        if (!me.selectedElement) me.itemPanel.find(">*").each(function(){
            var item = teacss.jQuery(this).data("item");
            if (item && item.value!=undefined && me.selected_on_open && !item.preset
                && value_equals(item.value,me.selected_on_open.value)) {
                me.selectedElement = $(this);
                selectedItem = item;
                return false;
            }
        });
        
        if (me.selectedElement) me.selectedElement.addClass("selected");
        if (!me.selectedElement || !selectedItem.preset) {
            me.itemPanel.find("> .no-preset").addClass("selected");
            selectedItem = this.noPresetItem;
        }
        
        if (me.options.inlineEditor) {
            me.editPreset(selectedItem,me.selectedElement);
        }
    },
    
    initPresets: function () {
        var me = this;
        
        var form = this.form;
        var name = this.options.name ? "presets."+this.options.name : false;
        
        if (this.options.presetName) {
            name = this.options.presetName;
            form = Component.app.form;
        }
        
        if (form && name) {
            this.presets = ui.Control.extend({
                setValue: function (val) {
                    val = $.extend(true,[],val || []);
                    this._super(val);
                    me.items = me.getItems();
                    me.refresh();
                    me.setSelected();
                }
            })({
                name: name
            });
            form.registerItem(this.presets);
        }
    },   
    
    
    refresh: function () {
        var me = this;
        if (me.newGroupButton) me.newGroupButton.detach();
        this._super();

        this.itemPanel.find(">*").each(function(){
            var item = $(this).data("item");
            if (item && item.preset && !item.noPreset) {
                var closeButton = $("<span class='ui-icon ui-icon-close'>").mousedown(function(e){
                    var item = $(this).parent().data("item");
                    me.removePreset(item);
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                });
                
                $(this).prepend(closeButton);
                $(this).data("closeButton",closeButton);
                $(this).addClass("preset-item");
                
                if (item.group) {
                    var addItem = $("<div class='add-item'>")
                        .html("New Preset")
                        .prepend("<span class='ui-icon ui-icon-circle-plus'>")
                        .click(function(){
                            me.newPreset(item);
                        });
                    
                    $(this).add($(this).nextUntil(".combo-group")).last().after(addItem);
                }
            }
            
            if (item && item.preset && item.noPreset) {
                 
                var refButton = $("<span class='ui-icon ui-icon-transferthick-e-w'>").mousedown(function(e){
                });
                $(this).prepend(refButton);
            }
            
            var item_el = $(this);
            $(this).bind("contextmenu",function(e){ return false; });
            if (!me.options.inlineEditor)
                $(this).mousedown(function(e){
                    if (e.which==3) {
                        e.preventDefault();
                        me.editPreset(item,item_el);
                        return true;
                    }
                });
        });
        
        this.itemPanel.sortable({
            items: "> .preset-item",
            distance: 3,
            tolerance: "pointer",
            helper: "original",
            start: function (e,ui) {
                var item = ui.item;
                if (item.hasClass("combo-group")) {
                    me.itemPanel.find("> .combo-group").each(function(){
                        var items = $(this).nextUntil(".combo-group");
                        $(this).data("items",items);
                        if (this==ui.placeholder[0]) {
                            item.data("items",items);
                        }
                    });
                    me.itemPanel.children(":not(.combo-group.preset-item)").hide();
                    $(this).sortable( "refreshPositions" );
                }
            },
            stop: function (e,ui) {
                var item = ui.item;
                if (item.hasClass("combo-group")) {
                    me.itemPanel.find("> .combo-group").each(function(){
                        $(this).after($(this).data("items"));
                    });
                    me.itemPanel.children().css("display","");
                }
                
                var presets = [];
                me.itemPanel.find(">.preset-item").each(function(){
                    presets.push($(this).data("item"));
                });
                me.presets.setValue(presets);
                me.presets.change();
            },
            intersection: function (item,widget) {
                var isOverElementHeight = widget._isOverAxis(widget.positionAbs.top + widget.offset.click.top, item.top, item.height),
                    isOverElementWidth = widget._isOverAxis(widget.positionAbs.left + widget.offset.click.left, item.left, item.width),
                    isOverElement = isOverElementHeight && isOverElementWidth;
        
                if (!isOverElement) return false;
                
                if (widget.helper.hasClass("combo-group")) {
                    if (!item.item.hasClass("combo-group")) return false;
                } else {
                    if (item.item.hasClass("combo-group")) return 2;
                }
                if (item.item.index() < widget.placeholder.index())
                    return 1;
                return 2;
            },
            sort: function (e,ui) {
                var item = ui.item;
                if (item.hasClass("combo-group")) {
                    ui.helper[0].style.left = ui.originalPosition.left+'px';
                }
            }
        });

        if (!me.newGroupButton) {
            me.newGroupButton = $("<div class='combo-group new-group'>")
                .html("New Group")
                .prepend("<span class='ui-icon ui-icon-circle-plus'>")
                .click(function(){
                    me.newGroup();
                });
        }
        
        if (!me.options.disableNewGroup)
            this.itemPanel.prepend(me.newGroupButton);
    },
    
    extendItem: function (item) {
        if (!item || !item.value) return;
        var defaultItem = this.Class.defaultItem;
        if (defaultItem && defaultItem.call)
            defaultItem = defaultItem.call(this,item);
        if (defaultItem && defaultItem.value) {
            for (var key in defaultItem) {
                if (!(key in item) && key!='value')
                    item[key] = defaultItem[key];
            }
            for (var key in defaultItem.value) {
                if (!(key in item.value))
                    item.value[key] = defaultItem.value[key];
            }
        }
    },
    
    createEditor: function () {
        var me = this;
        if (!me.Class.editor) {
            me.Class.editor = me.getEditor({
                width: me.options.editorWidth, 
                height: me.options.inlineEditor ? me.options.comboHeight : me.options.editorHeight, 
                margin: 0
            });
            if (!me.Class.editor) return;
            me.Class.editorCombo = ui.combo({
                comboWidth: me.options.editorWidth,
                comboHeight: me.options.editorHeight,
                items: me.options.inlineEditor ? function(){ return [me.Class.editor] } : [me.Class.editor],
                inline: me.options.inlineEditor,
                margin: 0
            });
            me.Class.editorCombo.element.hide();
            me.Class.editor.change(function(){
                var me = this.me;
                var item_el = this.currentElement;
                var item = this.currentItem;
                
                if (!item) return;
                
                if (item.value && item.value._id===false) {
                    var val = this.getValue();
                    delete val._id;
                    me.setValue(val);
                    me.trigger("change");
                } else {
                    $.extend(item.value,this.getValue()||{});
                    
                    var newEl = $(me.options.itemTpl.call(me,item));
                    var closeButton = item_el.data("closeButton");
                    if (closeButton) closeButton.detach();
                    
                    item_el.empty();
                    item_el.append(closeButton,newEl.contents());
                    
                    $.each(me.Class.list,function(){
                        var combo = this;
                        if (combo.value && combo.value._id && combo.value._id == item.value._id) {
                            combo.value = item.value;
                            combo.setValue(item.value);
                            combo.trigger("change");
                        }
                    });
                    me.presets.trigger("change");
                }
            });
        }
    },
    
    editPreset: function (item,item_el) {
        
        var me = this;
        if (!item.preset) return;
        if (this.options.inlineEditor && !this.panel.is(":visible")) return;
        if (me.Class.editor && item==me.Class.editor.currentItem && me.options.inlineEditor) return;
        
        me.createEditor();
          
        var editor = me.Class.editor;
        var editorCombo = me.Class.editorCombo;
        
        if (me.options.inlineEditor) {
            var w = me.options.editorWidth;
            var h = me.options.comboHeight;
            
            if (!me.editorPanel) {
                me.editorPanel = $("<div>").css({
                    position:'absolute',left:0,top:0,height:h,width:w
                });
                var panel = me.options.inline ? me.element : me.panel;
                panel.css({paddingLeft:w,height:h});
                me.editorPanel.appendTo(panel);
            }
            editorCombo.element.show().css({width:'100%',height:'100%'}).appendTo(me.editorPanel);
            
        } else {
            var off = item_el.offset();
            editorCombo.element.appendTo(me.options.inline ? me.element : me.panel);
            editorCombo.panel.show().css({left:off.left,top:off.top+item_el.outerHeight()});
        }
        
        
        if (item.value && item.value._id!==false)
            editor.setValue(item.value);
        else
            editor.setValue(this.getValue());
        
        editor.currentItem = item;
        editor.currentElement = item_el;
        editor.me = this;
    },
    
    removePreset: function (item) {
        var me = this;
        var i = me.presets.value.indexOf(item);
        
        if (me.Class.editorCombo) me.Class.editorCombo.panel.hide();
        
        if (i>=0) {
            var count = 1;
            if (item && item.group) {
                while (i+count < me.presets.value.length 
                       && me.presets.value[i+count] 
                       && !me.presets.value[i+count].group) count++;
                
                if (count>1) {
                    if (!confirm("Group is not empty. Sure to delete?")) {
                        return;
                    }
                }
            }
            
            me.presets.value.splice(i,count);
            me.presets.setValue(me.presets.value);
            me.presets.change();
        }
    },  
    
    newGroup: function() {
        if (!this.presets) {
            alert("No preset name defined for combo");
            return;
        }
        var name; 
        if (name = prompt("Enter group name")) {
            var value = this.presets.getValue() || [];
            
            var group = {group:name,presets:true,disabled:true};
            value.unshift(group);
            this.presets.setValue(value);
            this.presets.change();
            
            var me = this;
            me.itemPanel.find(">.combo-group").each(function(){
                if ($(this).data("item")==group) $(this).click();
            });
        }
    },
    
    newPreset: function(group) {
        if (!this.presets) {
            alert("No preset name defined for combo");
            return;
        }
        
        var me = this;
        var value = this.presets.getValue() || [];
        $.each(value,function(i,val){
            if (val==group) {
                var item = {value:{}};
                $.extend(item.value,me.getValue());
                me.extendItem(item);
                value.splice(i+1,0,item);
                
                item.value = item.value || {};
                item.value._id = ++me.Class.baseId;
                
                me.selected = item;
                if (me.editor) {
                    me.editor.setValue(item.value);
                }
                me.presets.setValue(value);
                me.presets.change();
                return false;
            }
        });
    }, 
    
    getItems: function () {
        var items = [];
        var me = this;
        
        if (this.options.noPresetItem) {
            this.noPresetItem = {noPreset:true,preset:true,value:{_id:false}};
            items.push(this.noPresetItem);
        }
        
        if (this.presets) {
            var presets = this.presets.getValue();
            if (presets && presets.length) {
                
                if (this.options.disableNewGroup) {
                    items.push({group:"User defined",disabled:true});
                }
                
                $.each(presets,function(){
                    if (this) {
                        this.preset = true;
                        if (this.value && !this.value._id)
                            this.value._id = ++me.Class.baseId;
                    }
                    items.push(this);
                });
            }
        }
        $.each(this.options.presets,function() {
            if (this && this.value)
                this.value._id = false;
        });
        items = items.concat(this.options.presets);
        return items;
    },    
    
    getEditor: function (o) {
        if (this.options.editor) {
            return this.options.editor(o);
        }
        return false;
    }
});
                                 
ui.presetSwitcherCombo = ui.presetCombo.extend({
    presetTpl: function (item,common) {
        var value = {};
        var type = "default";
        if (item.value) value = item.value;
        if (value.type) type = value.type;
        
        var cls = this[type];
        if (cls && cls.presetTpl) 
            return cls.presetTpl(item,common);
        
        if (cls && cls.switcherLabel) 
            return $("<div class='combo-item'>)").append($(cls.switcherLabel(value)));
        
        return $("<div class='combo-item'>)").append(type);
    }
},{
    init: function (o) {
        this._super($.extend({
            colorLabel: false
        },o));
        
        this.options.labelPlain = o.label;

        this.options.repository = this.options.repository || this.Class;
        this.options.presets = this.options.presets || this.Class.presets;
        
        var me = this;
        ui.paletteColorPicker.events.bind("paletteChange",function(){    
            var type = me.getCurrentType();
            var cls = me.options.repository[type];
            
            if (cls && cls.switcherLabel && cls.colorLabel) {
                me.updateLabel();
            }
        });
    },
    
    randomize: function () {
        var me = this;
        me.createEditor();
        
        var switcher = me.Class.editor;
        
        var types = [];
        var weights = [];
        
        $.each(switcher.options.types,function(i,type){
            var w = switcher.options.repository[type].randomWeight || 1.0;
            types.push(type);
            weights.push(w);
        });
        
        var ret = this.value;
        if (types.length) {
            var type = rand.weighted(types,weights);
            var panel = me.switcher.panels[type];
            if (panel.randomize) {
                ret = $.extend(ret||{},panel.randomize());
            }
            ret._id = false;
            ret.type = type;
        }
        return ret;
    },
    
    getEditor: function (o) {
        o = o || {};
        var me = this;
        if (me.switcher) return me.switcher;
        
        var switcher = this.switcher = ui.switcher($.extend({
            types:this.options.types,
            repository: this.options.repository,
            margin: 0
        },o));
        return switcher;
    },
    
    getCurrentType: function (o) {
        this.options.repository = this.options.repository || this.Class;
        
        var type = false;
        if (this.value && this.value.type) type = this.value.type;
        if (!type) for (var key in this.options.repository) {
            var it = this.options.repository[key];
            if (it && it.switcherLabel) {
                type = key;
                break;
            }
        }
        if (!type) type = 'default';
        return type;
    },
    
    getLabel: function (o) {
        var type = this.getCurrentType();
        if (this.options.repository[type] && this.options.repository[type].switcherLabel) {
            var ret = $(this.options.repository[type].switcherLabel(this.value,this));
        } else {
            ret = $("<span class='button-label'>").text(type);
        }
        if (this.options.labelPlain)
            ret = $(document.createTextNode(this.options.labelPlain + ": ")).add(ret);
        return ret;
    },
    
    extendItem: function (item) {
        this._super(item);
        if (item && item.value && item.value.type) {
            
            var types = this.options.types;
            if (!types) {
                types = [];
                for (var key in this.options.repository) {
                    var cls = this.options.repository[key]
                    if (cls && cls.extend) types.push(key);
                }
            }
            
            for (var t=0;t<types.length;t++) {
                var type = types[t];
                var def = this.options.repository[type].defaultItem;
                if (def && def.call) def = def.call(this,item);
                if (def && def.value) {
                    for (var key in def.value) {
                        if (!(key in item.value))
                            item.value[key] = def.value[key];
                    }
                }
            }
        }
    }
});
