import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SeguridadPage() {
  const session = await auth();
  if (!session?.user) redirect("/iniciar-sesion?callbackUrl=/cuenta/seguridad");

  return (
    <>
      <section className="bg-cafe-800 section-padding">
        <div className="container-custom py-20"><h1 className="font-serif text-4xl font-bold text-white">Seguridad</h1></div>
      </section>
      <section className="section-padding bg-crema-50">
        <div className="container-custom max-w-2xl">
          <Card>
            <CardHeader><CardTitle>Cambiar contraseña</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gris-600 mb-4">Funcionalidad de cambio de contraseña próximamente.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
