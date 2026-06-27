import React from "react";
import { useAppContext } from "@/lib/app-context";
import { SongCard } from "@/components/song-card";
import { ListMusic, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Queue() {
  const { queue, clearQueue } = useAppContext();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">Queue</h1>
          <p className="text-muted-foreground mt-2 text-lg">Up next.</p>
        </div>
        
        {queue.length > 0 && (
          <Button variant="ghost" onClick={clearQueue} className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Queue
          </Button>
        )}
      </div>

      {queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border rounded-2xl bg-card/30">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <ListMusic className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium text-foreground">Your queue is empty</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Add some songs to the queue from your library to keep the music playing.
          </p>
        </div>
      ) : (
        <div className="bg-card/50 border border-card-border rounded-2xl p-2 md:p-4">
          <div className="flex flex-col gap-1">
            {queue.map((song, index) => (
              <SongCard 
                key={`${song.id}-${index}`} 
                song={song} 
                isQueue={true}
                queueIndex={index}
                queueContext={queue}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
