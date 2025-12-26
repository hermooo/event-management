import dbConnect from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";
import { Admin } from "@/models";

const seedAdmin = async () => {
  await dbConnect();

  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "Please provide ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in the environment variables"
    );
  }

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    console.log("✅ Admin already exists");
    process.exit(0);
  }

  const hashedPassword = await hashPassword(password);

  await Admin.create({ name, email, password: hashedPassword });
  console.log("✅ Admin created successfully");
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error("❌ Error seeding admin:", error);
  process.exit(1);
});
