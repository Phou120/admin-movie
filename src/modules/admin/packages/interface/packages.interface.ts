import type { PackageType } from "../../../../common/enums/status.enum";
import type { IPagination } from "../../../../common/interface/pagination.interface";
import type { PackagesEntity } from "../entity/packages.entity";

export interface IPackagesData {
  packages: PackagesEntity[];
  pagination: IPagination;
}

export interface IPackagesForm {
  id?: number | null;
  type: PackageType;
  price: number;
  content: string;
}
