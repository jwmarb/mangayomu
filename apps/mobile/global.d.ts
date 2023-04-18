declare module '@env' {
  export const REACT_APP_REALM_ID: string;
}

declare module 'react-native-immersive' {
  export const Immersive: {
    on: () => void;
    off: () => void;
  };
}
