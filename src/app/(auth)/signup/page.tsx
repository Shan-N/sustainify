"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

const interFont = Inter({ subsets: ["latin"], weight: "400" });

export default function SignupForm() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error message state

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle signup submission
  const onSignup = async () => {
    if (!user.email || !user.username || !user.password) {
      setError("All fields are required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const resData = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      const result = await resData.json();
      if (!resData.ok) {
        throw new Error(result.message || "Something went wrong");
      }
      alert("Account created successfully!");
      router.push("/login");
    } catch (error: unknown) {
      setError(`There was an error: ${error instanceof Error ? error.message : ""}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${interFont.className} min-h-screen bg-[#050B26] flex flex-col`}>
      <div className="flex bg-[#26300E]">
        <main className="flex">
          <h2 className="text-white font-extrabold text-2xl md:text-3xl px-4 py-3">
            <Link href="/">SUSTAINIFY</Link>
          </h2>
        </main>
      </div>
      <div className="flex flex-col justify-center pt-60 px-10 md:px-28 md:pt-48">
        <Card className="flex flex-col justify-center items-center bg-[#EDFAE8] rounded-lg">
          <CardHeader className="font-extrabold text-xl">Create Account</CardHeader>
          <CardContent className="flex flex-col md:items-center">
            {error && <p className="text-red-600 mb-3">{error}</p>}
            <Input
              className="border-[#182710] my-3 md:mx-32 text-black"
              placeholder="Email"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              aria-label="Email"
            />
            <Input
              className="border-[#182710] my-3 md:mx-32"
              placeholder="Username"
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              aria-label="Username"
            />
            <Input
              className="border-[#182710] my-3 md:mx-32"
              placeholder="Password"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              aria-label="Password"
            />
            <Button
              disabled={loading}
              className="font-semibold my-2"
              onClick={onSignup}
            >
              {loading && <Loader2Icon className="animate-spin mr-2" />}
              {loading ? "Signing up..." : "Create Account"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
