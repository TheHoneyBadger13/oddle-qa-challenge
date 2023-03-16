const FIELD_EMAIL = '#email';
const FIELD_CARD_NUMBER = '#cardNumber';
const FIELD_CARD_EXPIRY = '#cardExpiry';
const FIELD_CARD_CVC = '#cardCvc';
const FIELD_NAME_ON_CARD = '#billingName';
const DROPDOWN_COUNTRY_OR_REGION = '#billingCountry';
const TICKBOX_ENABLE_STRIPE_PASS = '#enableStripePass';
const FIELD_PHONE_NUMBER = '#phoneNumber';
const BUTTON_PAY = '[data-testid = "hosted-payment-submit-button"]';
const BUTTON_COMPLETE = '#test-source-authorize-3ds,button.button-default';
const ERROR_BLANK_EMAIL = '#required-email-fieldset';
const ERROR_BLANK_CARD_INFORMATION = '#required-cardNumber-fieldset';
const ERROR_BLANK_BILLING_NAME = '#required-billingName-fieldset';
class Actions {

    inputEmail(email) {
        const fieldValue = email ? email : this.generateRandomEmail();
        cy.get(FIELD_EMAIL,{timeout:5000}).clear().type(fieldValue);
      }  

    inputCardNumber(cardNumber) {
        const fieldValue = cardNumber ? cardNumber : '4242424242424242';
        cy.get(FIELD_CARD_NUMBER).clear().type(fieldValue);
    }
    
    inputCardExpiry(cardExpiry) {
        const fieldValue = cardExpiry ? cardExpiry : '926';
        cy.get(FIELD_CARD_EXPIRY).clear().type(fieldValue);
    }

    inputCardCVC(cardCVC) {
        const fieldValue = cardCVC ? cardCVC : '123';
        cy.get(FIELD_CARD_CVC).clear().type(fieldValue);
    }

    inputBillingName(billingName) {
        const fieldValue = billingName ? billingName : '123';
        cy.get(FIELD_NAME_ON_CARD).clear().type(fieldValue);
    }

    inputCountry(country) {
        const dropdownSelector = cy.get(DROPDOWN_COUNTRY_OR_REGION);
        if (country === undefined) {
          dropdownSelector.then(dropdown => {
            const options = dropdown.find('option').not(':first');
            const randomIndex = Cypress._.random(options.length - 1);
            const optionValue = Cypress.$(options[randomIndex]).val();
            cy.get(DROPDOWN_COUNTRY_OR_REGION).select(optionValue);
          });
        } else {
          cy.get(DROPDOWN_COUNTRY_OR_REGION).select(country);
        }
      }
    
    clickTickBox(){
        cy.get(TICKBOX_ENABLE_STRIPE_PASS).click({force:true})
    }

    inputPhoneNumber(phoneNumber){
        const fieldValue = phoneNumber ? phoneNumber : '9123456789';
        cy.get(FIELD_PHONE_NUMBER).clear().type(fieldValue);
    }

    clickPay(){
        cy.get(BUTTON_PAY).click({force:true});
    }

    clickComplete(){
      //cy.get('iframe[id="challengeFrame"]', {timeout: 10000}).should('exist');
      //cy.iframe('iframe[id="challengeFrame"]').find('body').should('contain', '3DS Challenge');
      //cy.get("#iframeid").iframeOnload().find("#challengeFrame").should('be.visible').type("abc") // iframeOnload()
      //cy.get("#iframeid").iframeDirect().find("#challengeFrame").should('be.visible').click() // iframeDirect()
      
      cy.wait(7000);
      cy.get('iframe[name^=__privateStripeFrame]')
      .then(($firstIFrame) => {
        cy.wrap($firstIFrame.contents().find('iframe#challengeFrame'))
          .then(($secondIFrame) => {
            const target = confirm ? '#test-source-authorize-3ds' : '#test-source-fail-3ds'
            //const target = '#test-source-fail-3ds';
            cy.wrap($secondIFrame.contents().find(target)).click()
            cy.log(target);
          })
      })
  }
  


    verifySuccess(){
        cy.get('div.sr-root', {timeout: 100000}).contains('div.sr-root', 'Your test payment succeeded')
            .should('be.visible');
    }

    validateBlankFieldsError(){
      cy.get(ERROR_BLANK_BILLING_NAME).should('be.visible');
      cy.get(ERROR_BLANK_CARD_INFORMATION).should('be.visible');
      cy.get(ERROR_BLANK_EMAIL).should('be.visible');
    }

    validateInvalidEmail(){
      cy.contains('Your email is incomplete').should('be.visible');
    }

    validateInvalidCardNumber(){
      cy.contains('Your card number is invalid').should('be.visible');
    }

    validateInvalidExpiryDate(){
      cy.contains('Your card\'s expiration year is in the past').should('be.visible');
    }

    validateInvalidPhoneNumber(){
      cy.contains('Your phone number is invalid').should('be.visible');
    }

    generateRandomEmail() {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        const emailLength = Math.floor(Math.random() * 10) + 5; // generates a random email length between 5 and 14
        let email = '';
        for (let i = 0; i < emailLength; i++) {
          email += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        email += '@';
        const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com'];
        const domainIndex = Math.floor(Math.random() * domains.length);
        email += domains[domainIndex];
        return email;
      }

}

module.exports = Actions;