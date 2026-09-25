const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Starting Playwright automated demo...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: path.join(process.cwd(), 'artifacts'), size: { width: 1280, height: 800 } }
  });
  const page = await context.newPage();

  const artifactsDir = path.join(process.cwd(), 'artifacts', 'demo');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  const BASE_URL = 'http://localhost:3000';
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let warnings = [];

  async function safeGoto(url) {
    const res = await page.goto(url, { waitUntil: 'networkidle' });
    if (!res || !res.ok()) {
      throw new Error(`Failed to load ${url}: ${res?.status()}`);
    }
  }

  try {
    // 1. OPEN HOMEPAGE
    console.log('1. Open Homepage');
    await safeGoto(BASE_URL);
    await page.waitForSelector('text=Public money should leave a public trail.');
    await delay(3000);
    await page.screenshot({ path: path.join(artifactsDir, '01-home.png') });

    // 2. SEARCH
    console.log('2. Search Tema');
    await page.waitForSelector('input[placeholder*="Search project title"]');
    await page.fill('input[placeholder*="Search project title"]', 'Tema');
    await page.press('input[placeholder*="Search project title"]', 'Enter');
    await delay(2000);
    await page.waitForURL(/\/explore/);
    await page.waitForSelector('text=Tema');
    await page.screenshot({ path: path.join(artifactsDir, '02-explore.png') });

    // 3. CONTRACT DOSSIER
    console.log('3. Contract Dossier');
    await page.click('a:has-text("Tema")');
    await page.waitForURL(/\/contracts\//);
    await delay(5000);
    await page.screenshot({ path: path.join(artifactsDir, '03-contract.png') });

    // 4. LIFECYCLE
    console.log('4. Lifecycle');
    const lifecycleTabs = ['Tender', 'Award', 'Contract', 'Implementation'];
    for (const tab of lifecycleTabs) {
      try {
        await page.click(`role=tab[name="${tab}"i]`, { timeout: 2000 });
        await delay(1000);
      } catch (e) {
        warnings.push(`Lifecycle tab not found: ${tab}`);
      }
    }
    await delay(2000);

    // 5. AMENDMENT
    console.log('5. Amendment');
    try {
      await page.waitForSelector('text=Amendment', { timeout: 2000 });
      await delay(4000);
      await page.screenshot({ path: path.join(artifactsDir, '04-amendment.png') });
    } catch (e) {
      warnings.push('Amendment section not found on dossier.');
    }

    // 6. INTEGRITY SIGNAL
    console.log('6. Integrity Signal');
    try {
      await page.waitForSelector('text=Signal', { timeout: 2000 });
      await delay(4000);
      await page.screenshot({ path: path.join(artifactsDir, '05-signal.png') });
    } catch (e) {
      warnings.push('Integrity signal not found on dossier.');
    }

    // 7. DOCUMENT VERIFICATION
    console.log('7. Document Verification');
    await safeGoto(`${BASE_URL}/verify`);
    await delay(1000);
    
    try {
      await page.click('button:has-text("Test valid contract")');
      await page.waitForSelector('text=Match', { timeout: 10000 });
      await delay(4000);
      await page.screenshot({ path: path.join(artifactsDir, '06-verify-match.png') });
    } catch (e) {
      warnings.push('Valid sample button not found in verify.');
    }

    try {
      await page.click('button:has-text("Test modified version")');
      await page.waitForSelector('text=Mismatch', { timeout: 10000 });
      await delay(4000);
      await page.screenshot({ path: path.join(artifactsDir, '07-verify-mismatch.png') });
    } catch (e) {
      warnings.push('Invalid sample button not found in verify.');
    }

    // 8. BLOCKCHAIN
    console.log('8. Blockchain');
    await page.goBack();
    await delay(1000);
    try {
      await page.waitForSelector('text=Blockchain Anchor', { timeout: 2000 });
      await delay(5000);
      await page.screenshot({ path: path.join(artifactsDir, '08-blockchain.png') });
    } catch (e) {
      warnings.push('Blockchain proof section not found.');
    }

    // 9. AI ANALYST
    console.log('9. AI Analyst');
    await safeGoto(`${BASE_URL}/analyst`);
    await page.fill('input[placeholder*="Ask"]', 'What changed in the Tema Motorway Interchange contract?');
    await page.press('input[placeholder*="Ask"]', 'Enter');
    
    // Wait for response text to appear
    await delay(7000);
    await page.screenshot({ path: path.join(artifactsDir, '09-ai.png') });

    // 10. CLOSING STATE
    console.log('10. Closing State');
    await safeGoto(BASE_URL);
    await page.evaluate(() => {
      document.body.innerHTML = `
        <div style="display:flex; justify-content:center; items-align:center; height:100vh; background-color:#F7F7F4; color:#2C5F3C; flex-direction:column; align-items:center; font-family:sans-serif;">
          <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem;">OpenContract</h1>
          <p style="font-size: 1.5rem;">Explore. Verify. Investigate.</p>
        </div>
      `;
    });
    await delay(3000);

  } catch (err) {
    console.error('Demo execution failed:', err);
    warnings.push(`Fatal Error: ${err.message}`);
  } finally {
    // Generate summary
    const summary = `
Automated Demo Execution Summary
--------------------------------
URL Used: ${BASE_URL}
Duration: ~45 seconds
Warnings:
${warnings.length > 0 ? warnings.join('\n') : 'None'}
    `;
    fs.writeFileSync(path.join(process.cwd(), 'artifacts', 'opencontract-demo-summary.txt'), summary);

    await page.close();
    await context.close();
    await browser.close();
    
    // Rename video
    const videoFiles = fs.readdirSync(path.join(process.cwd(), 'artifacts')).filter(f => f.endsWith('.webm') && f !== 'opencontract-demo.webm');
    if (videoFiles.length > 0) {
        fs.renameSync(
            path.join(process.cwd(), 'artifacts', videoFiles[0]), 
            path.join(process.cwd(), 'artifacts', 'opencontract-demo.webm')
        );
    }
  }
})();
