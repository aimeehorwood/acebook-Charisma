const app = require("../../app");
const request = require("supertest");
require("../mongodb_helper");
const Post = require('../../models/post');
const User = require('../../models/user');
const TokenGenerator = require('../../models/token_generator');
const JWT = require("jsonwebtoken");
let token;

describe("/posts", () => {
  beforeAll( async () => {
    const user = new User({email: "test@test.com", password: "Password!12345678"});
    await user.save();
    token = TokenGenerator.jsonwebtoken(user.id);
  });

  beforeEach( async () => {
    await Post.deleteMany({});
  })

  afterAll( async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  })

  describe("POST, when token is present", () => {
    test("responds with a 201", async () => {
      let response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token });
      expect(response.status).toEqual(201);
    });
  
    test("creates a new post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token });
      let posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("hello world");
    });
  
    test("returns a new token", async () => {
      let response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token })
      let newPayload = JWT.decode(response.body.token, process.env.JWT_SECRET);
      let originalPayload = JWT.decode(token, process.env.JWT_SECRET);
      expect(newPayload.iat > originalPayload.iat).toEqual(true);
    });

    test("creates a new post and can be liked", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token });
      let posts = await Post.find();
      id = posts[0].id
      await request(app)
        .patch("/posts/" + id)
        .set("Authorization", `Bearer ${token}`)
        .send({ field: "likes", value: 'some valid user id' });  
      posts = await Post.find();
      expect(posts[0].likes.toObject()).toEqual(['some valid user id']);
    });

    test("creates a new post and can be commented on", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token });
      let posts = await Post.find();
      id = posts[0].id
      await request(app)
        .patch("/posts/" + id)
        .set("Authorization", `Bearer ${token}`)
        .send({ field: "comments", value: 'i am a test comment' });  
      posts = await Post.find();
      expect(posts[0].comments.toObject()).toEqual(['i am a test comment']);
    });
  });
  
  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      let response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });
      expect(response.status).toEqual(401);
    });
  
    test("a post is not created", async () => {
      await request(app)
        .post("/posts")
        .send({ message: "hello again world" });
      let posts = await Post.find();
      expect(posts.length).toEqual(0);
    });
  
    test("a token is not returned", async () => {
      let response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });
      expect(response.body.token).toEqual(undefined);
    });
  })

  describe("GET, when token is present", () => {
    test("returns every post in the collection", async () => {
      let post1 = new Post({message: "howdy!"});
      let post2 = new Post({message: "hola!"});
      await post1.save();
      await post2.save();
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({token: token});
      let messages = response.body.posts.map((post) => ( post.message ));
      expect(messages).toEqual(["howdy!", "hola!"]);
    })

    test("the response code is 200", async () => {
      let post1 = new Post({message: "howdy!"});
      let post2 = new Post({message: "hola!"});
      await post1.save();
      await post2.save();
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({token: token});
      expect(response.status).toEqual(200);
    })

    test("returns a new token", async () => {
      let post1 = new Post({message: "howdy!"});
      let post2 = new Post({message: "hola!"});
      await post1.save();
      await post2.save();
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({token: token});
      let newPayload = JWT.decode(response.body.token, process.env.JWT_SECRET);
      let originalPayload = JWT.decode(token, process.env.JWT_SECRET);
      expect(newPayload.iat > originalPayload.iat).toEqual(true);
    })
  })

  describe("DELETE, when token is missing", () => {
    test("throws an error", async () => {
      let post1 = new Post({message: "howdy!"});
      await post1.save();
      const post = await Post.findOne({message: "howdy!"})
      let response = await request(app)
        .delete(`/posts/${post._id}`);
      expect(response.status).toEqual(401);
    })

    test("it doesn't delete anything", async () => {
      let post1 = new Post({message: "howdy!"});
      await post1.save();
      const post = await Post.findOne({message: "howdy!"})
      let response = await request(app)
        .delete(`/posts/${post._id}`);
      expect(response.status).toEqual(401);
      const postStillThere = await Post.findOne({message: "howdy!"})
      expect(postStillThere.message).toBe('howdy!')
    })
  });

  describe("DELETE, when token is present", () => {
    test("response is 200", async () => {
      let post1 = new Post({message: "howdy!"});
      await post1.save();
      const post = await Post.findOne({message: "howdy!"})
      let response = await request(app)
        .delete(`/posts/${post._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({token: token});
      expect(response.status).toEqual(200);
    })

    test("deletes the post", async () => {
      let post1 = new Post({message: "howdy!"});
      await post1.save();
      const post = await Post.findOne({message: "howdy!"})
      let response = await request(app)
        .delete(`/posts/${post._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({token: token});
      expect(response.status).toEqual(200);
      const postStillThere = await Post.findOne({message: "howdy!"})
      expect(postStillThere).toBe(null)
    })
  });
});
