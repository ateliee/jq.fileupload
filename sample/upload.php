<?php

define('FILENAME','file');
define('UPLOADDIR',dirname(__FILE__).'/tmp');

define('STATUS_SUCCESS',0);
define('STATUS_ERROR',1);

if(isset($_FILES[FILENAME]) && $_FILES[FILENAME]['tmp_name']){
    $origin = $_FILE[FILENAME]['name'];
    $fileext = (strpos($origin,'.') === false ? '' : '.'.substr(strrchr($origin, "."), 1));
    $filename = uniqid().$fileext;

    $destname = UPLOADDIR.'/'.$filename;
    if(@move_uploaded_file($_FILES[FILENAME]['tmp_name'],$destname)){
        header( 'Content-Type: text/javascript; charset=utf-8' );
        echo json_encode(array(
            'status' => STATUS_SUCCESS,
            'filename' => $filename,
            'filepath' => $destname
        ));
        exit;
    }
}
header( 'Content-Type: text/javascript; charset=utf-8' );
echo json_encode(array(
    'status' => STATUS_ERROR,
    'error' => 'file upload error on server'
));
exit;