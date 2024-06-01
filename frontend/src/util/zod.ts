import { z } from "zod";
export const emailSchema = z
  .string()
  .email()
  .refine(
    (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return false;
      }

      // Split the email to extract the domain
      const [, domain] = value.split("@");
      // List of allowed domains
      const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
      // Check if the domain is included in the allowed domains
      return allowedDomains.includes(domain);
    },
    { message: "Invalid email Address" }
  );
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(30, "Password must be less than 30 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be 8 characters or longer"
  );

// Custom phone number schema with validation rules
export const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, "Phone number must be exactly 10 digits");
