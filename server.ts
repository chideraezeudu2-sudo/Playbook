import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("GEMINI_API_KEY is not defined in environment properties. Falling back to synthetic mock generation.");
}

// Helper to handle client Gemini generation safely with real/synthesized fallbacks
async function generateWithGemini(prompt: string, schema: any, systemInstruction?: string) {
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are an expert marketing strategist and copywriter.",
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.7,
        },
      });
      if (response && response.text) {
        return JSON.parse(response.text.trim());
      }
    } catch (error) {
      console.error("Gemini Generation Error, fallback to synthetic data:", error);
    }
  }
  return null;
}

// --- API Endpoints ---

// 1. Lead Magnet Builder
app.post("/api/generate/lead-magnet", async (req, res) => {
  const { niche, audience, offer } = req.body;
  if (!niche || !audience || !offer) {
    return res.status(400).json({ error: "Missing required onboarding fields: niche, audience, offer" });
  }

  const prompt = `Create a high-converting Brunson-style lead magnet page details for our SaaS:
  - Niche: ${niche}
  - Target Audience: ${audience}
  - Our Core Offer: ${offer}
  
  Provide an attractive title for the free lead magnet (e.g. Free Toolkit, Masterclass, Workbook, Guide), a compelling headline, 3 high-impact benefit bullet points, and a persuasive call to action (CTA) button text.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Actionable, enticing title for the lead magnet" },
      headline: { type: Type.STRING, description: "A hook-based headline that promises to solve their biggest problem" },
      bullets: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 bullet points focusing on value representation"
      },
      cta: { type: Type.STRING, description: "High-contrast action oriented button text" }
    },
    required: ["title", "headline", "bullets", "cta"]
  };

  const systemInstruction = "You are Russell Brunson. Think step-by-step to design irresistible lead magnets that trigger instant opt-ins.";

  const result = await generateWithGemini(prompt, schema, systemInstruction);
  if (result) {
    return res.json(result);
  }

  // High-quality synthetic fallback
  return res.json({
    title: `The Ultimate ${niche || "Professional"} Lead Generation Blueprint`,
    headline: `How to Attract Hungry ${audience || "Ideal Customers"} and Convert Them to Your ${offer || "Core Offer"} in 7 Days (Without Cold Messaging)`,
    bullets: [
      "The exact copy-and-paste hook template designed specifically for your target audience.",
      "A step-by-step checklist to set up your primary marketing loop in less than an hour.",
      "The secret 'value-first' sequence that positions you as the ultimate answer to their primary problem."
    ],
    cta: `Download My Free ${niche || "Business"} Blueprint Now`
  });
});

// 2. Dream 100 Partner finder and outreach templates
app.post("/api/generate/dream-100", async (req, res) => {
  const { niche, audience, offer, count, platform } = req.body;
  const targetCount = count ? parseInt(count) : 10;
  
  const prompt = `Identify ${Math.min(targetCount, 8)} real-world or realistic prominent influencers, YouTubers, newsletter hosts, or podcasters in the niche: "${niche}".
  We want to pitch them a partnership to share our lead magnet.
  Our Audience: ${audience}
  Our Offer: ${offer}
  Platform Filter: ${platform || "Both"} (YouTube / Podcast)
  
  Provide a list of partners with:
  1. A recognizable or realistic channel/show name
  2. The platform (YouTube or Podcast)
  3. A realistic simulated directory link (e.g., youtube.com/c/name)
  4. A professional simulated email contact (representing hunter.io scrapers)
  5. A hyper-personalized, value-led outreach email message using Alex Hormozi's Warm Outreach Playbook (focusing on what's in it for them and low friction)`;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        partnerName: { type: Type.STRING },
        platform: { type: Type.STRING },
        link: { type: Type.STRING },
        contact: { type: Type.STRING },
        message: { type: Type.STRING }
      },
      required: ["partnerName", "platform", "link", "contact", "message"]
    }
  };

  const systemInstruction = "You are Alex Hormozi. Write short, punchy outreach pitches that are extremely easy to say yes to, focusing on dynamic value exchanges and zero fluff.";

  let partners = await generateWithGemini(prompt, schema, systemInstruction);

  // If no API or failed, use synthetic high-quality generation
  if (!partners || !Array.isArray(partners)) {
    const fallbackNiche = niche || "Business";
    partners = [
      {
        partnerName: `${fallbackNiche} Growth Labs`,
        platform: "YouTube",
        link: `https://youtube.com/c/${fallbackNiche.toLowerCase().replace(/\s+/g, '')}growth`,
        contact: `collabs@${fallbackNiche.toLowerCase().replace(/\s+/g, '')}growthlabs.com`,
        message: `Hey! Love your recent breakdown on market trends. I made a free checklist for ${audience || "your followers"} solving their biggest hurdle. No pitch, just pure value they can use today. Happy to send it over if you want to share it with your community? Let me know - appreciate your work!`
      },
      {
        partnerName: `The ${fallbackNiche} Hustle Podcast`,
        platform: "Podcast",
        link: `https://podcasts.apple.com/us/podcast/the-${fallbackNiche.toLowerCase().replace(/\s+/g, '')}-hustle`,
        contact: `booking@${fallbackNiche.toLowerCase().replace(/\s+/g, '')}hustle.fm`,
        message: `Quick fan note - your session on scaling operations was golden. I actually created a workbook explicitly mapping out a solution for ${audience || "our target users"}. Id love to gift copies to your listeners completely for free (no strings attached). Let me know if you are open to a quick look? Cheers!`
      },
      {
        partnerName: `Alex Media Creator`,
        platform: "YouTube",
        link: `https://youtube.com/c/alexmediacreates`,
        contact: `alex@alexmediacreates.co`,
        message: `Hey Alex, your latest tutorial saved my team about 4 hours this week. Since we serve similar crowds, I have a value pack called 'The ${offer || "Secret Playbook"}' that is completely free. Mind if I send you the link? You can give it to your premium subscribers as a bonus.`
      },
      {
        partnerName: `The Daily Niche Digest`,
        platform: "Podcast",
        link: `https://spotify.com/show/dailynichedigest`,
        contact: `partner@dailynichedigest.net`,
        message: `Hey team! Your podcast has been my go-to listen for the past 6 months. I drafted an exclusive lead generator for ${audience || "our sector"}. I'd love to write a free guest segment or resource pack customized for your listeners. Quick yes or no if you'd like to see it? Thanks!`
      }
    ];
  }

  // If the user requested more partners (slider up to 100 on Pro, or 20 on Basic),
  // we intelligently populate additional realistic items to match their requested count!
  const finalPartnersList = [...partners];
  const desiredCount = Math.min(targetCount, 100);
  
  while (finalPartnersList.length < desiredCount) {
    const basePartner = partners[finalPartnersList.length % partners.length];
    const index = finalPartnersList.length + 1;
    const nameModifier = ["Network", "Insights", "Daily", "Mastery", "HQ", "Chronicles", "Coaching", "Insider", "Collective"][index % 9];
    const partnerName = `${niche || "SaaS"} ${nameModifier} #${Math.floor(index / 2) + 1}`;
    const cleanNicheName = (niche || "niche").toLowerCase().replace(/[^a-z0-9]/g, '');
    
    finalPartnersList.push({
      partnerName,
      platform: index % 2 === 0 ? "YouTube" : "Podcast",
      link: index % 2 === 0 ? `https://youtube.com/user/${cleanNicheName}${index}` : `https://spotify.com/show/${cleanNicheName}${index}`,
      contact: `contact${index}@${cleanNicheName}${nameModifier.toLowerCase()}.com`,
      message: basePartner.message.replace(basePartner.partnerName, partnerName)
    });
  }

  return res.json({ partners: finalPartnersList });
});

// 3. Email Sequence Generator (Gary Vee style)
app.post("/api/generate/email-sequence", async (req, res) => {
  const { niche, offer, hookOffer } = req.body;
  
  if (!niche || !offer || !hookOffer) {
    return res.status(400).json({ error: "Missing onboarding fields: niche, offer, hookOffer" });
  }

  const prompt = `Write a high-converting 4-email sequence designed to nurture leads in the "${niche}" niche.
  The emails should follow GaryVee's "Jab, Jab, Jab, Right Hook" model — 3 emails packed with extreme actionable value, and 1 soft pitch.
  - Core Offer: ${offer}
  - Hook Offer (what we pitch in Email 4): ${hookOffer}
  
  Generate subjects and bodies for:
  - Email 1 (Jab 1): A quick wins value email sharing a powerful framework or mindset shift.
  - Email 2 (Jab 2): A value-first story, case study, or relatable scenario proving the strategy works.
  - Email 3 (Jab 3): A deep educational tip, checklist, or resource that makes them feel smart and equipped.
  - Email 4 (Hook): A smooth strategic alignment presenting "${hookOffer}" as the natural premium next step. Keep the tone friendly, authoritative, and direct.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      email1: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          body: { type: Type.STRING }
        },
        required: ["subject", "body"]
      },
      email2: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          body: { type: Type.STRING }
        },
        required: ["subject", "body"]
      },
      email3: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          body: { type: Type.STRING }
        },
        required: ["subject", "body"]
      },
      email4: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          body: { type: Type.STRING }
        },
        required: ["subject", "body"]
      }
    },
    required: ["email1", "email2", "email3", "email4"]
  };

  const systemInstruction = "You are Gary Vaynerchuk. Write in a compelling, real-talk, action-oriented, zero-BS style with maximum customer focus. Show massive empathy before asking for a single click.";

  const result = await generateWithGemini(prompt, schema, systemInstruction);
  if (result) {
    return res.json(result);
  }

  // Pre-formatted synthetic fallback if API not accessible
  return res.json({
    email1: {
      subject: `Stop wasting hours on ${niche || "your marketing"} (Do this instead)`,
      body: `Hey,\n\nMost people in the ${niche || "industry"} fail because they overcomplicate. They try to do 100 things at once.\n\nHere is a 1-step mental shift that will save you 10 hours this week: Focus on your ONE core lead magnet. Instead of hunting down customers, build one asset that does the talking for you.\n\nTry this: pick your absolute best insight. Summarize it in 3 bullet points. That's your lead magnet.\n\nTalk soon,\nYour SaaS Assistant`
    },
    email2: {
      subject: `How we took a simple offer to six figures (Case Study)`,
      body: `Hey,\n\nYesterday we talked about simplification. Let me show you how it works in action.\n\nWe had a creator who spent $2k on ads with zero sales for their ${offer || "product"}. They deleted the sales page and replaced it with a simple free workbook explaining their niche.\n\nResult: 240 opt-ins in 72 hours, and 12 high-ticket clients closed from the follow-up.\n\nValue first. Always.\n\nBest,\nYour SaaS Assistant`
    },
    email3: {
      subject: `Your 3-point checklist for perfect ${niche || "niche"} engagement`,
      body: `Hey,\n\nTo make sure you win this week, verify your setup against these 3 golden rules:\n\n1. Is your solution specific? (Generic advice gets ignored)\n2. Are you leveraging organic partnerships to share it?\n3. Is your follow-up sequence friendly and packed with value?\n\nKeep it simple and take action.\n\nCheers,\nYour SaaS Assistant`
    },
    email4: {
      subject: `A quick favor + exclusive access to ${hookOffer || "our best resource"}`,
      body: `Hey,\n\nI hope the frameworks we've gone through have given you complete clarity.\n\nIf you are ready to put this on total autopilot, I have a special opportunity for you. We are opening slots for our brand new ${hookOffer || "Premium Accelerator"}.\n\nIt helps you implement the full system to execute ${offer || "your core offering"} with zero manual strategy.\n\nClick here to claim your spot and get started: [Link]\n\nLet's get after it,\nYour SaaS Assistant`
    }
  });
});

// 4. LinkedIn repurposing (Pro)
app.post("/api/generate/linkedin", async (req, res) => {
  const { niche, offer, emails } = req.body;
  if (!niche || !offer) {
    return res.status(400).json({ error: "Missing onboarding info" });
  }

  const prompt = `Repurpose some educational marketing concepts in the ${niche} niche into 3 high-performance, viral LinkedIn posts.
  If available, use these core message inspirations: ${JSON.stringify(emails || "")}.
  
  Provide 3 fully formatted, scroll-topping LinkedIn posts:
  - Post 1: A powerful listicle style breakdown with a massive hooks-based top sentence, spacing, and a clear instruction to check the comments.
  - Post 2: A personal story/vulnerable opinion piece challenging current industry dogma in ${niche}.
  - Post 3: A practical copy-and-paste action framework that delivers instant utility.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      post1: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          body: { type: Type.STRING },
          commentNote: { type: Type.STRING }
        },
        required: ["hook", "body", "commentNote"]
      },
      post2: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          body: { type: Type.STRING },
          commentNote: { type: Type.STRING }
        },
        required: ["hook", "body", "commentNote"]
      },
      post3: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          body: { type: Type.STRING },
          commentNote: { type: Type.STRING }
        },
        required: ["hook", "body", "commentNote"]
      }
    },
    required: ["post1", "post2", "post3"]
  };

  const systemInstruction = "You are Justin Welsh. Write minimalist, high-impact, clean, highly formatted LinkedIn content designed for maximum organic reach and reading ease.";

  const result = await generateWithGemini(prompt, schema, systemInstruction);
  if (result) {
    return res.json(result);
  }

  // Pre-formatted synthetic fallback if API not accessible
  return res.json({
    post1: {
      hook: `Most people fail at ${niche || "marketing"} because they do this:`,
      body: `They ask for the sale before providing any value.\n\nHere's the Hormozi-proven Warm Outreach Loop:\n\n1. Target the top 100 creators who share your audience.\n2. Draft a personalized, high-value value exchange.\n3. Hand over assets for free (no email list signups needed).\n4. Follow up with 3 helpful jabs, then pitch.\n\nSimple? Yes. Executed? Rarely.`,
      commentNote: "🚨 Grab my free Lead Magnet Builder template in the first comment below!"
    },
    post2: {
      hook: `Unpopular opinion: Stop trying to build a 'niche audience' from scratch.`,
      body: `Instead, tap into communities that already have them.\n\nIt's called the Dream 100 system. Russell Brunson used it to scale ClickFunnels to $100M+ with no VC funding.\n\nFind partners, provide ridiculous value first, and capture the spillover.\n\nWork smarter.`,
      commentNote: "👉 Get the exact checklist we use in the comments below."
    },
    post3: {
      hook: `How to scale your ${offer || "SaaS Offer"} with zero guessing:`,
      body: `Use the proven playbooks from the masters.\n\n- Russell Brunson: The Lead Magnet\n- Alex Hormozi: Warm Outreach\n- Gary Vee: Value-First Nurture\n- Justin Welsh: LinkedIn Repurposing\n- Perry Marshall: 80/20 Scorecard\n- Ryan Deiss: Tripwire Upsell\n\nI built a blueprint that automates this entire stack. No team needed.`,
      commentNote: "👇 Let me know your niche and I'll send you the customized generator link!"
    }
  });
});

// 5. Tripwire Upsell Offer generator (Pro)
app.post("/api/generate/tripwire", async (req, res) => {
  const { offerName, offerPrice, tripwirePrice } = req.body;
  if (!offerName) {
    return res.status(400).json({ error: "Missing offer name" });
  }

  const prompt = `Create a high-converting Tripwire Upsell offer to companion our main product: "${offerName}" which costs $${offerPrice || '97'}.
  The tripwire pricing is targeted at $${tripwirePrice || '17'}.
  
  Generate:
  1. A catchy Tripwire Product Title (needs to feel like an absolute steal)
  2. One-paragraph compelling value description
  3. A punchy order bump headline (e.g. "Wait - Add This For Just $17")
  4. A short bullet list of 3-4 items included in this tripwire.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      orderBumpHeadline: { type: Type.STRING },
      bullets: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["title", "description", "orderBumpHeadline", "bullets"]
  };

  const systemInstruction = "You are Ryan Deiss. Think in terms of high-converting transaction loops. Design low-friction impulse-buy upsells that capture maximum immediate customer value.";

  const result = await generateWithGemini(prompt, schema, systemInstruction);
  if (result) {
    return res.json(result);
  }

  // Pre-formatted synthetic fallback if API not accessible
  const fallbackPrice = tripwirePrice || "17";
  return res.json({
    title: `The Premium ${offerName} Starter Bundle & Asset Pack`,
    description: `Get instant download access to 50+ templates, swipe files, and copy-and-paste assets designed to 10x your progress with ${offerName}. This is a one-time offer built to save you 40 hours of manual labor immediately.`,
    orderBumpHeadline: `Wait! Add This Asset Pack For Just $${fallbackPrice} Now`,
    bullets: [
      "25+ pre-written Hormozi outreach templates for podcasts, YouTube channels, and newsletters.",
      "15 modular landing page designs optimized to match your Russell Brunson lead magnet layout.",
      "A complete walkthrough video showing you how to plug these exact files into your setup in 5 minutes."
    ]
  });
});

// 6. Partner Scorecard suggestions (Pro)
app.post("/api/generate/scorecard-suggestions", async (req, res) => {
  const { topPartners } = req.body;
  if (!topPartners || !Array.isArray(topPartners) || topPartners.length === 0) {
    return res.json({
      suggestions: "Enter leads sent on your scorecard list to identify top performers and unlock strategic partnership recommendations."
    });
  }

  const partnersStr = topPartners.map(p => `${p.partnerName} (${p.leadsSent} leads)`).join(", ");
  const prompt = `Our top-performing Dream 100 partners are: ${partnersStr}.
  
  Give us:
  1. A brief strategic analysis of why these partners are converting so well.
  2. A warm, personalized thank-you Message Template we can send them immediately.
  3. A high-leverage proposal idea (e.g. exclusive coupon/commission split) to deepen the partnership.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      suggestions: { type: Type.STRING, description: "Detailed strategy notes with thank-you templates and proposal details. Include markdown headers or bold text." }
    },
    required: ["suggestions"]
  };

  const systemInstruction = "You are Perry Marshall. Use 80/20 rule analytics to focus energy and resources on top 20% lever points to multiply marketing power.";

  const result = await generateWithGemini(prompt, schema, systemInstruction);
  if (result) {
    return res.json(result);
  }

  // High quality synthetic fallback if API not accessible
  return res.json({
    suggestions: `### 🚀 Perry Marshall's 80/20 Strategic Analysis

Your top performer is **${topPartners[0]?.partnerName || "your top channel"}**. According to the 80/20 Rule, 80% of your total growth will emerge from the top 20% of your partner channels. Double down on these relationships immediately.

### 📝 Personalized Thank-You Message Template

\`\`\`text
Hey ${topPartners[0]?.partnerName || "Friend"},

Just wanted to write a sincere thank you note. The leads coming from your show are highly engaged and loving the resource. 

To say thank you, I'd love to set up an exclusive 50% commission split or design a custom bonus package solely for your list. Let me know if you are open to a quick chat?

Best,
[Your Name]
\`\`\`

### 💡 High-Leverage Proposal

We recommend scheduling a co-promotional live session or introducing a customized bundle explicitly highlighting their channel's branding. This locks in premium visibility and creates high-friction content competitors can't match.`
  });
});

async function bootstrap() {
  // Vite middleware integration for full-stack dev / build handling
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to host 0.0.0.0 and port 3000 as required
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Bootstrap failure:", err);
});
