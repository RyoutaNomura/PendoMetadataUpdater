import { VisitorMetadata } from "../types.js";

function convertToVisitorMetadata({
  csv,
  fieldNames,
}: {
  csv: Array<any>;
  fieldNames: Array<string>;
}): Array<VisitorMetadata> {
  return csv.map((row) => {
    const visitorId = row.visitorId as string;
    const values = fieldNames
      .filter((fieldName) => !!row[fieldName])
      .reduce((acc, fieldName) => {
        acc[fieldName] = row[fieldName];
        return acc;
      }, {} as VisitorMetadata["values"]);

    return {
      visitorId: visitorId,
      values: values,
    };
  });
}

export default convertToVisitorMetadata;
