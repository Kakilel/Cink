import {useState,useContext} from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import {auth} from '../firebase'
import { DashboardContext } from "../Contexts/DashboardContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {dispatch} = useContext(DashboardContext);
  const [isNewUser,setIsNewUser] = useState('')

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let userCredential;
      if(isNewUser) {
        userCredential = await createUserWithEmailAndPassword(auth,email,password)
      } else{
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )};
      dispatch({ type: "SET_USER", payload: userCredential.user });
    } catch (error) {
      let message = "Login failed.";
      if (error.code === "auth/user-not-found") {
        message = "Usre not found.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (error.code === "auth/invalid-credential") {
        message = "Invalid email or password.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={login}>
        <h2>{isNewUser ? 'Sign Up' : 'Login'}</h2>

        {error && { error }}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-medium transition duration-300 ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          {...(loading ? "Logging in ..." : "Login")}
        >{isNewUser ? 'Sign Up' : 'Login'}</button>
      </form>
      <p>
        {isNewUser ? 'Alredy have an account?' : 'New User?'}{''}
        <button type="button" 
        onClick={() => setIsNewUser(!isNewUser)}>
            {isNewUser ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </>
  );
}

export default Login;
