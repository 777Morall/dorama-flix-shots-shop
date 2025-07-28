import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Search, User, Star, Heart, Clock, Calendar, Sparkles, TrendingUp } from "lucide-react";

interface Dorama {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [doramas, setDoramas] = useState<Dorama[]>([]);
  const [filteredDoramas, setFilteredDoramas] = useState<Dorama[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadDoramas();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const loadDoramas = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const doramasData = data || [];
      setDoramas(doramasData);
      setFilteredDoramas(doramasData);
    } catch (error) {
      console.error('Error loading doramas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredDoramas(doramas);
    } else {
      const filtered = doramas.filter(
        dorama =>
          dorama.title.toLowerCase().includes(query.toLowerCase()) ||
          dorama.genre.toLowerCase().includes(query.toLowerCase()) ||
          dorama.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDoramas(filtered);
    }
  };

  const handleLoginClick = () => {
    navigate("/auth");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Play className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Carregando doramas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Play className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                  Shorts Dorama Shop
                </h1>
                <p className="text-xs text-muted-foreground">Doramas e Filmes Asiáticos</p>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar doramas..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                R$ 20,00/mês
              </Badge>
              
              {user ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate("/planos")}>
                    Planos
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                    Admin
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate("/planos")}>
                    Assinar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLoginClick}>
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar doramas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-accent text-accent-foreground">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
                <Badge variant="outline">
                  <Heart className="h-3 w-3 mr-1" />
                  K-Dramas
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Doramas Asiáticos
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Os melhores doramas coreanos, japoneses e chineses por apenas <span className="text-accent font-bold">R$ 20,00/mês</span>
              </p>
              
              <div className="flex gap-4">
                <Button size="lg" className="text-lg" onClick={() => navigate("/planos")}>
                  <Play className="h-5 w-5 mr-2" />
                  Começar Agora
                </Button>
                <Button variant="outline" size="lg" className="text-lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Explorar Catálogo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doramas Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Catálogo Completo"}
          </h2>
          <p className="text-muted-foreground">
            {filteredDoramas.length} {filteredDoramas.length === 1 ? "dorama encontrado" : "doramas encontrados"}
          </p>
        </div>

        {filteredDoramas.length === 0 ? (
          <div className="text-center py-16">
            <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum dorama encontrado</h3>
            <p className="text-muted-foreground">
              Tente buscar por outro termo ou explore nosso catálogo completo
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoramas.map((dorama) => (
              <Card key={dorama.id} className="overflow-hidden hover:shadow-glow transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/dorama/${dorama.id}`)}>
                <div className="aspect-[2/3] relative">
                  <img
                    src={dorama.poster}
                    alt={dorama.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-gradient-accent text-accent-foreground">
                      R$ {dorama.price.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <Button size="sm" className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Assistir
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{dorama.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {dorama.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{dorama.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{dorama.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{dorama.duration}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {dorama.genre}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Play className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Shorts Dorama Shop
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 Shorts Dorama Shop. Todos os direitos reservados. • Doramas e Filmes Asiáticos
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
