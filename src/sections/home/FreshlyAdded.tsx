import React from 'react';
import CardWithRating, {
  type FreshlyTourItem,
} from '@components/CardWithRating';
import { ButtonNavigate } from '@components/ui/button';
import { freshlyTours } from '@/mock';
import { CardCarousel } from '@components/CardsCarousel';
import { Title } from '@components/ui/typography';
import Container from '@components/Container';
import { useTranslation } from 'react-i18next';

export const FreshlyAdded: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <CardCarousel<FreshlyTourItem>
        title={
          <Title className="text-center text-4xl font-dm-serif-display font-bold mb-12">
            {t('home_page.freshly_added_prefix', 'Freshly ')}<span className="text-blue-500">{t('home_page.freshly_added_highlight', 'Added')}</span>
          </Title>
        }
        items={freshlyTours}
        renderItem={(item) => <CardWithRating key={item.id} item={item} />}
        seeMoreButton={<ButtonNavigate label={t('buttons.see_more')} />}
      />
    </Container>
  );
};
