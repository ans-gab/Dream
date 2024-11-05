"use client";
import React, { useState, useEffect } from "react";
import { Table } from "antd";
import "./index.css";
export default function Home() {
  // 从本地json文件中读取彩票数据
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        let dataArr = data.result;
        setData(dataArr);
        console.log(dataArr);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  // 定义表格列
  const columns = [
    {
      title: "期号",
      dataIndex: "code",
      key: "期号",
      width: 100,
      sorter: (a, b) => a.code - b.code, // 排序逻辑
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
          render: (text) =>
            text
              .split(",")
              .map((item) => <span className="circle red-ball">{item}</span>),
        },
        {
          title: "蓝球号码",
          dataIndex: "blue",
          key: "蓝球号码",
          width: 50,
          render: (text) =>
            text
              .split(",")
              .map((item) => <span className="circle blue-ball">{item}</span>),
        },
      ],
    },
  ];
  return (
    <div>
      <h1>历史数据</h1>
      <Table
        dataSource={data.map((item) => ({ ...item, key: item.code }))}
        columns={columns}
      />
    </div>
  );
}
