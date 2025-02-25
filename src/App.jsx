import { createContext, useEffect, useState } from 'react'
import './App.css'
import Container from './components/Container'
import Header from './components/Header'

export const DataContext = createContext(null);

export default function App() {

  const [ data, setData ] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const invoices = await fetch('/data/data.json').then(res => res.json());
      setData(invoices);
    }
    fetchData();
  }, [])
  
  return (
    <>
      <DataContext.Provider value={{ data, setData}}>
        <Header />
        <Container />
      </DataContext.Provider>
    </>
  )
}

