<?php
/**
 * AllCellphones Contact Form Handler
 * Enhanced PHP contact form processing with validation and security
 */

// Configuration
$receiving_email_address = 'info@allcellphones.com.ar';
$site_name = 'All Cellphones';
$site_url = 'https://allcellphones.com.ar';

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Response function
function sendResponse($success, $message) {
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// Security check: Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Método no permitido');
}

// Basic CSRF protection (check referrer)
$allowed_domains = ['allcellphones.com.ar', 'localhost'];
$referrer = $_SERVER['HTTP_REFERER'] ?? '';
$referrer_domain = parse_url($referrer, PHP_URL_HOST);

if (!in_array($referrer_domain, $allowed_domains) && !empty($referrer)) {
    sendResponse(false, 'Acceso no autorizado');
}

// Input validation and sanitization
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Get and validate form data
$name = sanitizeInput($_POST['name'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$phone = sanitizeInput($_POST['phone'] ?? '');
$subject = sanitizeInput($_POST['subject'] ?? '');
$message = sanitizeInput($_POST['message'] ?? '');

// Additional fields for specific forms
$device = sanitizeInput($_POST['device'] ?? '');
$interest = sanitizeInput($_POST['interest'] ?? '');
$experience = sanitizeInput($_POST['experience'] ?? '');

// Validation
if (empty($name) || strlen($name) < 2) {
    sendResponse(false, 'Por favor ingresá tu nombre completo');
}

if (empty($email) || !validateEmail($email)) {
    sendResponse(false, 'Por favor ingresá un email válido');
}

if (empty($message) || strlen($message) < 10) {
    sendResponse(false, 'Por favor ingresá un mensaje de al menos 10 caracteres');
}

// Determine form type and set appropriate subject
if (!empty($device)) {
    $form_type = 'Consulta de Remanufactura';
    $subject = $subject ?: 'Consulta de Remanufactura Apple';
} elseif (!empty($interest)) {
    $form_type = 'Consulta de iPhones';
    $subject = $subject ?: 'Consulta sobre Venta de iPhones';
} elseif (!empty($experience)) {
    $form_type = 'Consulta de Capacitación';
    $subject = $subject ?: 'Consulta sobre Curso de Capacitación';
} else {
    $form_type = 'Consulta General';
    $subject = $subject ?: 'Consulta desde ' . $site_name;
}

// Build email content
$email_content = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #007aff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 15px; }
        .field strong { color: #007aff; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>Nueva Consulta - {$form_type}</h2>
        <p>{$site_name}</p>
    </div>
    
    <div class='content'>
        <div class='field'>
            <strong>Nombre:</strong> {$name}
        </div>
        
        <div class='field'>
            <strong>Email:</strong> {$email}
        </div>";

if (!empty($phone)) {
    $email_content .= "
        <div class='field'>
            <strong>Teléfono:</strong> {$phone}
        </div>";
}

if (!empty($device)) {
    $email_content .= "
        <div class='field'>
            <strong>Dispositivo:</strong> {$device}
        </div>";
}

if (!empty($interest)) {
    $email_content .= "
        <div class='field'>
            <strong>Interés:</strong> {$interest}
        </div>";
}

if (!empty($experience)) {
    $email_content .= "
        <div class='field'>
            <strong>Experiencia:</strong> {$experience}
        </div>";
}

$email_content .= "
        <div class='field'>
            <strong>Mensaje:</strong><br>
            " . nl2br($message) . "
        </div>
        
        <div class='field'>
            <strong>Fecha:</strong> " . date('d/m/Y H:i:s') . "
        </div>
        
        <div class='field'>
            <strong>IP:</strong> " . ($_SERVER['REMOTE_ADDR'] ?? 'No disponible') . "
        </div>
    </div>
    
    <div class='footer'>
        <p>Este mensaje fue enviado desde el formulario de contacto de {$site_name}</p>
        <p>{$site_url}</p>
    </div>
</body>
</html>";

// Email headers
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: ' . $name . ' <noreply@allcellphones.com.ar>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'X-Priority: 3',
    'X-Form-Type: ' . $form_type
];

// Send email
$mail_sent = mail($receiving_email_address, $subject, $email_content, implode("\r\n", $headers));

if ($mail_sent) {
    // Log successful submission (optional)
    $log_entry = date('Y-m-d H:i:s') . " - Consulta enviada desde: {$email} ({$name}) - Tipo: {$form_type}\n";
    file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
    
    sendResponse(true, '¡Gracias por tu consulta! Te contactaremos pronto.');
} else {
    // Log error (optional)
    $error_entry = date('Y-m-d H:i:s') . " - Error enviando email desde: {$email}\n";
    file_put_contents('contact_errors.txt', $error_entry, FILE_APPEND | LOCK_EX);
    
    sendResponse(false, 'Hubo un error al enviar tu consulta. Por favor intentá nuevamente o contactanos por WhatsApp.');
}
?> 