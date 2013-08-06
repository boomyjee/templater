<?php

if (!class_exists('Liquid')) require_once __DIR__."/lib/Liquid/Liquid.class.php";

class TemplaterApi {
    
    function __construct($lock=true) {
        if (file_exists(__DIR__."/lock")) {
            echo "Please remove file named 'lock' from server directory to allow demo api to work";
            die();
        }
        
        $this->uploadDir = __DIR__."/upload";
        $this->settingsPath = __DIR__."/settings.json";
        
        $this->base_url = dirname(dirname($_SERVER['SCRIPT_URL']));
        $this->base_dir = dirname(__DIR__);
    }    
    
    function compress($out) {
        if (ini_get('zlib.output_compression') && 'ob_gzhandler' != ini_get('output_handler') && isset($_SERVER['HTTP_ACCEPT_ENCODING'])) {
            header('Vary: Accept-Encoding');
            if ( false !== stripos($_SERVER['HTTP_ACCEPT_ENCODING'], 'deflate') && function_exists('gzdeflate')) {
                header('Content-Encoding: deflate');
                $out = gzdeflate( $out, 3 );
            } elseif ( false !== stripos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') && function_exists('gzencode') ) {
                header('Content-Encoding: gzip');
                $out = gzencode( $out, 3 );
            }
        }
        echo $out;
        exit;
    }
    
    function run() {
        $this->{$_REQUEST['_type']}();
        die();                
    }
    
    function getComponents() {
        $components = array();
        include "components.php";
        return $components;
    }
    
    function getDataSources() {
        return array();
    }
    
    function component($values = false,$ret = false) {
        if (!$values) $values = $_REQUEST['values'];
        $components = $this->getComponents();
        $res = array();
        foreach ($values as $val) {
            $upd = array('html'=>'');
            $type = $val['type'];
            if (@$components[$type]) {
                if (isset($components[$type]['html'])) {
                    $upd['html'] = $components[$type]['html'];
                } else {
                    $upd = $components[$type]['update']($val,@$_REQUEST['dataSource'],$this,true);
                }
            }
            $res[] = $upd;
        }
        if ($ret) return $res;
        $this->compress(json_encode($res));
    }
    
    function liquid($template,$dataSource) {
        $data = array();
        $liquid = new \LiquidTemplate();
        if (class_exists("LiquidThemeFilters"))
            $liquid->registerFilter("LiquidThemeFilters");
        $tpl = $liquid->parse($template);
        return $tpl->render($data);        
    }    
    
    function upload() {
        $name = @$_REQUEST['name'];
        $iconWidth = @$_REQUEST['iconWidth'];
        $iconHeight = @$_REQUEST['iconHeight'];
        
        if ($name) {
            $dir = $this->uploadDir."/".$name;
            $tdir = $this->uploadDir."/".$name."/thumbs";
            
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
                    
                    require_once __DIR__."/lib/PhpThumb/Factory.php";
                    $file = \PhpThumb\Factory::create($dir."/".$dest,array('resizeUp'=>false));
                    $file->resize($iconWidth,$iconHeight);
                    
                    $thumb = basename($dest,".".$ext).".png";
                    $file->save($tdir."/".$thumb);    
                    
                    $url = str_replace($this->base_dir,$this->base_url,$dir."/".$dest);
                    $turl = str_replace($this->base_dir,$this->base_url,$tdir."/".$thumb);
                    
                    $res[] = array('url'=>$url,'icon'=>$turl);
                }
            }
            echo json_encode($res);
        }        
    }
    
    public $settings = false;
    public $settings_array = false;
    function getSettings($assoc=true) {
        $key = 'settings'.($assoc ? '_array':'');
        if (!$this->$key) {
            $this->$key = @file_get_contents($this->settingsPath);
            if ($this->$key) {
                $this->$key = json_decode($this->$key,$assoc);
            } else {
                $this->$key = array();
            }
        }
        return $this->$key;
    }
    
    function load() {
        $components = $this->getComponents();
        $res = $this->getSettings();
        
        $res['dataSources'] = $this->getDataSources();
        $res['components'] = array();
        foreach ($components as $key=>$one) {
            unset($one['update']);
            $res['components'][$key] = $one;
            $res['components'][$key]['id'] = $key;
            
            $comps = $this->component(array(array('type'=>$key)),true);
            $res['components'][$key]['new'] = $comps[0];
        }
        
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(realpath(__DIR__."/../modules"),
                RecursiveDirectoryIterator::SKIP_DOTS));
        foreach ($files as $name => $file) {
            $ext = pathinfo($name, PATHINFO_EXTENSION);
            if ($ext=="js" || $ext=="tea") {
                $url = str_replace($this->base_dir,$this->base_url,$name)."\n";
                $res['cached'][$url] = file_get_contents($name);
            }
        }
        $this->compress(json_encode($res));
    }
    
    
    function save() {
        $settings = @$_REQUEST['settings'];
        $settings = json_decode($settings,true);
        unset($settings['components']);
        file_put_contents($this->settingsPath,json_encode($settings));
    }    
    
    function publish() {
        // nothing to do
    }
    
    function view($name,$dataSource) {
        $settings = $this->getSettings(false);
        $tpl = $settings->templates->$name;
        
        Component::$api = $this;
        Component::$dataSource = $dataSource;
        Component::$settings &= $settings;

        $root_data = $tpl;
        $root = new Component($root_data);
        
        $hash = array();
        $inherit = false;
        
        $title = false;
        
        // if template has a parent then load parent template and create substitution has from current one
        if (@$root_data->value->parentTemplate) {
            $findRoot = function ($data,$inherit) use (&$settings,&$findRoot,&$hash,&$root_data) {
                if (@$data->value->parentTemplate) {
                    $findRoot($settings->templates->{$data->value->parentTemplate} ? : (object)array(),true);
                    if ($data->children) foreach ($data->children as $child) {
                        if (@$child->value->id) $hash[$child->value->id] = array('data'=>$child,'inherit'=>$inherit);
                    }
                } else {
                    $root_data = $data;
                }
            };
            
            $findRoot($tpl,false);
            $inherit = @$root->parentTemplate ? true : false;
        }
        
        // get all components into list recursively taking into account template inheritance
        $components = array();
        $component_values = array();
        
        $createComponents = function($parent,$data,$inherit) use (&$settings,&$components,&$component_values,&$hash,&$createComponents) {
            if ($data->children) foreach ($data->children as $child) {
                $ch_data = $child;
                $ch_inherit = $inherit;
                
                if ($child->value && $child->value->id && isset($hash[$child->value->id])) {
                    $ch_data = $hash[$child->value->id]['data'];
                    $ch_inherit = $hash[$child->value->id]['inherit'];
                }
                
                $cmp = new Component($child->value,$parent);
                $cmp->inherited = $ch_inherit;
                
                $components[] = $cmp;
                $component_values[] = $cmp->value;
                
                $createComponents($cmp,$ch_data,$ch_inherit);
                
                Component::$api->registerComponent($cmp);
            }
        };
        $createComponents($root,$root_data,$inherit); 
        $root_html = $root->render();
        
        ?>
            <body>
                <?= $root_html ?>
            </body>
        <?
    }
    
    function registerComponent($cmp) {
        // nothing to do
    }
}

class Component {
    
    static $settings;
    static $components = false;
    static $dataSource = false;
    static $api = false;
    
    function __construct($val,$parent=false) {
        $this->value = $val ?: (object)array();
        $this->children = array();
        if ($parent) {
            $parent->children[] = $this;
        }
    }
    
	function objectToArray($d) {
		if (is_object($d) && !$d instanceof Closure) {
			$d = get_object_vars($d);
		}
		if (is_array($d)) {
			return array_map(array($this,__FUNCTION__), $d);
		}
		else {
			return $d;
		}
	}
    
    function render() {
        if (!self::$components) {
            self::$components = self::$api->getComponents();
        }
        
        $type = $this->value->type;
        $html = "";
        if (!$type) {
            $html = '<br class="component-area">';
        } else {
            if (@self::$components[$type]) {
                $upd = array('html'=>'');
                if (isset(self::$components[$type]['html'])) {
                    $upd['html'] = self::$components[$type]['html'];
                } else {
                    $f = self::$components[$type]['update'];
                    $upd = $f($this->objectToArray($this->value),self::$dataSource,self::$api,false);
                }
                $html = $upd['html'];
            }
        }
        
        $me = $this;
        if ($me->value->id) $html = preg_replace_callback(
            '|^\s*<(\w+)(.*?)>|',
            function ($matches) use (&$me) {
                if (!preg_match('|id\s*=\s*|',$matches[0])) {
                    return "<".$matches[1].' id="'.$me->value->id.'"'.$matches[2].">";
                }
                return $matches[0];
            },
            $html
        );
        if ($me->value->class) $html = preg_replace_callback(
            '|^\s*<(\w+)(.*?)>|',
            function ($matches) use (&$me) {
                if (!preg_match('|class\s*=\s*?|',$matches[0])) {
                    return "<".$matches[1].' class="'.$me->value->class.'"'.$matches[2].">";
                }
                return $matches[0];
            },
            $html
        );
        $html = preg_replace_callback(
            '|<br class="component-area".*?>|',
            function ($matches) use (&$me) {
                $child_html = "";
                foreach ($me->children as $child) {
                    $child_html .= $child->render();
                }
                return $child_html;
            },
            $html
        );
        return $html;
    }
}