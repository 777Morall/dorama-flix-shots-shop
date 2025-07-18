import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

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

interface EditMovieDialogProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditMovieDialog({ movie, open, onClose, onSuccess }: EditMovieDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    year: new Date().getFullYear(),
    duration: "",
    rating: 0,
    price: 10.00,
    poster: "",
    trailer: ""
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        description: movie.description,
        genre: movie.genre,
        year: movie.year,
        duration: movie.duration,
        rating: movie.rating,
        price: movie.price,
        poster: movie.poster,
        trailer: movie.trailer || ""
      });
    }
  }, [movie]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movie) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from('movies')
        .update(formData)
        .eq('id', movie.id);

      if (error) throw error;

      toast.success("Filme atualizado com sucesso!");
      onSuccess();
    } catch (error: any) {
      toast.error("Erro ao atualizar filme: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Filme</DialogTitle>
          <DialogDescription>
            Edite as informações do filme. As capas devem estar em formato vertical (portrait).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Título *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição *</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-genre">Gênero *</Label>
              <Input
                id="edit-genre"
                value={formData.genre}
                onChange={(e) => handleChange("genre", e.target.value)}
                placeholder="Ex: Drama, Ação"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-year">Ano *</Label>
              <Input
                id="edit-year"
                type="number"
                value={formData.year}
                onChange={(e) => handleChange("year", parseInt(e.target.value))}
                min="1900"
                max="2030"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duração *</Label>
              <Input
                id="edit-duration"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="Ex: 2h 15min"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-rating">Avaliação (0-10) *</Label>
              <Input
                id="edit-rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => handleChange("rating", parseFloat(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">Preço (R$) *</Label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleChange("price", parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-poster">URL da Capa (formato vertical) *</Label>
            <Input
              id="edit-poster"
              type="url"
              value={formData.poster}
              onChange={(e) => handleChange("poster", e.target.value)}
              placeholder="https://exemplo.com/capa.jpg"
              required
            />
            <p className="text-xs text-muted-foreground">
              Use imagens no formato portrait (vertical) para melhor visualização
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-trailer">URL do Trailer (opcional)</Label>
            <Input
              id="edit-trailer"
              type="url"
              value={formData.trailer}
              onChange={(e) => handleChange("trailer", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}