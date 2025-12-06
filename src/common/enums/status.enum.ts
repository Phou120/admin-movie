export const PackageType = {
  ONE_MONTH: "one-month",
  THREE_MONTH: "three-month",
  SIX_MONTH: "six-month",
  ONE_YEAR: "one-year",
} as const;

export type PackageType = (typeof PackageType)[keyof typeof PackageType];
