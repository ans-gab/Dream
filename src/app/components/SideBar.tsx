"use client";
import React, { useState } from "react";
import { DribbbleOutlined } from "@ant-design/icons";
import useStore from "@/app/store/useStore";
import { Menu, Switch } from "antd";
const items = [
  {
    key: "sub1",
    label: "双色球",
    icon: <DribbbleOutlined />,
    children: [
      {
        key: "recordList",
        label: "历史开奖记录",
      },
      {
        key: "forecast",
        label: "开奖号码分析",
      },
      {
        key: "randomSSQ",
        label: "机选号码",
      },
    ],
  },
];
const SlideBar = () => {
  const [theme, setTheme] = useState("light");
  const { currentPage, setCurrentPage } = useStore();
  const changeTheme = (value: any) => {
    setTheme(value ? "light" : "dark");
  };
  const onClick = (e: { key: string }) => {
    console.log("click ", e);
    setCurrentPage(e.key);
  };

  return (
    <div className="left-slide">
      <Switch
        checked={theme === "light"}
        onChange={changeTheme}
        checkedChildren="Light"
        unCheckedChildren="Dark"
      />
      <br />
      <br />
      <Menu
        // @ts-ignore
        theme={theme}
        onClick={onClick}
        style={{
          width: 256,
        }}
        defaultOpenKeys={["sub1"]}
        selectedKeys={[currentPage]}
        mode="inline"
        items={items}
      />
    </div>
  );
};
export default SlideBar;
