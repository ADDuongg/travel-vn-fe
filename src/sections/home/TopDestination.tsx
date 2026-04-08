import Container from '@components/Container';
import { DestinationItem } from '@/mock';
import DestinationPreviewCard from '@components/DestinationPreviewCard';
import { ButtonNavigate } from '@components/ui/button';
import { Title, SubTitle } from '@components/ui/typography';
import { useTranslation } from 'react-i18next';

export const TopDestination = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <div className="flex flex-col gap-10 items-center relative z-[2] w-full text-center">
        <Title className="text-foreground">
          {t('home_page.top_destinations_prefix')}
          <span className="text-primary">{t('home_page.top_destinations_highlight')}</span>
        </Title>
        <SubTitle>
          {t('home_page.top_destinations_subtitle')}
        </SubTitle>
        <ButtonNavigate label={t('buttons.all_destinations')} />

        <div className="grid justify-items-center grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-10 w-full">
          {DestinationItem.map((item) => (
            <DestinationPreviewCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </Container>
  );
};
