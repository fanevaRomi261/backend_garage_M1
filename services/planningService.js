const RendezVous = require("../models/RendezVous");
const Utilisateur = require("../models/Utilisateur");
const Service = require("../models/Service");

const getRendezVousByDate = async (date) => {
  if (!date || isNaN(Date.parse(date))) {
    throw new Error("Invalid or missing date format");
  }
  const parsedDate = new Date(date);
  return await RendezVous.find({ date_rdv: parsedDate })
    .lean()
    .populate("mecanicien_id")
    .populate("service_id")
    .populate("client_id");
};

const getAllMecanicien = async () => {
  const allUtilisateur = await Utilisateur.find().populate("profil_id");
  const mecaniciens = allUtilisateur.filter(
    (meca) => meca.profil_id.libelle === "Mécanicien"
  );
  return mecaniciens;
};

const convertTimeToMin = (time) => {
    const sumMinutes = time.hours * 60 + time.minutes;
    return sumMinutes;
};

const convertMinToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
  
    return {
      hours: hours,
      minutes: remainingMinutes
    };
}

const convertRendezVousEnIntervalle = (rendezVous) => {
    const heureRendezVous = convertTimeToMin(rendezVous.heure_rdv);
    const dureeRendezVous = convertTimeToMin(rendezVous.service_id.duree) + heureRendezVous;
    return [heureRendezVous, dureeRendezVous];
};


const getAllRendezVousMecanicienByDate = async (date) => {
    try {
        const allRendezVous = await RendezVous.find({ date_rdv: date , etat : {$gte : 5} }).populate('mecanicien_id').populate('service_id');
        const allMecanicien = await getAllMecanicien();
        const allMecanicienAvecRdv = [];
        
        for(const meca of allMecanicien){
            const mecanicienAvecRdv = {
                mecanicien: meca,
                rendez_vous: []
            }

            for(const rendezVous of allRendezVous){
                if(rendezVous?.mecanicien_id._id.toString() === meca._id.toString()){
                    mecanicienAvecRdv.rendez_vous.push(convertRendezVousEnIntervalle(rendezVous));
                }
            }

            allMecanicienAvecRdv.push(mecanicienAvecRdv);
        }
        return allMecanicienAvecRdv;
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous :", error);
        throw error;
    }
};

const getRendezVousSansModification = async (date,id_rendezvous) => {
    try {
        const allRendezVous = await RendezVous.find(
            { date_rdv: date , _id : { $ne: id_rendezvous } , etat : {$gte : 5} }
        )
        .populate('mecanicien_id')
        .populate('service_id');
        const allMecanicien = await getAllMecanicien();
        const allMecanicienAvecRdv = [];
        
        for(const meca of allMecanicien){
            const mecanicienAvecRdv = {
                mecanicien: meca,
                rendez_vous: []
            }

            for(const rendezVous of allRendezVous){
                if(rendezVous?.mecanicien_id._id.toString() === meca._id.toString()){
                    mecanicienAvecRdv.rendez_vous.push(convertRendezVousEnIntervalle(rendezVous));
                }
            }

            allMecanicienAvecRdv.push(mecanicienAvecRdv);
        }
        return allMecanicienAvecRdv;
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous :", error);
        throw error;
    }
};

const getChargeQuotidienneMecanicien = async(date) =>{
    try {
        const allRendezVous = await RendezVous.find({ date_rdv: date }).populate('mecanicien_id').populate('service_id');
        const allMecanicien = await getAllMecanicien();
        const allMecanicienAvecRdv = [];
        
        for(const meca of allMecanicien){
            const mecanicienAvecRdv = {
                mecanicien: meca,
                charge: 0
            }

            for(const rendezVous of allRendezVous){
                if(rendezVous.mecanicien_id._id.toString() === meca._id.toString()){
                    mecanicienAvecRdv.charge  = convertTimeToMin(rendezVous.service_id.duree) + mecanicienAvecRdv.charge;
                }
            }

            allMecanicienAvecRdv.push(mecanicienAvecRdv);
        }
        return allMecanicienAvecRdv;
    } catch (error) {
        console.error("Erreur lors de la récupération des charges : ", error);
        throw error;
    }
}


const findCreneauLibreMecanicien = (mecanicienAvecRdv) => {
    const heureDebutMatin = 480; // 8h
    const heureFinMatin = 720; // 12h
    const heureDebutAprem = 840; // 14h
    const heureFinAprem = 1080; // 18h 

    let creneauxLibres = [];

    const rendezVousTries = mecanicienAvecRdv.rendez_vous.sort((a, b) => a[0] - b[0]);

    // verifie si il n'a pas de rendez vous toute la journée
    if (rendezVousTries.length == 0) {
        creneauxLibres.push([heureDebutMatin, heureFinMatin]);
        creneauxLibres.push([heureDebutAprem, heureFinAprem]);
        return creneauxLibres;
    }

    // Vérifie le créneau libre avant le premier rendez-vous du matin et l'heure de début
    if (rendezVousTries.length > 0 && rendezVousTries[0][0] > heureDebutMatin) {
        creneauxLibres.push([heureDebutMatin, rendezVousTries[0][0]]);
    }

    // Vérifie les créneaux libres entre les rendez-vous
    for (let i = 0; i < rendezVousTries.length - 1 ; i++) {
        const finRdvActuel = rendezVousTries[i][1];
        const debutRdvSuivant = rendezVousTries[i + 1][0];

        if (debutRdvSuivant > finRdvActuel) {
            if(debutRdvSuivant > heureFinMatin){
                creneauxLibres.push([finRdvActuel, ((heureFinMatin - finRdvActuel) + finRdvActuel) ]);
            }else{
                creneauxLibres.push([finRdvActuel, debutRdvSuivant]);
            }
        }
    }

    // Vérifie le créneau libre après le dernier rendez-vous du matin et la fin de l'heure le matin
    if (rendezVousTries.length > 0 && rendezVousTries[rendezVousTries.length - 1][1] < heureFinMatin) {
        creneauxLibres.push([rendezVousTries[rendezVousTries.length - 1][1], heureFinMatin]);
    }

    // Verifie si il est libre toute l'aprem
    if(rendezVousTries[rendezVousTries.length - 1][1] < heureDebutAprem){
        creneauxLibres.push([heureDebutAprem,heureFinAprem]);
    }

    // Vérifier les créneaux libres entre 14h et 18h (après-midi)
     for (let i = 0; i < rendezVousTries.length; i++) {
        const rdv = rendezVousTries[i];
        if (rdv[0] > heureDebutAprem && rdv[0] < heureFinAprem) {
            if (i === 0 || rendezVousTries[i - 1][1] < rdv[0]) {
                // Ajouter l'espace entre 14h et le début du premier rendez-vous
                creneauxLibres.push([heureDebutAprem, rdv[0]]);
            }
            if (i === rendezVousTries.length - 1 || rdv[1] < rendezVousTries[i + 1][0]) {
                // Ajouter l'espace entre la fin du rendez-vous et 18h
                creneauxLibres.push([rdv[1], heureFinAprem]);
            }
        }
    }

    return creneauxLibres;
};

// creneau possible pour chaque mecanicien pour réaliser un service
const creneauPossibleAvecMecanicien = async (service_id,date) =>{
    const allRendezVousMecanicien = await getAllRendezVousMecanicienByDate(date);
    
    const service = await Service.findOne({_id: service_id});
    let dureeService = (convertTimeToMin(service.duree));

    const toutCreneauPossible = [];

    for(let i = 0 ; i < allRendezVousMecanicien.length ; i++){

        const creneauPossible = {
            mecanicien: allRendezVousMecanicien[i].mecanicien,
            creneau: []
        }

        const creneauLibreDuMeca = findCreneauLibreMecanicien(allRendezVousMecanicien[i]);
        

        // prend les créneaux possibles par rapport aux service
        for(let j=0 ; j < creneauLibreDuMeca.length ; j++){
            let heureDepart = creneauLibreDuMeca[j][0];
            let heureFin = creneauLibreDuMeca[j][1];
            console.log("heureDepart : "  + heureDepart);
            console.log("heureFin : " + heureFin);

            while( heureDepart + dureeService <= heureFin ){
                const heurePossible = [heureDepart , (heureDepart+dureeService)];

                console.log("heurePossible : [" + heureDepart + "," + heureFin + "]" );
                creneauPossible.creneau.push(heurePossible);
                heureDepart = heureDepart+dureeService;
            }
        }
        
        toutCreneauPossible.push(creneauPossible);
    }

    return toutCreneauPossible;
}

const creneauLibreAvecMecanicien = async(date,id_rendezvous) =>{
    const allRendezVousMeca = await getRendezVousSansModification(date,id_rendezvous);

    const toutCreneauPossible = [];

    for(let i = 0 ; i < allRendezVousMeca.length ; i++){
        const creneauPossible = {
            mecanicien: allRendezVousMeca[i].mecanicien,
            creneau: []
        }
        const creneauLibre = await findCreneauLibreMecanicien(allRendezVousMeca[i]);
        creneauPossible.creneau = creneauLibre;
        toutCreneauPossible.push(creneauPossible);
    }

    return toutCreneauPossible;
}


const trierCreneauPossibleJour = async(date_rdv,service_id) =>{
   
    const toutCreneauPossible = await creneauPossibleAvecMecanicien(service_id, date_rdv);
    console.log("tout creneau possible avec meca : " + toutCreneauPossible);

    const creneauxUniq = [];

    toutCreneauPossible.forEach(mecanicien => {    
        mecanicien.creneau.forEach(cr => {
   
            const isAlreadyInserted = creneauxUniq.some(existingCreneau => 
                existingCreneau[0] === cr[0] && existingCreneau[1] === cr[1]
            );

            if (!isAlreadyInserted) {
                creneauxUniq.push(cr);
            }
        });
    });

    creneauxUniq.sort((a, b) => a[0] - b[0]);

    for(let i = 0;i < creneauxUniq.length ; i++){
        creneauxUniq[i][0] = convertMinToTime(creneauxUniq[i][0]);
        creneauxUniq[i][1] = convertMinToTime(creneauxUniq[i][1]);
    }
    
    return creneauxUniq;
}


const propositionMecanicienMoinsDeCharge = async (toutCreneau , creneauChoisi , date)=>{
    try {
        const chargeMecaniciens = await getChargeQuotidienneMecanicien(date);
        
        if (!Array.isArray(creneauChoisi) || creneauChoisi.length !== 2) {
            throw new Error("creneauChoisi est invalide.");
        }
      
          const creneauFiltrer = toutCreneau.filter((creneauPossible) => {
            if (creneauPossible.creneau && Array.isArray(creneauPossible.creneau)) {
              return creneauPossible.creneau.some((cren) => {
                if (Array.isArray(cren) && cren.length === 2) {
                    const debutPossible = cren[0];
                    const finPossible = cren[1];

                    return creneauChoisi[0] >= debutPossible && creneauChoisi[1] <= finPossible;
                }
                return false;
              });
            }
            return false;
        });

        console.log(`filter : ` + creneauFiltrer);
      
        let mecanicienMoinsCharge = null;
        let chargeMinimale = Infinity;

        const mecaniciensDisponibles = creneauFiltrer.map(
            (creneau) => creneau.mecanicien
        );

        chargeMecaniciens.forEach((mecanicienAvecCharge) => {
            mecaniciensDisponibles.forEach(mecaDisponible => {
                if (mecanicienAvecCharge.mecanicien._id.toString() === mecaDisponible._id.toString()) {
                if (mecanicienAvecCharge.charge < chargeMinimale) {
                    chargeMinimale = mecanicienAvecCharge.charge;
                    mecanicienMoinsCharge = mecanicienAvecCharge.mecanicien;
                    console.log(mecanicienAvecCharge.mecanicien);
                }
                }
            });
        });

        return mecanicienMoinsCharge;


    } catch (error) {
        console.error("Erreur dans propositionMecanicienMoinsDeCharge :", error);
        throw error;
    }   
}


const propositionMecanicienPourService = async(toutCreneau , creneauChoisi , date) => {
    try {
        
        if (!Array.isArray(creneauChoisi) || creneauChoisi.length !== 2) {
            throw new Error("creneauChoisi est invalide.");
        }
      
        const creneauFiltrer = toutCreneau.filter((creneauPossible) => {
            if (creneauPossible.creneau && Array.isArray(creneauPossible.creneau)) {
                return creneauPossible.creneau.some((cren) => {
                    if (Array.isArray(cren) && cren.length === 2) {
                        const debutPossible = cren[0];
                        const finPossible = cren[1];

                        return creneauChoisi[0] >= debutPossible && creneauChoisi[1] <= finPossible;
                    }
                    return false;
                });
            }
            return false;
        });

        const mecaniciensDisponibles = creneauFiltrer.map(
            (creneau) => creneau.mecanicien
        );

        return mecaniciensDisponibles;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getRendezVousByDate,
    getAllMecanicien,
    convertMinToTime,
    convertTimeToMin,
    convertRendezVousEnIntervalle,
    getAllRendezVousMecanicienByDate,
    getChargeQuotidienneMecanicien,
    findCreneauLibreMecanicien,
    creneauPossibleAvecMecanicien,
    trierCreneauPossibleJour,
    propositionMecanicienMoinsDeCharge,
    propositionMecanicienPourService,
    creneauLibreAvecMecanicien,
    getRendezVousSansModification
}