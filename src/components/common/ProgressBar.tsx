import { cn } from "@/lib/utils";
import Text from "./text";

type step = {
  title: string;
};

type ProgressBarProps = {
  activeStep: number;
  steps: step[];
  className?:string
};

const ProgressBar = ({ steps, activeStep, className, ...props }: ProgressBarProps) => {
  return (
    <div className={cn(
      "relative pb-5 px-10 lg:px-40",
      className
    )}{...props}>
      <div className="h-2 bg-gray-200 rounded-full relative">
        <div
          className="h-2 bg-[#33B0D6] rounded-full absolute top-0 left-0 transition-all duration-1000 ease-in-out"
          style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= activeStep;

          const positionPercent = (index / (steps.length - 1)) * 100;

          return (
            <div
              key={index}
              className="absolute -top-2 flex flex-col items-center"
              style={{
                left: `${positionPercent}%`,
                transform: "translateX(-50%)",
              }}
            >
              <span
                className={cn(
                  "w-6 h-6 rounded-full text-center leading-6 font-medium border transition-all duration-300 transform",
                  isActive
                    ? "bg-[#33B0D6] text-white border-[#33B0D6]"
                    : "bg-white text-[#33B0D6] border-[#33B0D6]"
                )}
              >
                {stepNumber}
              </span>
              <Text
                type="heading"
                className="text-xs text-center text-[#33B0D6] mt-2 w-16  sm:w-max"
              >
                {step.title}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
