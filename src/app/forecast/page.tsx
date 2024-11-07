"use client";
import React, { useState, useEffect } from "react";
import { Button, Table, DatePicker, Flex, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import "moment/locale/zh-cn";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "./index.css";
import useStore from "@/app/store/useStore";

const { RangePicker } = DatePicker;

interface SearchParams {
  startDate?: string | null;
  endDate?: string | null;
}

interface ForeCastProps {
  getData?: () => void;
  searchParams?: SearchParams;
  setSearchParams?: (
    value: ((prevState: SearchParams) => SearchParams) | SearchParams,
  ) => void;
}

interface ForeCastProps {
  getData?: () => void;
}

const ForeCast = ({
  getData,
  searchParams,
  setSearchParams,
}: ForeCastProps) => {
  const { data, setData, currentPage } = useStore();
  // 定义搜索参数

  // 号码次数统计
  const [countArray, setCountArray] = useState([]);

  // 修改日期更改处理函数
  const onDateChange = (dates: any, dateStrings: any[]) => {
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

  // 在获取数据时使用搜索参数

  function processData() {
    getData?.();
    // 使用reduce统计红球和蓝球的数量
    const { redNumsCount, blueNumsCount } = data.reduce(
      (acc, item) => {
        // 将红球号码添加到统计
        item.red.split(",").forEach((num: string | number) => {
          acc.redNumsCount[num] = (acc.redNumsCount[num] || 0) + 1;
        });
        // 将蓝球号码添加到统计
        acc.blueNumsCount[item.blue] = (acc.blueNumsCount[item.blue] || 0) + 1;
        return acc;
      },
      { redNumsCount: {}, blueNumsCount: {} },
    );

    // 红球出现的次数
    const redCountsArray = Object.keys(redNumsCount).map((num) => ({
      key: `red-${num}`,
      num: num,
      count: redNumsCount[num],
    }));
    // 蓝球出现的次数
    const blueCountsArray = Object.keys(blueNumsCount).map((num) => ({
      key: `blue-${num}`,
      num: num,
      count: blueNumsCount[num],
    }));
    // 将红球次数和蓝球次数两个数组进行合并为一个新的数组
    const countsArray = [...redCountsArray, ...blueCountsArray];

    // @ts-ignore
    setCountArray(countsArray);
  }

  // 设置日期组件中的文字为中文
  dayjs.locale("zh-cn");

  useEffect(() => {
    if (data.length > 0) {
      processData();
    }
  }, []);

  const countColumns = [
    {
      title: "数字",
      dataIndex: "num",
      key: "数字",
      width: 100,
      defaultSortOrder: "ascend",
      sorter: (
        a: { key: string; num: number },
        b: { key: string; num: number },
      ) => {
        const aIsRed = a.key.startsWith("red-");
        const bIsRed = b.key.startsWith("red-");

        if (aIsRed && !bIsRed) return -1;
        if (!aIsRed && bIsRed) return 1;

        return a.num - b.num;
      },
      render: (
        text:
          | string
          | number
          | bigint
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | Promise<React.AwaitedReactNode>
          | null
          | undefined,
        record: { key: string },
      ) => {
        const isRed = record.key.startsWith("red-");
        const className = isRed ? "circle red-ball" : "circle blue-ball";
        return <span className={className}>{text}</span>;
      },
    },
    {
      title: "次数",
      dataIndex: "count",
      key: "次数",
      width: 100,
      sorter: (a: { count: number }, b: { count: number }) => a.count - b.count,
    },
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <div className="main-forecast">
        <Flex align="flex-start">
          <RangePicker
            onChange={onDateChange}
            defaultValue={[
              dayjs(searchParams?.startDate),
              dayjs(searchParams?.endDate),
            ]}
          />
          <Button onClick={processData}>执行</Button>
        </Flex>
        <Flex>
          <Table
            title={() => {
              return <h1>号码次数统计</h1>;
            }}
            size="small"
            // @ts-ignore
            columns={countColumns}
            dataSource={countArray}
            rowKey="key"
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"], // 允许用户选择每页显示的条数
              defaultPageSize: 10, // 默认每页显示的条数
            }}
          ></Table>
        </Flex>
      </div>
    </ConfigProvider>
  );
};

export default ForeCast;
