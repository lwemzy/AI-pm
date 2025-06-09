interface Config {
  apiUrl: string;
  environment: 'development' | 'test' | 'production';
  version: string;
}
const config: Config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  environment: (process.env.REACT_APP_ENVIRONMENT || 'development') as Config['environment'],
  version: process.env.REACT_APP_VERSION || '0.1.0'
};
export default config;