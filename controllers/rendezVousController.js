exports.getAllRendezVous = async (req, res) => {
    try {
        RendezVous.find()
        .lean()
        .populate("mecanicien_id")
        .populate("service_id")
        .populate("client_id")
        .then((rendezvous) => {
            console.log(rendezvous);
            res.json(rendezvous);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};