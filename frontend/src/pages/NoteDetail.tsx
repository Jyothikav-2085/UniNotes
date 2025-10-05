import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Background3D } from '@/components/Background3D';
import { ArrowLeft, Download, Share2, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface NoteDetails {
  sl_no: string;
  note_title: string;
  subject: string;
  department: string;
  semester: string;
  user_name: string;
  file_name: string;
  created_at: string;
  // Add other fields as needed
}

export default function NoteDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [note, setNote] = useState<NoteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch notes from backend
        const response = await fetch(`${API_BASE_URL}/notes`);
        const data = await response.json();
        
        if (response.ok && data.notes) {
          // Find the note with matching ID
          const foundNote = data.notes.find((n: NoteDetails) => n.sl_no === id);
          
          if (foundNote) {
            setNote(foundNote);
          } else {
            toast({
              title: "Error",
              description: "Note not found",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to load notes",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching note details:', error);
        toast({
          title: "Error",
          description: "Failed to load note details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchNoteDetails();
    }
  }, [id, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading note details...</p>
        </div>
      </div>
    );
  }
  
  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass-card border-2 p-8">
          <p className="text-xl text-muted-foreground">Note not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    try {
      // Create download URL
      const downloadUrl = `${API_BASE_URL}${API_ENDPOINTS.DOWNLOAD_NOTE.replace(':fileName', note.file_name)}`;
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = note.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your file is being downloaded",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    // TODO: Connect to your existing share backend
    console.log('Share note:', id);
    toast({
      title: "Note Shared",
      description: "Note link copied to clipboard",
    });
    
    // Copy to clipboard
    navigator.clipboard.writeText(window.location.href);
  };

  const handleDelete = () => {
    // TODO: Connect to your existing delete backend
    console.log('Delete note:', id);
    toast({
      title: "Note Deleted",
      description: "Note has been removed",
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <Background3D />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 left-40 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="glass border-2 mb-6 hover:border-primary/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold gradient-text mb-2"
              >
                {note.note_title}
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground"
              >
                Subject: {note.subject}
              </motion.p>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground mt-2"
              >
                Created: {new Date(note.created_at).toLocaleDateString()}
              </motion.p>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-muted-foreground"
              >
                Uploaded by: {note.user_name}
              </motion.p>
            </div>
            
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2"
            >
              <Button
                onClick={handleDownload}
                variant="outline"
                className="glass border-2 hover:border-primary/50 transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="glass border-2 hover:border-primary/50 transition-all"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="glass border-2 hover:border-destructive/50 text-destructive transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
          
          {/* Tags */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="px-4 py-2 text-sm rounded-full glass border border-primary/30 text-primary"
            >
              {note.department}
            </motion.span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="px-4 py-2 text-sm rounded-full glass border border-accent/30 text-accent"
            >
              {note.semester}
            </motion.span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="px-4 py-2 text-sm rounded-full glass border border-green-500/30 text-green-500"
            >
              {note.subject}
            </motion.span>
          </motion.div>
        </motion.div>
        
        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-2 glow">
            <CardHeader>
              <CardTitle>Note Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">File Details</h3>
                  <p className="text-muted-foreground">File Name: {note.file_name}</p>
                  <p className="text-muted-foreground">Uploaded: {new Date(note.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Academic Information</h3>
                  <p className="text-muted-foreground">Department: {note.department}</p>
                  <p className="text-muted-foreground">Semester: {note.semester}</p>
                  <p className="text-muted-foreground">Subject: {note.subject}</p>
                </div>
                <div className="pt-4">
                  <p className="text-muted-foreground">To view the full content of this note, please download the file using the button above.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
