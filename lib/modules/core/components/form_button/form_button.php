<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['form_button'] = array(
        'name' => 'Submit button',
        'description' => 'Button to send form data',
        'category' => 'Forms',
        'update' => function ($val) {

            $label = @$val['label'] ?: "Submit";
            $link = @$val['link'];

            $html = "<div class='control'>";
            if ($link) {
                $html .= "<a class='button' href='$link'>$label</a>";
            } else {
                $html .= "<button>".$label."</button>";
            }
            $html .= "</div>";

            $form_html = "
                <label>Label</label>
                <input name='label' value='$label'>
                <label>Link (optional)</label>
                <input name='link' value='$link'>
            ";
            return array(
                'html' => $html,
                'form' => $form_html,
                'value' => $val
            );
        }
    );
});
