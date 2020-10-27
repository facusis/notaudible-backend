

const jwtSecret = process.env.JWT_SECRET || 'meow';
const adminPassword = process.env.ADMIN_PASSWORD || 'meow';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';

module.exports = {
  jwtSecret,
  adminPassword,
  adminEmail,
}
