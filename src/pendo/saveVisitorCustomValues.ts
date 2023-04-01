import {
  VisitorMetadata,
  AccountMetadata,
  PendoMetadataKind,
} from "../types.js";

async function saveVisitorCustomValues({
  integrationKey,
  postData,
}: {
  integrationKey: string;
  postData: Array<VisitorMetadata>;
}) {
  await apiPostV1MetadataKindGroupValue({
    integrationKey: integrationKey,
    kind: "visitor",
    data: postData,
  });
}

async function apiPostV1MetadataKindGroupValue({
  integrationKey,
  kind,
  data,
}: {
  integrationKey: string;
  kind: PendoMetadataKind;
  data: Array<VisitorMetadata | AccountMetadata>;
}) {
  const END_POINT = `https://app.pendo.io/api/v1/metadata/${kind}/custom/value`;
  const res = await fetch(END_POINT, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
      "x-pendo-integration-key": integrationKey,
    }),
    body: JSON.stringify(data),
    redirect: "follow",
  });
  console.log(`Status: ${res.status} ${res.statusText}`);
  console.log(await res.text());
}

export default saveVisitorCustomValues;
