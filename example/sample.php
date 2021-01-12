<?php

$manifest = require(__DIR__ . '/public/mix-manifest.php');

echo "\nManifest contents:\n";
echo "------------------------------------------------\n";
foreach ($manifest as $key => $entry) {
    echo "$key => $entry\n";
}