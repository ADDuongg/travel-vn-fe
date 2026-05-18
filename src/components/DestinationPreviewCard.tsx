import { Button } from './ui/button';

const DestinationPreviewCard = ({ item }: { item: any }) => {
  return (
    <div className="destination-card relative overflow-hidden group">
      <img
        src={item.image}
        alt="img"
        className="relative z-[1] w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[2]" />
      {item.tour_number && (
        <div className="text-white text-[13px] font-bold absolute z-[3] p-2 top-5 right-5 bg-primary rounded-md">
          {item.tour_number} tours
        </div>
      )}

      <div
        className="
      absolute bottom-0 w-full z-[4] p-4
      flex flex-col items-center justify-end text-center gap-2
      transition-all duration-500 ease-in-out
      group-hover:translate-y-0 translate-y-12
    "
      >
        <span className="text-white font-dm-serif-display text-2xl">
          {item.name}
        </span>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 items-center">
          <span className="text-white text-[13px]">{item.description}</span>
          <Button className="bg-transparent cursor-pointer text-primary hover:text-blue-300 hover:bg-transparent w-fit ">
            View all tours
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DestinationPreviewCard;

