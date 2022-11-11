import { useEffect } from "react";
import { Button } from "ui";

export default function Web() {
  useEffect(() => {
    fetch("http://localhost:4000/todos")
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <div>
      <h1>Web</h1>
      <Button />
    </div>
  );
}
