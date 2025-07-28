import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Film, Search, Star } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo - Compacto no mobile */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <Film className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full animate-pulse" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent truncate">
                CinemaFlix
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Filmes e Doramas
              </p>
            </div>
          </div>

          {/* Search Desktop */}
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar filmes e doramas..."
                className="pl-10"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Price Badge */}
          <div className="flex items-center">
            <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1">
              <Star className="h-3 w-3 fill-accent text-accent flex-shrink-0" />
              <span className="hidden sm:inline">A partir de</span>
              <span className="font-medium">R$ 10</span>
            </Badge>
          </div>
        </div>

        {/* Search Mobile/Tablet */}
        <div className="lg:hidden mt-3 sm:mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar filmes e doramas..."
              className="pl-10 h-10 sm:h-11"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
