import { useApi } from "@/app/hooks/useApi";
import { useDebounce } from "@/app/hooks/useDebounce";
import { api } from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react"
import { boolean } from "zod";

const Ranking = () => {
    const [name, setName] = useState("");
    const [mark, setMark] = useState <boolean[]> ([]);
    const debouncedName = useDebounce(name, 300);

    const {
        data: users,
        setData: setUsers,
        loading,
        request,
    } = useApi<any[]>();

    const [all, setAll] = useState<any[]>([]);

    useEffect(() => {
        async function getAllUsers() {
            const data = await request(async () => {
                const res = await api.get("/auth/getAll");
                return res.data;
            })
            setAll(data);
            setMark(Array(data.length).fill(false));
        }

        getAllUsers();
    }, []);

    useEffect(() => {
        async function search() {
            if (debouncedName === "") {
                setUsers(all);
            } else {
                await request(async () => {
                    const res = await api.get(
                        `/auth/getAllByName/${debouncedName}`
                    );
                    return res.data;
                });
            }
        }

        search();
    }, [debouncedName, all]);

    return (
        <div className="text-white flex justify-center items-center">
            <div>
                <div className="flex justify-between items-center text-white mb-[10px]">
                    <h1 className="text-[2rem] font-bold">Ranking</h1>
                    <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Search..." className="border-1 rounded-lg p-[5px_10px] text-[0.6rem]" />
                </div>
                {loading && <div>Loading...</div>}
                <table>
                    <tr>
                        <td>Rank</td>
                        <td>User Name</td>
                        <td>Score</td>
                    </tr>
                        {!users ? <div className="">Loading...</div> :
                            users.map((u: any, id: number) => (
                                <tr key={id} className="">
                                    <td className="">{id + 1}</td>
                                    <td className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img className="mr-[10px]" src={u.previewURL || `avt.jpg`} width={40} />
                                            <div className="font-bold mr-[200px]">{u.name}</div>
                                        </div>
                                        <button className="cursor-pointer text-white font-bold p-[2px_5px] bg-blue-500 rounded-sm "
                                            style={mark[id] ? {opacity: 0.5} : {opacity: 1}}
                                            // onClick={() => setMark(prev => prev.map((_, i) => i == id))}
                                        >Add Friend</button>
                                    </td>
                                    <td className="">{u.score}</td>
                                </tr>
                            ))
                        }
                </table>

            </div>
        </div>
    )
}

export default Ranking