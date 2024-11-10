<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHPhw3_2</title>
    <style>
        .song-list {
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
        .song-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #ffffff;
            width: 75%;
            padding: 10px;
            margin-bottom: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
        }
        .song-title {
            font-weight: bold;
            font-family: 'Times New Roman', Times, serif;
            font-size: 1.2em;
            color: #333;
        }
        .song-artist {
            font-style: italic;
            color: #555;
            margin-top: 5px;
            margin-left: 15px;
        }
    </style>
</head>
<body>
    <h1 style="margin: 10px auto; text-align: center">Song Results</h1>

    <?php
    if (isset($_POST['genres']) && is_array($_POST['genres'])) {
        $host = 'localhost';
        $dbname = 'dbhur56gargpja';
        $username = 'uvqu20wfl8knv';
        $password = 'yqhdhr2000';
        $conn = new mysqli($host, $username, $password, $dbname);
        
        if ($conn->connect_error) {
            die('Can not establish connection: '. $conn->connect_error);
        }

        $genreIds = $_POST['genres'];
        $placeholders = implode(',', array_fill(0, count($genreIds), '?'));
        $sql = "
        SELECT Song.title, Artist.artist_name
        FROM Song
        JOIN Artist ON Song.artist_id = Artist.artist_id
        JOIN Song_Genres ON Song.song_id = Song_Genres.song_id
        WHERE Song_Genres.genre_id IN ($placeholders)
        ";
        
        $stmt = $conn->prepare($sql);
        $types = str_repeat('i', count($genreIds));
        $stmt->bind_param($types, ...$genreIds);
        $stmt->execute();
        $result = $stmt->get_result();

        echo '<div class="song-list">';
        while ($row = $result->fetch_assoc()) {
            echo '<div class="song-item">';
            echo '<div class="song-title">' . $row['title'] . '</div>';
            echo '<div class="song-artist">by ' . $row['artist_name'] . '</div>';
            echo '</div>';
        }
        echo '</div>';

        $stmt->close();
        $conn->close();

    } else {
        echo "<p>No genres selected. Please go back and select at least one genre.</p>";
    }
    ?>
</body>
</html>