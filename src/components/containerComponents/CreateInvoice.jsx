import { useContext, useState, useEffect } from "react";
import { DataContext, ScreenContext } from "../../App";
import GoBackBtn from "./GoBackBtn";
import Item from "./Item";
import DatePicker from "./DatePicker";

export default function CreateInvoice({ setCurrentRoute, setIsModalOpen }){

  const { data, setData } = useContext(DataContext);
  const { screenSize } = useContext(ScreenContext);

  const [ loading, setLoading ] = useState(true);
  const [ isSelecting, setIsSelecting ] = useState(false);
  const [ items, setItems ] = useState([]);
  const [ paymentTerm, setPaymentTerm ] = useState('Net 1 Day');
  const [ isSelectingDate, setIsSelectingDate ] = useState(false);
  const [ invoiceDate, setInvoiceDate ] = useState(new Date().toDateString().split(' '));
  const [ newError, setNewError ] = useState([]);
  const [ isFieldEmpty, setIsFieldEmpty ] = useState(false);
  const [ isItemsEmpty, setIsItemsEmpty ] = useState(false);
  const [ isClosing, setIsClosing ] = useState(false);
  const [ wrongFormat, setWrongFormat ] = useState(false);
  

  useEffect(() => {
    if(data) setLoading(false);
  }, []);

  useEffect(() => {
    if(newError.length == 0){
      setIsFieldEmpty(false);
    }
  }, [newError])

  const paymentTerms = ['Net 1 Day', 'Net 7 Days', 'Net 14 Days', 'Net 30 Days'];

  function generateRandomID() {
    const prefix = Math.random().toString(36).substring(2, 4).toUpperCase();
    const number = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${number}`;
  }

  function handleSubmit(e){
    e.preventDefault();

    const form = e.target;

    if(form.description.value.trim() == '' || form.billFromStreetAddress.value.trim() == '' || form.billFromCity.value.trim() == '' || form.billFromPostCode.value.trim() == '' || form.billFromCountry.value.trim() == '' || form.billToClientName.value.trim() == '' || form.billToClientEmail.value.trim() == '' || form.billToStreetAddress.value.trim() == '' || form.billToCity.value.trim() == '' || form.billToPostCode.value.trim() == '' || form.billToCountry.value.trim() == '' || items.length == 0 || invoice.items.length == 1 && form.itemName.value.trim() == '' || invoice.items.length == 1 && form.quantity.value == 0 || invoice.items.length == 1 && form.price.value == 0 || invoice.items.length !== 0 && Array.from(form.itemName).some(x => x.value.trim() == '') || invoice.items.length !== 0 && Array.from(form.itemName).some(x => x.quantity == 0) || invoice.items.length !== 0 && Array.from(form.itemName).some(x => x.price == 0) || !form.billToClientEmail.value.includes('@')){
      const errorSet = new Set();

      if (form.description.value.trim() == '') errorSet.add('description');
      if (form.billFromStreetAddress.value.trim() == '') errorSet.add('billFromStreetAddress');
      if (form.billFromCity.value.trim() == '') errorSet.add('billFromCity');
      if (form.billFromPostCode.value.trim() == '') errorSet.add('billFromPostCode');
      if (form.billFromCountry.value.trim() == '') errorSet.add('billFromCountry');
      if (form.billToClientName.value.trim() == '') errorSet.add('billToClientName');
      if (form.billToClientEmail.value.trim() == '') errorSet.add('billToClientEmail');
      if (form.billToClientEmail.value.trim() !== '' && !form.billToClientEmail.value.includes('@')) {setWrongFormat(true); errorSet.add('billToClientEmail');};
      if (form.billToStreetAddress.value.trim() == '') errorSet.add('billToStreetAddress');
      if (form.billToCity.value.trim() == '') errorSet.add('billToCity');
      if (form.billToPostCode.value.trim() == '') errorSet.add('billToPostCode');
      if (form.billToCountry.value.trim() == '') errorSet.add('billToCountry');

      setIsFieldEmpty(true);

      if (items.length == 0) {
          setIsItemsEmpty(true);
      } else {
        const itemNames = form.querySelectorAll('[name="itemName"]');
        const quantities = form.querySelectorAll('[name="quantity"]');
        const prices = form.querySelectorAll('[name="price"]');

        itemNames.forEach((itemName, index) => {
            if (itemName.value.trim() == '') errorSet.add(`itemName-${items[index].id}`);
        });

        quantities.forEach((quantity, index) => {
            if (quantity.value == 0) errorSet.add(`quantity-${items[index].id}`);
        });

        prices.forEach((price, index) => {
            if (price.value == 0) errorSet.add(`price-${items[index].id}`);
        });
      }

      setNewError(Array.from(errorSet));
      return;
    }

    const action = e.nativeEvent.submitter.value;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const paymentTerms = paymentTerm;
    const daysToAdd = parseInt(paymentTerms.split(" ")[1]);

    const updatedInvoiceDate = new Date(invoiceDate);

    let paymentDue = new Date(updatedInvoiceDate);
    paymentDue.setDate(updatedInvoiceDate.getDate() + daysToAdd);

    paymentDue = paymentDue.toISOString().split("T")[0];
    const [year, month, day] = paymentDue.split('-');
    const monthName = months[parseInt(month) - 1];
    paymentDue = `${parseInt(day)} ${monthName} ${year}`; 

    const itemInputs = Array.from(form.elements).filter(
      (element) => element.name.startsWith("itemName") ||
                  element.name.startsWith("quantity") ||
                  element.name.startsWith("price")
    );

    let grandTotal = 0;
    let updatedItems = [];

    for (let i = 0; i < itemInputs.length; i += 3) {
      const itemName = itemInputs[i].value;
      const quantity = Number(itemInputs[i + 1].value);
      const price = Number(itemInputs[i + 2].value).toFixed(2);
      const total = quantity * price;
      grandTotal = grandTotal + total;
      console.log(items)

      updatedItems.push({
        id: items[i / 3].id,
        itemName,
        quantity,
        price,
        total,
      });

    }

    const newInvoice = {
      id: generateRandomID(),
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
      invoiceDate: `${invoiceDate[2]} ${invoiceDate[1]} ${invoiceDate[3]}`,
      paymentDue,
      paymentTerms: paymentTerm,
      items: updatedItems,
      grandTotal: grandTotal,
      status: action
    };

    const updatedData = {
      ...data,
      invoices: [
        newInvoice,
        ...data.invoices
      ]
    }

    setData(updatedData);
    localStorage.invoices = JSON.stringify(updatedData);
    if(screenSize == 'mobile'){
      setCurrentRoute('');
      window.location.hash = `#/`;
    } else{
      setIsClosing(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 300);
    }
  }

  function selectPaymentTerm(x){
    setPaymentTerm(x);
    setIsSelecting(false);
  }

  function addNewItem(){
    const updatedItems = [
        ...items,
        {
          "id": items.length !== 0 ? items[items.length - 1].id + 1 : 1,
          "itemName": "",
          "quantity": 0,
          "price": 0,
          "total": 0
        }
      ]
    setItems(updatedItems);
    setIsItemsEmpty(false);
  }

  function deleteItem(item){
    const updatedItems = items.filter(x => x.id !== item.id);
    if(updatedItems.length == 0) setIsItemsEmpty(true);
    setItems(updatedItems);
  }

  function selectDate(selectedDate){
    setInvoiceDate(selectedDate.toDateString().split(' '));
    setIsSelectingDate(false);
  }

  return(
    <>
      {loading ? 
      (<h1>Loading...</h1>) : 
      (
        <div className={`edit-invoice-container ${isClosing && 'closing'}`}>
          {screenSize == 'mobile' && <GoBackBtn setCurrentRoute={setCurrentRoute} route={''} />}
          <h1>New Invoice</h1>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="bill-from-form">
              <h2>Bill From</h2>
              <div className={`bill-from-form-input ${newError.includes('billFromStreetAddress') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Street Address</h3>
                  <p className="error-text">can’t be empty</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billFromStreetAddress" />
              </div>
              <div className="bill-from-form-wrapper">
                <div className={`bill-from-form-input ${newError.includes('billFromCity') && 'error'}`}>
                  <div className="bill-from-form-input-title">
                    <h3>City</h3>
                    <p className="error-text">can’t be empty</p>
                  </div>
                  <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billFromCity" />
                </div>
                <div className={`bill-from-form-input ${newError.includes('billFromPostCode') && 'error'}`}>
                  <div className="bill-from-form-input-title">
                    <h3>Post Code</h3>
                    <p className="error-text">can’t be empty</p>
                  </div>
                  <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billFromPostCode" />
                </div>
                {screenSize !== 'mobile' ? 
                (<div className={`bill-from-form-input ${newError.includes('billFromCountry') && 'error'}`}>
                  <div className="bill-from-form-input-title">
                    <h3>Country</h3>
                    <p className="error-text">can’t be empty</p>
                  </div>
                  <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billFromCountry" />
                </div>) : ''}
              </div>
              {screenSize == 'mobile' ? 
              (<div className={`bill-from-form-input ${newError.includes('billFromCountry') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Country</h3>
                  <p className="error-text">can’t be empty</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billFromCountry" />
              </div>) : ''}
            </div>
            <div className="bill-to-form">
              <h2>Bill To</h2>
              <div className={`bill-from-form-input ${newError.includes('billToClientName') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Client’s Name</h3>
                  <p className="error-text">can’t be empty</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToClientName" />
              </div>
              <div className={`bill-from-form-input ${newError.includes('billToClientEmail') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Client’s Email</h3>
                  <p className="error-text">{wrongFormat ? 'wrong format' : 'can’t be empty'}</p>
                </div>
                <input onChange={(e) => {setNewError(newError.filter(x => x !== e.target.name)); setWrongFormat(false)}} type="text" name="billToClientEmail" placeholder="e.g. email@example.com" />
              </div>
              <div className={`bill-from-form-input ${newError.includes('billToStreetAddress') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Street Address</h3>
                  <p className="error-text">can’t be empty</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToStreetAddress" />
              </div>
              <div className="bill-from-form-wrapper">
                <div className={`bill-from-form-input ${newError.includes('billToCity') && 'error'}`}>
                  <div className="bill-from-form-input-title">
                    <h3>City</h3>
                    <p className="error-text">can’t be empty</p>
                  </div>
                  <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToCity" />
                </div>
                <div className={`bill-from-form-input ${newError.includes('billToPostCode') && 'error'}`}>
                  <div className="bill-from-form-input-title">
                    <h3>Post Code</h3>
                    <p className="error-text">can’t be empty</p>
                  </div>
                  <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToPostCode" />
                </div>
                {screenSize !== 'mobile' ? 
                (<div className={`bill-from-form-input ${newError.includes('billToCountry') && 'error'}`}>
                  <div className="bill-from-form-input-title">
                    <h3>Country</h3>
                    <p className="error-text">can’t be empty</p>
                  </div>
                  <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToCountry" />
                </div>) : ''}
              </div>
              {screenSize == 'mobile' ? 
              (<div className={`bill-from-form-input ${newError.includes('billToCountry') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Country</h3>
                  <p className="error-text">can’t be empty</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="billToCountry" />
              </div>) : ''}
            </div>
            <div className="dates">
              <div className="dates-wrapper">
                <div className={`invoice-date-input-active ${isSelectingDate ? 'selecting' : ''}`}>
                  <h3>Invoice Date</h3>
                  <div onClick={() => setIsSelectingDate(!isSelectingDate)} className="invoice-date-input">
                    <p>{`${invoiceDate[2]} ${invoiceDate[1]} ${invoiceDate[3]}`}</p>
                    <img src="/images/date-icon.svg" alt="Date Icon" />
                  </div>
                    <DatePicker selectDate={selectDate} />
                </div>
                <div className={`payment-terms-input ${isSelecting ? 'selecting' : ''}`}>
                  <h3>Payment Terms</h3>
                  <button type="button" onClick={() => setIsSelecting(!isSelecting)}><p>{paymentTerm}</p> <img src="/images/arrow-down.svg" /></button>
                  <div className="payment-terms-input-drop-down-menu">
                    {paymentTerms.map(x => <p onClick={() => selectPaymentTerm(x)} key={x}>{x}</p>)}
                  </div>
                </div>
              </div>
              <div className={`bill-from-form-input ${newError.includes('description') && 'error'}`}>
                <div className="bill-from-form-input-title">
                  <h3>Project Description</h3>
                  <p className="error-text">can’t be empty</p>
                </div>
                <input onChange={(e) => setNewError(newError.filter(x => x !== e.target.name))} type="text" name="description" placeholder="e.g. Graphic Design Service" />
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
              {items.map(x => <Item item={x} key={x.id} deleteItem={deleteItem} newError={newError} setNewError={setNewError} />)}
              <button type="button" onClick={addNewItem}>+ Add New Item</button>
            </div>
            {isFieldEmpty || isItemsEmpty ? 
              <div className="empty-error-texts">
                {isFieldEmpty && <p className="field-error-text">- All fields must be added</p> }
                {isItemsEmpty && <p className="field-error-text">- An item must be added</p> }
              </div> 
            : ''}
            <div className="create-invoice-buttons">
              {screenSize == 'mobile' ? <a onClick={() =>setCurrentRoute('')} href='#/'>Discard</a> : <button className="discard-btn" type="button" onClick={() => {setIsClosing(true);
              setTimeout(() => {
                setIsModalOpen(false);
              }, 300)}}>Discard</button> }
              <div className="create-invoice-buttons-wrapper">
                <button className="draft-btn" type="submit" value={'Draft'}>Save as Draft</button>
                <button type="submit" value={'Pending'}>Save & Send</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  )
}