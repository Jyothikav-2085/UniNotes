import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Background3D } from '@/components/Background3D';
import { ArrowLeft, Download, Share2, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// Sample note data - replace with your actual data fetching
const sampleNoteDetails = {
  '1': {
    title: 'Introduction to React',
    description: 'Fundamentals of React including components, props, and state',
    date: '2024-01-15',
    tags: ['React', 'JavaScript', 'Frontend'],
    content: `
# Introduction to React

React is a powerful JavaScript library for building user interfaces. It was developed by Facebook and has become one of the most popular frontend frameworks.

## Key Concepts

### Components
Components are the building blocks of React applications. They can be functional or class-based.

### Props
Props allow you to pass data from parent to child components.

### State
State allows components to manage their own data and re-render when that data changes.

## Getting Started

\`\`\`jsx
import React from 'react';

function App() {
  return <h1>Hello React!</h1>;
}
\`\`\`

This is a simple example of a React component.
    `,
    fileUrl: '/sample.pdf',
  },
};

export default function NoteDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Get note data - replace with your actual data fetching
  const note = id ? sampleNoteDetails[id as keyof typeof sampleNoteDetails] : null;

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
    // TODO: Connect to your existing download backend
    console.log('Download note:', id);
  };

  const handleShare = () => {
    // TODO: Connect to your existing share backend
    console.log('Share note:', id);
  };

  const handleDelete = () => {
    // TODO: Connect to your existing delete backend
    console.log('Delete note:', id);
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
                {note.title}
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground"
              >
                {note.description}
              </motion.p>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground mt-2"
              >
                Created: {note.date}
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
          {note.tags.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {note.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="px-4 py-2 text-sm rounded-full glass border border-primary/30 text-primary"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          )}
        </motion.div>
        
        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-2 glow">
            <CardHeader>
              <CardTitle>Note Content</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {note.content}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
