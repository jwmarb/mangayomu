import createContext from '@app/helpers/createContext';

interface RadioGroupProps<T> extends React.PropsWithChildren {
  selected: T;
  onChange: (newVal: T) => void;
}

export const [RadioContext, useRadioContext] = createContext<unknown>();

export const [RadioOnChangeContext, useRadioOnChangeContext] =
  createContext<(newVal: unknown) => void>();

export default function RadioGroup<T>(props: RadioGroupProps<T>) {
  const { selected, children, onChange } = props;
  return (
    <RadioContext.Provider value={selected}>
      <RadioOnChangeContext.Provider
        value={onChange as (newVal: unknown) => void}
      >
        {children}
      </RadioOnChangeContext.Provider>
    </RadioContext.Provider>
  );
}
