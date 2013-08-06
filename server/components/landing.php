<?php

$components['testimonial'] = array(
    'name' => 'Testimonial',
    'description' => 'To raise page trust',
    'category' => 'Landing page',
    'static' => true,
    'update' => function ($val,$dataSource) use ($me) {

        if (!$val) $val = array();
        $val['name'] = @$val['name'] ?: "Customer name";
        $val['link'] = @$val['link'] ?: '';
        $val['pic'] = @$val['pic'] ?: '';
        $val['text'] = @$val['text'] ?: 'A review text from customer';
        
        $form_html = '
            <label>Name</label>
            <input name="name" value="'.$val['name'].'">
            <label>Link</label>
            <input name="link"  value="'.$val['link'].'">
            <label>Picture</label>
            <input name="pic" value="'.$val['pic'].'">
            <label>Text</label>
            <textarea name="text">'.$val['text'].'</textarea>
        ';        
        
        ob_start();
        ?>
            <div class='testimonial'>
                <blockquote><?= $val['text'] ?></blockquote>
                <span class='name'><?= $val['name'] ?></span>
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

$components['form_text'] = array(
    'name' => 'Textbox',
    'description' => 'Single line text input',
    'category' => 'Forms',
    'update' => function ($val) {
        
        $label = @$val['label'];
        $name = @$val['name'];
        
        $html = "<div class='control'>";
        if ($label)
            $html .= "<label>".$label."</label>";
        $html .= "<input type='text' name='".$name."' />";
        $html .= "</div>";
        
        $form_html = "
            <label>Label</label>
            <input name='label' value='$label'>
            <label>Name</label>
            <input name='name' value='$name'>
        ";
        
        return array(
            'html' => $html,
            'form' => $form_html,
            'value' => $val
        );
    }
);

$components['form_button'] = array(
    'name' => 'Submit button',
    'description' => 'Button to send form data',
    'category' => 'Forms',
    'update' => function ($val) {
        
        $label = @$val['label'] ?: "Submit";
        
        $html = "<div class='control'>";
        $html .= "<button>".$label."</button>";
        $html .= "</div>";
        
        $form_html = "
            <label>Label</label>
            <input name='label' value='$label'>
        ";
        return array(
            'html' => $html,
            'form' => $form_html,
            'value' => $val
        );
    }
);