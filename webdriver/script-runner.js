const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
process.env["PATH"] = "./drivers:" + process.env["PATH"];
console.log(process.env["PATH"]);

const fs = require('fs');
const { TargetResolver } = require('./target-resolver');

async function executeTest(scriptFile) {
    let script;
    let scriptObj;
    try {
        script = fs.readFileSync(scriptFile);
        scriptObj = JSON.parse(script);
        console.log(scriptObj);
    } catch (error) {
        console.error(error);
        return;
    }

    console.log(`Running script: ${scriptFile}`);
    const driver = await new Builder()
        .forBrowser('chrome')
        // .setChromeOptions(new chrome.Options().headless())
        // .setFirefoxOptions(new firefox.Options().headless())
        .build()
    const resolver = TargetResolver(driver); 
    try {
        await driver.get(scriptObj.starting_url);
        for (let i = 0; i < scriptObj.steps.length; i++) {
            try {
                await driver.wait(until.titleIs('webdriver - Google Search'), 500);
            } catch {}
            const step = scriptObj.steps[i];
            // console.log(step);
            
            const target = await resolver.findElement(step.target);
            // console.log(target);
            switch (step.action) {
                case 'click':
                    console.log("Clicking");
                    await target.click();
                    break;
                case 'change':
                    console.log("Changing");
                    await target.sendKeys(step.target.value);
                    break;
                default:
                    break;
            }
        }
    } finally {
        try {
            await driver.wait(until.titleIs('webdriver - Google Search'), 5000);
        } catch {}
        await driver.quit();
    }


};


/*

SCRIPT START

*/

if (process.argv.length < 2) {
    process.exit(1);
}

const args = process.argv.slice(2);

args.forEach((scriptFile) => {
    executeTest(scriptFile);
})