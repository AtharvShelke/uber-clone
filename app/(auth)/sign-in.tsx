import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { icons, images } from '@/constants';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import { Link, useRouter } from 'expo-router';
import OAuth from '@/components/OAuth';
import { useSignIn } from '@clerk/clerk-expo';

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const onSignIn = async () => {
    if (!isLoaded || loading) return;

    if (!form.email || !form.password) {
      Alert.alert('Missing info', 'Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email.trim(),
        password: form.password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(root)/(tabs)/home');
      } else {
        Alert.alert('Action needed', 'Sign-in incomplete. Please complete the remaining steps.');
        console.warn('Sign-in not complete:', JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || 'Unable to sign in. Check your credentials and try again.';
      Alert.alert('Sign-in error', msg);
      console.error('SignIn error:', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">Welcome</Text>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton title={loading ? 'Signing in...' : 'Sign In'} className="mt-6" onPress={onSignIn} disabled={loading} />

          <OAuth />

          <Link href="/sign-up" className="text-lg text-center text-general-200 mt-10">
            <Text>Don't have an account? </Text>
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
