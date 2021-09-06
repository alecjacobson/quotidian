<?php
  $ledger = $_POST['ledger'];
  if(strlen($ledger) < 2)
  {
    echo "Ledger looks bogus. Rejecting.";
  }else
  {
    $file = fopen('ledger.json','w');
    fwrite($file, $ledger);
    fclose($file);
    $response = shell_exec('git -c user.name="www-data" -c user.email="no-replay@example.org" commit -m "from save.php" ledger.json');
    echo $response;
  }
?>
