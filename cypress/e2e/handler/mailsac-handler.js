const mailsacKeys = ["k_YjQnJUKNv5dgFHH8U5dck47tFLzna4Mi4sUxF2UAa6", "k_BP1u1KjUgtlcfYU5ZtvXUffFaWmKE6YvDYfuFzs7d"]
class MailsacHandler {
    constructor(email) {
        this.keyCount = 0;
        this.baseUrl = 'https://mailsac.com/api';
        this.inboxEndpoint = `/addresses/${email}/messages`;
        this.textEndpoint = `/text/${email}/`;
    }

    updateKey(func) {
        const wrapper = () => {
            func();
            cy.get('@mailsacResponse').then(response => {
                if (response.status === 429) {
                    this.keyCount++;
                    wrapper();
                }
            });
        }
        return wrapper;
    }

    getLatestMessage = this.updateKey(() => {
        cy.wait(5000).request({
            method: 'GET',
            url: this.baseUrl + this.inboxEndpoint,
            headers: {
                "Mailsac-Key": mailsacKeys[this.keyCount]
            },
            failOnStatusCode: false
        }).as('mailsacResponse');
    });

    getLatestMessageText = this.updateKey(() => {
        this.getLatestMessage();
        cy.get('@mailsacResponse').then(response => {
            let body = response.body;
            console.log('BODY ID', body[0]._id);
            cy.request({
                method: 'GET',
                url: this.baseUrl + this.textEndpoint + response.body[0]._id,
                headers: {
                    "Mailsac-Key": mailsacKeys[this.keyCount]
                },
                failOnStatusCode: false
            }).as('mailsacResponse');
        });
    });
}

module.exports = MailsacHandler;
