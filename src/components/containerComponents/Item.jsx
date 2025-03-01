import { useContext, useState } from "react"
import { ScreenContext } from "../../App";

export default function Item({ item, deleteItem }){
  const { screenSize } = useContext(ScreenContext);

  const [ quantity, setQuantity ] = useState(item.quantity);
  const [ price, setPrice ] = useState(item.price);

  return(
    <div className="item">
      <div className="item-input">
        <div className="bill-from-form-input-title">
          {screenSize == 'mobile' && <h3>Item Name</h3>}
          <p className="error-text">Required</p>
        </div>
        <input className="item-name-input" type="text" name="itemName" placeholder="e.g., Banner Design" defaultValue={item.itemName} />
      </div>
      <div className="item-wrapper">
        <div className="item-input">
          {screenSize == 'mobile' && <h3>Qty.</h3>}
          <input className="qty-input" type="number" name="quantity" placeholder="e.g., 1, 2, etc." defaultValue={item.quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <div className="item-input">
          {screenSize == 'mobile' && <h3>Price</h3>}
          <input type="number" name="price" placeholder="e.g., 200.00" defaultValue={item.price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="item-total">
          {screenSize == 'mobile' && <h3>Total</h3>}
          <p className="price">{quantity * price}</p>
        </div>
        <img onClick={() => deleteItem(item)} src="/images/delete-icon.svg" alt="Delete Icon" />
      </div>
    </div>
  )
}