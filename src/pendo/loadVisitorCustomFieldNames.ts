import { PendoMetadataKind } from "../types.js";

type Props = {
  integrationKey: string;
  kind: PendoMetadataKind;
};

async function loadVisitorCustomFieldNames(props: Props) {
  const json = await apiGetV1MetadataSchemaKind(props);
  return Object.keys(json.custom);
}

async function apiGetV1MetadataSchemaKind(props: Props) {
  const END_POINT = `https://app.pendo.io/api/v1/metadata/schema/${props.kind}`;
  const res = await fetch(END_POINT, {
    method: "GET",
    headers: new Headers({
      "content-type": "application/json",
      "x-pendo-integration-key": props.integrationKey,
    }),
    redirect: "follow",
  });
  console.log(`Status: ${res.status} ${res.statusText}`);
  return await res.json();
}

export default loadVisitorCustomFieldNames;
