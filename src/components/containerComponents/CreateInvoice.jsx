import GoBackBtn from "./GoBackBtn";

export default function CreateInvoice({ setCurrentRoute }){
  return(
    <>
      <GoBackBtn setCurrentRoute={setCurrentRoute} route={''} />
    </>
  )
}