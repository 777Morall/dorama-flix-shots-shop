import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Clock, Calendar, Play, MessageCircle } from "lucide-react";

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

interface MovieDetailsProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
}

export function MovieDetails({ movie, open, onClose }: MovieDetailsProps) {
  if (!movie) return null;

  const handleWhatsAppPurchase = () => {
    const message = `Olá! Gostaria de adquirir o filme "${movie.title}" por R$ ${movie.price.toFixed(2)}. Poderia me ajudar com o processo de compra?`;
    const phoneNumber = "5511999999999"; // Substitua pelo número real
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {movie.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Poster */}
          <div className="relative">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-96 md:h-full object-cover rounded-lg shadow-cinema"
            />
            <Badge className="absolute top-4 right-4 bg-gradient-accent text-accent-foreground font-bold text-lg px-3 py-1">
              R$ {movie.price.toFixed(2)}
            </Badge>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Info badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                {movie.rating}/10
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {movie.duration}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {movie.year}
              </Badge>
              <Badge className="bg-primary text-primary-foreground">
                {movie.genre}
              </Badge>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Sinopse</h3>
              <p className="text-muted-foreground leading-relaxed">
                {movie.description}
              </p>
            </div>

            <Separator />

            {/* Action buttons */}
            <div className="space-y-4">
              {movie.trailer && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(movie.trailer, '_blank')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Assistir Trailer
                </Button>
              )}

              <Button
                variant="whatsapp"
                size="lg"
                className="w-full text-lg py-6"
                onClick={handleWhatsAppPurchase}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Adquirir por R$ {movie.price.toFixed(2)}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Você será redirecionado para o WhatsApp para finalizar a compra
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}