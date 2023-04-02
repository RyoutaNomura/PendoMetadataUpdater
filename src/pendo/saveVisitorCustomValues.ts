import fetch from "node-fetch";
import split from 'just-split';

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

const batchSize = 1000;

async function saveCustomValues(props: Props) {
  const dataArray = split(props.postData, batchSize);
  await Promise.all(dataArray.map(async (v) => {
    try {
      await apiPostV1MetadataKindGroupValue({
        integrationKey: props.integrationKey,
        kind: props.kind,
        postData: v
      });
    } catch (e) {
      console.log("下記のデータ更新でエラーが発生しました");
      console.log(props.postData);
    }
  }));
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
  if (res.status !== 200) {
    throw new Error();
  }
}

export default saveCustomValues;
