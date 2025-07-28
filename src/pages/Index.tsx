import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Search, User, Star, Heart, Clock, Calendar, Sparkles, TrendingUp, Volume2, VolumeX, Share2, MessageCircle, MoreVertical, Download } from "lucide-react";

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
  const [muted, setMuted] = useState(true);

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Play className="h-16 w-16 text-white mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-white">Carregando shorts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Mobile-First */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Play className="h-6 w-6 text-pink-500" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Shorts
              </h1>
            </div>

            {/* Search Mobile */}
            <div className="flex-1 max-w-xs mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 rounded-full h-9"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Profile */}
            {user ? (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="text-gray-300 p-2">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleLoginClick} className="text-gray-300 p-2">
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="sticky top-[60px] z-40 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-center gap-8 px-4 py-2">
          <button className="text-white font-medium pb-2 border-b-2 border-white">
            Para você
          </button>
          <button className="text-gray-400 font-medium pb-2">
            Seguindo
          </button>
          <button className="text-gray-400 font-medium pb-2">
            Populares
          </button>
        </div>
      </div>
      
      {/* Shorts Feed */}
      <div className="pb-20">
        {filteredDoramas.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Play className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Nenhum short encontrado</h3>
              <p className="text-gray-400">Tente buscar por outro termo</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredDoramas.map((dorama, index) => (
              <div key={dorama.id} className="relative h-screen w-full bg-black">
                {/* Video/Poster Background */}
                <div className="absolute inset-0">
                  <img
                    src={dorama.poster}
                    alt={dorama.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                </div>

                {/* Controls Overlay - Right Side */}
                <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-10">
                  {/* Like */}
                  <div className="flex flex-col items-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                    >
                      <Heart className="h-6 w-6 text-white" />
                    </Button>
                    <span className="text-xs text-white mt-1">128k</span>
                  </div>

                  {/* Comment */}
                  <div className="flex flex-col items-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                    >
                      <MessageCircle className="h-6 w-6 text-white" />
                    </Button>
                    <span className="text-xs text-white mt-1">1.2k</span>
                  </div>

                  {/* Share */}
                  <div className="flex flex-col items-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                    >
                      <Share2 className="h-6 w-6 text-white" />
                    </Button>
                    <span className="text-xs text-white mt-1">892</span>
                  </div>

                  {/* Download */}
                  <div className="flex flex-col items-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                      onClick={() => navigate(`/dorama/${dorama.id}`)}
                    >
                      <Download className="h-6 w-6 text-white" />
                    </Button>
                  </div>

                  {/* Profile Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content Info - Bottom Left */}
                <div className="absolute bottom-20 left-4 right-20 z-10">
                  <div className="space-y-3">
                    {/* Creator */}
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">@shortsDorama</span>
                      <Button
                        size="sm"
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 h-7 rounded-full"
                        onClick={() => navigate("/planos")}
                      >
                        Seguir
                      </Button>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h2 className="text-white font-semibold text-lg mb-1 line-clamp-2">
                        {dorama.title}
                      </h2>
                      <p className="text-white/90 text-sm line-clamp-2">
                        {dorama.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-white/80 text-sm">#{dorama.genre.toLowerCase()}</span>
                      <span className="text-white/80 text-sm">#dorama</span>
                      <span className="text-white/80 text-sm">#shorts</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-white/70 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{dorama.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{dorama.year}</span>
                      </div>
                      <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 px-2 py-0.5 text-xs">
                        R$ {dorama.price.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Audio Control */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute bottom-32 right-4 h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                  onClick={() => setMuted(!muted)}
                >
                  {muted ? (
                    <VolumeX className="h-5 w-5 text-white" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-white" />
                  )}
                </Button>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full bg-white w-3/4 transition-all duration-1000" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-gray-800 z-50">
        <div className="flex items-center justify-around py-2">
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-white p-2">
            <Play className="h-5 w-5" />
            <span className="text-xs">Início</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-gray-400 p-2">
            <Search className="h-5 w-5" />
            <span className="text-xs">Descobrir</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1 text-gray-400 p-2"
            onClick={() => navigate("/planos")}
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-xs">Premium</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-gray-400 p-2">
            <Heart className="h-5 w-5" />
            <span className="text-xs">Curtidas</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1 text-gray-400 p-2"
            onClick={user ? handleLogout : handleLoginClick}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Perfil</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
