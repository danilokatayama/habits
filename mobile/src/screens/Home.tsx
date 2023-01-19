import { Text, View, ScrollView } from "react-native";

import { generateDatesSinceYearBeginning } from "../utils/generate-dates-since-year-beginning";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const summaryDates = generateDatesSinceYearBeginning()

const minimumSummaryDatesSize = 12 * 7 // 12 weeks
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

export function Home() {
  const { navigate } = useNavigation()

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {
          weekDays.map((weekDay, index) => (
            <Text 
              key={`${weekDay}-${index}`}
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{ width: DAY_SIZE }}
            >
              {weekDay}
            </Text>
          ))
        }
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {
            summaryDates.map(date => (
              <HabitDay
                key={date.toISOString()}
                onPress={() => navigate('habit', {
                  date: date.toISOString()
                })}
              />
            ))
          }

          {
            amountOfDaysToFill > 0 && Array
              .from({ length: amountOfDaysToFill })
              .map((_, index) => (
                <View
                  key={index}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              ))
          }
        </View>
      </ScrollView>
    </View>
  )
}