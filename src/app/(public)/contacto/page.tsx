'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactInfo = [
  { icon: MapPin, title: 'Ubicación', details: ['Pereira, Risaralda', 'Colombia'] },
  { icon: Phone, title: 'Teléfono', details: ['+57 (6) 000-0000'] },
  { icon: Mail, title: 'Correo', details: ['hola@cafedelroble.co'] },
  { icon: Clock, title: 'Horario', details: ['Lun - Vie: 8:00 AM - 6:00 PM', 'Sáb: 9:00 AM - 2:00 PM'] },
];

import { toast } from 'sonner';

export default function ContactoPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('¡Mensaje enviado con éxito!', {
      description: 'Nos pondremos en contacto contigo lo más pronto posible.',
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <section className="bg-gradient-to-br from-coffee-950 to-primary-950 py-24 sm:py-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-sm font-medium uppercase tracking-widest text-primary-400">Contacto</span>
            <h1 className="mt-4 font-serif text-5xl font-bold text-white sm:text-6xl">Hablemos</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-cream-300">
              ¿Tienes preguntas? Nos encantaría escucharte.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-cream-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-serif text-3xl font-bold text-coffee-900">Envíanos un mensaje</h2>
              <p className="mt-4 text-secondary-600">
                Completa el formulario y te responderemos lo antes posible.
              </p>
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input placeholder="Nombre" required />
                  <Input placeholder="Correo electrónico" type="email" required />
                </div>
                <Input placeholder="Asunto" required />
                <Textarea placeholder="Tu mensaje" rows={5} required />
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Enviar mensaje
                </Button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {contactInfo.map((info) => (
                  <div key={info.title} className="rounded-2xl border border-cream-200 bg-white p-6">
                    <info.icon className="h-6 w-6 text-primary-600" />
                    <h3 className="mt-3 font-serif font-semibold text-coffee-900">{info.title}</h3>
                    {info.details.map((detail) => (
                      <p key={detail} className="mt-1 text-sm text-secondary-600">{detail}</p>
                    ))}
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-cream-200 bg-white p-6">
                <h3 className="font-serif text-lg font-semibold text-coffee-900">WhatsApp</h3>
                <p className="mt-2 text-sm text-secondary-600">
                  También puedes contactarnos directamente por WhatsApp.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Abrir WhatsApp
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
