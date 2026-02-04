import { DropdownLanguage } from '@components/DropdownLanguage';
import React from 'react';
import { useTranslation } from 'react-i18next';

const paymentIcons = [
  '/images/paypal.png',
  '/images/visa.png',
  '/images/mastercard.png',
  '/images/amex.png',
];

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#181818] text-gray-200 pt-12 pb-0">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <h2 className="font-dm-serif-display text-2xl font-bold mb-6">
            {t('footer.brand')}
          </h2>
          <div className="mb-6">
            <DropdownLanguage />
          </div>
        </div>
        {/* Contact */}
        <div>
          <h3 className="font-dm-serif-display text-xl font-bold mb-6">
            {t('footer.contact')}
          </h3>
          <div className="mb-2">T: 1-634-567-34</div>
          <div className="mb-4">E: contact@traveltourtheme.co</div>
          <div className="flex gap-4 text-xl">
            <span className="cursor-pointer">&#xf09a;</span>
            <span className="cursor-pointer">&#xf099;</span>
            <span className="cursor-pointer">&#xf0d2;</span>
            <span className="cursor-pointer">&#xe07b;</span>
          </div>
        </div>
        {/* Useful Links */}
        <div>
          <h3 className="font-dm-serif-display text-xl font-bold mb-6">
            {t('footer.useful_links')}
          </h3>
          <ul className="space-y-2">
            <li>{t('footer.travel_blog_tips')}</li>
            <li>{t('footer.working_with_us')}</li>
            <li>{t('footer.be_our_partner')}</li>
          </ul>
        </div>
        {/* Pay Safely */}
        <div>
          <h3 className="font-dm-serif-display text-xl font-bold mb-6">
            {t('footer.pay_safely')}
          </h3>
          <div className="mb-4 text-gray-400 text-base">
            {t('footer.pay_safely_desc')}
          </div>
          <div className="flex gap-3">
            {paymentIcons.map((src, idx) => (
              <img key={idx} src={src} alt="Payment" className="h-7 w-auto" />
            ))}
          </div>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="bg-[#111] py-4 px-4 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
        <nav className="flex gap-6 mb-2 md:mb-0">
          <a href="#" className="hover:text-white">
            {t('home')}
          </a>
          <a href="#" className="hover:text-white">
            {t('about_us')}
          </a>
          <a href="#" className="hover:text-white">
            {t('blog')}
          </a>
          <a href="#" className="hover:text-white">
            {t('contact')}
          </a>
        </nav>
        <div className="text-center md:text-right">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
