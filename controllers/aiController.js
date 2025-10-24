import fs from "fs";
import sharp from "sharp";
import ExifReader from "exifreader";
import OpenAI from "openai";
import sql from "../configs/db.js";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const detailsExtractor = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file uploaded" });
        }

        const imagePath = req.file.path;

        // Extract metadata
        const metadata = await sharp(imagePath).metadata();
        const buffer = fs.readFileSync(imagePath);
        let exif = {};
        try {
            exif = ExifReader.load(buffer);
        } catch {
            exif = {};
        }

        // Dominant color
        let dominantColor = { r: null, g: null, b: null };
        try {
            const { dominant } = await sharp(imagePath).stats();
            dominantColor = dominant;
        } catch { }

        const extractedDetails = {
            file_name: req.file.originalname,
            format: metadata.format || "Unknown",
            width: metadata.width || 0,
            height: metadata.height || 0,
            bit_depth: metadata.depth || "Unknown",
            color_space: metadata.space || "Unknown",
            compression: exif["Compression"]?.description || "Unknown",
            resolution_unit: exif["ResolutionUnit"]?.description || "Pixels/Inch",
            horizontal_resolution: exif["XResolution"]?.description || "Unknown",
            vertical_resolution: exif["YResolution"]?.description || "Unknown",
            dominant_r: dominantColor.r,
            dominant_g: dominantColor.g,
            dominant_b: dominantColor.b,
            has_alpha: metadata.hasAlpha ? 1 : 0,
            density: metadata.density || "Unknown"
        };

        // Optional: Gemini summary
        let aiSummary = "No summary generated.";
        try {
            const prompt = `
        Given this image metadata: ${JSON.stringify(extractedDetails, null, 2)},
        summarize in 3 sentences describing color type, resolution, and quality.
      `;

            const aiResponse = await AI.responses.create({
                model: "gemini-1.5-flash",
                input: [{ role: "user", content: prompt }]
            });

            aiSummary =
                aiResponse.output?.[0]?.content?.[0]?.text || "No summary generated.";
        } catch (err) {
            console.warn("Gemini summary skipped:", err.message);
        }

        // Save to database
        await sql`
  INSERT INTO image_metadata (
    file_name, format, width, height, bit_depth, color_space, compression,
    resolution_unit, horizontal_resolution, vertical_resolution,
    dominant_r, dominant_g, dominant_b, has_alpha, density, ai_summary
  ) VALUES (
    ${req.file.originalname},
    ${extractedDetails.format},
    ${extractedDetails.width},
    ${extractedDetails.height},
    ${extractedDetails.bitDepth},
    ${extractedDetails.space},
    ${extractedDetails.compression},
    ${extractedDetails.resolutionUnit},
    ${extractedDetails.horizontalResolution},
    ${extractedDetails.verticalResolution},
    ${extractedDetails.dominantRGB?.R},
    ${extractedDetails.dominantRGB?.G},
    ${extractedDetails.dominantRGB?.B},
    ${extractedDetails.hasAlpha},
    ${extractedDetails.density},
    ${aiSummary}
  );
`;


        res.json({
            success: true,
            metadata: extractedDetails,
            summary: aiSummary,
            message: "Image details extracted and saved successfully."
        });

        fs.unlinkSync(imagePath);
    } catch (error) {
        console.error("❌ Error in detailsExtractor:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message,
            stack: error.stack
        });
    }
};
