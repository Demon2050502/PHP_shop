<?php
session_start();
session_destroy();
echo "<script>
    localStorage.removeItem('authToken');
    window.location.href = 'review.html';
</script>";
exit();
?>