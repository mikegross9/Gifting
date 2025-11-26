import OpenAI from 'openai';

export class CardWritingService {
  private client: OpenAI | null;

  constructor() {
    // Only initialize if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else {
      console.warn('⚠️  OPENAI_API_KEY not set - using fallback card messages');
      this.client = null;
    }
  }

  async generateCardMessage(params: {
    recipientName: string;
    relationship: string;
    occasion: string;
    giftDescription: string;
    senderName: string;
    tone?: 'formal' | 'casual' | 'heartfelt' | 'funny';
  }): Promise<string> {
    const { recipientName, relationship, occasion, giftDescription, senderName, tone = 'heartfelt' } = params;

    // If no OpenAI client, use fallback
    if (!this.client) {
      return this.getFallbackMessage(recipientName, occasion, senderName, tone);
    }

    const prompt = `Write a personalized greeting card message for the following:

Recipient: ${recipientName}
Relationship: ${relationship}
Occasion: ${occasion}
Gift: ${giftDescription}
Sender: ${senderName}
Tone: ${tone}

Write a warm, sincere card message (2-4 sentences) that feels personal and genuine. The message should:
- Reference the occasion naturally
- Be appropriate for the relationship
- Feel authentic, not overly formal or generic
- Match the requested tone (${tone})

Just provide the card message text, nothing else.`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 300,
        temperature: 0.8
      });

      const message = completion.choices[0]?.message?.content;
      if (message) {
        return message.trim();
      }

      throw new Error('No response from OpenAI');
    } catch (error) {
      console.error('Error generating card message:', error);
      return this.getFallbackMessage(recipientName, occasion, senderName, tone);
    }
  }

  private getFallbackMessage(recipientName: string, occasion: string, senderName: string, tone: string): string {
    const messages = {
      heartfelt: `Dear ${recipientName}, wishing you a wonderful ${occasion} filled with joy and happiness. You mean so much to me! With love, ${senderName}`,
      casual: `Hey ${recipientName}! Happy ${occasion}! Hope your day is amazing. - ${senderName}`,
      funny: `${recipientName}, you're another year older... but who's counting? Have an awesome ${occasion}! - ${senderName}`,
      formal: `Dear ${recipientName}, Please accept my warmest wishes for a happy ${occasion}. Best regards, ${senderName}`
    };

    return messages[tone as keyof typeof messages] || `Happy ${occasion}, ${recipientName}! Wishing you all the best. - ${senderName}`;
  }

  async generateMultipleOptions(params: {
    recipientName: string;
    relationship: string;
    occasion: string;
    giftDescription: string;
    senderName: string;
  }): Promise<string[]> {
    const tones: Array<'formal' | 'casual' | 'heartfelt' | 'funny'> = ['heartfelt', 'casual', 'funny'];

    const messages = await Promise.all(
      tones.map(tone => this.generateCardMessage({ ...params, tone }))
    );

    return messages;
  }
}

export const cardWritingService = new CardWritingService();
