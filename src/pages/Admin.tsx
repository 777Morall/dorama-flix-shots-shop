import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Plus, LogOut, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AddMovieDialog } from "@/components/admin/AddMovieDialog";
import { EditMovieDialog } from "@/components/admin/EditMovieDialog";

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

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    checkUser();
    loadMovies();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Verificar se é admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        toast.error("Acesso negado. Apenas administradores podem acessar esta área.");
        navigate("/");
        return;
      }

      setUser(session.user);
      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar filmes: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (!confirm("Tem certeza que deseja deletar este filme?")) return;

    try {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', movieId);

      if (error) throw error;

      toast.success("Filme deletado com sucesso!");
      loadMovies();
    } catch (error: any) {
      toast.error("Erro ao deletar filme: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Film className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-lg">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                CinemaFlix Admin
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Admin: {user?.email}</Badge>
              <Button variant="outline" onClick={() => navigate("/")}>
                Ver Site
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gerenciar Filmes</h1>
              <p className="text-muted-foreground">
                Total de {movies.length} {movies.length === 1 ? "filme" : "filmes"} no catálogo
              </p>
            </div>
            
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Filme
            </Button>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden">
              <div className="aspect-[2/3] relative">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-gradient-accent text-accent-foreground">
                    R$ {movie.price.toFixed(2)}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{movie.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {movie.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{movie.genre}</span>
                  <span>{movie.year}</span>
                  <span>★ {movie.rating}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingMovie(movie)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteMovie(movie.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {movies.length === 0 && (
          <div className="text-center py-16">
            <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum filme cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Adicione o primeiro filme ao catálogo
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Filme
            </Button>
          </div>
        )}
      </main>

      {/* Dialogs */}
      <AddMovieDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={() => {
          setShowAddDialog(false);
          loadMovies();
        }}
      />
      
      <EditMovieDialog
        movie={editingMovie}
        open={!!editingMovie}
        onClose={() => setEditingMovie(null)}
        onSuccess={() => {
          setEditingMovie(null);
          loadMovies();
        }}
      />
    </div>
  );
};

export default Admin;