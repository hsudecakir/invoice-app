import { useContext, useState } from "react";
import { DataContext, ScreenContext } from "../../App";
import CreateInvoice from "./CreateInvoice";

export default function InvoicesContainer({ setCurrentRoute }){
  const { data, setData } = useContext(DataContext);
  const { screenSize } = useContext(ScreenContext);

  const [ filterBy, setFilterBy ] = useState('All');
  const [ isSelecting, setIsSelecting ] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);

  if(!data.invoices) return null;

  const allStatus = new Set(data.invoices.map(invoice => invoice.status));

  const status = ['All', ...allStatus];

  function closeModal(e){
    if(e.target.className == 'edit-modal'){
      setIsModalOpen(false);
    }
  }

  return(
    <div className="invoices-container">
    <div className="invoices-info-container">
      <div className="invoices-info">
        <h2>Invoices</h2>
        <p>{data.invoices.length == 0 ? 'No' : screenSize == 'mobile' ? data.invoices.length : `There are ${data.invoices.length} total`} invoices</p>
      </div>
      <div className="invoices-action-buttons">
        <div className={`filter-btn-container ${isSelecting ? 'active' : ''}`}>
          <button onClick={() => setIsSelecting(!isSelecting)} className="filter-btn">{screenSize == 'mobile' ? 'Filter' : 'Filter by status'} <img src="/images/arrow-down.svg" alt="Arrow Icon" /></button>
          <div className="drop-down-menu">
            {status.length > 1 ? status.map(x => <label key={x} htmlFor={x}><input onChange={() => {setFilterBy(x); setIsSelecting(false)}} checked={x == filterBy} type="radio" name="filter" id={x} /> <span className="checkbox"></span> {x}</label>) : 'No invoices'}
          </div>
        </div>
        {screenSize == 'mobile' ? <a onClick={() => setCurrentRoute('create-invoice')} href="#/create-invoice"><span><img src="/images/plus-icon.svg" alt="Plus Icon" /></span> <p>{screenSize == 'mobile' ? 'New' : 'New Invoice'}</p></a> : <button className="new-invoice-btn" onClick={() => setIsModalOpen(true)}><span><img src="/images/plus-icon.svg" alt="Plus Icon" /></span> <p>{screenSize == 'mobile' ? 'New' : 'New Invoice'}</p></button>}
      </div>
    </div>
    {data.invoices?.length > 0 ? 
      <div className="invoice-carts-container">
        {data.invoices.filter(invoice => filterBy == 'All' ? invoice.status.includes('') : invoice.status.includes(filterBy)).map(invoice => (
          <div key={invoice.id} className="invoice-cart">
            <a className="invoice-cart-container" onClick={() => setCurrentRoute('invoice-details')} href={`#/invoice-details/${invoice.id}`}>
              <div className="invoice-cart-header">
                <p className="id"><span>#</span>{invoice.id}</p>
                <p>{screenSize == 'mobile' ? invoice.billTo.clientName : `Due ${invoice.paymentDue}`}</p>
              </div>
              <div className="invoice-cart-body">
                <div className="invoice-cart-body-wrapper">
                  <p>{screenSize == 'mobile' ? `Due ${invoice.paymentDue}` : invoice.billTo.clientName}</p>
                  <p className="price">£ {Number(invoice.grandTotal.toFixed(2)).toLocaleString('en-GB')}</p>
                </div>
                <div className="invoice-cart-status-container">
                  <div className={`invoice-cart-status ${invoice.status.toLowerCase()}`}><span></span><p>{invoice.status}</p></div>
                  {screenSize !== 'mobile' && <img src="/images/arrow-down.svg" />}
                </div>
              </div>
            </a>
          </div>
        ))}
      </div> : 
      <div className="empty-invoices-container">
        <img src="/images/empty-container-image.svg" />
        <h1>There is nothing here</h1>
        <p>Create an invoice by clicking the <br /> <span>{screenSize == 'mobile' ? 'New' : 'New Invoice'}</span> button and get started</p>
      </div>
    }
    {isModalOpen && <div onClick={closeModal} className="edit-modal"><CreateInvoice setIsModalOpen={setIsModalOpen} /></div>}
    </div>
  )
}