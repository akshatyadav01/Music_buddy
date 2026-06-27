import React, { useRef, useState, useEffect } from "react";
import { useAppContext } from "@/lib/app-context";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function Player() {
  const { currentSong, playNext, playPrevious, queue } = useAppContext();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = `/api/songs/${currentSong.id}/audio`;
      audioRef.current.play().catch(e => console.error("Playback failed", e));
      setIsPlaying(true);
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && value[0] !== undefined) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 h-20 md:h-[90px] border-t border-border bg-card/95 backdrop-blur-xl z-50 flex items-center justify-center text-muted-foreground text-sm">
        No song playing
      </div>
    );
  }

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 h-20 md:h-[90px] border-t border-border bg-card/95 backdrop-blur-xl z-50 flex flex-col md:flex-row items-center px-4 md:px-6 gap-2 md:gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Track Info */}
      <div className="flex items-center gap-3 w-full md:w-1/3 pt-2 md:pt-0">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-md overflow-hidden bg-muted flex-shrink-0 relative shadow-md">
          {currentSong.hasPoster ? (
            <img 
              src={`/api/songs/${currentSong.id}/poster`} 
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-serif text-2xl italic">
              W
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-sm md:text-base font-semibold text-foreground truncate leading-tight">
            {currentSong.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {currentSong.artist || "Unknown Artist"}
          </p>
        </div>
        
        {/* Mobile controls (inline with track info) */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Main Controls (Desktop) */}
      <div className="hidden md:flex flex-col items-center w-1/3 gap-2">
        <div className="flex items-center gap-6">
          <button 
            onClick={playPrevious}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            disabled={queue.length <= 1}
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-lg shadow-primary/20"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>
          
          <button 
            onClick={playNext}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            disabled={queue.length <= 1}
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        
        <div className="flex items-center w-full max-w-md gap-3 text-xs text-muted-foreground font-mono">
          <span>{formatTime(progress)}</span>
          <Slider 
            value={[progress]} 
            max={duration || 100} 
            step={1}
            onValueChange={handleSeek}
            className="flex-1 cursor-pointer"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="hidden md:flex items-center justify-end w-1/3 gap-4">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <div className="w-24">
          <Slider 
            value={[isMuted ? 0 : volume]} 
            max={1} 
            step={0.01}
            onValueChange={(v) => {
              setVolume(v[0]);
              if (v[0] > 0) setIsMuted(false);
            }}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Mobile Progress Bar (absolute at top of player) */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-100 ease-linear"
          style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}
