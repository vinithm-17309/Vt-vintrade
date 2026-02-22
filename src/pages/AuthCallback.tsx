import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate("/markets"); // make sure this matches your route
      } else {
        navigate("/auth");
      }
    };

    handleAuth();
  }, []);

  return <div>Signing you in...</div>;
};

export default AuthCallback;