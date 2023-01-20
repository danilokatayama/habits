import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

const availableWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function NewHabitForm() {
  const [title, setTitle] = useState('')
  const [weekDays, setWeekdays] = useState<number[]>([])

  async function createNewHabit(event: FormEvent) {
    event.preventDefault()

    if (!title || weekDays.length === 0) {
      return
    }
    console.log(weekDays)

    await api.post('habits', {
      title,
      weekDays
    })

    setTitle('')
    setWeekdays([])

    alert('Habit successfully created!')
  }

  function handleToggleWeekday(weekdayIndex: number) {
    if (weekDays.includes(weekdayIndex)) {
      setWeekdays(prevState => prevState.filter(weekDay => weekDay !== weekdayIndex))
    } else {
      setWeekdays(prevState => [...prevState, weekdayIndex])
    }
  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        What is your commitment?
      </label>

      <input
        type="text"
        id="title"
        placeholder="ex.: Exercises, sleep well, ..."
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-800"
        autoFocus
        value={title}
        onChange={event => setTitle(event.target.value)}
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        What is the recurrence?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {
          availableWeekdays.map((weekDay, index) => {
            return (
              <Checkbox.Root
                key={`${weekDay}`}
                className="flex items-center gap-3 group focus:outline-none"
                checked={weekDays.includes(index)}
                onCheckedChange={() => handleToggleWeekday(index)}
              >
                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
                  <Checkbox.Indicator>
                    <Check size={20} className="text-white" />
                  </Checkbox.Indicator>
                </div>

                <span className="text-white leading-tigh">
                  {weekDay}
                </span>
              </Checkbox.Root>
            )
          })
        }
        
      </div>

      <button 
        type="submit"
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        <Check size={20} weight="bold" />
        Confirm
      </button>
    </form>
  )
}