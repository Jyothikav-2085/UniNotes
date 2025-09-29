import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function GoogleLoginPage() {


  const navigate = useNavigate();


  async function saveGoogleUserToBackend(user) {
    try {
      const response = await fetch('http://localhost:5001/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          google_id: user.sub, // unique Google user ID
          avatar: user.picture
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save user info to backend');
      }
      const data = await response.json();
      console.log('Backend response:', data);
      
      // Store google_id in localStorage
      if (data.google_id) {
        localStorage.setItem('loggedInUserId', data.google_id);
        console.log('Stored user ID in localStorage:', data.google_id);
      }
    } catch (e) {
      console.error('Failed to save user to backend:', e);
      toast.error('Failed to save user info', { position: 'top-center', duration: 3000 });
    }
  }


  //handling the logout option if any
  function handlelogout() {
    googleLogout();
    console.log("logout successful");
    toast.success('Logout Successful', { position: 'top-center', duration: 3000 });
    setTimeout(() => navigate('/'), 2500);
  }


  //jsx components
  return (
    <>
      <Toaster />
      <div style={{
        transform: 'scale(1.5)',
        background: '#58761b',
        transformOrigin: '0 0',
        display: 'flex',
        height: '66.7vh',
        width: '66.6vw',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            console.log(credentialResponse);
            const user = jwtDecode(credentialResponse.credential);
            console.log(user);

            // Send user to backend for saving
            await saveGoogleUserToBackend(user);

            toast.success('Login Successful!', { position: 'top-center', duration: 3000 });
            setTimeout(() => navigate('/home'), 2500);
          }}
          onError={() => {
            console.log('Login Failed');
            toast.error('Login Failed', { position: 'top-center', duration: 3000 });
            handlelogout();
          }}
          auto_select={true}
        />
      </div>
    </>
  );
}
