// Mock authentication API. Replace with real HTTP calls later.

export async function loginApi({ email, password }) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  // Simple demo rule: reject very short passwords
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  // In a real app, you would send email/password to the backend and receive a JWT.
  return {
    token: "demo-token-" + Date.now(),
    user: {
      id: "demo-user",
      email,
      name: email.split("@")[0] || "Guest",
    },
  };
}

export async function signupApi({ name, email, password }) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  // In a real app you would validate and create the user in the backend.
  return {
    token: "demo-token-" + Date.now(),
    user: {
      id: "demo-user",
      email,
      name,
    },
  };
}

