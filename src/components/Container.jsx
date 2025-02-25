import { useContext, useState } from "react";
import { DataContext } from "../App";
import InvoicesContainer from "./containerComponents/InvoicesContainer";
import CreateInvoice from "./containerComponents/CreateInvoice";
import InvoiceDetails from "./containerComponents/InvoiceDetails";
import EditInvoice from "./containerComponents/EditInvoice";

export default function Container() {
  const { data, setData } = useContext(DataContext);
  
  const [ currentRoute, setCurrentRoute ] = useState(window.location.hash.split('/')[1] || '');

  const routes = [
    {
      hash: '',
      title: 'Home',
    },
    {
      hash: 'invoice-details',
      title: 'Invoice Details',
    },
    {
      hash: 'edit-invoice',
      title: 'Edit Invoice',
    },
    {
      hash: 'create-invoice',
      title: 'Create Invoice',
    }
  ]

  return (
    <div className="container">
      {currentRoute === '' ? <InvoicesContainer setCurrentRoute={setCurrentRoute} /> :
       currentRoute === 'create-invoice' ? <CreateInvoice setCurrentRoute={setCurrentRoute} /> :
       currentRoute === 'invoice-details' ? <InvoiceDetails setCurrentRoute={setCurrentRoute} /> :
       currentRoute === 'edit-invoice' ? <EditInvoice setCurrentRoute={setCurrentRoute} /> : '404 Not Found'}
    </div>
  )
}