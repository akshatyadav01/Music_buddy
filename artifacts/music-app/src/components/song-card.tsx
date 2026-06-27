import React, { useState } from "react";
import { Song, useDeleteSong, getListSongsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/lib/app-context";
import { Play, Plus, MoreVertical, Trash2, FolderPlus, Loader2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SongCardProps {
  song: Song;
  queueContext?: Song[];
  isQueue?: boolean;
  queueIndex?: number;
  playlistId?: string;
}

export function SongCard({ song, queueContext, isQueue, queueIndex, playlistId }: SongCardProps) {
  const { playSong, addToQueue, removeFromQueue, playlists, addSongToPlaylist, removeSongFromPlaylist, currentSong, isPlaying } = useAppContext();
  const deleteSong = useDeleteSong();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const isCurrent = currentSong?.id === song.id;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSong(song, queueContext);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${song.title}" from library?`)) {
      deleteSong.mutate({ id: song.id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSongsQueryKey() });
          toast({ title: "Song deleted" });
        },
        onError: () => {
          toast({ title: "Failed to delete song", variant: "destructive" });
        }
      });
    }
  };

  return (
    <div 
      className={cn(
        "group relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300",
        "hover:bg-accent/50 cursor-pointer border border-transparent",
        isCurrent && "bg-accent/30 border-primary/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden bg-muted flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
        {song.hasPoster ? (
          <img 
            src={`/api/songs/${song.id}/poster`} 
            alt={song.title}
            className={cn("w-full h-full object-cover transition-transform duration-500", isHovered && "scale-110")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-serif text-3xl italic bg-secondary">
            W
          </div>
        )}
        
        <div className={cn(
          "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200",
          (isHovered || isCurrent) ? "opacity-100" : "opacity-0"
        )}>
          {isCurrent && isPlaying ? (
            <div className="flex gap-1 items-end h-4">
              <div className="w-1 h-3 bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-2 bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <Play className={cn("w-6 h-6 fill-white text-white", isCurrent && "text-primary fill-primary")} />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className={cn("font-semibold text-base truncate transition-colors", isCurrent ? "text-primary" : "text-foreground")}>
          {song.title}
        </h4>
        <p className="text-sm text-muted-foreground truncate font-medium">
          {song.artist || "Unknown Artist"}
        </p>
      </div>

      <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        {!isQueue && (
          <button 
            onClick={(e) => { e.stopPropagation(); addToQueue(song); toast({ title: "Added to queue" }); }}
            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/10"
            title="Add to queue"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/5">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-xl border-popover-border">
            {isQueue && queueIndex !== undefined ? (
              <DropdownMenuItem onClick={() => removeFromQueue(queueIndex)} className="text-destructive focus:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Remove from Queue
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => addToQueue(song)}>
                <Plus className="w-4 h-4 mr-2" />
                Add to Queue
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FolderPlus className="w-4 h-4 mr-2" />
                Add to Playlist
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-popover/95 backdrop-blur-xl border-popover-border">
                  {playlists.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">No playlists</div>
                  ) : (
                    playlists.map(p => (
                      <DropdownMenuItem 
                        key={p.id} 
                        onClick={() => { addSongToPlaylist(p.id, song.id); toast({ title: `Added to ${p.name}` }); }}
                      >
                        {p.name}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            {playlistId && (
              <DropdownMenuItem onClick={() => removeSongFromPlaylist(playlistId, song.id)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Remove from Playlist
              </DropdownMenuItem>
            )}

            {!isQueue && !playlistId && (
              <>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete from Library
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
