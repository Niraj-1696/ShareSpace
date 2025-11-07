require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./server/models/usermodel");

async function checkAdmins() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // Find admin users
    const admins = await User.find({ role: "admin" });
    console.log(`📊 Found ${admins.length} admin users:`);

    if (admins.length > 0) {
      admins.forEach((admin, index) => {
        console.log(
          `${index + 1}. Name: ${admin.name}, Email: ${admin.email}, Role: ${
            admin.role
          }`
        );
      });
    } else {
      console.log(
        "❌ No admin users found! You need to create an admin user first."
      );
      console.log("\nTo create an admin user:");
      console.log("1. Register a normal user");
      console.log('2. Manually update the role in the database to "admin"');
      console.log("3. Or create an admin user via API/script");
    }

    // Find all users
    const allUsers = await User.find().select("name email role");
    console.log(`\n📊 All users (${allUsers.length}):`);
    allUsers.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`
      );
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

checkAdmins();
