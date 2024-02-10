import request from "supertest";
import server from "../..";
import User from "../../models/user";

const flushDb = async () => User.deleteMany();

beforeAll(async () => {
    server.listen(0)
});

afterEach(async () => {
  server.closeAllConnections()
  await flushDb();
});

describe("register", ()=>{
    beforeAll(async()=>await flushDb())
    afterEach(async()=>await flushDb())

    function exec(body: object):any{
        return request(server).post("/api/v1/auth/register").send(body)
    }

    const obj = {email: "testing@gmail.com", password: "testing", firstName: "test", lastName: "test", tel: "123456789"}

    it("should return status 400 if no email or password is provided",async()=>{
        const res = await exec({})
        expect(res.statusCode!).toBe(400)
    })
    it("should return status 400 if invalid email is provided",async()=>{
        const res = await exec({...obj, email: "invalid"})
        expect(res.statusCode!).toBe(400)
    })
    it("should return status 400 if firstName is not provided", async()=>{
        const res = await exec({...obj, firstName: undefined})
        expect(res.statusCode!).toBe(400)
    })
    it("should return status 400 if lastName is not provided", async()=>{
        const res = await exec({...obj, lastName: undefined})
        expect(res.statusCode!).toBe(400)
    })
    it("should return status 400 if tel is not provided", async()=>{
        const res = await exec({...obj, tel: undefined})
        expect(res.statusCode!).toBe(400)
    })
    it("should return status 400 if password is less than 6",async()=>{
        const res = await exec({...obj, password: "test"})
        expect(res.statusCode!).toBe(400)
    })
    it("should return 409 if email is already registered", async()=>{
        await User.create(obj)
        const res = await exec(obj)
        expect(res.statusCode!).toBe(409)
    })
    it("should return 200 status code for valid informations",async()=>{

        const res = await exec(obj)
        expect(res.statusCode!).toBe(200)
    })
})

describe("login", ()=>{
    const obj = {email: "testing@gmail.com", password: "testing", firstName: "test", lastName: "test", tel: "123456789"}
    const createTestUser = async()=>User.create(obj)
    beforeEach(async()=>{
        await User.deleteMany({})
    })
    afterEach(async()=>{
        await User.deleteMany({})
    })
    it("should return status 400 code if email or password is not provided",async()=>{
        const res = await request(server).post("/api/v1/auth/login").send({})
        expect(res.statusCode!).toBe(400)

    })
    it("should return 404 if email is not registered", async()=>{
        const res = await request(server).post("/api/v1/auth/login").send({...obj, email: "notfound@gmail.com"})
        expect(res.statusCode!).toBe(404)
    })
    it("should return 400 if password is incorrect", async()=>{
        await createTestUser()
        const res = await request(server).post("/api/v1/auth/login").send({...obj, password: "test"})
        expect(res.statusCode!).toBe(400)
        await flushDb()
    })
    it("should return 200 status code for valid credentials",async()=>{
        await createTestUser()
        const res = await request(server).post("/api/v1/auth/login").send({email: obj.email, password: obj.password})
        expect(res.statusCode!).toBe(200)
        await flushDb()
    })
})

