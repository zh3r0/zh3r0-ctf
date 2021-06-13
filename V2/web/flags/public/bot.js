const puppeteer = require('puppeteer')
const fs = require('fs')

async function visit(url, password) {
	try{
	const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: false})
	var page = await browser.newPage()
    await page.goto('http://localhost:8080/login')
	await page.type("#username", 'admin')
    await page.type("#password",password)
    await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10002 }),
		page.click('#submit'),
	  ])
	await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10002 }),
		await page.goto(url)
	  ])
	await page.close()
	await browser.close()
	}
	catch (e) {
		console.log("Error", e)
	  }
}

module.exports = { visit}
