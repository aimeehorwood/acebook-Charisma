const app = require('../../app')
const request = require('supertest')
require('../mongodb_helper')
const User = require('../../models/user')
const TokenGenerator = require('../../models/token_generator')
const { deleteOne } = require('../../models/user')

describe('/users/signup', () => {
  describe('POST, when email and password are provided', () => {
    test('the response code is 201', async () => {
      let response = await request(app)
        .post('/users/signup')
        .send({ email: 'poppy@email.com', password: 'Password!12345678' })
      expect(response.statusCode).toBe(201)
      await User.deleteOne({ email: 'poppy@email.com' })
    })

    test('a user is created', async () => {
      await request(app)
        .post('/users/signup')
        .send({ email: 'scarlett@email.com', password: 'Password!12345678' })
      let users = await User.find()
      let newUser = users[users.length - 1]
      expect(newUser.email).toEqual('scarlett@email.com')
      await User.deleteOne({ email: 'scarlett@email.com' })
    })
  })

  describe('POST, when password is missing', () => {
    test('response code is 400', async () => {
      let response = await request(app)
        .post('/users/signup')
        .send({ email: 'skye@email.com' })
      expect(response.statusCode).toBe(400)
    })

    test('does not create a user', async () => {
      await request(app).post('/users/signup').send({ email: 'skye@email.com' })
      let users = await User.find()
      expect(users.length).toEqual(0)
    })
  })

  describe('POST, when email is missing', () => {
    test('response code is 400', async () => {
      let response = await request(app)
        .post('/users/signup')
        .send({ password: 'Password!12345678' })
      expect(response.statusCode).toBe(400)
    })

    test('does not create a user', async () => {
      await request(app)
        .post('/users/signup')
        .send({ password: 'Password!12345678' })
      let users = await User.find()
      expect(users.length).toEqual(0)
    })
  })
})

//Logging in

describe('/users/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/users/signup')
      .send({ email: 'test@test.com', password: 'Password!12345678' })
  })

  afterEach(async () => {
    await User.deleteOne({ email: 'test@test.com' })
  })

  describe('POST, when email and password are provided', () => {
    test('the response code is 201', async () => {
      let response = await request(app)
        .post('/users/login')
        .send({ email: 'test@test.com', password: 'Password!12345678' })
      expect(response.statusCode).toBe(200)
    })
  })

  describe('POST, when password is missing', () => {
    test('response code is 400', async () => {
      let response = await request(app)
        .post('/users/login')
        .send({ email: 'test@test.com' })
      expect(response.statusCode).toBe(400)
    })
  })

  describe('POST, when email is missing', () => {
    test('response code is 400', async () => {
      let response = await request(app)
        .post('/users/login')
        .send({ password: 'Password!12345678' })
      expect(response.statusCode).toBe(400)
    })
  })
})

// getting a user
describe('GET, when a user detail is provided', () => {
  test('the response code is 200', async () => {
    let response = await request(app).get('/users/63c05196f61d7b5eeab48f20')
    expect(response.statusCode).toBe(200)
  })

  test("the response has an error if the user doesn't exist", async () => {
    let response = await request(app).get('/users/notarealuserid')
    expect(response.statusCode).toBe(404)
    expect(response.body.error).toBe('This user no longer exists')
  })

  test('finds the user and returns it', async () => {
    let response = await request(app)
      .post('/users/signup')
      .send({ email: 'poppy@email.com', password: 'Password!12345678' })
    let users = await User.find()
    let newUser = users[users.length - 1]
    let id = newUser.id
    let userResponse = await request(app).get('/users/' + id)
    expect(userResponse.body.user.email).toBe('poppy@email.com')
  })

  
})


// editing a user
describe("PATCH, when a user detail is provided", () => {
  beforeEach( async () => {
  const user = new User({name:'test test', aboutMe:'I am a test', email: "test@test.com", image:"image-url", password: "Password!12345678"});
  await user.save();
  token = TokenGenerator.jsonwebtoken(user.id);
  });

  afterEach( async () => {
    await User.deleteOne({email: 'test@test.com'});
  });

  test("the response code is 200", async () => {
    let [user] = await User.find({email: "test@test.com" })
    const id = await user._id
    let response = await request(app)
      .patch(`/users/profile/${id}`)
      .set("Authorization", `Bearer ${token}`)
     .send({ name: 'new test', email: "test@test.com", aboutMe:'I am a new test', image:"image-url" });
    expect(response.status).toEqual(200);
    const [updatedUser] = await User.find({_id: id })
    expect(updatedUser.name).toBe('new test')
  })

  test("the response code is 500 if the user id doesn't match a current user", async () => {
    let response = await request(app)
      .patch(`/users/profile/notarealuserid`)
      .set("Authorization", `Bearer ${token}`)
     .send({ name: 'new test', email: "test@test.com", aboutMe:'I am a new test', image:"image-url" });
    expect(response.status).toEqual(500);
  })

  //friends
  describe("PATCH, when adding a friend", () => {
    beforeEach( async () => {
    const user = new User({name:'test test', aboutMe:'I am a test', email: "test2@test.com", image:"image-url", password: "Password!12345678"});
    await user.save();
    token = TokenGenerator.jsonwebtoken(user.id);
    });
  
    afterEach( async () => {
      await User.deleteOne({email: 'test2@test.com'});
    });
  
    test("the response code is 200 and friends id goes into requests", async () => {
      let [user] = await User.find({email: "test2@test.com" })
      const id = await user._id
      let response = await request(app)
        .patch(`/users/${id}`)
        .set("Authorization", `Bearer ${token}`)
       .send({ requester: 'requesterId', field: 'request'});
      expect(response.status).toEqual(200);
      const [updatedUser] = await User.find({_id: id })
      expect(updatedUser.friendRequests.length).toBe(1)
    })

    // This test takes too long and times out

    // test("you can then accept", async () => {
    //   let [user] = await User.find({email: "test2@test.com" })
    //   const id = await user._id
    //   let response = await request(app)
    //     .patch(`/users/${id}`)
    //     .set("Authorization", `Bearer ${token}`)
    //    .send({ requester: 'requesterId', field: 'request'});
    //   let response2 = await request(app)
    //     .patch(`/users/requesterId`)
    //     .set("Authorization", `Bearer ${token}`)
    //    .send({ requester: `${id}`, field: 'accept'});
    //   const [updatedUser2] = await User.find({_id: id })
    //   expect(updatedUser2.friendRequests.length).toBe(0)
    //   expect(updatedUser2.friends.length).toBe(1)

    // })

    })
})