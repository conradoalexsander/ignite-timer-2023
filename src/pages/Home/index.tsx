import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInSeconds } from "date-fns";
import { HandPalm, Play } from "phosphor-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import {
  BasePrimaryButton,
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountDownButton,
  StopCountDownButton,
  TaskInput,
} from "./styles";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Inform the task"),
  minutesAmount: zod.number().min(5).max(60),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interuptedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const task = watch("task");
  const isSubmitDisabled = !task;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;
  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
        );
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle]);

  useEffect(() => {
    document.title = `${minutes}:${seconds}`;
  }, [minutes, seconds, activeCycle]);

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPassed(0);
    reset();
  }

  function handleInterruptCycle() {
    setActiveCycleId(null);
    setCycles(
      cycles.map((cycle) =>
        cycle.id === activeCycleId
          ? { ...cycle, interruptedDate: new Date() }
          : cycle,
      ),
    );
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">I will work in</label>
          <TaskInput
            id="task"
            type="text"
            placeholder="Give a nice name to your project"
            list="task-suggestions"
            disabled={!!activeCycle}
            {...register("task")}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Projeto 4" />
          </datalist>

          <label htmlFor="minutesAmount">while</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            step={5}
            min={5}
            // in case there wasn't this html validation, zod form state validation would catch the error
            max={60}
            disabled={!!activeCycle}
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minutes.</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>

        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Stop
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Start
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  );
}
