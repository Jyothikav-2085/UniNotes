import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Background3D } from '@/components/Background3D';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Users, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Smart Notes",
      description: "Upload and organize your study materials effortlessly"
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Get intelligent insights from your notes"
    },
    {
      icon: Users,
      title: "Collaborative",
      description: "Share and learn together with your peers"
    },
    {
      icon: Zap,
      title: "Fast Access",
      description: "Find what you need instantly with smart search"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background3D />
      
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-8 h-8 text-primary animate-glow" />
            <span className="text-2xl font-bold gradient-text">UniNotes</span>
          </motion.div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/auth?mode=login')}
              variant="ghost"
              className="hover:bg-white/10"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/auth?mode=signup')}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="glass-card px-6 py-2 rounded-full text-sm text-primary border border-primary/20">
              ✨ The Future of Student Notes
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
            Your Notes,
            <br />
            Reimagined
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload, organize, and access your study materials with cutting-edge 
            AI technology. Make learning smarter, not harder.
          </p>

          <div className="flex gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/auth?mode=signup')}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6"
              >
                Get Started Free
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/auth?mode=login')}
                size="lg"
                variant="outline"
                className="glass border-2 hover:border-primary/50 text-lg px-8 py-6"
              >
                Sign In
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-6 rounded-2xl border border-white/10 group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/50"
              >
                <feature.icon className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 glass-card p-12 rounded-3xl border border-white/10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Ready to Transform Your Studies?
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of students already using UniNotes to ace their exams
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/auth?mode=signup')}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-12 py-6"
              >
                Start Learning Today
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;