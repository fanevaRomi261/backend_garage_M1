const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
  hours: {
    type: Number,
    required: true,
    min: 0
  },
  minutes: {
    type: Number,
    required: true,
    min: 0,
    max: 59 
  }
});

const Time = mongoose.model('Time', timeSchema);

module.exports = Time;

// #### modele d'utilisation #### //
// const time = new Time({ hours: 14, minutes: 30 }); // 14:30
// time.save()
//   .then(savedTime => console.log('Heure enregistrée :', savedTime))
//   .catch(err => console.error('Erreur :', err));
