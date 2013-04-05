$(function(){
    // toggle
    $(".toggle").next().hide();
    $(".toggle").click(function(){
        var me = this;
        if (!$(me).hasClass('active')) {
            $(me).addClass("active");
            $(this).next().slideToggle();
        } else {
            $(this).next().slideToggle(function(){
                $(me).removeClass("active");
            });
        }
        return false;
    });
    
    // tabs
    $('.tabs').each(function() {
        $(this).find("> div").hide();
        $(this).find(".tabs-nav li:first").addClass("active").show();
        $(this).find("> div:first").show();
    });

    $(".tabs-nav li").click(function(e) {
        $(this).parents('.tabs').find("ul > li").removeClass("active");
        $(this).addClass("active");
        $(this).parents('.tabs').find("> div").hide();
        var activeTab = $(this).find("a").attr("href");
        $(this).parents('.tabs').find(activeTab).show();
        e.preventDefault();
    });

    $(".tabs-nav li a").click(function(e) {
        e.preventDefault();
    });      
        
    // alerts
    $(".alert > .close").click(function(e){
        e.preventDefault();
        $(this).parent().slideToggle();
    });
});