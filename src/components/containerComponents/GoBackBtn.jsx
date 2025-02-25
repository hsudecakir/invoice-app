export default function GoBackBtn({ setCurrentRoute, route }){
  return(
    <a href={`#/${route}`} onClick={() => setCurrentRoute(route.split('/')[0])} className="go-back-btn"><img src="/images/arrow-down.svg" /> Go Back</a>
  )
} 