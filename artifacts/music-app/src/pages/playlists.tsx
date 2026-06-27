import React, { useState } from "react";
import { useAppContext } from "@/lib/app-context";
import { useListSongs } from "@workspace/api-client-react";
import { SongCard } from "@/components/song-card";
import { Library, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Playlists() {
  const { playlists, createPlaylist, deletePlaylist } = useAppContext();
  const { data: allSongs } = useListSongs();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setIsCreating(false);
    }
  };

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);
  
  if (selectedPlaylist && allSongs) {
    const playlistSongs = selectedPlaylist.songIds
      .map(id => allSongs.find(s => s.id === id))
      .filter(s => !!s) as typeof allSongs;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedPlaylistId(null)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">{selectedPlaylist.name}</h1>
            <p className="text-muted-foreground mt-2 text-lg">{playlistSongs.length} songs</p>
          </div>
        </div>

        {playlistSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border rounded-2xl bg-card/30">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Library className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium text-foreground">Empty Playlist</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Add songs from your library by clicking the more options icon on any song.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {playlistSongs.map((song) => (
              <SongCard 
                key={song.id} 
                song={song} 
                queueContext={playlistSongs}
                playlistId={selectedPlaylist.id}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">Playlists</h1>
          <p className="text-muted-foreground mt-2 text-lg">Curated moments.</p>
        </div>
        
        <Button onClick={() => setIsCreating(true)} className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          New Playlist
        </Button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-card border border-primary/30 rounded-2xl p-4 flex gap-3 animate-in fade-in zoom-in-95 duration-200 shadow-[0_0_20px_rgba(var(--primary),0.1)]">
          <Input
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Playlist name..."
            autoFocus
            className="flex-1 bg-background border-border"
          />
          <Button type="submit" disabled={!newPlaylistName.trim()}>Create</Button>
          <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
        </form>
      )}

      {playlists.length === 0 && !isCreating ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border rounded-2xl bg-card/30">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Library className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium text-foreground">No playlists yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Create a playlist to organize your library into different moods.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div 
              key={playlist.id}
              onClick={() => setSelectedPlaylistId(playlist.id)}
              className="group cursor-pointer bg-card hover:bg-accent/50 border border-card-border hover:border-primary/30 rounded-2xl p-6 transition-all duration-300 flex flex-col items-center text-center shadow-sm hover:shadow-md"
            >
              <div className="w-24 h-24 rounded-full bg-secondary mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-inner">
                <Library className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground truncate w-full">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{playlist.songIds.length} songs</p>
              
              <div className="mt-4 pt-4 border-t border-border w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); deletePlaylist(playlist.id); }}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
