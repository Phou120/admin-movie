import { notification } from "ant-design-vue";

// Configuration
const defaultConfig = {
  placement: "topRight" as const,
  duration: 4,
};

// Success notification
export const showSuccessNotification = (
  description: string,
  message: string = "ສຳເລັດ"
) => {
  notification.success({
    message,
    description,
    ...defaultConfig,
  });
};

// Error notification
export const showErrorNotification = (
  description: string,
  message: string = "ຜິດພາດ"
) => {
  notification.error({
    message,
    description,
    ...defaultConfig,
  });
};

// Warning notification
export const showWarningNotification = (
  description: string,
  message: string = "Warning"
) => {
  notification.warning({
    message,
    description,
    ...defaultConfig,
  });
};

// Info notification
export const showInfoNotification = (
  description: string,
  message: string = "Information"
) => {
  notification.info({
    message,
    description,
    ...defaultConfig,
  });
};

// Custom notification with all options
export const showNotification = (config: {
  type: "success" | "error" | "warning" | "info";
  message: string;
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
  const { type, ...rest } = config;
  notification[type]({
    ...defaultConfig,
    ...rest,
  });
};
