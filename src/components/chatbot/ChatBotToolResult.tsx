import { MapPin, Star } from 'lucide-react';

interface ChatBotToolResultProps {
  name: string;
  output: unknown;
}

interface HotelResult {
  id: string;
  name: string;
  location?: string;
  rating?: number;
  price?: number;
}

interface TourResult {
  id: string;
  name: string;
  destination?: string;
  duration?: string;
  price?: number;
}

interface FoodResult {
  id: string;
  name: string;
  region?: string;
  description?: string;
}

function ChatBotToolResult({ name, output }: ChatBotToolResultProps) {
  if (!output) return null;

  switch (name) {
    case 'searchHotels':
    case 'getHotelDetails':
      return <HotelResults data={output} />;
    case 'searchTours':
    case 'getTourDetails':
      return <TourResults data={output} />;
    case 'searchFood':
      return <FoodResults data={output} />;
    default:
      return <GenericResult data={output} />;
  }
}

function HotelResults({ data }: { data: unknown }) {
  const items = Array.isArray(data) ? (data as HotelResult[]) : [data as HotelResult];

  return (
    <div className="mt-2 space-y-1.5">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border bg-background p-2 text-xs"
        >
          <p className="font-medium text-foreground">{item.name}</p>
          {item.location && (
            <p className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {item.location}
            </p>
          )}
          <div className="mt-1 flex items-center justify-between">
            {item.rating && (
              <span className="flex items-center gap-0.5 text-amber-500">
                <Star className="h-3 w-3 fill-current" />
                {item.rating}
              </span>
            )}
            {item.price && (
              <span className="font-medium text-primary">
                ${item.price}/night
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function TourResults({ data }: { data: unknown }) {
  const items = Array.isArray(data) ? (data as TourResult[]) : [data as TourResult];

  return (
    <div className="mt-2 space-y-1.5">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border bg-background p-2 text-xs"
        >
          <p className="font-medium text-foreground">{item.name}</p>
          {item.destination && (
            <p className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {item.destination}
            </p>
          )}
          <div className="mt-1 flex items-center justify-between">
            {item.duration && (
              <span className="text-muted-foreground">{item.duration}</span>
            )}
            {item.price && (
              <span className="font-medium text-primary">${item.price}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function FoodResults({ data }: { data: unknown }) {
  const items = Array.isArray(data) ? (data as FoodResult[]) : [data as FoodResult];

  return (
    <div className="mt-2 space-y-1.5">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border bg-background p-2 text-xs"
        >
          <p className="font-medium text-foreground">{item.name}</p>
          {item.region && (
            <p className="text-muted-foreground">{item.region}</p>
          )}
          {item.description && (
            <p className="mt-0.5 text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function GenericResult({ data }: { data: unknown }) {
  if (typeof data === 'string') {
    return <p className="mt-1 text-xs text-muted-foreground">{data}</p>;
  }

  return (
    <pre className="mt-1 max-h-24 overflow-auto rounded bg-muted p-1.5 text-[10px]">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default ChatBotToolResult;

