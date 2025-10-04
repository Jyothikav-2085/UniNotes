import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check auth status and redirect
    const userId = localStorage.getItem('userId');
    const selectedBranch = localStorage.getItem('selectedBranch');
    const selectedSemester = localStorage.getItem('selectedSemester');
    
    if (userId) {
      if (!selectedBranch) {
        navigate('/branches');
      } else if (!selectedSemester) {
        navigate('/semesters');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/home');
    }
  }, [navigate]);

  return null;
};

export default Index;
