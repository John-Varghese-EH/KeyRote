const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = process.cwd();
const ENV_EXAMPLE_PATH = path.join(ROOT_DIR, '.env.example');
const ENV_PATH = path.join(ROOT_DIR, '.env');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function main() {
  if (!fs.existsSync(ENV_EXAMPLE_PATH)) {
    console.error('❌ .env.example not found in root directory.');
    process.exit(1);
  }

  if (fs.existsSync(ENV_PATH)) {
    console.log('⚠️ .env file already exists. Skipping auto-generation.');
    return;
  }

  console.log('✨ Initializing KeyRote environment...');
  
  let envContent = fs.readFileSync(ENV_EXAMPLE_PATH, 'utf8');
  
  // Generate secrets
  const proxySecret = generateSecret();
  const adminSecret = generateSecret();
  
  // Replace placeholders
  envContent = envContent.replace(
    /PROXY_SECRET=.*/g, 
    `PROXY_SECRET=${proxySecret}         # Auto-generated`
  );
  
  envContent = envContent.replace(
    /ADMIN_SECRET=.*/g, 
    `ADMIN_SECRET=${adminSecret}         # Auto-generated`
  );

  // Provide a dummy upstream key if none exists
  envContent = envContent.replace(
    /UPSTREAM_API_KEYS=.*/g, 
    `UPSTREAM_API_KEYS=sk-dummy-key-123  # Auto-generated placeholder`
  );

  fs.writeFileSync(ENV_PATH, envContent);
  
  console.log('✅ Created .env file securely!');
  console.log('\n🔒 IMPORTANT SECRETS GENERATED:');
  console.log(`   PROXY_SECRET: ${proxySecret}`);
  console.log(`   ADMIN_SECRET: ${adminSecret}`);
  console.log('\n🚀 Next Steps:');
  console.log(`   1. Edit .env to add your real UPSTREAM_API_KEYS`);
  console.log(`   2. Run 'docker-compose -f docker-compose.dev.yml up -d redis' to start the local Redis instance`);
  console.log(`   3. Run 'pnpm run dev' to start the Proxy and Dashboard concurrently`);
}

main();
