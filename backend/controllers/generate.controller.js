import Notes from "../models/notes.model.js";
import UserModel from "../models/user.model.js";
import { generateGeminiResponse } from "../services/gemini.service.js";
import { buildPrompt } from "../utils/PromtBuilder.js";

export const generateNotes = async (req, res) => {
  try {
    const {
      topic,
      classLevel,
      examType,
      revisionMode = false,
      includeDiagram = false,
      includeChart = false,
    } = req.body;
    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (user.creadits > 10) {
      user.isCreaditAvailable = false;
      await user.save();
      return res.status(403).json({ message: "Insufficient credits" });
    }

    const prompt = buildPrompt({
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
    });
    const aiResponse = await generateGeminiResponse(prompt);

    const notes = await Notes.create({
      user: user._id,
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
      content: aiResponse,
    });

    user.credits -= 10;
    if (user.creats <= 0) user.isCreaditAvailable = false;

    if (!Array.isArray(user.notes)) {
      user.notes = [];
    }

    user.notes.push(notes._id);

    await user.save();

    return res.status(200).json({
      data: aiResponse,
      noteId: notes.id,
      creditsLeft: user.credits,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ eorro: "AI generation failed", message: error.message });
  }
};
