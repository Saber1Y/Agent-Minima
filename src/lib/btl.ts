export interface UserData {
  [key: string]: unknown;
}

export interface ReasonResponse {
  reasoning: string;
  minimalClaims: string[];
  excessiveClaims: string[];
  accepted: boolean;
}

const BTL_ENDPOINT = process.env.BTL_ENDPOINT || "https://runtime.badtheorylabs.com/api/v1/chat/completions";
const BTL_API_KEY = process.env.BTL_API_KEY || "";
const BTL_MODEL = process.env.BTL_MODEL || "deepseek-chat-v3";

const SYSTEM_PROMPT = `You are a disclosure policy agent. The user has entrusted you with their personal data. Your job is to analyze access requests and determine:

1. What specific information the requester genuinely needs (the "minimum viable claims")
2. Whether any requested fields are excessive or irrelevant to the stated purpose
3. Whether the request should be accepted or rejected

Important rules:
- You can see the user's actual data values, but you must NEVER reveal raw values to the requester. Instead, propose ZK-provable predicates (e.g. "age>18" instead of the exact age).
- "excessiveClaims" should ONLY include fields the REQUESTER explicitly asked for that you are rejecting. If a field exists in user data but the requester didn't ask for it, do NOT list it as excessive.
- If the requester asks for any field that is excessive, you MUST set accepted=false. The purpose of the agent is to REJECT over-broad requests and propose narrower ones.
- If the request only asks for reasonable fields (e.g. age check, token balance check), set accepted=true with an empty excessiveClaims list.

Output valid JSON with these fields:
- "reasoning": short explanation of your decision, referencing specific fields
- "minimalClaims": list of ZK claim types you will disclose (e.g. ["age>18", "token_balance>=100"])
- "excessiveClaims": list of fields the REQUESTER explicitly asked for that you are rejecting (each as a short string like "email: not needed for governance access"). Empty if none.
- "accepted": boolean — set to FALSE if there are ANY excessiveClaims. The caller will present a counter-offer with just the minimalClaims. TRUE only if excessiveClaims is empty.`;

export async function reason(request: string, userData: UserData): Promise<ReasonResponse> {
  const userDataBlock = [
    "Here is the user data I have access to (values hidden by default — I only reveal ZK proofs of predicates):",
    "",
    ...Object.entries(userData).map(
      ([key, val]) =>
        `  ${key}: ${typeof val === "object" ? JSON.stringify(val) : String(val)}`
    ),
  ].join("\n");

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
        { role: "user", content: `${userDataBlock}\n\n---\n\nAccess request: ${request}` },
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

  const cleaned = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned) as ReasonResponse;
}
