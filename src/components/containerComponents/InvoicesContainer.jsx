import { useContext, useState } from "react";
import { DataContext } from "../../App";

export default function InvoicesContainer({ setCurrentRoute }){
  const { data, setData } = useContext(DataContext);

  const [ filterBy, setFilterBy ] = useState('All');
  const [ isSelecting, setIsSelecting ] = useState(false);

  if(!data.invoices) return null;

  const allStatus = new Set(data.invoices.map(invoice => invoice.status));

  const status = ['All', ...allStatus];

  return(
    <div className="invoices-container">
    <div className="invoices-info-container">
      <div className="invoices-info">
        <h2>Invoices</h2>
        <p>{data.invoices.length == 0 ? 'No' : data.invoices.length} invoices</p>
      </div>
      <div className="invoices-action-buttons">
        <div className={`filter-btn-container ${isSelecting ? 'active' : ''}`}>
          <button onClick={() => setIsSelecting(!isSelecting)} className="filter-btn">Filter <img src="/images/arrow-down.svg" alt="Arrow Icon" /></button>
          <div className="drop-down-menu">
            {status.length > 1 ? status.map(x => <label key={x} htmlFor={x}><input onChange={() => {setFilterBy(x); setIsSelecting(false)}} checked={x == filterBy} type="radio" name="filter" id={x} /> <span className="checkbox"></span> {x}</label>) : 'No invoices'}
          </div>
        </div>
        <a onClick={() => setCurrentRoute('create-invoice')} href="#/create-invoice"><span><img src="/images/plus-icon.svg" alt="Plus Icon" /></span> <p>New</p></a>
      </div>

    </div>
    {data.invoices?.length > 0 ? 
      <div className="invoice-carts-container">
        {data.invoices.filter(invoice => filterBy == 'All' ? invoice.status.includes('') : invoice.status.includes(filterBy)).map(invoice => (
          <div key={invoice.id} className="invoice-cart">
            <a onClick={() => setCurrentRoute('invoice-details')} href={`#/invoice-details/${invoice.id}`}>
              <div className="invoice-cart-header">
                <p className="id"><span>#</span>{invoice.id}</p>
                <p>{invoice.billTo.clientName}</p>
              </div>
              <div className="invoice-cart-body">
                <div className="invoice-cart-body-wrapper">
                  <p>Due {invoice.paymentDue}</p>
                  <p className="price">£ {Number(invoice.grandTotal.toFixed(2)).toLocaleString('en-GB')}</p>
                </div>
                <div className={`invoice-cart-status ${invoice.status.toLowerCase()}`}><span></span><p>{invoice.status}</p></div>
              </div>
            </a>
          </div>
        ))}
      </div> : 
      <div className="empty-invoices-container">
        <img src="/images/empty-container-image.svg" />
        <h1>There is nothing here</h1>
        <p>Create an invoice by clicking the <br /> <span>New</span> button and get started</p>
      </div>
    }
    </div>
  )
}