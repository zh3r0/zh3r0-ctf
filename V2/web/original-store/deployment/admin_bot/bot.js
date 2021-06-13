const puppeteer = require('puppeteer')
const fs = require('fs')

async function create_session(user, pass) {
	const browser = await puppeteer.launch({ args: ['--no-sandbox'], product: 'firefox', headless: true})
	const page = await browser.newPage()
	await page.goto("http://localhost:80/original_store/login.php")
	await new Promise(resolve => setTimeout(resolve, 500));
	await page.type('#username', user);
	await page.type('#password', pass);
	await page.click('#submit');
}
async function visit(url) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], product: 'firefox', headless: true})
    const page = await browser.newPage()
    await page.goto(url)
}

async function visit_with_session(user, pass, link) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], product: 'firefox', headless: true, ignoreHTTPSErrors: true})
    const page = await browser.newPage()
    await page.goto("http://localhost/login.php")
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.type('#username', user);
    await page.type('#password', pass);
    await page.click('#submit');
	await page.waitForTimeout(2000)
    await page.goto(link);
    await page.waitForTimeout(4000) 
   
    await page.close();
    await browser.close();
}
module.exports.create_session = create_session;
module.exports.visit = visit;
module.exports.visit_with_session = visit_with_session;
