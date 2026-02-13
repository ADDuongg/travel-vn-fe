import { MainLayout } from '@/layout';
import FoodHeader from '@/sections/food/food-detail/FoodHeader';
import FoodStory from '@/sections/food/food-detail/FoodStory';
import FoodIngredients from '@/sections/food/food-detail/FoodIngredients';
import FoodHowToEat from '@/sections/food/food-detail/FoodHowToEat';
import FoodWhereToTry from '@/sections/food/food-detail/FoodWhereToTry';
import FoodRelated from '@/sections/food/food-detail/FoodRelated';
import FoodSidebar from '@/sections/food/food-detail/FoodSidebar';
import Container from '@components/Container';
import { Separator } from '@components/ui/separator';

const FoodDetailPage = () => {
  return (
    <MainLayout>
      <Container>
        <FoodHeader />
        <div className="grid grid-cols-12 w-full">
          <div className="col-span-12 xl:col-span-8 mt-10 px-[20px] space-y-10">
            <FoodStory />
            <Separator className="my-6" />
            <FoodIngredients />
            <Separator className="my-6" />
            <FoodHowToEat />
            <Separator className="my-6" />
            <FoodWhereToTry />
          </div>

          <div className="col-span-12 xl:col-span-4 mt-10 px-[20px]">
            <FoodSidebar />
          </div>

          <div className="col-span-12 mt-10 px-[20px] mb-10 space-y-10">
            <Separator className="my-6" />
            <FoodRelated />
          </div>
          <Separator className="my-6" />
        </div>
      </Container>
    </MainLayout>
  );
};

export default FoodDetailPage;
