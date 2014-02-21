(function ($) {
    
    if ($.fn.county) return;
    $.fn.county = function (options) {
        var settings = $.extend({ 
            endDateTime: new Date((new Date()).getTime()+24*3600*1000), 
            animation: false, 
            speed: 500, 
            days: true
        }, options);

        return this.each(function () {
            var timeoutInterval = null;
            var container = $(this);
            container.addClass('county');
            container.append(
                settings.days ? '<span class="county-days"><span>000</span></span>':'',
                '<span class="county-hours separator-left"><span>00</span></span>',
                '<span class="county-minutes separator-left"><span>00</span></span>',
                '<span class="county-seconds separator-left"><span>00</span></span>'
            );
            if (container.attr('id') == undefined || container.attr('id') == null) {
                container.attr('id', Math.random());
            }

            if (!$.fn.county.hash) {
                $.fn.county.hash = {};
                
                function updateAll() {
                    for (var id in $.fn.county.hash) {
                        if ($("#"+id).length==0) {
                            delete $.fn.county.hash[id];
                        } else {
                            $.fn.county.hash[id]();
                        }
                    }
                }
                setInterval(updateAll,1000);
            }
            $.fn.county.hash[this.id] = updateCounter;
            
            var days = container.find('.county-days > span');
            var hours = container.find('.county-hours > span');
            var minutes = container.find('.county-minutes > span');
            var seconds = container.find('.county-seconds > span');
            
            var anim = settings.animation;
            settings.animation = false;
            updateCounter();
            settings.animation = anim;

            function updateCounter() {
                var countDown = getCurrentCountDown();

                var dayVal = days.html();
                var hourVal = hours.html();
                var minuteVal = minutes.html();
                var secondVal = seconds.html();

                if (dayVal == countDown.days) {
                    days.html(countDown.days);
                }
                else {
                    aimateObject(days, null, dayVal, countDown.days, settings.animation);
                }

                if (hourVal == countDown.hours)
                    hours.html(countDown.hours);
                else {
                    aimateObject(hours, null, hourVal, countDown.hours, settings.animation);
                }

                if (minuteVal == countDown.minutes)
                    minutes.html(countDown.minutes);
                else {
                    aimateObject(minutes, null, minuteVal, countDown.minutes, settings.animation);
                }
                if (secondVal == countDown.seconds)
                    seconds.html(countDown.seconds);
                else {
                    aimateObject(seconds, null, secondVal, countDown.seconds, settings.animation);
                }
            }
            function aimateObject(element, reflectionElement, oldValue, newValue, type) {
                if (type == 'fade') {
                    element.fadeOut('fast').fadeIn('fast').html(newValue);
                }
                else if (type == 'scroll') {
                    var copy = element.data("copy");
                    if (!copy) {
                        copy = element.clone().css({position:'absolute'});
                        copy.prependTo(element.parent());
                        element.data("copy",copy);
                    }
                    copy.text(element.text());
                    element.text(newValue);
                    
                    var h = copy.outerHeight();
                    element.stop().css({top:-h}).animate({top:0}, settings.speed);
                    copy.stop().css({top:0}).animate({top:h}, settings.speed);

                } else {
                    element.html(newValue);
                }

            }
            function getCurrentCountDown() {

                var currentDateTime = new Date();
                var diff = parseFloat(settings.endDateTime - currentDateTime);

                var seconds = 0;
                var minutes = 0;
                var hours = 0;
                var total = parseFloat(((((diff / 1000.0) / 60.0) / 60.0) / 24.0));

                var days = parseInt(total);

                total -= days;

                total *= 24.0;

                hours = parseInt(total);

                total -= hours;

                total *= 60.0;

                minutes = parseInt(total);

                total -= minutes;

                total *= 60;

                seconds = parseInt(total);

                return { days: formatNumber(Math.max(0, days), true), hours: formatNumber(Math.max(0, hours), false), minutes: formatNumber(Math.max(0, minutes), false), seconds: formatNumber(Math.max(0, seconds), false) };

            }
            function formatNumber(number, isday) {
                var strNumber = number.toString();
                if (!isday) {
                    if (strNumber.length == 1)
                        return '0' + strNumber;
                    else
                        return strNumber;
                }
                else {
                    if (strNumber.length == 1)
                        return '00' + strNumber;
                    else if (strNumber == 2)
                        return '0' + strNumber;
                    else
                        return strNumber;
                }
            }
            function getHunderth(number) {
                var strNumber = '' + number;

                if (strNumber.length == 3)
                    return strNumber.substr(0, 1);
                else
                    return '0';
            }
            function getTenth(number) {

                var strNumber = '' + number;

                if (strNumber.length == 2)
                    return strNumber.substr(0, 1);
                else
                    return '0';
            }

            function getUnit(number) {
                var strNumber = '' + number;

                if (strNumber.length >= 1)
                    return strNumber.substr(0, 1);
                else
                    return '0';
            }
            return this;
        });
    }
})(jQuery);