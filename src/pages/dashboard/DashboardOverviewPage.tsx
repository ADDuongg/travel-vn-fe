import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const DashboardOverviewPage: React.FC = () => {
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
                src="https://via.placeholder.com/80x80?text=👤"
                alt="Avatar"
                className="w-20 h-20 rounded-full border border-gray-200"
              />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm w-full">
              <div className="space-y-6">
                <p>
                  <span className="font-semibold ">Name:</span> nguyen duong
                </p>
                <p>
                  <span className="font-semibold ">Birth Date:</span> May 8,
                  2002
                </p>
                <p>
                  <span className="font-semibold ">Email:</span>{' '}
                  monbedehp1@gmail.com
                </p>
                <p>
                  <span className="font-semibold ">Contact Address:</span> -
                </p>
              </div>
              <div className="space-y-6">
                <p>
                  <span className="font-semibold ">Gender:</span> -
                </p>
                <p>
                  <span className="font-semibold ">Country:</span> United States
                  of America (USA)
                </p>
                <p>
                  <span className="font-semibold ">Phone:</span> 0312569666
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
