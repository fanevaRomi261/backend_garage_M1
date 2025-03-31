const RendezVous = require("../models/RendezVous");

const verifierReparationPrecedente = async (mecanicienId, rendezVousId) => {
    try {
      const rendezVous = await RendezVous.find({
        mecanicien_id: mecanicienId,
        etat: 15, 
      })
        .sort({ date_rdv: 1, heure_rdv: 1 }) 
        .limit(1); 
      
      return rendezVous.length > 0;
      
    } catch (error) {
      console.error('Erreur lors de la vérification de la réparation précédente :', error);
      return false; 
    }
};


module.exports ={
    verifierReparationPrecedente
};