import { DropdownLanguage } from '@components/DropdownLanguage';
import { ROUTES } from '@/constants/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const paymentIcons = [
  '/images/paypal.png',
  '/images/visa.png',
  '/images/mastercard.png',
  '/images/amex.png',
];

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-charcoal/10 bg-sand-100 px-4 py-16 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="font-display text-3xl text-charcoal">{t('footer.brand')}</p>
          <p className="max-w-sm text-sm leading-relaxed text-mist">{t('footer.tagline')}</p>
          <div className="pt-2">
            <DropdownLanguage />
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <p className="text-[11px] uppercase tracking-[0.26em] text-charcoal/45">
            {t('footer.column_explore')}
          </p>
          <Link className="block hover:text-sunset-deep" to={ROUTES.TOUR.INDEX}>
            {t('footer.link_tours')}
          </Link>
          <Link className="block hover:text-sunset-deep" to={ROUTES.PROVINCE.INDEX}>
            {t('footer.link_provinces')}
          </Link>
          <Link className="block hover:text-sunset-deep" to={ROUTES.DESTINATION.SEARCH}>
            {t('footer.link_destination')}
          </Link>
          <Link className="block hover:text-sunset-deep" to={ROUTES.BLOG.INDEX}>
            {t('footer.link_blog')}
          </Link>
          <Link className="block hover:text-sunset-deep" to={ROUTES.HOME}>
            {t('home')}
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <p className="text-[11px] uppercase tracking-[0.26em] text-charcoal/45">
            {t('footer.column_note')}
          </p>
          <p className="text-mist">{t('footer.note_body')}</p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-charcoal/45">
            {t('footer.pay_safely')}
          </p>
          <p className="text-sm text-mist">{t('footer.pay_safely_desc')}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            {paymentIcons.map((src, idx) => (
              <img key={idx} src={src} alt="" className="h-7 w-auto opacity-90" />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-charcoal/10 pt-8 text-sm text-charcoal/45 md:flex-row md:items-start">
        <nav className="flex flex-wrap justify-center gap-6 md:justify-start">
          <Link to={ROUTES.HOME} className="transition-colors hover:text-sunset-deep">
            {t('home')}
          </Link>
          <Link to={ROUTES.ABOUT_US} className="transition-colors hover:text-sunset-deep">
            {t('nav.about_us')}
          </Link>
          <Link to={ROUTES.BLOG.INDEX} className="transition-colors hover:text-sunset-deep">
            {t('nav.blog')}
          </Link>
          <Link to={ROUTES.CONTACT} className="transition-colors hover:text-sunset-deep">
            {t('nav.contact')}
          </Link>
        </nav>
        <p className="text-center text-[11px] uppercase tracking-[0.34em] text-charcoal/35 md:text-right">
          {t('footer.bottom_tagline')}
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-center text-xs text-charcoal/40">
        {t('footer.copyright')}
      </p>
    </footer>
  );
};

export default Footer;

