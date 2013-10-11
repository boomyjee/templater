<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['wysiwyg'] = array(
        'name' => 'Rich Text',
        'description' => 'Custom Text Block',
        'category' => 'Common',
        'static' => true,
        'update' => function ($val) {
            $val['html'] = $html = @$val['html'] ? : ""
                ."<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>"
                ."<p>Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.</p>"
                ."<p>In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a,</p>"
            ;
            return array(
                'form' => array('control'=>'ui.htmlEditor'),
                'value' => $val,
                'html' => '<div>'.$html."</div>"
            );
        }
    );
});
