<?php
    $sco_json = $_POST['sco_json'];
    $sco_number = $_POST['sco_number'];

    rename('./scos/'.$sco_number.'/eng/lesson.JSON', './scos/'.$sco_number.'/eng/lesson.'.time().'.'.$_SERVER['REMOTE_USER'].'.JSON');

    $file = fopen('./scos/'.$sco_number.'/eng/lesson.JSON', "w") or die("error");
    fwrite($file,$sco_json);
    fclose($file);
?>