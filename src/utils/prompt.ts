import inquirer, { QuestionCollection } from "inquirer";
import validateCsvPath from "../csv/validateCsv.js";
import { PendoMetadataKind } from "../types.js";

type Answers = {
  integrationKey: string;
  kind: PendoMetadataKind;
  csvPath: string;
};

async function promptContext(): Promise<Answers> {
  return await inquirer.prompt(questions);
}

const questions: QuestionCollection<Answers> = [
  {
    type: "list",
    name: "kind",
    message: "インポートの対象を選択してください",
    choices: ["visitor", "account"],
  },
  {
    type: "input",
    name: "csvPath",
    message: "インポートするCSVファイルのパスを指定してください",
    validate: (input: string) => validateCsvPath({ csvPath: input }),
  },
  {
    type: "input",
    name: "integrationKey",
    message: "PendoのIntegrationKeyを入力してください",
    validate: (input: string) => {
      if (!input) {
        return "PendoのIntegrationKeyを入力してください";
      } else {
        return true;
      }
    },
  },
];

export default promptContext;
