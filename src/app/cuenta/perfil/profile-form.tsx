"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function ProfileForm({ user }: { user: { name?: string | null; lastName?: string | null; email?: string | null; phone?: string | null } }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "", lastName: user.lastName || "", phone: user.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) toast.success("Perfil actualizado");
      else toast.error("Error al actualizar");
    } catch { toast.error("Error al actualizar"); }
    finally { setLoading(false); }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Información personal</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label>Apellido</Label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required /></div>
          </div>
          <div><Label>Email</Label><Input value={user.email || ""} disabled /></div>
          <div><Label>Teléfono</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <Button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar cambios"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
