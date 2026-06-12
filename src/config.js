// Configuração padrão da experiência.
// Esses valores são usados apenas como fallback inicial.
// O usuário poderá alterar tudo através do painel de configuração.

export const CONFIG = {
  partnerName: "",
  startDate: "",
  siteUrl: "", // URL pública do site hospedado (ex: https://meu-site.vercel.app)

  music: {
    title: "",
    artist: "",
    file: "musica/pose.mp3",
    cover: "",
    lyricsMessage: "Essa música sempre me lembra nós."
  },

  loveLetter: "",

  quiz: [
    {
      question: "O que mais me chamou atenção quando nos conhecemos?",
      options: ["Seu sorriso", "Seu olhar", "Seu jeito de falar", "Tudo de uma vez"],
      reaction: "Boa escolha! 💖\nMas a verdade é que você me ganhou por inteiro desde o primeiro segundo."
    },
    {
      question: "Qual é o meu lugar favorito no mundo?",
      options: ["Qualquer lugar viajando", "Minha cama", "Onde quer que você esteja", "Um restaurante bom"],
      reaction: "Acertou! 🌍\nNão importa o cenário, meu lugar favorito sempre vai ser ao seu lado."
    }
  ],

  awards: [
    { id: "award_smile",    title: "Melhor Sorriso",           icon: "Smile",    color: "text-accent3", photo: "" },
    { id: "award_romantic", title: "Momento mais romântico",   icon: "Heart",    color: "text-primary", photo: "" },
    { id: "award_funny",   title: "Foto mais engraçada",      icon: "Laugh",    color: "text-accent2", photo: "" },
    { id: "award_trip",    title: "Melhor Viagem",            icon: "Plane",    color: "text-accent1", photo: "" },
    { id: "award_pretty",  title: "Foto mais bonita",         icon: "Star",     color: "text-accent3", photo: "" },
    { id: "award_special", title: "Momento mais marcante",    icon: "Sparkles", color: "text-accent2", photo: "" },
  ],

  memories: []
};
