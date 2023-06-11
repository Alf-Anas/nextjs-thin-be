import { Card } from "antd";
import { useIsLoggedIn, useCurrentUser } from "thin-backend-react";

export default function HomePage() {
  const isLoggedIn = useIsLoggedIn();
  const user = useCurrentUser();

  return (
    <Card style={{ maxWidth: 1000, margin: "auto" }}>
      {isLoggedIn && (
        <>
          <h3>Hello {user?.email}</h3>
        </>
      )}
      {!isLoggedIn && isLoggedIn !== null && (
        <>
          <h3>{"You're not logged in, please login to continue"}</h3>
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
