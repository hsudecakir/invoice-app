import { useContext, useEffect, useState } from "react";
import GoBackBtn from "./GoBackBtn";
import { DataContext } from "../../App";
import Item from "./Item";

export default function EditInvoice({ setCurrentRoute }){
  const { data, setData } = useContext(DataContext);
  const [ invoice, setInvoice ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ id, setId ] = useState(window.location.hash.split('/')[2] || null);
  const [ isSelecting, setIsSelecting ] = useState(false);

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

  const paymentTerms = ['Net 1 Day', 'Net 7 Days', 'Net 14 Days', 'Net 30 Days'];

  function handleSubmit(e){
    e.preventDefault();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const paymentTerms = invoice.paymentTerms;
    const daysToAdd = parseInt(paymentTerms.split(" ")[1]);

    const invoiceDate = new Date(invoice.invoiceDate);

    let paymentDue = new Date(invoiceDate);
    paymentDue.setDate(invoiceDate.getDate() + daysToAdd);

    paymentDue = paymentDue.toISOString().split("T")[0];
    const [year, month, day] = paymentDue.split('-');
    const monthName = months[parseInt(month) - 1];
    paymentDue = `${parseInt(day)} ${monthName} ${year}`; 

    const form = e.target;
    const items = [];
    const itemInputs = Array.from(form.elements).filter(
      (element) => element.name.startsWith("itemName") ||
                  element.name.startsWith("quantity") ||
                  element.name.startsWith("price")
    );

    let grandTotal = 0;

    for (let i = 0; i < itemInputs.length; i += 3) {
      const itemName = itemInputs[i].value;
      const quantity = Number(itemInputs[i + 1].value);
      const price = Number(itemInputs[i + 2].value).toFixed(2);
      const total = quantity * price;
      grandTotal = grandTotal + total;

      items.push({
        id: invoice.items[i / 3].id,
        itemName,
        quantity,
        price,
        total,
      });
    }

    const updatedInvoice = {
      ...invoice,
      description: form.description.value,
      billFrom: {
        streetAddress: form.billFromStreetAddress.value,
        city: form.billFromCity.value,
        postCode: form.billFromPostCode.value,
        country: form.billFromCountry.value,
      },
      billTo: {
        clientName: form.billToClientName.value,
        clientEmail: form.billToClientEmail.value,
        address: form.billToStreetAddress.value,
        city: form.billToCity.value,
        postCode: form.billToPostCode.value,
        country: form.billToCountry.value,
      },
      paymentDue,
      items,
      grandTotal: grandTotal
    };

    const updatedData = {
      ...data,
      invoices: data.invoices.map(x => x.id == id ? updatedInvoice : x)
    }

    setData(updatedData);
    setCurrentRoute('invoice-details');
    window.location.hash = `#/invoice-details/${id}`;
  }

  function selectPaymentTerm(paymentTerm){
    const updatedInvoice = {
      ...invoice,
      paymentTerms: paymentTerm
    }

    setInvoice(updatedInvoice);
    setIsSelecting(false);
  }

  function addNewItem(){
    const updatedInvoice = {
      ...invoice,
      items: [
        ...invoice.items,
        {
          "id": invoice.items[invoice.items.length - 1].id + 1,
          "itemName": "",
          "quantity": 0,
          "price": 0,
          "total": 0
        }
      ]
    }
    setInvoice(updatedInvoice);
  }

  function deleteItem(item){
    const updatedInvoice = {
      ...invoice,
      items: invoice.items.filter(x => x.id !== item.id)
    }
    setInvoice(updatedInvoice);
  }

  return(
    <>
      {loading ? 
      (<h1>Loading...</h1>) : 
      (
        <div className="edit-invoice-container">
          <GoBackBtn setCurrentRoute={setCurrentRoute} route={`invoice-details/${id}`} />
          <h1>Edit <span>#</span>{id}</h1>
          <form onSubmit={handleSubmit}>
            <div className="bill-from-form">
              <h2>Bill From</h2>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                  <h3>Street Address</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="billFromStreetAddress" defaultValue={invoice.billFrom.streetAddress} />
              </div>
              <div className="bill-from-form-wrapper">
                <div className="bill-from-form-input">
                  <div className="bill-from-form-input-title">
                    <h3>City</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input type="text" name="billFromCity" defaultValue={invoice.billFrom.city} />
                </div>
                <div className="bill-from-form-input">
                  <div className="bill-from-form-input-title">
                    <h3>Post Code</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input type="text" name="billFromPostCode" defaultValue={invoice.billFrom.postCode} />
                </div>
              </div>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                  <h3>Country</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="billFromCountry" defaultValue={invoice.billFrom.country} />
              </div>
            </div>
            <div className="bill-to-form">
              <h2>Bill To</h2>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                  <h3>Client’s Name</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="billToClientName" defaultValue={invoice.billTo.clientName} />
              </div>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                  <h3>Client’s Email</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="billToClientEmail" defaultValue={invoice.billTo.clientEmail} />
              </div>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                  <h3>Street Address</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="billToStreetAddress" defaultValue={invoice.billTo.address} />
              </div>
              <div className="bill-from-form-wrapper">
                <div className="bill-from-form-input">
                  <div className="bill-from-form-input-title">
                    <h3>City</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input type="text" name="billToCity" defaultValue={invoice.billTo.city} />
                </div>
                <div className="bill-from-form-input">
                  <div className="bill-from-form-input-title">
                    <h3>Post Code</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input type="text" name="billToPostCode" defaultValue={invoice.billTo.postCode} />
                </div>
              </div>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                    <h3>Country</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="billToCountry" defaultValue={invoice.billTo.country} />
              </div>
            </div>
            <div className="dates">
              <div className="dates-wrapper">
                <div className="invoice-date-input-disabled">
                  <h3>Invoice Date</h3>
                  <div className="invoice-date-input">
                    <p>{invoice.invoiceDate}</p>
                    <img src="/images/date-icon.svg" alt="Date Icon" />
                  </div>
                </div>
                <div className={`payment-terms-input ${isSelecting ? 'selecting' : ''}`}>
                  <h3>Payment Terms</h3>
                  <button type="button" onClick={() => setIsSelecting(!isSelecting)}><p>{invoice.paymentTerms}</p> <img src="/images/arrow-down.svg" /></button>
                  <div className="payment-terms-input-drop-down-menu">
                    {paymentTerms.map(x => <p onClick={() => selectPaymentTerm(x)} key={x}>{x}</p>)}
                  </div>
                </div>
              </div>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                  <h3>Project Description</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="description" defaultValue={invoice.description} />
              </div>
            </div>
            <div className="item-list-form">
              <h2>Item List</h2>
              {invoice.items.map(x => <Item item={x} key={x.id} deleteItem={deleteItem} />)}
              <button type="button" onClick={addNewItem}>+ Add New Item</button>
            </div>
            <div className="edit-invoice-buttons">
              <a onClick={() =>setCurrentRoute('invoice-details')} href={`#/invoice-details/${id}`}>Cancel</a>
              <button type="submit">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}