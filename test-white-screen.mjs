import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  try {
    await page.goto('http://localhost:5173');
    await new Promise(r => setTimeout(r, 2000));
  } catch (err) {
    console.error('FAILED TO CONNECT:', err.message);
  }
  
  await browser.close();
})();
