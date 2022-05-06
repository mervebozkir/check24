import Nl_helper from '../../../support/helpers/Nl_helper';
import Nl_template_PO from '../../../support/pageObjects/Nl_template_PO';
/// <reference types="Cypress" />

describe('Check tracking parameters for non-product links', () => {
    /** @type {Nl_helper} */
    const nl_helper = new Nl_helper();

    /** @type {object} */
    const nl_url_list = nl_helper.getTestData('nl_urls.json');

    /** @type {string} */
    let nl_url = "https://news.shopping.check24.de/u/gm.php?prm=VDLjGz1AeJ_766749435_6267609_1";

    /** @type {Nl_template_PO} */
    const nl_template = new Nl_template_PO(nl_url);

    // Ignore errors from the site itself
    Cypress.on('uncaught:exception', () => {
        return false;
    });

    it('C962349 Check if utm_campaign value of all non product links is the same, url: ',() => {
        
        for(var i=0;i<nl_url_list.length;i++){
            cy.visit(nl_url_list[i]);
            const links = nl_template.getLinksByElementAttribute("a[href*='utm_campaign']",'href');

            cy.wrap(links).then((mailingList) => {
                const extractedValues = nl_helper.extractParameterValues(mailingList, 'utm_campaign');
                let paramList = [];
                extractedValues.forEach(obj=>{
                    expect(obj.parameterValue).to.contain('nl')
                    expect(obj.parameterValue).to.contain('category')
                    paramList.push(obj.parameterValue)
                    console.log(obj.parameterValue)
                })
                expect(nl_helper.allEqual(paramList)).to.equals(true)                
            })           
        }
    });

    it('C955682 Check if wpset value of all non product links is the same, url: ',() => {

        for(var i=0;i<nl_url_list.length;i++){
            cy.visit(nl_url_list[i]);
            const links = nl_template.getLinksByElementAttribute("a[href*='wpset']",'href');

            cy.wrap(links).then((mailingList) => {
                const extractedValues = nl_helper.extractParameterValues(mailingList, 'wpset');
                let paramList = [];
                extractedValues.forEach(obj=>{
                    expect(obj.parameterValue).to.contain('newsletter_shopping')
                    paramList.push(obj.parameterValue)
                    console.log(obj.parameterValue)
                })
                expect(nl_helper.allEqual(paramList)).to.equals(true)
            })           
        }
    });
});
