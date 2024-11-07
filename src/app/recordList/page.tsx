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

interface RecordListProps {
  getData?: () => void;
  searchParams?: SearchParams;
  setSearchParams?: (
    value: ((prevState: SearchParams) => SearchParams) | SearchParams,
  ) => void;
}

interface RangePickerProps {
  onChange?: (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null],
    dateStrings: [string, string],
  ) => void;
}

const RecordList = ({
  getData,
  searchParams,
  setSearchParams,
}: RecordListProps) => {
  const { data, setData } = useStore();
  const { RangePicker } = DatePicker;

  const onDateChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null],
    dateStrings: [string, string],
  ) => {
    if (dates) {
      setSearchParams?.({
        ...searchParams,
        startDate: dateStrings[0],
        endDate: dateStrings[1],
      });
    } else {
      setSearchParams?.({ ...searchParams, startDate: null, endDate: null });
    }
  };

  dayjs.locale("zh-cn");

  useEffect(() => {
    getData?.();
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
      dataIndex: "winningNumbers",
      render: (text: string[]) => (
        <>
          <RedBall numbers={text[0]} />
          <BlueBall numbers={text[1]} />
        </>
      ),
    },
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <Flex align="flex-start">
        <RangePicker
          // @ts-ignore
          onChange={onDateChange}
          defaultValue={[
            searchParams?.startDate ? dayjs(searchParams.startDate) : null,
            searchParams?.endDate ? dayjs(searchParams.endDate) : null,
          ]}
        />
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
};

export default RecordList;
