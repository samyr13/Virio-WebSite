<?php
// Virio — liste « Me prévenir ».
// Enregistre chaque e-mail dans data/inscrits.csv (dossier fermé au public par data/.htaccess).

header('Content-Type: application/json; charset=utf-8');

function reply(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    reply(405, ['ok' => false]);
}

// piège à robots : un humain ne remplit jamais ce champ caché
if (!empty($_POST['bot-field'])) {
    reply(200, ['ok' => true]);
}

$email = trim((string) ($_POST['email'] ?? ''));
if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(422, ['ok' => false, 'error' => 'email']);
}

// un tableur ne doit jamais interpréter l'adresse comme une formule
if (preg_match('/^[=+\-@]/', $email)) {
    $email = "'" . $email;
}

$dir = __DIR__ . '/data';
if (!is_dir($dir) && !mkdir($dir, 0750, true)) {
    reply(500, ['ok' => false]);
}

$file = $dir . '/inscrits.csv';
$isNew = !file_exists($file);
$fh = fopen($file, 'a');
if (!$fh) {
    reply(500, ['ok' => false]);
}
flock($fh, LOCK_EX);
if ($isNew) {
    fputcsv($fh, ['date', 'email']);
}
fputcsv($fh, [date('c'), $email]);
flock($fh, LOCK_UN);
fclose($fh);

reply(200, ['ok' => true]);
