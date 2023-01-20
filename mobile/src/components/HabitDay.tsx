import clsx from "clsx";
import dayjs from "dayjs";
import { Dimensions, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

const WEEK_DAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_SIZE =  (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5)

interface HabitDayProps extends TouchableOpacityProps {
  date: Date;
  amount?: number;
  completed?: number;
}

export function HabitDay({ amount = 0, completed = 0, date, ...rest }: HabitDayProps) {
  const completionPercentage = amount > 0 ? generateProgressPercentage(amount, completed) : 0
  const today = dayjs().startOf('day').toDate()
  const isCurrentDay = dayjs(date).isSame(today)
  
  return (
    <TouchableOpacity
      className={clsx("rounded-lg border-2 m-1", {
        'bg-zinc-900 border-zinc-800': completionPercentage === 0,
        'bg-violet-900 border-violet-700': completionPercentage > 0 && completionPercentage < 20,
        'bg-violet-800 border-violet-600': completionPercentage >= 20 && completionPercentage < 40,
        'bg-violet-700 border-violet-500': completionPercentage >= 40 && completionPercentage < 60,
        'bg-violet-600 border-violet-500': completionPercentage >= 60 && completionPercentage < 80,
        'bg-violet-500 border-violet-400': completionPercentage >= 80,
        'border-white border-4': isCurrentDay,
      })}
      style={{ width: DAY_SIZE, height: DAY_SIZE }}
      activeOpacity={0.7}
      {...rest}
    />
  )
}