import jwt from "jsonwebtoken";

export const getToken = async (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log(error)
    // return res.status(500).json({ message: `Token Generation Error ${error}` })
  }
};
