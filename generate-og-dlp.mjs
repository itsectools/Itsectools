import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    width: 1200px;
    height: 630px;
    background: radial-gradient(circle at 10% 20%, #312E81 0%, #0F172A 90%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 100px;
    box-sizing: border-box;
    color: white;
  }
  .badge {
    background: #EEF2FF;
    color: #4338CA;
    padding: 10px 24px;
    border-radius: 9999px;
    font-size: 24px;
    font-weight: 700;
    align-self: flex-start;
    margin-bottom: 40px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  h1 {
    font-size: 72px;
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 30px 0;
    color: white;
    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  p {
    font-size: 32px;
    color: rgba(255, 255, 255, 0.85);
    margin: 0 0 60px 0;
    max-width: 900px;
    line-height: 1.4;
  }
  .footer {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: auto;
  }
  .logo {
    font-size: 36px;
    font-weight: 800;
    color: #60A5FA;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .logo-icon {
    width: 48px;
    height: 48px;
    background: rgba(255,255,255,0.1);
    border: 2px solid white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .domain {
    font-size: 28px;
    color: rgba(255,255,255,0.6);
    font-weight: 500;
  }
</style>
</head>
<body>
  <div class="badge">Data Loss Prevention</div>
  <h1>How to Test Your DLP Policy:<br/>Free Tool & Framework</h1>
  <p>Stop guessing. Use the 6-Phase Validation Framework to find your data leakage blind spots before attackers do.</p>
  <div class="footer">
    <div class="logo">
      <div class="logo-icon">
        <svg fill="white" viewBox="0 0 24 24" width="28" height="28">
           <path d="M12 2L2 7l10 5 10-5-10-5zm0 11.5l-10-5v2.8l10 5 10-5V8.5l-10 5z"/>
        </svg>
      </div>
      ITSecTools
    </div>
    <div style="width: 2px; height: 30px; background: rgba(255,255,255,0.2);"></div>
    <div class="domain">itsectools.com</div>
  </div>
</body>
</html>
`;

(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
    
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
    
    // Save to the Next.js public/blog directory
    const destPath = path.join(process.cwd(), 'public', 'blog', 'og-dlp-guide.png');
    await page.screenshot({ path: destPath });
    
    console.log(`Successfully generated OpenGraph image: ${destPath}`);
    
    await browser.close();
})();
