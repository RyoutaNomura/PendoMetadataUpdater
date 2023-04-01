import { PendoMetadataKind } from "../types.js";

async function loadVisitorCustomFieldNames({
  integrationKey,
}: {
  integrationKey: string;
}) {
  const json = await apiGetV1MetadataSchemaKind({
    integrationKey: integrationKey,
    kind: "visitor",
  });
  return Object.keys(json.custom);
}

async function apiGetV1MetadataSchemaKind({
  integrationKey,
  kind,
}: {
  integrationKey: string;
  kind: PendoMetadataKind;
}) {
  const END_POINT = `https://app.pendo.io/api/v1/metadata/schema/${kind}`;
  const res = await fetch(END_POINT, {
    method: "GET",
    headers: new Headers({
      "content-type": "application/json",
      "x-pendo-integration-key": integrationKey,
    }),
    redirect: "follow",
  });
  console.log(`Status: ${res.status} ${res.statusText}`);
  return await res.json();
}

export default loadVisitorCustomFieldNames;
