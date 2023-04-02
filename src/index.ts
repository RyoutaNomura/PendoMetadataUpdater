import loadFromCsv from "./csv/loadFromCsv.js";
import loadVisitorCustomFieldNames from "./pendo/loadVisitorCustomFieldNames.js";
import saveCustomValues from "./pendo/saveVisitorCustomValues.js";
import convertToMetadata from "./converters/convertToMetadata.js";
import promptContext from "./utils/prompt.js";

import { exit } from "process";
import getLogger from "./utils/getLogger.js";

const logger = getLogger();

(async () => {
  await main();
})();

async function main() {
  // APIキーとインポート対象の取得
  const context = await promptContext();

  logger.info("以下の設定で処理を実施します");
  logger.info("------------------------------");
  logger.info(context);
  logger.info("------------------------------");
  // CSVファイル読み込み
  logger.info(`${context.csvPath}をロードします...`);
  const csvData = loadFromCsv(context);
  logger.info(`${context.csvPath}をロードしました。(${csvData.length}件)`);

  // Pendoに定義済みのカスタムフィールド項目名を取得
  logger.info("Pendoからカスタム項目の定義を取得します...");
  const customFieldNames = await loadVisitorCustomFieldNames(context);
  logger.info("下記のカスタム項目がPendoに設定されています。");
  logger.info(customFieldNames);

  // CSVファイルのうち、Pendoのカスタムフィールドに未定義の列を除く
  logger.info("CSVファイルを整形し、Pendoに設定済みのカスタム項目のみを含むJSONを生成します...");
  const postData = convertToMetadata({
    kind: context.kind,
    csv: csvData,
    fieldNames: customFieldNames,
  });
  logger.info(`以下のデータを投入します`);
  logger.info(postData);

  // PendoにPostする
  logger.info("\nPendoのカスタム項目の値を更新します...");
  await saveCustomValues({ postData, ...context });
  logger.info("Pendoのカスタム項目の更新が完了しました。");
}
