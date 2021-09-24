const { Builder, By, Key, until } = require('selenium-webdriver');
const { Command } = require('selenium-webdriver/lib/command');
const fs = require('fs');
process.env["PATH"] = "./drivers:" + process.env["PATH"];
console.log(process.env["PATH"]);

(async function executeTest() {
    const script = fs.readFileSync('../data/testScript.json');
    const scriptObj = JSON.parse(script);
    console.log(scriptObj);

    console.log("Running script");
    let driver = await new Builder().forBrowser('chrome').build()
    try {
        await driver.get(scriptObj.starting_url);
        for (let i = 0; i < scriptObj.steps.length; i++) {
            const step = scriptObj.steps[i];
            console.log(step);
            const xpath = step.target.full_xpath +
                ((step.target.attributes && Object.keys(step.target.attributes).length > 0) ?
                '[ ' + (step.target.attributes.id ? `@id="${step.target.attributes.id}"`: '') + 
                ' ' + (step.target.attributes.class ? `@class="${step.target.attributes.class}"`: '') + ']' :
                '');
            const target = await driver.findElement(By.xpath(xpath));
            switch (step.action) {
                case 'click':
                    await target.click();
                    break;
                case 'change':
                    await target.sendKeys(step.input);
                    break;
                default:
                    break;
            }
            try {
                await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
            } catch {}
        }
    } finally {
        await driver.quit();
    }


})();