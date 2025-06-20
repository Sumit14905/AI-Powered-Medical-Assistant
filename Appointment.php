<?php
$host = 'localhost';
$user = 'root'; // Change for production
$password = 'anirudh'; // Change for production
$database = 'users';

$con = mysqli_connect($host, $user, $password, $database);

// Check connection
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_POST['submitButton'])) {
    $name = $_POST['fullName'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $doctor = $_POST['doctor'];
    $reason = $_POST['reason'];

    // Prepare the SQL statement to prevent SQL injection
    $query = "INSERT INTO mydata(name, email, phone, date, time, doctor, reason) VALUES(?, ?, ?, ?, ?, ?, ?)";

    // Initialize a prepared statement
    $stmt = mysqli_prepare($con, $query);

    // Check if the statement was prepared successfully
    if ($stmt === false) {
        die("Error preparing statement: " . mysqli_error($con));
    }

    // Bind parameters to the prepared statement
    // 'sssssss' indicates all seven parameters are strings. Adjust if your columns have different types (i = integer, d = double, b = blob)
    mysqli_stmt_bind_param($stmt, 'sssssss', $name, $email, $phone, $date, $time, $doctor, $reason);

    // Execute the prepared statement
    $execute = mysqli_stmt_execute($stmt);

    if ($execute) {
        echo "Record inserted successfully.";
        // Optionally redirect the user or display a success message
        // header("Location: success.php");
        // exit();
    } else {
        echo "Error: " . mysqli_error($con); // For debugging
        // echo "There was an error submitting your form. Please try again."; // For production
    }

    // Close the statement
    mysqli_stmt_close($stmt);
}

// Close the database connection when you're done with it (or at the end of the script)
mysqli_close($con);
?>