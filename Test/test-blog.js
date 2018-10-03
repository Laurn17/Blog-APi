const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog", function() {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	// GET CURRENT CONTENT
	it("should retreive current content  on GET", function() {
		return chai
			.request(app)
			.get("/blog-posts")
			.then(function(res) {
			 	expect(res).to.have.status(200);
			 	expect(res).to.be.json;
			 	expect(res.body).to.be.a("array");
			 	expect(res.body.length).to.be.at.least(1);

			 	const expectedKeys = ["id", "title", "content", "author"];
			 	res.body.forEach(function(item) {
			 		expect(item).to.be.a("object");
			 		expect(item).to.include.keys(expectedKeys);
			 	});
			});
	});

	// ADD A NEW BLOG
	it("should add a new blog entry on POST", function() {
		const newEntry = {title: "My new blog", content: "today was my first day of blogging!", author: "Lauren Morrow"};
		const expectedKeys = ["id", "title", "content", "author"];

		return chai
		.request(app)
		.post("/blog-posts")
		.send(newEntry)
		.then(function(res) {
			expect(res).to.have.status(201);
			expect(res).to.be.json;
			expect(res.body).to.be.a("object");
			expect(res.body).to.include.keys(expectedKeys);
			expect(res.body.title).to.equal(newEntry.title);
			expect(res.body.content).to.equal(newEntry.content);
			expect(res.body.author).to.equal(newEntry.author);
			expect(res.body.id).to.not.equal(null);
			// expect(res.body).to.deep.equal(
			// 	Object.assign(newEntry, {id: res.body.id})
			// );
		});
	});

	it("Should error if POST missing value", function() {
		const poorEntry = {};
		return chai
		.request(app)
		.post("/blog-posts")
		.send(poorEntry)
		.then(function(res) {
			expect(res).to.have.status(400);
		});
	});

	// UPDATE A BLOG
	it("should update a blog entry on PUT", function() {
		return ( chai
		.request(app)
		.get("/blog-posts")
		.then(function(res) {
			const updateEntry = {
			title: "Bad Day",
			content: "Today was a bad day",
			author: "Lauren Morrow"
		};
			updateEntry.id = res.body[0].id;

			return chai
			.request(app)
			.put(`/blog-posts/${updateEntry.id}`)
			.send(updateEntry)
			.then(function(res) {
			expect(res).to.have.status(204);
			});
		})
		);
	});

	// DELETE A BLOG
	it("should delete a blog entry on DELETE", function() {
		return chai
		.request(app)
		.get("/blog-posts")
		.then(function(res) {
			return chai
			.request(app)
			.delete(`/blog-posts/${res.body[0].id}`)
			.then(function(res) {
			expect(res).to.have.status(204);
			});
		});
	});
	
});