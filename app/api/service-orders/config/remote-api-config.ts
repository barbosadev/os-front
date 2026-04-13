export interface RemoteApiConfig {
  baseUrl: string;
  ordersUrl: string;
  username: string;
  password: string;
}

export function getRemoteApiConfig(): RemoteApiConfig | null {
  const configuredBaseUrl = process.env.ORDERS_API_BASE_URL?.trim();
  if (!configuredBaseUrl) {
    return null;
  }

  const baseUrl = configuredBaseUrl.replace(/\/$/, "");

  return {
    baseUrl,
    ordersUrl: `${baseUrl}/orders`,
    username: process.env.ORDERS_API_USERNAME?.trim() || "admin",
    password: process.env.ORDERS_API_PASSWORD?.trim() || "admin123",
  };
}
