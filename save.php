<?php
  $data = $_POST['data'];
  $file = fopen('ledger.json','w');
  fwrite($file, $data);
  fclose($file);
  $response = shell_exec('git -c user.name="www-data" -c user.email="no-replay@example.org" commit -m "from save.php" ledger.json');
  echo strlen($response);
?>
