<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    
    $components['countdown'] = array(
        'name' => 'Countdown',
        'description' => 'Timer ticking to zero',
        'category' => 'Landing page',
        'update' => function ($val) {

            $time = @$val['time'] ?: time()+5000;
            $html = "<div data-timestamp='$time'></div>";
            
            $form_html = "
                <label>Finish date</label>
                <input name='time' value='$time'>
            ";

            return array(
                'html' => $html,
                'form' => $form_html,
                'value' => $val
            );
        }
    );    
    
});


