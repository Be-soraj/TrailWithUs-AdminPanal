import React from "react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const CustomBreadcrumb = () => {
  const location = useLocation();

  const pathName = location?.pathname.split("/").filter(Boolean);

  const BreadcrumbData: BreadcrumbItem[] = pathName?.map((name, index) => {
    const to = pathName?.slice(0, index + 1).join("/");
    return {
      label: name.charAt(0).toUpperCase() + name.slice(1),
      href: to,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {BreadcrumbData?.map((data, index) => (
          <React.Fragment key={index}>
            {index === BreadcrumbData.length - 1 ? (
              <BreadcrumbPage>{data?.label}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink asChild>
                  <Link to={`/${data.href}`}>{data.label}</Link>
                </BreadcrumbLink>
                {index < BreadcrumbData.length - 1 && <BreadcrumbSeparator />}
              </>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
