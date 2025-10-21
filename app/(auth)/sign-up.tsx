import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { icons, images } from '@/constants';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import { Link, useRouter } from 'expo-router';
import OAuth from '@/components/OAuth';
import { useSignUp } from '@clerk/clerk-expo';
import ReactNativeModal from 'react-native-modal';

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [pendingVerification, setPendingVerification] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    if (!isLoaded || loading) return;

    // Basic client-side validation
    if (!form.email || !form.password) {
      Alert.alert('Missing info', 'Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      // Clerk expects emailAddress/password keys; optionally send firstName
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
        firstName: form.name || undefined,
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || 'Sign up failed. Please try again.';
      Alert.alert('Sign up error', msg);
      console.error('SignUp error:', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || loading) return;

    if (!code) {
      Alert.alert('Missing code', 'Enter the verification code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        
        // Close verification modal first, then show success modal
        setPendingVerification(false);
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 300); // Small delay for smooth transition
      } else {
        // Could be needs_second_factor or other next steps depending on your Clerk settings
        Alert.alert('Verification incomplete', 'Please complete the remaining steps.');
        console.warn('SignUp not complete:', JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || 'Invalid verification code.';
      Alert.alert('Verification error', msg);
      console.error('Verify error:', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value.trim() })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title={loading ? 'Creating account...' : 'Sign up'}
            className="mt-6"
            onPress={onSignup}
            disabled={loading}
          />

          <OAuth />

          <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>

        {/* Modal 1: Verification In Progress */}
        <ReactNativeModal isVisible={pendingVerification}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-3xl font-JakartaBold text-center">
              Verification
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              We've sent a verification code to {form.email}
            </Text>
            <InputField
              label="Code"
              value={code}
              placeholder="Enter your verification code"
              onChangeText={setCode}
              keyboardType="number-pad"
              className="rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 text-left"
            />
            <CustomButton
              title={loading ? 'Verifying...' : 'Verify Email'}
              onPress={onVerifyPress}
              disabled={loading}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>

        {/* Modal 2: Verification Complete */}
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/(root)/(tabs)/home');
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
