<?php

include "components/logo/logo.php";
include "components/wysiwyg/wysiwyg.php";
include "components/slider/slider.php";

TemplaterApi::addAction('getComponents',function($api,&$components) {
    include "components/common.php";
    include "components/website.php";
    include "components/landing.php";
    include "components/content.php";
});