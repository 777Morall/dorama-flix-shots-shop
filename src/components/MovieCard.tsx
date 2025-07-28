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
    <Card className="group relative overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-lg cursor-pointer transform hover:scale-105">
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-48 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12 sm:w-16 sm:h-16"
            onClick={() => onSelect(movie)}
          >
            <Play className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>
        </div>

        {/* Price badge */}
        <Badge variant="outline" className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-background/90 backdrop-blur font-bold text-xs">
          R$ {movie.price.toFixed(2)}
        </Badge>
      </div>

      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="space-y-1 sm:space-y-2">
          <h3 className="font-bold text-base sm:text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          
          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">
            {movie.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-accent text-accent" />
            <span>{movie.rating}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{movie.duration}</span>
            <span className="sm:hidden">{movie.duration.replace('min', 'm')}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{movie.year}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            {movie.genre}
          </Badge>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSelect(movie)}
            className="hover:bg-primary hover:text-primary-foreground text-xs px-2 py-1 h-7 sm:h-8 sm:px-3 sm:py-2"
          >
            <span className="hidden sm:inline">Ver Detalhes</span>
            <span className="sm:hidden">Ver</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
