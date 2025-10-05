import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NoteCard } from '@/components/NoteCard';
import { UploadModal } from '@/components/UploadModal';
import { Background3D } from '@/components/Background3D';
import { Plus, Search, LogOut, User, ArrowLeft, Bot } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Note interface
interface Note {
  sl_no: string;
  note_title: string;
  subject: string;
  department: string;
  semester: string;
  user_name: string;
  file_name: string;
  created_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [likedNotes, setLikedNotes] = useState<Record<string, boolean>>({});

  // Check authentication on component mount
  React.useEffect(() => {
    const userId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const branch = localStorage.getItem('selectedBranch');
    const semester = localStorage.getItem('selectedSemester');
    const subject = localStorage.getItem('selectedSubject');
    
    if (!userId) {
      navigate('/auth');
      return;
    }
    
    if (!branch) {
      navigate('/branches');
      return;
    }
    
    if (!semester) {
      navigate('/semesters');
      return;
    }
    
    if (!subject) {
      navigate('/subjects');
      return;
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    setSelectedBranch(branch);
    setSelectedSemester(semester);
    setSelectedSubject(subject);
    
    // Fetch user's notes from backend
    fetchNotes();
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const branch = localStorage.getItem('selectedBranch');
      const semester = localStorage.getItem('selectedSemester');
      const subject = localStorage.getItem('selectedSubject');
      
      if (!branch || !semester || !subject) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_NOTES}?department=${branch}&semester=${semester}`);
      const data = await response.json();

      if (response.ok) {
        // Filter notes by subject
        const filteredNotes = data.notes ? data.notes.filter((note: Note) => 
          note.subject.toLowerCase().includes(subject.toLowerCase())
        ) : [];
        setNotes(filteredNotes);
        
        // Fetch like status for all notes
        fetchLikeStatus(filteredNotes);
      } else {
        console.error('Failed to fetch notes:', data.error);
        toast({
          title: "Error",
          description: "Failed to fetch notes",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLikeStatus = async (notes: Note[]) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const newLikedNotes: Record<string, boolean> = {};
      
      // Fetch like status for each note
      for (const note of notes) {
        try {
          const response = await fetch(
            `${API_BASE_URL}${API_ENDPOINTS.GET_LIKE_STATUS}`
              .replace(':noteId', note.sl_no)
              .replace(':userId', userId)
          );
          
          if (response.ok) {
            const data = await response.json();
            newLikedNotes[note.sl_no] = data.liked;
          }
        } catch (error) {
          console.error('Error fetching like status:', error);
        }
      }
      
      setLikedNotes(newLikedNotes);
    } catch (error) {
      console.error('Error fetching like statuses:', error);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.note_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('selectedBranch');
    localStorage.removeItem('selectedSemester');
    localStorage.removeItem('selectedSubject');
    navigate('/auth');
  };

  const handleBackToSubjects = () => {
    navigate('/subjects');
  };

  const handleUpload = async (data: { title: string; description: string; file: File | null }) => {
    setIsUploading(true);
    
    try {
      const userId = localStorage.getItem('userId');
      const branch = localStorage.getItem('selectedBranch');
      const semester = localStorage.getItem('selectedSemester');
      const subject = localStorage.getItem('selectedSubject');
      
      console.log('Upload data:', {
        userId,
        branch,
        semester,
        subject,
        title: data.title,
        description: data.description
      });
      
      if (!userId) {
        toast({
          title: "Error",
          description: "User not logged in. Please login again.",
          variant: "destructive",
        });
        return;
      }
      
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('department', branch || '');
      formData.append('semester', semester || '');
      formData.append('subject', subject || ''); // Use selected subject
      formData.append('unit', '1'); // Default unit, can be made dynamic later
      formData.append('user_id', userId);
      
      if (data.file) {
        formData.append('note', data.file);
      }

      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOAD_NOTE}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Note uploaded successfully",
        });
        
        // Refresh the notes list
        fetchNotes();
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || 'Failed to upload note. Please try again.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewNote = (id: string) => {
    navigate(`/note/${id}`);
  };

  const handleDownload = async (fileName: string) => {
    try {
      // Create a download link for the file from Supabase storage
      const downloadUrl = `${API_BASE_URL}${API_ENDPOINTS.DOWNLOAD_NOTE.replace(':fileName', fileName)}`;
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
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

  const handleLike = async (noteId: string) => {
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        toast({
          title: "Error",
          description: "Please login to like notes",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LIKE_NOTE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId,
          userId,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update the liked notes state
        setLikedNotes(prev => ({
          ...prev,
          [noteId]: data.liked
        }));
        
        toast({
          title: data.liked ? "Liked!" : "Unliked!",
          description: data.liked ? "Note added to your likes" : "Note removed from your likes",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to like note",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Like error:', error);
      toast({
        title: "Error",
        description: "Failed to like note",
        variant: "destructive",
      });
    }
  };

  const handleAIAssistant = () => {
    navigate('/ai-assistant');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <Background3D />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-40 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}  // Faster transition
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBackToSubjects}
                variant="ghost"
                className="hover:bg-white/10 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subjects
              </Button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">UniNotes</h1>
                <p className="text-muted-foreground">Welcome back, {userName || 'User'}!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAIAssistant}
                variant="outline"
                className="glass border-2 hover:border-primary/50 transition-all duration-200"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button
                onClick={() => navigate('/profile')}
                variant="outline"
                className="glass border-2 hover:border-primary/50 transition-all duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="glass border-2 hover:border-destructive/50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          {/* Search and Upload */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="glass border-2 focus:border-primary transition-all duration-200 pl-10"
              />
            </div>
            <Button
              onClick={() => setUploadModalOpen(true)}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200 transform hover:scale-105"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload Note
            </Button>
          </div>
        </motion.header>
        
        {/* Notes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}  // Faster transition
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.2 }}  // Faster animation
                className="glass-card border-2 border-white/10 p-6 rounded-xl"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-white/20 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded mb-4"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              </motion.div>
            ))
          ) : (
            filteredNotes.map((note, index) => (
            <motion.div
              key={note.sl_no}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}  // Faster animation
            >
              <NoteCard 
                id={note.sl_no}
                note_title={note.note_title}
                subject={note.subject}
                department={note.department}
                semester={note.semester}
                user_name={note.user_name}
                file_name={note.file_name}
                created_at={note.created_at}
                onView={handleViewNote}
                onDownload={handleDownload}
                onLike={handleLike}
                isLiked={likedNotes[note.sl_no] || false}
              />
            </motion.div>
            ))
          )}
        </motion.div>
        
        {!isLoading && filteredNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}  // Faster transition
            className="text-center py-20"
          >
            <p className="text-2xl text-muted-foreground">No notes found</p>
            <p className="text-muted-foreground mt-2">Try a different search or upload a new note</p>
          </motion.div>
        )}
      </div>
      
      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUpload={handleUpload}
        isUploading={isUploading}
      />
    </div>
  );
}