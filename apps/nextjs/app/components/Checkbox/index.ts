import Checkbox from '@app/components/Checkbox/Checkbox';
export default Checkbox;
import { OverrideClassName } from '@app/hooks/useClassName';
import React from 'react';
import { AriaCheckboxProps } from 'react-aria';

export interface CheckboxProps
  extends React.PropsWithChildren,
    AriaCheckboxProps,
    OverrideClassName {}
