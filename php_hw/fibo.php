<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');

if (!isset($_GET['n']) || !is_numeric($_GET['n']) || intval($_GET['n']) < 1) {
    echo json_encode(['error' => 'Please provide a positive integer for n']);
    exit;
}

$n = intval($_GET['n']);

// Function to generate Fibonacci sequence
function generateFibonacci($length) {
    $fibSequence = [];
    
    if ($length >= 1) $fibSequence[] = 0; 
    if ($length >= 2) $fibSequence[] = 1; 
    
    for ($i = 2; $i < $length; $i++) {
        $fibSequence[] = $fibSequence[$i - 1] + $fibSequence[$i - 2];
    }
    
    return $fibSequence;
}

$fibSequence = generateFibonacci($n);

$response = [
    'length' => $n,
    'fibSequence' => $fibSequence
];

echo json_encode($response);
?>



