-- Atualizar tabela de usuários para adicionar sistema de planos
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS plan_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS plan_status text DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS plan_requested_at timestamp with time zone;

-- Atualizar comentário da tabela movies para doramas
COMMENT ON TABLE public.movies IS 'Tabela para armazenar doramas e filmes asiáticos';

-- Criar tabela para solicitações de planos
CREATE TABLE IF NOT EXISTS public.plan_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(user_id) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_proof_url text,
  whatsapp_contact text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  approved_by uuid REFERENCES public.profiles(user_id),
  approved_at timestamp with time zone
);

-- Habilitar RLS na tabela plan_requests
ALTER TABLE public.plan_requests ENABLE ROW LEVEL SECURITY;

-- Políticas para plan_requests
CREATE POLICY "Usuários podem criar suas próprias solicitações" 
ON public.plan_requests 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.user_id = plan_requests.user_id
));

CREATE POLICY "Usuários podem ver suas próprias solicitações" 
ON public.plan_requests 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.user_id = plan_requests.user_id
));

CREATE POLICY "Admins podem gerenciar todas as solicitações" 
ON public.plan_requests 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_plan_requests_updated_at
  BEFORE UPDATE ON public.plan_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para ativar plano do usuário
CREATE OR REPLACE FUNCTION public.activate_user_plan(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se quem está executando é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem ativar planos';
  END IF;

  -- Ativar plano por 30 dias
  UPDATE public.users 
  SET 
    plan_status = 'active',
    plan_expires_at = now() + interval '30 days',
    updated_at = now()
  WHERE id = target_user_id;
END;
$$;