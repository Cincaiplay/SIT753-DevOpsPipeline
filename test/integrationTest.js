// const expect = require("chai").expect;
// const request = require("request");

// describe("Add Two Numbers API (Integration Tests)", function() {
//     const url = "http://localhost:4000/addTwoNumber?n1=20&n2=15";  // URL points to the deployed test environment

//     it("returns status 200 to check if the API works", function(done) {
//         request(url, function(error, response, body) {
//             if (error) {
//                 console.error("Error in request:", error);
//                 return done(error);
//             }
//             expect(response.statusCode).to.equal(200);
//             done();
//         });
//     });

//     it("returns the correct result equal to 35", function(done) {
//         request(url, function(error, response, body) {
//             if (error) {
//                 console.error("Error in request:", error);
//                 return done(error);
//             }
//             try {
//                 body = JSON.parse(body);
//                 expect(body.data).to.equal(35);  // Verifying the result is 35 (n1=20, n2=15)
//                 done();
//             } catch (e) {
//                 console.error("Error parsing response:", body);
//                 done(e);
//             }
//         });
//     });
// });
