import Router from 'next/router'

const ConfirmPage = ({ posts }) => (
  <>
  ok~
  </>
);

export async function getServerSideProps(context) {
  const data = context.req.body
  console.log('data: ',data)
//const res = await fetch("http://localhost:8888/", {
//      method: "POST",
//      mode: "cors",
//      cache: "no-cache",
//      headers: {
//        "Content-Type": "application/json; charset=utf-8"
//      },
//      redirect: "follow",
//      body: JSON.stringify(data)
//    }).catch(error => console.log(error));
//    const result = await res.json();
//    if (result.message == "ok") {
//      Router.reload();
//    }
////    const result = await res.json();
////    if (result.message == "ok") {
////      Router.reload();
////    }
//
//  const posts = await res.json();
  return {
//    props: { posts },
     props:     {}
  };
}

export default ConfirmPage;


