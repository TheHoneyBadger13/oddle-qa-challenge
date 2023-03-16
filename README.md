#How to run test
run npm install cypress on '/oddle-qa-challenge'
run npx cypress open

#Test Scenarios
1. Successful payment using non 3d secure card (4242 4242 4242 4242)
2. Validate error message for incorrect input (Phone number has no validation)
3. Validate error message for blank fields
4. Successful payment using 3d secure card (4000 0000 0000 3220), failed as of now (check issue below)


#Issue experiencing
Stuck on processing after clicking 'COMPLETE' button in 3D secure 2 (has no issue with payment when testing non 3D secure payment, there is also a test for that in the spec file)

