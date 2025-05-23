const jwt = require("jsonwebtoken");
const Profil = require("../models/Profil");

const verifToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token manquant, accès refusé" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token invalide" });
    }

    // console.log(decoded);
    req.user = decoded;
    next();
  });
};

const verifProfil = (authorizedProfil = []) => {
  return async (req, res, next) => {

    const profil = await Profil.findById(req.user.userProfilId);

    const profilLibelleLower = profil.libelle.toLowerCase();
    const authorizedLower = authorizedProfil.map(p => p.toLowerCase());

    // console.log(!profilLibelleLower || !authorizedLower.includes(profilLibelleLower));
    if (!profilLibelleLower || !authorizedLower.includes(profilLibelleLower)) {
      return res
        .status(403)
        .json({ message: "Accès refusé" });
    }
    next();
  };
};


// const verifProfil = (authorizedProfil = []) => {
//   return async (req, res, next) => {

//     const profil = await Profil.findById(req.user.userProfilId);

//     if (!profil || !authorizedProfil.includes(profil.libelle)) {
//       return res
//         .status(403)
//         .json({ message: "Accès refusé" });
//     }
//     next();
//   };
// };

module.exports = { verifToken, verifProfil };
