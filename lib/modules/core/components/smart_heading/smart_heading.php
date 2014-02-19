<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['smart_heading'] = array(
        'name' => 'Smart heading',
        'description' => 'Button to send form data',
        'category' => 'Landing page',
        'update' => function ($val) {

            $text = @$val['text'] ?: "Heading Text";
            $tag = @$val['tag'] ?: "h1";

            $html = "<$tag>";
            $html .= $text;
            $html .= "</$tag>";

            return array(
                'html' => $html,
                'form' => array('control' => 'ui.smartHeadingEditor'),
                'value' => $val
            );
        }
    );
});
