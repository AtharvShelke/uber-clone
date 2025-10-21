import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const App = () => {
    const { isSignedIn, isLoaded } = useAuth()
  
  // Wait for Clerk to load
  if (!isLoaded) {
    return null; // Or a loading spinner
  }
  
  // If signed in, redirect to home
  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)/home" />
  }
    return <Redirect href="/(auth)/welcome" />
}

export default App;
