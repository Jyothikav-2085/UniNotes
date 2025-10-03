import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function GoogleLoginPage() {
  const navigate = useNavigate();

  async function saveGoogleUserToBackend(user) {
    try {
      const response = await fetch("http://localhost:5001/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          google_id: user.sub,
          avatar: user.picture,
        }),
      });
      if (!response.ok) throw new Error("Failed to save user info to backend");

      const data = await response.json();
      console.log("Backend response:", data);

      // ONLY store user ID if backend provides valid numeric ID
      if (data.signupId && Number.isInteger(data.signupId)) {
        localStorage.setItem("loggedInUserId", data.signupId.toString());
        localStorage.setItem("loggedInUserName", data.name);
      } else {
        // No valid numeric ID returned from backend - do not fallback to Google sub
        console.error(
          "Login failed: invalid user ID from backend",
          data.signupId
        );
        toast.error("Login failed: invalid user ID from backend", {
          position: "top-center",
          duration: 3000,
        });
        // Optionally clear localStorage or logout user here
        googleLogout();
        return; // stop further processing
      }
    } catch (e) {
      console.error("Failed to save user to backend:", e);
      toast.error("Failed to save user info", {
        position: "top-center",
        duration: 3000,
      });
    }
  }

  // Handling the logout option if any
  function handlelogout() {
    googleLogout();
    console.log("logout successful");
    toast.success("Logout Successful", {
      position: "top-center",
      duration: 3000,
    });
    setTimeout(() => navigate("/"), 2500);
  }

  // JSX components
  return (
    <>
      <Toaster />
      <div
        style={{
          transform: "scale(1.5)",
          background: "#58761b",
          transformOrigin: "0 0",
          display: "flex",
          height: "66.7vh",
          width: "66.6vw",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            console.log(credentialResponse);
            const user = jwtDecode(credentialResponse.credential);
            console.log(user);

            // Send user to backend for saving
            await saveGoogleUserToBackend(user);

            toast.success("Login Successful!", {
              position: "top-center",
              duration: 3000,
            });
            setTimeout(() => navigate("/home"), 2500);
          }}
          onError={() => {
            console.log("Login Failed");
            toast.error("Login Failed", {
              position: "top-center",
              duration: 3000,
            });
            handlelogout();
          }}
          auto_select={true}
        />
      </div>
    </>
  );
}
