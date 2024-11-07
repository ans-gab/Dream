"use client";
import React, { useState, useEffect } from "react";
import { Button, Flex, Table, DatePicker, ConfigProvider } from "antd";
import useStore from "@/app/store/useStore";
import SlideBar from "@/app/components/SideBar";
import RedBall from "@/app/components/RedBall";
import BlueBall from "@/app/components/BlueBall";
import RecordList from "@/app/recordList/page";
import zhCN from "antd/locale/zh_CN";
import "moment/locale/zh-cn";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "./index.css";
import SsqNumberGenerator from "@/app/random/page";
import ForeCast from "@/app/forecast/page";

interface SearchParams {
  startDate?: string | null;
  endDate?: string | null;
}

interface DataItem {
  code: number;
  date: string;
  red: number[];
  blue: number;
}

export default function Home() {
  const { data, setData, currentPage } = useStore();
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  const getData = () => {
    fetch("data.json")
      .then((response) => response.json())
      .then((res: { result: DataItem[] }) => {
        let dataArr = res.result;
        if (searchParams.startDate && searchParams.endDate) {
          dataArr = dataArr.filter((item) => {
            const date = new Date(item.date);
            return (
              date >= new Date(searchParams.startDate!) &&
              date <= new Date(searchParams.endDate!)
            );
          });
        }
        setData(dataArr);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  dayjs.locale("zh-cn");
  useEffect(() => {
    getData();
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="main">
        <SlideBar />
        <div className="right-slide">
          {currentPage === "recordList" && <RecordList />}
          {currentPage === "forecast" && <ForeCast />}
          {currentPage === "randomSSQ" && <SsqNumberGenerator />}
        </div>
      </div>
    </ConfigProvider>
  );
}