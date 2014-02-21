<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['smart_image'] = array(
        'name' => 'Smart Image',
        'description' => 'Image with smart resizing and coloring',
        'category' => 'Design',
        'html' => "<div><div class='in'></div></div>"
    );    
});
