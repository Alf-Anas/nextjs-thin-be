import { Card, Divider, Image, Space } from "antd";
import { useIsLoggedIn } from "thin-backend-react";
import ListProduct from "./ListProduct";
import AddProduct from "./AddProduct";

export default function HomePage() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <Card style={{ maxWidth: 1000, margin: "auto" }}>
      {isLoggedIn && (
        <>
          <Space
            wrap
            style={{ justifyContent: "space-between", width: "100%" }}
          >
            <h3>List Product</h3>
            <AddProduct />
          </Space>

          <Divider orientation="left" orientationMargin="0" />
          <ListProduct />
        </>
      )}
      {!isLoggedIn && isLoggedIn !== null && (
        <>
          <h3>{"You're not logged in, please login to continue"}</h3>
          <Image alt="disconnected" src="/src/disconnected.gif" />
        </>
      )}
      {isLoggedIn === null && (
        <>
          <h3>Loading...</h3>
        </>
      )}
    </Card>
  );
}
