import { AccountMetadata, PendoMetadataKind, VisitorMetadata } from "../types.js";

function convertToMetadata({
  kind,
  csv,
  fieldNames,
}: {
  kind: PendoMetadataKind,
  csv: Array<any>;
  fieldNames: Array<string>;
}): Array<AccountMetadata | VisitorMetadata> {
  return csv.map((row) => {

    const values = fieldNames
      .filter((fieldName) => !!row[fieldName])
      .reduce((acc, fieldName) => {
        acc[fieldName] = row[fieldName];
        return acc;
      }, {} as VisitorMetadata["values"]);

    switch (kind) {
      case "account":
        return { accountId: row.accountId as string, values };
      case "visitor":
        return { visitorId: row.visitorId as string, values };
      default:
        throw new Error(`Unknown kind: ${kind}`);
    }
  });
}

export default convertToMetadata;
