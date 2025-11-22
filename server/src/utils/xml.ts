import { parseStringPromise } from "xml2js";

export async function parseXmlToJson(xml: string): Promise<any> {
  return parseStringPromise(xml, {
    explicitArray: false,
    mergeAttrs: true,
    trim: true
  });
}
