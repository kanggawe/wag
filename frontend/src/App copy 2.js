import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [qr, setQr] = useState("");
  const [ready, setReady] = useState(false);
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const startSession = async () => {
      await axios.get("http://localhost:3001/start");
    };

    const fetchQr = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/qr");
        setQr(data.qr);
        setReady(data.ready);
      } catch (err) {
        console.error(err.message);
      }
    };

    const fetchHistory = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/history");
        setHistory(data);
      } catch (err) {
        console.error("Gagal ambil riwayat:", err.message);
      }
    };

    startSession();
    fetchQr();
    fetchHistory();

    const interval = setInterval(() => {
      fetchQr();
      fetchHistory();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    try {
      await axios.post("http://localhost:3001/send", { number, message });
      alert("Pesan dikirim!");
      setMessage("");
      setNumber("");
    } catch (error) {
      alert("Gagal kirim pesan");
      console.error(error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard WhatsApp Gateway</h1>
      {!ready ? (
        <>
          <p>Scan QR Code dengan WhatsApp:</p>
          {qr && <img src={qr} alt="QR Code" />}
        </>
      ) : (
        <>
          <p>Status: ✅ Terhubung</p>
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

      <hr />

      <h2>Riwayat Pesan</h2>
      {history.length === 0 ? (
        <p>Tidak ada pesan terkirim.</p>
      ) : (
        <table border="1" cellPadding={8}>
          <thead>
            <tr>
              <th>Nomor</th>
              <th>Pesan</th>
              <th>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{item.number}</td>
                <td>{item.message}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
