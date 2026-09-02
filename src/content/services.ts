export type Service = {
  name: string;
  category: "Corpo" | "Rosto" | "Sobrancelhas e olhar" | "Bem-estar";
  description: string;
  benefits: string[];
  indication: string;
  duration?: string;
};

export const services: Service[] = [
  { name: "Sculpt Detox", category: "Corpo", description: "Um cuidado corporal feito com escuta e intenção.", benefits: ["Sensação de leveza", "Momento de autocuidado"], indication: "Para quem busca um ritual corporal personalizado." },
  { name: "Massagem modeladora", category: "Corpo", description: "Técnicas manuais integradas ao seu momento e objetivo.", benefits: ["Cuidado corporal", "Atenção personalizada"], indication: "Para quem deseja incluir um protocolo corporal na rotina." },
  { name: "Protocolos redutores de medidas", category: "Corpo", description: "Planos corporais que respeitam seu corpo e sua rotina.", benefits: ["Acompanhamento individual", "Protocolo personalizado"], indication: "Indicação avaliada individualmente." },
  { name: "Dermaplaning", category: "Rosto", description: "Um ritual facial para renovar a textura e o viço da pele.", benefits: ["Pele com toque mais uniforme", "Ritual de renovação"], indication: "Após avaliação do seu tipo de pele." },
  { name: "Microagulhamento", category: "Rosto", description: "Cuidado facial realizado de forma personalizada e responsável.", benefits: ["Plano individual", "Acompanhamento profissional"], indication: "Disponibilidade e indicação confirmadas em avaliação." },
  { name: "Reconstrução de sobrancelhas", category: "Sobrancelhas e olhar", description: "Um desenho que respeita a expressão natural do seu rosto.", benefits: ["Valorização do olhar", "Desenho personalizado"], indication: "Para quem quer cuidar das sobrancelhas com naturalidade." },
  { name: "Hidratação labial", category: "Rosto", description: "Um gesto delicado de cuidado para os lábios.", benefits: ["Conforto", "Aparência bem cuidada"], indication: "Para incluir no seu ritual de autocuidado." },
  { name: "Massagem relaxante", category: "Bem-estar", description: "Uma pausa sensorial para reconectar corpo e presença.", benefits: ["Relaxamento", "Pausa na rotina"], indication: "Para quem deseja desacelerar com cuidado." },
];
