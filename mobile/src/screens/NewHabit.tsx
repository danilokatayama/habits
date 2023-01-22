import { useState } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { Feather } from '@expo/vector-icons'

import colors from 'tailwindcss/colors'
import { api } from "../lib/axios";

const availableweekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function NewHabit() {
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

  function handleToggleweekDay(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
    } else {
      setWeekDays(prevState => [...prevState, weekDayIndex])
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim() || weekDays.length === 0) {
        return Alert.alert('New Habit', 'Inform the habit and choose the frequency')
      }

      await api.post('/habits', {
        title,
        weekDays
      })

      setTitle('')
      setWeekDays([])

      Alert.alert('New Habit', 'Habit successfully created!')
    } catch(error) {
      Alert.alert('Whoops', 'Something went wrong')
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >

        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Create Habit
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          What is your commitment?
        </Text>

        <TextInput
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="ex.: Exercices, sleep well, ..."
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          What is recurrence?
        </Text>

        {
          availableweekDays.map((weekDay, index) => {
            return (
              <Checkbox
                key={`${weekDay}`}
                title={weekDay}
                checked={weekDays.includes(index)}
                onPress={() => handleToggleweekDay(index)}
              />
            )
          })
        }

        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
        >
          <Feather 
            name="check"
            size={20}
            color={colors.white}
          />

          <Text className="font-semibold text-base text-white ml-2">
            Confirm
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}