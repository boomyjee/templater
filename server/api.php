<?php

class TemplaterApi {
    function __construct() {
        if (file_exists(__DIR__."/lock")) {
            echo "Please remove file named 'lock' from server directory to allow demo api to work";
            die();
        }
        $this->{$_REQUEST['action']}();
        die();                
    }    
    
    function getComponents() {
        include "components.php";
        return $components;
    }
    
    function component() {
        $components = $this->getComponents();
        $res = array();
        foreach ($_REQUEST['values'] as $val) {
            $upd = array('html'=>'');
            $type = $val['type'];
            if (@$components[$type]) {
                if (isset($components[$type]['html'])) {
                    $upd['html'] = $components[$type]['html'];
                } else {
                    $upd = $components[$type]['update']($val);
                }
            }
            $res[] = $upd;
        }
        echo json_encode($res);
    }
    
    function upload() {
        $name = @$_REQUEST['name'];
        $iconWidth = @$_REQUEST['iconWidth'];
        $iconHeight = @$_REQUEST['iconHeight'];
        
        if ($name) {
            $dir = __DIR__."/upload/".$name;
            $tdir = __DIR__."/upload/".$name."/thumbs";
            
            if (!file_exists($dir)) mkdir($dir,0777,true);
            if (!file_exists($tdir)) mkdir($tdir,0777,true);
            
            $res = array();
            foreach ($_FILES as $key=>$val) {
                $error = $val['error'];
                if ($error==UPLOAD_ERR_OK) {
                    $name = $val['name'];
                    $tmp_name = $val['tmp_name'];
                    $ext = pathinfo($name, PATHINFO_EXTENSION);
                    $dest = uniqid() . ($ext ? ".".$ext : "");
                    move_uploaded_file($tmp_name, $dir. "/" .$dest);
                    
                    $base = dirname($_SERVER['SCRIPT_URL']);
                    
                    require_once __DIR__."/lib/PhpThumb/Factory.php";
                    $file = \PhpThumb\Factory::create($dir."/".$dest,array('resizeUp'=>false));
                    $file->resize($iconWidth,$iconHeight);
                    
                    $thumb = basename($dest,".".$ext).".png";
                    $file->save($tdir."/".$thumb);                
                    
                    $url = str_replace(__DIR__,$base,$dir."/".$dest);
                    $turl = str_replace(__DIR__,$base,$tdir."/".$thumb);
                    
                    $res[] = array('url'=>$url,'icon'=>$turl);
                }
            }
            echo json_encode($res);
        }        
    }
    
    function load() {
        $components = $this->getComponents();
        $res = file_get_contents(__DIR__."/settings.json");
        if ($res) {
            $res = json_decode($res,true);
        } else {
            $res = array();
        }
        
        $res['components'] = array();
        foreach ($components as $key=>$one) {
            unset($one['update']);
            $res['components'][$key] = $one;
            $res['components'][$key]['id'] = $key;
        }
    
        $res['cached'] = array();
        $base = dirname($_SERVER['SCRIPT_URL']);
    
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__."/style",
                RecursiveDirectoryIterator::SKIP_DOTS));
        foreach ($files as $name => $file) {
            $ext = pathinfo($name, PATHINFO_EXTENSION);
            if ($ext=="tea") {
                $url = str_replace(__DIR__,$base,$name)."\n";
                $res['cached'][$url] = file_get_contents($name);
            }
        }
        
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(realpath(__DIR__."/../modules"),
                RecursiveDirectoryIterator::SKIP_DOTS));
        foreach ($files as $name => $file) {
            $ext = pathinfo($name, PATHINFO_EXTENSION);
            if ($ext=="js") {
                $url = str_replace(dirname(__DIR__),dirname($base),$name)."\n";
                $res['cached'][$url] = file_get_contents($name);
            }
        }
        echo json_encode($res);
    }
    
    
    function save() {
        $settings = @$_REQUEST['settings'];
        $settings = json_decode($settings,true);
        unset($settings['components']);
        file_put_contents(__DIR__."/settings.json",json_encode($settings));
    }    
}