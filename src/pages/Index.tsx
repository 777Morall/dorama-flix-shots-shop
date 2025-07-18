import { useState } from "react";
import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetails } from "@/components/MovieDetails";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, Sparkles, TrendingUp } from "lucide-react";
import cinemaHero from "@/assets/cinema-hero.jpg";

// Mock data - será substituído pelo banco de dados
const mockMovies = [
  {
    id: "1",
    title: "Parasita",
    description: "Uma família pobre se infiltra na vida de uma família rica, levando a consequências inesperadas e perturbadoras.",
    genre: "Thriller",
    year: 2019,
    duration: "2h 12min",
    rating: 8.6,
    price: 10.00,
    poster: "https://images.unsplash.com/photo-1489599735826-1dade2ac5b6c?w=300&h=450&fit=crop",
    trailer: "https://youtube.com/watch?v=example"
  },
  {
    id: "2",
    title: "Descendentes do Sol",
    description: "Um capitão das forças especiais e uma cirurgiã se apaixonam em meio a uma missão humanitária perigosa.",
    genre: "Romance/Drama",
    year: 2016,
    duration: "16 episódios",
    rating: 8.7,
    price: 10.00,
    poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=450&fit=crop"
  },
  {
    id: "3",
    title: "Oldboy",
    description: "Um homem é aprisionado por 15 anos sem saber o motivo e, quando libertado, busca vingança contra seus captores.",
    genre: "Ação/Thriller",
    year: 2003,
    duration: "2h 0min",
    rating: 8.4,
    price: 10.00,
    poster: "https://images.unsplash.com/photo-1518930259200-7e2976ea3673?w=300&h=450&fit=crop"
  },
  {
    id: "4",
    title: "Crash Landing on You",
    description: "Uma herdeira sul-coreana faz um pouso forçado na Coreia do Norte e se apaixona por um oficial do exército.",
    genre: "Romance/Comédia",
    year: 2019,
    duration: "16 episódios",
    rating: 8.8,
    price: 10.00,
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop"
  },
  {
    id: "5",
    title: "Lula Molusco",
    description: "Drama coreano sobre um jovem lutador que busca realizar seus sonhos no competitivo mundo dos esportes.",
    genre: "Drama/Esporte",
    year: 2021,
    duration: "2h 5min",
    rating: 8.2,
    price: 10.00,
    poster: "https://images.unsplash.com/photo-1489599735826-1dade2ac5b6c?w=300&h=450&fit=crop"
  },
  {
    id: "6",
    title: "Kingdom",
    description: "Um príncipe investiga uma misteriosa praga que transforma pessoas em zumbis na Coreia do período Joseon.",
    genre: "Horror/Drama",
    year: 2019,
    duration: "2 temporadas",
    rating: 8.3,
    price: 10.00,
    poster: "https://images.unsplash.com/photo-1518930259200-7e2976ea3673?w=300&h=450&fit=crop"
  }
];

const Index = () => {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState(mockMovies);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredMovies(mockMovies);
    } else {
      const filtered = mockMovies.filter(
        movie =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.genre.toLowerCase().includes(query.toLowerCase()) ||
          movie.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  };

  const handleLoginClick = () => {
    // Implementar após conectar Supabase
    alert("Sistema de login admin será implementado após conectar ao Supabase!");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header onSearch={handleSearch} onLoginClick={handleLoginClick} />
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={cinemaHero}
          alt="Cinema Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-accent text-accent-foreground">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Novo
                </Badge>
                <Badge variant="outline">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Em Alta
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Filmes & Doramas
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Os melhores filmes coreanos e doramas por apenas <span className="text-accent font-bold">R$ 10,00</span> cada
              </p>
              
              <Button variant="cinema" size="lg" className="text-lg">
                <Film className="h-5 w-5 mr-2" />
                Explorar Catálogo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Catálogo Completo"}
          </h2>
          <p className="text-muted-foreground">
            {filteredMovies.length} {filteredMovies.length === 1 ? "filme encontrado" : "filmes encontrados"}
          </p>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-16">
            <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum filme encontrado</h3>
            <p className="text-muted-foreground">
              Tente buscar por outro termo ou explore nosso catálogo completo
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={setSelectedMovie}
              />
            ))}
          </div>
        )}
      </section>

      {/* Movie Details Modal */}
      <MovieDetails
        movie={selectedMovie}
        open={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              CinemaFlix
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 CinemaFlix. Todos os direitos reservados. • Filmes e Doramas por R$ 10,00
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
