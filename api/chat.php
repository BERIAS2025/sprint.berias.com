<?php
/**
 * BERIAS Instant Support — Claude API Proxy
 * Deploy to: sprint.berias.com/api/chat.php
 */

// ── Load config ────────────────────────────────────────────────────────────────
$configFile = __DIR__ . '/config.php';
if (file_exists($configFile)) { require_once $configFile; }

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://sprint.berias.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── API Key ────────────────────────────────────────────────────────────────────
$CLAUDE_KEY = defined('CLAUDE_API_KEY') ? CLAUDE_API_KEY : getenv('CLAUDE_API_KEY');
if (!$CLAUDE_KEY) {
    http_response_code(500);
    echo json_encode(['error' => 'Service not configured']);
    exit;
}

// ── Input ──────────────────────────────────────────────────────────────────────
$raw = json_decode(file_get_contents('php://input'), true);
if (!$raw || empty($raw['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Message required']);
    exit;
}

$userMsg  = htmlspecialchars(strip_tags($raw['message']), ENT_QUOTES, 'UTF-8');
$intent   = $raw['intent']   ?? 'general';
$lang     = $raw['language'] ?? 'en';
$history  = is_array($raw['history']) ? array_slice($raw['history'], -8) : [];

// ── System prompt ──────────────────────────────────────────────────────────────
$systemPrompt = <<<PROMPT
You are the BERIAS Instant Support assistant — a specialized AI built for BERIAS LLC, a micro-consulting firm
founded by Tobias Hess, based in Coral Gables, Florida.

ABOUT BERIAS:
- Offers Adaptive Micro-Consulting starting at \$5,000 per engagement
- Flagship product: the 30-Day Clarity Sprint — identifies and resolves a company's biggest operational
  bottleneck within 30 days, guaranteed
- Target clients: mid-size companies (50–5,000 employees) across all industries
- Deep expertise in logistics, supply chain, process optimization, project management, and AI automation

YOUR ROLE:
- Deliver immediate, specific, expert-level insights to operations and logistics professionals
- Be direct and confident. Use real industry terminology naturally.
- Never be vague — always give specific numbers, named frameworks, or concrete examples
- You are transparent: you are an AI assistant, not a human
- After delivering value, offer a connection to Tobias for a free 15-minute Process Leak Audit call

EXPERTISE (always respond with specificity and numbers where relevant):
Freight Cost Optimization:
  - Carrier concentration risk, accessorial audits, lane-level benchmarking, dark lanes
  - Average overbilling rates: 12–18% of freight invoices contain errors or unauthorized charges
  - Carrier consolidation vs. diversification trade-offs

Carrier Performance:
  - Highway (gohighway.com): carrier identity, compliance verification, FMCSA integration
  - RMIS/Carrier411: ongoing carrier safety and insurance monitoring
  - The three metrics that matter: on-time delivery, damage rate, communication responsiveness
  - Carrier agreement gaps as the root cause of most performance failures

Logistics Platforms:
  - McLeod Software: dominant broker/carrier TMS (PowerBroker); most users exploit <40% of capability
  - MercuryGate: mid-market shipper/3PL TMS; strong rate engine
  - project44 / FourKites: real-time supply chain visibility; differentiated by carrier network coverage
  - DAT Solutions: largest North American load board; RateView for lane benchmarking
  - Flexport: tech-forward freight forwarder; best for international shippers
  - Loadsmart: digital broker; best as supplementary spot capacity source
  - Highway: carrier vetting (onboarding); not performance monitoring
  - Turvo: collaborative TMS; strong for multi-party 3PL operations

Process Optimization (BPM):
  - Digital handoffs: 3–7 per shipment on average, 3–8 minutes each = 10–35 hours/week waste
  - Most common gap: undocumented exception processes
  - BERIAS 5-day audit: identifies 4–8 optimization opportunities consistently
  - Average ROI on \$5K engagement: \$80K–\$220K annual savings

RFP & Procurement:
  - The 12-month clean data rule before a credible RFP
  - Annual mini-benchmarks (5–8 carriers, 10 lanes): market intelligence even without switching intent
  - Scoring dimensions beyond rate: transit reliability, damage claims, technology integration

BPM Maturity Assessment (BERIAS framework):
  - 15 dimensions across: Strategy, Governance, Methodology, Documentation, Performance, Continuous Improvement
  - 5 maturity levels: Initial → Managed → Standardized → Predictable → Innovating

TONE AND STYLE:
- Professional but direct — no corporate filler
- Never say "Great question!" or "Absolutely!" — just answer
- Maximum 4 sentences per response in chat
- If genuinely unsure, say so and redirect to what you do know
- Language: respond in {LANG}

CURRENT TOPIC CONTEXT: {INTENT}
PROMPT;

$systemPrompt = str_replace('{LANG}',   strtoupper($lang),   $systemPrompt);
$systemPrompt = str_replace('{INTENT}', $intent,             $systemPrompt);

// ── Build messages ─────────────────────────────────────────────────────────────
$messages = [];
foreach ($history as $msg) {
    if (!empty($msg['role']) && !empty($msg['content']) &&
        in_array($msg['role'], ['user','assistant'])) {
        $messages[] = [
            'role'    => $msg['role'],
            'content' => (string) $msg['content'],
        ];
    }
}
$messages[] = ['role' => 'user', 'content' => $userMsg];

// ── Call Claude ────────────────────────────────────────────────────────────────
$payload = [
    'model'      => 'claude-haiku-4-5-20251001',
    'max_tokens' => 300,
    'system'     => $systemPrompt,
    'messages'   => $messages,
];

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'x-api-key: '         . $CLAUDE_KEY,
        'anthropic-version: 2023-06-01',
    ],
    CURLOPT_TIMEOUT        => 25,
    CURLOPT_CONNECTTIMEOUT => 8,
]);

$resp     = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'AI service temporarily unavailable']);
    exit;
}

$data  = json_decode($resp, true);
$reply = $data['content'][0]['text'] ?? 'I wasn\'t able to process that. Please try again.';

echo json_encode(['reply' => $reply]);
