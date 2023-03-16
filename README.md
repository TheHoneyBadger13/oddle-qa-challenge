#How to run test on cypress
run 'npm install cypress on '/oddle-qa-challenge'
run 'npx cypress open'
select the stripe-test.cy in the cypress test runne

#How to run on node (with jUnit as reporter)
run 'npm run cypress:chrome'

#Test Results
test result generated by jUnit is located at '/oddle-qa-challenge'
screenshots for failing tests are located/generated at '/oddle-qa-challenge/screenshots/'
video of the test run will be located/generated at '/oddle-qa-challenge/videos/'

#Issue experiencing
Stuck on processing after clicking 'COMPLETE' button in 3D secure 2 (has no issue with payment when testing non 3D secure payment, there is also a test for that in the spec file). Not sure if it is a card no. issue but I found a card number that needs 3D secure 2 and it works (included in another test scenarios)

Cypress test runner disappears when redirecting to stripe checkout page. used 'experimentalModifyObstructiveThirdPartyCode' and 'chromeWebSecurity' as work-around


