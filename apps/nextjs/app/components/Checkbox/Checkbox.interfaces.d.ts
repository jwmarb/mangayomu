import { OverrideClassName } from '@app/hooks/useClassName';
import React from 'react';
import { AriaCheckboxProps } from 'react-aria';

export interface CheckboxProps
  extends React.PropsWithChildren,
    AriaCheckboxProps,
    OverrideClassName {}
