import loadFromCsv from "./csv/loadFromCsv.js";
import loadVisitorCustomFieldNames from "./pendo/loadVisitorCustomFieldNames.js";
import saveCustomValues from "./pendo/saveVisitorCustomValues.js";
import convertToMetadata from "./converters/convertToMetadata.js";
import promptContext from "./utils/prompt.js";
import { exit } from "process";

(async () => {
  await main();
})();

async function main() {
  // APIキーとインポート対象の取得
  const context = await promptContext();

  // CSVファイル読み込み
  console.log(`\n${context.csvPath}をロードします...`);
  const csvData = loadFromCsv(context);
  console.log(`ファイルをロードしました。(${csvData.length}件)`);

  // Pendoに定義済みのカスタムフィールド項目名を取得
  console.log("\nPendoからカスタム項目の定義を取得します...");
  const customFieldNames = await loadVisitorCustomFieldNames(context);
  console.log(
    `下記のカスタム項目がPendoに設定されています。\n${customFieldNames}`
  );

  // CSVファイルのうち、Pendoのカスタムフィールドに未定義の列を除く
  console.log(
    "\nCSVファイルを整形し、Pendoに設定済みのカスタム項目のみを含むJSONを生成します..."
  );
  const postData = convertToMetadata({
    kind: context.kind,
    csv: csvData,
    fieldNames: customFieldNames,
  });
  console.log(`以下のデータを投入します`);
  console.log(postData);

  // PendoにPostする
  console.log("\nPendoのカスタム項目の値を更新します...");
  await saveCustomValues({ postData, ...context });
  console.log("Pendoのカスタム項目の更新が完了しました。");

  exit(0);
}
