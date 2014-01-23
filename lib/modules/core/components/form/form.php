<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['form'] = array(
        'name' => 'Form',
        'description' => 'Form to gather user data',
        'area' => ">form",
        'category' => 'Forms',
        'update' => function ($val) {
            return array(
                'html' => '<div><form><br class="component-area" /></form></div>',
                'form' => '<label>Success message</label><input name="success" value="'.@$val['success'].'" />',
                'value' => $val
            );
        }
    );    
});