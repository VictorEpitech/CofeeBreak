import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { client } from "../../utils/client"

export default function Credits() {

  const [charges, setCharges] = useState([])
  const router = useRouter()


  useEffect(() => {
    const getCharges = async() => {
      const data = await client.database.listDocuments(process.env.NEXT_PUBLIC_CREDIT_COLLECTION, undefined, 25, router.query.page ? (page - 1) * 25 : 0, undefined, undefined)
      if (data.total > 25) {
        console.log("should paginate")
      }
      setCharges(data.documents);    
    }
    getCharges()
  }, [router])

  useEffect(() => {
    const subscription = client.subscribe(`collections.${process.env.NEXT_PUBLIC_CREDIT_COLLECTION}.documents`, (e) => {
      console.log(e);
      if (e.event === "database.documents.update") {
        console.log(e.payload)
        setCharges((old) => {
          let newData = [...old];
          const changeIndex = newData.findIndex((x) => x.$id === e.payload.$id);
          if (changeIndex > -1) {
            newData[changeIndex] = {...e.payload}
          }
          return newData
        })
      } 
    });
    return () => subscription()
  }, [])

  return (
    <div className="h-ful w-full">
      <table className="table w-full">
        <thead>
          <tr>
            <th>login</th>
            <th>remaining charges</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {charges.map((e) => (
            <tr key={e.$id}>
              <th>{e.email}</th>
              <th>{e.charges}</th>
              <th>
                <button
                  className="btn btn-primary" 
                  onClick={() => {
                }}>                  <span className="uppercase">recharge</span>
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}