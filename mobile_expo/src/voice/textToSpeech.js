import * as Speech from "expo-speech";

export function speak(text, language = "en-IN") {
  Speech.stop();
  Speech.speak(text, {
    language,
    pitch: 1,
    rate: 0.95,
  });
}
