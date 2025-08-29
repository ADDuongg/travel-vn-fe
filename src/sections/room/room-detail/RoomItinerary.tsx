import React from 'react';
import { MdOutlineDoNotDisturbOn } from 'react-icons/md';

interface RulesSectionProps {
  title: string;
  rules: string[];
  icon?: React.ReactElement; // cho phép custom icon
}

const RulesSection: React.FC<RulesSectionProps> = ({
  title,
  rules,
  icon = <MdOutlineDoNotDisturbOn className="text-red-500" size={18} />, // default
}) => {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <ul className="space-y-3 text-gray-600">
        {rules.map((rule, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {React.cloneElement(icon, {
              className: `${icon.props.className} shrink-0`,
            })}
            <span className="text-paleGray">{rule}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RulesSection;
