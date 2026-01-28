import { api } from "@/lib/axios";
import { useEffect, useState } from "react"

const Ranking = () => {
    const [users, setUsers] = useState <any> (null);

    useEffect(() => {
        async function getUser () {
            const u = await api.get("/auth/getAll");
            console.log(u);
            setUsers(u.data);
        }

        getUser();
    }, []);

    return (
        <div className="text-white flex justify-center items-center">
            <div>
                <h1 className="text-[2rem] font-bold mb-[30px]">Ranking</h1>
                
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
                                    <td className="">{u.name}</td>
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