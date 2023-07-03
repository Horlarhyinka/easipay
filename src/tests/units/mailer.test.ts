import Mailer from "../../services/mailer"

describe("mailer",()=>{
    const testusermail = "testing@gmail.com";
    const testResetLink = "https://test-reset-link.com"
    const mailer = new Mailer(testusermail)

    it("should call sendResetPassword", async()=>{
        const returnMock = jest.fn()
        mailer.sendPasswordResetMail = returnMock
        await mailer.sendPasswordResetMail(testResetLink)
        expect(returnMock).toHaveBeenCalled()
    })

    it("should call sendNotificationMail", async()=>{
        const returnMock = jest.fn()
        mailer.sendNotificationMail = returnMock
        await mailer.sendNotificationMail("test",{test: "test"})
        expect(returnMock).toHaveBeenCalled()
        })
})