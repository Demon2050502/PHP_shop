<?php
session_start();
session_destroy();
echo "<script>
    localStorage.removeItem('authToken');
    window.location.href = '../index.html';
</script>";
exit();
?>