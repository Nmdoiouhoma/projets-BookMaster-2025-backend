const chai = require("chai")
const chaiHttp = require("chai-http");
const mocha = require("mocha");
const should = chai.should();
const {app, dbStart,userModel} = require("../index");
const authController = require("../controller/AuthController");


chai.use(chaiHttp);

describe('API Tests', function() {
    this.timeout(5000);
    let token = '';

    // Connexion à l'API pour récupérer le token JWT
    before( (done) => {
        dbStart().then( async () => {
            console.log("Creating test user");
            authController.createUser('User1', 'user1', 'default').then( () => // TODO adapter à votre fonction insert()
                chai.request(app)
                    .post('/signup') // TODO : remplacer par votre URL d'authentification
                    .send({username: 'user1', password: 'default'}) // TODO : remplacer par les champs attendus par votre route
                    .end((err, res) => {
                        res.should.have.status(200);
                        token = res.body.token;
                        console.log("Token récupéré :", token)
                        done();
                    })
                    .catch((error) => {
                        console.error("❌ Erreur pendant la création de l’utilisateur :", error);
                        done(error)
            })
            )})

    });

    // Connexion à l'API pour récupérer le token JWT
    after((done) => {
        console.log("Deleting test user");
        userModel.findOne({ where: { username: 'user1' } })
            .then((user) => {
                if (user) {
                    return userModel.destroy({where: {id: user.id}});
                } else {
                    console.warn("⚠️ Test user not found in DB");
                    return Promise.resolve();
                }
            })
            .then(() => done())
            .catch((err) => {
                console.error("❌ Error during user cleanup:", err);
                done(err); // Passe l'erreur à Mocha
            });
    });



    it('should allow access with valid token', (done) => {
        chai.request(app)
            .get('/profile') // TODO : remplacer par une de vos routes protégée par validateJWT
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array'); // TODO : remplacer array par object si votre route retourne un objet
                res.body.should.have.lengthOf(0); // TODO remplacer par votre test
                done();
            });
    });
})