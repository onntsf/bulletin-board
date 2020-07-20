import { useRouter } from "next/router";

const DetailPage = detail => {
  const router = useRouter();
  const { id } = router.query;

  return <p>Post: {id}</p>;
};

const getDetail = async id => {
  const res = await fetch("http://localhost:8888/detail/?id=" + id, {
    method: "get",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow"
  }).catch(error => console.log(error));
  const detail = (await res.json())[0];
  return detail;
};

export async function getServerSideProps(context) {
  const id = context.params.id;
  const detail = await getDetail(id);

  return {
    props: { detail } // will be passed to the page component as props
  };
}

export default DetailPage;
