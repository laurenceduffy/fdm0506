import mail from "@sendgrid/mail";
import notificationController from './notificationController';
import dotenv from 'dotenv';

dotenv.config() // get .env vars required for functionality

//#region : test data

const testTo = 'test@email.com';
const testSubject = 'Email Test';
const testText = 'Email body text here.';
const testHtml = '<h1>HTML stuff</h1>';

//#endregion

//#region : test setup

beforeAll(() => {
    mail.send = jest.fn();
});
  
afterAll(() => {
    
});

beforeEach(() => {

});

afterEach(() => {
	
});

//#endregion

describe('sendEmail', () => {
    it('should return status 400 when no recipient is provided', done => {
        notificationController.sendEmail(null, testSubject, testText, testHtml)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    });

    it('should return status 400 when no subject is provided', done => {
        notificationController.sendEmail(testTo, null, testText, testHtml)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    });

    it('should return status 400 when no text and no html is provided', done => {
        notificationController.sendEmail(testTo, testSubject)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    });

    it('should call send when no text is provided', done => {
        mail.send.mockImplementation(async() => {});

        notificationController.sendEmail(testTo, testSubject, null, testHtml)
            .then(response => {
                expect(mail.send).toHaveBeenCalled();
                done();
            });
    });

    it('should call send when no html is provided', done => {
        mail.send.mockImplementation(async() => {});

        notificationController.sendEmail(testTo, testSubject, testText, null)
            .then(response => {
                expect(mail.send).toHaveBeenCalled();
                done();
            });
    });

    it('should return status 502 when send throws an error', done => {
        mail.send.mockImplementation(() => { return Promise.reject('Test Error'); });

        notificationController.sendEmail(testTo, testSubject, testText, testHtml)
            .then(response => {
                const { status } = response;

                expect(status).toBe(502);
                done();
            });
    });

    it('should return status 200 when send is called with no errors', done => {
        mail.send.mockImplementation(async() => {  });

        notificationController.sendEmail(testTo, testSubject, testText, testHtml)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });
});