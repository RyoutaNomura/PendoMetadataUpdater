import fs from "fs";
import Papa from "papaparse";

function loadFromCsv({ csvPath }: { csvPath: string }) {
  const file = fs.readFileSync(csvPath, "utf8");
  const csv = Papa.parse<Array<any>>(file, {
    header: true,
  });
  return csv.data;
}

export default loadFromCsv;
