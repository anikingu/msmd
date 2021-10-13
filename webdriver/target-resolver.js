const { By } = require('selenium-webdriver');

function TargetResolver(driver) {
    async function findElement(target) {
        console.log('Resolving:');
        console.log(target)
        let element;
        let elementList;
        try {
            if (target.attributes.id) {
                // Phase 0 Search
                console.log('Checking via element id')
                const xpath = `${target.relative_xpath}[ @id="${target.attributes.id}" ]`
                element = await driver.findElement(By.xpath(xpath));
            } else {
                // Phase 1 Search
                console.log('Checking via element ranking')
                elementList = await driver.findElements(By.xpath(target.full_xpath));
                if (elementList.length === 0) {
                    // Phase 2 Search
                    const elementType = target.full_xpath.split('/').pop();
                    console.log(`Searching through all ${elementType} elements`)
                    elementList = await driver.findElements(By.xpath(`//${elementType}`));
                }
                element = elementList.map((candidateElement) => {return {elem: candidateElement, rank: rankMatch(target, candidateElement)}})
                    .reduce((prev, curr) => prev.rank >= curr.rank ? prev : curr, {rank: -Infinity}).elem;
            }
            console.log('Found: ')
            console.log(element);
            return element;
        } catch (error) {
            // If element not found, continue with search. Otherwise, throw error
            console.error(error);
        }
    }

    const rankMatch = (target, candidate) => {
        return 1;
    }


    return {
        findElement: findElement
    }
}

module.exports = {TargetResolver};