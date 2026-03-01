export const getAuthHeaders = (options?: { token?: boolean }) => {
  const headers: Record<string, string> = {};

  if (options?.token !== false) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return { headers };
};
