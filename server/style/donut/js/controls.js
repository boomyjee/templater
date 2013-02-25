$(function(){
    // toggle
    $(".toggle").next().hide();
    $(".toggle").click(function(){
        if ($(this).hasClass('active')) {
            $(this).removeClass("active");
        } else {
            $(this).addClass("active");
        }
        $(this).next().slideToggle();
        return false;
    });
    
    // tabs
    $('.tabs').each(function() {
        $(this).find("> div").hide(); //Hide all content
        $(this).find(".tabs-nav li:first").addClass("active").show(); //Activate first tab
        $(this).find("> div:first").show(); //Show first tab content
    });

    $(".tabs-nav li").click(function(e) {
        $(this).parents('.tabs').find("ul > li").removeClass("active"); //Remove any "active" class
        $(this).addClass("active"); //Add "active" class to selected tab
        $(this).parents('.tabs').find("> div").hide(); //Hide all tab content
        var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
        $(this).parents('.tabs').find(activeTab).fadeIn(); //Fade in the active ID content
        e.preventDefault();
    });

    $(".tabs-nav li a").click(function(e) {
        e.preventDefault();
    })      
        
    // alerts
    $(".alert > .close").click(function(){
        $(this).parent().slideToggle();
    })
});