const multer = require("multer");
const path = require("path");

// 📂 Configuration du stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "../public/uploads/avatars"); // 📁 Chemin correct
        console.log("Dossier de destination :", uploadPath); // Ajout du log pour vérifier le chemin
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + path.extname(file.originalname);
        console.log("Nom du fichier :", filename); // Log du nom du fichier pour vérifier que le fichier est bien renommé
        cb(null, filename); // 🔹 Nom unique
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Seules les images sont autorisées"), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
