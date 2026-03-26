import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const blogs = [
    {
        file: 'og-itsectools.png',
        badge: 'Platform Comparison',
        title: "Why Most Testing Tools<br/>Give False Confidence",
        desc: 'Testing one signature at a time gives you false confidence. Learn how integrated killchain testing exposes critical defense gaps.',
        themeStart: '#1E3A8A', // Deep Blue
        themeEnd: '#050B14',
        badgeColor: '#60A5FA',
        badgeBg: '#EFF6FF'
    },
    {
        file: 'og-eicar.png',
        badge: 'Beyond the Basics',
        title: 'EICAR Is Just the Beginning',
        desc: 'If your endpoint protection only catches standard test files, you are blind to sophisticated evasion techniques.',
        themeStart: '#064E3B', // Cyberpunk Green
        themeEnd: '#012115',
        badgeColor: '#10B981',
        badgeBg: '#ECFDF5'
    },
    {
        file: 'og-regex.png',
        badge: 'Policy Tuning',
        title: 'Your DLP Regex Works in Testing,<br/>But Breaks in Production',
        desc: 'Understand the hidden nuances of regex engines across different security vendors that causes silent data leakage.',
        themeStart: '#4C1D95', // Royal Violet
        themeEnd: '#1e1b4b',
        badgeColor: '#A78BFA',
        badgeBg: '#F5F3FF'
    },
    {
        file: 'og-mitre.png',
        badge: 'Red Teaming',
        title: 'But Can Your Firewall<br/>Stop a Kill Chain?',
        desc: 'Single exploits are easily blocked. Watch what happens when a real 4-stage network progression executes.',
        themeStart: '#7F1D1D', // Crimson Red
        themeEnd: '#2a0a0a',
        badgeColor: '#F87171',
        badgeBg: '#FEF2F2'
    },
    {
        file: 'og-signatures.png',
        badge: 'IPS Validation',
        title: 'Your NGFW Has 10,000 Signatures.<br/>How Many Fire?',
        desc: 'Are your security rules actually inspecting traffic, or are they quietly failing open? Use our framework to validate.',
        themeStart: '#78350F', // Burnt Amber
        themeEnd: '#291305',
        badgeColor: '#FBBF24',
        badgeBg: '#FFFBEB'
    }
];

const generateHtml = (b) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    width: 1200px;
    height: 630px;
    background: radial-gradient(circle at 10% 20%, ${b.themeStart} 0%, ${b.themeEnd} 90%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 100px;
    box-sizing: border-box;
    color: white;
  }
  .badge {
    background: ${b.badgeBg};
    color: ${b.badgeColor};
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
    color: white;
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
  <div class="badge">${b.badge}</div>
  <h1>${b.title}</h1>
  <p>${b.desc}</p>
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
    
    for(const b of blogs) {
        await page.setContent(generateHtml(b), { waitUntil: 'load' });
        const destPath = path.join(process.cwd(), 'public', 'blog', b.file);
        await page.screenshot({ path: destPath });
        console.log('Saved ' + b.file);
    }
    
    await browser.close();
})();
