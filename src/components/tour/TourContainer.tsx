import { Card, CardContent } from "@/components/ui/card";
import ProgressBar from "@/components/common/ProgressBar";
import Text from "@/components/common/text";

type TourContainerProps = {
  activeStep: number;
  children: React.ReactNode;
};

const TourContainer = ({ activeStep, children }: TourContainerProps) => {
  return (
    <Card className="rounded-sm my-5 pt-0 pb-0 gap-0">
      <div className="flex gap-2 justify-center items-center py-3">
        <Text type="subTitle" className="text-lg">
          New Tour Package
        </Text>
      </div>
      <div className="bg-[#E9F5FB] h-20">
        <ProgressBar
          className="translate-y-7"
          activeStep={activeStep}
          steps={[
            { title: "Basic Info" },
            { title: "Information" },
            { title: "Tour Plan" },
            { title: "Location" },
            { title: "Gallery" },
            { title: "Review" },
          ]}
        />
      </div>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
};

export default TourContainer;