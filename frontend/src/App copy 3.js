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
    <div
      style={{
        fontFamily: "Arial",
        maxWidth: 800,
        margin: "auto",
        padding: 20,
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>
        📲 WhatsApp Gateway
      </h1>

      {!ready ? (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 18 }}>
            Scan QR Code untuk koneksi ke WhatsApp:
          </p>
          {qr && <img src={qr} alt="QR Code" style={{ width: 250 }} />}
        </div>
      ) : (
        <div style={{ background: "#ecf0f1", padding: 20, borderRadius: 10 }}>
          <p style={{ color: "green", fontWeight: "bold" }}>
            ✅ Status: Terhubung
          </p>

          <label>Nomor Tujuan (format: 628xxx):</label>
          <br />
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 10,
              borderRadius: 5,
              border: "1px solid #ccc",
            }}
          />
          <br />

          <label>Pesan:</label>
          <br />
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 5,
              border: "1px solid #ccc",
              marginBottom: 10,
            }}
          />
          <br />

          <button
            onClick={sendMessage}
            style={{
              background: "#27ae60",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Kirim Pesan
          </button>
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />

      <h2 style={{ color: "#34495e" }}>📋 Riwayat Pesan</h2>
      {history.length === 0 ? (
        <p>Tidak ada pesan terkirim.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#bdc3c7" }}>
              <th style={tableCell}>Nomor</th>
              <th style={tableCell}>Pesan</th>
              <th style={tableCell}>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr
                key={index}
                style={{ background: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
              >
                <td style={tableCell}>{item.number}</td>
                <td style={tableCell}>{item.message}</td>
                <td style={tableCell}>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const tableCell = {
  border: "1px solid #ccc",
  padding: 10,
  textAlign: "left",
};

export default App;
