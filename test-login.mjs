import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log("Navigating to auth/signin...");
  await page.goto('http://localhost:3001/auth/signin');
  
  console.log("Clicking Procurement Officer...");
  await page.waitForSelector('text=Procurement Officer');
  await page.click('text=Procurement Officer');
  
  console.log("Waiting 3 seconds...");
  await page.waitForTimeout(3000);
  
  const url = page.url();
  console.log('Current URL after click:', url);
  
  const errorText = await page.evaluate(() => document.body.innerText.includes('Could not sign in with demo credentials'));
  console.log('Error displayed?', errorText);
  
  await browser.close();
})();
