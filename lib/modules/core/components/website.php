<?php

$components['vmenu'] = array(
    'name' => 'Navigation sidebar',
    'description' => 'Vertical menu bar',
    'category' => 'Website',
    'static' => true,
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