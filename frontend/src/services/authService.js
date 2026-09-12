import { supabase } from "./supabase";

// Login
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

// Logout
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

// Get current session
export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

// Get current user
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}