import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../App";
import GoBackBtn from "./GoBackBtn";

export default function InvoiceDetails({ setCurrentRoute }){
  const { data, setData } = useContext(DataContext);
  const [ invoice, setInvoice ] = useState(null);
  const [ id, setId ] = useState(window.location.hash.split('/')[2] || null);
  const [ loading, setLoading ] = useState(true);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  
  useEffect(() => {
    const updateId = () => {
      setId(window.location.hash.split('/')[2]);
    };
    updateId();
    window.addEventListener("hashchange", updateId);
  }, []);
  
  useEffect(() => {
    if(!id && data.length == 0) return;
    setInvoice(data?.invoices?.find(x => x.id == id))
  }, [id, data])

  useEffect(() => {
    if(invoice) setLoading(false);
  }, [invoice])

  function handleClick(){
    setIsModalOpen(true);
  }

  function handleDelete(){
    setData({ invoices: data.invoices.filter(invoice => invoice.id != id)});
    setCurrentRoute('');
  }

  function markAsPaid(){
    const updatedInvoice = {
      ...invoice,
      status: 'Paid'
    }

    const updatedData = {
      ...data,
      invoices: data.invoices.map(x => x.id == id ? updatedInvoice : x)
    }

    setData(updatedData);
  }

  return(
    <>
    {loading ? (
      <h1>Yükleniyor..</h1> 
    ) : (
    <>
      <div className="invoice-details-container">
        <GoBackBtn setCurrentRoute={setCurrentRoute} route={''} />
        <div className="invoice-status">
          <p>Status</p>
          <div className={`invoice-cart-status ${invoice?.status?.toLowerCase()}`}><span></span><p>{invoice?.status}</p></div>
        </div>
        <div className="invoice-detail-container">
          <p className="id"><span>#</span>{invoice.id}</p>
          <p className="description">{invoice.description}</p>
          <div className="bill-from">
            <p>{invoice.billFrom.streetAddress}</p>
            <p>{invoice.billFrom.city}</p>
            <p>{invoice.billFrom.postCode}</p>
            <p>{invoice.billFrom.country}</p>
          </div>
          <div className="invoice-detail-container-wrapper">
            <div className="invoice-date">
              <div className="invoice-date-item">
                <p>Invoice Date</p>
                <p>{invoice.invoiceDate}</p>
              </div>
              <div className="invoice-date-item">
                <p>Payment Due</p>
                <p>{invoice.paymentDue}</p>
              </div>
            </div>
            <div className="bill-to">
              <p>Bill To</p>
              <p className="name">{invoice.billTo.clientName}</p>
              <p>{invoice.billTo.address}</p>
              <p>{invoice.billTo.city}</p>
              <p>{invoice.billTo.postCode}</p>
              <p>{invoice.billTo.country}</p>
            </div>
          </div>
          <div className="sent-to">
            <p>Sent to</p>
            <p>{invoice.billTo.clientEmail}</p>
          </div>
          <div className="payment">
            <div className="payment-items">
              {invoice.items.map((item, index) => (
                <div key={index} className="payment-item">
                  <div className="payment-item-wrapper">
                    <p>{item.itemName}</p>
                    <p>{item.quantity} x £ {item.price.toLocaleString('en-GB')}</p>
                  </div>
                  <p className="price">£ {(item.price * item.quantity).toLocaleString('en-GB')}</p>
                </div>))}
            </div>
            <div className="grand-total">
              <p>Grand Total</p>
              <p>£ {invoice.grandTotal.toLocaleString('en-GB')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="invoice-detail-buttons">
        <a href={`#/edit-invoice/${id}`} onClick={() => setCurrentRoute('edit-invoice')} className={`edit-btn ${invoice.status !== 'Pending' ? 'pending-btn' : ''}`}>Edit</a>
        <button onClick={handleClick} className={`delete-btn ${invoice.status !== 'Pending' ? 'pending-btn' : ''}`}>Delete</button>
        {invoice.status === 'Pending' ? <button className="mark-btn" onClick={markAsPaid}>Mark as Paid</button> : null}
      </div>
      {isModalOpen ? 
      <div className="modal">
        <div className="modal-content">
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete invoice #{invoice.id}? This action cannot be undone.</p>
          <div className="modal-buttons">
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            <a href="#/" onClick={handleDelete} className="delete-btn">Delete</a>
          </div>
        </div>
      </div> : null}
      </>
    )}
    </>
  )
}