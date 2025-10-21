import { LuArrowRightFromLine } from "react-icons/lu"

function Button({title}) {
  return (
    <>
      <div className="flex w-full h-full justify-center">
        <a 
        href="#"
        className="bg-black text-white px-8 py-4 flex items-center gap-2"
        >
          <span>{title}</span>
          <span className=" relative overflow-hidden">
            <LuArrowRightFromLine className="block text-xl translate-x-0 group-hover:translate-x-full duration-300"/>
            <LuArrowRightFromLine className="absolute text-xl inset-0 -translate-x-full group-hover:translate-x-0 duration-300"/>
          </span>
        </a>
        <div className="bg-white hover:bg-gray-300 shadow shadow-white text-black absolute "></div>
      </div>
    </>
  )
}

export default Button