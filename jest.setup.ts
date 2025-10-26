import '@testing-library/jest-native/extend-expect';

jest.mock('expo-constants', () => ({
  default: {
    manifest: {},
  },
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');

  return {
    MaterialIcons: (props: any) => React.createElement('Icon', props, props.children),
  };
});
