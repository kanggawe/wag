import React from 'react';

export default function History({ history }) {
  return (
    <div style={{ marginTop: 30 }}>
      <h3>Riwayat Pesan</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>No</th>
            <th>Nomor</th>
            <th>Pesan</th>
            <th>Waktu</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{h.number}</td>
              <td>{h.message}</td>
              <td>{h.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
