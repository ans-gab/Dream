"use client";
import React, { useState, useEffect } from "react";
import { Button, Table, DatePicker, Flex, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import "moment/locale/zh-cn";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "./index.css";
const { RangePicker } = DatePicker;

const ForeCast = () => {
  const [data, setData] = useState([]);
  // 定义搜索参数
  const [searchParams, setSearchParams] = useState({});

  // 号码次数统计
  const [countArray, setCountArray] = useState([]);

  // 修改日期更改处理函数
  const onDateChange = (dates, dateStrings) => {
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

  // 在获取数据时使用搜索参数
  function getData() {
    fetch("data.json")
      .then((response) => response.json())
      .then((res) => {
        let dataArr = res.result;

        // 根据日期筛选数据
        if (searchParams.startDate && searchParams.endDate) {
          dataArr = dataArr.filter((item) => {
            const date = new Date(item.date); // 假设item.date是彩票的开奖日期
            return (
              date >= new Date(searchParams.startDate) &&
              date <= new Date(searchParams.endDate)
            );
          });
        }
        setData(dataArr);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function processData() {
    // 使用reduce统计红球和蓝球的数量
    const { redNumsCount, blueNumsCount } = data.reduce(
      (acc, item) => {
        // 将红球号码添加到统计
        item.red.split(",").forEach((num) => {
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

    setCountArray(countsArray);
  }
  // 设置日期组件中的文字为中文
  dayjs.locale("zh-cn");
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      processData();
    }
  }, [data]);

  const countColumns = [
    {
      title: "数字",
      dataIndex: "num",
      key: "数字",
      width: 100,
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        const aIsRed = a.key.startsWith("red-");
        const bIsRed = b.key.startsWith("red-");

        if (aIsRed && !bIsRed) return -1;
        if (!aIsRed && bIsRed) return 1;

        return a.num - b.num;
      },
      render: (text, record) => {
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
      sorter: (a, b) => a.count - b.count,
    },
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <div className="main-forecast">
        <Flex align="flex-start">
          <RangePicker onChange={onDateChange} />
          <Button onClick={getData}>执行</Button>
        </Flex>
        <Flex>
          <Table
            title={() => {
              return <h1>号码次数统计</h1>;
            }}
            size="small"
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
