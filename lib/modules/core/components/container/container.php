<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['container'] = array(
        'name' => 'Container',
        'description' => 'Styled container',
        'area' => ">.container",
        'category' => 'Common',
        'static' => true,
        'update' => function ($val) {
            return array(
                'html' => '<div><div class="container"><br class="component-area" /></div></div>'
            );
        }
    );
});