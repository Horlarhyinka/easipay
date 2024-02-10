import paystack from "../../../services/paystack";

let axios = require("axios")

describe("paystack", ()=>{
        const obj = {email: "testing@gmail.com", amount: 2000}
    it("should throw error if invalid email and amount is provided", async()=>{
        const res = await paystack.checkout({email: "", amount: 0})
        console.log({res})
        expect(res).toThrow()
    })
    it("should call axios.post if data is valid", async()=>{
        axios = {
            post: jest.fn()
        }
        const res = await paystack.checkout(obj)
        expect(typeof res).toBe("string")
    })
})