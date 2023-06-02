

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/auth', {
  useNewUrlParser: true,
   useUnifiedTopology: true,
   
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });



  mongoose.connection.on('connected', () =>{

    console.log('mongoose connected to database')
  })

  mongoose.connection.on('error', (error)=>{
    console.log(error.message)
  })

  mongoose.connection.on('disconnected', ()=>{
    console.log('mongoose  is disconn')
  })


  process.on('SIGINT', async () =>{
    await mongoose.connection.close(),
    process.exit(0)
  })