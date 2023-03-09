const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite("10 functional get request tests", function () {
        test("Creating a new thread: POST request to /api/threads/{board}", function (){
          chai
            .request(server)
            .post('/api/threads/{board}')
            .send({board:'helo'},{text:'tes12'},{delete_password:'shit'})
            .set("content-type", "application/json")
            .end(function (err, res) {
               assert.equal(res.status, 200);      
            });
        });
        test("Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}", function () {
            chai
              .request(server)
              .get('/api/threads/{board}')
              .send({board:'hello'})
              .set("content-type", "application/json")
              .end(function (err, res) {
                assert.equal(res.status, 200);
              });
          });
          test("Deleting a thread with the incorrect password: DELETE request to /api/threads", function () {
            chai
              .request(server)
              .delete('/api/threads/{board}')
              .send({board:'hello'},{thread_id:'6409b5122de3736bebe76868'},{delete_password:'idontknow'})
              .set("content-type", "application/json")
              .end(function (err, res) {
                assert.equal(res.status, 200); 
              });
          });
          test("Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password", function () {
            chai
              .request(server)
              .delete('/api/threads/{board}')
              .send({board:'hello'},{thread_id:'6409b5122de3736bebe76868'},{delete_password:'idoknow'})
              .set("content-type", "application/json")
              .end(function (err, res) {
                assert.equal(res.status, 200); 
              });
          });
          test("Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password", function () {
            chai
              .request(server)
              .put('/api/threads/{board}')
              .send({board:'hello'},{thread_id:'6409b5122de3736bebe76868'})
              .set("content-type", "application/json")
              .end(function (err, res) {
                assert.equal(res.status, 200); 
              });
          });

          test("Creating a new reply: POST request to /api/replies/{board}", function () {
            chai
              .request(server)
              .post('/api/replies/{board}')
              .send({board:'hello'},{thread_id:'6409b5122de3736bebe76868'},{delete_password:'idoknow'})
              .set("content-type", "application/json")
              .end(function (err, res) {
                assert.equal(res.status, 200); 
              });
          });
          test("Viewing a single thread with all replies: GET request to /api/replies/{board}", function () {
            chai
              .request(server)
              .get('/api/replies/{board}')
              .send({board:'hello'},{thread_id:'6409b5122de3736bebe76868'})
              .set("content-type", "application/json")
              .end(function (err, res) {
                assert.equal(res.status, 200); 
              });
          });
          test("Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password", function () {
            chai
              .request(server)
              .delete('/api/replies/{board}')
              .send({board:'hello'},{thread_id:'6409b5122de3736bebe76868'},{reply_id:'6409b5122de3736bebe76868'},{delete_password:'idontknow'})
              .set("content-type", "application/json")
              .end(function (err, res) {
                assert.equal(res.status, 200); 
              });
          });
          test("Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password", function () {
            chai
              .request(server)
              .delete('/api/replies/{board}')
              .send({board:'hello'},{thread_id:'6409b5122de3736bebe76868'},{reply_id:'6409b5122de3736bebe76868'},{delete_password:'idoknow'})
              .set("content-type", "application/json")
              .end(function (err, res) {
                assert.equal(res.status, 200); 
              });
          });
          test("Reporting a reply: PUT request to /api/replies/{board}", function () {
            chai
              .request(server)
              .put('/api/replies/{board}')
              .send({board:'hello'},{thread_id:'6409b5122de3736bebe76868'},{reply_id:'6409b5122de3736bebe76868'})
              .set("content-type", "application/json")
              .end(function (err, res) {
                assert.equal(res.status, 200); 
              });
          });
              
                
    });

});

after(function() {
  chai.request(server)
    .get('/api')
  });
