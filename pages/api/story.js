// pages/api/story.js
// This runs on the SERVER (Vercel), so the API key is never exposed to the browser.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { dob } = req.body;
  if (!dob) return res.status(400).json({ error: "Missing date of birth" });

  // Format date
  const date = new Date(dob + "T12:00:00");
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const year = date.getFullYear();
  let gen = "Generation Z";
  if (year < 1946) gen = "The Silent Generation";
  else if (year < 1965) gen = "Baby Boomer";
  else if (year < 1981) gen = "Generation X";
  else if (year < 1997) gen = "Millennial";
  else if (year < 2013) gen = "Generation Z";
  else gen = "Generation Alpha";

  const prompt = `You are a cinematic storyteller writing an emotional, poetic narrative for someone born on ${formatted}.

Write a rich, immersive narrative in second person ("You arrived...", "The world was...") that includes:
1. What the world felt like on the exact day they were born — historical atmosphere, cultural mood, global events of that era
2. The generational identity of a ${gen} — what defined their era, what shaped them
3. A poetic reflection on how the world has transformed since their birth
4. End at an emotional peak — stop mid-revelation with "There is so much more to your story"

RULES:
- No bullet points or lists whatsoever
- Pure flowing prose, 4 rich paragraphs
- Tone: cinematic, warm, slightly mystical, deeply personal
- ~280 words
- No death, mortality, or negative themes
- Make it feel like the most beautiful thing they've ever read about themselves`;

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.json();
      console.error("Anthropic error:", err);
      return res.status(500).json({ error: err?.error?.message || "AI error" });
    }

    const data = await anthropicRes.json();
    const text = (data?.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("")
      .trim();

    return res.status(200).json({ story: text, generation: gen });
  } catch (e) {
    console.error("Server error:", e);
    return res.status(500).json({ error: e.message });
  }
}
