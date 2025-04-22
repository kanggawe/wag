import React, { useState } from 'react';
import axios from 'axios';

export default function SendForm() {
  const [numbers, setNumbers] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    const numberList = numbers.split(',').map(n => n.trim());
    try {
      await axios.post('http://localhost:3001/send', { numbers: numberList, message });
      alert('Pesan berhasil dikirim!');
      setNumbers('');
      setMessage('');
    } catch (err) {
      alert('Gagal kirim: ' + err.message);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Kirim Pesan</h3>
      <textarea
        placeholder="Nomor (pisahkan dengan koma, ex: 628xxxx,628yyyy)"
        value={numbers}
        onChange={(e) => setNumbers(e.target.value)}
        rows={2}
        style={{ width: '400px', padding: '5px' }}
      />
      <br />
      <textarea
        placeholder="Tulis pesan"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        style={{ width: '400px', marginTop: '10px', padding: '5px' }}
      />
      <br />
      <button onClick={handleSend} style={{ marginTop: 10 }}>
        Kirim
      </button>
    </div>
  );
}
