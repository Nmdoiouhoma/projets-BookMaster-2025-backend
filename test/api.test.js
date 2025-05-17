const chai = require("chai")
const chaiHttp = require("chai-http");
const mocha = require("mocha");
const should = chai.should();
const {app, dbStart,userModel} = require("../index");

chai.use(chaiHttp);

before(async function () {
    this.timeout(10000);

    try {
        await dbStart();

        // Appel de la route /signup pour créer l'utilisateur de test
        const signupRes = await chai.request(app)
            .post('/signup')
            .send({
                email: "user1@test.com",
                name: "User1",
                username: "user1",
                lastname: "Test",
                password: "default"
            });

        signupRes.should.have.status(201);
        console.log("✅ Utilisateur créé via /signup");

        // Appel de la route /login pour récupérer le token
        const loginRes = await chai.request(app)
            .post('/login')
            .send({
                username: "user1",
                password: "default"
            });

        loginRes.should.have.status(200);
        token = loginRes.body.token;
        console.log("✅ Token récupéré :", token);

    } catch (err) {
        console.error("❌ before() failed:", err);
    }
});



