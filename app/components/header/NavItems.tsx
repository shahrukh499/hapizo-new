import Link from "next/link";
import React, { memo } from "react";
import { useNavbarData } from "./useNavbarData";
import { Box, Skeleton } from "@mui/material";

function NavItems() {
  const { data: navdata, isLoading, error } = useNavbarData();
  
  return (
    <Box sx={{display:{xs:"none",md:"block"}}}>
      <ul className="md:flex items-start gap-x-6 hidden">
        {navdata?.navdata?.map((el : any, i : number) => (
          <li key={i} className="group cursor-pointer py-5 relative">
            {
              isLoading ? (
                <div className="w-full">
                  <Skeleton variant="text" sx={{ fontSize: '1rem', width:'80px' }} />
                </div>
              ) : (
                <Link href="#" className="hover:text-blue-500 font-medium">
                  {el.name}
                </Link>
              )
            }
            {el.dropItem.length > 0 && (
              <ul className="absolute left-0 top-full z-999 hidden flex-col gap-2 border-t-[3px] border-amber-600 bg-white py-2 shadow-lg group-hover:flex min-w-[200px]">
                <div
                  className={`grid ${
                    el.dropItem.length > 30
                      ? "grid-cols-4 w-[800px]"
                      : el.dropItem.length > 20
                      ? "grid-cols-3 w-[600px]"
                      : el.dropItem.length > 10
                      ? "grid-cols-2 w-[400px]"
                      : "grid-cols-1 w-[200px]"
                  }`}
                >
                  {el.dropItem.map((item : any, j : number) => (
                    <li
                      key={j}
                      className="px-4 py-2 hover:bg-gray-100 text-sm whitespace-nowrap"
                    >
                      <Link className="max-w-full w-[200px] block" href={item.link}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </div>
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Box>
  );
}

export default memo(NavItems) ;
