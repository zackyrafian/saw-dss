"use client"
import { useState } from "react"

export default function Home() {
  const [criteria, setCriteria] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCriteria(event.target.value);
  };

  return (
    <div>
      <input 
        type="text" 
        value={criteria} 
        onChange={handleChange} 
        placeholder="Masukkan kriteria" 
      />
      <p>Kriteria yang dimasukkan: {criteria}</p>
    </div>
  );
}
