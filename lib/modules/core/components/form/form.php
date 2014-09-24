<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['form'] = array(
        'name' => 'Form',
        'description' => 'Form to gather user data',
        'area' => ">form",
        'category' => 'Forms',
        'update' => function ($val) {
            
            $html = '<div><form method="POST"><br class="component-area" /></form></div>';
            
            return array(
                'html' => $html,
                'form' => array('control'=>'ui.formEditor'),
                'value' => $val
            );
        }
    );    
});