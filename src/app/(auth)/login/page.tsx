"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

const interFont = Inter({
  subsets: ['latin'],
  weight: '400',
});

export default function LoginForm() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to manage error message
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State to manage success message

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onLogin = async () => {
    if (!user.email || !user.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const resData = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const result = await resData.json();

      if (!resData.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      console.log("Login successful:", result);
      alert("Login successful");
      router.push('/dashboard');
    } catch (error: any) {
        alert(`There was an error | ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${interFont.className} min-h-screen bg-[#050B26] flex flex-col`}>
      <div className="flex bg-[#26300E]">
        <main className={`${interFont.className} flex`}>
          <h2 className='text-white font-extrabold text-2xl md:text-3xl px-4 py-3'>
            <Link href='/'>SUSTAINIFY</Link>
          </h2>
        </main>
      </div>

      <div className="flex flex-col justify-center pt-60 px-10 md:px-28 md:pt-48">
        <Card className={`${interFont.className} flex flex-col justify-center items-center bg-[#EDFAE8] rounded-lg`}>
          <CardHeader className="font-extrabold text-xl">
            Welcome to Sustainify
          </CardHeader>
          <CardContent className="flex flex-col m-0 md:justify-center md:items-center">
            <Input
              className="border-[#182710] my-3 md:mx-32 text-black"
              placeholder="Email"
              type="text"
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
                {loading ? <Loader2Icon className="animate-spin mr-2" />: null}
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <span><Link href='/signup'>
            Create Account!
            </Link></span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
