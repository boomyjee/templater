ui.backgroundMaskCombo = ui.switcherCombo.extendOptions({
    label: "Mask",
    icons: { primary : 'fa fa-asterisk' }
}).extend({
    getLabel: function () {
        if (!this.value)
            return "<span>Mask: </span><span class='button-label'>none</span>";
        return this._super();
    }
})

ui.backgroundMaskCombo.default = ui.composite.extendOptions({
    label: "No mask",
    padding: 10,
    items: [
        "Select some mask type within the tabs"
    ]
});

ui.backgroundMaskCombo.spikes = ui.composite.extendOptions({
    label: "Spikes",
    padding: 10, skipForm: true,
    items: [
        "Position (`both` works well only for fixed height):",
        { 
            type: "select", name: "position", items: {top:'top',bottom:'bottom',both:'both'}
        },
        "Spike size:",
        { 
            type: 'lengthCombo', name: 'size',
            options:[{value:false,label:"auto",hidden:true},5,10,15,20,25,50],min:5,max:100 
        }
    ]
});