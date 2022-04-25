import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useSetRecoilState } from "recoil"
import loadingAtom from "../../context/atoms/loadingAtom"
import { client } from "../../utils/client"

export default function Consumes() {
  const [consumed, setConsumed] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const router = useRouter()
  const setLoading = useSetRecoilState(loadingAtom)


  useEffect(() => {
    const getConsumed = async () => {
      setLoading(true)
      const data = await client.database.listDocuments(process.env.NEXT_PUBLIC_CONSUME_COLLECTION, undefined, 25, router.query.page ? (router.query.page - 1) * 25 : 0, undefined, undefined, ["consumedAt"], ["ASC"])
      if (data.total > 25) {
        console.log("should paginate")
        setTotalPages(Math.floor(data.total / 25 + (data.total % 25 !== 0 ? 1 : 0)))
      }
      setConsumed(data.documents);
      setTotalDocs(data.total)
      setLoading(false)
    }
    getConsumed()
  }, [router, setConsumed, setLoading])
  

  useEffect(() => {
    const subscription = client.subscribe(`collections.${process.env.NEXT_PUBLIC_CONSUME_COLLECTION}.documents`, (e) => {
      console.log(e);
      if (e.event === "database.documents.update") {
        console.log(e.payload)
        setConsumed((old) => {
          let newData = [...old];
          const changeIndex = newData.findIndex((x) => x.$id === e.payload.$id);
          if (changeIndex > -1) {
            newData[changeIndex] = {...e.payload}
          }
          return newData
        })
      }
      if (e.event === "database.documents.create") {
        setConsumed((old) => [...old, e.payload])
      }
    });
    return () => subscription()
  }, [])

  return (
    <div className="w-full h-full relative">
      <table className="table w-full z-0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {consumed.map((e) => {
            return (
              <tr key={e.$id}>
                <td>{new Date(e.consumedAt).toLocaleDateString()}</td>
                <td>{e.email}</td>
                <td>{e.consumedItems}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="w-full flex justify-center">

      <div className="btn-group">
          <button 
          className="btn" 
          onClick={() => {
            router.push(`/dashboard/consumes?page=1`)
          }} 
          disabled={(router.query?.page || 0) == 1 ?? true}>{"<<"}</button>
          <button 
          className="btn"
          onClick={() => {
            router.push(`/dashboard/consumes?page=${parseInt(router.query?.page) - 1}`)
          }}
          disabled={router.query?.page < 2 ?? true}>{"<"}</button>
          <button className="btn btn-active">{router.query?.page || 1}</button>
          <button 
          className="btn"
          onClick={() => {
            router.push(`/dashboard/consumes?page=${(parseInt(router.query.page) || 1) + 1}`)
          }}
          disabled={router.query?.page == totalPages}>{">"}</button>
          <button className="btn" disabled={router.query?.page == totalPages} onClick={() => {
            router.push(`/dashboard/consumes?page=${totalPages}`, undefined)
          }}>{">>"}</button>
      </div>
      </div>
    </div>
  )
}