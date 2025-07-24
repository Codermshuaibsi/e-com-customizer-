const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ DB Connected Successfully");
  } catch (error) {
    console.error("❌ DB CONNECTION ERROR:", error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;
