const request = require('supertest')
const app = require('../app')
describe('Get Endpoints', () => {
    it('should handle a new get request', async() => {
        const res = await request(app)
            .get("/path")
        expect(res.statusCode).toEqual(200)
        //expect(res.body).toEqual('Hello Word 2!')
    })
})
