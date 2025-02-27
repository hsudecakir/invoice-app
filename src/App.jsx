import { createContext, useEffect, useState } from 'react'
import './App.css'
import Container from './components/Container'
import Header from './components/Header'

export const DataContext = createContext(null);

export default function App() {

  const [ data, setData ] = useState([]);
  const [ theme, setTheme ] = useState('light');

  useEffect(() => {
    async function fetchData() {
      const invoices = await fetch('/data/data.json').then(res => res.json());
      setData(invoices);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if(theme == 'dark'){
      document.body.classList.add('dark-mode');
    } else{
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);
  
  return (
    <>
      <DataContext.Provider value={{ data, setData}}>
        <Header theme={theme} setTheme={setTheme} />
        <Container />
      </DataContext.Provider>
    </>
  )
}

