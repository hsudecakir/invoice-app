import { useContext, useEffect, useState } from "react";
import GoBackBtn from "./GoBackBtn";
import { DataContext, ScreenContext } from "../../App";
import Item from "./Item";

export default function EditInvoice({ setCurrentRoute, setIsEditModalOpen }){
  const { data, setData } = useContext(DataContext);
  const { screenSize } = useContext(ScreenContext);

  const [ invoice, setInvoice ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ id, setId ] = useState(window.location.hash.split('/')[2] || null);
  const [ isSelecting, setIsSelecting ] = useState(false);
  const [ newError, setNewError ] = useState([]);
  const [ isFieldEmpty, setIsFieldEmpty ] = useState(false);
  const [ isItemsEmpty, setIsItemsEmpty ] = useState(false);

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

  useEffect(() => {
    if(newError.length == 0){
      setIsFieldEmpty(false);
    }
  }, [newError])

  const paymentTerms = ['Net 1 Day', 'Net 7 Days', 'Net 14 Days', 'Net 30 Days'];

  function handleSubmit(e){
    e.preventDefault();

    const form = e.target;

    if(form.description.value.trim() == '' || form.billFromStreetAddress.value.trim() == '' || form.billFromCity.value.trim() == '' || form.billFromPostCode.value.trim() == '' || form.billFromCountry.value.trim() == '' || form.billToClientName.value.trim() == '' || form.billToClientEmail.value.trim() == '' || form.billToStreetAddress.value.trim() == '' || form.billToCity.value.trim() == '' || form.billToPostCode.value.trim() == '' || form.billToCountry.value.trim() == '' || invoice.items.length == 0 || form.itemName.value.trim() == '' || form.quantity.value == 0 || form.price == 0){
      const errorSet = new Set();

      if (form.description.value.trim() == '') errorSet.add('description');
      if (form.billFromStreetAddress.value.trim() == '') errorSet.add('billFromStreetAddress');
      if (form.billFromCity.value.trim() == '') errorSet.add('billFromCity');
      if (form.billFromPostCode.value.trim() == '') errorSet.add('billFromPostCode');
      if (form.billFromCountry.value.trim() == '') errorSet.add('billFromCountry');
      if (form.billToClientName.value.trim() == '') errorSet.add('billToClientName');
      if (form.billToClientEmail.value.trim() == '') errorSet.add('billToClientEmail');
      if (form.billToStreetAddress.value.trim() == '') errorSet.add('billToStreetAddress');
      if (form.billToCity.value.trim() == '') errorSet.add('billToCity');
      if (form.billToPostCode.value.trim() == '') errorSet.add('billToPostCode');
      if (form.billToCountry.value.trim() == '') errorSet.add('billToCountry');

      setIsFieldEmpty(true);

      if (invoice.items.length == 0) {
          setIsItemsEmpty(true);
      } else {
          if (form.itemName.value.trim() == '') errorSet.add('itemName');
          if (form.quantity.value == 0) errorSet.add('quantity');
          if (form.price.value == 0) errorSet.add('price');
      }

      setNewError(Array.from(errorSet));
      return;
    }

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
    if(screenSize == 'mobile'){
      setCurrentRoute('invoice-details');
      window.location.hash = `#/invoice-details/${id}`;
    } else{
      setIsEditModalOpen(false);
    }
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
          "id": invoice.items.length !== 0 ? invoice.items[invoice.items.length - 1].id + 1 : 1,
          "itemName": "",
          "quantity": '',
          "price": '',
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
          {screenSize == 'mobile' ? <GoBackBtn setCurrentRoute={setCurrentRoute} route={`invoice-details/${id}`} /> : ''}
          <h1>Edit <span>#</span>{id}</h1>
          <form onSubmit={handleSubmit}>
            <div className="bill-from-form">
              <h2>Bill From</h2>
              <div className={`bill-from-form-input ${newError.includes('billFromStreetAddress') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Street Address</h3>
                  <p className="error-text">Required</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billFromStreetAddress" defaultValue={invoice.billFrom.streetAddress} />
              </div>
              <div className="bill-from-form-wrapper">
                <div className={`bill-from-form-input ${newError.includes('billFromCity') && 'error'}`}>
                  <div className="bill-from-form-input-title">
                    <h3>City</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billFromCity" defaultValue={invoice.billFrom.city} />
                </div>
                <div className={`bill-from-form-input ${newError.includes('billFromPostCode') && 'error'}`}>
                  <div className="bill-from-form-input-title">
                    <h3>Post Code</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billFromPostCode" defaultValue={invoice.billFrom.postCode} />
                </div>
                {screenSize !== 'mobile' ? 
                (<div className={`bill-from-form-input ${newError.includes('billFromCountry') && 'error'}`}>
                  <div className="bill-from-form-input-title">
                    <h3>Country</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billFromCountry" defaultValue={invoice.billFrom.country} />
                </div>) : ''}
              </div>
              {screenSize == 'mobile' ? 
              (<div className={`bill-from-form-input ${newError.includes('billFromCountry') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Country</h3>
                  <p className="error-text">Required</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billFromCountry" defaultValue={invoice.billFrom.country} />
              </div>) : ''}
            </div>
            <div className="bill-to-form">
              <h2>Bill To</h2>
              <div className={`bill-from-form-input ${newError.includes('billToClientName') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Client’s Name</h3>
                  <p className="error-text">Required</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToClientName" defaultValue={invoice.billTo.clientName} />
              </div>
              <div className={`bill-from-form-input ${newError.includes('billToClientEmail') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Client’s Email</h3>
                  <p className="error-text">Required</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToClientEmail" defaultValue={invoice.billTo.clientEmail} />
              </div>
              <div className={`bill-from-form-input ${newError.includes('billToStreetAddress') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Street Address</h3>
                  <p className="error-text">Required</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToStreetAddress" defaultValue={invoice.billTo.address} />
              </div>
              <div className="bill-from-form-wrapper">
                <div className={`bill-from-form-input ${newError.includes('billToCity') && 'error'}`}>
                  <div className="bill-from-form-input-title">
                    <h3>City</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToCity" defaultValue={invoice.billTo.city} />
                </div>
                <div className={`bill-from-form-input ${newError.includes('billToPostCode') && 'error'}`}>
                  <div className="bill-from-form-input-title">
                    <h3>Post Code</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToPostCode" defaultValue={invoice.billTo.postCode} />
                </div>
                {screenSize !== 'mobile' ? 
                (<div className={`bill-from-form-input ${newError.includes('billToCountry') && 'error'}`}>
                  <div className="bill-from-form-input-title">
                    <h3>Country</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToCountry" defaultValue={invoice.billTo.country} />
                </div>) : ''}
              </div>
              {screenSize == 'mobile' ? 
              (<div className={`bill-from-form-input ${newError.includes('billToCountry') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Country</h3>
                  <p className="error-text">Required</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToCountry" defaultValue={invoice.billTo.country} />
              </div>) : ''}
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
              <div className={`bill-from-form-input ${newError.includes('description') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Project Description</h3>
                  <p className="error-text">Required</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="description" defaultValue={invoice.description} />
              </div>
            </div>
            <div className="item-list-form">
              <h2>Item List</h2>
              {screenSize !== 'mobile' && ( 
                <div className="item-list-form-header">
                  <p>Item Name</p>
                  <div className="item-list-form-header-wrapper">
                    <p>Qty.</p>
                    <p>Price</p>
                    <p>Total</p>
                  </div>
                </div> 
              )}
              {invoice.items.map(x => <Item item={x} key={x.id} deleteItem={deleteItem} newError={newError} setNewError={setNewError} />)}
              <button type="button" onClick={addNewItem}>+ Add New Item</button>
            </div>
            {isFieldEmpty || isItemsEmpty ? 
              <div className="empty-error-texts">
                {isFieldEmpty && <p className="field-error-text">- All fields must be added</p> }
                {isItemsEmpty && <p className="field-error-text">- An item must be added</p> }
              </div> 
            : ''}
            <div className="edit-invoice-buttons">
              {screenSize == 'mobile' ? <a onClick={() => setCurrentRoute('invoice-details')} href={`#/invoice-details/${id}`}>Cancel</a> : <button type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</button>}
              <button type="submit">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}