import { createContext, useEffect, useState } from 'react'
import './App.css'
import Container from './components/Container'
import Header from './components/Header'

export const DataContext = createContext(null);
export const RouteContext = createContext(null);
export const ScreenContext = createContext(null);

export default function App() {

  const [ data, setData ] = useState([]);
  const [ currentRoute, setCurrentRoute ] = useState(window.location.hash.split('/')[1] || '');
  const [ theme, setTheme ] = useState(localStorage.theme || window.matchMedia(('(prefers-color-scheme : dark)')).matches && 'dark' || 'light');
  const [ screenSize, setScreenSize ] = useState(getScreenSize());

  useEffect(() => {
    async function fetchData() {
      const invoices = await fetch('/data/data.json').then(res => res.json());
      setData(invoices);
    }
    if(localStorage.invoices){
      setData(JSON.parse(localStorage.invoices));
    } else{
      fetchData();
    }
  }, []);

  useEffect(() => {
    if(theme == 'dark'){
      document.body.classList.add('dark-mode');
    } else{
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  function getScreenSize(){
    if(window.innerWidth < 768){
      return 'mobile';
    } else if(window.innerWidth < 1280 && window.innerWidth >= 768){
      return 'tablet';
    } else{
      return 'desktop';
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    window.addEventListener("resize", handleResize);
  }, [])


  return (
    <>
      <DataContext.Provider value={{ data, setData}}>
        <RouteContext.Provider value={{ currentRoute, setCurrentRoute }}>
          <ScreenContext.Provider value={{ screenSize }}>
            <Header theme={theme} setTheme={setTheme} />
            <Container />
          </ScreenContext.Provider>
        </RouteContext.Provider>
      </DataContext.Provider>
    </>
  )
}

