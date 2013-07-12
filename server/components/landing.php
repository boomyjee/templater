<?php

$components['testimonials'] = array(
    'name' => 'Testimonials',
    'description' => 'To raise page trust',
    'category' => 'Landing page',
    'static' => true,
    'update' => function ($val,$dataSource) use ($me) {

        $items = @$val['items']?:array();
        $val['items'] = $items = array_values($items);
        
        $form_html = '
            <table>
                <tbody data-value="'.htmlspecialchars(json_encode($items)).'" data-name="items">
                    <tr>
                        <th>name</th>
                        <th>link</th>
                        <th>pic</th>
                    </tr>
                    <tr>
                        <td><input name="name"></td>
                        <td><input name="link"></td>
                        <td><input name="pic"></td>
                        <td><a class="remove" href="#">remove item</a></td>
                    </tr>
                    <tr>
                        <td colspan="4"><textarea name="text"></textarea></td>
                    </tr>
                </tbody>
            </table>
            <br>
            <a class="add" href="#" data-name="items">add testimonial</a>
        ';        
        
        ob_start();
        ?>
            <div class="testimonials">
                <? foreach ($items as $item): ?>
                    <div class='testimonial'>
                        <blockquote><?= $item['text'] ?></blockquote>
                        <span class='name'><?= $item['name'] ?></span>
                    </div>
                <? endforeach ?>
            </div>
        <?
        $html = ob_get_clean();
        
        return array(
            'form' => $form_html,
            'value' => $val,
            'html' => $html
        );        
        
    }
);

$components['form'] = array(
    'name' => 'Form',
    'description' => 'Form to gather user data',
    'category' => 'Landing page',
    'static' => true,
    'update' => function ($val,$dataSource) use ($me) {
        $elements = @$val['elements'] ? : array();
        $val['elements'] = $elements = array_values($elements);
        
        $form_html = '
            <table>
                <tr>
                    <th>label</th>
                    <th>name</th>
                    <th>type</th>
                </tr>
                <tr data-value="'.htmlspecialchars(json_encode($elements)).'" data-name="elements">
                    <td><input name="label"></td>
                    <td><input name="name"></td>
                    <td>
                        <select name="type">
                            <option value="text">Text Box</option>
                            <option value="submit">Submit Button</option>
                        </select>
                    </td>
                    <td><input name="link"></td>
                    <td><a class="remove" href="#">remove item</a></td>
                </tr>
            </table>
            <br>
            <a class="add" href="#" data-name="elements">add element</a>
        ';
        
        if ($elements) {
            $html = "<div><form class='".$val['layout']."'>";
            $fields = $elements;
            
            $groups = array();
            foreach ($fields as $i=>$field) {
                $label = $field['label'];
                $comment = $field['comment'];
                $append = false;
                if ($label=="#" || $label=="##") {
                    $label = "";
                    $comment = "";
                    $append = true;
                }
                
                if ($field['type']=='submit') $label = "";
                if ($field['type']=='radio' || $field['type']=='checkbox') $comment = "";
                
                if (!$append || count($groups)==0) $groups[] = array('fields'=>array(),'label'=>$label,'comment'=>$comment);
                $last =& $groups[count($groups)-1];
                $last['fields'][] = $field;
            }
            
            foreach ($groups as $group) {
                if ($group['label'])
                    $html .= "<label>".$group['label']."</label>";
                $html .= "<div class='control-group'>";
                foreach ($group['fields'] as $field) {
                    $label = $field['label'];
                    $comment = $field['comment'];
                    $name_attr = $field['name'] ? 'name = "'.$field['name'].'"' : '';
                    $value = $field['value'];
                    $value_attr = 'value = "'.$field['value'].'"';
                    switch ($field['type']) {
                        case 'text':
                            $html .= "<input type='text' $value_attr $name_attr />";
                            break;
                        case 'textarea':
                            $html .= "<textarea $name_attr>$value</textarea>";
                            break;
                        case 'checkbox':
                            if ($field['label']=="##") $html .= "<br>";
                            $html .= "<label class='checkbox' $value_attr ><input type='checkbox' $name_attr />$comment</label>";
                            break;
                        case 'radio':
                            $html .= "<label class='radio' $value_attr ><input type='radio' $name_attr />$comment</label>";
                            break;
                        case 'select':
                            $html .= "<select $name_attr>";
                        
                            $options = explode("#",$value);
                            foreach ($options as $opt) {
                                $parts = explode("|",$opt);
                                
                                if (count($parts)<2) {
                                    $key = $opt_val = $parts[0];
                                } else {
                                    $key = trim($parts[0]);
                                    $opt_val = $parts[1];
                                }
                                
                                $selected = false;
                                if ($opt_val[0]=="+") {
                                    $opt_val = substr($opt_val,1);
                                    $selected = "selected='selected'";
                                }
                                $opt_val = trim($opt_val);
                                $val_attr = 'value = "'.$opt_val.'"';
                                $html .= "<option $val_attr $selected>$key</option>";
                            }
                        
                            $html .= "</select>";
                            break;
                        case 'submit':
                            $html .= "<button type='submit' $name $value_attr>$label</button>";
                            break;
                    }
                    
                    if ($group['comment'])
                        $html .= "<p>".$group['comment']."</p>";
                    
                }
                $html .= "</div>";
            }
            $html .= "</form></div>";
            
        } else {
            $html = "<div class='alert'>Create elements first</div>";
        }
        
        return array(
            'html' => $html,
            'value' => $val,
            'form' => $form_html
        );
    }
);