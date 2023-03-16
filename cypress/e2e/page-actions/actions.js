const FIELD_EMAIL = '#email';
const FIELD_CARD_NUMBER = '#cardNumber';
const FIELD_CARD_EXPIRY = '#cardExpiry';
const FIELD_CARD_CVC = '#cardCvc';
const FIELD_NAME_ON_CARD = '#billingName';
const DROPDOWN_COUNTRY_OR_REGION = '#billingCountry';
const TICKBOX_ENABLE_STRIPE_PASS = '#enableStripePass';
const FIELD_PHONE_NUMBER = '#phoneNumber';
const BUTTON_PAY = '[data-testid = "hosted-payment-submit-button"]';
const BUTTON_QUICK_PAY = '.SubmitButton-CheckmarkIcon > .Icon > svg > path'
const BUTTON_COMPLETE = '#test-source-authorize-3ds,button.button-default';
const ERROR_BLANK_EMAIL = '#required-email-fieldset';
const ERROR_BLANK_CARD_INFORMATION = '#required-cardNumber-fieldset';
const ERROR_BLANK_BILLING_NAME = '#required-billingName-fieldset';
const ERROR_FAIL_CHALLENGE = '.ConfirmPaymentButton-Error';
const FIELD_OTP_SMS ='[data-testid = "sms-code-input-0"]'
const LINK_SEND_TO_EMAIL ='.SendEmailOTPButton > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)'
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

    inputSmsOTP(){
       cy.get(FIELD_OTP_SMS,{timeout:10000}).type('123456');
    }

    clickSendToEmailInstead(){
      cy.get(LINK_SEND_TO_EMAIL,{timeout:5000}).click();
    }

    clickPay(){
      cy.get(BUTTON_PAY).click({force:true});
    }

    clickQuickPay(){
      cy.get(BUTTON_QUICK_PAY,{timeout:10000}).click();
    }

    clickComplete(){
      cy.wait(10000);
      
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

    clickFail(){
      cy.wait(5000);
      cy.get("iframe[name^=__privateStripeFrame]")
        .its('0.contentDocument')
        .its('body')
          .find('iframe#challengeFrame')
            .its('0.contentDocument')
            .its('body')
               .find('#test-source-fail-3ds',{timeout:10000}).click()
    }
    
    clickComplete2(){
      cy.wait(5000);
               cy.get("iframe[name^=__privateStripeFrame]")
               .its('0.contentDocument')
               .its('body')
               .find('iframe#challengeFrame')
               .its('0.contentDocument')
               .its('body')
               .find('#test-source-authorize-3ds',{timeout:10000}).click()
    }

    verifySuccess(){
        cy.get('div.sr-root', {timeout: 15000}).contains('div.sr-root', 'Your test payment succeeded')
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

    validateFailedChallenge(){
      cy.contains('We are unable to authenticate your payment method. Please choose a different payment method and try again.').should('be.visible');
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