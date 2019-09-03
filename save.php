<?php
  $data = $_POST['data'];
  $file = fopen('counts.json','w');
  fwrite($file, $data);
  fclose($file);
  echo strlen($data);
?>
