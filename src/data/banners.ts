export interface Banner {
  id: number;
  imagem: string;
  titulo: string;
  subtitulo: string;
  textoBotao: string;
}

export const banners: Banner[] = [
  {
    id: 1,
    imagem: "/publicidades/aneis.jpg",
    titulo: "Coleção de Anéis",
    subtitulo: "Do clássico ao moderno, encontre o anel perfeito para cada momento.",
    textoBotao: "Ver Coleção",
  },
  {
    id: 2,
    imagem: "/publicidades/colares.jpg",
    titulo: "Colares Elegantes",
    subtitulo: "Peças que realçam a tua beleza com sofisticação.",
    textoBotao: "Comprar Agora",
  },
  {
    id: 3,
    imagem: "/publicidades/brincos.jpg",
    titulo: "Brincos Exclusivos",
    subtitulo: "Do minimalista ao extravagante, brilhe com estilo.",
    textoBotao: "Ver Novidades",
  },
  {
    id: 4,
    imagem: "/publicidades/pulseiras.jpg",
    titulo: "Pulseiras e Relógios",
    subtitulo: "Acessórios que completam o teu visual com elegância.",
    textoBotao: "Explorar",
  },
];

export const objetivoLoja = "Joias finas e semijoias — Anéis, colares, brincos, pulseiras e relógios. Elegância e qualidade para todos os momentos.";