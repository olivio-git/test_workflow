export const environment = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  branch_selected_key: import.meta.env.BRANCH_STORAGE_KEY || 'key_branch',
  app_env: import.meta.env.VITE_APP_ENV || 'production',
};