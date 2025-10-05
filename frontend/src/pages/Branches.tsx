import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Background3D } from '@/components/Background3D';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, GraduationCap, LogOut, User } from 'lucide-react';

// Sample branches data - replace with your actual data
const branches = [
  { id: 'cse', name: 'Computer Science Engineering', code: 'CSE', color: 'from-blue-500 to-cyan-500' },
  { id: 'ise', name: 'Information Science Engineering', code: 'ISE', color: 'from-green-500 to-emerald-500' },
  { id: 'aiml', name: 'Artificial Intelligence & Machine Learning', code: 'AIML', color: 'from-purple-500 to-pink-500' },
  { id: 'aids', name: 'Artificial Intelligence & Data Science', code: 'AIDS', color: 'from-indigo-500 to-purple-500' },
  { id: 'ece', name: 'Electronics & Communication Engineering', code: 'ECE', color: 'from-orange-500 to-red-500' },
  { id: 'eee', name: 'Electrical & Electronics Engineering', code: 'EEE', color: 'from-yellow-500 to-orange-500' },
  { id: 'mechanical', name: 'Mechanical Engineering', code: 'MECHANICAL', color: 'from-red-500 to-pink-500' },
  { id: 'civil', name: 'Civil Engineering', code: 'CIVIL', color: 'from-teal-500 to-cyan-500' },
];

export default function Branches() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    
    if (!userId) {
      navigate('/auth');
      return;
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/auth');
  };

  const handleBranchSelect = (branchId: string) => {
    // Store selected branch and navigate to semesters
    localStorage.setItem('selectedBranch', branchId);
    navigate('/semesters');
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
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">UniNotes</h1>
              <p className="text-muted-foreground">Welcome back, {userName || 'User'}!</p>
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

        {/* Branches Selection */}
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
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Select Your Branch</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose your engineering branch to access relevant notes and materials
          </p>
        </motion.div>

        {/* Branches Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}  // Faster transition
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {branches.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05, duration: 0.2 }}  // Faster and staggered
              whileHover={{ scale: 1.03, y: -5 }}  // Simplified hover effect
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="glass-card border-2 border-white/10 hover:border-primary/50 transition-all duration-200 cursor-pointer group glow"
                onClick={() => handleBranchSelect(branch.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${branch.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">{branch.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold">
                    {branch.code}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBranchSelect(branch.id);
                    }}
                  >
                    Select Branch
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