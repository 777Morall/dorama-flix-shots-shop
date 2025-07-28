import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Clock, Calendar, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

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

interface User {
  id: string;
  plan_status: string;
  plan_expires_at: string | null;
}

const DoramaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dorama, setDorama] = useState<Dorama | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadDorama();
    checkAuth();
  }, [id]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        
        // Buscar dados do usuário
        const { data: userData } = await supabase
          .from('users')
          .select('id, plan_status, plan_expires_at')
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

  const loadDorama = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setDorama(data);
    } catch (error: any) {
      toast.error("Erro ao carregar dorama: " + error.message);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const hasActivePlan = () => {
    if (!user) return false;
    if (user.plan_status !== 'active') return false;
    if (!user.plan_expires_at) return false;
    
    const expirationDate = new Date(user.plan_expires_at);
    return expirationDate > new Date();
  };

  const canWatchContent = () => {
    return isAuthenticated && hasActivePlan();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Play className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Carregando dorama...</p>
        </div>
      </div>
    );
  }

  if (!dorama) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Dorama não encontrado</h2>
          <Button onClick={() => navigate("/")}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Play className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Shorts Dorama Shop
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="aspect-[2/3] relative">
                <img
                  src={dorama.poster}
                  alt={dorama.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-accent text-accent-foreground">
                    R$ {dorama.price.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{dorama.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3" />
                  {dorama.rating}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {dorama.year}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {dorama.duration}
                </Badge>
                <Badge variant="outline">
                  {dorama.genre}
                </Badge>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {dorama.description}
              </p>
            </div>

            {/* Video Player ou Bloqueio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Assistir Dorama
                </CardTitle>
              </CardHeader>
              <CardContent>
                {canWatchContent() ? (
                  dorama.trailer ? (
                    <div className="aspect-video">
                      <iframe
                        src={dorama.trailer}
                        title={dorama.title}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Vídeo não disponível</p>
                    </div>
                  )
                ) : (
                  <div className="aspect-video bg-gradient-card rounded-lg flex flex-col items-center justify-center text-center p-8">
                    <Lock className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Conteúdo Exclusivo</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      {!isAuthenticated 
                        ? "Faça login para assistir aos melhores doramas asiáticos"
                        : "Ative seu plano mensal para ter acesso completo a todos os doramas"
                      }
                    </p>
                    <div className="flex gap-4">
                      {!isAuthenticated ? (
                        <Button onClick={() => navigate("/auth")} className="gap-2">
                          <Play className="h-4 w-4" />
                          Fazer Login
                        </Button>
                      ) : (
                        <Button onClick={() => navigate("/planos")} className="gap-2">
                          <Play className="h-4 w-4" />
                          Ativar Plano - R$ 20,00
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plano Info */}
            {isAuthenticated && user && (
              <Card>
                <CardHeader>
                  <CardTitle>Status do Plano</CardTitle>
                </CardHeader>
                <CardContent>
                  {hasActivePlan() ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <Badge variant="secondary" className="bg-green-900 text-green-400">
                        Plano Ativo
                      </Badge>
                      <span className="text-sm">
                        Expira em: {new Date(user.plan_expires_at!).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Plano Inativo</Badge>
                        <span className="text-sm text-muted-foreground">
                          Ative seu plano para assistir
                        </span>
                      </div>
                      <Button onClick={() => navigate("/planos")} size="sm">
                        Ativar Plano
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoramaDetails;