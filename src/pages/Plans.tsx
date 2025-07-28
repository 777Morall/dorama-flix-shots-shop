import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Star, CheckCircle, Clock, ArrowLeft, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const Plans = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [whatsappContact, setWhatsappContact] = useState("");
  const [hasExistingRequest, setHasExistingRequest] = useState(false);

  const pixKey = "d3cbb30a-5a7f-46b8-b922-e44c8f9c4a25";
  const whatsappNumber = "(11) 93758-7626";

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Buscar dados do usuário
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userData) {
        setUser(userData);
      }

      // Verificar se já existe uma solicitação pendente
      const { data: existingRequest } = await supabase
        .from('plan_requests')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'pending')
        .single();

      if (existingRequest) {
        setHasExistingRequest(true);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const hasActivePlan = () => {
    if (!user) return false;
    if (user.plan_status !== 'active') return false;
    if (!user.plan_expires_at) return false;
    
    const expirationDate = new Date(user.plan_expires_at);
    return expirationDate > new Date();
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    toast.success("Chave Pix copiada!");
  };

  const handleSubmitRequest = async () => {
    if (!whatsappContact.trim()) {
      toast.error("Por favor, informe seu WhatsApp");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Você precisa estar logado");
        return;
      }

      const { error } = await supabase
        .from('plan_requests')
        .insert({
          user_id: session.user.id,
          whatsapp_contact: whatsappContact,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Solicitação enviada! Aguarde a aprovação após o pagamento.");
      setHasExistingRequest(true);
    } catch (error: any) {
      toast.error("Erro ao enviar solicitação: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Acabei de fazer o pagamento de R$ 20,00 para o plano mensal do Shorts Dorama Shop. Meu WhatsApp é: ${whatsappContact}`
    );
    const whatsappUrl = `https://wa.me/5511937587626?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Plano Premium</h1>
            <p className="text-xl text-muted-foreground">
              Acesso ilimitado aos melhores doramas e filmes asiáticos
            </p>
          </div>

          {/* Status do Plano Atual */}
          {user && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Status Atual</CardTitle>
              </CardHeader>
              <CardContent>
                {hasActivePlan() ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <Badge variant="secondary" className="bg-green-900 text-green-400">
                      Plano Ativo
                    </Badge>
                    <span className="text-sm">
                      Expira em: {new Date(user.plan_expires_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="outline">Plano Inativo</Badge>
                    <span className="text-sm text-muted-foreground">
                      Ative seu plano para assistir aos doramas
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plano Premium */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-accent text-accent-foreground px-3 py-1 text-sm font-semibold">
                Popular
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Plano Premium</CardTitle>
                <CardDescription>Acesso completo por 30 dias</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                    R$ 20
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Acesso a todos os doramas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Acesso a todos os filmes asiáticos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Sem anúncios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Qualidade HD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Suporte prioritário</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instruções de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Como Ativar</CardTitle>
                <CardDescription>
                  Siga os passos para ativar seu plano premium
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">1. Chave Pix</h4>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <code className="flex-1 text-sm">{pixKey}</code>
                    <Button size="sm" variant="outline" onClick={copyPixKey}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Faça o Pix de R$ 20,00 para esta chave
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">2. Seu WhatsApp</h4>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp para contato</Label>
                    <Input
                      id="whatsapp"
                      placeholder="(11) 99999-9999"
                      value={whatsappContact}
                      onChange={(e) => setWhatsappContact(e.target.value)}
                      disabled={hasExistingRequest}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">3. Enviar Comprovante</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Envie o comprovante pelo WhatsApp: {whatsappNumber}
                  </p>
                  
                  {hasExistingRequest ? (
                    <div className="space-y-2">
                      <Badge variant="secondary" className="mb-2">
                        Solicitação Enviada
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Sua solicitação já foi enviada. Aguarde a aprovação após o pagamento.
                      </p>
                      <Button onClick={openWhatsApp} className="w-full gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Enviar Comprovante no WhatsApp
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        onClick={handleSubmitRequest} 
                        disabled={loading || !whatsappContact.trim()}
                        className="w-full"
                      >
                        {loading ? "Enviando..." : "Solicitar Ativação"}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Após solicitar, você poderá enviar o comprovante
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <h5 className="font-semibold text-accent mb-1">⚡ Ativação Rápida</h5>
                  <p className="text-sm text-muted-foreground">
                    Seu plano será ativado em até 24 horas após o pagamento
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Dúvidas Frequentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Como funciona o pagamento?</h4>
                <p className="text-sm text-muted-foreground">
                  O pagamento é manual via Pix. Após o pagamento, envie o comprovante pelo WhatsApp para ativação.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Quanto tempo para ativar?</h4>
                <p className="text-sm text-muted-foreground">
                  A ativação ocorre em até 24 horas após a confirmação do pagamento.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">O plano renova automaticamente?</h4>
                <p className="text-sm text-muted-foreground">
                  Não, você precisa renovar manualmente todo mês seguindo o mesmo processo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Plans;