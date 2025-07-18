import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetails } from "@/components/MovieDetails";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, Sparkles, TrendingUp } from "lucide-react";
import cinemaHero from "@/assets/cinema-hero.jpg";

interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  year: number;
  duration: string;
  rating: number;
  price: number;
  poster: string;
  trailer?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const moviesData = data || [];
      setMovies(moviesData);
      setFilteredMovies(moviesData);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(
        movie =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.genre.toLowerCase().includes(query.toLowerCase()) ||
          movie.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  };

  const handleLoginClick = () => {
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Film className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-lg">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

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
