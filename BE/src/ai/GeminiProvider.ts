import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompts";
import { TOOL_DECLARATIONS } from "./tools";

export const geminiModel = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export function isGeminiEnabled(): boolean {
  return Boolean(process.env.GEMINI_API_KEY) && process.env.AI_MOCK !== "true";
}

interface HistoryItem {
  role: string;
  content: string;
}

export async function runGemini(params: {
  history: HistoryItem[];
  message: string;
  onToolCall: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}): Promise<{ text: string; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY belum diset");

  const ai = new GoogleGenAI({ apiKey });

  const contents: any[] = params.history
    .filter((item) => item.role === "user" || item.role === "assistant")
    .map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content }],
    }));

  contents.push({ role: "user", parts: [{ text: params.message }] });

  let text = "";

  const withTimeout = <T>(promise: Promise<T>, ms = 20000): Promise<T> =>
    Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini request timeout")), ms)
      ),
    ]);

  for (let round = 0; round < 3; round += 1) {
    const response: any = await withTimeout(ai.models.generateContent({
      model: geminiModel,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
        temperature: 0.4,
        maxOutputTokens: 700,
      },
    }));

    const calls = response.functionCalls ?? [];

    if (!calls.length) {
      text = response.text ?? "";
      break;
    }

    const modelParts = response.candidates?.[0]?.content?.parts ?? [];
    contents.push({ role: "model", parts: modelParts });

    const responses: any[] = [];
    for (const call of calls) {
      const result = await params.onToolCall(
        String(call.name),
        (call.args ?? {}) as Record<string, unknown>
      );
      responses.push({
        functionResponse: { name: call.name, response: { result } },
      });
    }
    contents.push({ role: "user", parts: responses });
  }

  return { text, model: geminiModel };
}
