import Anthropic from '@anthropic-ai/sdk';

export class CardWritingService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
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
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text.trim();
      }

      throw new Error('Unexpected response format from AI');
    } catch (error) {
      console.error('Error generating card message:', error);

      // Fallback message if AI service fails
      return `Happy ${occasion}, ${recipientName}! Wishing you all the best. - ${senderName}`;
    }
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
