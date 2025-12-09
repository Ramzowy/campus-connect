"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import prisma from "@/lib/prisma";

// Sign-up schema
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  country: z.string().min(1, "Country is required"),
});

export async function signUp(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // Extract data from FormData
    const validatedData = signUpSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      country: formData.get("country"),
    });

    if (!validatedData.success) {
      // Return first validation error
      const firstError = Object.values(
        validatedData.error.flatten().fieldErrors
      )[0]?.[0];
      return firstError || "Invalid form data";
    }

    const { name, email, password, country } = validatedData.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return "User already exists with this email";
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        country,
      },
    });

    // ========== NEW AUTO-GROUPING CODE ==========

    // 1. Create group name based on country
    const countryGroupName = `Students from ${country.toUpperCase()}`;

    // 2. Find existing country group OR create it
    let countryGroup = await prisma.group.findFirst({
      where: {
        country: country,
        name: countryGroupName,
      },
    });

    if (!countryGroup) {
      countryGroup = await prisma.group.create({
        data: {
          name: countryGroupName,
          description: `Connect with other students from ${country}`,
          country: country,
        },
      });
    }

    // 3. Connect user to group via join table
    await prisma.userGroup.create({
      data: {
        userId: newUser.id,
        groupId: countryGroup.id,
      },
    });
    // ========== END NEW CODE ==========

    // After successful sign-up, automatically sign in
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
}

// Sign-in action (already working with your auth.ts)
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
}
