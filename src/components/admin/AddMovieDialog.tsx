import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface AddMovieDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMovieDialog({ open, onClose, onSuccess }: AddMovieDialogProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('movies').insert([formData]);

      if (error) throw error;

      toast.success("Filme adicionado com sucesso!");
      onSuccess();
      
      // Reset form
      setFormData({
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
    } catch (error: any) {
      toast.error("Erro ao adicionar filme: " + error.message);
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
          <DialogTitle>Adicionar Novo Filme</DialogTitle>
          <DialogDescription>
            Preencha as informações do filme. As capas devem estar em formato vertical (portrait).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Gênero *</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => handleChange("genre", e.target.value)}
                placeholder="Ex: Drama, Ação"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Ano *</Label>
              <Input
                id="year"
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
              <Label htmlFor="duration">Duração *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="Ex: 2h 15min"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Avaliação (0-10) *</Label>
              <Input
                id="rating"
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
            <Label htmlFor="price">Preço (R$) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleChange("price", parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="poster">URL da Capa (formato vertical) *</Label>
            <Input
              id="poster"
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
            <Label htmlFor="trailer">URL do Trailer (opcional)</Label>
            <Input
              id="trailer"
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
              {loading ? "Adicionando..." : "Adicionar Filme"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}