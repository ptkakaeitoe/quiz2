export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt provided." });
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`, // Securely use the API key
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: prompt },
            ],
            max_tokens: 150,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("OpenAI API Error:", errorDetails);
        return res.status(response.status).json({
          error: errorDetails.error?.message || "Unknown error from OpenAI API",
        });
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error in handler:", error.message);
      res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed. Use POST instead." });
  }
}
