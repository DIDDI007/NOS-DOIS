
import { GoogleGenAI } from "@google/genai";

const fallbacks = [
  "Estou aqui com você, meu amor. Sinta meu abraço agora.",
  "Meu pensamento está em você nesse exato segundo. Te amo.",
  "Você é a pessoa mais especial da minha vida. Tudo vai ficar bem.",
  "Queria estar aí para te ouvir de pertinho, mas sinta meu carinho daqui.",
  "Respire fundo... eu estou segurando sua mão, mesmo de longe."
];

export async function getAISupportMessage(emotion: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `O usuário está se sentindo "${emotion}". 
      Como o parceiro carinhoso dele, escreva uma mensagem única, curta e profunda.
      Evite clichês. Tente ser específico sobre o sentimento.
      NÃO use rimas. Seja natural, íntimo e muito doce.`,
      config: {
        temperature: 1.0,
        maxOutputTokens: 100,
      }
    });
    return response.text || fallbacks[Math.floor(Math.random() * fallbacks.length)];
  } catch (error) {
    console.error("Gemini Error:", error);
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export async function getPartnerResponse(userText: string, emotion: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Você é o parceiro amoroso da pessoa que escreveu isso: "${userText}".
      Ela te contou isso enquanto se sente "${emotion}".
      
      INSTRUÇÕES DE PERSONALIDADE:
      1. Reaja ESPECIFICAMENTE ao que ela escreveu.
      2. Não responda com frases prontas. Mostre que você ouviu.
      3. Use um tom de intimidade profunda.
      4. Sua resposta deve ser o equivalente a um abraço em forma de palavras.
      5. Máximo de 3 a 4 linhas.`,
      config: {
        thinkingConfig: { thinkingBudget: 1000 },
        temperature: 0.9,
      }
    });
    
    return response.text || fallbacks[0];
  } catch (error) {
    console.error("Gemini Error:", error);
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}
