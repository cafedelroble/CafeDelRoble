"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Coffee, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Correo o contraseña incorrectos");
      } else {
        toast.success("Bienvenido de vuelta");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch { toast.error("Error al iniciar sesión"); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-crema-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Coffee className="mx-auto h-10 w-10 text-cafe-700" />
          <CardTitle className="font-serif text-2xl text-cafe-800">Iniciar Sesión</CardTitle>
          <CardDescription>Accede a tu cuenta de Café del Roble</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div>
              <Label>Contraseña</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gris-400 hover:text-gris-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Ingresando..." : "Iniciar Sesión"}</Button>
          </form>
          <div className="mt-6 text-center text-sm text-gris-600">
            <Link href="/recuperar-password" className="text-cafe-600 hover:underline">¿Olvidaste tu contraseña?</Link>
          </div>
          <div className="mt-4 text-center text-sm text-gris-600">
            ¿No tienes cuenta? <Link href="/registro" className="text-cafe-600 font-medium hover:underline">Crear cuenta</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-crema-50"><p className="text-gris-500">Cargando...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
