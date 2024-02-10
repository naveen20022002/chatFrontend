import Routes from './Routes'
import axios from 'axios'
import { UserContextProvider } from "./UserContext";

function App() {
// axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.baseURL = "https://chat-application-a4ea.onrender.com";
axios.defaults.withCredentials = true;
  return (
    <UserContextProvider> 
     <Routes/>
    </UserContextProvider>
  )
}

export default App
