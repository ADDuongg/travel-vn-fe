import type { Hotel } from '@/features/hotels/types';
import { useLanguage } from '@/hooks/useLanguage';
import { FiPhone } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
import { BsGlobe2 } from 'react-icons/bs';
import { Card } from '@/components/ui/card';

const HotelInfo = ({ hotel }: { hotel: Hotel }) => {
  const { language } = useLanguage();
  const lang = language || 'vi';
  const desc = (
    hotel.translations?.[lang]?.description ??
    hotel.translations?.vi?.description ??
    hotel.translations?.en?.description
  ) as string | undefined;
  const contact = hotel.contact;

  return (
    <div className="space-y-8">
      {desc && (
        <div>
          <h3 className="text-xl font-bold mb-4">About</h3>
          <div
            className="prose prose-slate max-w-none text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: desc ?? '' }}
          />
        </div>
      )}

      {contact && (contact.phone || contact.email || contact.website) && (
        <Card className="p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4">Contact</h3>
          <div className="flex flex-wrap gap-6">
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FiPhone size={20} />
                <span>{contact.phone}</span>
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <MdOutlineEmail size={20} />
                <span>{contact.email}</span>
              </a>
            )}
            {contact.website && (
              <a
                href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <BsGlobe2 size={20} />
                <span>{contact.website}</span>
              </a>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HotelInfo;
