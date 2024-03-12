"use client"
import styles from "./page.module.css";
import { useState, FormEvent } from 'react';

interface Result {
  age?: number;
  gender?: string;
  country?: string;
}

export default function Home() {
  const [name, setName] = useState<string>('');
  const [result, setResult] = useState<Result>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const ageResponse = await fetch(`https://api.agify.io/?name=${name}`);
      const genderResponse = await fetch(`https://api.genderize.io/?name=${name}`);
      const countryResponse = await fetch(`https://api.nationalize.io/?name=${name}`);

      const ageData = await ageResponse.json();
      const genderData = await genderResponse.json();
      const countryData = await countryResponse.json();

      const highestProbabilityCountry = countryData.country.reduce((max, current) => {
        return current.probability > max.probability ? current : max;
      }, countryData.country[0]);
      
      console.log(highestProbabilityCountry);

      setResult({
        age: ageData.age,
        gender: genderData.gender,
        country: highestProbabilityCountry?.country_id,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <main className={styles.main}>
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>

      {result.age && (
        <div>
          <p>Guessed Age: {result.age}</p>
          <p>Guessed Gender: {result.gender}</p>
          <p>Guessed Country: {result.country}</p>
        </div>
      )}
    </div>
    </main>
  );
}
