import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [qr, setQr] = useState("");
  const [ready, setReady] = useState(false);
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchQr = async () => {
      const { data } = await axios.get("http://localhost:3001/qr");
      setQr(data.qr);
      setReady(data.ready);
    };

    fetchQr();
    const interval = setInterval(fetchQr, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    await axios.post("http://localhost:3001/send", { number, message });
    alert("Pesan dikirim!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>WhatsApp Gateway</h1>
      {!ready ? (
        <>
          <p>Scan QR Code dengan WhatsApp:</p>
          {qr && <img src={qr} alt="QR Code" />}
        </>
      ) : (
        <>
          <p>Status: Terhubung</p>
          <input
            type="text"
            placeholder="Nomor (628xxx)"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <br />
          <textarea
            placeholder="Pesan"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <br />
          <button onClick={sendMessage}>Kirim Pesan</button>
        </>
      )}
    </div>
  );
}

export default App;
