import axios from "axios";
import paystack from "../../../services/paystack";

describe("paystack", ()=>{
    it("should make axios request", ()=>{
        const obj = {email: "testing@gmail.com", amount: 2000}
        const postMock = jest.fn()
        paystack.checkout(obj)
        expect(postMock).toHaveBeenCalled()
    })
})