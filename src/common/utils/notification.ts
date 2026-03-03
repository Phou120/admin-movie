import { notification } from "ant-design-vue";
import i18n from "../../locales";

// Configuration
const defaultConfig = {
  placement: "topRight" as const,
  duration: 4,
};

// Success notification
export const showSuccessNotification = (
  description: string,
  message?: string
) => {
  notification.success({
    message: message || i18n.global.t("common.success"),
    description,
    ...defaultConfig,
  });
};

// Error notification
export const showErrorNotification = (
  description: string,
  message?: string
) => {
  notification.error({
    message: message || i18n.global.t("common.error"),
    description,
    ...defaultConfig,
  });
};

// Warning notification
export const showWarningNotification = (
  description: string,
  message?: string
) => {
  notification.warning({
    message: message || i18n.global.t("common.warning"),
    description,
    ...defaultConfig,
  });
};

// Info notification
export const showInfoNotification = (
  description: string,
  message?: string
) => {
  notification.info({
    message: message || i18n.global.t("common.info"),
    description,
    ...defaultConfig,
  });
};

// Custom notification with all options
export const showNotification = (config: {
  type: "success" | "error" | "warning" | "info";
  message?: string;
  description: string;
  duration?: number;
  placement?:
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "top"
    | "bottom";
}) => {
  const { type, message, ...rest } = config;

  notification[type]({
    message: message || i18n.global.t(`common.${type}`),
    ...defaultConfig,
    ...rest,
  });
};
