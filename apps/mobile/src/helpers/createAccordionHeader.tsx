import Section, { SectionHeaderProps } from '@components/Filters/Section';

export default function createAccordionHeader<
  T,
  K extends keyof {
    [L in keyof NonNullable<T> as NonNullable<T>[L] extends (
      key: string,
    ) => void
      ? L
      : never]: NonNullable<T>[L];
  },
>(
  Context: React.Context<T>,
  togglerKey: K,
): React.FC<Omit<SectionHeaderProps, 'toggle'>> {
  return (props: Omit<SectionHeaderProps, 'toggle'>) => {
    return (
      <Context.Consumer>
        {(value) =>
          value != null && (
            <Section
              {...props}
              toggle={value[togglerKey] as (key: string) => void}
            />
          )
        }
      </Context.Consumer>
    );
  };
}
