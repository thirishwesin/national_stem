import { AppConfig } from "../../environments/environment";

const filePath = AppConfig.production ?
  `${process.env.PORTABLE_EXECUTABLE_DIR}/data` :
  `${process.cwd()}/src/assets`;

export const AudioFile = {
  CORRECT_ANSWER: `Correct_answer.mp3`,
  WRONG_ANSWER: `Wrong_answer.mp3`
};
