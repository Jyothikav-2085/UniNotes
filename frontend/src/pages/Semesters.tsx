import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Background3D } from '@/components/Background3D';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, LogOut, User } from 'lucide-react';

// Sample semesters data
const semesters = [
  { id: '1', name: 'First Semester', number: 1, subjects: ['Mathematics I', 'Physics', 'Chemistry', 'English'] },
  { id: '2', name: 'Second Semester', number: 2, subjects: ['Mathematics II', 'Programming', 'Electronics', 'Mechanics'] },
  { id: '3', name: 'Third Semester', number: 3, subjects: ['Data Structures', 'Digital Electronics', 'Engineering Drawing', 'Statistics'] },
  { id: '4', name: 'Fourth Semester', number: 4, subjects: ['Algorithms', 'Microprocessors', 'Database Systems', 'Economics'] },
  { id: '5', name: 'Fifth Semester', number: 5, subjects: ['Computer Networks', 'Operating Systems', 'Software Engineering', 'Management'] },
  { id: '6', name: 'Sixth Semester', number: 6, subjects: ['Machine Learning', 'Web Development', 'Mobile Computing', 'Project Management'] },
  { id: '7', name: 'Seventh Semester', number: 7, subjects: ['Artificial Intelligence', 'Cloud Computing', 'Cybersecurity', 'Internship'] },
  { id: '8', name: 'Eighth Semester', number: 8, subjects: ['Final Year Project', 'Professional Ethics', 'Entrepreneurship', 'Placement Preparation'] },
];

export default function Semesters() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const branch = localStorage.getItem('selectedBranch');
    
    if (!userId) {
      navigate('/auth');
      return;
    }
    
    if (!branch) {
      navigate('/branches');
      return;
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    setSelectedBranch(branch);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('selectedBranch');
    navigate('/auth');
  };

  const handleSemesterSelect = (semesterId: string) => {
    // Store selected semester and navigate to subjects
    localStorage.setItem('selectedSemester', semesterId);
    navigate('/subjects');
  };

  const handleBackToBranches = () => {
    localStorage.removeItem('selectedBranch');
    navigate('/branches');
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
                onClick={handleBackToBranches}
                variant="ghost"
                className="hover:bg-white/10 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Branches
              </Button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">UniNotes</h1>
                <p className="text-muted-foreground">Welcome back, {userName || 'User'}!</p>
              </div>
            </div>
            <div className="flex gap-2">
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
        </motion.header>

        {/* Semesters Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}  // Faster transition
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20, duration: 0.3 }}  // Faster spring animation
            className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <BookOpen className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Select Your Semester</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose your current semester to access relevant notes and materials
          </p>
        </motion.div>

        {/* Semesters Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}  // Faster transition
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {semesters.map((semester, index) => (
            <motion.div
              key={semester.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05, duration: 0.2 }}  // Faster and staggered
              whileHover={{ scale: 1.03, y: -5 }}  // Simplified hover effect
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="glass-card border-2 border-white/10 hover:border-primary/50 transition-all duration-200 cursor-pointer group glow"
                onClick={() => handleSemesterSelect(semester.id)}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl font-bold text-white">{semester.number}</span>
                  </div>
                  <CardTitle className="text-lg font-bold">{semester.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {semester.subjects.length} subjects
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Key Subjects:</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {semester.subjects.slice(0, 2).map((subject, idx) => (
                        <span key={idx} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded transition-all duration-200">
                          {subject}
                        </span>
                      ))}
                      {semester.subjects.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{semester.subjects.length - 2} more</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSemesterSelect(semester.id);
                    }}
                  >
                    Select Semester
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}