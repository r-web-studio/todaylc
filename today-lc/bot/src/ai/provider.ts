import OpenAI from 'openai';
import { config } from '../config';

interface AiProvider {
  chat(prompt: string, history: Array<{ role: string; content: string }>, systemPrompt: string): Promise<string>;
}

class OpenAiProvider implements AiProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.ai.apiKey,
      baseURL: config.ai.baseUrl,
    });
  }

  async chat(prompt: string, history: Array<{ role: string; content: string }>, systemPrompt: string): Promise<string> {
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: prompt },
    ];

    const response = await this.client.chat.completions.create({
      model: config.ai.model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || '';
  }
}

let provider: AiProvider;

export function getAiProvider(): AiProvider {
  if (!provider) {
    provider = new OpenAiProvider();
  }
  return provider;
}
