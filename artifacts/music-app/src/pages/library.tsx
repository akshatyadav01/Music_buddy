import React, { useState } from "react";
import { useListSongs } from "@workspace/api-client-react";
import { SongCard } from "@/components/song-card";
import { Input } from "@/components/ui/input";
import { Search, Music, Loader2 } from "lucide-react";

function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Library() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounceValue(search, 300);
  
  const { data: songs, isLoading } = useListSongs(
    debouncedSearch ? { q: debouncedSearch } : undefined
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">Library</h1>
          <p className="text-muted-foreground mt-2 text-lg">Your entire collection.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs, artists..." 
            className="pl-9 bg-card border-card-border h-11 rounded-full text-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p>Loading library...</p>
        </div>
      ) : !songs || songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border rounded-2xl bg-card/30">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium text-foreground">No songs found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            {search ? "Try a different search term." : "Your library is empty. Upload some music to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {songs.map((song) => (
            <SongCard 
              key={song.id} 
              song={song} 
              queueContext={songs} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
