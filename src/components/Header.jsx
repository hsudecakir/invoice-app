import { useContext } from "react";
import { RouteContext } from "../App";

export default function Header({ theme, setTheme }) {

  const { setCurrentRoute } = useContext(RouteContext);

  
  function toggleTheme(){
    if(theme == 'light'){
      setTheme('dark');
      localStorage.theme = 'dark';
    } else{
      setTheme('light');
      localStorage.theme = 'light';
    }
  }

  return (
    <header className="header">
      <a href="#/" onClick={() => setCurrentRoute('')}><img src="/images/logo.svg" alt="Invoices Logo" /></a>
      <div className="header-wrapper">
        <img onClick={toggleTheme} src={`/images/${theme == 'light' ? 'dark' : 'light'}-mode-icon.svg`} alt="Switch Mode Icon" />
        <span className="divider"></span>
        <img src="/images/profile-picture.svg" alt="Profile Picture" />
      </div>
    </header>
  )
}