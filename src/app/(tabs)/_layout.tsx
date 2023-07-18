import { Tabs } from 'expo-router';

import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface TabBarIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}

function TabBarIcon({ name, color }: TabBarIconProps) {
  return (
    <Ionicons size={28} style={styles.tabBarIcon} color={color} name={name} />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        headerShown: false,
        tabBarStyle: { backgroundColor: 'black' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: 'Lists',
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -3,
  },
});
