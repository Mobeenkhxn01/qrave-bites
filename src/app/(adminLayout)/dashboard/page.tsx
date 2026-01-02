"use client";

import {SectionCards} from "@/components/shadcn-components/section-cards";
import {ChartAreaInteractive} from "@/components/shadcn-components/chart-area-interactive";
import DataTable from "@/components/shadcn-components/data-table";


import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export default function Page() {

  const { data: analytics = {
      revenue: 0,
      totalOrders: 0,
      todaysOrders: 0,
      qrScans: 0,
      chartData: [],
      notifications: []
  }} = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await axios.get("/api/analytics");
      return res.data;
    },
  });

  return (
    
        
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

              
              <SectionCards
                revenue={analytics.revenue}
                totalOrders={analytics.totalOrders}
                todaysOrders={analytics.todaysOrders}
                qrScans={analytics.qrScans}
              />

              <div className="px-4 lg:px-6">
                <ChartAreaInteractive  />
              </div>
              <div className="px-4 lg:px-6">
                <DataTable  />
              </div>

              
            </div>
          </div>
        </div>
      
  );
}
