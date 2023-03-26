import loadFromCSV from './csv/loadFromCSV';
import loadVisitorCustomFieldNames from './pendo/loadVisitorCustomFieldNames';
import saveVisitorCustomValues from './pendo/saveVisitorCustomValues';
import convertToVisitorMetadata from './converters/convertToVisitorMetadata';
import { prompt } from './utils/prompt';

import { exit } from 'process';

(async () => {
    await main();
})();

async function main() {
    // APIキーとインポート対象の取得
    const context = await promptContext();

    // CSVファイル読み込み
    console.log('\nCSVファイルをロードします。');
    const csvData = loadFromCSV(context);
    console.log(`\nCSVファイルをロードしました。(${csvData.length}件)`);

    // Pendoに定義済みのカスタムフィールド項目名を取得
    console.log('\nPendoからカスタム項目の定義を取得します。');
    const customFieldNames = await loadVisitorCustomFieldNames(context);
    console.log(`\n下記のカスタム項目がPendoに設定されています。\n${customFieldNames}`);

    // CSVファイルのうち、Pendoのカスタムフィールドに未定義の列を除く
    console.log('\nCSVファイルを整形し、Pendoに設定済みのカスタム項目のみを含むJSONを生成します。');
    const postData = convertToVisitorMetadata({ csv: csvData, fieldNames: customFieldNames });
    console.log(postData);

    // PendoにPostする
    console.log('\nPendoのカスタム項目の値を更新します。');
    await saveVisitorCustomValues({ postData, ...context });
    console.log('\nPendoのカスタム項目の値を更新が完了しました。');

    exit(0);
}

async function promptContext(): Promise<{ integrationKey: string; csvPath: string }> {
    const integrationKey = await prompt({ message: "\nPendoのIntegrationKeyを入力してください" });
    if (!integrationKey) {
        console.log("IntegrationKeyが未入力のため、処理を中止します。");
        exit(1);
    }
    const csvPath = await prompt({ message: "\nインポートするCSVファイルのパスを指定してください" });
    if (!csvPath) {
        console.log("インポートファイルが未入力のため、処理を中止します。");
        exit(1);
    }
    const confirmationResponse = await prompt({ message: `\n下記で処理を実施しますがよろしいですか?(y/n)\n  IntegrationKey: ${integrationKey}\n  CsvFile: ${csvPath}` });
    if (confirmationResponse !== "y") {
        exit(0);
    }

    return { integrationKey, csvPath };
}
