
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

export class GeminiService {
  private chat: Chat | null = null;

  async startChat() {
    // Correct initialization: always use named parameter and direct process.env.API_KEY.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1, // Reduced temperature for absolute regulatory precision
        topP: 0.85,
        topK: 50,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      await this.startChat();
    }

    try {
      const result = await this.chat!.sendMessage({ message });
      // result.text is a property, not a method.
      return result.text || "Unauthorized response state. Please re-initiate session.";
    } catch (error: any) {
      console.error("Securvio Engine Error:", error);
      if (error?.message?.includes("429")) {
        return "Critical: Engine over-capacity. Strategic retrieval paused for 30s.";
      }
      return "Critical Error: Intelligence Node offline. Ensure request complies with PHI safety protocols.";
    }
  }

  async *sendMessageStream(message: string) {
    if (!this.chat) {
      await this.startChat();
    }

    try {
      const stream = await this.chat!.sendMessageStream({ message });
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        // c.text is a property, not a method.
        yield c.text || "";
      }
    } catch (error) {
      console.error("Securvio Stream Interrupted:", error);
      yield "Communication line compromised. Syncing backup node...";
    }
  }
}

export const gemini = new GeminiService();
