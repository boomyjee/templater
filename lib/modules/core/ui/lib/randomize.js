window.rand = function(min, max) {
	return Math.random() * (max - min) + min;
};

window.rand.weighted = function(list, weight) {
	var total_weight = weight.reduce(function (prev, cur, i, arr) {
		return prev + cur;
	});
	
	var random_num = rand(0, total_weight);
	var weight_sum = 0;
	
	for (var i = 0; i < list.length; i++) {
		weight_sum += weight[i];
		if (random_num <= weight_sum) {
			return list[i];
		}
	}
    return list[list.length-1];
};


ui.combo = ui.combo.extend({
    init: function (o) {
        this._super(o);
        if (!this.options.inline && this.options.randomize) {
            this.element.css({
                paddingLeft:30,
                '-moz-box-sizing':'border-box',
                '-webkit-box-sizing':'border-box',
                'box-sizing':'border-box',
                position:'relative'
            });
            var me = this;
            this.element.append(
                $("<span>",{class:'button-randomize',title:"I'm feeling lucky"})
                .click(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var val = me.randomize();
                    me.setValue(val);
                    me.change();
                    return false;
                })
            );
        }
        return this;
    },
    randomize: function () {
        var me = this;
        me.itemsArray();
        
        var items = [];
        var weights = [];
        
        $.each(me.items,function(i,item){
            if ($.isPlainObject(item) && !item.disabled) {
                items.push(item);
                weights.push(item.randomWeight || 1);
            }
        });
        
        if (items.length) {
            var item = rand.weighted(items,weights);
            return item.value;
        }
        return this.value;
    }
})