import { useContext, useState } from "react"
import { ScreenContext } from "../../App";

export default function Item({ item, deleteItem, newError, setNewError }){
  const { screenSize } = useContext(ScreenContext);

  const [ quantity, setQuantity ] = useState(item.quantity);
  const [ price, setPrice ] = useState(item.price);

  return(
    <div className="item">
      <div className={`item-input ${newError.includes(`itemName-${item.id}`) && 'error'}`}>
        <div className="bill-from-form-input-title">
          {screenSize == 'mobile' && <h3>Item Name</h3>}
          <p className="error-text">Required</p>
        </div>
        <input onChange={(e) => setNewError(newError.filter(x => x !== `${e.target.name}-${item.id}`))} className="item-name-input" type="text" name="itemName" defaultValue={item.itemName} />
      </div>
      <div className="item-wrapper">
        <div className={`item-input ${newError.includes(`quantity-${item.id}`) && 'error'}`}>
          {screenSize == 'mobile' && <h3>Qty.</h3>}
          <input onChange={(e) => {setNewError(newError.filter(x => x !== `${e.target.name}-${item.id}`));  setQuantity(e.target.value)}} className="qty-input" type="number" name="quantity" defaultValue={item.quantity} />
        </div>
        <div className={`item-input ${newError.includes(`price-${item.id}`) && 'error'}`}>
          {screenSize == 'mobile' && <h3>Price</h3>}
          <input onChange={(e) => {setNewError(newError.filter(x => x !== `${e.target.name}-${item.id}`)); setPrice(e.target.value)}} type="number" name="price" defaultValue={item.price} />
        </div>
        <div className="item-total">
          {screenSize == 'mobile' && <h3>Total</h3>}
          <p className="price">{(quantity * price) >= 1000000000
            ? `${(quantity * price / 1000000000).toFixed(1)}B` 
            : (quantity * price) >= 1000000
            ? `${(quantity * price / 1000000).toFixed(1)}M` 
            : quantity * price >= 10000
              ? `${(quantity * price / 1000).toFixed(1)}K`
              : (quantity * price).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <img onClick={() => deleteItem(item)} src="/images/delete-icon.svg" alt="Delete Icon" />
      </div>
    </div>
  )
}