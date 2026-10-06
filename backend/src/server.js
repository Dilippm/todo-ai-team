require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGODB_URI (or MONGO_URI) must be configured');
  process.exit(1);
}
mongoose.connect(mongoUri).then(() => {
  app.listen(port, () => console.log(`Todo API listening on port ${port}`));
}).catch((error) => {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
});
