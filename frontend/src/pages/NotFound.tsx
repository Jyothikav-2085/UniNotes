import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from 'framer-motion';
import { Background3D } from '@/components/Background3D';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Background3D />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 left-40 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative z-10"
      >
        <Card className="glass-card border-2 p-12 text-center max-w-lg">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-9xl font-bold gradient-text mb-4 animate-glow">404</h1>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all transform hover:scale-105"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;
