import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMe } from '@/features/auth/hooks';
import React from 'react';

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
};

const DashboardOverviewPage: React.FC = () => {
  const { data: me, isLoading } = useMe();

  const name = me?.fullName || me?.username || '-';
  const email = me?.email || '-';
  const phone = me?.phone || '-';
  const birthDate = formatDate(me?.dateOfBirth);
  const addressText =
    me?.address &&
    (me.address.province || me.address.district || me.address.detail)
      ? [me.address.detail, me.address.district, me.address.province]
          .filter(Boolean)
          .join(', ')
      : '-';
  const gender = (me as any)?.gender ?? '-';
  const avatarUrl =
    me?.avatar?.url || 'https://via.placeholder.com/80x80?text=%F0%9F%91%A4';

  return (
    <div className="flex-1 space-y-6">
      {/* Profile Card */}
      <Card className="rounded-2xl bg-paleGray-100">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-blue-600">
            My Profile
          </CardTitle>
          <Button
            variant="link"
            className="text-sm text-paleGray hover:text-blue-600"
          >
            Edit Profile
          </Button>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full border border-gray-200"
              />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm w-full">
              <div className="space-y-6">
                <p>
                  <span className="font-semibold ">Name:</span>{' '}
                  {isLoading ? 'Loading...' : name}
                </p>
                <p>
                  <span className="font-semibold ">Birth Date:</span>{' '}
                  {isLoading ? 'Loading...' : birthDate}
                </p>
                <p>
                  <span className="font-semibold ">Email:</span>{' '}
                  {isLoading ? 'Loading...' : email}
                </p>
                <p>
                  <span className="font-semibold ">Contact Address:</span>{' '}
                  {isLoading ? 'Loading...' : addressText}
                </p>
              </div>
              <div className="space-y-6">
                <p>
                  <span className="font-semibold ">Gender:</span>{' '}
                  {isLoading ? 'Loading...' : gender}
                </p>
                <p>
                  <span className="font-semibold ">Country:</span> -
                </p>
                <p>
                  <span className="font-semibold ">Phone:</span>{' '}
                  {isLoading ? 'Loading...' : phone}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Card */}
      <Card className="rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-blue-600">
            Room Reviews
          </CardTitle>
          <Button
            variant="link"
            className="text-sm text-gray-500 hover:text-blue-600"
          >
            View All Reviews
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
};

export default DashboardOverviewPage;
