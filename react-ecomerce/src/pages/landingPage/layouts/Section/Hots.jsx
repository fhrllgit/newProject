import { useFetch } from "../../../../hooks/useFetch"

function Hots() {
  const {data, loading, error} = useFetch("/")
  if (loading) return <p>loading</p>;
  if (error) return <p>Error: {error}</p>;

  const items = Array.isArray(data) ? data : []

  return (
    <div className="mt-28 px-16 py-4 w-screen h-screen overflow-hidden">
        <div>
          <h1 className="font-bold text-2xl">WHAT'S HOT</h1>
        </div>
        <div className="flex overflow-x-auto scrollbar-hide gap-4">
          {items.map((i) => {
            return (
              <div key={i.id} className="flex-shrink-0 w-64 text-sm flex flex-col justify-between">
                <img src={i.Image} alt="img" className="w-full h-72 object-cover"/>
                <div>
                  <p className="mt-4 font-bold">{i.category}</p>
                  <p className="">{i.point}</p>
                </div>
                <a href="" className="underline text-md font-bold tracking-wider">Beli sekarang</a>
              </div>
              
            )
          })}
        </div>
      </div>
  )
}

export default Hots