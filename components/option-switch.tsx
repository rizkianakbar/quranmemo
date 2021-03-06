import { ReactElement, useEffect } from 'react';
import {
  BottomSheetProps,
  ReactSpringBottomSheetUsage,
} from './ui/bottomsheet';

export enum Option {
  ReactSpringBottomSheet,
}

type OptionSwitchProps = BottomSheetProps & {
  option: Option;
  title: string;
  content: ReactElement | null;
  footer?: string;
};

export const OptionSwitch = ({ option, ...props }: OptionSwitchProps) => {
  useEffect(() => () => props.onDismiss(), []);

  switch (option) {
    case Option.ReactSpringBottomSheet:
      return <ReactSpringBottomSheetUsage {...props} />;
  }
};
