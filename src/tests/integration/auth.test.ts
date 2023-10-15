import request from "supertest";
import Server from "../..";
import User from "../../models/user";

let server: typeof Server;

const flushDb = async () => User.deleteMany();

beforeAll(async () => {
  server = Server.listen(0);
});

afterEach(async () => {
  if (server) {
    server.close();
  }
  await flushDb();
});

describe("register", ()=>{
    beforeAll(async()=>await flushDb())
    afterEach(async()=>await flushDb())

    it("should return status 400 if no email or password is provided",async()=>{
        const res = await request(server).post("/api/v1/auth/register").send({})
        expect(res.statusCode!).toBe(400)
    })
    it("should return status 400 if invalid is provided",async()=>{
        const res = await request(server).post("/api/v1/auth/register").send({email: "test", password: "testing"})
        expect(res.statusCode!).toBe(400)
    })
    it("should return status 400 if password is less than 6",async()=>{
        const res = await request(server).post("/api/v1/auth/register").send({email: "testing@gmail.com", password: "test"})
        expect(res.statusCode!).toBe(400)
    })
    it("should return 409 if email already exist", async()=>{
        await User.create({email: "testing@gmail.com", password: "testing"})
        const res = await request(server).post("/api/v1/auth/register").send({email: "testing@gmail.com", password: "testing"})
        expect(res.statusCode!).toBe(409)
    })
    it("should return 200 status code for valid informations",async()=>{
        User.find({}).then(res=>{
        })
        const res = await request(server).post("/api/v1/auth/register").send({email: "testing@gmail.com", password: "testing"})
        expect(res.statusCode!).toBe(200)
    })
    console.log("register test suite ran...")
})

describe("login", ()=>{
    const createTestUser = async()=>User.create({ email: "testing@gmail.com", password: "testing"})
    it("should return status 400 code if email or password is not provided",async()=>{
        const res = await request(server).post("/api/v1/auth/login").send({})

        expect(res.statusCode!).toBe(400)

    })
    it("should return 404 if email is not registered", async()=>{
        const res = await request(server).post("/api/v1/auth/login").send({email: "notfound@gmail.com",password: "testing"})
        expect(res.statusCode!).toBe(404)
    })
    it("should return 400 if password is incorrect", async()=>{
        await createTestUser()
        const res = await request(server).post("/api/v1/auth/login").send({email: "testing@gmail.com",password: "test"})
        expect(res.statusCode!).toBe(400)
        await flushDb()
    })
    it("should return 200 status code for valid credentials",async()=>{
        await createTestUser()
        const res = await request(server).post("/api/v1/auth/login").send({email: "testing@gmail.com",password: "testing"})
        expect(res.statusCode!).toBe(200)
        await flushDb()
    })
    console.log("login test suite ran...")
})

