import { PendoMetadataKind } from "./types.js";
import loadFromCSV from "./csv/loadFromCSV.js";
import loadVisitorCustomFieldNames from "./pendo/loadVisitorCustomFieldNames.js";
import saveCustomValues from "./pendo/saveVisitorCustomValues.js";
import convertToVisitorMetadata from "./converters/convertToVisitorMetadata.js";
import inquirer from "inquirer";

import { exit } from "process";

(async () => {
  await main();
})();

async function main() {
  // APIキーとインポート対象の取得
  const context = await promptContext();

  // CSVファイル読み込み
  console.log("\nCSVファイルをロードします。");
  const csvData = loadFromCSV(context);
  console.log(`\nCSVファイルをロードしました。(${csvData.length}件)`);

  // Pendoに定義済みのカスタムフィールド項目名を取得
  console.log("\nPendoからカスタム項目の定義を取得します。");
  const customFieldNames = await loadVisitorCustomFieldNames(context);
  console.log(
    `\n下記のカスタム項目がPendoに設定されています。\n${customFieldNames}`
  );

  // CSVファイルのうち、Pendoのカスタムフィールドに未定義の列を除く
  console.log(
    "\nCSVファイルを整形し、Pendoに設定済みのカスタム項目のみを含むJSONを生成します。"
  );
  const postData = convertToVisitorMetadata({
    csv: csvData,
    fieldNames: customFieldNames,
  });
  console.log(postData);

  // PendoにPostする
  console.log("\nPendoのカスタム項目の値を更新します。");
  await saveCustomValues({ postData, ...context });
  console.log("\nPendoのカスタム項目の値を更新が完了しました。");

  exit(0);
}

async function promptContext(): Promise<{
  integrationKey: string;
  kind: PendoMetadataKind;
  csvPath: string;
}> {
  return await inquirer.prompt([
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
      validate: (input) => {
        if (!input) {
          return "インポートするCSVファイルのパスを指定してください";
        } else {
          return true;
        }
      },
    },
    {
      type: "input",
      name: "integrationKey",
      message: "PendoのIntegrationKeyを入力してください",
      validate: (input) => {
        if (!input) {
          return "PendoのIntegrationKeyを入力してください";
        } else {
          return true;
        }
      },
    },
  ]);
}
