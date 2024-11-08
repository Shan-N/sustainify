"use client";

import React, { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Loader2Icon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const interFont = Inter({
  subsets: ["latin"],
  weight: "400",
});

interface UserCredentials {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [user, setUser] = useState<UserCredentials>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onLogin = async () => {
    if (!user.email || !user.password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      alert("Login successful");
      router.push("/dashboard");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      alert(`There was an error | ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${interFont.className} min-h-screen bg-[#050B26] flex flex-col`}>
      <header className="flex bg-[#26300E]">
        <nav className={`${interFont.className} flex`}>
          <h2 className="text-white font-extrabold text-2xl md:text-3xl px-4 py-3">
            <Link href="/">SUSTAINIFY</Link>
          </h2>
        </nav>
      </header>

      <main className="flex flex-col justify-center pt-60 px-10 md:px-28 md:pt-48">
        <Card className={`${interFont.className} flex flex-col justify-center items-center bg-[#EDFAE8] rounded-lg`}>
          <CardHeader className="font-extrabold text-xl">
            Welcome to Sustainify
          </CardHeader>
          <CardContent className="flex flex-col m-0 md:justify-center md:items-center">
            <Input
              className="border-[#182710] my-3 md:mx-32 text-black"
              placeholder="Email"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
            <Input
              className="border-[#182710] my-3 md:mx-32 text-black"
              placeholder="Password"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
            />
            <Button
              className="font-semibold my-2"
              onClick={onLogin}
              disabled={loading}
            >
              {loading && <Loader2Icon className="animate-spin mr-2" />}
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Link href="/signup" className="mt-2 flex justify-center items-center">
              Create Account!
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}