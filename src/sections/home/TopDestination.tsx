import Container from '@/layout/Container';
import { DestinationItem } from '@/mock';
import DestinationPreviewCard from '@components/DestinationPreviewCard';
import { ButtonNavigate } from '@components/ui/button';
import { Title, SubTitle } from '@components/ui/typography';
export const TopDestination = () => {
  return (
    <Container>
      <div className="flex flex-col gap-10 items-center relative z-[2] w-full text-center">
        <Title className="text-[#1e1e1e]">
          Top <span className="text-primary">Destinations</span>
        </Title>
        <SubTitle>
          Explore our top destinations voted by more than 100,000+
          <br />
          customers around the world.
        </SubTitle>
        <ButtonNavigate label="All Destinations" />

        <div className="grid justify-items-center grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-10 w-full">
          {DestinationItem.map((item) => (
            <DestinationPreviewCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </Container>
  );
};
