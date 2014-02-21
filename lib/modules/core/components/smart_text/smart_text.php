<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['smart_text'] = array(
        'name' => 'Smart Text',
        'description' => 'Canvas based text',
        'category' => 'Design',
        'html' => "<div></div>"
    );    
});
