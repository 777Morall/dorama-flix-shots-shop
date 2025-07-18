-- Criar tabela de filmes
CREATE TABLE public.movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  genre TEXT NOT NULL,
  year INTEGER NOT NULL,
  duration TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
  price DECIMAL(10,2) NOT NULL DEFAULT 10.00,
  poster TEXT NOT NULL,
  trailer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de perfis de usuário para admin
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para filmes (público pode ver, apenas admin pode modificar)
CREATE POLICY "Todos podem ver filmes" 
ON public.movies 
FOR SELECT 
USING (true);

CREATE POLICY "Apenas admin pode inserir filmes" 
ON public.movies 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Apenas admin pode atualizar filmes" 
ON public.movies 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Apenas admin pode deletar filmes" 
ON public.movies 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Políticas para perfis
CREATE POLICY "Usuários podem ver todos os perfis" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem inserir seu próprio perfil" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para timestamps
CREATE TRIGGER update_movies_updated_at
  BEFORE UPDATE ON public.movies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir alguns filmes de exemplo com capas em formato portrait
INSERT INTO public.movies (title, description, genre, year, duration, rating, price, poster) VALUES
('Parasita', 'Uma família pobre se infiltra na vida de uma família rica através de empregos domésticos, levando a consequências inesperadas.', 'Thriller', 2019, '132 min', 8.6, 10.00, 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=600&fit=crop'),
('Cidade de Deus', 'A história da favela Cidade de Deus contada através dos olhos de um jovem fotógrafo.', 'Drama', 2002, '130 min', 8.7, 10.00, 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=600&fit=crop'),
('Coringa', 'A origem sombria do icônico vilão do Batman em uma Gotham City decadente.', 'Drama', 2019, '122 min', 8.4, 10.00, 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=600&fit=crop'),
('A Viagem de Chihiro', 'Uma menina se aventura em um mundo espiritual para salvar seus pais.', 'Animação', 2001, '125 min', 9.3, 10.00, 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=600&fit=crop'),
('Interestelar', 'Um grupo de exploradores viaja através de um buraco de minhoca no espaço em uma tentativa de garantir a sobrevivência da humanidade.', 'Ficção Científica', 2014, '169 min', 8.6, 10.00, 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=600&fit=crop');