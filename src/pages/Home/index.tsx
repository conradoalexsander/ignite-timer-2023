import { Play } from "phosphor-react";
import {
    CountDownContainer,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    Separator,
    StartCountdownButton,
    TaskInput,
} from "./styles";

export function Home() {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">I will work in</label>
          <TaskInput
            id="task"
            type="text"
            placeholder="Give a nice name to your project"
          />

          <label htmlFor="minutesAmount">while</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
          />

          <span>minutes.</span>
        </FormContainer>

        <CountDownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>

        <StartCountdownButton type="submit">
          <Play size={24} />
          Start
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
