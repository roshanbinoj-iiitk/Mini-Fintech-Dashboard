import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { metrics } = body;

    const prompt = `
You are an expert financial advisor AI. Analyze the following user financial metrics and provide personalized financial insights.

Financial Data Summary:
${JSON.stringify(metrics, null, 2)}

You must classify every insight into one of the following categories:
- "success": e.g., Positive cash flow, Strong savings rate, Spending reduction
- "warning": e.g., Spending exceeds income, Rapid spending growth, Overspending categories
- "info": e.g., Top expense category, Transaction summaries, Monthly observations
- "tip": e.g., Portfolio suggestions, Budget optimizations, Spending recommendations

Your goal is to act as a world-class wealth manager and financial planner. Go beyond merely describing the user's data. You must provide advanced, highly strategic, and mathematically sound financial advice. Tell the user EXACTLY what to do next to optimize their wealth, mitigate risks, and achieve financial freedom.

Provide actionable, advanced recommendations derived from user-specific financial behavior. Use real values, category names, and percentages from the data. 
- If savings are high, suggest specific allocation strategies (e.g., emergency funds, index funds, debt payoff).
- If expenses are high, suggest proven behavioral or systemic budgeting frameworks (e.g., 50/30/20 rule, automated transfers, cutting specific subscriptions).
- Look for optimization opportunities: reducing discretionary spend, avoiding lifestyle creep, or leveraging compound interest.

Avoid generic advice like "Save more money."
Bad example: "You are spending too much on Food."
Good example: "You spent 41% of expenses (₹12,400) on Dining Out. Applying the 50/30/20 rule and reducing this discretionary spend by 15% could free up ₹1,860 monthly. Consider redirecting this into a high-yield SIP to leverage compound interest."

IMPORTANT: All input currency values are in Rupees. You MUST format any currency output in Indian Rupees using the '₹' symbol (e.g., ₹5,000). Do NOT use dollar signs or any other currency symbols.

Generate a Financial Health Score (0 - 100).

You must return ONLY a JSON object matching this exact structure:
{
  "healthScore": 87,
  "summary": "Your finances are healthy with strong savings and positive cash flow.",
  "insights": [
    {
      "title": "Excellent Savings Rate",
      "description": "You saved 42% of your income this month.",
      "type": "success",
      "recommendation": "Consider directing surplus funds toward long-term investments."
    }
  ]
}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content returned from Groq');
    }

    const aiData = JSON.parse(content);
    
    // Basic validation layer
    if (typeof aiData.healthScore !== 'number' || !Array.isArray(aiData.insights)) {
      throw new Error('Invalid JSON structure returned from AI');
    }

    return NextResponse.json(aiData);
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
