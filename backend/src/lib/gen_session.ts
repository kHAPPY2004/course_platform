// Function to generate session token
export function generateSessionToken() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 64;
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

// Function to calculate expiration date for session
export function calculateExpirationDate() {
  const expirationDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  const currentTime = new Date();
  return new Date(currentTime.getTime() + expirationDuration);
}
