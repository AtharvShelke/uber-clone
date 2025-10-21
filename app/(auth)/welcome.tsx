import {  Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const Welcome = () => {
  return (
    <SafeAreaView className='flex h-full items-center justify-between bg-white'>
      <TouchableOpacity>
        <Text
        onPress={()=>{router.replace("/(auth)/sign-up")}}
        className='w-full flex justify-end items-end p-5' 
        >
          Skip
          </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Welcome