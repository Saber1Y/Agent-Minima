export interface ReasonResponse {
  reasoning: string;
  minimalClaims: string[];
  excessiveClaims: string[];
  accepted: boolean;
}

const BTL_ENDPOINT = process.env.BTL_ENDPOINT || "https://runtime.badtheorylabs.com/api/v1/chat/completions";
const BTL_API_KEY = process.env.BTL_API_KEY || "";
const BTL_MODEL = process.env.BTL_MODEL || "btl-2";

const SYSTEM_PROMPT = `You are a disclosure policy agent. Your job is to analyze access requests and determine:
1. The minimum set of claims needed to satisfy the request
2. Whether any requested claims are excessive or irrelevant

Output valid JSON with these fields:
- "reasoning": short explanation
- "minimalClaims": list of claim types genuinely needed (e.g. ["age>18", "token_balance>100"])
- "excessiveClaims": list of claims that are not relevant to the access purpose
- "accepted": boolean — true only if the request doesn't ask for anything excessive`;

export async function reason(request: string): Promise<ReasonResponse> {
  const res = await fetch(BTL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BTL_API_KEY}`,
    },
    body: JSON.stringify({
      model: BTL_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: request },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`BTL API error ${res.status}: ${text}`);
  }

  const body = await res.json();
  const content = body.choices?.[0]?.message?.content;
  if (!content) throw new Error("BTL: no content in response");

  return JSON.parse(content) as ReasonResponse;
}
