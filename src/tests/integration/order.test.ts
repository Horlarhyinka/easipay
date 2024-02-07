import Order from "../../models/order";
import User from "../../models/user";
import request from "supertest";
import server from "../..";
import { user_int } from "../../models/types/user";
import mongoose from "mongoose";
import { order_int } from "../../models/types/order";
import supertest from "supertest";
import session from "supertest-session"


const endpoint = "/api/v1/orders";

beforeEach(async () => {
  server.listen(0); 
});

afterEach(async () => {
  if (server) {
    server.close();
  }
});

const createTestUser = async() =>{
    return User.create({email: "testing@gmail.com", password: "testing", firstName: "test", lastName: "test", tel: "123456789"})
}


describe("create orders", ()=>{
    let token: string;
    let user: user_int;
    beforeEach(async()=>{
        await User.deleteMany({})
        user = await createTestUser()
        token = "Bearer " + user.genToken()
        // loginTestUser(user)
    })
    afterEach(async()=>{
        await Order.deleteMany({})
        await User.deleteMany({})
    })

    let agent: supertest.SuperAgentTest

    async function loginTestUser(user: user_int){
        let testSession = (session as any)(server)
        const res = await testSession(server).post("/api/v1/auth/login").send({email: user.email, password: "testing"})
        console.log(res.body)
    }


    it("should return 401 if user is unauthenticated",async()=>{
        const res = await request(server).post(endpoint)
        expect(res.statusCode).toBe(401)
    })
    it("should return 400 if empty order data is sent",async()=>{
        const agent = supertest.agent(server)
        await agent.post("/api/v1/auth/login").send({email: user.email, password: "testing"})
        const res1 = await agent.post(endpoint).send({})
        expect(res1.statusCode).toBe(400)
    })
    it("should return 400 if incomplete order item data is sent",async()=>{
        const agent = supertest.agent(server)
        await agent.post("/api/v1/auth/login").send({email: user.email, password: "testing"})
        const res2 = await agent.post(endpoint).set({"token": token}).send({
            items: [{name: "item 1"}]
        })
        expect(res2.statusCode).toBe(400)
    })
    it("should return 201 if item is created successfully", async()=>{ 
        const agent = supertest.agent(server)
        await agent.post("/api/v1/auth/login").send({email: user.email, password: "testing"})
        const res = await agent.post(endpoint).set({"Authorization": token}).send({
            items: [{
                name: "item 1",
                price: 2000,
                quantity: 1,
                images: ["test.jpeg"]
            }],
            method: "CARD"
        })
        expect(res.statusCode).toBe(201)
    })
})

describe("get items", ()=>{
    it("should return 200 status code",async()=>{
    await User.deleteMany({})
        const user = await createTestUser()
        const agent = supertest.agent(server)
        await agent.post("/api/v1/auth/login").send({email: user.email, password: "testing"})
        const res = await agent.get(endpoint)
        expect(res.statusCode).toBe(200)
    await User.deleteMany({})
    })
})
describe("get item", ()=>{
    let user: user_int;
    let token: string;
    let order: order_int;
    const notFoundId = String(new mongoose.Types.ObjectId())
    beforeEach(async()=>{
        user = await createTestUser()
        token = "Bearer " + user.genToken()
        order = await Order.create({
            items: [{
                name: "item 1",
                price: 2000,
                quantity: 1,
                images: ["test.jpeg"]
            }],
            method: "CARD",
            publicId: new mongoose.Types.ObjectId()
        })
    })

    afterEach(async()=>{
        await user.deleteOne()
        await order.deleteOne()
    })

    it("should return 400 if invalid id is provided", async()=>{
        const res = await request(server).get(endpoint + "/" + 1 + "/preview" ).set({"Authorization": token})
        expect(res.statusCode).toBe(400)
    })

    it("should return 404 if order is not found", async()=>{
        const res = await request(server).get(endpoint + "/" + notFoundId + "/preview" ).set({"Authorization": token})
        expect(res.statusCode).toBe(404)

    })
    it("should return 404 if order exists but was not created by the current user", async()=>{
        const res = await request(server).get(endpoint + "/" + notFoundId + "/preview" )
        expect(res.statusCode).toBe(404)
    })

    it("should return 200 if publicId is found",async()=>{
        const res = await request(server).get(endpoint + "/" + String(order.publicId ) + "/preview")
        expect(res.statusCode).toBe(200)
    })

    // it("should return 200 if user is authenticated, order was created by user, and orderId is found",async()=>{
    //     const res = await request(server).get(endpoint + "/" + String(order._id) ).set({"Authorization": token})
    //     expect(res.statusCode).toBe(200)
    // })

})

describe("get user order",()=>{
    it("should return 200 if order is found",async()=>{
        const user = await createTestUser()
        const agent = supertest.agent(server)
        await agent.post("/api/v1/auth/login").send({email: user.email, password: "testing"})
        const token = "Bearer " + user.genToken()
        const order = (await agent.post(endpoint).set({"Authorization": token}).send({
            items: [{
                name: "item 1",
                price: 2000,
                quantity: 1,
                images: ["test.jpeg"]
            }],
            method: "CARD"
        })).body as order_int
        const res = await agent.get(endpoint + "/" + String(order._id)).set({"Authorization": token})
        expect(res.statusCode).toBe(200)
    await Order.deleteMany({})
    })
    })


describe("get order item", ()=>{
    it("should return 404 status if order item is not found", async()=>{

    })
})