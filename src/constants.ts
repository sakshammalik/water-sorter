export const colorMapping: Record<string, string> = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500'
}

export const PROPORTION_VALUE = 20;
export const MAX_COLOR_LENGTH = 4;

export const initialState: Record<string, any> = {
  "1": {
    key: "first_container",
    position: { top: 0, bottom: 0, left: PROPORTION_VALUE * -5, right: 0 },
    colors: ["red", "blue", "green", "blue"],
  },
  "2": {
    key: "second_container",
    position: { top: 0, bottom: 0, left: 0, right: 0 },
    colors: ["blue", "red", "red", "green"],
  },
  "3": {
    key: "third_container",
    position: { top: 0, bottom: 0, left: PROPORTION_VALUE * 5, right: 0 },
    colors: ["green", "green", "blue", "red"],
  },
  "4": {
    key: "fourth_container",
    position: {
      top: PROPORTION_VALUE * 10,
      bottom: 0,
      left: PROPORTION_VALUE * -5,
      right: 0,
    },
    colors: [],
  },
};
