import { Card, CardContent } from "@/components/ui/card";
import ProgressBar from "@/components/common/ProgressBar";

type TourContainerProps = {
  activeStep: number;
  children: React.ReactNode;
};

const TourContainer = ({ activeStep, children }: TourContainerProps) => {
  return (
    <Card className="rounded-sm my-5 pt-0 pb-0 gap-0">
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
