import { useEffect, useMemo, useState } from "react";
import { RiMore2Fill } from "react-icons/ri";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

import defaultAvatar from "../../public/assets/default.jpg";
import { formatTimestamp } from "../utils/formatTimestamp";
import SearchModal from "./SearchModal";
import { auth, listenForChats } from "../firebase/firebase";

const ChatList = ({ setSelectedUser }) => {
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Call `listenForChats` and pass `setChats` to update the chat list in real-time
    const unsubscribe = listenForChats(setChats);

    // Set logged user info from Firebase Auth
    if (auth.currentUser) {
      setUser({
        fullName:
          auth.currentUser.displayName || auth.currentUser.email?.split("@")[0],
        username: auth.currentUser.email?.split("@")[0],
        image: auth.currentUser.photoURL || null,
      });
    }

    return () => {
      unsubscribe();
    };
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts

  const sortedChats = useMemo(() => {
    // useMemo is used to optimize performance by memoizing (caching) the sorted chats.
    // This means it only recalculates when `chats` changes instead of sorting on every render.

    return [...chats].sort(
      (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
    );
    // Creates a copy of the `chats` array using the spread operator (`[...]`)
    // Sorts the copied array based on the `lastMessageTimestamp` (most recent first)
    // `b - a` ensures descending order, meaning the newest messages appear first.
  }, [chats]);
  // This memoized value updates only when the `chats` array changes to avoid unnecessary re-sorting.

  // useEffect(() => {
  //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //         if (user) {
  //             const userDocRef = doc(db, "users", user.uid);
  //             const userDocSnap = await getDoc(userDocRef);

  //             if (userDocSnap.exists()) {
  //                 setUser(userDocSnap.data());
  //             } else {
  //                 console.error("User document not found");
  //             }
  //         } else {
  //             setUser(null);
  //         }
  //     });

  //     return () => unsubscribe();
  // }, []);

  const startChat = (user) => {
    setSelectedUser(user);
  };

  return (
    <section className="relative hidden lg:flex flex-col items-start justify-start bg-[#fff] h-[100vh] w-[100%] md:w-[600px] ">
      <header className="flex items-center justify-between w-[100%] border-b border-b-1 p-4 sticky md:static top-0 z-[100]">
        <main className="flex items-center gap-3">
          <img
            className="h-[44px] w-[44px] object-cover rounded-full"
            src={user?.image || defaultAvatar}
          />
          <span>
            <h3 className="p-0 font-semibold text-[#2A3D39] md:text-[17px]">
              {user?.fullName || "Usuário SmoothChat"}
            </h3>
            <p className="p-0 font-light text-[#2A3D39] text-[15px]">
              @{user?.username || "smoothchat"}
            </p>
          </span>
        </main>
        <button className="bg-[#D9F2ED] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg">
          <RiMore2Fill color="#01AA85" className="w-[28px] h-[28px]" />
        </button>
      </header>

      <div className=" w-[100%] mt-[10px] px-5">
        <header className="flex items-center justify-between ">
          <h3 className="text-[16px] ">Messagens ({chats?.length || 0})</h3>
          <SearchModal startChat={startChat} />
        </header>
      </div>

      <main className="flex flex-col items-start gap-6 w-[100%] mt-[1.5rem] pb-3 custom-scrollbar">
        {sortedChats.map((chat) => (
          <a
            key={chat.uid}
            className="item flex items-start justify-between w-[100%] border-b border-b-1 border-red px-5 pb-2"
          >
            {chat?.users
              ?.filter((user) => user.email !== auth.currentUser.email)
              .map((user) => (
                <>
                  <div
                    className="flex items-start gap-3"
                    onClick={() => {
                      startChat(user);
                    }}
                  >
                    <img
                      src={user?.image || defaultAvatar}
                      alt={1}
                      className="h-[40px] w-[40px] rounded-full"
                    />
                    <span>
                      <h2 className="p-0 font-semibold text-[#2A3D39] text-[17px]">
                        {user?.fullName}
                      </h2>
                      <p className="p-0 font-light text-[#2A3D39] text-[14px]">
                        {chat?.lastMessage?.slice(0, 35) || "Sem mensagens ainda"}
                      </p>
                    </span>
                  </div>

                  <p className="p-0 font-regular text-gray-400 text-[11px]">
                    {formatTimestamp(chat?.lastMessageTimestamp, false, "pt-BR")}
                  </p>
                </>
              ))}
          </a>
        ))}
      </main>
    </section>
  );
};

export default ChatList;
//                   <div
//                     className="flex items-start gap-3"
//                     onClick={() => {
//                       startChat(user);
//                     }}
//                   >
//                     <img
//                       src={user?.image || defaultAvatar}
//                       alt={1}
//                       className="h-[40px] w-[40px rounded-full"
//                     />
//                     <span>
//                       <h2 className="p-0 font-semibold text-[#2A3D39] text-[17px]">
//                         {user?.fullName}
//                       </h2>
//                       <p className="p-0 font-light text-[#2A3D39] text-[14px]">
//                         {chat?.lastMessage?.slice(0, 35) || "No messages yet"}
//                       </p>
//                     </span>
//                   </div>

//                   <p className="p-0 font-regular text-gray-400 text-[11px]">
//                     {formatTimestamp(chat?.lastMessageTimestamp)}
//                   </p>
//                 </>
//               ))}
//           </a>
//         ))}
//       </main>
//     </section>
//   );
// };

// export default ChatList;

// import React, { useState, useEffect, useMemo } from "react";
// import { RiMore2Fill } from "react-icons/ri";
// import defaultAvatar from "../../public/assets/default.jpg";
// import { formatTimestamp } from "../utils/formatTimestamp.js";
// import SearchModel from "./SearchModal.jsx";
// import chatData from "../data/chats.js";
// import { auth, listenForChats } from "../firebase/firebase.js";

// const Chatlist = ({ setSelectedUser }) => {
//   const [chats, setChats] = useState([]);
// //const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = listenForChats(setChats);
//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   const sortedChats = useMemo(() => {
//     return [...chats].sort((a, b) => {
//       const aTimestamp =
//         a.lastMessageTimestamp.seconds +
//         a.lastMessageTimestamp.nanoseconds / 1e9;
//       const bTimestamp =
//         b.lastMessageTimestamp.seconds +
//         b.lastMessageTimestamp.nanoseconds / 1e9;
//       return bTimestamp - aTimestamp;
//     });
//   }, [chats]);
// //const sortedChats = useMemo(() => {
// //   return [...chats].sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
// // }, [chats]);

//   const startChat = (user) => {
//     setSelectedUser(user);
//   };

//   return (
//     <section className="relative hidden lg:flex flex-col items-start justify-start bg-white h-[100vh] w-[100%] md:w-[600px]">
//       <header className="flex items-center justify-between w-[100%] lg:border-b border-b-1  border-[#898989b9] p-4 sticky md:static top-0 z-[100]">
//         <main className="flex items-center gap-3">
//           <img
//             src={defaultAvatar}
//           //src = {user?.image || defaultAvatar}

//             className="w-[44px] h-[44px] object-cover rounded-full"
//             alt="Default Avatar"
//           />
//           <span>
//             <h3 className="p-0 font-semibold text-[#2a4d39] md:text-[17px] ">
//               {"Usuário SmoothChat"}
//             </h3>
//             <p className="p-0 font-light text-[#2a4d39] text-[15px]">
//               @{user?.username || "smoothchat"}
//             </p>

//           </span>
//         </main>
//         <button className="bg-[#d9f2ed] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg">
//           <RiMore2Fill color="#01aa85" className="w-[28px] h-[28px]" />
//         </button>
//       </header>

//       <div className="w-[100%] mt-[10px] px-5">
//         <header className="flex items-center justify-between">
//           <h3 className="text-[16px]">Mensagens ({chats?.length || 0})</h3>
//           <SearchModel startChat={startChat} />
//         </header>
//       </div>

//       <main className="flex flex-col items-end mt-[1.5rem] pb-3 w-full">
//         {sortedChats?.map((chat) => (
//           <>
//             <button
//               key={chat?.id}
//               className="flex items-start justify-between w-[100%] border-b border-[#9090902c] px-5 pb-3 pt-3"
//             >
//               {chat?.users
//                 ?.filter((user) => user?.email !== "auth.currentUser.email")
//                 ?.map((user) => (
//                   <>
//                     <div className="flex items-start gap-3">
//                       <img
//                         src={user?.image}
//                         className="h-[40px] w-[40px] rounded-full object-cover"
//                         alt=""
//                       />
//                       <span>
//                         <h2 className="p-0 font-semibold text-[#2a3d39] text-left text-[17px]">
//                           {user?.fullName}
//                         </h2>
//                         <p className="p-0 font-light text-[#2a3d39] text-left text-[14px]">
//                           {chat?.lastMessage}
//                         </p>
//                       </span>
//                     </div>
//                     <p className="p-0 font-regular text-gray-400 text-left text-[11px]">
//                       {formatTimestamp(chat?.lastMessageTimestamp)}
//                     </p>
//                   </>
//                 ))}
//             </button>
//           </>
//         ))}
//       </main>
//     </section>
//   );
// };

// export default Chatlist;
{
  /* <main className="flex flex-col items-start gap-6 w-[100%] mt-[1.5rem] pb-3 custom-scrollbar">
                {sortedChats.map((chat) => (
                    <a key={chat.uid} className="item flex items-start justify-between w-[100%] border-b border-b-1 border-red px-5 pb-2">
                        {chat?.users
                            ?.filter((user) => user.email !== auth.currentUser.email)
                            .map((user) => (
                                <>
                                    <div
                                        className="flex items-start gap-3"
                                        onClick={() => {
                                            startChat(user);
                                        }}
                                    >
                                        <img src={user?.image || defaultAvatar} alt={1} className="h-[40px] w-[40px rounded-full" />
                                        <span>
                                            <h2 className="p-0 font-semibold text-[#2A3D39] text-[17px]">{user?.fullName}</h2>
                                            <p className="p-0 font-light text-[#2A3D39] text-[14px]">{chat?.lastMessage?.slice(0, 35) || "Sem mensagens no momento"}</p>
                                        </span>
                                    </div>

                                    <p className="p-0 font-regular text-gray-400 text-[11px]">{formatTimestamp(chat?.lastMessageTimestamp)}</p>
                                </>
                            ))}
                    </a>
                ))}
            </main>
        </section>
    );
};

export default ChatList; */
}
