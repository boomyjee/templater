$.validation = {};

$.validation._test = function (val) {
    return "Test validation message";
}

$.validation.required = function (val) {
    if (!val) return "Field is required";
}

$.validation.size = function (val,rule) {
    var min = rule.min!="" ? parseInt(rule.min) : false;
    var max = rule.max!="" ? parseInt(rule.max) : false;
    if (min && val.length<rule.min) return "Should be at least "+min+" symbol(s)";
    if (max && val.length>rule.max) return "Should be less than "+max+" symbol(s)";
}

$.fn.validation = function (config) {
    return this.each(function (){
        var control = $(this).find("input,select");
        var $this = $(this);
        var form = $(this).closest("form");
        
        control.removeClass("error");
        $this.find("span.error").remove();
        
        var rules = config.rules || [];
        
        if (config.test && window.parent && window.parent.Component) {
            rules = [{type:"_test"}];
            validate();
        }
        
        function validate() {
            var val = control.val();
            var error = false;
            $.each(rules,function(r,rule){
                var type = rule.type;
                var f = $.validation[type];
                if (!f) {
                    error = "No validator for type = "+type;
                } else {
                    error = f(val,rule);
                    if (error && rule.message) error = rule.message;
                }
                if (error) return false;
            });
            
            $this.find("span.error").remove();
            if (error) {
                var span = $("<span>").addClass("error").text(error);
                $this.append(span);
                control.addClass("error");
            } else {
                control.removeClass("error");
            }
            return error;
        }
        control.data("validate",validate);
        
        form.unbind("submit.validation");
        form.bind("submit.validation",function(e){
            var valid = true;
            $(this).find("input,select").each(function(){
                var f = $(this).data("validate");
                if (f && f()) valid = false;
            });
            if (!valid) {
                e.preventDefault();
                return false;
            }
        });
        
        control.unbind("change.validation");
        control.unbind("focus.validation");
        control.unbind("blur.validation");
        control.bind("focus.validation",function(){
            control.removeClass("error");
            $this.find("span.error").remove();
        });
        control.bind("change.validation blur.validation",function(){
            validate();
        });
    });
}