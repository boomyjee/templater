<?php

$components['logo'] = array(
    'name' => 'Site logo',
    'description' => 'Website logo',
    'category' => 'Website',
    'html' => '<div class="logo"></div>'
);

$components['menu'] = array(
    'name' => 'Navigation bar',
    'description' => 'Horizontal menu bar',
    'category' => 'Website',
    'update' => function ($val,$dataSource,$for_editor) {
        $items = @$val['items'] ? : array();
        $val['items'] = $items = array_values($items);
        ob_start();
        ?>
            <div class="menu top_menu">
                <ul class="container">
                    <? foreach ($items as $i=>$item): ?>
                        <?
                            $selected = false;
                            if ($for_editor && $i==1) $selected = true;
                        ?>
                        <li class='menu-item <?=($selected ? "current-menu-item":"") ?>'>
                            <a href="<?=$item['link']?>">
                                <?=$item['label']?>
                                <? if (@$item['sublabel']): ?>
                                    <small><?=$item['sublabel']?></small>
                                <? endif ?>
                            </a>
                        </li>
                    <? endforeach ?>
                </ul>
            </div>
        <?
        $html = ob_get_clean();
        return array(
            'form' => '
                <table>
                    <tr>
                        <th>label</th>
                        <th>sublabel</th>
                        <th>link</th>
                    </tr>
                    <tr data-value="'.htmlspecialchars(json_encode($items)).'" data-name="items">
                        <td><input name="label"></td>
                        <td><input name="sublabel"></td>
                        <td><input name="link"></td>
                        <td><a class="remove" href="#">remove item</a></td>
                    </tr>
                </table>
                <br>
                <a class="add" href="#" data-name="items">add menu item</a>
            ',
            'value' => $val,
            'html' => $html
        );            
    }
);

$components['vmenu'] = array(
    'name' => 'Navigation menu',
    'description' => 'Vertical menu bar',
    'category' => 'Website',
    'update' => function ($val) {
        $items = @$val['items'] ? : array();
        $val['items'] = $items = array_values($items);
        
        ob_start();
        ?>
            <div class="vmenu">
                <? if (@$val['heading']): ?>
                    <h3><?=$val['heading']?></h3>
                <? endif ?>
                <ul class="container">
                    <? foreach ($items as $item): ?>
                        <li><a href="<?=$item['link']?>"><?=$item['label']?></a></li>
                    <? endforeach ?>
                </ul>
            </div>
        <?
        $html = ob_get_clean();
        
        return array(
            'form' => '
                <label>Heading</label>
                <input name="heading" value="'.htmlspecialchars(@$val['heading']).'">
                <table>
                    <tr>
                        <th>label</th>
                        <th>link</th>
                    </tr>
                    <tr data-value="'.htmlspecialchars(json_encode($items)).'" data-name="items">
                        <td><input name="label"></td>
                        <td><input name="link"></td>
                        <td><a class="remove" href="#">remove item</a></td>
                    </tr>
                </table>
                <br>
                <a class="add" href="#" data-name="items">add menu item</a>
            ',
            'value' => $val,
            'html' => $html
        );
    }
);