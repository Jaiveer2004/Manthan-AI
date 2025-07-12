import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4598/api/test")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMessage(data.message);
      })
      .catch((err) => console.error("Error Connecting to backend", err));
  }, []);

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600">Manthan</h1>
        <p className="mt-4">Backend says: {message}</p>
      </div>
    </>
  );
}

export default App;
