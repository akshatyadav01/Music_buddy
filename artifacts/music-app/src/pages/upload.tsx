import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getListSongsQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, Music, Image as ImageIcon, Loader2 } from "lucide-react";

export default function Upload() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !audioFile) {
      toast({ title: "Title and Audio file are required", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setProgress(10); // Fake initial progress

    try {
      const fd = new FormData();
      fd.append("title", title);
      if (artist) fd.append("artist", artist);
      fd.append("audio", audioFile);
      if (posterFile) fd.append("poster", posterFile);

      // Fake progress interval
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90));
      }, 500);

      const res = await fetch("/api/songs", {
        method: "POST",
        body: fd
      });

      clearInterval(interval);
      setProgress(100);

      if (!res.ok) throw new Error("Upload failed");

      queryClient.invalidateQueries({ queryKey: getListSongsQueryKey() });
      toast({ title: "Song uploaded successfully!" });
      
      // Reset form
      setTitle("");
      setArtist("");
      setAudioFile(null);
      setPosterFile(null);
      // Reset file inputs via ref if needed, or just let states clear visual
      const forms = document.querySelectorAll('input[type="file"]');
      forms.forEach((f: any) => f.value = "");
      
    } catch (err) {
      console.error(err);
      toast({ title: "Upload failed", description: "There was an error uploading your song.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">Upload</h1>
        <p className="text-muted-foreground mt-2 text-lg">Add to your private sanctuary.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">Song Title *</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g. Midnight City"
                className="bg-background border-border h-12"
                required
                disabled={isUploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist" className="text-foreground">Artist</Label>
              <Input 
                id="artist" 
                value={artist} 
                onChange={e => setArtist(e.target.value)} 
                placeholder="e.g. M83"
                className="bg-background border-border h-12"
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Audio File *</Label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="audio/*"
                  onChange={e => setAudioFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                  disabled={isUploading}
                />
                <div className={`flex items-center justify-center gap-3 w-full h-24 rounded-xl border-2 border-dashed transition-colors ${audioFile ? 'border-primary/50 bg-primary/5' : 'border-border bg-background group-hover:border-primary/30 group-hover:bg-accent/30'}`}>
                  {audioFile ? (
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <Music className="w-5 h-5" />
                      <span>{audioFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <Music className="w-6 h-6 mb-1" />
                      <span className="text-sm font-medium">Click or drag audio file here</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Artwork (Optional)</Label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setPosterFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isUploading}
                />
                <div className={`flex items-center justify-center gap-3 w-full h-24 rounded-xl border-2 border-dashed transition-colors ${posterFile ? 'border-primary/50 bg-primary/5' : 'border-border bg-background group-hover:border-primary/30 group-hover:bg-accent/30'}`}>
                  {posterFile ? (
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <ImageIcon className="w-5 h-5" />
                      <span>{posterFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-sm font-medium">Click or drag image file here</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-medium shadow-lg"
              disabled={isUploading || !title || !audioFile}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uploading... {progress}%
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Upload Song
                </>
              )}
            </Button>
            
            {isUploading && (
              <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
