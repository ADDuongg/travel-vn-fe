import { DropdownLanguage } from '@components/DropdownLanguage';
import React from 'react';

const paymentIcons = [
  '/images/paypal.png',
  '/images/visa.png',
  '/images/mastercard.png',
  '/images/amex.png',
];

const Footer: React.FC = () => (
  <footer className="bg-[#181818] text-gray-200 pt-12 pb-0">
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-8">
      {/* Brand */}
      <div>
        <h2 className="font-dm-serif-display text-2xl font-bold mb-6">
          Travel <span className="text-blue-400">Tour</span>
        </h2>
        <div className="mb-6">
          <DropdownLanguage />
        </div>
      </div>
      {/* Contact */}
      <div>
        <h3 className="font-dm-serif-display text-xl font-bold mb-6">
          Contact
        </h3>
        <div className="mb-2">T: 1-634-567-34</div>
        <div className="mb-4">E: contact@traveltourtheme.co</div>
        <div className="flex gap-4 text-xl">
          <span className="cursor-pointer">&#xf09a;</span> {/* Facebook */}
          <span className="cursor-pointer">&#xf099;</span> {/* Twitter */}
          <span className="cursor-pointer">&#xf0d2;</span> {/* Pinterest */}
          <span className="cursor-pointer">&#xe07b;</span> {/* TikTok */}
        </div>
      </div>
      {/* Useful Links */}
      <div>
        <h3 className="font-dm-serif-display text-xl font-bold mb-6">
          Useful Links
        </h3>
        <ul className="space-y-2">
          <li>Travel Blog & Tips</li>
          <li>Working With Us</li>
          <li>Be Our Partner</li>
        </ul>
      </div>
      {/* Pay Safely */}
      <div>
        <h3 className="font-dm-serif-display text-xl font-bold mb-6">
          Pay Safely With Us
        </h3>
        <div className="mb-4 text-gray-400 text-base">
          The payment is encrypted and transmitted securely with an SSL
          protocol.
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
          Home
        </a>
        <a href="#" className="hover:text-white">
          About
        </a>
        <a href="#" className="hover:text-white">
          Blog
        </a>
        <a href="#" className="hover:text-white">
          Contact
        </a>
      </nav>
      <div className="text-center md:text-right">
        Copyright © 2025 GoodLayers. All Rights Reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
