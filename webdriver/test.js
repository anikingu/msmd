const {Builder, By, Key, until} = require('selenium-webdriver');
const { Command } = require('selenium-webdriver/lib/command');
process.env["PATH"] = "./drivers:"+process.env["PATH"];
console.log(process.env["PATH"]);

(async function example() {
    let driver = await new Builder().forBrowser('chrome').build()
    try {
        await driver.get('http://www.google.com/ncr');
        await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
        await driver.wait(until.titleIs('webdriver - Google Search'));
    } finally {
        await driver.quit();
    }
})();