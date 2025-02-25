export default function Header() {
  return (
    <header className="header">
      <a href="#/"><img src="/images/logo.svg" alt="Invoices Logo" /></a>
      <div className="header-wrapper">
        <img src="/images/dark-mode-icon.svg" alt="Switch Mode Icon" />
        <span className="divider"></span>
        <img src="/images/profile-picture.svg" alt="Profile Picture" />
      </div>
    </header>
  )
}