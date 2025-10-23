import 'react-native-get-random-values';
import { Tabs } from 'expo-router';
import { Image, ImageSourcePropType, View } from 'react-native';
import { icons } from '@/constants';

interface TabIconProps {
  focused: boolean;
  source: ImageSourcePropType;
  color: string;
}

const TabIcon = ({ focused, source, color }: TabIconProps) => (
  <View className={`flex-row justify-center items-center rounded-full ${focused ? 'bg-general-300' : ''}`}>
    <View className={`rounded-full w-12 h-12 items-center justify-center ${focused ? 'bg-general-400' : ''}`}>
      <Image 
        source={source} 
        tintColor={color}
        resizeMode="contain" 
        className="w-7 h-7"
      />
    </View>
  </View>
);

const TAB_SCREENS = [
  { name: 'home', title: 'Home', icon: icons.home },
  { name: 'rides', title: 'Rides', icon: icons.list },
  { name: 'chat', title: 'Chat', icon: icons.chat },
  { name: 'profile', title: 'Profile', icon: icons.profile },
] as const;

export default function TabsLayout() {
  return (
    <Tabs 
      initialRouteName="home" 
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#333333',
          borderRadius: 50,
          overflow: 'hidden',
          marginHorizontal: 20,
          marginBottom: 25,
          
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          display:"flex",
          flexDirection:"row",
          justifyContent:"space-evenly",
          
        },
        tabBarItemStyle: {
          height: 58,
        },
      }}
    >
      {TAB_SCREENS.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon focused={focused} source={icon} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
