import OpenAI from 'openai';
import { GiftRecommendation } from '../types';

export class GiftRecommendationService {
  private client: OpenAI | null;

  constructor() {
    // Only initialize if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else {
      console.warn('⚠️  OPENAI_API_KEY not set - using fallback gift recommendations');
      this.client = null;
    }
  }

  async recommendGifts(params: {
    recipientName: string;
    relationship: string;
    occasion: string;
    age?: number;
    preferences?: string;
    budgetMin: number;
    budgetMax: number;
    previousGifts?: string[];
  }): Promise<GiftRecommendation[]> {
    // If no OpenAI client, use fallback immediately
    if (!this.client) {
      console.log('Using fallback recommendations (no OpenAI key)');
      return this.getFallbackRecommendations(params.budgetMin, params.budgetMax, params.occasion);
    }

    const {
      recipientName,
      relationship,
      occasion,
      age,
      preferences,
      budgetMin,
      budgetMax,
      previousGifts = []
    } = params;

    const prompt = `Recommend 3 thoughtful gift ideas for:

Recipient: ${recipientName}
Relationship: ${relationship}
Occasion: ${occasion}
${age ? `Age: ${age}` : ''}
${preferences ? `Preferences/Interests: ${preferences}` : ''}
Budget: $${budgetMin} - $${budgetMax}
${previousGifts.length > 0 ? `Previous gifts (avoid similar): ${previousGifts.join(', ')}` : ''}

For each gift recommendation, provide:
1. Gift name
2. Brief description (1-2 sentences)
3. Estimated price within budget
4. Brief reasoning why this gift is appropriate

Format your response as JSON array with this structure:
[
  {
    "name": "Gift Name",
    "description": "Description here",
    "price": 49.99,
    "reasoning": "Why this gift is great"
  }
]

Only respond with the JSON array, nothing else.`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 1500,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        // Handle both array response and object with array property
        const recommendations = Array.isArray(parsed) ? parsed : (parsed.gifts || parsed.recommendations || []);

        return recommendations.map((rec: any) => ({
          name: rec.name,
          description: rec.description,
          price: rec.price,
          url: this.generateMockProductUrl(rec.name),
          imageUrl: this.generateMockImageUrl(rec.name),
          reasoning: rec.reasoning
        }));
      }

      throw new Error('No response from OpenAI');
    } catch (error) {
      console.error('Error generating gift recommendations:', error);
      return this.getFallbackRecommendations(budgetMin, budgetMax, occasion);
    }
  }

  private generateMockProductUrl(productName: string): string {
    const encodedName = encodeURIComponent(productName);
    return `https://www.amazon.com/s?k=${encodedName}`;
  }

  private generateMockImageUrl(productName: string): string {
    return `https://via.placeholder.com/400x400?text=${encodeURIComponent(productName)}`;
  }

  private getFallbackRecommendations(budgetMin: number, budgetMax: number, occasion: string): GiftRecommendation[] {
    const avgBudget = (budgetMin + budgetMax) / 2;

    return [
      {
        name: 'Gift Card',
        description: 'A versatile gift card that lets them choose exactly what they want.',
        price: avgBudget,
        url: 'https://www.amazon.com/gift-cards',
        imageUrl: 'https://via.placeholder.com/400x400?text=Gift+Card',
        reasoning: 'Gift cards are always appreciated and allow the recipient to choose something they truly want.'
      },
      {
        name: 'Personalized Photo Album',
        description: 'A beautiful photo album to preserve precious memories.',
        price: Math.min(avgBudget * 0.8, budgetMax),
        url: 'https://www.amazon.com/s?k=photo+album',
        imageUrl: 'https://via.placeholder.com/400x400?text=Photo+Album',
        reasoning: 'Personal and thoughtful gift that celebrates your relationship and shared memories.'
      },
      {
        name: 'Gourmet Gift Basket',
        description: 'A curated selection of gourmet treats and snacks.',
        price: Math.min(avgBudget * 1.1, budgetMax),
        url: 'https://www.amazon.com/s?k=gift+basket',
        imageUrl: 'https://via.placeholder.com/400x400?text=Gift+Basket',
        reasoning: 'A delicious assortment that is perfect for any occasion and sure to be enjoyed.'
      }
    ];
  }
}

export const giftRecommendationService = new GiftRecommendationService();
