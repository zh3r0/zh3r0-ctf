const puppeteer = require('puppeteer');
const url = process.argv[2];
if (!url) {
    try
    {
        throw "Please provide URL as a first argument";
    }
    catch(err)
    {
        console.log("Error in url");
    }
}
async function run () {
    try
    {
        const browser = await puppeteer.launch({args:['-no-sandbox'],headless:true});
        const page = await browser.newPage();
        await Promise.all([
        await page.goto(url),
        await new Promise(resolve => setTimeout(resolve, 5000)),
        ])
        browser.close();
    }
    catch(err)
    {
        console.log(err);
    }
}
run();