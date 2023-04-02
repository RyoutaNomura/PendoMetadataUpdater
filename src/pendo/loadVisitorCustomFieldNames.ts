import fetch from "node-fetch";
import { PendoMetadataKind } from "../types.js";
import getLogger from "../utils/getLogger.js";

const logger = getLogger();

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
    headers: {
      "content-type": "application/json",
      "x-pendo-integration-key": props.integrationKey,
    },
    redirect: "follow",
  });

  logger.info("------------------------------");
  logger.info(`EndPoint: ${END_POINT}`);
  logger.info(`Status: ${res.status} ${res.statusText}`);
  if (res.status !== 200) {
    throw new Error("APIリクエストに失敗しました");
  }
  logger.info("------------------------------");

  return (await res.json()) as any;
}

export default loadVisitorCustomFieldNames;
