import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Song } from "@workspace/api-client-react";

export interface Playlist {
  id: string;
  name: string;
  songIds: number[];
}

interface AppContextType {
  queue: Song[];
  setQueue: (queue: Song[]) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  currentSongIndex: number;
  setCurrentSongIndex: (index: number) => void;
  currentSong: Song | null;
  playNext: () => void;
  playPrevious: () => void;
  playSong: (song: Song, queueContext?: Song[]) => void;
  
  playlists: Playlist[];
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, songId: number) => void;
  removeSongFromPlaylist: (playlistId: string, songId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [queue, setQueueState] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [playlists, setPlaylistsState] = useState<Playlist[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem("wavvy_queue");
      if (savedQueue) {
        setQueueState(JSON.parse(savedQueue));
      }
      
      const savedPlaylists = localStorage.getItem("wavvy_playlists");
      if (savedPlaylists) {
        setPlaylistsState(JSON.parse(savedPlaylists));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  const setQueue = (newQueue: Song[]) => {
    setQueueState(newQueue);
    localStorage.setItem("wavvy_queue", JSON.stringify(newQueue));
  };

  const setPlaylists = (newPlaylists: Playlist[]) => {
    setPlaylistsState(newPlaylists);
    localStorage.setItem("wavvy_playlists", JSON.stringify(newPlaylists));
  };

  const addToQueue = (song: Song) => {
    setQueue([...queue, song]);
    if (queue.length === 0) {
      setCurrentSongIndex(0);
    }
  };

  const removeFromQueue = (index: number) => {
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    setQueue(newQueue);
    if (currentSongIndex >= index && currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else if (newQueue.length === 0) {
      setCurrentSongIndex(-1);
    }
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentSongIndex(-1);
  };

  const playNext = () => {
    if (currentSongIndex < queue.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const playPrevious = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  const playSong = (song: Song, queueContext?: Song[]) => {
    if (queueContext) {
      setQueue(queueContext);
      const index = queueContext.findIndex(s => s.id === song.id);
      setCurrentSongIndex(index >= 0 ? index : 0);
    } else {
      setQueue([song]);
      setCurrentSongIndex(0);
    }
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      name,
      songIds: []
    };
    setPlaylists([...playlists, newPlaylist]);
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter(p => p.id !== id));
  };

  const addSongToPlaylist = (playlistId: string, songId: number) => {
    setPlaylists(playlists.map(p => {
      if (p.id === playlistId && !p.songIds.includes(songId)) {
        return { ...p, songIds: [...p.songIds, songId] };
      }
      return p;
    }));
  };

  const removeSongFromPlaylist = (playlistId: string, songId: number) => {
    setPlaylists(playlists.map(p => {
      if (p.id === playlistId) {
        return { ...p, songIds: p.songIds.filter(id => id !== songId) };
      }
      return p;
    }));
  };

  const currentSong = queue[currentSongIndex] || null;

  if (!isLoaded) return null;

  return (
    <AppContext.Provider value={{
      queue,
      setQueue,
      addToQueue,
      removeFromQueue,
      clearQueue,
      currentSongIndex,
      setCurrentSongIndex,
      currentSong,
      playNext,
      playPrevious,
      playSong,
      playlists,
      createPlaylist,
      deletePlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
