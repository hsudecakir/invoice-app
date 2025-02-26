import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../App";
import GoBackBtn from "./GoBackBtn";
import Item from "./Item";
import DatePicker from "./DatePicker";

export default function CreateInvoice({ setCurrentRoute }){

  const { data, setData } = useContext(DataContext);
  const [ loading, setLoading ] = useState(true);
  const [ isSelecting, setIsSelecting ] = useState(false);
  const [ items, setItems ] = useState([{
          "id": 1,
          "itemName": "",
          "quantity": 0,
          "price": 0,
          "total": 0
        }]);
  const [ paymentTerm, setPaymentTerm ] = useState('Net 1 Day');
  const [ isSelectingDate, setIsSelectingDate ] = useState(false);
  const [ invoiceDate, setInvoiceDate ] = useState(new Date().toDateString().split(' '));

  useEffect(() => {
    if(data) setLoading(false);
  }, []);

  const paymentTerms = ['Net 1 Day', 'Net 7 Days', 'Net 14 Days', 'Net 30 Days'];

  function generateRandomID() {
    const prefix = Math.random().toString(36).substring(2, 4).toUpperCase();
    const number = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${number}`;
  }

  function handleSubmit(e){
    e.preventDefault();
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

    const form = e.target;
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

    console.log(newInvoice);

    setData(updatedData);
    setCurrentRoute('');
    window.location.hash = `#/`;
  }

  function selectPaymentTerm(x){
    setPaymentTerm(x);
    setIsSelecting(false);
  }

  function addNewItem(){
    const updatedItems = [
        ...items,
        {
          "id": items[items.length - 1].id + 1,
          "itemName": "",
          "quantity": 0,
          "price": 0,
          "total": 0
        }
      ]
    setItems(updatedItems);
  }

  function deleteItem(item){
    const updatedInvoice = {
      ...invoice,
      items: invoice.items.filter(x => x.id !== item.id)
    }
    setInvoice(updatedInvoice);
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
        <div className="edit-invoice-container">
          <GoBackBtn setCurrentRoute={setCurrentRoute} route={''} />
          <h1>New Invoice</h1>
          <form onSubmit={handleSubmit}>
            <div className="bill-from-form">
              <h2>Bill From</h2>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                  <h3>Street Address</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="billFromStreetAddress" placeholder="e.g., 19 Union Terrace" />
              </div>
              <div className="bill-from-form-wrapper">
                <div className="bill-from-form-input">
                  <div className="bill-from-form-input-title">
                    <h3>City</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input type="text" name="billFromCity" placeholder="e.g., London" />
                </div>
                <div className="bill-from-form-input">
                  <div className="bill-from-form-input-title">
                    <h3>Post Code</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input type="text" name="billFromPostCode" placeholder="e.g., E1 3EZ" />
                </div>
              </div>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                  <h3>Country</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="billFromCountry" placeholder="e.g., United Kingdom" />
              </div>
            </div>
            <div className="bill-to-form">
              <h2>Bill To</h2>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                  <h3>Client’s Name</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="billToClientName" placeholder="e.g., Alex Grim" />
              </div>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                  <h3>Client’s Email</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="billToClientEmail" placeholder="e.g., alexgrim@mail.com" />
              </div>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                  <h3>Street Address</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="billToStreetAddress" placeholder="e.g., 84 Church Way" />
              </div>
              <div className="bill-from-form-wrapper">
                <div className="bill-from-form-input">
                  <div className="bill-from-form-input-title">
                    <h3>City</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input type="text" name="billToCity" placeholder="e.g., Bradford" />
                </div>
                <div className="bill-from-form-input">
                  <div className="bill-from-form-input-title">
                    <h3>Post Code</h3>
                    <p className="error-text">Required</p>
                  </div>
                  <input type="text" name="billToPostCode" placeholder="e.g., BD1 9PB" />
                </div>
              </div>
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                    <h3>Country</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="billToCountry" placeholder="e.g., United Kingdom" />
              </div>
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
              <div className="bill-from-form-input">
                <div className="bill-from-form-input-title">
                  <h3>Project Description</h3>
                  <p className="error-text">Required</p>
                </div>
                <input type="text" name="description" placeholder="e.g., Graphic Design" />
              </div>
            </div>
            <div className="item-list-form">
              <h2>Item List</h2>
              {items.map(x => <Item item={x} key={x.id} deleteItem={deleteItem} />)}
              <button type="button" onClick={addNewItem}>+ Add New Item</button>
            </div>
            <div className="create-invoice-buttons">
              <a onClick={() =>setCurrentRoute('')} href='#/'>Discard</a>
              <button className="draft-btn" type="submit" value={'Draft'}>Save as Draft</button>
              <button type="submit" value={'Pending'}>Save & Send</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}