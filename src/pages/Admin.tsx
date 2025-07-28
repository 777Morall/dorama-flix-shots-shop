import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Plus, LogOut, Edit, Trash2, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { AddMovieDialog } from "@/components/admin/AddMovieDialog";
import { EditMovieDialog } from "@/components/admin/EditMovieDialog";

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

interface PlanRequest {
  id: string;
  user_id: string;
  status: string;
  whatsapp_contact: string;
  created_at: string;
  profiles: {
    display_name: string;
  };
}

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doramas, setDoramas] = useState<Dorama[]>([]);
  const [planRequests, setPlanRequests] = useState<PlanRequest[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDorama, setEditingDorama] = useState<Dorama | null>(null);

  useEffect(() => {
    checkUser();
    loadDoramas();
    loadPlanRequests();
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

  const loadDoramas = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoramas(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar doramas: " + error.message);
    }
  };

  const loadPlanRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('plan_requests')
        .select(`
          *,
          profiles!plan_requests_user_id_fkey(display_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlanRequests(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar solicitações: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDeleteDorama = async (doramaId: string) => {
    if (!confirm("Tem certeza que deseja deletar este dorama?")) return;

    try {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', doramaId);

      if (error) throw error;

      toast.success("Dorama deletado com sucesso!");
      loadDoramas();
    } catch (error: any) {
      toast.error("Erro ao deletar dorama: " + error.message);
    }
  };

  const handleApprovePlan = async (requestId: string, userId: string) => {
    try {
      // Ativar plano do usuário
      const { error: activateError } = await supabase.rpc('activate_user_plan', {
        target_user_id: userId
      });

      if (activateError) throw activateError;

      // Atualizar status da solicitação
      const { error: updateError } = await supabase
        .from('plan_requests')
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast.success("Plano aprovado com sucesso!");
      loadPlanRequests();
    } catch (error: any) {
      toast.error("Erro ao aprovar plano: " + error.message);
    }
  };

  const handleRejectPlan = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('plan_requests')
        .update({
          status: 'rejected',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast.success("Solicitação rejeitada!");
      loadPlanRequests();
    } catch (error: any) {
      toast.error("Erro ao rejeitar solicitação: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Play className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
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
              <Play className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Shorts Dorama Shop Admin
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
        <Tabs defaultValue="doramas" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="doramas" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Gerenciar Doramas
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Aprovar Planos ({planRequests.filter(r => r.status === 'pending').length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Doramas */}
          <TabsContent value="doramas" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Gerenciar Doramas</h1>
                <p className="text-muted-foreground">
                  Total de {doramas.length} {doramas.length === 1 ? "dorama" : "doramas"} no catálogo
                </p>
              </div>
              
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Dorama
              </Button>
            </div>

            {/* Doramas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {doramas.map((dorama) => (
                <Card key={dorama.id} className="overflow-hidden">
                  <div className="aspect-[2/3] relative">
                    <img
                      src={dorama.poster}
                      alt={dorama.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-gradient-accent text-accent-foreground">
                        R$ {dorama.price.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{dorama.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {dorama.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{dorama.genre}</span>
                      <span>{dorama.year}</span>
                      <span>★ {dorama.rating}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingDorama(dorama)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteDorama(dorama.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {doramas.length === 0 && (
              <div className="text-center py-16">
                <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum dorama cadastrado</h3>
                <p className="text-muted-foreground mb-4">
                  Adicione o primeiro dorama ao catálogo
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Dorama
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Tab: Plan Requests */}
          <TabsContent value="plans" className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Aprovar Planos</h1>
              <p className="text-muted-foreground">
                Gerencie as solicitações de ativação de planos dos usuários
              </p>
            </div>

            <div className="space-y-4">
              {planRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {request.profiles?.display_name || 'Usuário'}
                          <Badge 
                            variant={
                              request.status === 'pending' ? 'outline' :
                              request.status === 'approved' ? 'secondary' : 'destructive'
                            }
                            className={
                              request.status === 'pending' ? 'border-yellow-500 text-yellow-500' :
                              request.status === 'approved' ? 'bg-green-900 text-green-400' : ''
                            }
                          >
                            {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {request.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {request.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                            {request.status === 'pending' ? 'Pendente' :
                             request.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          WhatsApp: {request.whatsapp_contact} • 
                          Solicitado em: {new Date(request.created_at).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleApprovePlan(request.id, request.user_id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprovar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRejectPlan(request.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeitar
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}

              {planRequests.length === 0 && (
                <div className="text-center py-16">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhuma solicitação pendente</h3>
                  <p className="text-muted-foreground">
                    As solicitações de planos aparecerão aqui
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <AddMovieDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={() => {
          setShowAddDialog(false);
          loadDoramas();
        }}
      />
      
      <EditMovieDialog
        movie={editingDorama}
        open={!!editingDorama}
        onClose={() => setEditingDorama(null)}
        onSuccess={() => {
          setEditingDorama(null);
          loadDoramas();
        }}
      />
    </div>
  );
};

export default Admin;