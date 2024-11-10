<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Office Hours</title>
    <style>
        .office-hours {
            width: 300px;        
        }
        .office-hours div {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
        }
    </style>
</head>
<body>

<?php

$officeHours = [
    'Monday' => '9am - 4pm',
    'Tuesday' => '9am - 4pm',
    'Wednesday' => '9am - 4pm',
    'Thursday' => '9am - 4pm',
    'Friday' => '9am - 4pm',
    'Saturday' => 'Closed',
    'Sunday' => 'Closed'
];

function displayOfficeHours($hoursArray) {
    $output = '<div class="office-hours">';
    foreach ($hoursArray as $day => $hours) {
        $output .= "<div><div>$day</div><div>$hours</div></div>";
    }
    $output .= '</div>';
    return $output;
}

echo displayOfficeHours($officeHours);
?>

</body>
</html>