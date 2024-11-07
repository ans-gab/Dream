"use client";
import React, { useState, useEffect } from "react";
import { Button, Flex, Table, DatePicker, ConfigProvider } from "antd";
import useStore from "@/app/store/useStore"; // 引入 Zustand store
import RedBall from "@/app/components/RedBall";
import BlueBall from "@/app/components/BlueBall";
import zhCN from "antd/locale/zh_CN";
import "moment/locale/zh-cn";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

interface SearchParams {
  startDate?: string | null;
  endDate?: string | null;
}

interface LotteryData {
  code: number;
  date: string;
  red: number[];
  blue: number;
}

export default function RecordList() {
  const { data, setData } = useStore();
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const { RangePicker } = DatePicker;

  const onDateChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null],
    dateStrings: [string, string],
  ) => {
    if (dates) {
      setSearchParams({
        ...searchParams,
        startDate: dateStrings[0],
        endDate: dateStrings[1],
      });
    } else {
      setSearchParams({ ...searchParams, startDate: null, endDate: null });
    }
  };

  const getData = () => {
    fetch("data.json")
      .then((response) => response.json())
      .then((res: { result: LotteryData[] }) => {
        let dataArr = res.result;

        if (searchParams.startDate && searchParams.endDate) {
          dataArr = dataArr.filter((item) => {
            const date = new Date(item.date);

            return (
              // @ts-ignore
              date >= new Date(searchParams.startDate) &&
              // @ts-ignore
              date <= new Date(searchParams.endDate)
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

  const columns = [
    {
      title: "期号",
      dataIndex: "code",
      key: "期号",
      width: 100,
      sorter: (a: LotteryData, b: LotteryData) => a.code - b.code,
    },
    {
      title: "开奖日期",
      dataIndex: "date",
      key: "开奖日期",
      width: 100,
    },
    {
      title: "开奖号码",
      key: "开奖号码",
      width: 200,
      children: [
        {
          title: "红球号码",
          dataIndex: "red",
          key: "红球号码",
          width: 150,
          render: (text: number[]) => <RedBall numbers={text} />,
        },
        {
          title: "蓝球号码",
          dataIndex: "blue",
          key: "蓝球号码",
          width: 50,
          render: (text: number) => <BlueBall numbers={text} />,
        },
      ],
    },
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <Flex align="flex-start">
        {/* @ts-ignore */}
        <RangePicker onChange={onDateChange} />
        <Button onClick={getData}>查询</Button>
      </Flex>
      <Table
        dataSource={data.map((item: LotteryData) => ({
          ...item,
          key: item.code,
        }))}
        columns={columns}
      />
    </ConfigProvider>
  );
}
