import { ChangeType } from "../../../common/models/change-type";

export interface ConflictTagRowData {
  key: string;
  source?: string;
  target?: string;
  final?: string;
  type: ChangeType;
};
