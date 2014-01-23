<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['hr'] = array(
        'name' => 'Horizontal line',
        'description' => 'Layout visual divider',
        'category' => 'Website',
        'static' => true,
        'html' => "<hr>"
    );
});