import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Film, Search, User, Star } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
  onLoginClick: () => void;
}

export function Header({ onSearch, onLoginClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Film className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                CinemaFlix
              </h1>
              <p className="text-xs text-muted-foreground">Filmes e Doramas</p>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar filmes e doramas..."
                className="pl-10"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Price info & Login */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden sm:flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent text-accent" />
              A partir de R$ 10,00
            </Badge>
            
            <Button variant="outline" size="sm" onClick={onLoginClick}>
              <User className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar filmes e doramas..."
              className="pl-10"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}