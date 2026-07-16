import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with KOEB for product inquiries, service requests and partnership opportunities.",
};

async function getSettings() {
  try {
    return await prisma.settings.findUnique({ where: { id: "settings" } });
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="bg-brand-dark py-16 text-center text-white">
        <Container>
          <h1 className="font-heading text-4xl font-bold">Contact Us</h1>
          <p className="mt-3 text-gray-300">We'd love to hear about your project.</p>
        </Container>
      </section>

      <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold">Send Us a Message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold">Get In Touch</h2>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="shrink-0 text-brand-red" size={20} />
                {settings?.address || "19, Mojidi Street, Off Toyin Street, Ikeja, Lagos, Nigeria"}
              </li>
              <li className="flex gap-3">
                <Phone className="shrink-0 text-brand-red" size={20} />
                {settings?.phone || "08023508817, 08031335765, 08038672377"}
              </li>
              <li className="flex gap-3">
                <Mail className="shrink-0 text-brand-red" size={20} />
                {settings?.email || "info@koebltd.com"}
              </li>
              <li className="flex gap-3">
                <Clock className="shrink-0 text-brand-red" size={20} />
                {settings?.businessHours || "Mon - Fri: 8:00 AM - 6:00 PM"}
              </li>
            </ul>

            <div className="mt-8 h-64 overflow-hidden rounded-section border border-brand-border">
              <iframe
                title="KOEB location"
                src={
                  settings?.mapsUrl ||
                  "https://www.google.com/maps?q=19+Mojidi+Street,+Off+Toyin+Street,+Ikeja,+Lagos,+Nigeria&output=embed"
                }
                width="100%"
                height="100%"
                loading="lazy"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
