const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, dbStart } = require("../index");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Intégration complète : Création utilisateur + Login + Ajout livre + Suppression livre", function () {
    this.timeout(10000);

    let token = '';
    let userId = '';
    let spaceId = null;
    let bookId = null;

    before((done) => {
        dbStart().then(() => {
            chai.request(app)
                .post('/signup')
                .send({
                    username: 'testUser',
                    password: 'password123',
                    email: 'testUser@example.com',
                    name: 'Test',
                    lastname: 'User',
                    avatar: null
                })
                .end((err, res) => {
                    if (res.status !== 200) {
                        // utilisateur existe déjà → on tente le login
                        return chai.request(app)
                            .post('/login')
                            .send({ username: 'testUser', password: 'password123' })
                            .end((err, res) => {
                                if (err || res.status !== 200) return done(err || new Error('Échec login'));

                                token = res.body.token;
                                const decoded = JSON.parse(Buffer.from(token.split(".")[1], 'base64').toString());
                                userId = decoded.id;
                                done();
                            });
                    } else {
                        token = res.body.token;
                        const decoded = JSON.parse(Buffer.from(token.split(".")[1], 'base64').toString());
                        userId = decoded.id;
                        done();
                    }
                });
        }).catch(done);
    });

    it("✅ Connexion autorisée avec token valide", (done) => {
        chai.request(app)
            .get('/profile')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('username', 'testUser');
                done();
            });
    });

    it("📚 Ajout d’un nouveau livre", (done) => {
        const newBook = {
            title: 'Integration Test Book',
            author: 'Test Author',
            description: 'Un livre ajouté via test',
            genre: 'Test Genre',
            isbn: '9876543210123',
            publishedDate: '2023-01-01',
            page_count: 321,
            status: 'available',
            date_added: '2025-05-12',
            cover: 'http://example.com/cover.jpg'
        };

        chai.request(app)
            .post('/addBook')
            .set('Authorization', `Bearer ${token}`)
            .send(newBook)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('book');
                expect(res.body.book).to.have.property('book_id');
                expect(res.body).to.have.property('space_id');

                spaceId = res.body.space_id;
                bookId = res.body.book.book_id; // Utilisation de bookId ici
                done();
            });
    });

    after("🧹 Suppression de l’utilisateur", (done) => {
        chai.request(app)
            .delete(`/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
