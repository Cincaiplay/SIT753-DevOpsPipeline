var expect = require("chai").expect;
var request = require("request");

describe("Add Two Numbers API", function() {
    var url = "http://localhost:3040/addTwoNumber?n1=20&n2=15";  // Ensure correct numeric inputs

    it("returns status 200 to check if the API works", function(done) {
        request(url, function(error, response, body) {
            if (error) {
                console.error("Error in request:", error);
                return done(error);
            }
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it("returns statusCode key in body to check if the API gives the right result (200)", function(done) {
        request(url, function(error, response, body) {
            if (error) {
                console.error("Error in request:", error);
                return done(error);
            }
            try {
                body = JSON.parse(body);
                expect(body.statusCode).to.equal(200);
                done();
            } catch (e) {
                console.error("Error parsing response:", body);
                done(e);
            }
        });
    });

    it("returns the result as a number", function(done) {
        request(url, function(error, response, body) {
            if (error) {
                console.error("Error in request:", error);
                return done(error);
            }
            try {
                body = JSON.parse(body);
                expect(body.data).to.be.a('number');
                done();
            } catch (e) {
                console.error("Error parsing response:", body);
                done(e);
            }
        });
    });

    it("returns the result equal to 35", function(done) {
        request(url, function(error, response, body) {
            if (error) {
                console.error("Error in request:", error);
                return done(error);
            }
            try {
                body = JSON.parse(body);
                expect(body.data).to.equal(35);  // Ensure the test expects 35, based on n1=20 and n2=15
                done();
            } catch (e) {
                console.error("Error parsing response:", body);
                done(e);
            }
        });
    });

    it("returns the result not equal to 30", function(done) {
        request(url, function(error, response, body) {
            if (error) {
                console.error("Error in request:", error);
                return done(error);
            }
            try {
                body = JSON.parse(body);
                expect(body.data).to.not.equal(30);
                done();
            } catch (e) {
                console.error("Error parsing response:", body);
                done(e);
            }
        });
    });
});

describe("Add Two Strings API", function() {
    var url = "http://localhost:3040/addTwoNumber?n1=a&n2=b";

    it("should return status 400", function(done) {
        request(url, function(error, response, body) {
            if (error) {
                console.error("Error in request:", error);
                return done(error);
            }
            // Expecting 400 status code since inputs are invalid
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it("returns the result as null", function(done) {
        request(url, function(error, response, body) {
            if (error) {
                console.error("Error in request:", error);
                return done(error);
            }
            try {
                body = JSON.parse(body);
                // Expecting data to be null since inputs are invalid
                expect(body.data).to.be.null;
                done();
            } catch (e) {
                console.error("Error parsing response:", body);
                done(e);
            }
        });
    });
});


describe("User API Tests", function() {
    var createUserUrl = "http://localhost:3040/api/users";
    var getUserUrl = "http://localhost:3040/getUserByName";
    var getAllUsersUrl = "http://localhost:3040/api/users";

    it("should create a new user successfully", function(done) {
        var newUser = {
            name: "New User",
            email: "newuser@example.com",
            age: 28
        };

        request.post({
            url: createUserUrl,
            json: true,
            body: newUser
        }, function(error, response, body) {
            if (error) {
                console.error("Error in request:", error);
                return done(error);
            }
            expect(response.statusCode).to.equal(201);
            expect(body.message).to.equal("User created successfully");
            done();
        });
    });

    it("should fetch the created user by name", function(done) {
        var userName = { name: "New User" };

        request.post({
            url: getUserUrl,
            json: true,
            body: userName
        }, function(error, response, body) {
            if (error) {
                console.error("Error in request:", error);
                return done(error);
            }
            expect(response.statusCode).to.equal(200);
            expect(body.data).to.have.property("name", "New User");
            expect(body.data).to.have.property("email", "newuser@example.com");
            expect(body.data).to.have.property("age", 28);
            done();
        });
    });

    it("should return a list of users with at least one user", function(done) {
        request(getAllUsersUrl, function(error, response, body) {
            if (error) {
                console.error("Error in request:", error);
                return done(error);
            }
            try {
                body = JSON.parse(body);
                expect(response.statusCode).to.equal(200);
                expect(body.data).to.be.an('array');
                expect(body.data.length).to.be.at.least(1); 
                done();
            } catch (e) {
                console.error("Error parsing response:", body);
                done(e);
            }
        });
    });

    it("should return 404 for non-existing user", function(done) {
        var userName = { name: "NonExistentUser" };

        request.post({
            url: getUserUrl,
            json: true,
            body: userName
        }, function(error, response, body) {
            if (error) {
                console.error("Error in request:", error);
                return done(error);
            }
            expect(response.statusCode).to.equal(404);
            expect(body).to.have.property("message", "User not found");
            done();
        });
    });
});
