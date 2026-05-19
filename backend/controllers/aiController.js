const axios = require("axios");

/**
 * @route   POST /api/ai/analyze
 * @desc    Analyze a complaint using OpenRouter AI API
 * @access  Protected
 *
 * Returns: priority, department, summary, responseMessage
 */
const analyzeComplaint = async (req, res) => {
  const { title, description, category, location } = req.body;

  // Validate required fields
  if (!title || !description || !category || !location) {
    return res.status(400).json({
      success: false,
      message: "title, description, category, and location are required for AI analysis",
    });
  }

  // Build the AI prompt
  const prompt = `You are an AI assistant for a civic complaint management system.
Analyze the following civic complaint and return ONLY a valid JSON object (no markdown, no extra text).

Complaint Details:
- Title: ${title}
- Description: ${description}
- Category: ${category}
- Location: ${location}

Tasks:
1. Detect the urgency level (Low / Medium / High) based on the complaint severity.
2. Suggest the responsible government department (Water / Electricity / Sanitation / Road / General).
3. Summarize the complaint in 1-2 sentences.
4. Generate a polite, professional acknowledgment message for the complainant.

Return ONLY this JSON format:
{
  "priority": "Low | Medium | High",
  "department": "Water | Electricity | Sanitation | Road | General",
  "summary": "brief summary of the complaint",
  "responseMessage": "polite auto-generated response to the user"
}`;

  // Use model from env or fallback
  const model = process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
          "X-Title": "AI Complaint Management System",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Extract AI response content
    const rawContent = response.data.choices[0]?.message?.content;

    if (!rawContent) {
      return res.status(502).json({
        success: false,
        message: "AI returned an empty response. Please try again.",
      });
    }

    // Parse JSON from AI response (strip any markdown code blocks if present)
    let analysisResult;
    try {
      const cleanedContent = rawContent
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      analysisResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("AI JSON Parse Error:", parseError.message);
      console.error("Raw AI Response:", rawContent);
      return res.status(502).json({
        success: false,
        message: "AI returned invalid JSON. Please try again.",
        rawResponse: rawContent,
      });
    }

    // Validate required fields in AI response
    const requiredFields = ["priority", "department", "summary", "responseMessage"];
    const missingFields = requiredFields.filter((f) => !analysisResult[f]);
    if (missingFields.length > 0) {
      return res.status(502).json({
        success: false,
        message: `AI response missing fields: ${missingFields.join(", ")}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "AI analysis completed successfully",
      data: {
        priority: analysisResult.priority,
        department: analysisResult.department,
        summary: analysisResult.summary,
        responseMessage: analysisResult.responseMessage,
        model: model,
      },
    });
  } catch (error) {
    // Handle OpenRouter API errors specifically
    if (error.response) {
      const status = error.response.status;
      const apiMessage = error.response.data?.error?.message || "OpenRouter API error";

      if (status === 401) {
        return res.status(401).json({
          success: false,
          message: "Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY in .env",
        });
      }
      if (status === 429) {
        return res.status(429).json({
          success: false,
          message: "AI rate limit exceeded. Please try again later.",
        });
      }
      return res.status(status).json({
        success: false,
        message: `OpenRouter API error: ${apiMessage}`,
      });
    }

    // Network/timeout errors
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message: "AI request timed out. Please try again.",
      });
    }

    console.error("AI Analysis Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during AI analysis",
    });
  }
};

module.exports = { analyzeComplaint };
