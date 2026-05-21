export function getAdminEmailsFromEnv(value = process.env.ADMIN_EMAILS || "") {
  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmailAllowed(email: string | null | undefined, adminEmails = getAdminEmailsFromEnv()) {
  if (!email) return false;
  return adminEmails.includes(email.trim().toLowerCase());
}
