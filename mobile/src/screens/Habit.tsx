import { useEffect, useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from '@react-navigation/native'
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from '../utils/generate-progress-percentage'
import { HabitsEmptyList } from "../components/HabitsEmptyList";
import clsx from "clsx";

interface Params {
  date: string;
}

interface HabitsInfo {
  possibleHabits: Array <{
    id: string
    title: string
    created_at: string
  }>,
  completedHabits: string[]
}

export function Habit() {
  const [loading, setLoading] = useState(true)
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>({ possibleHabits: [], completedHabits: []})

  const route = useRoute()
  const { date } = route.params as Params

  const parsedDate = dayjs(date)
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')

  const habitsProgress = habitsInfo?.possibleHabits.length ? generateProgressPercentage(habitsInfo.possibleHabits.length, habitsInfo.completedHabits.length) : 0

  async function fetchHabits() {
    try {
      setLoading(true)

      const response = await api.get('/day', { params: { date } })

      setHabitsInfo(response.data)
    } catch(error) {
      Alert.alert('Whoops', 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    try{
      await api.patch(`/habits/${habitId}/toggle`)
  
      const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)
  
      let completedHabits: string[] = []
  
      if (isHabitAlreadyCompleted) {
        completedHabits = habitsInfo!.completedHabits.filter((id) => id !== habitId)
      } else {
        completedHabits = [...habitsInfo!.completedHabits, habitId]
      }
  
      setHabitsInfo({
        possibleHabits: habitsInfo!.possibleHabits,
        completedHabits
      })
    } catch(error) {
      Alert.alert('Whoops', 'It was not possible to update hte habit status')
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  if (loading) {
    return (
      <Loading />
    )
  }

  const isDateInPast = dayjs(date)
    .endOf('day')
    .isBefore(new Date)

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={
          clsx("mt-6", {
            ["opacity-50"]: isDateInPast
          })
        }>
          {
            habitsInfo?.possibleHabits.length > 0 ?
            habitsInfo?.possibleHabits.map(habit => {
              return (
                <Checkbox
                  key={habit.id}
                  title={habit.title}
                  checked={habitsInfo.completedHabits.includes(habit.id)}
                  disabled={isDateInPast}
                  onPress={() => handleToggleHabit(habit.id)}
                />
              )
            }) :
            <HabitsEmptyList />
          }
        </View>

        {
          isDateInPast && (
            <Text className="text-white mt-10 text-center">
              You can not edit habits from a past date
            </Text>
          )
        }
      </ScrollView>
    </View>
  )
}