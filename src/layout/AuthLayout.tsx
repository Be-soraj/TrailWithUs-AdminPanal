import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-[#009A86] to-[#4DB1B7] relative">
        <div className="flex flex-col justify-between min-h-screen">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-12">
              <div>
                <img src="/back.png" alt="" />
              </div>
              <div className="flex items-start relative">
                <img src="/top1.png" alt="" />
                <img className="absolute left-20" src="/top2.png" alt="" />
              </div>
            </div>
            <div>
              <img src="/top3.png" alt="" />
            </div>
          </div>
          <div className="flex items-end relative">
            <img src="/btm1.png" alt="" />
            <img className="absolute left-12" src="/btm2.png" alt="" />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
