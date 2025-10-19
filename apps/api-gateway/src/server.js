const app = require('./app');
const env = require('./config/env');

app.listen(env.port, () => {
  console.log(`🚀 HRMS API running on http://localhost:${env.port}`);
});
