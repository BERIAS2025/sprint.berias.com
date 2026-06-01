<?php
/**
 * BERIAS BPM Assessment - HubSpot Lead Capture Proxy
 * 
 * This script receives lead data from the assessment form
 * and forwards it to HubSpot's Contacts API.
 * The API key stays server-side for security.
 * 
 * Deploy to: sprint.berias.com/api/hubspot-lead.php
 */

// CORS headers for same-origin requests
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

// Prepare HubSpot contact data
$contactData = [
    'properties' => [
        'firstname' => $input['firstname'] ?? '',
        'lastname' => $input['lastname'] ?? '',
        'company' => $input['company'] ?? '',
        'email' => $input['email'],
        'hs_lead_status' => 'NEW',
    ]
];

// Send to HubSpot Contacts API
$ch = curl_init('https://api.hubapi.com/crm/v3/objects/contacts');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($contactData),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $HUBSPOT_API_KEY,
    ],
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// If contact already exists (409 conflict), try to update instead
if ($httpCode === 409) {
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
    curl_close($ch);

    if (!empty($searchResponse['results'][0]['id'])) {
        $contactId = $searchResponse['results'][0]['id'];

        // Update existing contact
        $ch = curl_init("https://api.hubapi.com/crm/v3/objects/contacts/$contactId");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => 'PATCH',
            CURLOPT_POSTFIELDS => json_encode(['properties' => [
                'firstname' => $input['firstname'] ?? '',
                'lastname' => $input['lastname'] ?? '',
                'company' => $input['company'] ?? '',
            ]]),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $HUBSPOT_API_KEY,
            ],
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
    }
}

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true, 'message' => 'Contact saved to HubSpot']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'HubSpot API error', 'details' => json_decode($response, true)]);
}
