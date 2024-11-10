<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHPhw3_1</title>
    <style>
        .genre-list {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f8f9fb;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            max-width: 50%;
            max-height: 50%;
            margin: auto auto;
        }
        .genre-item {
            display: inline-flex;
            justify-content: center;
            background-color: #ffffff;
            width: 75%;
            padding: 10px;
            margin-bottom: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
        }


    </style>
</head>
<body style="text-align: center">
    <h1>Select Genres</h1>

    <?php
    $host = 'localhost';
    $dbname = 'dbhur56gargpja';
    $username = 'uvqu20wfl8knv';
    $password = 'yqhdhr2000';
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        die('Can not establish connection: '. $conn->connect_error);
    } 
    // else {
    //     echo "Connect successfully";
    // }

    $sql = "SELECT genre_id, genre_name FROM Genre";
    $result = $conn->query($sql);
    echo '<div class="genre-list">';
    echo '<form action="db2.php" method="POST">';
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo '<div  class="genre-item">';
            echo "<label>";
            echo '<input type="checkbox" name="genres[]" value="' . $row['genre_id'] . '"> ' . $row['genre_name'];
            echo "</label><br>";
            echo '</div>';

        }
    } else {
        echo "<div>Can't fetch stuff from db</div>";
    }
    echo "<br>";
    echo '<button type="submit">Find Songs</button>';
    echo '</form>';
    echo '</div>';


    ?>
</body>
</html>