
import { EmotionContent, Letter } from './types';

export const EMOTIONS: Record<string, EmotionContent> = {
  longing: {
    id: 'longing',
    label: 'Com saudade',
    icon: '💭',
    greeting: 'A saudade é só o amor querendo te abraçar.',
    color: '#D4A5A5',
    messages: [
      "Cada minuto longe é um minuto mais perto de te ver.",
      "Feche os olhos por um segundo... estou aí com você.",
      "Onde quer que eu esteja, meu pensamento te encontra.",
      "Você é o meu lugar favorito no mundo."
    ],
    suggestions: ["Ver fotos nossas", "Ouvir nossa playlist", "Planejar nosso jantar"]
  },
  tired: {
    id: 'tired',
    label: 'Cansada(o)',
    icon: '😔',
    greeting: 'Deixe o peso do dia aqui fora. Agora é só nós.',
    color: '#A5B5D4',
    messages: [
      "Você fez o seu melhor hoje. Agora, descanse.",
      "Queria ser seu travesseiro agora para te acolher.",
      "Respire fundo. O mundo pode esperar um pouco.",
      "Meu abraço está reservado e quentinho para você."
    ],
    suggestions: ["Respiração guiada", "Música calma", "Banho relaxante"]
  },
  sad: {
    id: 'sad',
    label: 'Triste',
    icon: '😢',
    greeting: 'Está tudo bem não estar bem. Eu seguro sua mão.',
    color: '#B5A5D4',
    messages: [
      "Estou aqui. Não importa o que aconteça.",
      "Chorar limpa a alma. Eu te acolho em silêncio.",
      "Isso também vai passar, e eu estarei ao seu lado.",
      "Você é mais forte do que imagina, e mais amada(o) do que sente."
    ],
    suggestions: ["Me ligar", "Escrever o que sente", "Ver um vídeo fofo"]
  },
  happy: {
    id: 'happy',
    label: 'Feliz',
    icon: '😊',
    greeting: 'Sua alegria ilumina tudo ao meu redor!',
    color: '#D4C9A5',
    messages: [
      "Ver você feliz é o meu maior presente.",
      "Guarda esse sorriso pra mim? Quero ver ele de perto.",
      "O mundo fica mais colorido quando você está bem.",
      "Vamos comemorar cada pequena vitória juntos!"
    ],
    suggestions: ["Me contar a novidade", "Dançar uma música", "Sorrir mais uma vez"]
  },
  close: {
    id: 'close',
    label: 'Só sentir você perto',
    icon: '😌',
    greeting: 'Sinta minha presença. Estou aqui, batendo no mesmo ritmo.',
    color: '#E5E5E5',
    messages: [
      "Não precisamos de palavras, apenas de conexão.",
      "Meu coração chama o seu agora.",
      "Sinta o calor da minha mão na sua.",
      "Estamos sob o mesmo céu, respirando o mesmo ar."
    ],
    suggestions: ["Modo batida do coração", "Meditação em dupla", "Silêncio compartilhado"]
  }
};

export const INITIAL_LETTERS: Letter[] = [
  {
    id: '1',
    title: 'Quando estiver cansada(o)',
    content: 'Ei, meu amor. Se você abriu isso, é porque o dia foi longo. Quero que saiba que tenho muito orgulho da sua dedicação. Agora, feche os olhos e sinta meu beijo na sua testa. Amanhã será um novo dia.',
    unlockCondition: 'Estar com sentimento "Cansada(o)"',
    isUnlocked: false
  },
  {
    id: '2',
    title: 'Para um dia de chuva',
    content: 'O barulho da chuva me faz lembrar de como é bom ficar enrolado em você debaixo das cobertas. Sinta meu cheiro no ar e saiba que logo logo estaremos assim de novo.',
    unlockCondition: 'Aleatório',
    isUnlocked: true
  }
];

export const NEXT_MEETING_DATE = new Date();
NEXT_MEETING_DATE.setDate(NEXT_MEETING_DATE.getDate() + 4); // Example: 4 days from now
