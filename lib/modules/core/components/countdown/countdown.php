<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    
    $components['countdown'] = array(
        'name' => 'Countdown',
        'description' => 'Timer ticking to zero',
        'category' => 'Landing page',
        'update' => function ($val) {

            $time = @$val['time'] ?: time()+5000;
            $html = "<div data-time='$time'></div>";

            return array(
                'html' => $html,
                'form' => array('control'=>'ui.countdownEditor'),
                'value' => $val
            );
        }
    );    
    
});


