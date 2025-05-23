const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log(err));

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/planning", require("./routes/planningRoute"));
app.use("/service" , require("./routes/serviceRoute"));
app.use("/profil", require("./routes/profilRoutes"));
app.use("/vehicule", require("./routes/vehiculeRoutes"));
app.use("/typeVehicule", require("./routes/typeVehiculeRoutes"));
app.use("/stock", require("./routes/stockRoutes"));
app.use("/utilisateur", require("./routes/utilisateurRoutes"));
app.use("/piece", require("./routes/pieceRoutes"));
app.use("/reparation", require("./routes/reparationRoutes"));
app.use("/rendezvous", require("./routes/rendezvousRoute"));
app.use("/dashboard-manager", require("./routes/dashboardManagerRoutes"));

app.listen(PORT, () =>
  console.log(`Serveur démarré sur port : ${PORT}`)
);
