import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Calendar, Play } from "lucide-react";

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

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export function MovieCard({ movie, onSelect }: MovieCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-gradient-card border-border hover:border-primary/50 transition-all duration-500 hover:shadow-cinema cursor-pointer transform hover:scale-105">
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="cinema"
            className="rounded-full w-16 h-16"
            onClick={() => onSelect(movie)}
          >
            <Play className="h-6 w-6" />
          </Button>
        </div>

        {/* Price badge */}
        <Badge className="absolute top-3 right-3 bg-gradient-accent text-accent-foreground font-bold">
          R$ {movie.price.toFixed(2)}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2">
            {movie.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span>{movie.rating}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{movie.duration}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{movie.year}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {movie.genre}
          </Badge>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSelect(movie)}
            className="hover:bg-primary hover:text-primary-foreground"
          >
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}