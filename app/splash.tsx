// app/splash.tsx
import { View, Image, StatusBar } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/'), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-[#2F80ED]">
      {/* Hide status bar for full-screen effect */}
      <StatusBar hidden />
      <Image
        source={require('../assets/images/splash.png')}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      />
    </View>
  );
}
