import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { QrCodeEntity } from "../entity/qr-code.entity";

export interface IQrCodeList {
  qrCodes: QrCodeEntity[];
  pagination: IPagination;
}

export interface IQrCodeForm {
  id?: number | null;
  file: string | File | null;
}
