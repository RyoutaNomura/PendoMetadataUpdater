import fetch from "node-fetch";
import split from 'just-split';

import getLogger from "../utils/getLogger.js";

const logger = getLogger();

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
      logger.error("下記のデータ更新でエラーが発生しました");
      logger.error(props.postData);
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

  logger.info("------------------------------");
  logger.info(`EndPoint: ${END_POINT}`);
  if (res.status !== 200) {
    logger.error(`Status: ${res.status} ${res.statusText}`);
    logger.error(await res.text());
    logger.info("------------------------------");
    throw new Error("APIリクエストに失敗しました");
  } else {
    logger.info(`Status: ${res.status} ${res.statusText}`);
    logger.info(await res.text());
    logger.info("------------------------------");
  }
}

export default saveCustomValues;
