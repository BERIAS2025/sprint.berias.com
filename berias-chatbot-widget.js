(function(cfg){
'use strict';
const C = Object.assign({
  demoMode:true, language:'en', apiEndpoint:'/api/chat.php',
  hubspotEndpoint:'/api/hubspot-lead.php', n8nWebhook:'',
  calendlyUrl:' ', autoOpenDelay:25000
}, cfg);

// ── Brand ─────────────────────────────────────────────────────────────────────
const NAVY='#0F304C', GREEN='#A2C614', WHITE='#FFFFFF';

// ── Intents ───────────────────────────────────────────────────────────────────
const INTENTS=[
  { id:'freight-cost', title:'Freight Cost Reduction',
    desc:'Find hidden savings in your carrier spend',
    icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>` },
  { id:'carrier-performance', title:'Carrier Performance',
    desc:'Score, benchmark, and improve your carriers',
    icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>` },
  { id:'process-optimization', title:'Process Optimization',
    desc:'Eliminate waste in your logistics workflows',
    icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>` },
  { id:'platforms', title:'Platform & Tool Guide',
    desc:'Unbiased overview of logistics software',
    icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>` },
  { id:'rfp', title:'RFP & Procurement',
    desc:'Prepare for your next carrier negotiation',
    icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
  { id:'custom', title:'Ask a Question',
    desc:'Something specific on your mind?',
    icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` },
];

// ── Hardcoded insight content ──────────────────────────────────────────────────
const RESPONSES={
  'freight-cost':[
    {type:'text', text:'Three things most teams overlook when it comes to freight costs:'},
    {type:'insight', title:'1. The Accessorial Audit Gap',
     text:'Fuel surcharges, detention, and residential delivery fees are almost never audited systematically. On average, 12–18% of freight invoices contain at least one billing error or unauthorized charge. A 90-day audit of your top 5 carriers typically recovers $40K–$180K.'},
    {type:'insight', title:'2. Carrier Concentration Risk',
     text:'If 80%+ of your volume runs through 1–3 carriers, you\'re paying above-market rates on your most important lanes. A lane-by-lane benchmark usually reveals 10–18% savings potential — often without switching carriers at all.'},
    {type:'insight', title:'3. Dark Lanes',
     text:'Most shippers have 8–15 lanes with no contracted rate and 100% spot market exposure. These typically run 22–35% above what a negotiated rate would cost. Mapping them takes one day. The savings are immediate.'},
    {type:'cta', text:'Want a quick cost-leak analysis for your operation? Share your email and I\'ll send a 1-page overview.'},
  ],
  'carrier-performance':[
    {type:'text', text:'Carrier performance is often mismanaged — usually because teams measure too many things or the wrong things.'},
    {type:'insight', title:'1. The Three Metrics That Actually Matter',
     text:'Out of 15+ metrics most TMS platforms track, only three predict customer satisfaction reliably: on-time delivery rate, damage rate, and communication responsiveness. If you can\'t get clean data on these from your carriers, that\'s the first problem to solve.'},
    {type:'insight', title:'2. Highway and Compliance Tools',
     text:'Highway (gohighway.com) is one of the strongest carrier vetting tools for brokers — it aggregates FMCSA safety data, insurance verification, and identity checks. Essential for new carrier onboarding. It doesn\'t replace your own performance tracking, which only your TMS can provide.'},
    {type:'insight', title:'3. The Root Cause Is Usually the Agreement',
     text:'70% of carrier performance issues trace back to unclear expectations in the carrier agreement — not carrier incompetence. Vague transit windows, no defined damage claim process, missing communication protocols. A 1-day contract review typically surfaces 4–6 gaps.'},
    {type:'cta', text:'Want a carrier scorecard template you can use this week? Share your email and I\'ll send one over.'},
  ],
  'process-optimization':[
    {type:'text', text:'Process waste in logistics is almost always invisible until you measure it. Here\'s where to look first:'},
    {type:'insight', title:'1. Digital Handoffs',
     text:'The average logistics team performs 3–7 manual re-keying tasks per shipment — copying data between systems. At 200 shipments per week and 5 minutes per handoff, that\'s 10–35 hours of pure waste weekly. One integration eliminates it entirely.'},
    {type:'insight', title:'2. The Undocumented Exception',
     text:'The most common process gap is a missing one: "how we handle exceptions" lives in someone\'s head. When that person is out, the exception costs 3–5x more to resolve. Documenting your top 10 exception scenarios takes one day and eliminates most operational fire-fighting.'},
    {type:'insight', title:'3. The BERIAS 5-Day Audit',
     text:'Our standard process diagnostic takes 5 business days and consistently identifies 4–8 optimization opportunities. The top two are typically executable within 30 days without any new software. Average ROI: $80K–$220K in annual savings on a $5K engagement.'},
    {type:'cta', text:'Would a 30-minute call with Tobias to walk through your biggest process pain point be useful? No prep needed.'},
  ],
  'platforms':{type:'directory'},
  'rfp':[
    {type:'text', text:'Most companies go to RFP too early, with the wrong data, and leave significant value on the table.'},
    {type:'insight', title:'1. The 12-Month Data Rule',
     text:'You need at least 12 months of clean lane data — volume, weight, frequency, and on-time history — before a credible RFP. Without it, carriers pad their rates to cover the uncertainty. Clean data gives you the leverage; incomplete data gives it to the carrier.'},
    {type:'insight', title:'2. The Annual Mini-Benchmark',
     text:'Run a mini-RFP (5–8 carriers, 10 key lanes) every 12 months as a market intelligence exercise even without switching intent. This alone typically justifies a 5–10% rate reduction from incumbents — just from the knowledge that you\'re watching the market.'},
    {type:'insight', title:'3. Score Beyond Rate',
     text:'The biggest RFP mistake is evaluating rate only. A carrier 3% more expensive with 97% on-time delivery vs. 88% is worth significantly more to your customer satisfaction score — and to the cost of claims and exception management.'},
    {type:'cta', text:'Want a simple RFP readiness checklist? Drop your email and I\'ll send one over.'},
  ],
  'custom':{type:'input'},
};

// ── Platform Knowledge Base ────────────────────────────────────────────────────
const PLATFORMS=[
  {id:'highway',name:'Highway',category:'Carrier Compliance & Vetting',
   summary:'Highway is the leading carrier identity and compliance platform for freight brokers. It aggregates FMCSA safety scores, insurance verification, cargo theft alerts, and identity validation into a single carrier onboarding workflow. Essential for brokers onboarding 20+ carriers per month. It verifies who you\'re working with — it doesn\'t track their ongoing performance.',
   bestFor:'Freight brokers, 3PLs',pricing:'Subscription, scales with carrier volume'},
  {id:'project44',name:'project44',category:'Real-Time Visibility',
   summary:'project44 is the market-leading supply chain visibility platform — real-time tracking across TL, LTL, ocean, air, and parcel through direct carrier API integrations. Strong ROI case on reduced check-call time and proactive exception management. The right choice when you need a single pane of glass across a complex carrier network.',
   bestFor:'Enterprise shippers, 3PLs with 50+ carrier relationships',pricing:'Enterprise, typically $50K–$250K+/year'},
  {id:'mcleod',name:'McLeod Software',category:'TMS — Carriers & Brokers',
   summary:'McLeod\'s PowerBroker is the dominant TMS for mid-to-large freight brokers in North America. Deep functionality, strong EDI capabilities, complex implementation. Most McLeod users utilize less than 40% of the platform\'s capabilities — if you\'re on McLeod, there\'s likely significant untapped automation available.',
   bestFor:'Asset carriers, mid-to-large freight brokers',pricing:'License + implementation, typically $150K–$500K+ initial'},
  {id:'mercurygate',name:'MercuryGate',category:'TMS — Shippers & 3PLs',
   summary:'MercuryGate is a cloud TMS for shippers and 3PLs. Strong multi-modal support and a flexible rate engine. Mid-market friendly compared to Oracle TM or SAP. Often selected by shippers who have outgrown a basic TMS but aren\'t ready for Tier-1 enterprise complexity.',
   bestFor:'Mid-market shippers, 3PLs',pricing:'SaaS, typically $30K–$120K/year'},
  {id:'dat',name:'DAT Solutions',category:'Load Board & Rate Intelligence',
   summary:'DAT is the largest load board in North America with 500M+ loads posted annually. Beyond the load board, DAT RateView is the most important source for lane-level rate benchmarking. If you\'re not using DAT rate data in carrier negotiations, you\'re negotiating without market context.',
   bestFor:'Freight brokers, shippers benchmarking rates',pricing:'From ~$150/month to enterprise'},
  {id:'fourkites',name:'FourKites',category:'Real-Time Visibility',
   summary:'FourKites competes directly with project44 in supply chain visibility. Strong in North American truckload, growing internationally. Known for predictive ETA accuracy and good CPG/retail sector coverage. Carrier network coverage in your specific lanes is the key differentiator when choosing between project44 and FourKites.',
   bestFor:'Enterprise shippers, retail and CPG supply chains',pricing:'Enterprise, similar range to project44'},
  {id:'flexport',name:'Flexport',category:'Digital Freight Forwarding',
   summary:'Flexport started as a tech-forward freight forwarder and has evolved into a full logistics platform. Strong in ocean and air freight with real-time visibility, document management, and customs coordination built in. Better technology experience than traditional forwarders. Best for importers/exporters who value data transparency.',
   bestFor:'Importers/exporters, international supply chains',pricing:'Transaction-based + platform fee'},
  {id:'loadsmart',name:'Loadsmart',category:'Digital Freight Broker',
   summary:'Loadsmart is a digital freight broker with strong rate automation and API integration capabilities. Useful for shippers as an on-demand spot capacity source and for overflow lanes. Integrates with most major TMS platforms. Best used as a supplementary capacity tool, not a primary carrier strategy.',
   bestFor:'Shippers needing spot capacity, TMS-integrated procurement',pricing:'Transaction-based'},
  {id:'rmis',name:'RMIS / Carrier411',category:'Ongoing Carrier Risk Monitoring',
   summary:'RMIS provides continuous carrier safety and compliance monitoring — insurance changes, authority revocations, safety score deterioration. Key distinction from Highway: RMIS monitors carriers you\'re already working with; Highway is stronger for onboarding new ones. Many brokerages use both.',
   bestFor:'Freight brokers and 3PLs with large carrier networks',pricing:'Subscription, scales with carrier count'},
  {id:'turvo',name:'Turvo',category:'Collaborative TMS',
   summary:'Turvo takes a different approach: a shared workspace where shippers, carriers, and brokers collaborate on a single shipment view. Strong for 3PLs managing complex multi-party logistics. Significantly reduces status check calls. Newer platform with a smaller carrier integration library than McLeod, but considerably better UX.',
   bestFor:'3PLs, collaborative multi-party supply chain operations',pricing:'SaaS subscription'},
];

// ── Translations ───────────────────────────────────────────────────────────────
const T={
  en:{
    launcherLabel:'Instant Support',launcherSub:'free',
    windowTitle:'BERIAS Instant Support',windowSub:'Free · Powered by AI',
    welcomeQ:'What brings you here today?',
    welcomeHint:'Select a topic and I\'ll share specific, actionable insights — no email needed.',
    typing:'Thinking',
    leadTitle:'Get your custom analysis',
    leadDesc:'Share your details and I\'ll send a tailored 1-page summary to your inbox.',
    fName:'Your name',fEmail:'Work email',fCompany:'Company',
    fBtn:'Send my analysis',fPrivacy:'No spam. Unsubscribe anytime.',
    bookTitle:'Talk to Tobias directly',
    bookDesc:'15 minutes, free, no pitch — just a clear diagnosis of your situation.',
    bookBtn:'Schedule a free call \u2192',
    backTopics:'\u2190 Back to topics',backPlatforms:'\u2190 Back to platforms',
    inputHint:'Ask a follow-up question\u2026',
    followUpHint:'Still have questions? Just type below \u2014 I\u2019m here.',
    dirTitle:'Logistics Platform Guide',
    dirHint:'Select a platform for an unbiased expert overview.',
    bestFor:'Best for',pricing:'Pricing',
    thankYou:'Thank you, {name}. Your analysis is on its way to {email}.',
    customPrompt:'Of course \u2014 what\'s on your mind? I\'ll give you something specific right away.',
  },
  de:{
    launcherLabel:'Sofort-Beratung',launcherSub:'kostenlos',
    windowTitle:'BERIAS Sofort-Beratung',windowSub:'Kostenlos \u00b7 KI-gest\u00fctzt',
    welcomeQ:'Was f\u00fchrt Sie heute hierher?',
    welcomeHint:'W\u00e4hlen Sie ein Thema f\u00fcr konkrete Einblicke \u2014 ohne E-Mail.',
    typing:'Analysiere',
    leadTitle:'Ihre individuelle Analyse',
    leadDesc:'Geben Sie Ihre Daten ein und ich sende Ihnen eine ma\u00dfgeschneiderte Zusammenfassung.',
    fName:'Ihr Name',fEmail:'Gesch\u00e4ftliche E-Mail',fCompany:'Unternehmen',
    fBtn:'Analyse senden',fPrivacy:'Kein Spam. Jederzeit abmeldbar.',
    bookTitle:'Direkt mit Tobias sprechen',
    bookDesc:'15 Minuten, kostenlos, kein Pitch \u2014 nur eine klare Diagnose Ihrer Prozesslecks.',
    bookBtn:'Kostenloses Gespr\u00e4ch buchen \u2192',
    backTopics:'\u2190 Zur\u00fcck zu den Themen',backPlatforms:'\u2190 Zur\u00fcck zu Plattformen',
    inputHint:'R\u00fcckfrage stellen\u2026',
    followUpHint:'Noch Fragen? Einfach unten eintippen \u2014 ich bin da.',
    dirTitle:'Logistik-Plattform-Guide',
    dirHint:'Plattform ausw\u00e4hlen f\u00fcr eine unabh\u00e4ngige \u00dcbersicht.',
    bestFor:'Geeignet f\u00fcr',pricing:'Preis',
    thankYou:'Danke, {name}. Ihre Analyse ist auf dem Weg zu {email}.',
    customPrompt:'Nat\u00fcrlich \u2014 was besch\u00e4ftigt Sie? Ich gebe Ihnen sofort eine konkrete Antwort.',
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// WIDGET CLASS
// ══════════════════════════════════════════════════════════════════════════════
class BERIASWidget {
  constructor(){
    this.lang=C.language||'en';
    this.t=T[this.lang]||T.en;
    this.state='idle';
    this.history=[];
    this.selectedIntent=null;
    this.leadCaptured=false;
    this.followUpCount=0;
    this.root=null;
    this.win=null;
    this.msgsEl=null;
    this.inputBar=null;
  }

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  init(){
    this._css();
    this._html();
    this._events();
    if(C.autoOpenDelay>0) setTimeout(()=>{ if(this.state==='idle') this.open(); },C.autoOpenDelay);
  }

  // ── CSS ────────────────────────────────────────────────────────────────────
  _css(){
    const s=document.createElement('style');
    s.textContent=`
.bcw*{box-sizing:border-box;margin:0;padding:0;font-family:'Public Sans',-apple-system,sans-serif}
/* Launcher */
.bcw-btn{position:fixed;bottom:24px;right:24px;z-index:99998;display:flex;align-items:center;gap:9px;
  background:${NAVY};color:${WHITE};border:none;border-radius:50px;padding:12px 18px 12px 14px;
  cursor:pointer;box-shadow:0 4px 24px rgba(15,48,76,.32);transition:all .25s ease;outline:none}
.bcw-btn:hover{background:#0d2840;box-shadow:0 6px 30px rgba(15,48,76,.42);transform:translateY(-2px)}
.bcw-btn-icon{width:20px;height:20px;color:${GREEN};flex-shrink:0}
.bcw-btn-copy{display:flex;flex-direction:column;line-height:1}
.bcw-btn-copy b{font-size:.82rem;font-weight:600;color:${WHITE};letter-spacing:.01em}
.bcw-btn-copy small{font-size:.66rem;color:${GREEN};margin-top:2px;font-weight:400}
.bcw-dot{position:absolute;top:-3px;right:-3px;width:9px;height:9px;background:${GREEN};
  border-radius:50%;border:2px solid ${WHITE}}
/* Window */
.bcw-win{position:fixed;bottom:88px;right:24px;z-index:99999;width:376px;max-height:590px;
  background:${WHITE};border-radius:16px;
  box-shadow:0 20px 60px rgba(15,48,76,.16),0 4px 16px rgba(15,48,76,.08);
  display:flex;flex-direction:column;overflow:hidden;
  opacity:0;transform:translateY(16px) scale(.97);pointer-events:none;
  transition:opacity .28s ease,transform .28s ease}
.bcw-win.on{opacity:1;transform:translateY(0) scale(1);pointer-events:all}
/* Header */
.bcw-hdr{background:${NAVY};padding:13px 15px;display:flex;align-items:center;
  justify-content:space-between;flex-shrink:0}
.bcw-hdr-l{display:flex;align-items:center;gap:9px}
.bcw-av{width:34px;height:34px;border-radius:50%;background:rgba(162,198,20,.12);
  border:1.5px solid rgba(162,198,20,.35);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.bcw-av svg{color:${GREEN}}
.bcw-hdr-title{font-family:'Ysabeau Office','Public Sans',sans-serif;font-size:.875rem;
  font-weight:600;color:${WHITE};letter-spacing:.01em}
.bcw-hdr-sub{font-size:.67rem;color:rgba(255,255,255,.45);margin-top:1px}
.bcw-x{background:none;border:none;color:rgba(255,255,255,.45);cursor:pointer;
  padding:4px;border-radius:4px;display:flex;align-items:center;justify-content:center;
  transition:color .2s}
.bcw-x:hover{color:${WHITE}}
/* Messages */
.bcw-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;
  gap:10px;scroll-behavior:smooth}
.bcw-msgs::-webkit-scrollbar{width:3px}
.bcw-msgs::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:2px}
/* Bubbles */
.bcw-m{display:flex;flex-direction:column;max-width:88%;animation:bcw-in .22s ease-out}
@keyframes bcw-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.bcw-m.bot{align-self:flex-start}.bcw-m.usr{align-self:flex-end}
.bcw-bbl{padding:9px 12px;border-radius:12px;font-size:.83rem;line-height:1.55}
.bcw-m.bot .bcw-bbl{background:#F3F4F6;color:#1F2937;border-bottom-left-radius:4px}
.bcw-m.usr .bcw-bbl{background:${NAVY};color:${WHITE};border-bottom-right-radius:4px}
.bcw-bbl.bold{font-weight:600}
/* Insight card */
.bcw-card{background:${WHITE};border:1px solid #E5E7EB;border-left:3px solid ${GREEN};
  border-radius:8px;padding:11px 13px;font-size:.78rem;line-height:1.58;color:#374151;
  max-width:92%;align-self:flex-start;animation:bcw-in .22s ease-out}
.bcw-card-t{font-weight:600;font-size:.78rem;color:${NAVY};margin-bottom:4px}
/* CTA */
.bcw-cta{background:#F4F9E5;border:1px solid rgba(162,198,20,.28);border-radius:12px;
  border-bottom-left-radius:4px;padding:9px 12px;font-size:.78rem;line-height:1.55;
  color:#374151;max-width:88%;align-self:flex-start;animation:bcw-in .22s ease-out}
/* Typing */
.bcw-typing{display:flex;align-items:center;gap:7px;padding:9px 12px;background:#F3F4F6;
  border-radius:12px;border-bottom-left-radius:4px;align-self:flex-start;
  animation:bcw-in .22s ease-out;font-size:.72rem;color:#9CA3AF}
.bcw-dots{display:flex;gap:3px}
.bcw-dots span{width:4px;height:4px;background:#9CA3AF;border-radius:50%;
  animation:bcw-dot 1.2s infinite}
.bcw-dots span:nth-child(2){animation-delay:.2s}
.bcw-dots span:nth-child(3){animation-delay:.4s}
@keyframes bcw-dot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-4px);opacity:1}}
/* Intent tiles */
.bcw-tiles{display:grid;grid-template-columns:1fr 1fr;gap:7px;animation:bcw-in .22s ease-out}
.bcw-tile{background:${WHITE};border:1px solid #E5E7EB;border-radius:10px;padding:11px;
  cursor:pointer;transition:all .2s ease;text-align:left;display:flex;flex-direction:column;gap:5px}
.bcw-tile:hover{border-color:${GREEN};box-shadow:0 2px 12px rgba(162,198,20,.14);transform:translateY(-1px)}
.bcw-tile-ico{color:${NAVY};opacity:.65}
.bcw-tile-t{font-size:.76rem;font-weight:600;color:${NAVY};line-height:1.3}
.bcw-tile-d{font-size:.68rem;color:#6B7280;line-height:1.4}
/* Platform list */
.bcw-pdir{display:flex;flex-direction:column;gap:5px;animation:bcw-in .22s ease-out}
.bcw-pdir-title{font-family:'Ysabeau Office',sans-serif;font-size:.85rem;font-weight:600;
  color:${NAVY};margin-bottom:3px}
.bcw-pdir-sub{font-size:.73rem;color:#6B7280;line-height:1.5;margin-bottom:8px}
.bcw-pi{background:${WHITE};border:1px solid #E5E7EB;border-radius:8px;padding:9px 11px;
  cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .2s}
.bcw-pi:hover{border-color:${GREEN};background:#FAFFF0}
.bcw-pi-name{font-size:.79rem;font-weight:600;color:${NAVY}}
.bcw-pi-cat{font-size:.68rem;color:#9CA3AF;margin-top:1px}
.bcw-pi-arr{color:#D1D5DB;font-size:.875rem}
.bcw-pmeta{font-size:.72rem;color:#6B7280;margin-top:3px;align-self:flex-start;animation:bcw-in .22s ease-out}
.bcw-pmeta b{color:${NAVY};font-weight:600}
/* Lead form */
.bcw-form{display:flex;flex-direction:column;gap:7px;padding:3px 0;animation:bcw-in .22s ease-out}
.bcw-form-t{font-family:'Ysabeau Office',sans-serif;font-size:.875rem;font-weight:600;color:${NAVY}}
.bcw-form-d{font-size:.75rem;color:#6B7280;line-height:1.5;margin-bottom:2px}
.bcw-inp{width:100%;padding:8px 11px;border:1px solid #E5E7EB;border-radius:8px;
  font-size:.8rem;color:#111827;background:#F9FAFB;outline:none;
  font-family:'Public Sans',sans-serif;transition:border-color .2s,box-shadow .2s}
.bcw-inp:focus{border-color:${GREEN};box-shadow:0 0 0 3px rgba(162,198,20,.1)}
.bcw-inp::placeholder{color:#9CA3AF}
.bcw-inp.err{border-color:#ef4444}
.bcw-submit{background:${GREEN};color:${NAVY};border:none;border-radius:8px;
  padding:10px 14px;font-size:.8rem;font-weight:700;cursor:pointer;
  font-family:'Ysabeau Office','Public Sans',sans-serif;transition:all .2s}
.bcw-submit:hover{background:#93b314;transform:translateY(-1px)}
.bcw-submit:disabled{opacity:.5;cursor:not-allowed;transform:none}
.bcw-privacy{font-size:.65rem;color:#9CA3AF;text-align:center}
/* Booking */
.bcw-book{display:flex;flex-direction:column;gap:8px;padding:3px 0;animation:bcw-in .22s ease-out}
.bcw-book-t{font-family:'Ysabeau Office',sans-serif;font-size:.875rem;font-weight:600;color:${NAVY}}
.bcw-book-d{font-size:.75rem;color:#6B7280;line-height:1.5}
.bcw-book-btn{background:${NAVY};color:${WHITE};border:none;border-radius:8px;
  padding:10px 14px;font-size:.8rem;font-weight:600;cursor:pointer;text-decoration:none;
  display:block;text-align:center;font-family:'Ysabeau Office','Public Sans',sans-serif;
  transition:all .2s}
.bcw-book-btn:hover{background:#0d2840;transform:translateY(-1px)}
/* Input bar */
.bcw-ibar{border-top:1px solid #F3F4F6;padding:9px 11px;display:flex;gap:7px;
  align-items:center;flex-shrink:0}
.bcw-itext{flex:1;border:1px solid #E5E7EB;border-radius:20px;padding:7px 13px;
  font-size:.8rem;color:#111827;background:#F9FAFB;outline:none;
  font-family:'Public Sans',sans-serif;transition:border-color .2s}
.bcw-itext:focus{border-color:${GREEN};background:${WHITE}}
.bcw-itext::placeholder{color:#9CA3AF}
.bcw-isend{width:32px;height:32px;background:${NAVY};border:none;border-radius:50%;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  flex-shrink:0;transition:background .2s;color:${WHITE}}
.bcw-isend:hover{background:#0d2840}
/* Back link */
.bcw-back{font-size:.72rem;color:${GREEN};cursor:pointer;background:none;border:none;
  padding:0;display:flex;align-items:center;gap:3px;align-self:flex-start;
  animation:bcw-in .22s ease-out}
.bcw-back:hover{text-decoration:underline}
/* Divider label */
.bcw-divider{font-size:.65rem;color:#9CA3AF;text-align:center;padding:4px 0;
  align-self:center;animation:bcw-in .22s ease-out}
/* Mobile */
@media(max-width:480px){
  .bcw-win{width:calc(100vw - 16px);right:8px;bottom:78px;max-height:72vh}
  .bcw-btn{right:12px;bottom:14px}
}`;
    document.head.appendChild(s);
  }

  // ── HTML shell ────────────────────────────────────────────────────────────
  _html(){
    this.root=document.createElement('div');
    this.root.className='bcw';

    // Launcher
    this.btn=document.createElement('button');
    this.btn.className='bcw-btn';
    this.btn.setAttribute('aria-label','Open BERIAS Instant Support');
    this.btn.innerHTML=`
      <svg class="bcw-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <div class="bcw-btn-copy"><b>${this.t.launcherLabel}</b><small>${this.t.launcherSub}</small></div>
      <div class="bcw-dot"></div>`;

    // Window
    this.win=document.createElement('div');
    this.win.className='bcw-win';
    this.win.setAttribute('role','dialog');
    this.win.innerHTML=`
      <div class="bcw-hdr">
        <div class="bcw-hdr-l">
          <div class="bcw-av">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <div>
            <div class="bcw-hdr-title">${this.t.windowTitle}</div>
            <div class="bcw-hdr-sub">${this.t.windowSub}</div>
          </div>
        </div>
        <button class="bcw-x" aria-label="Close">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="bcw-msgs"></div>
      <div class="bcw-ibar" style="display:none">
        <input type="text" class="bcw-itext" placeholder="${this.t.inputHint}">
        <button class="bcw-isend" aria-label="Send">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>`;

    this.root.appendChild(this.win);
    this.root.appendChild(this.btn);
    document.body.appendChild(this.root);

    this.msgsEl=this.win.querySelector('.bcw-msgs');
    this.inputBar=this.win.querySelector('.bcw-ibar');
    this.textInput=this.win.querySelector('.bcw-itext');
    this.sendBtn=this.win.querySelector('.bcw-isend');
  }

  // ── Events ────────────────────────────────────────────────────────────────
  _events(){
    this.btn.addEventListener('click',()=>this.open());
    this.win.querySelector('.bcw-x').addEventListener('click',()=>this.close());
    this.sendBtn.addEventListener('click',()=>this._handleInput());
    this.textInput.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();this._handleInput();} });
  }

  open(){
    this.state='open';
    this.win.classList.add('on');
    this.btn.style.opacity='.55';
    if(!this.msgsEl.children.length) this._welcome();
  }
  close(){
    this.state='idle';
    this.win.classList.remove('on');
    this.btn.style.opacity='1';
  }

  // ── Welcome ────────────────────────────────────────────────────────────────
  _welcome(){
    this._bot(this.t.welcomeQ,true);
    this._bot(this.t.welcomeHint);
    setTimeout(()=>this._renderTiles(),350);
  }

  _renderTiles(){
    const g=document.createElement('div');
    g.className='bcw-tiles';
    INTENTS.forEach(intent=>{
      const t=document.createElement('button');
      t.className='bcw-tile';
      t.innerHTML=`<div class="bcw-tile-ico">${intent.icon}</div>
        <div class="bcw-tile-t">${intent.title}</div>
        <div class="bcw-tile-d">${intent.desc}</div>`;
      t.addEventListener('click',()=>this._select(intent));
      g.appendChild(t);
    });
    this.msgsEl.appendChild(g);
    this._scroll();
  }

  // ── Intent selection ───────────────────────────────────────────────────────
  async _select(intent){
    this.selectedIntent=intent;
    const tiles=this.msgsEl.querySelector('.bcw-tiles');
    if(tiles) tiles.remove();
    this._usr(intent.title);

    if(intent.id==='custom'){
      await this._pause(500);
      this._bot(this.t.customPrompt);
      this._showInput();
      return;
    }
    if(intent.id==='platforms'){
      await this._pause(600);
      this._renderPlatformDir();
      return;
    }
    await this._type(1100);
    this._deliverInsights(intent.id);
  }

  // ── Deliver insights ───────────────────────────────────────────────────────
  async _deliverInsights(id){
    const rs=RESPONSES[id];
    if(!rs) return;
    for(let i=0;i<rs.length;i++){
      const r=rs[i];
      await this._pause(i===0?0:750);
      if(r.type==='text') this._bot(r.text);
      else if(r.type==='insight') this._card(r.title,r.text);
      else if(r.type==='cta'){
        await this._pause(300);
        this._cta(r.text);
        await this._pause(500);
        this._renderBooking();
        await this._pause(600);
        this._bot(this.t.followUpHint);
      }
    }
    // Back to topics button
    await this._pause(400);
    this._backBtn(this.t.backTopics,()=>{ this._divider(); this._renderTiles(); });
    this.state='chatting';
    this._showInput();
  }

  // ── Platform directory ─────────────────────────────────────────────────────
  _renderPlatformDir(){
    const wrap=document.createElement('div');
    wrap.innerHTML=`<div class="bcw-pdir-title">${this.t.dirTitle}</div>
      <div class="bcw-pdir-sub">${this.t.dirHint}</div>`;
    const list=document.createElement('div');
    list.className='bcw-pdir';
    PLATFORMS.forEach(p=>{
      const item=document.createElement('div');
      item.className='bcw-pi';
      item.innerHTML=`<div><div class="bcw-pi-name">${p.name}</div><div class="bcw-pi-cat">${p.category}</div></div><span class="bcw-pi-arr">&#8250;</span>`;
      item.addEventListener('click',()=>this._showPlatform(p,wrap));
      list.appendChild(item);
    });
    wrap.appendChild(list);
    this.msgsEl.appendChild(wrap);
    this._scroll();
  }

  async _showPlatform(p,dirWrap){
    dirWrap.remove();
    this._usr(p.name);
    await this._type(800);
    this._bot(`${p.name} — ${p.category}`,true);
    this._card('Overview',p.summary);
    const meta=document.createElement('div');
    meta.className='bcw-pmeta';
    meta.innerHTML=`<b>${this.t.bestFor}:</b> ${p.bestFor} &nbsp;&middot;&nbsp; <b>${this.t.pricing}:</b> ${p.pricing}`;
    this.msgsEl.appendChild(meta);
    await this._pause(400);
    this._backBtn(this.t.backPlatforms,()=>{
      meta.remove();
      this._renderPlatformDir();
    });
    this.state='chatting';
    this._showInput();
  }

  // ── Lead form ──────────────────────────────────────────────────────────────
  _renderLeadForm(){
    const f=document.createElement('div');
    f.className='bcw-form';
    f.innerHTML=`
      <div class="bcw-form-t">${this.t.leadTitle}</div>
      <div class="bcw-form-d">${this.t.leadDesc}</div>
      <input class="bcw-inp" id="bcw-n" type="text" placeholder="${this.t.fName}" autocomplete="name">
      <input class="bcw-inp" id="bcw-e" type="email" placeholder="${this.t.fEmail}" autocomplete="email">
      <input class="bcw-inp" id="bcw-c" type="text" placeholder="${this.t.fCompany}" autocomplete="organization">
      <button class="bcw-submit">${this.t.fBtn}</button>
      <div class="bcw-privacy">${this.t.fPrivacy}</div>`;
    f.querySelector('.bcw-submit').addEventListener('click',()=>{
      const n=f.querySelector('#bcw-n'),e=f.querySelector('#bcw-e'),c=f.querySelector('#bcw-c');
      n.classList.toggle('err',!n.value.trim());
      e.classList.toggle('err',!e.value.trim()||!e.value.includes('@'));
      if(!n.value.trim()||!e.value.trim()||!e.value.includes('@')) return;
      this._submitLead({name:n.value.trim(),email:e.value.trim(),company:c.value.trim()},f);
    });
    this.msgsEl.appendChild(f);
    this._scroll();
  }

  async _submitLead(data,formEl){
    const btn=formEl.querySelector('.bcw-submit');
    btn.disabled=true; btn.textContent='...';
    this.leadCaptured=true;
    this._pushHubSpot(data);
    this._triggerN8N({...data,intent:this.selectedIntent?.id||'unknown',
      language:this.lang,source:'berias-instant-support',timestamp:new Date().toISOString()});
    formEl.remove();
    await this._pause(300);
    const thanks=this.t.thankYou.replace('{name}',data.name.split(' ')[0]).replace('{email}',data.email);
    this._bot(thanks);
    await this._pause(700);
    this._renderBooking();
  }

  _renderBooking(){
    const b=document.createElement('div');
    b.className='bcw-book';
    b.innerHTML=`<div class="bcw-book-t">${this.t.bookTitle}</div>
      <div class="bcw-book-d">${this.t.bookDesc}</div>
      <a class="bcw-book-btn" href="${C.calendlyUrl}" target="_blank" rel="noopener noreferrer">${this.t.bookBtn}</a>`;
    this.msgsEl.appendChild(b);
    this._scroll();
  }

  // ── Input handling ─────────────────────────────────────────────────────────
  _showInput(){
    this.inputBar.style.display='flex';
    setTimeout(()=>this.textInput.focus(),100);
  }

  async _handleInput(){
    const txt=this.textInput.value.trim();
    if(!txt) return;
    this.textInput.value='';
    this._usr(txt);
    this.history.push({role:'user',content:txt});
    await this._type(1300);
    const reply=await this._getReply(txt);
    this._bot(reply);
    this.history.push({role:'assistant',content:reply});
    this.followUpCount++;
  }

  async _getReply(msg){
    if(C.demoMode){
      await this._pause(0);
      return 'In our experience, the fastest path to clarity on this is a quick process map of your current state. We can usually pinpoint the biggest bottleneck in the first day of a Clarity Sprint. Want me to send you our standard diagnostic framework, or would a 30-minute call with Tobias be more useful?';
    }
    try{
      const res=await fetch(C.apiEndpoint,{method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message:msg,intent:this.selectedIntent?.id,
          language:this.lang,history:this.history.slice(-8)})});
      const j=await res.json();
      return j.reply||'I wasn\'t able to process that. Please try again.';
    }catch(e){
      return 'I\'m having trouble connecting right now. Please try again in a moment.';
    }
  }

  // ── Integrations ───────────────────────────────────────────────────────────
  async _pushHubSpot(data){
    if(!C.hubspotEndpoint) return;
    const [first,...rest]=data.name.split(' ');
    try{ await fetch(C.hubspotEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({firstname:first,lastname:rest.join(' '),email:data.email,company:data.company})}); }
    catch(e){ console.warn('[BERIAS]HubSpot:',e); }
  }

  async _triggerN8N(data){
    if(!C.n8nWebhook) return;
    try{ await fetch(C.n8nWebhook,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data)}); }
    catch(e){ console.warn('[BERIAS]n8n:',e); }
  }

  // ── DOM helpers ────────────────────────────────────────────────────────────
  _bot(txt,bold=false){
    const m=document.createElement('div'); m.className='bcw-m bot';
    const b=document.createElement('div'); b.className='bcw-bbl'+(bold?' bold':'');
    b.textContent=txt; m.appendChild(b);
    this.msgsEl.appendChild(m); this._scroll();
  }
  _usr(txt){
    const m=document.createElement('div'); m.className='bcw-m usr';
    const b=document.createElement('div'); b.className='bcw-bbl';
    b.textContent=txt; m.appendChild(b);
    this.msgsEl.appendChild(m); this._scroll();
  }
  _card(title,text){
    const c=document.createElement('div'); c.className='bcw-card';
    c.innerHTML=`<div class="bcw-card-t">${title}</div><div>${text}</div>`;
    this.msgsEl.appendChild(c); this._scroll();
  }
  _cta(txt){
    const e=document.createElement('div'); e.className='bcw-cta';
    e.textContent=txt; this.msgsEl.appendChild(e); this._scroll();
  }
  _backBtn(label,cb){
    const b=document.createElement('button'); b.className='bcw-back';
    b.textContent=label;
    b.addEventListener('click',()=>{ b.remove(); cb(); });
    this.msgsEl.appendChild(b); this._scroll();
  }
  _divider(){
    const d=document.createElement('div'); d.className='bcw-divider';
    d.textContent='────────────────';
    this.msgsEl.appendChild(d);
  }
  async _type(ms=1200){
    const t=document.createElement('div'); t.className='bcw-typing';
    t.innerHTML=`<div class="bcw-dots"><span></span><span></span><span></span></div><span>${this.t.typing}</span>`;
    this.msgsEl.appendChild(t); this._scroll();
    await this._pause(ms);
    t.remove();
  }
  _scroll(){ requestAnimationFrame(()=>{ this.msgsEl.scrollTop=this.msgsEl.scrollHeight; }); }
  _pause(ms){ return new Promise(r=>setTimeout(r,ms)); }
}

// ── Init ──────────────────────────────────────────────────────────────────────
function boot(){
  const w=new BERIASWidget(); w.init();
  window._berias=w;
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot):boot();

})(window.BERIASChat||{});