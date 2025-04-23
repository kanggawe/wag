import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [qr, setQr] = useState("");
  const [ready, setReady] = useState(false);
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

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
    setMessage("");
    alert("Pesan terkirim!");
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get("http://localhost:3001/messages");
      setMessages(res.data);
    };
    fetchMessages();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>WhatsApp Multi-Device Gateway</h1>
      {!ready ? (
        <>
          <p>Scan QR Code:</p>
          {qr && <img src={qr} alt="QR Code" />}
        </>
      ) : (
        <>
          <p>Status: Terhubung</p>
          <input
            type="text"
            value={number}
            placeholder="Nomor (ex: 628xxx)"
            onChange={(e) => setNumber(e.target.value)}
          />
          <textarea
            value={message}
            placeholder="Isi Pesan"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Kirim</button>

          <h3>Riwayat Pesan</h3>
          <ul>
            {messages.map((m, i) => (
              <li key={i}>
                <b>{m.number}</b>: {m.message}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
