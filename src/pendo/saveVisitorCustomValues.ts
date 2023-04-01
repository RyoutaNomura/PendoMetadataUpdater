import fetch from "node-fetch";
import {
  VisitorMetadata,
  AccountMetadata,
  PendoMetadataKind,
} from "../types.js";

type Props = {
  integrationKey: string;
  kind: PendoMetadataKind;
  postData: Array<VisitorMetadata | AccountMetadata>;
};

async function saveCustomValues(props: Props) {
  await apiPostV1MetadataKindGroupValue(props);
}

async function apiPostV1MetadataKindGroupValue(props: Props) {
  const END_POINT = `https://app.pendo.io/api/v1/metadata/${props.kind}/custom/value`;
  const res = await fetch(END_POINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-pendo-integration-key": props.integrationKey,
    },
    body: JSON.stringify(props.postData),
    redirect: "follow",
  });
  console.log(`Status: ${res.status} ${res.statusText}`);
  console.log(await res.text());
}

export default saveCustomValues;
