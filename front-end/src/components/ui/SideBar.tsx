import Link from "next/link"

const Sidebar = () => {
  return (
    <div className="bg-black  h-screen w-[150px] text-white font-bold p-[20px_20px]">
      <ul className="space-y-2">
        <li className="cursor-pointer">Home</li>
        <li className="cursor-pointer"><Link href='/profile'>Profile</Link></li>
        <li className="cursor-pointer">Games</li>
        <li className="cursor-pointer">Mission</li>
      </ul>
    </div>
  )
}

export default Sidebar