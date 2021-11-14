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
                // console.log(elementList);
                rankList = await Promise.all(elementList.map(async function(candidateElement) {
                    const score = await rankMatch(target, candidateElement);
                    return {elem: candidateElement, rank: score};
                }));
                element = rankList.reduce((prev, curr) => prev.rank >= curr.rank ? prev : curr, {rank: -Infinity}).elem;
            }
            console.log('Found: ')
            console.log(element);
            return element;
        } catch (error) {
            // If element not found, continue with search. Otherwise, throw error
            console.error(error);
        }
    }

    async function rankMatch(target, candidate) {
        // For each attribute on target
        // Determine weight from attribute type
        // Determine if attribute present on candidate
        let score = 0;
        let candidateAttribute;
        for(key in target.attributes){
            console.log(`Ranking on ${key}: ${target.attributes[key]}`);
            try {
                // console.log(candidate);
                candidateAttribute = await candidate.getAttribute(key);
                // console.log(`Candidate attribute: ${candidateAttribute}`);
            } catch (error) {
                console.error(error);
            }

            if(candidateAttribute && candidateAttribute === target.attributes[key]) {
                console.log(`Match found on key: ${key}`)
                switch(key) {
                    case 'id':
                        return Infinity;
                    case 'name':
                        score += 50;
                        break;
                    case 'href':
                    case 'title':
                        score +=25;
                        break;
                    case 'class':
                    case 'type':
                        score += 10;
                        break;
                    default:
                        score += 1;
                }
            }
        }
        return score;
    }


    return {
        findElement: findElement
    }
}

module.exports = {TargetResolver};