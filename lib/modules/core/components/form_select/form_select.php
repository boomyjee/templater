<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['form_select'] = array(
        'name' => 'Select',
        'description' => 'Dropdown combobox',
        'category' => 'Forms',
        'update' => function ($val) {

            $label = @$val['label'];
            $name = @$val['name'];
            $value = @$val['value'];

            $html = "<div class='control'>";
            if ($label)
                $html .= "<label>".$label."</label>";
            
            $options = @$val['options'] ?:array();
            
            $html .= "<span><select name='".$name."'>";
            
            foreach ($options as $one) {
                $selected = $one['value']==$value ? "selected='selected'" : '';
                $html .= "<option value='".$one['value']."' $selected>".$one['label']."</option>";
            }
            $html .= "</select></span>";
            $html .= "</div>";

            return array(
                'html' => $html,
                'form' => array('control' => 'ui.formSelectEditor'),
                'value' => $val
            );
        }
    );
});