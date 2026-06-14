
import express from "express"
import { generateNotes } from "../controllers/generate.controller.js"
import isAuth from "../middleware/isAuth.js"
import { pdfDownload } from "../controllers/pdf.controller.js"
    



const pdfRouter = express.Router()

pdfRouter.post("/generate-pdf",isAuth,pdfDownload)

export default pdfRouter



