const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, dbStart } = require("../index");
chai.use(chaiHttp);
chai.should();

describe('API Tests', function () {
    this.timeout(10000); // plus généreux

    let token = '';
    let userId = '';
    let spaceId = null;
    let addedBookId = null;

    before((done) => {
        dbStart().then(() => {
            chai.request(app)
                .post('/signup')
                .send({
                    username: 'user1',
                    password: 'default',
                    avatar: 'null',
                    email: 'user1@example.com',
                    name: 'test',
                    lastname: 'testUser1'
                })
                .end((err, res) => {
                    if (err || res.status !== 200) {
                        console.error("Échec de l'inscription, tentative de connexion...");
                        return chai.request(app)
                            .post('/login')
                            .send({ username: 'user1', password: 'default' })
                            .end((err, res) => {
                                if (err || res.status !== 200) {
                                    console.error("Échec de la connexion :", err || res.text);
                                    return done(err || new Error("Échec de la connexion"));
                                }
                                token = res.body.token;
                                const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], 'base64').toString());
                                userId = decodedToken.id;
                                console.log("🔑 Token récupéré :", token);
                                done();
                            });
                    } else {
                        token = res.body.token;
                        const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], 'base64').toString());
                        userId = decodedToken.id;
                        console.log("✅ Utilisateur créé et token récupéré :", token);
                        done();
                    }
                });
        }).catch(done);
    });

    it('should allow access with valid token', function (done) {
        chai.request(app)
            .get('/profile')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('username').eql('user1');
                done();
            });
    });

    it('should add a new book and get space_id and book_id', function(done) {
        const newBook = {
            title: 'Test Book',
            author: 'Test Author',
            description: 'A test description',
            genre: 'Test Genre',
            isbn: '1234567890123',
            publishedDate: '2022-01-01',
            page_count: 100,
            status: 'available',
            date_added: '2025-05-03',
            cover: 'http://example.com/cover.jpg'
        };

        chai.request(app)
            .post('/addBook')
            .set('Authorization', `Bearer ${token}`)
            .send(newBook)
            .end((err, res) => {
                if (err) {
                    console.error("Erreur lors de l'ajout du livre :", err);
                    return done(err);
                }
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.book.should.have.property('book_id');
                res.body.should.have.property('space_id'); // espace lié

                addedBookId = res.body.id;
                spaceId = res.body.space_id;

                console.log("Livre ajouté avec id:", addedBookId, "Espace id:", spaceId);
                done();
            });
    });

    after((done) => {
        chai.request(app)
            .delete(`/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
