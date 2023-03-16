const Actions = require('../page-actions/actions.js');
const MailsacHandler = require('../handler/mailsac-handler.js')

describe('Stripe Testing', () => {
  const actions = new Actions();
  const mailsacHandler = new MailsacHandler()
  
    beforeEach(function() {
      cy.visit('https://stripe-samples.github.io/github-pages-stripe-checkout/');
      
      cy.intercept('POST', 'https://r.stripe.com/0', {
        statusCode: 200
        
      })
    });
 
    it('Validate Successful payment using a non 3d secure card', () => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })
      const email = actions.generateRandomEmail();
      cy.visit('/')
      cy.get('[data-price-id = "sku_GU4JYXyvvRb2sX"]').click();
      actions.inputEmail(email);
      cy.log(email);
      actions.inputCardNumber('4242 4242 4242 4242');
      actions.inputCardExpiry();
      actions.inputCardCVC();
      actions.inputBillingName();
      actions.inputCountry('Philippines')
      actions.clickPay();
      actions.verifySuccess()
    });

    it('Validate 1 click payment, confirmation via SMS OTP', () => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })
      cy.visit('/')
      cy.get('[data-price-id = "sku_GU4JYXyvvRb2sX"]').click();
      actions.inputEmail('testerman13@gmail.com');
      cy.get('body').click(0,0)
      actions.inputSmsOTP();
      actions.clickQuickPay();
      actions.verifySuccess()
    });
    
    //a bit flaky, just re-run if it fails
    it('Validate 1 click payment, confirmation via email OTP', () => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })
      cy.visit('/')
      cy.get('[data-price-id = "sku_GU4JYXyvvRb2sX"]').click();
      actions.inputEmail('testerman13@gmail.com');
      cy.get('body').click(0,0)
      actions.clickSendToEmailInstead()
      actions.inputSmsOTP();
      actions.clickQuickPay();
      actions.verifySuccess()
    });

    it('Validate error message for blank fields', () => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })
      const email = actions.generateRandomEmail();
      cy.visit('/')
      cy.get('[data-price-id = "sku_GU4JYXyvvRb2sX"]').click();
      cy.wait(5000);
      actions.clickPay();
      actions.validateBlankFieldsError();

    });

    it('Validate error message for incorrect input (Phone number has no validation)', () => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })
      const email = actions.generateRandomEmail();
      cy.visit('/')
      cy.get('[data-price-id = "sku_GU4JYXyvvRb2sX"]').click();
      cy.wait(5000);
      actions.inputEmail('a');
        cy.get('body').click(0,0)
        actions.validateInvalidEmail();
      actions.inputCardNumber('1111 1111 1111 1111'); 
        actions.validateInvalidCardNumber();
        cy.get('#cardNumber').clear();
      actions.inputCardExpiry('1111');
        actions.validateInvalidExpiryDate();
      actions.clickTickBox();
      actions.inputPhoneNumber('1111 11 111 1111')
        actions.validateInvalidPhoneNumber();
    });

    it('Validate successful payment with 3D secure verification card', () => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })
      
      cy.on('uncaught:exception', (err) => {
        if (err.message.includes('paymentRequest')) {
          return false;
        }
      });
      const email = actions.generateRandomEmail();
        cy.get('[data-price-id = "sku_GU4JYXyvvRb2sX"]',{timeout:10000}).click();
          actions.inputEmail(email);
          cy.log(email);
          actions.inputCardNumber('4000 0000 0000 3220');
          actions.inputCardExpiry();
          actions.inputCardCVC();
          actions.inputBillingName();
          actions.inputCountry('Philippines')
          actions.clickTickBox();
          actions.inputPhoneNumber();
          actions.clickPay();
          actions.clickComplete();
          actions.verifySuccess()
    })  

    it('Verify error message on failed challenge', () => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })
      cy.on('uncaught:exception', (err) => {
        if (err.message.includes('paymentRequest')) {
          return false;
        }
      });
      const email = actions.generateRandomEmail();
        cy.get('[data-price-id = "sku_GU4JYXyvvRb2sX"]',{timeout:10000}).click();
          actions.inputEmail(email);
          cy.log(email);
          actions.inputCardNumber('4000 0027 6000 3184');
          actions.inputCardExpiry();
          actions.inputCardCVC();
          actions.inputBillingName();
          actions.inputCountry('Philippines')
          actions.clickTickBox();
          actions.inputPhoneNumber();
          actions.clickPay();
          actions.clickFail();
          actions.validateFailedChallenge()
    })  
    //// used a different card no with 3D secure 2 verification too, this test is a bit flaky, just re-run if it fails
    it('Validate successful payment with 3D secure verification using card 4000 0027 6000 3184', () => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })
      cy.on('uncaught:exception', (err) => {
        if (err.message.includes('paymentRequest')) {
          return false;
        }
      });
      const email = actions.generateRandomEmail();
        cy.get('[data-price-id = "sku_GU4JYXyvvRb2sX"]',{timeout:10000}).click();
          actions.inputEmail(email);
          cy.log(email);
          actions.inputCardNumber('4000 0027 6000 3184');
          actions.inputCardExpiry();
          actions.inputCardCVC();
          actions.inputBillingName();
          actions.inputCountry('Philippines')
          actions.clickTickBox();
          actions.inputPhoneNumber();
          actions.clickPay();
          actions.clickComplete2();
          actions.verifySuccess()
    }) 

    /*
    ////// test for a real email otp confirmation
    it('mailsac test', () => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })
      let otp = ''
      const email = 'testerman13@mailsac.com'
      const mailsacHandler = new MailsacHandler(email);
      cy.visit('/')
      cy.get('[data-price-id = "sku_GU4JYXyvvRb2sX"]').click();
      actions.inputEmail('testerman13@gmail.com');
      cy.get('body').click(0,0)
      actions.clickSendToEmailInstead()
      mailsacHandler.getLatestMessageText();
      cy.get('@mailsacResponse').then((response) => {
        let body = response.body;
        cy.log(response);
        let otpRegex = /Your One-Time Password \(OTP\) is (\d{6})/; ///// this one needs to be tweaked based on the content of the email
        otp = otpRegex.exec(body)[1];
        cy.log(otp);
        actions.inputSmsOTP(otp);
    });
      */

})