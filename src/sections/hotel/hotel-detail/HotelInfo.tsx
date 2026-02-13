import type { Hotel } from '@/features/hotels/types';
import { useLanguage } from '@/hooks/useLanguage';
import { FiPhone } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
import { BsGlobe2 } from 'react-icons/bs';
import { Card } from '@/components/ui/card';
import { ResponsiveH2, ResponsiveH3 } from '@/components/ui/typography';

const HotelInfo = ({ hotel }: { hotel: Hotel }) => {
  const { language } = useLanguage();
  const lang = language || 'vi';
  const desc = (
    hotel.translations?.[lang]?.description ??
    hotel.translations?.vi?.description ??
    hotel.translations?.en?.description
  ) as string | undefined;
  const contact = hotel.contact;
  const hasContact =
    contact && (contact.phone || contact.email || contact.website);

  return (
    <section className="grid grid-cols-12 gap-8 lg:gap-12 mb-20">
      {/* Left: About */}
      <div className="col-span-12 lg:col-span-8">
        <ResponsiveH2 className="text-foreground mb-6 border-0 pb-0">
          About
        </ResponsiveH2>
        {desc ? (
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-base"
            dangerouslySetInnerHTML={{ __html: desc }}
          />
        ) : (
          <p className="text-muted-foreground">No description available.</p>
        )}
      </div>

      {/* Right: Sticky Contact card */}
      <div className="col-span-12 lg:col-span-4">
        {hasContact && (
          <div className="sticky top-8">
            <Card className="p-6 lg:p-8 rounded-xl shadow-lg border bg-card">
              <ResponsiveH3 className="text-foreground mb-6 border-0 pb-0">
                Contact Information
              </ResponsiveH3>
              <div className="space-y-5">
                {contact!.phone && (
                  <a
                    href={`tel:${contact!.phone}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <FiPhone className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Call
                      </p>
                      <p className="font-semibold text-foreground">
                        {contact!.phone}
                      </p>
                    </div>
                  </a>
                )}
                {contact!.email && (
                  <a
                    href={`mailto:${contact!.email}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <MdOutlineEmail className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Email
                      </p>
                      <p className="font-semibold text-foreground break-all">
                        {contact!.email}
                      </p>
                    </div>
                  </a>
                )}
                {contact!.website && (
                  <a
                    href={
                      contact!.website.startsWith('http')
                        ? contact!.website
                        : `https://${contact!.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <BsGlobe2 className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Website
                      </p>
                      <p className="font-semibold text-foreground break-all">
                        {contact!.website}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default HotelInfo;
