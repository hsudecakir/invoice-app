export default function Header({ theme, setTheme }) {
  
  function toggleTheme(){
    if(theme == 'light'){
      setTheme('dark');
    } else{
      setTheme('light');
    }
  }

  return (
    <header className="header">
      <a href="#/"><img src="/images/logo.svg" alt="Invoices Logo" /></a>
      <div className="header-wrapper">
        <img onClick={toggleTheme} src={`/images/${theme == 'light' ? 'dark' : 'light'}-mode-icon.svg`} alt="Switch Mode Icon" />
        <span className="divider"></span>
        <img src="/images/profile-picture.svg" alt="Profile Picture" />
      </div>
    </header>
  )
}