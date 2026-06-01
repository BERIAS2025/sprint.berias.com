================================================================================
BERIAS 30-DAY CLARITY SPRINT LANDING PAGE
Deployment Guide & Documentation
================================================================================

TABLE OF CONTENTS
-----------------
1. Package Contents
2. How to Upload to cPanel
3. SSL Certificate Setup
4. Adding Tracking Codes
5. Adding HubSpot Form
6. How to Make Changes
7. Troubleshooting
8. Support Resources

================================================================================
1. PACKAGE CONTENTS
================================================================================

Your landing page package includes:

sprint-berias-landing/
├── index.html                  (Main landing page)
├── impressum.html             (Legal: Impressum page)
├── privacy.html               (Legal: Privacy Policy page)
├── terms.html                 (Legal: Terms of Service page)
├── css/
│   ├── style.css              (Main stylesheet)
│   └── new-sections.css       (Pricing, FAQ, Chaos Tax styles)
├── js/
│   ├── script.js              (Mobile navigation & interactions)
│   └── faq.js                 (FAQ accordion functionality)
├── images/
│   ├── All your logos, photos, and graphics
│   └── (18 image files total)
└── README.txt                 (This file)

================================================================================
2. HOW TO UPLOAD TO cPanel
================================================================================

STEP-BY-STEP INSTRUCTIONS:

Step 1: Access cPanel
----------------------
1. Log in to your DomainFactory.eu account
2. Navigate to your cPanel dashboard
3. Look for "File Manager" icon and click it

Step 2: Navigate to Subdomain Directory
----------------------------------------
1. In File Manager, look for the folder structure
2. Find the directory for your subdomain "sprint.berias.com"
   - It's usually named: /sprint/ or /public_html/sprint/
   - If it doesn't exist, create it:
     a. Click "New Folder" button
     b. Name it "sprint"
     c. Navigate into this folder

Step 3: Upload Files
--------------------
METHOD A: Using File Manager Upload (Recommended)
1. Inside the sprint folder, click "Upload" button
2. Select ALL files from your downloaded package
3. Upload everything (HTML, CSS, JS, images folders)
4. Wait for upload to complete (may take 2-3 minutes)

METHOD B: Using FTP (Alternative)
1. Use an FTP client like FileZilla
2. Connect to your DomainFactory FTP server
3. Navigate to /sprint/ directory
4. Drag and drop all files from your computer

Step 4: Verify File Structure
------------------------------
After upload, your sprint folder should look like this:

/sprint/
├── index.html
├── impressum.html
├── privacy.html
├── terms.html
├── css/ (folder)
├── js/ (folder)
└── images/ (folder)

Step 5: Set Permissions (Important!)
-------------------------------------
1. Select all uploaded files and folders
2. Right-click → "Change Permissions"
3. Set folders to: 755
4. Set files to: 644
5. Check "Recurse into subdirectories"
6. Click "Change Permissions"

Step 6: Test Your Website
--------------------------
1. Open your browser
2. Go to: https://sprint.berias.com
3. The landing page should load perfectly!

================================================================================
3. SSL CERTIFICATE SETUP
================================================================================

Your subdomain needs HTTPS (the padlock icon) for security and trust.

Option A: DomainFactory Auto-SSL (Easiest)
-------------------------------------------
1. In cPanel, find "SSL/TLS Status" or "Let's Encrypt SSL"
2. Select "sprint.berias.com" from the list
3. Click "Install SSL Certificate" or "Enable Auto SSL"
4. Wait 5-10 minutes for activation
5. Your site will automatically redirect to HTTPS

Option B: Manual SSL Request
-----------------------------
1. Contact DomainFactory support
2. Request SSL certificate for sprint.berias.com
3. They will install it for you (usually free with Let's Encrypt)

Verify SSL is Working:
----------------------
1. Visit https://sprint.berias.com (note the "s" in https)
2. You should see a padlock icon in the browser address bar
3. Click the padlock to verify certificate details

================================================================================
4. ADDING TRACKING CODES
================================================================================

You need to add three tracking codes to your website:
- Google Analytics
- Google Ads
- Facebook Pixel

WHERE TO ADD THEM:
------------------
Open: index.html (line 24-70)

You'll see three clearly marked sections with instructions:

SECTION 1: Google Analytics (Lines 27-37)
------------------------------------------
1. Log in to Google Analytics (analytics.google.com)
2. Go to Admin → Data Streams → Your Website
3. Click "View tag instructions" → "Install manually"
4. Copy the ENTIRE script (looks like this):

   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>

5. PASTE it in index.html between lines 28-36 (replacing the example)
6. Save the file

SECTION 2: Google Ads (Lines 39-49)
------------------------------------
1. Log in to Google Ads (ads.google.com)
2. Go to Tools & Settings → Measurement → Conversions
3. Click "New Conversion Action" → Website
4. Copy the Global Site Tag code
5. PASTE it in index.html between lines 42-48
6. Save the file

SECTION 3: Facebook Pixel (Lines 51-69)
----------------------------------------
1. Log in to Facebook Business Manager
2. Go to Events Manager → Your Pixel
3. Click "Set Up" → "Install Code Manually"
4. Copy the ENTIRE pixel code
5. PASTE it in index.html between lines 54-68
6. Save the file

AFTER ADDING CODES:
-------------------
1. Re-upload index.html to cPanel (overwrite the old one)
2. Clear your browser cache (Ctrl+Shift+Delete)
3. Visit sprint.berias.com
4. Verify tracking is working:
   - Google Analytics: Real-time reports should show your visit
   - Facebook Pixel: Use Facebook Pixel Helper browser extension
   - Google Ads: Check tag status in Google Ads dashboard

================================================================================
5. ADDING HUBSPOT FORM
================================================================================

Your landing page has a placeholder for the HubSpot contact form.

WHERE TO ADD IT:
----------------
Open: index.html
Search for: "<!-- HUBSPOT FORM EMBED CODE HERE -->"
(Around line 960-970)

HOW TO GET THE CODE:
--------------------
1. Log in to HubSpot (app.hubspot.com)
2. Go to Marketing → Lead Capture → Forms
3. Create a new form or select existing form
4. Click "Share" → "Embed Code"
5. Copy the embed code (looks like this):

   <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
   <script>
     hbspt.forms.create({
       region: "na1",
       portalId: "YOUR_PORTAL_ID",
       formId: "YOUR_FORM_ID"
     });
   </script>

6. PASTE it in index.html where the placeholder comment is
7. Save and re-upload index.html

FORM FIELDS RECOMMENDATION:
---------------------------
Create a form with these fields:
- First Name (required)
- Last Name (required)
- Email (required)
- Company Name (required)
- Phone Number (optional)
- Number of Employees (dropdown: 1-15, 15-35, 35-50, 50+)
- Message (optional)

TESTING:
--------
1. Visit sprint.berias.com
2. Scroll to the contact form section
3. Fill out and submit a test form
4. Check HubSpot to verify the contact was created

================================================================================
6. HOW TO MAKE CHANGES
================================================================================

CHANGING TEXT CONTENT:
----------------------
1. Download index.html from cPanel File Manager
2. Open with a text editor (Notepad++, Sublime Text, VS Code)
3. Find the text you want to change (use Ctrl+F to search)
4. Make your changes
5. Save the file
6. Re-upload to cPanel (overwrite old file)
7. Clear browser cache and refresh

CHANGING COLORS:
----------------
1. Download css/style.css
2. Open in text editor
3. Find the "CSS Variables" section at the top (lines 10-30)
4. Change color values:
   - --color-primary: #0F304C (Main Blue)
   - --color-secondary: #A2C614 (Green)
   - --color-accent: #7918B5 (Purple)
5. Save and re-upload

CHANGING IMAGES:
----------------
1. Prepare your new image (same dimensions as original)
2. Upload to cPanel: /sprint/images/ folder
3. Download index.html
4. Find the old image filename (use Ctrl+F)
5. Replace with your new filename
6. Save and re-upload index.html

CHANGING PRICES:
----------------
1. Download index.html
2. Search for "pricing-price" (around lines 500-700)
3. Change the dollar amounts
4. Update features list if needed
5. Save and re-upload

ADDING NEW SECTIONS:
--------------------
1. Use existing sections as templates
2. Copy the HTML structure
3. Modify content
4. Add corresponding CSS if needed
5. Test thoroughly before going live

IMPORTANT: Always keep a backup of your original files!

================================================================================
7. TROUBLESHOOTING
================================================================================

PROBLEM: Website shows "404 Not Found"
SOLUTION:
- Verify files are in correct directory (/sprint/)
- Check that index.html is named exactly "index.html" (lowercase)
- Clear browser cache and try again

PROBLEM: Images not loading
SOLUTION:
- Verify images folder uploaded correctly
- Check file permissions (should be 644 for files, 755 for folders)
- Check image paths in HTML (should be: images/filename.png)
- Image filenames are case-sensitive!

PROBLEM: CSS not working (page looks broken)
SOLUTION:
- Verify css folder uploaded correctly
- Check browser console for errors (F12 → Console tab)
- Clear browser cache (Ctrl+Shift+Delete)
- Verify CSS file paths in HTML

PROBLEM: Mobile menu not working
SOLUTION:
- Verify js folder uploaded correctly
- Check that both script.js and faq.js are present
- Clear browser cache
- Check browser console for JavaScript errors

PROBLEM: FAQ not expanding
SOLUTION:
- Verify faq.js is uploaded
- Check that it's linked in index.html (bottom of page)
- Clear browser cache
- Try different browser

PROBLEM: Trustindex reviews not showing
SOLUTION:
- Verify you have active reviews on Trustindex.io
- Check that the script code is correct
- Allow 24-48 hours for reviews to populate
- Contact Trustindex support if issues persist

PROBLEM: Calendly widget not loading
SOLUTION:
- Verify your Calendly link is correct
- Check that you're logged into Calendly
- Ensure your Calendly event is active and published
- Try opening the Calendly link directly in browser

PROBLEM: SSL certificate not working
SOLUTION:
- Wait 10-15 minutes after installation
- Clear browser cache
- Contact DomainFactory support for SSL installation help

PROBLEM: Tracking codes not working
SOLUTION:
- Verify codes are pasted correctly (no missing characters)
- Check that you replaced YOUR_ID placeholders with actual IDs
- Wait 24-48 hours for data to appear in dashboards
- Use browser extensions to test (Google Tag Assistant, Facebook Pixel Helper)

================================================================================
8. SUPPORT RESOURCES
================================================================================

HOSTING & DOMAIN:
-----------------
DomainFactory Support
Website: https://www.df.eu/en/support/
Email: support@df.eu
Phone: Available on their website

TRACKING & ANALYTICS:
---------------------
Google Analytics Help: https://support.google.com/analytics
Google Ads Help: https://support.google.com/google-ads
Facebook Business Help: https://www.facebook.com/business/help

INTEGRATIONS:
-------------
HubSpot Support: https://help.hubspot.com
Calendly Support: https://help.calendly.com
Trustindex Support: https://www.trustindex.io/support

WEB DEVELOPMENT HELP:
---------------------
HTML/CSS Reference: https://www.w3schools.com
Stack Overflow: https://stackoverflow.com (for technical questions)

BERIAS CONTACT:
---------------
For questions about the landing page content or strategy:
Email: hello@berias.com
Website: https://berias.com

================================================================================
FINAL CHECKLIST BEFORE GOING LIVE
================================================================================

□ All files uploaded to /sprint/ directory
□ File permissions set correctly (755 for folders, 644 for files)
□ SSL certificate installed and working (https://)
□ Google Analytics tracking code added and verified
□ Google Ads tracking code added and verified
□ Facebook Pixel code added and verified
□ HubSpot form embedded and tested
□ Calendly link working correctly
□ Trustindex reviews displaying
□ All images loading correctly
□ Mobile responsive design tested (use phone or browser dev tools)
□ All links tested (navigation, footer, external links)
□ Legal pages accessible (Impressum, Privacy, Terms)
□ Contact information correct (email, address, phone)
□ Pricing information accurate
□ FAQ answers complete and accurate
□ Tested on multiple browsers (Chrome, Firefox, Safari, Edge)
□ Tested on multiple devices (Desktop, Tablet, Mobile)
□ Page load speed acceptable (under 3 seconds)
□ No broken links or 404 errors
□ All text proofread for typos and errors

================================================================================
CONGRATULATIONS!
================================================================================

Your professional landing page is now live and ready to convert visitors into
clients. The page is optimized for:

✓ SEO (Search Engine Optimization)
✓ Mobile responsiveness
✓ Fast loading times
✓ Conversion optimization
✓ Legal compliance (US & Germany)
✓ Analytics and tracking
✓ Lead capture and nurturing

Remember to:
- Monitor your analytics weekly
- Test your contact forms regularly
- Update content as your services evolve
- Keep backups of all files
- Respond quickly to form submissions

Good luck with your 30-Day Clarity Sprint program!

================================================================================
