import { ImportLogModel } from "../models/importLog.model";

export class HistoryService {
  static async listImportLogs(limit = 50, skip = 0) {
    return ImportLogModel.find({})
      .sort({ startedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }
}
