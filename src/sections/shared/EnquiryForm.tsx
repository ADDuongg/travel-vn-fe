import CustomInput from '@/components/CustomInput';
import { Button } from '@/components/ui/button';
import { FormProvider, useForm } from 'react-hook-form';

type EnquiryFormValues = {
  fullName: string;
  email: string;
  enquiry: string;
  agree: boolean;
};

const EnquiryForm = () => {
  const methods = useForm<EnquiryFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      enquiry: '',
      agree: false,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: EnquiryFormValues) => {
    console.log('Enquiry form submitted:', data);

  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <CustomInput
          name="fullName"
          label="Full Name"
          rules={{ required: 'Full name is required' }}
          size={'lg'}
        />

        <CustomInput
          name="email"
          label="Email Address"
          type="text"
          size={'lg'}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          }}
        />

        <CustomInput
          name="enquiry"
          label="Your Enquiry"
          type="custom-input"
          render={(field) => (
            <textarea
              {...field}
              rows={4}
              className="w-full border rounded-md p-2"
              placeholder="Your Enquiry*"
            />
          )}
          rules={{ required: 'Enquiry is required' }}
        />

        <CustomInput
          name="agree"
          type="checkbox"
          className=""
          label={
            <>
              * I agree with{' '}
              <span className="underline cursor-pointer">Terms of Service</span>{' '}
              and{' '}
              <span className="underline cursor-pointer">
                Privacy Statement
              </span>
              .
            </>
          }
          rules={{ required: 'You must agree before submitting' }}
        />

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
        </Button>
      </form>
      <div className="flex justify-end items-center text-gray-500 text-sm mt-4 gap-10">
        <button className="flex items-center gap-1">
          <span>♡</span> Save To Wish List
        </button>
        <span>👁 6031</span>
      </div>
    </FormProvider>
  );
};

export default EnquiryForm;

