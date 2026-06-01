<?php
/**
 * BERIAS BPM Assessment - HubSpot Score Update Proxy
 * 
 * This script updates an existing HubSpot contact with their
 * BPM maturity assessment score and level.
 * 
 * Deploy to: sprint.berias.com/api/hubspot-score.php
 */

// CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Your HubSpot Private App API Key - KEEP THIS SECRET
$HUBSPOT_API_KEY = '***REMOVED***';

// Read request body
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email is required']);
    exit;
}

// Search for existing contact by email
$searchData = [
    'filterGroups' => [[
        'filters' => [[
            'propertyName' => 'email',
            'operator' => 'EQ',
            'value' => $input['email'],
        ]]
    ]],
    'properties' => ['email'],
    'limit' => 1,
];

$ch = curl_init('https://api.hubapi.com/crm/v3/objects/contacts/search');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($searchData),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $HUBSPOT_API_KEY,
    ],
]);

$searchResponse = json_decode(curl_exec($ch), true);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if (empty($searchResponse['results'][0]['id'])) {
    http_response_code(404);
    echo json_encode(['error' => 'Contact not found']);
    exit;
}

$contactId = $searchResponse['results'][0]['id'];

// Update contact with BPM score
$updateData = [
    'properties' => [
        'bpm_maturity_score' => strval($input['bpm_maturity_score'] ?? 0),
        'bpm_maturity_level' => $input['bpm_maturity_level'] ?? '',
    ]
];

$ch = curl_init("https://api.hubapi.com/crm/v3/objects/contacts/$contactId");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => 'PATCH',
    CURLOPT_POSTFIELDS => json_encode($updateData),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $HUBSPOT_API_KEY,
    ],
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true, 'message' => 'Score updated in HubSpot']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'HubSpot API error', 'details' => json_decode($response, true)]);
}
