import CustomInput from '@components/CustomInput';
import { Button } from '@components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { AiOutlineSearch } from 'react-icons/ai';
import { z } from 'zod';
import heroRight from '/images/heroRight.png';
import { Separator } from '@/components/ui/separator';
import { Select } from '@components/ui/select';
import { SubTitle } from '@components/ui/typography';
import { Trans, useTranslation } from 'react-i18next';
type FormData = z.infer<typeof schema>;
const schema = z.object({
  key: z.string(),
  destination: z.object({
    label: z.string(),
    value: z.string(),
  }),
  role: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

export const TitleSection = () => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      key: '',
      destination: {
        label: 'Any',
        value: 'any',
      },
      role: {
        label: 'Any',
        value: 'any',
      },
    },
  });
  const { handleSubmit } = form;
  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
  };

  const roleOptions = [
    { label: 'Any', value: 'any' },
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
    { label: 'Guest', value: 'guest' },
  ];
  const destinationOptions = [
    { label: 'Any', value: 'any' },
    { label: 'Vietnam', value: 'vietnam' },
    { label: 'Thailand', value: 'thailand' },
    { label: 'Cambodia', value: 'cambodia' },
    { label: 'Laos', value: 'laos' },
  ];

  return (
    <div>
      <div className="relative h-auto max-w-[1400px] mx-auto px-5">
        <div className="flex flex-col gap-10 relative z-[2] lg:w-[75%] w-full">
          <div className="bg-white rounded-full text-green-400 py-2 px-4 font-medium w-fit">
            {t('home_page.book_with_us')}
          </div>
          <div className="sm:text-7xl text-5xl font-dm-serif-display text-[#1e1e1e]">
            <Trans
              i18nKey="home_page.hero_title"
              components={[<br />, <span className="text-primary" />]}
            />
          </div>
          <SubTitle>
            <Trans i18nKey="home_page.hero_subtitle" components={[<br />]} />
          </SubTitle>

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 md:h-[132px] h-auto overflow-hidden">
                <div className="w-full md:py-12 py-10 px-5 flex flex-col md:flex-row items-center gap-2 md:w-[80%]">
                  <CustomInput
                    name="key"
                    label={t('input.field_label.keyword')}
                    placeHolder={t('input.placeholder.keyword')}
                    className="custom-input border-0 px-0 shadow-none"
                    type="text"
                    labelPosition="vertical"
                  />
                  <Separator className="my-2 block md:hidden" />
                  <CustomInput
                    name="destination"
                    label={t('input.field_label.destination')}
                    type="select"
                    className="custom-input border-0"
                    value={form.watch('destination')}
                    options={destinationOptions}
                    labelPosition="vertical"
                  />
                  <Separator className="my-2 block md:hidden" />
                  <CustomInput
                    name="role"
                    label={t('input.field_label.role')}
                    type="select"
                    className="custom-input border-0"
                    value={form.watch('role')}
                    options={roleOptions}
                    labelPosition="vertical"
                  />
                  <Separator className="my-2 block md:hidden" />
                </div>
                <Button
                  type="submit"
                  className="bg-primary p-5 flex flex-col justify-center items-center gap-2 md:w-[20%] w-full h-full text-white"
                >
                  <AiOutlineSearch size={32} />
                  {t('buttons.search_now')}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>

        <img
          src={heroRight}
          alt="img1"
          className="max-h-[600px] min-w-[500px] rounded-2xl absolute top-0 right-24 lg:block hidden"
        />
      </div>

      <svg
        viewBox="0 0 1540 314"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 314V134.5C0 134.5 107 332.811 376 296C645 259.189 709.5 161.5 709.5 161.5L1140 160H1540V314H0Z"
          fill="white"
        ></path>
        <path
          d="M1256 172.039C1444 206.039 1540 296.5 1540 296.5V138C1540 138 1464.5 75.0404 1303 31.0401C1240.5 14.8677 1042 -24.959 902.5 22.5401C825 48.9286 803.5 66.04 728.5 143.54C697.344 175.734 635.5 219.5 635.5 219.5C635.5 219.5 726 256.039 822 240.039C986 220.039 1083 149.539 1256 172.039Z"
          fill="#ECF2FC"
        ></path>
      </svg>
    </div>
  );
};
