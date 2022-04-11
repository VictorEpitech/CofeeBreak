import {useState} from "react"
import toast from "react-hot-toast"
import { client } from "../utils/client"

export default function FundsAdd({isOpen, setIsOpen, latestAmount}) {

  const [value, setValue] = useState(0)
  const [reason, setReason] = useState("")

  const handleSubmit = async(e) => {
    e.preventDefault()
    const total = parseFloat(value) + parseFloat(latestAmount);
    try {
      await client.database.createDocument(process.env.NEXT_PUBLIC_FUND_COLLECTION, "unique()", {amount: value, reason: reason || null, date: new Date().toISOString(), totalAmount: total})
      toast.success("funds updated")
      setIsOpen(false);
    } catch (error) {
      console.error(error)
      toast.error("something went wrong")
    }
  }


  if (isOpen) {
    return (
      <div className=" w-full h-full absolute top-0 z-10">
        <div className="bg-black/70 w-full h-full flex flex-col justify-center items-center" onClick={() => setIsOpen(false)}>
          <div className="card bg-base-100 w-96 shadow-xl z-20" onClick={(e) => e.stopPropagation()}>
            <div className="card-body">
              <h2 className="card-title">Add / Remove funds</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control">
                  <label className="label"><span className="label-text">Amount</span></label>
                  <input className="input input-bordered w-full max-w-xs" type="number" placeholder="Enter Amount" required value={value} onChange={(e) => setValue(e.target.value)}/>
                  {value < 0 && 
                    <>
                      <label className="label"><span className="label-text">Reason</span></label>
                      <input className="input input-bordered w-full max-w-xs" type="text" placeholder="Enter Reason" required value={reason} onChange={(e) => setReason(e.target.value)} />
                    </>
                  }
                </div>
                <div className="card-actions justify-end mt-3">
                  <button className="btn btn-error" onClick={() => {
                    setValue()
                    setReason("")
                    setIsOpen(false)
                  }}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return null;
}