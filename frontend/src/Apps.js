import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [qr, setQr] = useState("");
  const [ready, setReady] = useState(false);
  const [numbers, setNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("");

  // const startSession = async () => {
  //   await axios.get("http://localhost:3001/start");
  // };

  // startSession();

  useEffect(() => {
    // const startSession = async () => {
    //   await axios.get("http://localhost:3001/start");
    // };

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

    // startSession();
    fetchQr();
    fetchHistory();

    const interval = setInterval(() => {
      fetchQr();
      fetchHistory();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    const numberList = numbers.split(",").map((n) => n.trim());
    for (const number of numberList) {
      try {
        await axios.post("http://localhost:3001/send", { number, message });
      } catch (error) {
        console.error(`Gagal kirim ke ${number}:`, error.message);
      }
    }

    alert("Pesan dikirim ke semua nomor!");
    setMessage("");
    setNumbers("");
  };

  const filteredHistory = history.filter(
    (item) =>
      item.number.includes(filter) ||
      item.message.toLowerCase().includes(filter.toLowerCase())
  );

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

          <label>Nomor Tujuan (628xxx, pisahkan dengan koma):</label>
          <br />
          <input
            type="text"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            placeholder="62812345678,62898765432"
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
      <input
        type="text"
        placeholder="🔍 Cari nomor atau isi pesan..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 10,
          borderRadius: 5,
          border: "1px solid #ccc",
        }}
      />

      {filteredHistory.length === 0 ? (
        <p>Tidak ada data cocok.</p>
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
            {filteredHistory.map((item, index) => (
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
