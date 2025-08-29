import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@components/ui/button';

const ProfilePage = () => (
  <div className="flex-1 space-y-6">
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold text-blue-600">
          My Profile
        </CardTitle>
        <Button variant="link" className="text-sm">
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <p>
            <span className="font-semibold">Name:</span> nguyen duong
          </p>
          <p>
            <span className="font-semibold">Birth Date:</span> May 8, 2002
          </p>
          <p>
            <span className="font-semibold">Email:</span> monbedehp1@gmail.com
          </p>
          <p>
            <span className="font-semibold">Contact Address:</span> -
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Gender:</span>{' '}
          </p>
          <p>
            <span className="font-semibold">Country:</span> United States of
            America (USA)
          </p>
          <p>
            <span className="font-semibold">Phone:</span> 0312569666
          </p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold text-blue-600">
          Room Reviews
        </CardTitle>
        <Button variant="link" className="text-sm">
          View All Reviews
        </Button>
      </CardHeader>
    </Card>
  </div>
);

export default ProfilePage;
