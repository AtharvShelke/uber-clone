import { Redirect, Stack } from "expo-router"
import { useAuth } from '@clerk/clerk-expo'

const Layout = () => {
  const { isSignedIn, isLoaded } = useAuth()
  
  // Wait for Clerk to load
  if (!isLoaded) {
    return null; // Or a loading spinner
  }
  
  // If not signed in, redirect to welcome
  if (!isSignedIn) {
    return <Redirect href="/(auth)/welcome" />
  }
  
  return (
   <Stack>
    <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
   </Stack>
  )
}

export default Layout
