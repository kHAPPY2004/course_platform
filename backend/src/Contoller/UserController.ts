import prisma from "../DB/db.config";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";

dotenv.config();

interface RequestBody {
  name: string;
  email: string;
  // password: string;
  // phoneNumber: string;
}

export const createUser = async (
  req: {
    body: RequestBody;
  },
  res: { status: (code: number) => any; json: (data: any) => any }
) => {
  try {
    const { name, email } = req.body;
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (findUser) {
      console.log("User found");
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Explicitly cast the data object to UserCreateInput
    // const encryptedPassword = CryptoJS.AES.encrypt(
    //   password,
    //   process.env.CRYPTO_SECRET || ""
    // ).toString();
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        // password: encryptedPassword,
        // phoneNumber,
      },
    });

    return res
      .status(200)
      .json({ data: newUser, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
