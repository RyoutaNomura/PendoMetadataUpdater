import * as fs from "fs";

function validateCsvPath({ csvPath }: { csvPath: string }): boolean | string {
  if (!csvPath) {
    return "パスが未指定です";
  }
  if (!fs.existsSync(csvPath)) {
    return "指定されたパスにはファイルが存在しません";
  }
  return true;
}

export default validateCsvPath;
