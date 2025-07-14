import React, { useEffect, useMemo, useState } from "react";
import { RiMore2Fill, RiCloseLine } from "react-icons/ri";
import img1 from "../../public/assets/user1.png";
import SearchModal from "./SearchModal";
import { auth, listenForChats } from "../firebase/firebase";
import defaultAvatar from "../../public/assets/default.jpg";
import { formatTimestamp } from "../utils/formatTimestamp";

const ModalChatList = ({ setSelectedUser, closeModal }) => {
    const [chats, setChats] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = listenForChats(setChats);
        if (auth.currentUser) {
            setUser({
                fullName: auth.currentUser.displayName || auth.currentUser.email?.split("@")[0],
                username: auth.currentUser.email?.split("@")[0],
                image: auth.currentUser.photoURL || null,
            });
        }
        return () => unsubscribe();
    }, []);

    const sortedChats = useMemo(() => {
        return [...chats].sort(
            (a, b) => {
                const aTime = a.lastMessageTimestamp?.seconds ?? 0;
                const bTime = b.lastMessageTimestamp?.seconds ?? 0;
                return bTime - aTime;
            }
        );
    }, [chats]);

    const startChat = (user) => {
        if (setSelectedUser) setSelectedUser(user);
        if (closeModal) closeModal();
    };

    return (
        <section className="relative modal flex flex-col items-start justify-start bg-[#fff] h-[80vh] w-[100vw] max-w-[400px] rounded-lg shadow-lg">
            <header className="flex items-center justify-between w-[100%] border-b border-b-1 p-4 sticky top-0 z-[70] bg-white">
                <main className="flex items-center gap-3">
                    <img className="h-[44px] w-[44px] object-cover rounded-full" src={user?.image || img1} />
                    <span>
                        <h3 className="p-0 font-semibold text-[#2A3D39] md:text-[17px]">{user?.fullName || "Usuário SmoothChat"}</h3>
                        <p className="p-0 font-light text-[#2A3D39] text-[15px]">@{user?.username || "smoothchat"}</p>
                    </span>
                </main>
                <div className="flex gap-2">
                    <button className="bg-[#D9F2ED] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg">
                        <RiMore2Fill color="#01AA85" className="w-[28px] h-[28px]" />
                    </button>
                    {closeModal && (
                        <button className="bg-[#D9F2ED] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg" onClick={closeModal}>
                            <RiCloseLine color="#01AA85" className="w-[28px] h-[28px]" />
                        </button>
                    )}
                </div>
            </header>

            <div className="w-[100%] mt-[10px] px-5">
                <header className="flex items-center justify-between ">
                    <h3 className="text-[16px] ">Mensagens ({chats?.length || 0})</h3>
                    <SearchModal startChat={startChat} />
                </header>
            </div>

            <main className="flex flex-col items-start gap-6 w-[100%] mt-[1.5rem] pb-3 custom-scrollbar overflow-y-auto" style={{ maxHeight: "calc(80vh - 120px)" }}>
                {sortedChats.map((chat) =>
                    chat?.users
                        ?.filter((u) => u.email !== auth.currentUser.email)
                        .map((u, idx) => (
                            <button
                                key={chat.id + "-" + idx}
                                className="item flex items-start justify-between w-[100%] border-b border-b-1 border-red px-5 pb-2"
                                onClick={() => startChat(u)}
                            >
                                <div className="flex items-start gap-3">
                                    <img src={u?.image || defaultAvatar} alt={u?.fullName} className="h-[40px] w-[40px] rounded-full" />
                                    <span>
                                        <h2 className="p-0 font-semibold text-[#2A3D39] text-[14px]">{u?.fullName}</h2>
                                        <p className="p-0 font-light text-[#2A3D39] text-[12px]">{chat?.lastMessage?.slice(0, 35) || "Sem mensagens ainda"}</p>
                                    </span>
                                </div>
                                <p className="p-0 font-regular text-[#2A3D39] text-[11px]">{formatTimestamp(chat?.lastMessageTimestamp, false, "pt-BR")}</p>
                            </button>
                        ))
                )}
            </main>
        </section>
    );
};

export default ModalChatList;

// import React from "react";

// import { RiMore2Fill } from "react-icons/ri";

// import img1 from "../../public/assets/user1.png";

// import SearchModal from "./SearchModal";

// const ModalChatList = () => {
//     const items = [
//         {
//             id: 10,
//             name: "Destiny Franks",
//             message: "Please text me when you get...",
//             time: "1 Mins Ago",
//             img: img1,
//         },
//         {
//             id: 11,
//             name: "Peter Rock",
//             message: "Pick up my call",
//             time: "2 Mins Ago",
//             img: img1,
//         },
//         {
//             id: 12,
//             name: "Jenny Adga",
//             message: "hey buddy...",
//             time: "3 Mins Ago",
//             img: img1,
//         },
//         {
//             id: 13,
//             name: "Benson Tony",
//             message: "Are you there yet?",
//             time: "5 Mins Ago",
//             img: img1,
//         },
//         {
//             id: 14,
//             name: "Friday Anayo",
//             message: "Good morning babe!",
//             time: "5 Mins Ago",
//             img: img1,
//         },
//         {
//             id: 15,
//             name: "Sam Idaho",
//             message: "Server is DOWN",
//             time: "8 Mins Ago",
//             img: img1,
//         },
//         {
//             id: 16,
//             name: "Issac Dex",
//             message: "Please text me when you get...",
//             time: "10 Hours Ago",
//             img: img1,
//         },
//         {
//             id: 17,
//             name: "Sam Idaho",
//             message: "Server is down",
//             time: "3 Weeks Ago",
//             img: img1,
//         },

//         {
//             id: 18,
//             name: "Destiny Idaho",
//             message: "Server is down",
//             time: "3 Weeks Ago",
//             img: img1,
//         },

//         {
//             id: 19,
//             name: "Gift Idaho",
//             message: "Server is down",
//             time: "3 Weeks Ago",
//             img: img1,
//         },
//     ];

//     return (
//         <section className="relative modal flex flex-col items-start justify-start bg-[#fff] h-[80vh] w-[400px] max-w-300px">
//             <header className="flex items-center justify-between w-[100%] border-b border-b-1 p-4 sticky md:static top-0 z-[70]">
//                 <main className="flex items-center gap-3">
//                     <img className="h-[44px] w-[44px] object-cover " src={img1} />
//                     <span>
//                         <h3 className="p-0 font-semibold text-[#2A3D39] md:text-[17px]">William Hakimah</h3>
//                         <p className="p-0 font-light text-[#2A3D39] text-[15px]">@William</p>
//                     </span>
//                 </main>
//                 <button className="bg-[#D9F2ED] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg">
//                     <RiMore2Fill color="#01AA85" className="w-[28px] h-[28px]" />
//                 </button>
//             </header>

//             <div className=" w-[100%] mt-[10px] px-5">
//                 <header className="flex items-center justify-between ">
//                     <h3 className="text-[16px] ">Messages (3)</h3>
//                     <SearchModal />
//                 </header>
//             </div>

//             <main className="flex flex-col items-start gap-6 w-[100%] mt-[1.5rem] pb-3 custom-scrollbar">
//                 {items.map((item) => (
//                     <section key={item.id} className="item flex items-start justify-between w-[100%] border-b border-b-1 border-red px-5 pb-2">
//                         <div className="flex items-start gap-3">
//                             <img src={item.img} alt={item.name} className="h-[40px] w-[40px rounded-full" />
//                             <span>
//                                 <h2 className="p-0 font-semibold text-[#2A3D39] text-[14px]">{item.name}</h2>
//                                 <p className="p-0 font-light text-[#2A3D39] text-[12px]">{item.message}</p>
//                             </span>
//                         </div>

//                         <p className="p-0 font-regular text-[#2A3D39] text-[11px]">{item.time}</p>
//                     </section>
//                 ))}
//             </main>
//         </section>
//     );
// };

// export default ModalChatList;
//               William Hakimah
//             </h3>
//             <p className="p-0 font-light text-[#2A3D39] text-[15px]">
//               @William
//             </p>
//           </span>
//         </main>
//         <button className="bg-[#D9F2ED] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg">
//           <RiMore2Fill color="#01AA85" className="w-[28px] h-[28px]" />
//         </button>
//       </header>

//       <div className=" w-[100%] mt-[10px] px-5">
//         <header className="flex items-center justify-between ">
//           <h3 className="text-[16px] ">Messagens (3)</h3>
//           <SearchModel />
//         </header>
//       </div>

//       <main className="flex flex-col items-start gap-6 w-[100%] mt-[1.5rem] pb-3 custom-scrollbar">
//         {items.map((item) => (
//           <section
//             key={item.id}
//             className="item flex items-start justify-between w-[100%] border-b border-b-1 border-red px-5 pb-2"
//           >
//             <div className="flex items-start gap-3">
//               <img
//                 src={item.img}
//                 alt={item.name}
//                 className="h-[40px] w-[40px rounded-full"
//               />
//               <span>
//                 <h2 className="p-0 font-semibold text-[#2A3D39] text-[14px]">
//                   {item.name}
//                 </h2>
//                 <p className="p-0 font-light text-[#2A3D39] text-[12px]">
//                   {item.message}
//                 </p>
//               </span>
//             </div>

//             <p className="p-0 font-regular text-[#2A3D39] text-[11px]">
//               {item.time}
//             </p>
//           </section>
//         ))}
//       </main>
//     </section>
//   );
// };

// export default ModelChatList;
