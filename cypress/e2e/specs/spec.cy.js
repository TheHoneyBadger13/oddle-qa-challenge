const Actions = require('../page-actions/actions.js');



describe('Oddle QA Challenge', () => {
  const actions = new Actions();
  
    beforeEach(function() {
      //cy.clearAllCookies();
      //cy.clearAllSessionStorage();
      //Cypress.Cookies.preserveOnce('sessionid')
      cy.visit('https://stripe-samples.github.io/github-pages-stripe-checkout/');
      /*
      cy.intercept('POST', 'https://r.stripe.com/0', {
        statusCode: 200
        
      })
      */
      cy.intercept('https://r.stripe.com/0', (req) => {
            // the origin header is not getting set which is causing the request to fail
            req.headers['origin'] = 'https://js.stripe.com'
        })
     
    })
    it('without 3D secure verification', () => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })
      const email = actions.generateRandomEmail();
      cy.visit('/')
      cy.get('[data-price-id = "sku_GU4JYXyvvRb2sX"]').click();
      //cy.wait(5000);
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

    it('with 3D secure verification', () => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })
      cy.on('uncaught:exception', (err) => {
        if (err.message.includes('paymentRequest')) {
          return false;
        }
      });
      const email = actions.generateRandomEmail();
      let source;
      //intercept authenticate, in order to get the source which would be used for the request later in this scenario
      cy.intercept('POST', 'https://api.stripe.com/v1/3ds2/authenticate', (req) => {
            req.continue((res) => {
              const responseBody = res.body;
              source = responseBody.source;
              console.log(source);
            });
          });
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
          cy.wrap(null).should(() => {
            expect(source).to.not.equal(undefined);
          }).then( ()=> {
            //code below is an attempt to mock the api for challenge complete, with the source that is taken from the intercepted authorise call, got error 400 because of an invalid data
            /*
            cy.request({
                method:"POST",
                url:"https://api.stripe.com/v1/3ds2/challenge_complete",
                form:true,
                body:{
                "source":`${source}`,
                "final_cres":JSON.stringify({
                    "threeDSServerTransID":"c3c93d1d-fc44-45eb-a85e-17990d0917d6",
                    "acsCounterAtoS":"001",
                    "acsTransID":"5a38f929-8355-4d86-8ccf-cdf9146d8d7b",
                    "challengeCompletionInd":"Y",
                    "messageType":"CRes",
                    "messageVersion":"2.1.0",
                    "transStatus":"Y"
                }),
                "key":"pk_test_Tr8olTkdFnnJVywwhNPHwnHK00HkHV4tnP"
                },
                headers:{
                "authorization":"Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc"
                }
            })
            */
        })
          actions.verifySuccess()
    })  

})